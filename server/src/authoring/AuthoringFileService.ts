import crypto from "node:crypto";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { ContentOverrideService } from "../content/ContentOverrideService";

const ALLOWED_ROOTS = [
  "data/campaigns",
  "data/npcs",
  "data/locations",
  "data/latin",
  "data/quests",
  "data/assessment",
  "data/quest-templates",
  "data/village",
];

export class AuthoringFileService {
  readonly dataRoot: string;
  private readonly projectRoot: string;
  private readonly allowedRoots: string[];
  private readonly backupRoot: string;
  private readonly overrideService: ContentOverrideService;

  constructor(projectRoot = process.cwd(), overrideService?: ContentOverrideService) {
    this.projectRoot = path.resolve(projectRoot);
    this.dataRoot = path.join(this.projectRoot, "data");
    this.overrideService = overrideService ?? new ContentOverrideService({ projectRoot: this.projectRoot });
    this.allowedRoots = ALLOWED_ROOTS.map((root) => path.join(this.projectRoot, root));
    this.backupRoot = path.join(this.dataRoot, ".authoring-backups");
  }

  async readJsonFileSafe<T = unknown>(relativePath: string): Promise<T> {
    const filePath = this.overrideService.resolveContentPath(relativePath);
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  }

  async writeJsonFileSafe(relativePath: string, data: unknown): Promise<void> {
    const filePath = this.resolveSafeContentPath(relativePath);
    JSON.stringify(data);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }

  async deleteFileSafe(relativePath: string): Promise<void> {
    await fs.unlink(this.resolveSafeContentPath(relativePath));
  }

  async createContentBackup(relativePath: string): Promise<string | undefined> {
    const filePath = this.resolveSafeContentPath(relativePath);
    if (!fsSync.existsSync(filePath)) return undefined;
    const day = new Date().toISOString().slice(0, 10);
    const hash = crypto.createHash("sha1").update(path.relative(this.projectRoot, filePath)).digest("hex").slice(0, 12);
    const backupDir = path.join(this.backupRoot, day);
    await fs.mkdir(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `${hash}.${path.basename(filePath)}`);
    await fs.copyFile(filePath, backupPath);
    return path.relative(this.projectRoot, backupPath);
  }

  async listBackups(): Promise<Array<{ path: string; sourceHint: string; createdAt: string; size: number }>> {
    if (!fsSync.existsSync(this.backupRoot)) return [];
    const files = await this.walk(this.backupRoot);
    const backups = await Promise.all(files.filter((file) => file.endsWith(".json")).map(async (file) => {
      const stat = await fs.stat(file);
      return {
        path: path.relative(this.projectRoot, file),
        sourceHint: path.basename(file).replace(/^[a-f0-9]{12}\./, ""),
        createdAt: stat.mtime.toISOString(),
        size: stat.size,
      };
    }));
    return backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async restoreBackup(backupRelativePath: string, targetRelativePath: string): Promise<{ ok: boolean; restoredPath: string }> {
    const backupPath = path.resolve(this.projectRoot, backupRelativePath);
    const relToBackup = path.relative(this.backupRoot, backupPath);
    if (relToBackup.startsWith("..") || path.isAbsolute(relToBackup)) throw new Error("Backup path is outside backup root.");
    const target = this.resolveSafeContentPath(targetRelativePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    JSON.parse(await fs.readFile(backupPath, "utf8"));
    await fs.copyFile(backupPath, target);
    return { ok: true, restoredPath: path.relative(this.projectRoot, target) };
  }

  async listContentFiles(rootRelativePath: string): Promise<string[]> {
    const root = this.resolveSafeContentPath(rootRelativePath);
    const sourceFiles = fsSync.existsSync(root) ? await this.walk(root) : [];
    const overrideRoot = this.overrideService.toOverridePath(rootRelativePath);
    const overrideFiles = fsSync.existsSync(overrideRoot) ? await this.walk(overrideRoot) : [];
    const relative = new Set<string>();
    for (const file of sourceFiles.filter((file) => file.endsWith(".json"))) relative.add(path.relative(this.projectRoot, file));
    for (const file of overrideFiles.filter((file) => file.endsWith(".json"))) relative.add(path.join("data", path.relative(this.overrideService.overrideRoot, file)));
    return [...relative].sort();
  }

  resolveSafeContentPath(relativePath: string): string {
    if (!relativePath || relativePath.includes("\0")) throw new Error("Invalid content path.");
    const candidate = path.resolve(this.projectRoot, relativePath);
    this.ensureWithinContentRoot(candidate);
    return candidate;
  }

  ensureWithinContentRoot(filePath: string): void {
    const resolved = path.resolve(filePath);
    const ok = this.allowedRoots.some((root) => {
      const relative = path.relative(root, resolved);
      return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
    });
    if (!ok) throw new Error("Content path is not in an allowed authoring root.");
  }

  async getFileMetadata(relativePath: string): Promise<{ updatedAt?: string; size?: number }> {
    try {
      const stat = await fs.stat(this.overrideService.resolveContentPath(relativePath));
      return { updatedAt: stat.mtime.toISOString(), size: stat.size };
    } catch {
      return {};
    }
  }

  private async walk(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => {
      const next = path.join(dir, entry.name);
      return entry.isDirectory() ? this.walk(next) : Promise.resolve([next]);
    }));
    return nested.flat();
  }
}
