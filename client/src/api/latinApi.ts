import { requestJson } from "./gameApi";
import type { GrammarGateResult, LatinDetectedError, LatinDifficultyResult, LatinExercise, LatinSentenceAnalysis, LatinWordAnalysis } from "../types/latinTypes";

export function analyzeWord(token: string): Promise<LatinWordAnalysis> {
  return requestJson<LatinWordAnalysis>("/api/latin/analyze-word", { method: "POST", body: JSON.stringify({ token }) });
}

export function analyzeSentence(params: { text: string; playerLevel?: number; unlockedGrammarIds?: string[]; knownVocabularyIds?: string[] }): Promise<LatinSentenceAnalysis> {
  return requestJson<LatinSentenceAnalysis>("/api/latin/analyze-sentence", { method: "POST", body: JSON.stringify(params) });
}

export function getDifficulty(params: { text: string; playerLevel?: number; allowedGrammarIds?: string[]; knownVocabularyIds?: string[] }): Promise<LatinDifficultyResult> {
  return requestJson<LatinDifficultyResult>("/api/latin/difficulty", { method: "POST", body: JSON.stringify(params) });
}

export function checkGate(params: { text: string; playerLevel?: number; allowedGrammarIds?: string[]; knownVocabularyIds?: string[]; maxSentenceLength?: number }): Promise<GrammarGateResult> {
  return requestJson<GrammarGateResult>("/api/latin/check-gate", { method: "POST", body: JSON.stringify(params) });
}

export function analyzeErrors(params: { playerAnswer: string; expectedAnswers: string[]; prompt?: string; evaluationMode?: "strict" | "normal" | "loose" }): Promise<{ errors: LatinDetectedError[]; tags: string[] }> {
  return requestJson<{ errors: LatinDetectedError[]; tags: string[] }>("/api/latin/analyze-errors", { method: "POST", body: JSON.stringify(params) });
}

export function generateExercises(params: { grammarIds: string[]; vocabularyIds?: string[]; errorTags?: string[]; count?: number; difficulty?: LatinExercise["difficulty"] }): Promise<{ exercises: LatinExercise[] }> {
  return requestJson<{ exercises: LatinExercise[] }>("/api/latin/generate-exercises", { method: "POST", body: JSON.stringify(params) });
}
