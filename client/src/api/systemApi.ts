import { requestJson } from "./gameApi";

export type DesktopInfo = {
  version: string;
  mode: string;
  isDesktop: boolean;
  appDataDir: string;
  databasePath: string;
  logsDir: string;
  cacheDir: string;
  backupsDir: string;
  debugEnabled: boolean;
  editorWriteEnabled: boolean;
};

export type CacheStats = { keys: number; hits: number; misses: number };
export type BackupSummary = { id: string; filePath: string; createdAt: string; sizeBytes: number };
export type SaveIntegrityReport = { saveId: string; ok: boolean; issues: Array<{ severity: "warning" | "error"; message: string }> };

export function getSystemInfo(): Promise<DesktopInfo> { return requestJson<DesktopInfo>("/api/system/info"); }
export function getHealth(): Promise<{ ok: boolean; version: string; mode: string; databasePath: string; appDataDir: string }> { return requestJson("/api/health"); }
export function createBackup(): Promise<BackupSummary> { return requestJson("/api/system/backup/create", { method: "POST" }); }
export function listBackups(): Promise<BackupSummary[]> { return requestJson("/api/system/backup/list"); }
export function restoreBackup(backupId: string): Promise<{ ok: true; restoredSaves: number; safetyBackup: string }> { return requestJson("/api/system/backup/restore", { method: "POST", body: JSON.stringify({ backupId }) }); }
export function exportFullData(): Promise<unknown> { return requestJson("/api/system/export/full", { method: "POST" }); }
export function importFullData(payload: unknown): Promise<unknown> { return requestJson("/api/system/import/full", { method: "POST", body: JSON.stringify(payload) }); }
export function listSaveIntegrity(): Promise<SaveIntegrityReport[]> { return requestJson("/api/system/integrity/saves"); }
export function repairSave(saveId: string): Promise<{ report: SaveIntegrityReport; repaired: boolean }> { return requestJson(`/api/system/integrity/saves/${encodeURIComponent(saveId)}/repair`, { method: "POST" }); }
export function getCacheStats(): Promise<CacheStats> { return requestJson("/api/system/cache/stats"); }
export function clearCache(): Promise<{ ok: true; stats: CacheStats }> { return requestJson("/api/system/cache/clear", { method: "POST" }); }
export function reportClientError(payload: unknown): Promise<{ ok: true }> { return requestJson("/api/system/client-error", { method: "POST", body: JSON.stringify(payload) }); }
export function getDesktopSettings<T>(): Promise<T> { return requestJson<T>("/api/settings"); }
export function putDesktopSettings<T>(settings: T): Promise<T> { return requestJson<T>("/api/settings", { method: "PUT", body: JSON.stringify(settings) }); }
export function exportDesktopSettings<T>(): Promise<T> { return requestJson<T>("/api/settings/export", { method: "POST" }); }
export function importDesktopSettings<T>(payload: unknown): Promise<T> { return requestJson<T>("/api/settings/import", { method: "POST", body: JSON.stringify(payload) }); }
