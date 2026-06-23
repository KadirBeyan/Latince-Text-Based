import { promises as fs } from "node:fs";
import path from "node:path";

export type DiscoveredModel = {
  id: string;
  name: string;
  provider: "ollama" | "lmstudio";
  source: "api" | "filesystem" | "preset";
  path?: string;
  sizeBytes?: number;
  modifiedAt?: string;
};

export type ModelDiscoveryConfig = {
  ollamaBaseUrl: string;
  ollamaModelsPath?: string;
  lmStudioModelsPaths: string[];
};

export type ModelDiscoveryError = { provider: string; message: string };
export type ModelDiscoveryResult = { models: DiscoveredModel[]; errors: ModelDiscoveryError[] };

type RawDiscoveredModel = {
  name?: unknown; model?: unknown; provider?: unknown; source?: unknown; path?: unknown;
  size?: unknown; sizeBytes?: unknown; modified_at?: unknown; modifiedAt?: unknown;
};

const PRESET_OLLAMA_MODELS: DiscoveredModel[] = [
  { id: "ollama:gemma4:31b-cloud", name: "gemma4:31b-cloud", provider: "ollama", source: "preset" },
];

const MODEL_EXTENSIONS = new Set([".gguf", ".bin", ".safetensors"]);
const MAX_SCAN_DEPTH = 6;
const MAX_SCANNED_ENTRIES = 5_000;
const MAX_DISCOVERED_MODELS = 500;
const SCAN_TIMEOUT_MS = 5_000;
const API_TIMEOUT_MS = 3_000;

export async function scanModelDirectory(directoryPath: string): Promise<RawDiscoveredModel[]> {
  const root = path.resolve(directoryPath);
  const startedAt = Date.now();
  const discovered: RawDiscoveredModel[] = [];
  let scannedEntries = 0;

  const visit = async (currentPath: string, depth: number): Promise<void> => {
    if (depth > MAX_SCAN_DEPTH || discovered.length >= MAX_DISCOVERED_MODELS) return;
    if (Date.now() - startedAt > SCAN_TIMEOUT_MS) throw new Error(`Model directory scan timed out after ${SCAN_TIMEOUT_MS}ms: ${root}`);
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      scannedEntries += 1;
      if (scannedEntries > MAX_SCANNED_ENTRIES) throw new Error(`Model directory scan exceeded ${MAX_SCANNED_ENTRIES} entries: ${root}`);
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath, depth + 1);
      } else if (entry.isFile() && MODEL_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        const stat = await fs.stat(entryPath);
        discovered.push({ name: modelNameFromPath(root, entryPath), path: entryPath, sizeBytes: stat.size, modifiedAt: stat.mtime.toISOString(), source: "filesystem" });
      }
      if (discovered.length >= MAX_DISCOVERED_MODELS) return;
    }
  };
  await visit(root, 0);
  return discovered;
}

export function normalizeDiscoveredModel(raw: RawDiscoveredModel): DiscoveredModel {
  const provider = raw.provider === "lmstudio" ? "lmstudio" : "ollama";
  const source = raw.source === "filesystem" || raw.source === "preset" ? raw.source : "api";
  const name = (stringValue(raw.name) || stringValue(raw.model) || "unknown-model").trim();
  const modelPath = stringValue(raw.path);
  const size = numberValue(raw.sizeBytes) ?? numberValue(raw.size);
  const modifiedAt = stringValue(raw.modifiedAt) || stringValue(raw.modified_at);
  return {
    id: `${provider}:${name.toLowerCase()}`, name, provider, source,
    ...(modelPath ? { path: modelPath } : {}),
    ...(size !== undefined ? { sizeBytes: size } : {}),
    ...(modifiedAt ? { modifiedAt } : {}),
  };
}

export async function discoverOllamaModels(config: ModelDiscoveryConfig): Promise<ModelDiscoveryResult> {
  const errors: ModelDiscoveryError[] = [];
  const apiUrl = `${config.ollamaBaseUrl.replace(/\/v1\/?$/, "").replace(/\/$/, "")}/api/tags`;
  try {
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });
    if (!response.ok) throw new Error(`Ollama API returned HTTP ${response.status}.`);
    const payload = await response.json() as { models?: RawDiscoveredModel[] };
    if (!Array.isArray(payload.models)) throw new Error("Ollama API response does not contain a models array.");
    return { models: withPresetOllamaModels(payload.models.map((raw) => normalizeDiscoveredModel({ ...raw, provider: "ollama", source: "api" }))), errors };
  } catch (error) {
    errors.push({ provider: "ollama", message: `Ollama API discovery failed: ${errorMessage(error)}` });
  }
  if (!config.ollamaModelsPath) {
    errors.push({ provider: "ollama", message: "Ollama models path is not configured." });
    return { models: [], errors };
  }
  try {
    const rawModels = await scanModelDirectory(config.ollamaModelsPath);
    return { models: withPresetOllamaModels(rawModels.map((raw) => normalizeDiscoveredModel({ ...raw, provider: "ollama", source: "filesystem" }))), errors };
  } catch (error) {
    errors.push({ provider: "ollama", message: `Ollama filesystem discovery failed: ${errorMessage(error)}` });
    return { models: PRESET_OLLAMA_MODELS, errors };
  }
}

export async function discoverLmStudioModels(config: ModelDiscoveryConfig): Promise<ModelDiscoveryResult> {
  const models: DiscoveredModel[] = [];
  const errors: ModelDiscoveryError[] = [];
  for (const modelsPath of config.lmStudioModelsPaths) {
    try {
      const rawModels = await scanModelDirectory(modelsPath);
      models.push(...rawModels.map((raw) => normalizeDiscoveredModel({ ...raw, provider: "lmstudio", source: "filesystem" })));
    } catch (error) {
      errors.push({ provider: "lmstudio", message: `LM Studio filesystem discovery failed for ${modelsPath}: ${errorMessage(error)}` });
    }
  }
  return { models: deduplicateModels(models), errors };
}

export async function discoverAllLocalModels(config: ModelDiscoveryConfig): Promise<ModelDiscoveryResult> {
  const [ollama, lmStudio] = await Promise.all([discoverOllamaModels(config), discoverLmStudioModels(config)]);
  return { models: deduplicateModels([...ollama.models, ...lmStudio.models]), errors: [...ollama.errors, ...lmStudio.errors] };
}

function modelNameFromPath(root: string, filePath: string): string {
  const relative = path.relative(root, filePath);
  return relative.slice(0, -path.extname(relative).length).split(path.sep).join("/");
}

function deduplicateModels(models: DiscoveredModel[]): DiscoveredModel[] {
  const byKey = new Map<string, DiscoveredModel>();
  for (const model of models) {
    const key = `${model.provider}:${model.name.toLowerCase()}`;
    const existing = byKey.get(key);
    if (!existing || sourcePriority(model.source) > sourcePriority(existing.source)) byKey.set(key, model);
  }
  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function withPresetOllamaModels(models: DiscoveredModel[]): DiscoveredModel[] {
  return deduplicateModels([...models, ...PRESET_OLLAMA_MODELS]);
}

function sourcePriority(source: DiscoveredModel["source"]): number {
  if (source === "api") return 3;
  if (source === "filesystem") return 2;
  return 1;
}

function stringValue(value: unknown): string | undefined { return typeof value === "string" && value.trim() ? value : undefined; }
function numberValue(value: unknown): number | undefined { return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined; }
function errorMessage(error: unknown): string { return error instanceof Error && error.message ? error.message : "Unknown discovery error."; }
