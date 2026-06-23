import type { FrequencyBand, LexicalEntry, LexicalLevel, LexicalPos, RawLexicalEntry } from "./LexicalTypes";
import { clamp, normalizeLatinToken, unique } from "./LexicalText";
import { parseFrequencyLine } from "./FrequencyDictionaryParser";

type GrammarInfo = Pick<LexicalEntry, "pos" | "morphology">;

const FUNCTION_WORDS = new Set(["et", "in", "non", "ad", "cum", "sed", "sum", "esse", "ego", "tu", "est", "sunt", "qui", "quae", "quod"]);

export function normalizeRawLexicalEntry(raw: RawLexicalEntry, rank: number): LexicalEntry | null {
  const principalParts = parsePrincipalParts(raw.rawHeadword);
  const lemma = principalParts[0];
  if (!lemma || normalizeLemma(lemma).length < 1) return null;
  const grammar = parseGrammarInfo(raw.rawGrammar);
  const meanings = splitMeanings(raw.rawMeaning);
  if (!meanings.length) return null;
  const parsedFrequency = raw.rawFrequency ? parseFrequencyLine(raw.rawFrequency) : undefined;
  const frequency = buildFrequency(parsedFrequency?.rank ?? rank, parsedFrequency?.count);
  const normalizedLemma = normalizeLemma(lemma);
  const base: LexicalEntry = {
    id: buildLexicalId(lemma, grammar.pos),
    lemma: normalizedLemma,
    displayLemma: lemma,
    normalizedLemma,
    principalParts: unique(principalParts.map(normalizeLemma).filter(Boolean)),
    pos: grammar.pos,
    morphology: grammar.morphology,
    meanings: { en: meanings, shortEn: meanings[0] },
    frequency,
    pedagogy: { estimatedLevel: "advanced", priority: 0, teachAfterGrammarIds: [], usefulChapterIds: [], tags: [] },
    forms: [],
    source: { type: "frequency-dictionary", sourceName: "Latin Frequency Dictionary", sourceRank: frequency.rank, confidence: raw.parseConfidence },
    quality: { parseConfidence: raw.parseConfidence, warnings: [...raw.warnings], needsReview: raw.warnings.length > 0 || raw.parseConfidence < 0.75 }
  };
  base.pedagogy = {
    estimatedLevel: estimatePedagogicalLevel(base),
    priority: calculatePriority(base),
    teachAfterGrammarIds: buildTeachAfterGrammarIds(base),
    usefulChapterIds: buildUsefulChapterIds(base),
    tags: buildPedagogicalTags(base),
    exampleDifficulty: base.frequency.rank && base.frequency.rank <= 500 ? "easy" : base.frequency.rank && base.frequency.rank <= 2000 ? "medium" : "hard"
  };
  return base;
}

export function normalizeLemma(text: string): string {
  return normalizeLatinToken(text.replace(/^[\d.]+/u, "").split(/[;,]/u)[0]);
}

export function parsePrincipalParts(rawHeadword: string): string[] {
  return rawHeadword.split(/[,;]/u).map((part) => part.trim()).filter(Boolean);
}

export function parseGrammarInfo(rawGrammar?: string): GrammarInfo {
  const value = (rawGrammar || "").toLowerCase();
  const morphology: LexicalEntry["morphology"] = {};
  let pos: LexicalPos = "unknown";
  if (/\bv|vt|vi|dep\b/u.test(value)) pos = "verb";
  else if (/\badj\b/u.test(value)) pos = "adjective";
  else if (/\badv\b/u.test(value)) pos = "adverb";
  else if (/\bprep\b/u.test(value)) pos = "preposition";
  else if (/\bconj\b/u.test(value)) pos = "conjunction";
  else if (/\bpron\b/u.test(value)) pos = "pronoun";
  else if (/\bnum\b/u.test(value)) pos = "numeral";
  else if (/\binterj\b/u.test(value)) pos = "interjection";
  else if (/\bparticle\b/u.test(value)) pos = "particle";
  else if (/\b(m|f|n)\b/u.test(value)) pos = "noun";

  if (/\bm\b/u.test(value)) morphology.gender = "masculine";
  if (/\bf\b/u.test(value)) morphology.gender = "feminine";
  if (/\bn\b/u.test(value)) morphology.gender = "neuter";
  if (/1st|\b1\b/u.test(value)) pos === "verb" ? morphology.conjugation = "1" : morphology.declension = "1";
  if (/2nd|\b2\b/u.test(value)) pos === "verb" ? morphology.conjugation = "2" : morphology.declension = "2";
  if (/3rd|\b3\b/u.test(value)) pos === "verb" ? morphology.conjugation = "3" : morphology.declension = "3";
  if (/4th|\b4\b/u.test(value)) pos === "verb" ? morphology.conjugation = "4" : morphology.declension = "4";
  if (/5th|\b5\b/u.test(value)) morphology.declension = "5";
  if (/dep/u.test(value)) morphology.isDeponent = true;
  if (/irreg/u.test(value)) morphology.isIrregular = true;
  return { pos, morphology };
}

