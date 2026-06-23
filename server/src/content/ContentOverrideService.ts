import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { getAppDataDir } from "../config/AppPaths";

export type ContentOverrideEntry = {
  relativePath: string;
  overridePath: string;
  sourcePath: string;
  updatedAt?: string;
  size?: number;
};

const OVERRIDE_ROOTS = ["campaigns", "npcs", "locations", "latin", "quests", "assessment", "quest-templates"];
const OVERRIDE_ROOT_FILES = ["npcs.json", "items.json", "skills.json"];

export class ContentOverrideService {
  readonly sourceDataRoot: string;
  readonly overrideRoot: string;

  constructor(params: { projectRoot?: string; appDataDir?: string } = {}) {
    const projectRoot = path.resolve(params.projectRoot ?? process.cwd());
    this.sourceDataRoot = path.join(projectRoot, "data");
    this.overrideRoot = path.join(path.resolve(params.appDataDir ?? getAppDataDir()), "content-overrides");
  }

  getContentRoots() {
    return { overrideRoot: this.overrideRoot, sourceDataRoot: this.sourceDataRoot };
  }

  resolveContentPath(relativePath: string): string {
    const normalized = this.normalize(relativePath);
    const overridePath = this.toOverridePath(normalized);
    return fs.existsSync(overridePath) ? overridePath : this.toSourcePath(normalized);
  }

  hasOverride(relativePath: string): boolean {
    return fs.existsSync(this.toOverridePath(this.normalize(relativePath)));
  }

  async readContent<T = unknown>(relativePath: string): Promise<T> {
    return JSON.parse(await fsp.readFile(this.resolveContentPath(relativePath), "utf8")) as T;
  }

  readContentSync<T = unknown>(relativePath: string): T {
    return JSON.parse(fs.readFileSync(this.resolveContentPath(relativePath), "utf8")) as T;
  }

  async writeOverride(relativePath: string, data: unknown): Promise<ContentOverrideEntry> {
    const normalized = this.normalize(relativePath);
    JSON.stringify(data);
    const overridePath = this.toOverridePath(normalized);
    await fsp.mkdir(path.dirname(overridePath), { recursive: true });
    await fsp.writeFile(overridePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    return this.describe(normalized);
  }

  async deleteOverride(relativePath: string): Promise<{ ok: boolean; path: string }> {
    const normalized = this.normalize(relativePath);
    const overridePath = this.toOverridePath(normalized);
    if (fs.existsSync(overridePath)) await fsp.unlink(overridePath);
    return { ok: true, path: overridePath };
  }

  async resetOverride(relativePath: string) {
    return this.deleteOverride(relativePath);
  }

  async resetAllOverrides(): Promise<{ ok: boolean; count: number }> {
    const entries = await this.listOverrides();
    await Promise.all(entries.map((entry) => fsp.unlink(entry.overridePath)));
    return { ok: true, count: entries.length };
  }

  async listOverrides(): Promise<ContentOverrideEntry[]> {
    if (!fs.existsSync(this.overrideRoot)) return [];
    const files = await this.walk(this.overrideRoot);
    return Promise.all(files.filter((file) => file.endsWith(".json")).map((file) => this.describe(path.relative(this.overrideRoot, file))));
  }

  async exportOverrides(): Promise<{ exportedAt: string; overrides: Array<{ relativePath: string; data: unknown }> }> {
    const overrides = await Promise.all((await this.listOverrides()).map(async (entry) => ({
      relativePath: entry.relativePath,
      data: JSON.parse(await fsp.readFile(entry.overridePath, "utf8")),
    })));
    return { exportedAt: new Date().toISOString(), overrides };
  }

  async importOverrides(bundle: { overrides?: Array<{ relativePath: string; data: unknown }> }): Promise<{ ok: boolean; count: number }> {
    const overrides = Array.isArray(bundle.overrides) ? bundle.overrides : [];
    for (const entry of overrides) await this.writeOverride(entry.relativePath, entry.data);
    return { ok: true, count: overrides.length };
  }

  toOverridePath(relativePath: string): string {
    const normalized = this.normalize(relativePath);
    return path.join(this.overrideRoot, normalized.replace(/^data[\\/]/, ""));
  }

  toSourcePath(relativePath: string): string {
    const normalized = this.normalize(relativePath);
    return path.join(this.sourceDataRoot, normalized.replace(/^data[\\/]/, ""));
  }

  private async describe(relativePath: string): Promise<ContentOverrideEntry> {
    const normalized = this.normalize(relativePath);
    const overridePath = this.toOverridePath(normalized);
    const stat = fs.existsSync(overridePath) ? await fsp.stat(overridePath) : undefined;
    return {
      relativePath: normalized,
      overridePath,
      sourcePath: this.toSourcePath(normalized),
      updatedAt: stat?.mtime.toISOString(),
      size: stat?.size,
    };
  }

  private normalize(relativePath: string): string {
    if (!relativePath || relativePath.includes("\0")) throw new Error("Invalid content override path.");
    const trimmed = relativePath.replace(/\\/g, "/").replace(/^data\//, "");
    const first = trimmed.split("/")[0];
    if (!OVERRIDE_ROOTS.includes(first) && !OVERRIDE_ROOT_FILES.includes(trimmed)) throw new Error("Content override path is outside supported roots.");
    const normalized = path.normalize(trimmed);
    if (normalized.startsWith("..") || path.isAbsolute(normalized)) throw new Error("Content override path escapes root.");
    return normalized;
  }

  private async walk(dir: string): Promise<string[]> {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => {
      const next = path.join(dir, entry.name);
      return entry.isDirectory() ? this.walk(next) : Promise.resolve([next]);
    }));
    return nested.flat();
  }
}
