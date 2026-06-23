import fs from "node:fs";
import path from "node:path";
import type { AppDatabase } from "../db/database";
import type { AppPaths } from "../config/AppPaths";
import { SettingsService, type DesktopSettings } from "./SettingsService";

type SaveBackupRow = { id: string; playerName: string; saveJson: string; createdAt: string; updatedAt: string };

export type FullBackup = {
  version: string;
  createdAt: string;
  settings: DesktopSettings;
  saves: SaveBackupRow[];
  metadata: { format: "via-prima-full-backup" };
};

export class BackupService {
  constructor(private readonly db: AppDatabase, private readonly paths: AppPaths, private readonly settingsService = new SettingsService(paths)) {}

  createBackup(prefix = "via-prima-backup"): { id: string; filePath: string; createdAt: string; sizeBytes: number } {
    const backup = this.createPayload();
    const id = `${prefix}-${timestamp()}.json`;
    const filePath = path.join(this.paths.backupsDir, id);
    fs.writeFileSync(filePath, `${JSON.stringify(backup, null, 2)}\n`, "utf8");
    return { id, filePath, createdAt: backup.createdAt, sizeBytes: fs.statSync(filePath).size };
  }

  listBackups(): Array<{ id: string; filePath: string; createdAt: string; sizeBytes: number }> {
    if (!fs.existsSync(this.paths.backupsDir)) return [];
    return fs.readdirSync(this.paths.backupsDir)
      .filter((file) => file.endsWith(".json"))
      .map((id) => {
        const filePath = path.join(this.paths.backupsDir, id);
        const stat = fs.statSync(filePath);
        return { id, filePath, createdAt: stat.birthtime.toISOString(), sizeBytes: stat.size };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  restoreBackup(idOrPath: string): { ok: true; restoredSaves: number; safetyBackup: string } {
    const filePath = this.resolveBackupPath(idOrPath);
    const backup = this.readBackup(filePath);
    const safety = this.createBackup("safety-before-restore");
    const transaction = this.db.transaction(() => {
      this.db.prepare("DELETE FROM saves").run();
      const insert = this.db.prepare("INSERT INTO saves (id, playerName, saveJson, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)");
      for (const save of backup.saves) insert.run(save.id, save.playerName, save.saveJson, save.createdAt, save.updatedAt);
    });
    transaction();
    this.settingsService.write(backup.settings);
    return { ok: true, restoredSaves: backup.saves.length, safetyBackup: safety.filePath };
  }

  exportSave(saveId: string): SaveBackupRow {
    const row = this.db.prepare("SELECT * FROM saves WHERE id = ?").get(saveId) as SaveBackupRow | undefined;
    if (!row) throw new Error(`Save ${saveId} was not found.`);
    return row;
  }

  importSave(payload: unknown): SaveBackupRow {
    const row = validateSaveRow(payload);
    this.db.prepare("INSERT OR REPLACE INTO saves (id, playerName, saveJson, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)")
      .run(row.id, row.playerName, row.saveJson, row.createdAt, row.updatedAt);
    return row;
  }

  exportFullData(): FullBackup {
    return this.createPayload();
  }

  restoreFullData(payload: unknown): { ok: true; restoredSaves: number; safetyBackup: string } {
    const backup = validateBackup(payload);
    const tempPath = path.join(this.paths.backupsDir, `import-${timestamp()}.json`);
    fs.writeFileSync(tempPath, `${JSON.stringify(backup, null, 2)}\n`, "utf8");
    return this.restoreBackup(tempPath);
  }

  private createPayload(): FullBackup {
    const saves = this.db.prepare("SELECT * FROM saves ORDER BY updatedAt DESC").all() as SaveBackupRow[];
    return { version: "0.1.0", createdAt: new Date().toISOString(), settings: this.settingsService.read(), saves, metadata: { format: "via-prima-full-backup" } };
  }

  private readBackup(filePath: string): FullBackup {
    return validateBackup(JSON.parse(fs.readFileSync(filePath, "utf8")));
  }

  private resolveBackupPath(idOrPath: string): string {
    const candidate = path.isAbsolute(idOrPath) ? idOrPath : path.join(this.paths.backupsDir, idOrPath);
    const resolved = path.resolve(candidate);
    const backupsRoot = path.resolve(this.paths.backupsDir);
    const relative = path.relative(backupsRoot, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Backup path must stay inside backups directory.");
    if (!fs.existsSync(resolved)) throw new Error("Backup file was not found.");
    return resolved;
  }
}

function validateBackup(payload: unknown): FullBackup {
  if (!payload || typeof payload !== "object") throw new Error("Invalid backup payload.");
  const backup = payload as FullBackup;
  if (backup.metadata?.format !== "via-prima-full-backup" || !Array.isArray(backup.saves)) throw new Error("Unsupported backup format.");
  for (const save of backup.saves) validateSaveRow(save);
  return backup;
}

function validateSaveRow(payload: unknown): SaveBackupRow {
  if (!payload || typeof payload !== "object") throw new Error("Invalid save payload.");
  const row = payload as SaveBackupRow;
  if (!row.id || !row.playerName || !row.saveJson || !row.createdAt || !row.updatedAt) throw new Error("Save payload is missing required fields.");
  JSON.parse(row.saveJson);
  return row;
}

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}
