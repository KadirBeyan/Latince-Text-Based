import { getApiBase } from "./apiBase";
import type { AuthoringBackup, AuthoringContentKind, AuthoringDocument, AuthoringMetrics, AuthoringSaveResult, AuthoringTreeNode, AuthoringValidationResult, ContentOverrideEntry, LlmDraftRequest, LlmDraftResult, PreviewSessionResult, ScenePreviewResult } from "../types/authoringTypes";
import type { GameAction, Scene } from "../types/gameTypes";

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const apiBase = await getApiBase();
  const response = await fetch(`${apiBase}${url}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const text = await response.text();
  const data = text ? JSON.parse(text) as T & { error?: string } : {} as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data as T;
}

export const authoringApi = {
  tree: () => json<AuthoringTreeNode[]>("/api/authoring/tree"),
  documents: (kind?: AuthoringContentKind) => json<AuthoringDocument[]>(`/api/authoring/documents${kind ? `?kind=${encodeURIComponent(kind)}` : ""}`),
  document: (kind: AuthoringContentKind, pathOrId: string) => json<AuthoringDocument>(`/api/authoring/document?kind=${encodeURIComponent(kind)}&pathOrId=${encodeURIComponent(pathOrId)}`),
  saveDocument: (body: { kind: AuthoringContentKind; path: string; data: unknown; validateBeforeSave?: boolean; createBackup?: boolean; allowErrorOverride?: boolean }) => json<AuthoringSaveResult>("/api/authoring/document", { method: "PUT", body: JSON.stringify(body) }),
  deleteDocument: (body: { kind: AuthoringContentKind; path: string; createBackup?: boolean }) => json<{ ok: boolean; backupPath?: string }>("/api/authoring/document", { method: "DELETE", body: JSON.stringify(body) }),
  duplicateDocument: (body: { kind: AuthoringContentKind; sourcePath: string; newId: string }) => json<AuthoringDocument>("/api/authoring/document/duplicate", { method: "POST", body: JSON.stringify(body) }),
  validate: (body: { kind?: AuthoringContentKind; path?: string; data?: unknown }) => json<AuthoringValidationResult>("/api/authoring/validate", { method: "POST", body: JSON.stringify(body) }),
  validateAll: () => json<AuthoringValidationResult>("/api/authoring/validate/all"),
  metrics: () => json<AuthoringMetrics>("/api/authoring/metrics"),
  generateLlmDraft: (body: LlmDraftRequest) => json<LlmDraftResult>("/api/authoring/llm-draft", { method: "POST", body: JSON.stringify(body) }),
  previewScene: (scene: Scene, saveId?: string) => json<ScenePreviewResult>("/api/authoring/preview/scene", { method: "POST", body: JSON.stringify({ scene, saveId }) }),
  suggestLearningFocus: (body: { text: string; expectedAnswers?: string[]; chapterId?: string }) => json<{ grammarIds: string[]; vocabularyIds: string[]; skillIds: string[]; confidence: number; warnings: string[] }>("/api/authoring/suggest-learning-focus", { method: "POST", body: JSON.stringify(body) }),
  previewSessionFromScene: (body: { sceneId: string; saveId?: string; useLlm?: boolean; llmConfig?: unknown }) => json<PreviewSessionResult>("/api/authoring/preview/session/scene", { method: "POST", body: JSON.stringify(body) }),
  previewSessionFromQuest: (body: { questId: string; saveId?: string; useLlm?: boolean; llmConfig?: unknown }) => json<PreviewSessionResult>("/api/authoring/preview/session/quest", { method: "POST", body: JSON.stringify(body) }),
  previewSessionFromDraftScene: (body: { sceneDraft: Scene; useLlm?: boolean; llmConfig?: unknown }) => json<PreviewSessionResult>("/api/authoring/preview/session/draft-scene", { method: "POST", body: JSON.stringify(body) }),
  previewSession: (previewId: string) => json<PreviewSessionResult>(`/api/authoring/preview/session/${encodeURIComponent(previewId)}`),
  previewAction: (previewId: string, action: GameAction) => json<PreviewSessionResult>(`/api/authoring/preview/session/${encodeURIComponent(previewId)}/action`, { method: "POST", body: JSON.stringify({ action }) }),
  previewReset: (previewId: string) => json<PreviewSessionResult>(`/api/authoring/preview/session/${encodeURIComponent(previewId)}/reset`, { method: "POST" }),
  previewDiscard: (previewId: string) => json<{ ok: boolean }>(`/api/authoring/preview/session/${encodeURIComponent(previewId)}`, { method: "DELETE" }),
  playtestStart: (sceneId: string) => json<{ previewId: string; scene: Scene; mode: "preview" }>("/api/authoring/playtest/start", { method: "POST", body: JSON.stringify({ sceneId }) }),
  overrides: () => json<ContentOverrideEntry[]>("/api/authoring/overrides"),
  exportOverrides: () => json<{ exportedAt: string; overrides: Array<{ relativePath: string; data: unknown }> }>("/api/authoring/overrides/export"),
  importOverrides: (body: { overrides: Array<{ relativePath: string; data: unknown }> }) => json<{ ok: boolean; count: number }>("/api/authoring/overrides/import", { method: "POST", body: JSON.stringify(body) }),
  resetOverride: (relativePath: string) => json<{ ok: boolean; path: string }>("/api/authoring/overrides/reset", { method: "POST", body: JSON.stringify({ relativePath }) }),
  backups: () => json<AuthoringBackup[]>("/api/authoring/backups"),
  restoreBackup: (backupPath: string, targetPath: string) => json<{ ok: boolean; restoredPath: string }>("/api/authoring/backups/restore", { method: "POST", body: JSON.stringify({ backupPath, targetPath }) }),
};
