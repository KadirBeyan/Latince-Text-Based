import type { PlayerSave } from "../../types/gameTypes";

export function v3ToV4(save: Record<string, unknown>): PlayerSave {
  return {
    ...save,
    schemaVersion: 4,
    generatedQuests: Array.isArray(save.generatedQuests) ? save.generatedQuests : [],
  } as PlayerSave;
}
