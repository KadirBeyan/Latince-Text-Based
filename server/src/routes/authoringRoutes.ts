import { Router, type NextFunction, type Request, type Response } from "express";
import type { RuntimeConfig } from "../config/RuntimeConfig";
import { AuthoringContentService } from "../authoring/AuthoringContentService";
import { AuthoringDraftService } from "../authoring/AuthoringDraftService";
import { AuthoringFileService } from "../authoring/AuthoringFileService";
import { AuthoringPreviewService } from "../authoring/AuthoringPreviewService";
import { AuthoringValidationService } from "../authoring/AuthoringValidationService";
import { createSceneGraphRoutes } from "./sceneGraphRoutes";
import type { AuthoringContentKind, LlmDraftRequest } from "../authoring/AuthoringTypes";
import { ContentOverrideService } from "../content/ContentOverrideService";
import { evaluateDialogueResponse } from "../latin/SemanticLatinEvaluator";
import { LlmProviderFactory } from "../llm/LlmProviderFactory";
import { safeJsonParse } from "../llm/JsonRepair";

type Handler = (req: Request, res: Response) => unknown | Promise<unknown>;

export function createAuthoringRoutes(params: { runtime: RuntimeConfig }): Router {
  const router = Router();
  const fileService = new AuthoringFileService();
  const validationService = new AuthoringValidationService();
  const overrideService = new ContentOverrideService({ appDataDir: params.runtime.appDataDir });
  const contentService = new AuthoringContentService(fileService, validationService, overrideService);
  const draftService = new AuthoringDraftService(validationService);
  const previewService = new AuthoringPreviewService();
  const wrap = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(handler(req, res)).catch(next);
  const requireStudio: Handler = (_req, res) => {
    if (!params.runtime.enableAuthoringStudio) res.status(403).json({ error: "Authoring Studio is disabled." });
  };
  const ensureWrite = (res: Response): boolean => {
    if (!params.runtime.enableAuthoringWrites) {
      res.status(403).json({ error: "Authoring writes are disabled in this runtime mode." });
      return false;
    }
    return true;
  };

  router.use((req, res, next) => {
    if (!params.runtime.enableAuthoringStudio) {
      res.status(403).json({ error: "Authoring Studio is disabled." });
      return;
    }
    next();
  });

  router.get("/tree", wrap(async (_req, res) => res.json(await contentService.getAuthoringTree())));
  router.use("/graph", createSceneGraphRoutes({ runtime: params.runtime }));
  router.get("/documents", wrap(async (req, res) => res.json(await contentService.listDocuments(req.query.kind as AuthoringContentKind | undefined))));
  router.get("/document", wrap(async (req, res) => res.json(await contentService.getDocument({ kind: String(req.query.kind) as AuthoringContentKind, pathOrId: String(req.query.pathOrId ?? "") }))));
  router.put("/document", wrap(async (req, res) => {
    if (!ensureWrite(res)) return;
    res.json(await contentService.saveDocument({ kind: req.body.kind, path: req.body.path, data: req.body.data, validateBeforeSave: req.body.validateBeforeSave !== false, createBackup: req.body.createBackup !== false, allowErrorOverride: req.body.allowErrorOverride === true && !params.runtime.isProduction }));
  }));
  router.delete("/document", wrap(async (req, res) => {
    if (!ensureWrite(res)) return;
    res.json(await contentService.deleteDocument({ kind: req.body.kind, path: req.body.path, createBackup: req.body.createBackup !== false }));
  }));
  router.post("/document/duplicate", wrap(async (req, res) => {
    if (!ensureWrite(res)) return;
    res.json(await contentService.duplicateDocument({ kind: req.body.kind, sourcePath: req.body.sourcePath, newId: req.body.newId }));
  }));
  router.post("/validate", wrap(async (req, res) => {
    if (req.body?.data && req.body?.kind) {
      res.json(validationService.validateDocument({ id: String(req.body.data.id ?? "draft"), kind: req.body.kind, title: String(req.body.data.titleTr ?? req.body.data.title ?? req.body.data.id ?? "Draft"), path: req.body.path ?? "draft", data: req.body.data }));
      return;
    }
    if (req.body?.kind && req.body?.path) {
      const doc = await contentService.getDocument({ kind: req.body.kind, pathOrId: req.body.path });
      res.json(validationService.validateDocument(doc));
      return;
    }
    res.json(validationService.validateAllContent());
  }));
  router.get("/validate/all", wrap(async (_req, res) => res.json(validationService.validateAllContent())));
  router.get("/metrics", wrap(async (_req, res) => {
    const validation = validationService.validateAllContent();
    const fieldPathCounts = [...validation.errors, ...validation.warnings, ...validation.info]
      .filter((issue) => issue.path)
      .reduce<Record<string, number>>((acc, issue) => ({ ...acc, [issue.path!]: (acc[issue.path!] ?? 0) + 1 }), {});
    res.json({
      ...validationService.getMetrics(),
      rawJsonFieldCount: 0,
      overrideContentCount: (await overrideService.listOverrides()).length,
      previewSessionsActive: previewService.getActivePreviewCount(),
      validationFieldFocusSupport: "enabled",
      topFieldPaths: Object.entries(fieldPathCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([path, count]) => ({ path, count })),
    });
  }));
  router.post("/suggest-learning-focus", wrap(async (req, res) => {
    const text = [req.body?.text, ...(req.body?.expectedAnswers ?? [])].join(" ").toLowerCase();
    const content = validationService["contentLoader"].load();
    const grammarIds = content.grammar.filter((item) => text.includes(item.title.toLowerCase()) || text.includes(item.titleTr?.toLowerCase?.() ?? "")).slice(0, 8).map((item) => item.id);
    const vocabularyIds = content.vocabulary.filter((item) => text.includes(item.latin.toLowerCase()) || text.includes(item.turkish.toLowerCase())).slice(0, 16).map((item) => item.id);
    res.json({ grammarIds, vocabularyIds, skillIds: [], confidence: grammarIds.length || vocabularyIds.length ? 0.68 : 0.25, warnings: grammarIds.length || vocabularyIds.length ? [] : ["Metinden guvenilir focus onerisi cikmadi."] });
  }));
  router.post("/llm-draft", wrap(async (req, res) => {
    if (!params.runtime.enableLlmDrafts) {
      res.status(403).json({ error: "LLM drafts are disabled in this runtime mode." });
      return;
    }
    res.json(await draftService.generateDraft(req.body as LlmDraftRequest));
  }));
  router.post("/preview/scene", wrap(async (req, res) => res.json(previewService.previewScene(req.body.scene, req.body.saveId))));
  router.post("/preview/session/scene", wrap(async (req, res) => res.json(await previewService.createPreviewSessionFromScene(req.body.sceneId, { saveId: req.body.saveId, useLlm: req.body.useLlm, llmConfig: req.body.llmConfig }))));
  router.post("/preview/session/quest", wrap(async (req, res) => res.json(await previewService.createPreviewSessionFromQuest(req.body.questId, { saveId: req.body.saveId, useLlm: req.body.useLlm, llmConfig: req.body.llmConfig }))));
  router.post("/preview/session/draft-scene", wrap(async (req, res) => res.json(await previewService.createPreviewSessionFromDraftScene(req.body.sceneDraft, { useLlm: req.body.useLlm, llmConfig: req.body.llmConfig }))));
  router.get("/preview/session/:previewId", wrap(async (req, res) => res.json(previewService.getPreviewState(String(req.params.previewId)))));
  router.post("/preview/session/:previewId/action", wrap(async (req, res) => res.json(await previewService.processPreviewAction(String(req.params.previewId), req.body.action))));
  router.post("/preview/session/:previewId/reset", wrap(async (req, res) => res.json(previewService.resetPreview(String(req.params.previewId)))));
  router.delete("/preview/session/:previewId", wrap(async (req, res) => res.json(previewService.discardPreview(String(req.params.previewId)))));
  router.post("/playtest/start", wrap(async (req, res) => res.json(await previewService.createPreviewSaveFromScene(req.body.sceneId))));
  router.post("/playtest/action", wrap(async (req, res) => res.json(await previewService.runPreviewAction(req.body.previewId, req.body.action))));
  router.post("/playtest/discard", wrap(async (req, res) => res.json(previewService.discardPreviewSave(req.body.previewId))));
  router.get("/overrides", wrap(async (_req, res) => res.json(await overrideService.listOverrides())));
  router.get("/overrides/export", wrap(async (_req, res) => res.json(await overrideService.exportOverrides())));
  router.post("/overrides/import", wrap(async (req, res) => res.json(await overrideService.importOverrides(req.body))));
  router.post("/overrides/reset", wrap(async (req, res) => res.json(await overrideService.resetOverride(String(req.body.relativePath ?? req.body.path ?? "")))));
  router.post("/overrides/reset-all", wrap(async (_req, res) => res.json(await overrideService.resetAllOverrides())));
  router.get("/backups", wrap(async (_req, res) => res.json(await fileService.listBackups())));
  router.post("/backups/restore", wrap(async (req, res) => {
    if (!ensureWrite(res)) return;
    res.json(await fileService.restoreBackup(String(req.body.backupPath), String(req.body.targetPath)));
  }));

  router.post("/dialogue/test-response", wrap(async (req, res) => {
    const { answer, challenge, sceneContext, playerContext, llmConfig } = req.body || {};
    if (typeof answer !== "string" || !challenge) {
      res.status(400).json({ error: "answer and challenge are required." });
      return;
    }
    const result = await evaluateDialogueResponse({
      answer,
      challenge,
      sceneContext: sceneContext || { sceneId: "test-scene" },
      playerContext: playerContext || {},
      llmConfig,
    });
    res.json(result);
  }));

  router.post("/dialogue/suggest-variants", wrap(async (req, res) => {
    const { canonicalAnswers, targetMeaningTr, llmConfig } = req.body || {};
    if (!Array.isArray(canonicalAnswers) || canonicalAnswers.length === 0) {
      res.status(400).json({ error: "canonicalAnswers is required and cannot be empty." });
      return;
    }

    if (llmConfig) {
      try {
        const client = LlmProviderFactory.createLlmClient(llmConfig);
        const systemPrompt = `Sen bir Antik Romalı Magister ve Latince gramer/semantik uzmanısın.
Verilen canonicalAnswers (ana doğru cevaplar) ve targetMeaningTr (Türkçe hedeflenen anlam) bilgilerine göre, Latince'de kelime sırası varyasyonları, eşanlamlı kelimeler veya benzer dilbilgisel yapılarla kurulabilecek alternatif doğru Latince cümleler/varyasyonlar (variants) öner.
Görüşlerini ve önerilerini sadece bir JSON dizisi olarak dön. Başka hiçbir açıklama metni veya markdown kod bloğu ekleme!
Örnek çıktı formatı: ["alternatif1", "alternatif2", "alternatif3"]`;

        const userPrompt = JSON.stringify({ canonicalAnswers, targetMeaningTr });
        const response = await client.chat({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.3,
          responseFormat: "json"
        });

        const parsed = safeJsonParse<string[]>(response.text);
        if (Array.isArray(parsed)) {
          res.json({ variants: parsed });
          return;
        }
      } catch (err) {
        console.error("LLM suggest-variants failed, falling back:", err);
      }
    }

    const suggestions: string[] = [];
    for (const ans of canonicalAnswers) {
      const clean = ans.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
      const parts = clean.split(/\s+/);
      if (parts.length === 3 && parts[0].toLowerCase() === "ego" && parts[1].toLowerCase() === "sum") {
        suggestions.push(`${parts[2]} sum`);
      } else if (parts.length === 2 && parts[1].toLowerCase() === "sum") {
        suggestions.push(`ego sum ${parts[0]}`);
      }
    }
    res.json({ variants: [...new Set(suggestions)] });
  }));

  router.post("/interaction/test-intent", wrap(async (req, res) => {
    const { scene, intentId, answer, saveId, llmConfig } = req.body || {};
    if (!scene || !intentId) {
      res.status(400).json({ error: "scene and intentId are required." });
      return;
    }

    let intent: any;
    if (scene.interactionModel?.intents) {
      intent = scene.interactionModel.intents.find((i: any) => i.id === intentId);
    }
    if (!intent && scene.dialogueSequence?.turns) {
      for (const turn of scene.dialogueSequence.turns) {
        intent = turn.intents?.find((i: any) => i.id === intentId);
        if (intent) break;
      }
    }

    if (!intent) {
      res.status(404).json({ error: `Intent ${intentId} not found in scene.` });
      return;
    }

    const challenge = {
      mode: "dialogue-response" as const,
      speakerNpcId: intent.speakerNpcId || scene.npcIds?.[0],
      npcPromptLatin: scene.npcLineLatin || scene.interactionModel?.npcLineLatin,
      npcPromptTr: scene.npcLineTr || scene.interactionModel?.npcLineTr,
      playerIntentTr: intent.playerIntentTr || intent.labelTr,
      targetMeaningTr: intent.targetMeaningTr || "",
      canonicalAnswers: intent.canonicalAnswers || [],
      acceptedVariants: intent.acceptedVariants || [],
      rejectedMeanings: intent.rejectedMeanings || [],
      grammarFocusIds: intent.grammarFocusIds || [],
      vocabularyFocusIds: intent.vocabularyFocusIds || [],
      successNextSceneId: intent.successNextSceneId,
      failureNextSceneId: intent.failureNextSceneId,
      retryAllowed: intent.failureBehavior === "retry",
      evaluation: {
        allowEquivalentMeaning: true,
        allowWordOrderVariation: true,
        requireContextMatch: true,
        useLlmSemanticJudge: true,
        minimumConfidence: 0.5
      },
      reactions: intent.responseReactions
    };

    const result = await evaluateDialogueResponse({
      answer: answer || "",
      challenge,
      sceneContext: { sceneId: scene.id || "test-scene" },
      playerContext: {},
      llmConfig,
    });

    res.json(result);
  }));

  router.post("/interaction/suggest-from-choices", wrap(async (req, res) => {
    const { scene } = req.body || {};
    if (!scene || !Array.isArray(scene.choices)) {
      res.status(400).json({ error: "scene with choices is required." });
      return;
    }

    const suggestedIntents: any[] = [];
    for (const [idx, choice] of scene.choices.entries()) {
      let verb: string = "custom";
      const label = choice.label.toLowerCase();
      if (label.includes("konuş") || label.includes("söyle") || label.includes("anlat")) {
        verb = "speak";
      } else if (label.includes("sor") || label.includes("istemiş")) {
        verb = "ask";
      } else if (label.includes("incele") || label.includes("bak") || label.includes("oku")) {
        verb = "inspect";
      } else if (label.includes("dinle")) {
        verb = "listen";
      } else if (label.includes("bekle")) {
        verb = "wait";
      } else if (label.includes("yaklaş")) {
        verb = "approach";
      } else if (label.includes("uzaklaş") || label.includes("git") || label.includes("ayrıl")) {
        verb = "leave";
      }

      suggestedIntents.push({
        id: choice.id || `intent_${idx}`,
        labelTr: choice.label,
        descriptionTr: choice.description,
        verb,
        requiresLatin: false,
        conditions: choice.conditions || [],
        effects: choice.effects || [],
        nextSceneId: choice.nextSceneId
      });
    }

    res.json({ intents: suggestedIntents });
  }));

  router.post("/interaction/suggest-intents", wrap(async (req, res) => {
    const { sceneContext, npcIds, grammarFocusIds, vocabularyFocusIds, difficulty, llmConfig } = req.body || {};
    
    if (llmConfig) {
      try {
        const client = LlmProviderFactory.createLlmClient(llmConfig);
        const systemPrompt = `Sen bir Antik Roma temalı RPG ve Latince eğitim oyunu içerik tasarımcısısın.
Kullanıcıya, verilen sahne bağlamı (sceneContext), NPC'ler ve dilbilgisi/kelime hedefleri doğrultusunda oyuncunun seçebileceği 3-4 farklı InteractionIntent taslağı öner.
Her bir intent için: id, labelTr, descriptionTr, verb (speak, ask, inspect, listen, wait, approach, leave, persuade, bargain, remember, read vb.), requiresLatin (true/false) alanlarını doldur.
requiresLatin true ise targetMeaningTr ve canonicalAnswers ekle.
requiresLatin false ise resolution (revealedTextTr vb.) ekle.
Görüşlerini ve önerilerini sadece bir JSON objesi olarak dön, başka açıklama ekleme!
Şema: { "intents": [...] }`;

        const userPrompt = JSON.stringify({ sceneContext, npcIds, grammarFocusIds, vocabularyFocusIds, difficulty });
        const response = await client.chat({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          responseFormat: "json"
        });

        const parsed = safeJsonParse<{ intents: any[] }>(response.text);
        if (parsed && Array.isArray(parsed.intents)) {
          res.json(parsed);
          return;
        }
      } catch (err) {
        console.error("LLM suggest-intents failed, falling back:", err);
      }
    }

    const fallbackIntents = [
      {
        id: "inspect_surroundings",
        labelTr: "Çevreyi incele",
        descriptionTr: "Etrafta ilginç bir şeyler var mı bak.",
        verb: "inspect",
        requiresLatin: false,
        resolution: {
          resultNarrationTr: "Etrafı inceliyorsun ama sıra dışı bir şey göremiyorsun."
        }
      },
      {
        id: "wait_npc",
        labelTr: "Sessizce bekle",
        descriptionTr: "Karşıdakinin konuşmaya devam etmesini bekle.",
        verb: "wait",
        requiresLatin: false
      }
    ];

    res.json({ intents: fallbackIntents });
  }));

  void requireStudio;
  return router;
}
