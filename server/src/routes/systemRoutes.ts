import { Router, type NextFunction, type Request, type Response } from "express";
import type { AppDatabase } from "../db/database";
import type { RuntimeConfig } from "../config/RuntimeConfig";
import { BackupService } from "../system/BackupService";
import { CacheService } from "../system/CacheService";
import { Logger } from "../system/Logger";
import { SaveIntegrityService } from "../system/SaveIntegrityService";
import { SettingsService } from "../system/SettingsService";
import { ContentLoader } from "../game/content/ContentLoader";
import { ContentValidator } from "../game/content/ContentValidator";
import { SaveRepository } from "../game/save/SaveRepository";
import { ContentOverrideService } from "../content/ContentOverrideService";
import { discoverOllamaModels } from "../llm/ModelDiscoveryService";
import type { RequestMetricsService } from "../system/RequestMetricsService";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export function createSystemRoutes(params: { db: AppDatabase; runtime: RuntimeConfig; contentLoader: ContentLoader; cache: CacheService; logger: Logger; requestMetrics?: RequestMetricsService }): Router {
  const router = Router();
  const settings = new SettingsService(params.runtime.paths);
  const backups = new BackupService(params.db, params.runtime.paths, settings);
  const integrity = new SaveIntegrityService(params.db, params.contentLoader);
  const overrides = new ContentOverrideService({ appDataDir: params.runtime.appDataDir });
  const asyncHandler = (handler: RouteHandler): RouteHandler => (req, res, next) => { Promise.resolve(handler(req, res, next)).catch(next); };

  router.get("/api/health", (_req, res) => res.json(healthPayload(params.runtime)));
  router.get("/health", (_req, res) => res.json(healthPayload(params.runtime)));
  router.get("/api/system/info", (_req, res) => res.json(systemInfoPayload(params.runtime)));
  router.get("/api/system/smoke", asyncHandler(async (_req, res) => {
    const checks = await runSmokeChecks(params, overrides);
    const payload = { ok: checks.every((check) => check.ok), checks };
    res.status(payload.ok ? 200 : 503).json(payload);
  }));
  router.get("/api/system/performance", asyncHandler(async (_req, res) => {
    const content = params.contentLoader.getContent();
    const databaseStats = params.db.prepare("SELECT COUNT(*) AS saveCount FROM saves").get() as { saveCount: number };
    const overrideCount = (await overrides.listOverrides()).length;
    res.json({
      uptime: params.requestMetrics?.uptimeSeconds() ?? Math.floor(process.uptime()),
      cacheStats: params.cache.stats(),
      contentStats: {
        campaigns: content.campaigns.length,
        chapters: content.campaigns.flatMap((campaign) => campaign.chapters).length,
        quests: content.campaigns.flatMap((campaign) => campaign.chapters).flatMap((chapter) => chapter.quests).length,
        scenes: content.campaigns.flatMap((campaign) => campaign.chapters).flatMap((chapter) => chapter.quests).flatMap((quest) => quest.scenes).length,
        vocabulary: content.vocabulary.length,
        grammar: content.grammar.length,
        overrides: overrideCount,
      },
      databaseStats,
      recentRequestStats: params.requestMetrics?.snapshot() ?? [],
      memoryUsage: process.memoryUsage(),
    });
  }));

  router.get("/api/settings", (_req, res) => res.json(settings.read()));
  router.put("/api/settings", (req, res) => res.json(settings.write(req.body)));
  router.post("/api/settings/export", (_req, res) => res.json(settings.export()));
  router.post("/api/settings/import", (req, res) => res.json(settings.import(req.body)));

  router.post("/api/system/backup/create", (_req, res) => res.status(201).json(backups.createBackup()));
  router.get("/api/system/backup/list", (_req, res) => res.json(backups.listBackups()));
  router.post("/api/system/backup/restore", (req, res) => res.json(backups.restoreBackup(String((req.body as { backupId?: string; filePath?: string }).backupId ?? (req.body as { filePath?: string }).filePath ?? ""))));
  router.post("/api/system/export/save/:saveId", (req, res) => res.json(backups.exportSave(String(req.params.saveId))));
  router.post("/api/system/import/save", (req, res) => res.status(201).json(backups.importSave(req.body)));
  router.post("/api/system/export/full", (_req, res) => res.json(backups.exportFullData()));
  router.post("/api/system/import/full", (req, res) => res.json(backups.restoreFullData(req.body)));

  router.get("/api/system/integrity/saves", (_req, res) => res.json(integrity.checkAllSaves()));
  router.get("/api/system/integrity/saves/:saveId", (req, res) => res.json(integrity.checkSaveIntegrity(String(req.params.saveId))));
  router.post("/api/system/integrity/saves/:saveId/repair", (req, res) => res.json(integrity.repairSave(String(req.params.saveId))));

  router.get("/api/system/cache/stats", (_req, res) => res.json(params.cache.stats()));
  router.post("/api/system/cache/clear", (_req, res) => { params.cache.clear(); res.json({ ok: true, stats: params.cache.stats() }); });
  router.post("/api/system/client-error", (req, res) => { params.logger.error("client-error", req.body); res.status(202).json({ ok: true }); });

  return router;
}

