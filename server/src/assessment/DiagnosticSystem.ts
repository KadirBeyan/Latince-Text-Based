import type { AssessmentProfile } from "./AssessmentTypes";
import type { PlayerSave } from "../game/types/gameTypes";

export function buildDiagnosticProfile(save: PlayerSave): AssessmentProfile {
  const grammarScores = getGrammarDiagnostic(save); const vocabularyScores = getVocabularyDiagnostic(save); const skillScores = getSkillDiagnostic(save); const report = getWeaknessReport(save);
  const strengths = Object.entries({ ...grammarScores, ...vocabularyScores, ...skillScores }).filter(([, value]) => value >= 75).map(([id]) => id).slice(0, 5);
  return { estimatedLevel: save.assessmentProfile?.estimatedLevel ?? "unknown", confidence: save.assessmentProfile?.confidence ?? 0.35, strengths, weaknesses: [...report.weakGrammarIds, ...report.weakVocabularyIds, ...report.weakSkillIds].slice(0, 6), grammarScores, vocabularyScores, skillScores, lastUpdatedAt: new Date().toISOString(), placementCompleted: save.assessmentProfile?.placementCompleted ?? false };
}
export function updateAssessmentProfileFromEvents(save: PlayerSave): PlayerSave { return { ...save, assessmentProfile: buildDiagnosticProfile(save) }; }
export function getGrammarDiagnostic(save: PlayerSave): Record<string, number> { return scoresFor(save, "grammar"); }
export function getVocabularyDiagnostic(save: PlayerSave): Record<string, number> { return scoresFor(save, "vocabulary"); }
export function getSkillDiagnostic(save: PlayerSave): Record<string, number> { return scoresFor(save, "skill"); }
export function getWeaknessReport(save: PlayerSave): { weakGrammarIds: string[]; weakVocabularyIds: string[]; weakSkillIds: string[]; errorTagCounts: Record<string, number>; recommendations: string[] } {
  const errorTagCounts: Record<string, number> = {};
  for (const item of save.errorMemory ?? []) errorTagCounts[item.tag] = (errorTagCounts[item.tag] ?? 0) + item.count;
  for (const attempt of save.assessmentAttempts) for (const answer of attempt.answers) for (const tag of answer.errorTags) errorTagCounts[tag] = (errorTagCounts[tag] ?? 0) + 1;
  const weakGrammarIds = weakIds(getGrammarDiagnostic(save)); const weakVocabularyIds = weakIds(getVocabularyDiagnostic(save)); const weakSkillIds = weakIds(getSkillDiagnostic(save));
  return { weakGrammarIds, weakVocabularyIds, weakSkillIds, errorTagCounts, recommendations: [...weakGrammarIds, ...weakVocabularyIds].slice(0, 4).map((id) => id + " için tekrar rotasına eklenmeli.") };
}
function scoresFor(save: PlayerSave, targetType: "grammar" | "vocabulary" | "skill"): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const mastery of save.masteryStates.filter((item) => item.targetType === targetType)) scores[mastery.targetId] = mastery.mastery;
  for (const attempt of save.assessmentAttempts) if (attempt.result) { const source = targetType === "grammar" ? attempt.result.grammarBreakdown : targetType === "vocabulary" ? attempt.result.vocabularyBreakdown : attempt.result.skillBreakdown; for (const [id, value] of Object.entries(source)) scores[id] = Math.round(((scores[id] ?? value) + value) / 2); }
  return scores;
}
function weakIds(scores: Record<string, number>): string[] { return Object.entries(scores).filter(([, score]) => score < 55).sort((a, b) => a[1] - b[1]).map(([id]) => id).slice(0, 5); }

