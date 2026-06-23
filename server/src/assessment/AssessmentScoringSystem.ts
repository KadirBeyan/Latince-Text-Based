import type { AssessmentAnswer, AssessmentAttempt, AssessmentQuestion, AssessmentResult } from "./AssessmentTypes";
import type { ContentLoader } from "../game/content/ContentLoader";
import { evaluateTextChallenge } from "../latin/LatinEvaluator";
import { latinEquals, latinSimilarity } from "../latin/LatinNormalizer";
import { analyzeLatinErrors, mapDetectedErrorsToTags } from "../latin/LatinErrorAnalyzer";

export async function scoreAnswer(params: { question: AssessmentQuestion; answerText?: string; selectedChoice?: string; contentLoader: ContentLoader }): Promise<AssessmentAnswer> {
  const { question, contentLoader } = params;
  const answerText = params.answerText?.trim();
  const selectedChoice = params.selectedChoice?.trim();
  const expected = question.expectedAnswers ?? [];
  let score = 0; let feedbackTr = "Cevap beklenen biçimle uyuşmadı."; let errorTags: string[] = []; let analysisSummary: string | undefined;
  if (question.type === "multiple-choice") {
    const target = selectedChoice ?? answerText ?? "";
    score = expected.some((candidate) => latinEquals(target, candidate) || target.toLocaleLowerCase("tr-TR") === candidate.toLocaleLowerCase("tr-TR")) ? 100 : 0;
    feedbackTr = score >= 75 ? "Doğru seçim." : "Doğru cevap: " + (expected[0] ?? "-");
  } else if (question.type === "latin-input" || question.type === "translate-to-latin") {
    const result = await evaluateTextChallenge({ playerAnswer: answerText ?? "", expectedAnswers: expected, prompt: question.promptTr, sceneId: question.id, questId: "assessment", playerLevel: levelNumber(question.level), unlockedSkills: question.skillIds, contentLoader });
    score = result.score; feedbackTr = result.feedbackTr; errorTags = result.errorTags; analysisSummary = result.analysisSummary;
  } else if (question.type === "translate-to-turkish") {
    const best = Math.max(0, ...expected.map((candidate) => latinSimilarity(answerText ?? "", candidate)));
    score = Math.round(best * 100); feedbackTr = score >= 75 ? "Anlam doğru görünüyor." : "Beklenen anlam: " + (expected[0] ?? "-"); if (score < 75) errorTags = ["translation-mismatch"];
  } else if (question.type === "parse-word" || question.type === "fill-blank") {
    const target = answerText ?? selectedChoice ?? "";
    const best = Math.max(0, ...expected.map((candidate) => latinEquals(target, candidate) ? 1 : latinSimilarity(target, candidate)));
    score = Math.round(best * 100); feedbackTr = score >= 75 ? "Biçim doğru." : "Beklenen: " + (expected[0] ?? "-"); if (score < 75) errorTags = [question.type === "parse-word" ? "parse-error" : "fill-blank-error"];
  }
  if (score < 75 && (question.type === "latin-input" || question.type === "translate-to-latin")) {
    const detected = analyzeLatinErrors({ playerAnswer: answerText ?? "", expectedAnswers: expected, prompt: question.promptTr, contentLoader });
    errorTags = [...new Set([...errorTags, ...mapDetectedErrorsToTags(detected)])];
  }
  return { questionId: question.id, answerText, selectedChoice, isCorrect: score >= 75, score, feedbackTr, errorTags, answeredAt: new Date().toISOString(), analysisSummary };
}

export function scoreAttempt(attempt: AssessmentAttempt): AssessmentResult {
  const breakdowns = buildBreakdowns(attempt);
  const answered = attempt.answers.length;
  const score = answered ? Math.round(attempt.answers.reduce((sum, answer) => sum + answer.score, 0) / answered) : 0;
  const accuracy = answered ? Math.round((attempt.answers.filter((answer) => answer.isCorrect).length / answered) * 100) : 0;
  const result: AssessmentResult = { score, accuracy, estimatedLevel: "unknown", ...breakdowns, strengths: [], weaknesses: [], recommendations: [] };
  result.estimatedLevel = estimateLevel(result);
  result.strengths = topIds({ ...result.grammarBreakdown, ...result.vocabularyBreakdown, ...result.skillBreakdown }, (value) => value >= 75, false);
  result.weaknesses = topIds({ ...result.grammarBreakdown, ...result.vocabularyBreakdown, ...result.skillBreakdown }, (value) => value < 60, true);
  result.recommendations = result.weaknesses.length ? result.weaknesses.slice(0, 3).map((id) => id + " için kısa tekrar ve 5 soruluk challenge önerilir.") : ["Günlük kısa challenge ile seviyeyi koru."];
  return result;
}
export function estimateLevel(result: AssessmentResult): AssessmentResult["estimatedLevel"] { if (result.accuracy < 35) return "A0"; if (result.accuracy < 60) return "A1"; if (result.accuracy < 78) return "A2"; return Object.values(result.grammarBreakdown).some((score) => score >= 78) ? "B1" : "A2"; }
export function buildBreakdowns(attempt: AssessmentAttempt): Pick<AssessmentResult, "grammarBreakdown" | "vocabularyBreakdown" | "skillBreakdown" | "errorTagCounts"> {
  const grammar = new Map<string, number[]>(); const vocab = new Map<string, number[]>(); const skill = new Map<string, number[]>(); const errors: Record<string, number> = {};
  const answerByQuestion = new Map(attempt.answers.map((answer) => [answer.questionId, answer]));
  for (const question of attempt.questions) { const answer = answerByQuestion.get(question.id); if (!answer) continue; for (const id of question.grammarIds) pushScore(grammar, id, answer.score); for (const id of question.vocabularyIds) pushScore(vocab, id, answer.score); for (const id of question.skillIds) pushScore(skill, id, answer.score); for (const tag of answer.errorTags) errors[tag] = (errors[tag] ?? 0) + 1; }
  return { grammarBreakdown: averageMap(grammar), vocabularyBreakdown: averageMap(vocab), skillBreakdown: averageMap(skill), errorTagCounts: errors };
}
function pushScore(map: Map<string, number[]>, id: string, score: number): void { map.set(id, [...(map.get(id) ?? []), score]); }
function averageMap(map: Map<string, number[]>): Record<string, number> { return Object.fromEntries([...map.entries()].map(([id, values]) => [id, Math.round(values.reduce((a, b) => a + b, 0) / values.length)])); }
function topIds(scores: Record<string, number>, predicate: (value: number) => boolean, asc: boolean): string[] { return Object.entries(scores).filter(([, value]) => predicate(value)).sort((a, b) => asc ? a[1] - b[1] : b[1] - a[1]).map(([id]) => id).slice(0, 5); }
function levelNumber(level: AssessmentQuestion["level"]): number { return ({ A0: 0, A1: 1, A2: 2, B1: 3, B2: 4 } as const)[level]; }

