import { requestJson } from "./gameApi";
import type { GameState } from "../types/gameTypes";

export function getSideQuestSuggestions(saveId: string): Promise<GameState> {
  return requestJson<GameState>(`/api/game/side-quests/${encodeURIComponent(saveId)}`);
}

export function refreshSideQuestSuggestions(saveId: string): Promise<GameState> {
  return requestJson<GameState>(`/api/game/side-quests/${encodeURIComponent(saveId)}/refresh`, {
    method: "POST",
  });
}

export function acceptSideQuestSuggestion(saveId: string, suggestionId: string): Promise<GameState> {
  return requestJson<GameState>(`/api/game/side-quests/${encodeURIComponent(saveId)}/accept`, {
    method: "POST",
    body: JSON.stringify({ suggestionId }),
  });
}

export function dismissSideQuestSuggestion(saveId: string, suggestionId: string): Promise<GameState> {
  return requestJson<GameState>(`/api/game/side-quests/${encodeURIComponent(saveId)}/dismiss`, {
    method: "POST",
    body: JSON.stringify({ suggestionId }),
  });
}
