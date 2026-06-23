import { requestJson } from "./gameApi";
import type { GameState, GeneratedQuest, LlmProviderConfig } from "../types/gameTypes";

export function listGeneratedQuests(saveId: string): Promise<{ generatedQuests: GeneratedQuest[] }> {
  return requestJson(`/api/game/generated-quests/${encodeURIComponent(saveId)}`);
}

export function getGeneratedQuest(saveId: string, generatedQuestId: string): Promise<GeneratedQuest> {
  return requestJson(`/api/game/generated-quests/${encodeURIComponent(saveId)}/${encodeURIComponent(generatedQuestId)}`);
}

export function generateQuestFromSuggestion(
  saveId: string,
  suggestionId: string,
  llmConfig?: LlmProviderConfig
): Promise<GameState> {
  return requestJson<GameState>(`/api/game/generated-quests/${encodeURIComponent(saveId)}/from-suggestion`, {
    method: "POST",
    body: JSON.stringify({ suggestionId, llmConfig })
  });
}

export function generateReviewQuest(
  saveId: string,
  params: { grammarIds?: string[]; vocabularyIds?: string[]; errorTags?: string[] },
  llmConfig?: LlmProviderConfig
): Promise<GameState> {
  return requestJson<GameState>(`/api/game/generated-quests/${encodeURIComponent(saveId)}/generate-review`, {
    method: "POST",
    body: JSON.stringify({ ...params, llmConfig })
  });
}

export function acceptGeneratedQuest(saveId: string, generatedQuestId: string): Promise<GameState> {
  return requestJson<GameState>(`/api/game/generated-quests/${encodeURIComponent(saveId)}/accept`, {
    method: "POST",
    body: JSON.stringify({ generatedQuestId })
  });
}

export function dismissGeneratedQuest(saveId: string, generatedQuestId: string): Promise<GameState> {
  return requestJson<GameState>(`/api/game/generated-quests/${encodeURIComponent(saveId)}/dismiss`, {
    method: "POST",
    body: JSON.stringify({ generatedQuestId })
  });
}

export function startGeneratedQuest(saveId: string, generatedQuestId: string): Promise<GameState> {
  return requestJson<GameState>(`/api/game/generated-quests/${encodeURIComponent(saveId)}/start`, {
    method: "POST",
    body: JSON.stringify({ generatedQuestId })
  });
}
