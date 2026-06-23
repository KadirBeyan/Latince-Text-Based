import { randomUUID } from "node:crypto";
import type { ContentLoader } from "../game/content/ContentLoader";
import type { LearningPath, LearningPathStep } from "./AssessmentTypes";
import type { PlayerSave } from "../game/types/gameTypes";
import { getWeaknessReport } from "./DiagnosticSystem";
import { emitAssessmentEvent } from "./AssessmentSaveUtils";

export function generateLearningPath(params: { save: PlayerSave; contentLoader: ContentLoader }): LearningPath {
  const report = getWeaknessReport(params.save); const previous = params.save.learningPath?.steps ?? []; const blocked = new Set(previous.filter((step) => step.status === "completed" || step.status === "dismissed").map((step) => step.targetId ?? step.id));
  const steps: LearningPathStep[] = [];
  for (const id of report.weakGrammarIds) if (!blocked.has(id) && !steps.some((step) => step.grammarIds.includes(id))) steps.push({ id: randomUUID(), type: "challenge", title: id + " challenge", reasonTr: "Bu gramer başlığında başarı düşük görünüyor.", priority: 95 - steps.length * 5, grammarIds: [id], vocabularyIds: [], skillIds: ["latin_basics"], status: "pending", targetId: id });
  for (const id of report.weakVocabularyIds) if (!blocked.has(id) && steps.length < 5) steps.push({ id: randomUUID(), type: "exercise", title: id + " alıştırması", reasonTr: "Kelime kullanımında tekrar faydalı olur.", priority: 80 - steps.length * 5, grammarIds: [], vocabularyIds: [id], skillIds: ["latin_basics"], status: "pending", targetId: id });
  if (steps.length < 5) steps.push({ id: randomUUID(), type: "review", title: "Günlük hızlı tekrar", reasonTr: "Kısa tekrar öğrenme ritmini korur.", priority: 60, grammarIds: [], vocabularyIds: [], skillIds: ["latin_basics"], status: "pending" });
  const now = new Date().toISOString(); return { id: params.save.learningPath?.id ?? randomUUID(), createdAt: params.save.learningPath?.createdAt ?? now, updatedAt: now, title: "Via Discendi", summaryTr: steps.length ? "Zayıf başlıklara göre kişisel öğrenme rotası hazırlandı." : "Şu an belirgin zayıf başlık yok; kısa tekrar önerilir.", steps: steps.slice(0, 5) };
}
export function refreshLearningPath(params: { save: PlayerSave; contentLoader: ContentLoader }): PlayerSave { const learningPath = generateLearningPath(params); return emitAssessmentEvent({ ...params.save, learningPath }, "LEARNING_PATH_UPDATED", { stepCount: learningPath.steps.length }); }
export function completeLearningPathStep(params: { save: PlayerSave; stepId: string }): PlayerSave { return updateStep(params.save, params.stepId, "completed"); }
export function dismissLearningPathStep(params: { save: PlayerSave; stepId: string }): PlayerSave { return updateStep(params.save, params.stepId, "dismissed"); }
function updateStep(save: PlayerSave, stepId: string, status: LearningPathStep["status"]): PlayerSave { if (!save.learningPath) return save; return { ...save, learningPath: { ...save.learningPath, updatedAt: new Date().toISOString(), steps: save.learningPath.steps.map((step) => step.id === stepId ? { ...step, status } : step) } }; }

