import { Router, type NextFunction, type Request, type Response } from "express";
import type { ContentLoader } from "../game/content/ContentLoader";
import { LatinIntelligenceService } from "../latin/LatinIntelligenceService";
import { mapDetectedErrorsToTags } from "../latin/LatinErrorAnalyzer";
import { evaluateDialogueResponse } from "../latin/SemanticLatinEvaluator";

export function createLatinRoutes(contentLoader: ContentLoader) {
  const router = Router();
  const service = new LatinIntelligenceService(contentLoader);
  const wrap = (fn: (req: Request, res: Response) => void) => (req: Request, res: Response, next: NextFunction) => { try { fn(req, res); } catch (error) { next(error); } };
  
  router.post("/analyze-word", wrap((req, res) => { const token = typeof req.body?.token === "string" ? req.body.token : ""; if (!token.trim()) { res.status(400).json({ error: "token is required." }); return; } res.json(service.analyzeWord(token)); }));
  router.post("/analyze-sentence", wrap((req, res) => { const { text, playerLevel, unlockedGrammarIds, knownVocabularyIds } = req.body || {}; if (typeof text !== "string") { res.status(400).json({ error: "text is required." }); return; } res.json(service.analyzeSentence(text, { playerLevel, unlockedGrammarIds, knownVocabularyIds })); }));
  router.post("/difficulty", wrap((req, res) => { const { text, playerLevel, allowedGrammarIds, knownVocabularyIds } = req.body || {}; if (typeof text !== "string") { res.status(400).json({ error: "text is required." }); return; } res.json(service.scoreDifficulty(text, { playerLevel, allowedGrammarIds, knownVocabularyIds })); }));
  router.post("/check-gate", wrap((req, res) => { const { text, playerLevel, allowedGrammarIds, knownVocabularyIds, maxSentenceLength } = req.body || {}; if (typeof text !== "string") { res.status(400).json({ error: "text is required." }); return; } res.json(service.checkGrammarGate(text, { playerLevel, allowedGrammarIds, knownVocabularyIds, maxSentenceLength })); }));
  router.post("/analyze-errors", wrap((req, res) => { const { playerAnswer, expectedAnswers, prompt, evaluationMode } = req.body || {}; if (typeof playerAnswer !== "string" || !Array.isArray(expectedAnswers)) { res.status(400).json({ error: "playerAnswer and expectedAnswers are required." }); return; } const errors = service.analyzeErrors({ playerAnswer, expectedAnswers, prompt, evaluationMode }); res.json({ errors, tags: mapDetectedErrorsToTags(errors) }); }));
  router.post("/generate-exercises", wrap((req, res) => { const { grammarIds, vocabularyIds, errorTags, count, difficulty } = req.body || {}; if (!Array.isArray(grammarIds)) { res.status(400).json({ error: "grammarIds is required." }); return; } res.json({ exercises: service.generateExercises({ grammarIds, vocabularyIds, errorTags, count: typeof count === "number" ? count : 5, difficulty: ["intro", "practice", "review", "challenge"].includes(difficulty) ? difficulty : "practice" }) }); }));

  router.post("/evaluate-dialogue-response", wrap(async (req, res) => {
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

  return router;
}