function healthPayload(runtime: RuntimeConfig) {
  return {
    ok: true,
    version: runtime.appVersion,
    mode: runtime.isProduction ? "production" : "development",
    ...(runtime.isProduction ? {} : { databasePath: runtime.paths.databasePath, appDataDir: runtime.appDataDir }),
  };
}

function systemInfoPayload(runtime: RuntimeConfig) {
  const visible = (value: string) => runtime.isProduction ? path.basename(value) : value;
  return {
    version: runtime.appVersion,
    mode: runtime.isProduction ? "production" : "development",
    isDesktop: runtime.isDesktop,
    appDataDir: visible(runtime.appDataDir),
    databasePath: visible(runtime.paths.databasePath),
    logsDir: visible(runtime.paths.logsDir),
    cacheDir: visible(runtime.paths.cacheDir),
    backupsDir: visible(runtime.paths.backupsDir),
    debugEnabled: runtime.enableDebugEndpoints,
    editorWriteEnabled: runtime.enableEditorWrites,
  };
}

type SmokeCheck = { name: string; ok: boolean; message?: string };

async function runSmokeChecks(
  params: { db: AppDatabase; runtime: RuntimeConfig; contentLoader: ContentLoader; cache: CacheService },
  overrides: ContentOverrideService,
): Promise<SmokeCheck[]> {
  const checks: SmokeCheck[] = [];
  const check = async (name: string, action: () => unknown | Promise<unknown>, successMessage?: string) => {
    try {
      await action();
      checks.push({ name, ok: true, ...(successMessage ? { message: successMessage } : {}) });
    } catch (error) {
      checks.push({ name, ok: false, message: safeMessage(error, params.runtime.isProduction) });
    }
  };

  await check("ContentLoader load", () => params.contentLoader.load());
  await check("database", () => params.db.prepare("SELECT 1 AS ok").get());
  await check("SaveRepository", () => new SaveRepository(params.db).list());
  await check("Content validation basic", () => {
    const validation = new ContentValidator().validate(params.contentLoader.getContent());
    if (!validation.ok) throw new Error(`${validation.errors.length} critical content validation error(s).`);
  });
  await check("AppData dirs", () => {
    for (const directory of [params.runtime.appDataDir, params.runtime.paths.cacheDir, params.runtime.paths.backupsDir]) {
      if (!fs.statSync(directory).isDirectory()) throw new Error("Required AppData directory is unavailable.");
    }
  });
  await check("Backup dir writable", () => {
    const probe = path.join(params.runtime.paths.backupsDir, `.write-check-${process.pid}`);
    fs.writeFileSync(probe, "ok", "utf8");
    fs.unlinkSync(probe);
  });
  await check("Cache service", () => {
    params.cache.set("smoke:probe", true, 1_000);
    if (params.cache.get("smoke:probe") !== true) throw new Error("Cache read/write probe failed.");
    params.cache.delete("smoke:probe");
  });
  await check("LLM config readable", () => {
    const settingsPath = params.runtime.paths.settingsPath;
    if (fs.existsSync(settingsPath)) JSON.parse(fs.readFileSync(settingsPath, "utf8"));
  });
  await check("Model discovery service callable", async () => {
    await discoverOllamaModels({
      ollamaBaseUrl: "http://127.0.0.1:11434",
      ollamaModelsPath: undefined,
      lmStudioModelsPaths: [path.join(os.homedir(), ".lmstudio", "models")],
    });
  });
  await check("Authoring write mode", () => {
    if (params.runtime.isDesktop && !params.runtime.enableAuthoringWrites) throw new Error("Authoring writes are disabled in desktop mode.");
  }, params.runtime.enableAuthoringWrites ? "enabled" : "read-only");
  await check("Override service", () => overrides.listOverrides());
  return checks;
}

function safeMessage(error: unknown, production: boolean): string {
  if (production) return "Kontrol tamamlanamadı.";
  return error instanceof Error ? error.message : "Unknown smoke check error.";
}
