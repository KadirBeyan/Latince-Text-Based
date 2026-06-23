import type { PlayerSave } from "../../types/gameTypes";

export function v2ToV3(save: Record<string, unknown>): PlayerSave {
  return {
    ...save,
    schemaVersion: 3,
    npcMemories: Array.isArray(save.npcMemories) ? save.npcMemories : [],
    locationStates: Array.isArray(save.locationStates) ? save.locationStates : [],
    worldEvents: Array.isArray(save.worldEvents) ? save.worldEvents : [],
    activeSideQuestSuggestions: Array.isArray(save.activeSideQuestSuggestions) ? save.activeSideQuestSuggestions : [],
    narrativeFlags: typeof save.narrativeFlags === "object" && save.narrativeFlags ? save.narrativeFlags : {},
  } as PlayerSave;
}
