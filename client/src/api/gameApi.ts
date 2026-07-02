import type { GameAction, GameState, HintResult, LlmProviderConfig, NarrationResult, SaveSummary, SessionSummary } from "../types/gameTypes";
import type { CharacterCreationPayload } from "../types/characterTypes";
import { getApiBase } from "./apiBase";

type ErrorPayload = {
  error?: unknown;
  message?: unknown;
};

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    const apiBase = await getApiBase();
    response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Backend'e ulaşılamadı. Server'ın çalıştığından emin ol.");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Backend ${response.status} döndü ve yanıt okunamadı.`);
    }
    throw new Error("Backend yanıtı JSON olarak okunamadı.");
  }

  if (!response.ok) {
    const payload = data as ErrorPayload;
    const message = typeof payload.error === "string" ? payload.error : typeof payload.message === "string" ? payload.message : `Backend ${response.status} hatası.`;
    throw new Error(message);
  }

  const payload = data as ErrorPayload;
  if (typeof payload.error === "string") {
    throw new Error(payload.error);
  }

  return data as T;
}

export function listSaves(): Promise<SaveSummary[]> {
  return requestJson<SaveSummary[]>("/api/game/saves");
}

export function deleteSave(saveId: string): Promise<{ saves: SaveSummary[] }> {
  return requestJson<{ saves: SaveSummary[] }>(`/api/game/saves/${encodeURIComponent(saveId)}`, { method: "DELETE" });
}

export function createNewGame(playerName: string, campaignId = "vicus_first_days"): Promise<GameState> {
  return requestJson<GameState>("/api/game/new", {
    method: "POST",
    body: JSON.stringify({ playerName, campaignId }),
  });
}

export function createCharacterSave(payload: CharacterCreationPayload): Promise<GameState> {
  return requestJson<GameState>("/api/game/create-character-save", {
    method: "POST",
    body: JSON.stringify({ ...payload, campaignId: payload.campaignId ?? "vicus_first_days" }),
  });
}

export function getGameState(saveId: string): Promise<GameState> {
  return requestJson<GameState>(`/api/game/state/${encodeURIComponent(saveId)}`);
}

export function submitGameAction(params: { saveId: string; action: GameAction; llmConfig?: LlmProviderConfig }): Promise<GameState> {
  return requestJson<GameState>("/api/game/action", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function requestNarration(params: { saveId: string; llmConfig?: LlmProviderConfig }): Promise<NarrationResult> {
  return requestJson<NarrationResult>("/api/game/narration", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function requestHint(params: { saveId: string; llmConfig?: LlmProviderConfig }): Promise<HintResult> {
  return requestJson<HintResult>("/api/game/hint", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function resetGame(saveId: string): Promise<GameState> {
  return requestJson<GameState>("/api/game/reset", {
    method: "POST",
    body: JSON.stringify({ saveId }),
  });
}

export function getSessionSummary(saveId: string): Promise<SessionSummary> {
  return requestJson<SessionSummary>(`/api/game/session-summary/${encodeURIComponent(saveId)}`);
}
