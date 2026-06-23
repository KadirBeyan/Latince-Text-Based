export type LatinPos = "noun" | "verb" | "adjective" | "adverb" | "pronoun" | "preposition" | "conjunction" | "interjection" | "particle" | "unknown";
export type LatinDifficultyLevel = "A1" | "A2" | "B1" | "B2" | "unknown";

export type LatinToken = { raw: string; normalized: string; index: number; start?: number; end?: number };
export type LatinFormCandidate = { lemma: string; pos: LatinPos; confidence: number; source: string; features?: Record<string, string | undefined>; meaningTr?: string; vocabularyId?: string };
export type LatinAnalysisWarning = { code: string; messageTr: string };
export type LatinWordAnalysis = { token: LatinToken; candidates: LatinFormCandidate[]; best?: LatinFormCandidate; warnings: LatinAnalysisWarning[] };
export type LatinDetectedError = { tag: string; severity: "info" | "warning" | "error"; messageTr: string; token?: string; expected?: string; actual?: string; relatedGrammarIds?: string[] };
export type LatinDetectedStructure = { type: string; confidence: number; explanationTr: string; relatedGrammarIds?: string[] };
export type LatinDifficultyResult = { level: LatinDifficultyLevel; score: number; reasons: string[]; detectedGrammarIds: string[]; detectedVocabularyIds: string[]; outOfLevelGrammarIds: string[]; outOfLevelVocabularyIds: string[] };
export type LatinSentenceAnalysis = { original: string; normalized: string; tokens: LatinToken[]; words: LatinWordAnalysis[]; detectedStructures: LatinDetectedStructure[]; possibleErrors: LatinDetectedError[]; difficulty: LatinDifficultyResult; summaryTr: string };
export type GrammarGateResult = { ok: boolean; level: Exclude<LatinDifficultyLevel, "unknown">; violations: Array<{ type: "grammar" | "vocabulary" | "length" | "unknown-form"; id?: string; token?: string; messageTr: string }>; safeSuggestion?: string };
export type LatinExercise = { id: string; type: "translate-to-latin" | "choose-form" | "fill-blank" | "parse-word"; promptTr: string; expectedAnswers: string[]; choices?: string[]; grammarIds: string[]; vocabularyIds: string[]; difficulty: "intro" | "practice" | "review" | "challenge"; explanationTr?: string };
