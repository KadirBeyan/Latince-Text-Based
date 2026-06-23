import type { LlmClient } from "../llm/LlmClient";
import { latinEquals, latinSimilarity } from "./LatinNormalizer";
import { classifyLatinError } from "./LatinErrorClassifier";
import {
  buildExactSuccessFeedback,
  buildSimilaritySuccessFeedback,
  buildNearMissFeedback,
  buildFallbackFeedback,
} from "./LatinFeedbackBuilder";
import type { ContentLoader } from "../game/content/ContentLoader";
import type { LatinDetectedError, LatinDifficultyResult } from "./LatinTypes";
import { analyzeLatinErrors, mapDetectedErrorsToTags } from "./LatinErrorAnalyzer";
import { analyzeSentence } from "./LatinSentenceAnalyzer";

export interface LatinEvaluationResult {
  isCorrect: boolean;
  score: number;
  mode: "exact" | "similarity" | "llm" | "fallback";
  feedbackTr: string;
  correctedLatin?: string;
  errorTags: string[];
  grammarNotes: string[];
  vocabularyNotes: string[];
  confidence: number;
  llmError?: string;
  analysisSummary?: string;
  detectedErrors?: LatinDetectedError[];
  difficulty?: LatinDifficultyResult;
}

export async function evaluateTextChallenge(params: {
  playerAnswer: string;
  expectedAnswers: string[];
  prompt: string;
  sceneId: string;
  questId: string;
  playerLevel: number;
  unlockedSkills: string[];
  context?: Record<string, unknown>;
  llmClient?: LlmClient;
  contentLoader?: ContentLoader;
}): Promise<LatinEvaluationResult> {
  const { playerAnswer, expectedAnswers, llmClient } = params;
  const intelligence = params.contentLoader ? (() => { try { const errors = analyzeLatinErrors({ playerAnswer, expectedAnswers, prompt: params.prompt, contentLoader: params.contentLoader! }); const analysis = analyzeSentence({ text: playerAnswer, contentLoader: params.contentLoader!, playerLevel: params.playerLevel }); return { errors, tags: mapDetectedErrorsToTags(errors), analysis }; } catch { return undefined; } })() : undefined;
  const attach = <T extends LatinEvaluationResult>(result: T): T => intelligence ? { ...result, errorTags: [...new Set([...result.errorTags, ...intelligence.tags])], analysisSummary: intelligence.analysis.summaryTr, detectedErrors: intelligence.errors.slice(0, 6), difficulty: intelligence.analysis.difficulty } : result;

  // A) Normalized exact match
  for (const expected of expectedAnswers) {
    if (latinEquals(playerAnswer, expected)) {
      return attach({
        isCorrect: true,
        score: 100,
        mode: "exact",
        feedbackTr: buildExactSuccessFeedback(expected),
        correctedLatin: expected,
        errorTags: [],
        grammarNotes: [],
        vocabularyNotes: [],
        confidence: 1.0,
      });
    }
  }

  // B) Similarity match
  let bestExpected = expectedAnswers[0] || "";
  let bestScore = -1;

  for (const expected of expectedAnswers) {
    const score = latinSimilarity(playerAnswer, expected);
    if (score > bestScore) {
      bestScore = score;
      bestExpected = expected;
    }
  }

  if (bestScore >= 0.92) {
    // Math.round(85 + (bestScore - 0.92) / (1 - 0.92) * 10) -> maps 0.92..1.00 to 85..95
    const score = Math.round(85 + ((bestScore - 0.92) / 0.08) * 10);
    return attach({
      isCorrect: true,
      score,
      mode: "similarity",
      feedbackTr: buildSimilaritySuccessFeedback(playerAnswer, bestExpected, score),
      correctedLatin: bestExpected,
      errorTags: classifyLatinError(playerAnswer, bestExpected),
      grammarNotes: [],
      vocabularyNotes: [],
      confidence: 0.9,
    });
  }

  if (bestScore >= 0.75) {
    // Math.round(50 + (bestScore - 0.75) / (0.91 - 0.75) * 25) -> maps 0.75..0.91 to 50..75
    const score = Math.round(50 + ((bestScore - 0.75) / 0.17) * 25);
    return attach({
      isCorrect: false,
      score,
      mode: "similarity",
      feedbackTr: buildNearMissFeedback(playerAnswer, bestExpected, score),
      correctedLatin: bestExpected,
      errorTags: classifyLatinError(playerAnswer, bestExpected),
      grammarNotes: [],
      vocabularyNotes: [],
      confidence: 0.8,
    });
  }

  // C) LLM evaluation
  if (llmClient) {
    try {
      const evaluationContext = {
        playerAnswer,
        expectedAnswers,
        prompt: params.prompt,
        sceneId: params.sceneId,
        questId: params.questId,
        playerLevel: params.playerLevel,
        unlockedSkills: params.unlockedSkills,
        context: params.context,
      };
      const llmResult = await llmClient.evaluateLatinAnswer(evaluationContext);
      
      // Limit score if confidence is low but marked correct
      let finalScore = llmResult.score;
      let finalConfidence = llmResult.confidence;
      let feedbackTr = llmResult.feedbackTr;
      if (llmResult.isCorrect && llmResult.confidence < 0.5) {
        finalScore = Math.min(finalScore, 70);
      }
      const serious = intelligence?.errors.filter((error) => error.severity === "error") ?? [];
      if (llmResult.isCorrect && serious.length > 0) { finalScore = Math.min(finalScore, 70); finalConfidence = Math.min(finalConfidence, .55); feedbackTr += ` Cevap bağlamda anlaşılabilir, fakat şu form kontrol edilmeli: ${serious[0].messageTr}`; }
      if (!llmResult.isCorrect && intelligence?.tags.includes("word-order-variant")) finalScore = Math.max(finalScore, 55);

      return attach({
        isCorrect: llmResult.isCorrect,
        score: finalScore,
        mode: "llm",
        feedbackTr,
        correctedLatin: llmResult.correctedLatin || bestExpected,
        errorTags: llmResult.errorTags.length > 0 ? llmResult.errorTags : classifyLatinError(playerAnswer, bestExpected),
        grammarNotes: llmResult.grammarNotes || [],
        vocabularyNotes: llmResult.vocabularyNotes || [],
        confidence: finalConfidence,
      });
    } catch (error) {
      const llmError = error instanceof Error ? error.message : String(error);
      console.error("LLM evaluation error:", error);
      const firstExpected = expectedAnswers[0] || "";
      return attach({
        isCorrect: false,
        score: Math.max(0, Math.round(bestScore * 40)),
        mode: "fallback",
        feedbackTr: buildFallbackFeedback(firstExpected),
        correctedLatin: firstExpected,
        errorTags: classifyLatinError(playerAnswer, firstExpected),
        grammarNotes: [],
        vocabularyNotes: [],
        confidence: 0.5,
        llmError,
      });
    }
  }

  // D) Fallback match
  const firstExpected = expectedAnswers[0] || "";
  return attach({
    isCorrect: false,
    score: Math.max(0, Math.round(bestScore * 40)), // scale score in 0-40 range based on similarity
    mode: "fallback",
    feedbackTr: buildFallbackFeedback(firstExpected),
    correctedLatin: firstExpected,
    errorTags: classifyLatinError(playerAnswer, firstExpected),
    grammarNotes: [],
    vocabularyNotes: [],
    confidence: 0.5,
  });
}
