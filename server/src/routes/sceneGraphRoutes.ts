import { Router, type NextFunction, type Request, type Response } from "express";
import type { RuntimeConfig } from "../config/RuntimeConfig";
import { GraphBranchDraftService, type GraphBranchDraftRequest } from "../authoring/graph/GraphBranchDraftService";
import { SceneGraphBuilder } from "../authoring/graph/SceneGraphBuilder";
import { SceneGraphEditService } from "../authoring/graph/SceneGraphEditService";
import type { SceneGraphEditEdgeRequest } from "../authoring/graph/SceneGraphTypes";

type Handler = (req: Request, res: Response) => unknown | Promise<unknown>;

export function createSceneGraphRoutes(params: { runtime: RuntimeConfig }): Router {
  const router = Router();
  const builder = new SceneGraphBuilder();
  const edits = new SceneGraphEditService(params.runtime);
  const drafts = new GraphBranchDraftService();
  const wrap = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(handler(req, res)).catch(next);
  const ensureWrite = (res: Response): boolean => {
    if (params.runtime.enableAuthoringWrites) return true;
    res.status(403).json({ error: "Authoring writes are disabled in this runtime mode." });
    return false;
  };

  router.get("/campaign/:campaignId", wrap(async (req, res) => res.json(await builder.buildCampaignGraph(String(req.params.campaignId)))));
  router.get("/chapter/:chapterId", wrap(async (req, res) => res.json(await builder.buildChapterGraph(String(req.params.chapterId)))));
  router.get("/quest/:questId", wrap(async (req, res) => res.json(await builder.buildQuestGraph(String(req.params.questId)))));
  router.get("/scene/:sceneId", wrap(async (req, res) => res.json(await builder.buildSceneNeighborhoodGraph(String(req.params.sceneId), Number(req.query.depth ?? 2)))));
  router.get("/analyze/chapter/:chapterId", wrap(async (req, res) => res.json((await builder.buildChapterGraph(String(req.params.chapterId))).issues)));
  router.get("/analyze/quest/:questId", wrap(async (req, res) => res.json((await builder.buildQuestGraph(String(req.params.questId))).issues)));
  router.get("/chapter/:chapterId/snapshot", wrap(async (req, res) => {
    const graph = await builder.buildChapterGraph(String(req.params.chapterId));
    res.json({ nodes: graph.nodes, edges: graph.edges, stats: graph.stats, issues: graph.issues });
  }));

  router.post("/edit-edge", wrap(async (req, res) => { if (!ensureWrite(res)) return; res.json(await edits.editEdgeTarget(req.body as SceneGraphEditEdgeRequest)); }));
  router.post("/create-scene", wrap(async (req, res) => { if (!ensureWrite(res)) return; res.json(await edits.createConnectedScene(req.body)); }));
  router.post("/delete-edge", wrap(async (req, res) => { if (!ensureWrite(res)) return; res.json(await edits.deleteEdge(req.body)); }));
  router.post("/auto-layout-save", wrap((_req, res) => res.status(403).json({ error: "Auto layout position save is not enabled in Stage 14." })));
  router.post("/branch-draft", wrap(async (req, res) => res.json(await drafts.generateBranchDraft(req.body as GraphBranchDraftRequest))));
  router.post("/apply-branch-draft", wrap(async (_req, res) => res.status(403).json({ error: "Branch draft apply is disabled until explicit approval flow is connected." })));

  return router;
}
