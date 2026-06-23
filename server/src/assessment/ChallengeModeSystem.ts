import { randomUUID } from "node:crypto";
import type { ContentLoader } from "../game/content/ContentLoader";
import type { AssessmentAnswer, AssessmentAttempt, AssessmentResult } from "./AssessmentTypes";
import type { PlayerSave, RewardBundle } from "../game/types/gameTypes";
import { buildChallengeQuestionSet } from "./AssessmentQuestionBank";
import { scoreAnswer, scoreAttempt } from "./AssessmentScoringSystem";
import { emitAssessmentEvent, replaceAttempt, requireAttempt } from "./AssessmentSaveUtils";
import { EffectRunner } from "../game/core/EffectRunner";
import { EventBus } from "../game/core/EventBus";

export type ChallengeType = "grammar" | "vocabulary" | "mixed" | "review" | "quick";
export function startChallenge(params: { save: PlayerSave; type: ChallengeType; grammarIds?: string[]; vocabularyIds?: string[]; questionCount?: number }): { save: PlayerSave; attempt: AssessmentAttempt } {
  const attempt: AssessmentAttempt = { id: randomUUID(), type: params.type === "quick" ? "quick-check" : "challenge", title: challengeTitle(params.type), startedAt: new Date().toISOString(), status: "in-progress", questions: buildChallengeQuestionSet({ grammarIds: params.grammarIds, vocabularyIds: params.vocabularyIds, questionCount: params.questionCount ?? (params.type === "quick" ? 5 : 8) }), answers: [] };
  const save = emitAssessmentEvent({ ...params.save, assessmentAttempts: [...params.save.assessmentAttempts, attempt] }, "CHALLENGE_STARTED", { attemptId: attempt.id, challengeType: params.type });
  return { save, attempt };
}
export async function submitChallengeAnswer(params: { save: PlayerSave; attemptId: string; questionId: string; answerText?: string; selectedChoice?: string; contentLoader: ContentLoader }): Promise<{ save: PlayerSave; answer: AssessmentAnswer; attempt: AssessmentAttempt }> {
  const attempt = requireAttempt(params.save, params.attemptId); if (attempt.status !== "in-progress") throw new Error("Completed attempt cannot be answered.");
  const question = attempt.questions.find((item) => item.id === params.questionId); if (!question) throw new Error("Question not found in attempt.");
  const answer = await scoreAnswer({ question, answerText: params.answerText, selectedChoice: params.selectedChoice, contentLoader: params.contentLoader });
  const nextAttempt = { ...attempt, answers: [...attempt.answers.filter((item) => item.questionId !== answer.questionId), answer] };
  const save = emitAssessmentEvent(replaceAttempt(params.save, nextAttempt), "CHALLENGE_ANSWERED", { attemptId: attempt.id, questionId: question.id, isCorrect: answer.isCorrect, score: answer.score });
  return { save, answer, attempt: nextAttempt };
}
export function completeChallenge(params: { save: PlayerSave; attemptId: string; contentLoader: ContentLoader }): { save: PlayerSave; result: AssessmentResult } {
  const attempt = requireAttempt(params.save, params.attemptId); if (attempt.status !== "in-progress") throw new Error("Attempt is already completed.");
  const result = scoreAttempt(attempt); const completed: AssessmentAttempt = { ...attempt, status: "completed", completedAt: new Date().toISOString(), result };
  let save = replaceAttempt(params.save, completed);
  const reward: RewardBundle = { xp: attempt.type === "quick-check" ? 10 : 20, currency: result.accuracy >= 90 ? 5 : 0 };
  save = new EffectRunner(params.contentLoader, new EventBus()).applyEffects(save, [{ type: "APPLY_REWARD_BUNDLE", reward }], { campaignId: save.currentCampaignId, chapterId: save.currentChapterId, questId: save.currentQuestId, sceneId: save.currentSceneId });
  save = emitAssessmentEvent(save, "CHALLENGE_COMPLETED", { attemptId: attempt.id, result, reward });
  return { save, result };
}
function challengeTitle(type: ChallengeType): string { return ({ grammar: "Grammar Challenge", vocabulary: "Vocabulary Challenge", mixed: "Mixed Challenge", review: "Review Challenge", quick: "Quick Challenge" })[type]; }

