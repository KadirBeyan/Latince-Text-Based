import path from "node:path";
import { Router, type NextFunction, type Request, type Response } from "express";
import type { AppDatabase } from "../db/database";
import type { ContentLoader } from "../game/content/ContentLoader";
import { getRuntimeConfig } from "../config/RuntimeConfig";
import { SaveRepository } from "../game/save/SaveRepository";
import { LexicalRepository } from "../lexicon/LexicalRepository";
import { LatinLexicalEngine } from "../lexicon/LatinLexicalEngine";
import { LexicalSearchService } from "../lexicon/LexicalSearchService";
import { VocabularyPriorityEngine } from "../lexicon/VocabularyPriorityEngine";
import { importFrequencyDictionary } from "../lexicon/LexicalImportService";

export function createLexiconRoutes(params: { db: AppDatabase; contentLoader: ContentLoader }) {
  const router = Router();
  const repository = new LexicalRepository(params.db);
  const engine = new LatinLexicalEngine(repository, params.contentLoader);
  const search = new LexicalSearchService(repository);
  const priority = new VocabularyPriorityEngine(repository);
  const saves = new SaveRepository(params.db);
  const wrap = (fn: (req: Request, res: Response) => void | Promise<void>) => (req: Request, res: Response, next: NextFunction) => { Promise.resolve(fn(req, res)).catch(next); };

  router.get("/search", wrap((req, res) => { res.json(search.searchLexicon(String(req.query.q || ""), { limit: Number(req.query.limit || 20) })); }));
  router.get("/lookup/:query", wrap(async (req, res) => { res.json(await engine.lookup(String(req.params.query))); }));
  router.get("/entry/:id", wrap((req, res) => { const entry = repository.findEntryById(String(req.params.id)); if (!entry) res.status(404).json({ error: "entry not found" }); else res.json(entry); }));
  router.get("/top", wrap((req, res) => { res.json(repository.findByRankRange(1, Math.max(1, Math.min(500, Number(req.query.limit || 100))))); }));
  router.get("/level/:level", wrap((req, res) => { res.json(repository.findByLevel(req.params.level as never)); }));
  router.get("/chapter/:chapterId", wrap((req, res) => { res.json(repository.findByChapter(String(req.params.chapterId)).slice(0, Number(req.query.limit || 50))); }));
  router.get("/stats", wrap((_req, res) => { res.json(repository.getStats()); }));
  router.post("/analyze-form", wrap(async (req, res) => { if (typeof req.body?.form !== "string") { res.status(400).json({ error: "form is required" }); return; } res.json(await engine.analyzeForm(req.body.form)); }));
  router.post("/recommend-for-player", wrap((req, res) => {
    const saveId = typeof req.body?.saveId === "string" ? req.body.saveId : "";
    const save = saveId ? saves.getById(saveId) : null;
    if (!save) { res.status(404).json({ error: "save not found" }); return; }
    res.json(priority.getNextWordsForPlayer(save, { chapterId: String(req.body?.chapterId || "ludus"), limit: Number(req.body?.limit || 20) }));
  }));
  router.post("/import/frequency-dictionary", wrap(async (req, res) => {
    const runtime = getRuntimeConfig();
    if (runtime.isProduction && !runtime.isDesktop) { res.status(403).json({ error: "Lexicon import is local desktop only." }); return; }
    const epubPath = typeof req.body?.epubPath === "string" ? req.body.epubPath : "";
    if (!epubPath || path.isAbsolute(epubPath) === false) { res.status(400).json({ error: "absolute epubPath is required" }); return; }
    const report = await importFrequencyDictionary({ epubPath, dryRun: Boolean(req.body?.dryRun), writeDb: Boolean(req.body?.writeDb), writeJson: req.body?.writeJson !== false });
    res.json({ report, sampleEntries: report.sampleEntries });
  }));
  return router;
}
