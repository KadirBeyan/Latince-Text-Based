import type { ContentLoader } from "../game/content/ContentLoader";
import { findLexicalEntryByLemma } from "./LatinLemmaService";
import type { LatinDifficultyResult, LatinSentenceAnalysis } from "./LatinTypes";
const levelForPlayer = (level = 1): "A1" | "A2" | "B1" | "B2" => level <= 1 ? "A1" : level <= 3 ? "A2" : level <= 6 ? "B1" : "B2";
export function scoreSentenceDifficulty(params: { analysis: LatinSentenceAnalysis; contentLoader: ContentLoader; playerLevel?: number; allowedGrammarIds?: string[]; knownVocabularyIds?: string[] }): LatinDifficultyResult {
  const { analysis } = params; const grammar = new Set<string>(); const vocabulary = new Set<string>(); const reasons: string[] = []; let score = Math.min(30, analysis.tokens.length * 3);
  for (const s of analysis.detectedStructures) { if (s.type === "greeting") grammar.add("greetings"); if (s.type === "sum-esse") grammar.add("sum-esse-present"); if (s.type === "subject-verb-object") { grammar.add("nominative-basic"); grammar.add("accusative-basic"); grammar.add("present-active-verbs"); } if (s.type === "imperative") grammar.add("imperative-basic"); if (s.type === "prepositional-phrase") grammar.add("basic-prepositions"); if (s.type === "noun-adjective-agreement") grammar.add("adjective-agreement"); }
  for (const word of analysis.words) if (word.best?.vocabularyId) vocabulary.add(word.best.vocabularyId);
  const unknown = analysis.words.filter((w) => !w.best || w.best.confidence < .5).length; if (unknown) { score += unknown * 9; reasons.push(`${unknown} biçim düşük güvenle çözümlendi.`); }
  const lexicalPenalty = analysis.words.reduce((sum, word) => { const entry = word.best?.lemma ? findLexicalEntryByLemma(word.best.lemma) : undefined; if (!entry || entry.source.type === "app-core") return sum; if (["top-100", "top-250"].includes(entry.frequency.band)) return sum - 1; if (["top-2000", "top-5000"].includes(entry.frequency.band)) return sum + 3; if (["rare", "unknown"].includes(entry.frequency.band)) return sum + 7; return sum; }, 0); if (lexicalPenalty) { score += lexicalPenalty; reasons.push("Frequency dictionary kelime zorluğu hesaba katıldı."); }
  if (analysis.tokens.length > 10) { score += 25; reasons.push("Cümle 10 kelimeden uzun."); } else if (analysis.tokens.length > 6) { score += 12; reasons.push("Cümle başlangıç düzeyi için uzun."); }
  const normalized = analysis.normalized; if (/\b(ut|qui|quae|quod|cum)\b/u.test(normalized)) { score += 18; reasons.push("Yan/bağlı cümle işareti var."); } if (/(isset|issent|issetis|issetmus|ndus|nda|ndum)\b/u.test(normalized)) { score += 28; reasons.push("İleri kip veya fiilimsi biçimi olası."); }
  if (grammar.has("accusative-basic") || grammar.has("imperative-basic") || grammar.has("basic-prepositions")) score = Math.max(score, 28);
  const allowed = new Set(params.allowedGrammarIds || []); const known = new Set(params.knownVocabularyIds || []);
  const outG = allowed.size ? [...grammar].filter((id) => !allowed.has(id)) : []; const outV = known.size ? [...vocabulary].filter((id) => !known.has(id)) : [];
  score += outG.length * 10 + outV.length * 4; if (outG.length) reasons.push("İzinli gramer kapsamı dışında yapılar var."); if (outV.length) reasons.push("Henüz bilinen listede olmayan kelimeler var.");
  score = Math.max(0, Math.min(100, score)); const level = score < 28 ? "A1" : score < 52 ? "A2" : score < 75 ? "B1" : "B2"; if (!reasons.length) reasons.push("Kısa ve temel bir Latince yapı.");
  return { level, score, reasons, detectedGrammarIds: [...grammar], detectedVocabularyIds: [...vocabulary], outOfLevelGrammarIds: outG, outOfLevelVocabularyIds: outV };
}
export function scoreTextDifficulty(params: { text: string; contentLoader: ContentLoader; playerLevel?: number; allowedGrammarIds?: string[]; knownVocabularyIds?: string[] }): LatinDifficultyResult { const { analyzeSentence } = require("./LatinSentenceAnalyzer") as typeof import("./LatinSentenceAnalyzer"); return analyzeSentence({ text: params.text, contentLoader: params.contentLoader, playerLevel: params.playerLevel, unlockedGrammarIds: params.allowedGrammarIds, knownVocabularyIds: params.knownVocabularyIds }).difficulty; }
export { levelForPlayer };
