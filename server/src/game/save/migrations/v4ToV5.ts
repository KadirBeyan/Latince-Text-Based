import type { PlayerSave } from "../../types/gameTypes";

export function v4ToV5(save: Record<string, unknown>): PlayerSave {
  return {
    ...save,
    schemaVersion: 5,
    assessmentProfile: typeof save.assessmentProfile === "object" && save.assessmentProfile !== null ? save.assessmentProfile : undefined,
    assessmentAttempts: Array.isArray(save.assessmentAttempts) ? save.assessmentAttempts : [],
    learningPath: typeof save.learningPath === "object" && save.learningPath !== null ? save.learningPath : undefined,
    achievements: Array.isArray(save.achievements) ? save.achievements : [],
    analyticsSnapshots: Array.isArray(save.analyticsSnapshots) ? save.analyticsSnapshots : []
  } as PlayerSave;
}
