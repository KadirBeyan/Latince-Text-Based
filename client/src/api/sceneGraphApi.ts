import { getApiBase } from "./apiBase";
import type { SceneGraph, SceneGraphBranchDraftRequest, SceneGraphEditEdgeRequest, SceneGraphIssue } from "../types/sceneGraphTypes";
import type { Scene } from "../types/gameTypes";

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const apiBase = await getApiBase();
  const response = await fetch(`${apiBase}${url}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const text = await response.text();
  const data = text ? JSON.parse(text) as T & { error?: string } : {} as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data as T;
}

export const sceneGraphApi = {
  campaign: (campaignId: string) => json<SceneGraph>(`/api/authoring/graph/campaign/${encodeURIComponent(campaignId)}`),
  chapter: (chapterId: string) => json<SceneGraph>(`/api/authoring/graph/chapter/${encodeURIComponent(chapterId)}`),
  quest: (questId: string) => json<SceneGraph>(`/api/authoring/graph/quest/${encodeURIComponent(questId)}`),
  sceneNeighborhood: (sceneId: string, depth = 2) => json<SceneGraph>(`/api/authoring/graph/scene/${encodeURIComponent(sceneId)}?depth=${depth}`),
  analyzeChapter: (chapterId: string) => json<SceneGraphIssue[]>(`/api/authoring/graph/analyze/chapter/${encodeURIComponent(chapterId)}`),
  analyzeQuest: (questId: string) => json<SceneGraphIssue[]>(`/api/authoring/graph/analyze/quest/${encodeURIComponent(questId)}`),
  snapshotChapter: (chapterId: string) => json<Pick<SceneGraph, "nodes" | "edges" | "stats" | "issues">>(`/api/authoring/graph/chapter/${encodeURIComponent(chapterId)}/snapshot`),
  editEdgeTarget: (body: SceneGraphEditEdgeRequest) => json<{ ok: boolean; graph?: SceneGraph; backupPath?: string; validationErrors?: string[] }>("/api/authoring/graph/edit-edge", { method: "POST", body: JSON.stringify(body) }),
  createScene: (body: { chapterId: string; afterSceneId?: string; sceneDraft: Partial<Scene> }) => json<{ ok: boolean; graph?: SceneGraph; sceneId?: string; backupPath?: string; validationErrors?: string[] }>("/api/authoring/graph/create-scene", { method: "POST", body: JSON.stringify(body) }),
  deleteEdge: (body: Omit<SceneGraphEditEdgeRequest, "newTargetSceneId">) => json<{ ok: boolean; graph?: SceneGraph; backupPath?: string; validationErrors?: string[] }>("/api/authoring/graph/delete-edge", { method: "POST", body: JSON.stringify(body) }),
  branchDraft: (body: SceneGraphBranchDraftRequest) => json<{ sourceSceneId: string; scenes: Partial<Scene>[]; warnings: string[]; autoSaved: false }>("/api/authoring/graph/branch-draft", { method: "POST", body: JSON.stringify(body) }),
  applyBranchDraft: (body: unknown) => json<{ ok: boolean }>("/api/authoring/graph/apply-branch-draft", { method: "POST", body: JSON.stringify(body) }),
};
