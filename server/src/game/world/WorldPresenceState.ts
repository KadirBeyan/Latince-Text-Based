import type { PlayerSave, WorldPresenceSaveState } from "../types/gameTypes";
export function emptyWorldPresence(): WorldPresenceSaveState { return { visitedLocations: {}, discoveredLatinIds: [], seenRumorIds: [], journalEntries: [], npcMoodOverrides: {}, worldFlags: {} }; }
export function getWorldPresence(save: PlayerSave): WorldPresenceSaveState { return save.worldPresence ?? emptyWorldPresence(); }
export function normalizeWorldPresence(state: WorldPresenceSaveState): WorldPresenceSaveState {
  return { ...state, discoveredLatinIds: [...new Set(state.discoveredLatinIds)].slice(-200), seenRumorIds: [...new Set(state.seenRumorIds)].slice(-200), journalEntries: state.journalEntries.slice(-100) };
}
