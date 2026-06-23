import fs from "node:fs";
import path from "node:path";
import type { AchievementState } from "./AssessmentTypes";
import type { PlayerSave } from "../game/types/gameTypes";
import { emitAssessmentEvent } from "./AssessmentSaveUtils";

function definitions(): AchievementState[] { return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "data", "assessment", "achievements.json"), "utf8")) as AchievementState[]; }
export function getAchievements(save: PlayerSave): AchievementState[] { const current = new Map(save.achievements.map((item) => [item.id, item])); return definitions().map((definition) => ({ ...definition, ...(current.get(definition.id) ?? {}) })); }
export function unlockAchievement(save: PlayerSave, achievementId: string): PlayerSave { const all = getAchievements(save); const target = all.find((item) => item.id === achievementId); if (!target || target.unlocked) return { ...save, achievements: all }; const updated = all.map((item) => item.id === achievementId ? { ...item, unlocked: true, unlockedAt: new Date().toISOString(), progress: item.maxProgress, maxProgress: item.maxProgress } : item); return emitAssessmentEvent({ ...save, achievements: updated }, "ACHIEVEMENT_UNLOCKED", { achievementId }); }
export function evaluateAchievements(save: PlayerSave): PlayerSave { let next = { ...save, achievements: getAchievements(save) }; if (next.eventLog.some((event) => event.type === "TEXT_EVALUATED")) next = unlockAchievement(next, "prima-vox"); if (next.assessmentProfile?.placementCompleted) next = unlockAchievement(next, "discipulus"); if (next.streak.current >= 7) next = unlockAchievement(next, "memoria-fortis"); if (next.generatedQuests.some((quest) => quest.status === "completed")) next = unlockAchievement(next, "quaestor"); if (next.masteryStates.some((state) => state.targetId === "accusative-basic" && state.mastery >= 80)) next = unlockAchievement(next, "accusativus-victor"); const grammarChallengeCount = next.assessmentAttempts.filter((attempt) => attempt.type === "challenge" && attempt.status === "completed").length; if (grammarChallengeCount >= 5) next = unlockAchievement(next, "grammaticus-i"); return next; }

