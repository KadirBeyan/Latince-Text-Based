import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { openDatabase, initDatabase } from "./db/database";
import { ContentLoader } from "./game/content/ContentLoader";
import { ContentValidator } from "./game/content/ContentValidator";
import { GameEngine } from "./game/core/GameEngine";
import { SaveRepository } from "./game/save/SaveRepository";
import { createGameRoutes } from "./routes/gameRoutes";
import { createDebugRoutes } from "./routes/debugRoutes";
import { createLatinRoutes } from "./routes/latinRoutes";
import { createLlmRoutes } from "./routes/llmRoutes";
import { createAssessmentRoutes } from "./routes/assessmentRoutes";
import { createLexiconRoutes } from "./routes/lexiconRoutes";
import { createAuthoringRoutes } from "./routes/authoringRoutes";
import { getRuntimeConfig } from "./config/RuntimeConfig";
import { createSystemRoutes } from "./routes/systemRoutes";
import { CacheService } from "./system/CacheService";
import { Logger } from "./system/Logger";
import { RequestMetricsService } from "./system/RequestMetricsService";

const port = Number(process.env.PORT ?? 3001);
const runtime = getRuntimeConfig();
const logger = new Logger(runtime.paths);
const cache = new CacheService();
const requestMetrics = new RequestMetricsService();

const db = openDatabase(runtime.paths.databasePath);
initDatabase(db);

const contentLoader = new ContentLoader();
const content = contentLoader.load();
const contentValidator = new ContentValidator();
const validation = contentValidator.validate(content);

if (!validation.ok) {
  console.error("Content validation failed:");
  for (const issue of [...validation.errors, ...validation.warnings]) {
    console.error(`[${issue.severity}] ${issue.path}: ${issue.message}`);
  }
  process.exit(1);
}

const saveRepository = new SaveRepository(db);
const gameEngine = new GameEngine(contentLoader, saveRepository);
const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(requestMetrics.middleware());
app.use(createSystemRoutes({ db, runtime, contentLoader, cache, logger, requestMetrics }));
app.use(createGameRoutes(gameEngine, contentLoader, contentValidator));
app.use(createLlmRoutes());
app.use(createAssessmentRoutes(gameEngine, contentLoader));
app.use("/api/lexicon", createLexiconRoutes({ db, contentLoader }));
app.use("/api/authoring", createAuthoringRoutes({ runtime }));
app.use("/api/debug", createDebugRoutes(gameEngine, contentLoader));
app.use("/api/latin", createLatinRoutes(contentLoader));

process.on("unhandledRejection", (reason) => logger.error("unhandledRejection", serializeError(reason)));
process.on("uncaughtException", (error) => logger.error("uncaughtException", serializeError(error)));

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "Unknown server error.";
  logger.error("request-error", serializeError(error));
  res.status(400).json({
    ok: false,
    code: "REQUEST_FAILED",
    messageTr: runtime.isProduction ? "İstek tamamlanamadı. Lütfen tekrar dene." : message,
    ...(runtime.isProduction ? {} : { details: serializeError(error) }),
  });
});

app.listen(port, () => {
  console.log(`Latin RPG server listening on http://localhost:${port}`);
});

function serializeError(error: unknown): unknown {
  if (error instanceof Error) return { name: error.name, message: error.message, stack: runtime.isProduction ? undefined : error.stack };
  return error;
}
