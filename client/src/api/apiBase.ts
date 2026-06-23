import { getBackendInfo, isTauriRuntime } from "./tauriApi";

const ENV_API_BASE = ((import.meta as ImportMeta & { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE)?.replace(/\/$/, "");
const DEFAULT_API_BASE = "http://localhost:3001";

let cachedApiBase: string | null = null;

export async function getApiBase(): Promise<string> {
  if (ENV_API_BASE) return ENV_API_BASE;
  if (cachedApiBase) return cachedApiBase;
  if (!isTauriRuntime()) return DEFAULT_API_BASE;

  try {
    const info = await getBackendInfo();
    cachedApiBase = info.apiBase.replace(/\/$/, "");
    return cachedApiBase;
  } catch {
    return "http://127.0.0.1:3001";
  }
}

export function clearApiBaseCache(): void {
  cachedApiBase = null;
}
