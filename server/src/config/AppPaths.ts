import os from "node:os";
import fs from "node:fs";
import path from "node:path";

const APP_NAME = "ViaPrima";

export type AppPaths = {
  appDataDir: string;
  databasePath: string;
  backupsDir: string;
  logsDir: string;
  cacheDir: string;
  exportsDir: string;
  modelDiscoveryCachePath: string;
  settingsPath: string;
};

export function getAppDataDir(): string {
  if (process.env.VIA_PRIMA_APP_DATA_DIR?.trim()) {
    return path.resolve(process.env.VIA_PRIMA_APP_DATA_DIR);
  }
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", APP_NAME);
  }
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming"), APP_NAME);
  }
  return path.join(process.env.XDG_DATA_HOME ?? path.join(os.homedir(), ".local", "share"), APP_NAME);
}

export function getDatabasePath(appDataDir = getAppDataDir()): string {
  if (process.env.VIA_PRIMA_DATABASE_PATH?.trim()) {
    return path.resolve(process.env.VIA_PRIMA_DATABASE_PATH);
  }
  return path.join(appDataDir, "via-prima.sqlite");
}

export function getBackupsDir(appDataDir = getAppDataDir()): string {
  return path.join(appDataDir, "backups");
}

export function getLogsDir(appDataDir = getAppDataDir()): string {
  return path.join(appDataDir, "logs");
}

export function getCacheDir(appDataDir = getAppDataDir()): string {
  return path.join(appDataDir, "cache");
}

export function getExportsDir(appDataDir = getAppDataDir()): string {
  return path.join(appDataDir, "exports");
}

export function getAppPaths(appDataDir = getAppDataDir()): AppPaths {
  const cacheDir = getCacheDir(appDataDir);
  return {
    appDataDir,
    databasePath: getDatabasePath(appDataDir),
    backupsDir: getBackupsDir(appDataDir),
    logsDir: getLogsDir(appDataDir),
    cacheDir,
    exportsDir: getExportsDir(appDataDir),
    modelDiscoveryCachePath: path.join(cacheDir, "model-discovery.json"),
    settingsPath: path.join(appDataDir, "settings.json"),
  };
}

export function ensureAppDirectories(paths = getAppPaths()): AppPaths {
  for (const directory of [paths.appDataDir, paths.backupsDir, paths.logsDir, paths.cacheDir, paths.exportsDir]) {
    fs.mkdirSync(directory, { recursive: true });
  }
  return paths;
}
