import os from "node:os";
import path from "node:path";
import { Router, type NextFunction, type Request, type Response } from "express";
import { discoverAllLocalModels, discoverLmStudioModels, discoverOllamaModels, type ModelDiscoveryConfig } from "../llm/ModelDiscoveryService";

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export const DEFAULT_MODEL_DISCOVERY_CONFIG: ModelDiscoveryConfig = {
  ollamaBaseUrl: "http://localhost:11434",
  ollamaModelsPath: path.join(os.homedir(), ".ollama", "models"),
  lmStudioModelsPaths: [path.join(os.homedir(), ".cache", "lm-studio", "models"), path.join(os.homedir(), ".lmstudio", "models")],
};

export function createLlmRoutes(initialConfig: ModelDiscoveryConfig = DEFAULT_MODEL_DISCOVERY_CONFIG): Router {
  const router = Router();
  let config = validateConfig(initialConfig);
  const asyncHandler = (handler: RouteHandler): RouteHandler => (req, res, next) => { Promise.resolve(handler(req, res, next)).catch(next); };

  router.put("/api/llm/model-discovery-config", (req, res) => {
    if (!isLocalRequest(req) || process.env.NODE_ENV === "production") {
      res.status(403).json({ error: "Model path configuration is only available for local development." });
      return;
    }
    try {
      config = validateConfig(req.body as ModelDiscoveryConfig);
      res.json({ ok: true });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid discovery config." });
    }
  });

  router.get("/api/llm/models", asyncHandler(async (req, res) => {
    const provider = String(req.query.provider ?? "all");
    if (!["ollama", "lmstudio", "all"].includes(provider)) {
      res.status(400).json({ error: "provider must be ollama, lmstudio, or all." });
      return;
    }
    const result = provider === "ollama" ? await discoverOllamaModels(config) : provider === "lmstudio" ? await discoverLmStudioModels(config) : await discoverAllLocalModels(config);
    res.json(result);
  }));
  return router;
}

function validateConfig(raw: ModelDiscoveryConfig): ModelDiscoveryConfig {
  if (!raw || typeof raw.ollamaBaseUrl !== "string") throw new Error("ollamaBaseUrl is required.");
  const url = new URL(raw.ollamaBaseUrl);
  if (!["localhost", "127.0.0.1", "::1"].includes(url.hostname)) throw new Error("Ollama discovery URL must target localhost.");
  if (!Array.isArray(raw.lmStudioModelsPaths) || raw.lmStudioModelsPaths.length > 4) throw new Error("lmStudioModelsPaths must contain at most 4 paths.");
  return {
    ollamaBaseUrl: url.origin,
    ollamaModelsPath: raw.ollamaModelsPath ? validateLocalModelPath(raw.ollamaModelsPath) : undefined,
    lmStudioModelsPaths: raw.lmStudioModelsPaths.map(validateLocalModelPath),
  };
}

function validateLocalModelPath(candidate: string): string {
  if (typeof candidate !== "string" || !candidate.trim() || candidate.length > 1_024 || candidate.includes("\0")) throw new Error("Model path is invalid.");
  if (!path.isAbsolute(candidate)) throw new Error("Model paths must be absolute.");
  const resolved = path.resolve(candidate);
  const home = path.resolve(os.homedir());
  const relative = path.relative(home, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Model paths must stay inside the current user's home directory.");
  return resolved;
}

function isLocalRequest(req: Request): boolean {
  const address = req.socket.remoteAddress ?? "";
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}
