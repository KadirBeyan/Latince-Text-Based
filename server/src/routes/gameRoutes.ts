import type { NextFunction, Request, Response, Router } from "express";
import { Router as createRouter } from "express";
import type { GameAction } from "../game/types/gameTypes";
import { ContentLoader } from "../game/content/ContentLoader";
import { ContentValidator } from "../game/content/ContentValidator";
import { GameEngine } from "../game/core/GameEngine";
import type { LlmProviderConfig } from "../llm/LlmTypes";
import type { CharacterCreationInput } from "../game/character/CharacterTypes";
import { LlmProviderFactory } from "../llm/LlmProviderFactory";
import fs from "node:fs";
import path from "node:path";
import type { Campaign, Scene } from "../game/types/gameTypes";
import type { SceneDraftContext } from "../llm/LlmTypes";
import { ContentQualityAnalyzer } from "../game/content/ContentQualityAnalyzer";
import { getRuntimeConfig } from "../config/RuntimeConfig";

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export function createGameRoutes(gameEngine: GameEngine, contentLoader: ContentLoader, contentValidator: ContentValidator): Router {
  const router = createRouter();
  const runtime = getRuntimeConfig();
  const asyncHandler = (handler: RouteHandler): RouteHandler => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

  router.post("/api/game/new", asyncHandler(async (req, res) => {
    const body = req.body as { playerName?: string; campaignId?: string; llmConfig?: LlmProviderConfig };
    if (!body.playerName?.trim()) {
      res.status(400).json({ error: "playerName is required." });
      return;
    }
    const state = await gameEngine.createNewGame(body.playerName.trim(), body.campaignId, body.llmConfig);
    res.status(201).json(state);
  }));

  router.post("/api/game/create-character-save", asyncHandler(async (req, res) => {
    const body = req.body as CharacterCreationInput & { campaignId?: string };
    const state = await gameEngine.createCharacterSave({
      name: body.name,
      origin: body.origin,
      traits: body.traits,
      skillAllocations: body.skillAllocations
    }, body.campaignId);
    res.status(201).json(state);
  }));

  router.get("/api/game/state/:saveId", asyncHandler((req, res) => {
    res.json(gameEngine.getGameState(String(req.params.saveId)));
  }));

  router.post("/api/game/action", asyncHandler(async (req, res) => {
    const body = req.body as { saveId?: string; action?: GameAction; llmConfig?: LlmProviderConfig };
    if (!body.saveId || !body.action) {
      res.status(400).json({ error: "saveId and action are required." });
      return;
    }
    const state = await gameEngine.submitAction(body.saveId, body.action, body.llmConfig);
    res.json(state);
  }));

  router.post("/api/game/reset", asyncHandler((req, res) => {
    const body = req.body as { saveId?: string };
    if (!body.saveId) {
      res.status(400).json({ error: "saveId is required." });
      return;
    }
    res.json(gameEngine.resetGame(body.saveId));
  }));

  router.get("/api/game/saves", asyncHandler((_req, res) => {
    res.json(gameEngine.listSaves());
  }));

  router.get("/api/content/validate", asyncHandler((_req, res) => {
    const content = contentLoader.getContent();
    const validation = contentValidator.validate(content);
    res.json({ ...validation, chapterReports: buildChapterReports(content.campaigns, validation.errors, validation.warnings) });
  }));

  router.get("/api/content/campaigns", asyncHandler((_req, res) => {
    res.json(contentLoader.getContent().campaigns);
  }));
  router.get("/api/content/quality", asyncHandler((_req,res)=>{const analyzer=new ContentQualityAnalyzer(contentLoader);res.json({campaigns:contentLoader.getContent().campaigns.map(c=>analyzer.analyzeCampaign(c))});}));

  router.get("/api/content/latin/grammar", asyncHandler((_req, res) => { res.json(contentLoader.getContent().grammar); }));
  router.get("/api/content/latin/vocabulary", asyncHandler((_req, res) => { res.json(contentLoader.getContent().vocabulary); }));
  router.get("/api/content/latin/examples", asyncHandler((_req, res) => { res.json(contentLoader.getContent().examples); }));

  router.get("/api/game/review/:saveId", asyncHandler((req, res) => { res.json(gameEngine.getReview(String(req.params.saveId))); }));
  router.get("/api/game/session-summary/:saveId", asyncHandler((req,res)=>{try{res.json(gameEngine.getSessionSummary(String(req.params.saveId)));}catch(error){if(error instanceof Error&&error.message.includes("was not found")){res.status(404).json({error:error.message});return;}throw error;}}));

  router.get("/api/game/side-quests/:saveId", asyncHandler((req, res) => {
    res.json(gameEngine.getSideQuestSuggestions(String(req.params.saveId)));
  }));

  router.post("/api/game/side-quests/:saveId/refresh", asyncHandler((req, res) => {
    res.json(gameEngine.refreshSideQuestSuggestions(String(req.params.saveId)));
  }));

  router.post("/api/game/side-quests/:saveId/accept", asyncHandler((req, res) => {
    const { suggestionId } = req.body as { suggestionId?: string };
    if (!suggestionId) {
      res.status(400).json({ error: "suggestionId is required." });
      return;
    }
    res.json(gameEngine.acceptSideQuestSuggestion(String(req.params.saveId), suggestionId));
  }));

  router.post("/api/game/side-quests/:saveId/dismiss", asyncHandler((req, res) => {
    const { suggestionId } = req.body as { suggestionId?: string };
    if (!suggestionId) {
      res.status(400).json({ error: "suggestionId is required." });
      return;
    }
    res.json(gameEngine.dismissSideQuestSuggestion(String(req.params.saveId), suggestionId));
  }));

  const editorGuard: RouteHandler = (_req, res, next) => {
    if (!runtime.enableEditorWrites) { res.status(403).json({ error: "Editor write endpoints are disabled in this runtime." }); return; }
    next();
  };
  router.use("/api/editor", editorGuard);

  router.get("/api/editor/campaigns", asyncHandler((_req, res) => {
    res.json(contentLoader.getContent().campaigns.map(({ id, title, description }) => ({ id, title, description })));
  }));

  router.get("/api/editor/campaigns/:campaignId", asyncHandler((req, res) => {
    const campaign = contentLoader.getCampaign(String(req.params.campaignId));
    if (!campaign) { res.status(404).json({ error: "Campaign not found." }); return; }
    res.json(campaign);
  }));

  router.post("/api/editor/validate-draft", asyncHandler((req, res) => {
    const campaign = req.body as Campaign;
    res.json(contentValidator.validateCampaignDraft(campaign, contentLoader.getContent()));
  }));

  router.put("/api/editor/campaigns/:campaignId", asyncHandler((req, res) => {
    const campaignId = String(req.params.campaignId);
    const campaign = req.body as Campaign;
    if (!campaign || campaign.id !== campaignId) { res.status(400).json({ error: "Campaign id does not match route." }); return; }
    const validation = contentValidator.validateCampaignDraft(campaign, contentLoader.getContent());
    if (!validation.ok) { res.status(422).json(validation); return; }
    const dataRoot = path.resolve(process.cwd(), "data");
    const filePath = path.join(dataRoot, "campaigns", `${campaignId}.json`);
    const backupDir = path.join(dataRoot, "backups");
    fs.mkdirSync(backupDir, { recursive: true });
    if (fs.existsSync(filePath)) fs.copyFileSync(filePath, path.join(backupDir, `${campaignId}.${Date.now()}.json`));
    fs.writeFileSync(filePath, `${JSON.stringify(campaign, null, 2)}\n`, "utf8");
    contentLoader.load();
    res.json({ campaign, validation });
  }));

  router.post("/api/editor/generate-scene-draft", asyncHandler(async (req, res) => {
    const body = req.body as Partial<SceneDraftContext> & { llmConfig?: LlmProviderConfig };
    if (!body.llmConfig || !body.locationId || !body.difficulty) { res.status(400).json({ error: "llmConfig, locationId and difficulty are required." }); return; }
    const context: SceneDraftContext = { grammarIds: body.grammarIds ?? [], vocabularyIds: body.vocabularyIds ?? [], locationId: body.locationId, npcIds: body.npcIds ?? [], difficulty: body.difficulty, count: Math.max(1, Math.min(5, body.count ?? 1)) };
    const client = LlmProviderFactory.createLlmClient(body.llmConfig);
    const generated = await client.generateSceneDraft(context);
    const validation = validateDraftScenes(generated.drafts, contentLoader, contentValidator);
    res.json({ ...generated, validation });
  }));

  router.post("/api/game/narration", asyncHandler(async (req, res) => {
    const body = req.body as { saveId?: string; llmConfig?: LlmProviderConfig };
    if (!body.saveId) {
      res.status(400).json({ error: "saveId is required." });
      return;
    }
    const narration = await gameEngine.generateNarration(body.saveId, body.llmConfig);
    res.json(narration);
  }));

  router.post("/api/game/hint", asyncHandler(async (req, res) => {
    const body = req.body as { saveId?: string; llmConfig?: LlmProviderConfig };
    if (!body.saveId) {
      res.status(400).json({ error: "saveId is required." });
      return;
    }
    const hint = await gameEngine.generateHint(body.saveId, body.llmConfig);
    res.json(hint);
  }));

  router.post("/api/llm/test", asyncHandler(async (req, res) => {
    const body = req.body as LlmProviderConfig;
    if (!body.provider || !body.baseUrl || !body.model) {
      res.status(400).json({ error: "provider, baseUrl, and model are required." });
      return;
    }
    try {
      const client = LlmProviderFactory.createLlmClient(body);
      const response = await client.chat({
        messages: [{ role: "user", content: "Hello. Respond only with the word 'OK'." }],
        temperature: 0.1,
      });
      res.json({ success: true, message: response.text });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }));

  router.get("/api/game/generated-quests/:saveId", asyncHandler((req, res) => {
    res.json({ generatedQuests: gameEngine.listGeneratedQuests(String(req.params.saveId)) });
  }));

  router.get("/api/game/generated-quests/:saveId/:generatedQuestId", asyncHandler((req, res) => {
    const quest = gameEngine.getGeneratedQuest(String(req.params.saveId), String(req.params.generatedQuestId));
    if (!quest) { res.status(404).json({ error: "Generated quest not found." }); return; }
    res.json(quest);
  }));

  router.post("/api/game/generated-quests/:saveId/from-suggestion", asyncHandler(async (req, res) => {
    const { suggestionId, llmConfig } = req.body as { suggestionId?: string; llmConfig?: LlmProviderConfig };
    if (!suggestionId) {
      res.status(400).json({ error: "suggestionId is required." });
      return;
    }
    const state = await gameEngine.generateQuestFromSuggestion(String(req.params.saveId), suggestionId, llmConfig);
    res.json(state);
  }));

  router.post("/api/game/generated-quests/:saveId/generate-review", asyncHandler(async (req, res) => {
    const { grammarIds, vocabularyIds, errorTags, llmConfig } = req.body as { grammarIds?: string[]; vocabularyIds?: string[]; errorTags?: string[]; llmConfig?: LlmProviderConfig };
    const state = await gameEngine.generateReviewQuest(String(req.params.saveId), { grammarIds, vocabularyIds, errorTags }, llmConfig);
    res.json(state);
  }));

  router.post("/api/game/generated-quests/:saveId/accept", asyncHandler((req, res) => {
    const { generatedQuestId } = req.body as { generatedQuestId?: string };
    if (!generatedQuestId) {
      res.status(400).json({ error: "generatedQuestId is required." });
      return;
    }
    res.json(gameEngine.acceptGeneratedQuest(String(req.params.saveId), generatedQuestId));
  }));

  router.post("/api/game/generated-quests/:saveId/dismiss", asyncHandler((req, res) => {
    const { generatedQuestId } = req.body as { generatedQuestId?: string };
    if (!generatedQuestId) {
      res.status(400).json({ error: "generatedQuestId is required." });
      return;
    }
    res.json(gameEngine.dismissGeneratedQuest(String(req.params.saveId), generatedQuestId));
  }));

  router.post("/api/game/generated-quests/:saveId/start", asyncHandler((req, res) => {
    const { generatedQuestId } = req.body as { generatedQuestId?: string };
    if (!generatedQuestId) {
      res.status(400).json({ error: "generatedQuestId is required." });
      return;
    }
    res.json(gameEngine.startGeneratedQuest(String(req.params.saveId), generatedQuestId));
  }));

  return router;
}

function buildChapterReports(campaigns: Campaign[], errors: Array<{ path: string }>, warnings: Array<{ path: string }>) {
  return campaigns.flatMap((campaign) => campaign.chapters.map((chapter) => {
    const scenes = chapter.quests.flatMap((quest) => quest.scenes);
    const chapterIssue = (issue: { path: string }) => issue.path.includes(`chapters.${chapter.id}`) || chapter.quests.some((quest) => issue.path.includes(`quests.${quest.id}`) || quest.scenes.some((scene) => issue.path.includes(`scenes.${scene.id}`)));
    return {
      campaignId: campaign.id,
      chapterId: chapter.id,
      title: chapter.title,
      questCount: chapter.quests.length,
      sceneCount: scenes.length,
      textChallengeCount: scenes.filter((scene) => scene.textChallenge).length,
      choiceSceneCount: scenes.filter((scene) => scene.choices.length > 0).length,
      hybridSceneCount: scenes.filter((scene) => scene.textChallenge && scene.choices.length > 0).length,
      errorCount: errors.filter(chapterIssue).length,
      warningCount: warnings.filter(chapterIssue).length,
    };
  }));
}

function validateDraftScenes(drafts: Scene[], loader: ContentLoader, validator: ContentValidator) {
  const campaign: Campaign = { id: "draft-campaign", title: "Draft", description: "Temporary validation wrapper", startChapterId: "draft-chapter", chapters: [{ id: "draft-chapter", title: "Draft", description: "", startQuestId: "draft-quest", quests: [{ id: "draft-quest", title: "Draft", description: "", startSceneId: drafts[0]?.id ?? "missing", scenes: drafts, rewards: [], statusConditions: [] }] }] };
  return validator.validateCampaignDraft(campaign, loader.getContent());
}