export function splitMeanings(rawMeaning: string): string[] {
  return unique(rawMeaning.replace(/^[-–:]+/u, "").split(/;|,(?=\s*[a-z])/iu).map((part) => part.trim()).filter((part) => part.length > 0).slice(0, 6));
}

export function buildFrequency(rank?: number, count?: number): LexicalEntry["frequency"] {
  return { rank, count, band: bandForRank(rank) };
}

export function bandForRank(rank?: number): FrequencyBand {
  if (!rank) return "unknown";
  if (rank <= 100) return "top-100";
  if (rank <= 250) return "top-250";
  if (rank <= 500) return "top-500";
  if (rank <= 1000) return "top-1000";
  if (rank <= 2000) return "top-2000";
  if (rank <= 5000) return "top-5000";
  return "rare";
}

export function estimatePedagogicalLevel(entry: LexicalEntry): LexicalLevel {
  if (FUNCTION_WORDS.has(entry.normalizedLemma)) return "A1";
  const rank = entry.frequency.rank;
  if (!rank) return "advanced";
  if (rank <= 250) return "A1";
  if (rank <= 750) return "A2";
  if (rank <= 2000) return "B1";
  if (rank <= 3500) return "B2";
  return "advanced";
}

export function buildPedagogicalTags(entry: LexicalEntry): string[] {
  const tags = [`frequency:${entry.frequency.band}`, `pos:${entry.pos}`, `level:${entry.pedagogy.estimatedLevel}`];
  if (entry.morphology.declension) tags.push(`declension:${entry.morphology.declension}`);
  if (entry.morphology.conjugation) tags.push(`conjugation:${entry.morphology.conjugation}`);
  for (const chapter of entry.pedagogy.usefulChapterIds) tags.push(`chapter:${chapter}`);
  if (FUNCTION_WORDS.has(entry.normalizedLemma)) tags.push("function-word");
  if (entry.quality.needsReview) tags.push("needs-review");
  return unique(tags);
}

export function buildUsefulChapterIds(entry: LexicalEntry): string[] {
  const text = `${entry.normalizedLemma} ${entry.meanings.en.join(" ")}`.toLowerCase();
  const chapters: string[] = [];
  if (/(school|teach|learn|read|write|book|master|student|ludus)/u.test(text)) chapters.push("ludus");
  if (/(mother|father|house|home|family|domus|girl|boy)/u.test(text)) chapters.push("domus");
  if (/(market|money|buy|sell|trade|merchant|bread|forum)/u.test(text)) chapters.push("forum");
  if (/(book|read|write|letter|library|scribe)/u.test(text)) chapters.push("bibliotheca");
  if (/(soldier|war|camp|command|army)/u.test(text)) chapters.push("castra");
  if (/(road|travel|go|come|place|city|gate)/u.test(text)) chapters.push("via-appia");
  return unique(chapters.length ? chapters : entry.frequency.rank && entry.frequency.rank <= 500 ? ["ludus"] : []);
}

export function calculatePriority(entry: LexicalEntry): number {
  const frequencyScore: Record<FrequencyBand, number> = { "top-100": 50, "top-250": 42, "top-500": 35, "top-1000": 25, "top-2000": 15, "top-5000": 8, rare: 0, unknown: 0 };
  const posScore: Record<LexicalPos, number> = { verb: 16, noun: 15, adjective: 12, preposition: 14, pronoun: 14, adverb: 8, conjunction: 10, interjection: 5, numeral: 7, particle: 8, unknown: 0 };
  const curriculum = FUNCTION_WORDS.has(entry.normalizedLemma) ? 20 : 0;
  const chapter = entry.pedagogy.usefulChapterIds.length * 4;
  const complexity = entry.quality.needsReview ? 8 : entry.morphology.isIrregular ? 5 : 0;
  return clamp(frequencyScore[entry.frequency.band] + (posScore[entry.pos] || 0) + curriculum + chapter - complexity, 0, 100);
}

export function buildLexicalId(lemma: string, pos: LexicalPos): string {
  return `lex-${pos}-${normalizeLemma(lemma)}`;
}

function buildTeachAfterGrammarIds(entry: LexicalEntry): string[] {
  if (entry.pos === "verb") return ["present-active-verbs"];
  if (entry.pos === "noun" && entry.morphology.declension === "1") return ["nominative-basic"];
  if (entry.pos === "noun" && entry.morphology.declension === "2") return ["nominative-basic", "accusative-basic"];
  if (entry.pos === "preposition") return ["basic-prepositions"];
  if (entry.pos === "adjective") return ["adjective-agreement"];
  return [];
}
