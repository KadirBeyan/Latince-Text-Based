import type { Campaign, GrammarTopic, LlmProviderConfig, Scene, ValidationResult, VocabularyItem } from "../types/gameTypes";
import { getApiBase } from "./apiBase";

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const apiBase = await getApiBase();
  const response = await fetch(`${apiBase}${url}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data;
}
export const editorApi = {
  listCampaigns: () => json<Array<Pick<Campaign, "id" | "title" | "description">>>("/api/editor/campaigns"),
  getCampaign: (id: string) => json<Campaign>(`/api/editor/campaigns/${encodeURIComponent(id)}`),
  saveCampaign: (campaign: Campaign) => json<{ campaign: Campaign; validation: ValidationResult }>(`/api/editor/campaigns/${encodeURIComponent(campaign.id)}`, { method: "PUT", body: JSON.stringify(campaign) }),
  validate: (campaign: Campaign) => json<ValidationResult>("/api/editor/validate-draft", { method: "POST", body: JSON.stringify(campaign) }),
  grammar: () => json<GrammarTopic[]>("/api/content/latin/grammar"),
  vocabulary: () => json<VocabularyItem[]>("/api/content/latin/vocabulary"),
  generateDraft: (body: { grammarIds: string[]; vocabularyIds: string[]; locationId: string; npcIds: string[]; difficulty: "intro" | "practice" | "review" | "challenge"; count: number; llmConfig: LlmProviderConfig }) => json<{ drafts: Scene[]; parseError?: string; validation: ValidationResult }>("/api/editor/generate-scene-draft", { method: "POST", body: JSON.stringify(body) })
};
