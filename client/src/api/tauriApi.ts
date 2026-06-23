type TauriInvoke = <T>(command: string, args?: Record<string, unknown>) => Promise<T>;

export type TauriAppInfo = {
  version: string;
  productName: string;
  appDataDir: string;
};

export type TauriBackendInfo = {
  apiBase: string;
  port: number;
  running: boolean;
  managedByTauri: boolean;
};

type RawTauriAppInfo = {
  version: string;
  product_name: string;
  app_data_dir: string;
};

type RawTauriBackendInfo = {
  api_base: string;
  port: number;
  running: boolean;
  managed_by_tauri: boolean;
};

export function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function invokeTauri<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const mod = await import("@tauri-apps/api/core") as { invoke: TauriInvoke };
  return mod.invoke<T>(command, args);
}

export async function pickDirectory(): Promise<string | null> {
  if (!isTauriRuntime()) return null;
  return invokeTauri<string | null>("pick_directory");
}

export async function pickBackupFile(): Promise<string | null> {
  if (!isTauriRuntime()) return null;
  return invokeTauri<string | null>("pick_backup_file");
}

export async function openAppDataDir(): Promise<void> {
  if (isTauriRuntime()) await invokeTauri("open_app_data_dir");
}

export async function revealFile(path: string): Promise<void> {
  if (isTauriRuntime()) await invokeTauri("reveal_file", { path });
}

export async function getDefaultModelPaths(): Promise<string[]> {
  if (!isTauriRuntime()) return [];
  return invokeTauri<string[]>("get_default_model_paths");
}

export async function getTauriAppInfo(): Promise<TauriAppInfo | null> {
  if (!isTauriRuntime()) return null;
  const info = await invokeTauri<RawTauriAppInfo>("get_app_info");
  return { version: info.version, productName: info.product_name, appDataDir: info.app_data_dir };
}

export async function getBackendInfo(): Promise<TauriBackendInfo> {
  const info = await invokeTauri<RawTauriBackendInfo>("get_backend_info");
  return { apiBase: info.api_base, port: info.port, running: info.running, managedByTauri: info.managed_by_tauri };
}

export async function ensureBackendRunning(): Promise<TauriBackendInfo | null> {
  if (!isTauriRuntime()) return null;
  const info = await invokeTauri<RawTauriBackendInfo>("ensure_backend_running");
  return { apiBase: info.api_base, port: info.port, running: info.running, managedByTauri: info.managed_by_tauri };
}
