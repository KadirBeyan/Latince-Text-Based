import type { LlmProviderConfig } from "../types/gameTypes";
import { getApiBase } from "./apiBase";

type LlmTestResponse = {
  success?: boolean;
  ok?: boolean;
  message?: string;
  error?: string;
};

export type DiscoveredModel = {
  id: string;
  name: string;
  provider: "ollama" | "lmstudio";
  source: "api" | "filesystem" | "preset";
  path?: string;
  sizeBytes?: number;
  modifiedAt?: string;
};

export type ModelDiscoveryError = { provider: string; message: string };
export type ModelDiscoveryResponse = { models: DiscoveredModel[]; errors: ModelDiscoveryError[] };

export type ModelDiscoverySettings = {
  ollamaBaseUrl: string;
  ollamaModelsPath?: string;
  lmStudioModelsPaths: string[];
};

export async function discoverLocalModels(config: ModelDiscoverySettings): Promise<ModelDiscoveryResponse> {
  const apiBase = await getApiBase();
  const configResponse = await fetch(`${apiBase}/api/llm/model-discovery-config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!configResponse.ok) {
    const data = await configResponse.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || "Model discovery ayarları backend'e gönderilemedi.");
  }

  const response = await fetch(`${apiBase}/api/llm/models?provider=all`);
  const data = await response.json() as ModelDiscoveryResponse & { error?: string };
  if (!response.ok) throw new Error(data.error || "Model taraması başarısız.");
  return data;
}

export async function testLlmConfig(config: LlmProviderConfig): Promise<{ ok: boolean; message: string }> {
  try {
    const apiBase = await getApiBase();
    const response = await fetch(`${apiBase}/api/llm/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    const data = (await response.json()) as LlmTestResponse;
    if (!response.ok || data.success === false || data.ok === false) {
      return { ok: false, message: data.error || data.message || "LLM bağlantısı başarısız." };
    }
    return { ok: true, message: data.message || "LLM bağlantısı başarılı." };
  } catch {
    return { ok: false, message: "Backend'e ulaşılamadı. Server'ın çalıştığından emin ol." };
  }
}
