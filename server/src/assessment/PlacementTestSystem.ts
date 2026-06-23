import { randomUUID } from "node:crypto";
import type { ContentLoader } from "../game/content/ContentLoader";
import type { AssessmentAnswer, AssessmentAttempt, AssessmentResult } from "./AssessmentTypes";
import type { PlayerSave, MasteryState } from "../game/types/gameTypes";
import { buildPlacementQuestionSet } from "./AssessmentQuestionBank";
import { scoreAnswer, scoreAttempt } from "./AssessmentScoringSystem";
import { emitAssessmentEvent, replaceAttempt, requireAttempt } from "./AssessmentSaveUtils";

export function startPlacementTest(params: { save: PlayerSave; questionCount?: number }): { save: PlayerSave; attempt: AssessmentAttempt } {
  const active = params.save.assessmentAttempts.find((attempt) => attempt.type === "placement" && attempt.status === "in-progress");
  if (active) return { save: params.save, attempt: active };
  const attempt: AssessmentAttempt = { id: randomUUID(), type: "placement", title: "Yerleştirme Testi", startedAt: new Date().toISOString(), status: "in-progress", questions: buildPlacementQuestionSet(params.questionCount ?? 12), answers: [] };
  const save = emitAssessmentEvent({ ...params.save, assessmentAttempts: [...params.save.assessmentAttempts, attempt] }, "PLACEMENT_STARTED", { attemptId: attempt.id });
  return { save, attempt };
}
export async function submitPlacementAnswer(params: { save: PlayerSave; attemptId: string; questionId: string; answerText?: string; selectedChoice?: string; contentLoader: ContentLoader }): Promise<{ save: PlayerSave; answer: AssessmentAnswer; attempt: AssessmentAttempt }> {
  const attempt = requireAttempt(params.save, params.attemptId);
  if (attempt.status !== "in-progress") throw new Error("Completed attempt cannot be answered.");
  const question = attempt.questions.find((item) => item.id === params.questionId); if (!question) throw new Error("Question not found in attempt.");
  const answer = await scoreAnswer({ question, answerText: params.answerText, selectedChoice: params.selectedChoice, contentLoader: params.contentLoader });
  const nextAttempt = { ...attempt, answers: [...attempt.answers.filter((item) => item.questionId !== answer.questionId), answer] };
  const save = emitAssessmentEvent(replaceAttempt(params.save, nextAttempt), "PLACEMENT_ANSWERED", { attemptId: attempt.id, questionId: question.id, isCorrect: answer.isCorrect, score: answer.score });
  return { save, answer, attempt: nextAttempt };
}
export function completePlacementTest(params: { save: PlayerSave; attemptId: string }): { save: PlayerSave; result: AssessmentResult } {
  const attempt = requireAttempt(params.save, params.attemptId); if (attempt.status !== "in-progress") throw new Error("Attempt is already completed.");
  const result = scoreAttempt(attempt);
  const completed: AssessmentAttempt = { ...attempt, status: "completed", completedAt: new Date().toISOString(), result };
  let save = replaceAttempt(params.save, completed);
  save = applyPlacementResultToProfile({ save, result });
  save = seedMastery(save, result);
  save = emitAssessmentEvent(save, "PLACEMENT_COMPLETED", { attemptId: attempt.id, result });
  return { save, result };
}
export function applyPlacementResultToProfile(params: { save: PlayerSave; result: AssessmentResult }): PlayerSave {
  const result = params.result;
  const save = { ...params.save, assessmentProfile: { estimatedLevel: result.estimatedLevel, confidence: Math.min(1, Math.max(0.35, result.accuracy / 100)), strengths: result.strengths, weaknesses: result.weaknesses, grammarScores: result.grammarBreakdown, vocabularyScores: result.vocabularyBreakdown, skillScores: result.skillBreakdown, lastUpdatedAt: new Date().toISOString(), placementCompleted: true } };
  return emitAssessmentEvent(save, "ASSESSMENT_PROFILE_UPDATED", { estimatedLevel: result.estimatedLevel });
}
function seedMastery(save: PlayerSave, result: AssessmentResult): PlayerSave {
  const states = [...save.masteryStates];
  for (const [targetId, score] of Object.entries(result.grammarBreakdown)) {
    const existing = states.find((state) => state.targetId === targetId && state.targetType === "grammar");
    const seeded = score >= 75 ? 60 : score < 50 ? 20 : 40;
    if ((existing?.mastery ?? 0) >= seeded) continue;
    const next: MasteryState = { targetId, targetType: "grammar", seenCount: existing?.seenCount ?? 1, correctCount: existing?.correctCount ?? 0, wrongCount: existing?.wrongCount ?? 0, mastery: seeded, lastSeenAt: new Date().toISOString() };
    const index = states.findIndex((state) => state.targetId === targetId && state.targetType === "grammar");
    if (index >= 0) states[index] = next; else states.push(next);
  }
  return { ...save, masteryStates: states };
}

