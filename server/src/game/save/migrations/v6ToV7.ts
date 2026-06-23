import type { PlayerSave } from "../../types/gameTypes";
export function v6ToV7(save: Record<string, unknown>): PlayerSave { return { ...save, schemaVersion: 7, worldPresence: { visitedLocations: {}, discoveredLatinIds: [], seenRumorIds: [], journalEntries: [], npcMoodOverrides: {}, worldFlags: {} } } as unknown as PlayerSave; }
