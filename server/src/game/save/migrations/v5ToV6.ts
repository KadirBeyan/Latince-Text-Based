import type { PlayerSave } from "../../types/gameTypes";
import { EMPTY_RPG_SKILLS } from "../../character/CharacterTypes";

export function v5ToV6(save: Record<string, unknown>): PlayerSave {
  const profile = save.characterProfile as any;
  let updatedProfile = profile;
  if (profile && typeof profile === "object") {
    updatedProfile = {
      ...profile,
      skillProgress: profile.skillProgress && typeof profile.skillProgress === "object"
        ? profile.skillProgress
        : { ...EMPTY_RPG_SKILLS }
    };
  }

  const defaultVillageLife = {
    dayState: {
      dayNumber: 1,
      timeOfDay: "mane" as const,
      actionsUsedThisPeriod: 0,
      maxActionsPerPeriod: 3,
      completedDailyActivityIds: [],
      availableActivityIds: [],
      dayFlags: {}
    },
    routineHistory: []
  };

  return {
    ...save,
    schemaVersion: 6,
    characterProfile: updatedProfile,
    villageLife: typeof save.villageLife === "object" && save.villageLife !== null
      ? save.villageLife
      : defaultVillageLife
  } as PlayerSave;
}
