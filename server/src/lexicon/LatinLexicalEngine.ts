import type { ContentLoader } from "../game/content/ContentLoader";
import type { PlayerSave } from "../game/types/gameTypes";
import type { LexicalEntry, LexicalForm, LexicalLookupResult, LexicalLevel } from "./LexicalTypes";
import { normalizeLatinToken } from "./LexicalText";
import { LexicalRepository } from "./LexicalRepository";
import { VocabularyPriorityEngine } from "./VocabularyPriorityEngine";

export class LatinLexicalEngine {
  constructor(private readonly repository: LexicalRepository, private readonly contentLoader: ContentLoader) {}

  async lookup(query: string): Promise<LexicalLookupResult> {
    const normalizedQuery = normalizeLatinToken(query);
    const appMatches = this.contentLoader.getContent().vocabulary.filter((item) => normalizeLatinToken(item.latin) === normalizedQuery).map((item) => this.appVocabularyToEntry(item));
    const dbLemma = this.repository.findByNormalizedLemma(normalizedQuery);
    const exactLemmaMatches = [...appMatches, ...(dbLemma ? [dbLemma] : [])];
    const formMatches = this.repository.findByForm(query);
    const fuzzyMatches = exactLemmaMatches.length || formMatches.length ? [] : this.repository.search(query, { limit: 8 });
    const best = exactLemmaMatches[0] ? { entry: exactLemmaMatches[0], confidence: exactLemmaMatches[0].source.type === "app-core" ? 0.99 : 0.92, reason: "exact lemma match" } : formMatches[0] ? { entry: formMatches[0].entry, form: formMatches[0].form, confidence: formMatches[0].form.confidence, reason: "inflected form match" } : fuzzyMatches[0] ? { entry: fuzzyMatches[0], confidence: 0.45, reason: "fuzzy lemma match" } : undefined;
    return { query, normalizedQuery, exactLemmaMatches, formMatches, fuzzyMatches, best };
  }

  async analyzeForm(form: string): Promise<{ form: string; candidates: Array<{ entry: LexicalEntry; form?: LexicalForm; confidence: number; explanationTr: string }>; best?: { entry: LexicalEntry; form?: LexicalForm; confidence: number; explanationTr: string } }> {
    const lookup = await this.lookup(form);
    const candidates = [
      ...lookup.exactLemmaMatches.map((entry) => ({ entry, confidence: entry.source.type === "app-core" ? 0.99 : 0.9, explanationTr: `${entry.displayLemma} lemma olarak bulundu.` })),
      ...lookup.formMatches.map(({ entry, form: lexicalForm }) => ({ entry, form: lexicalForm, confidence: lexicalForm.confidence, explanationTr: `${form} biçimi ${entry.displayLemma} lemma'sına ait olabilir.` }))
    ].sort((a, b) => b.confidence - a.confidence);
    return { form, candidates, best: candidates[0] };
  }

  async getEntryByLemma(lemma: string): Promise<LexicalEntry | null> { return (await this.lookup(lemma)).best?.entry ?? null; }
  async getEntriesForLevel(level: LexicalLevel): Promise<LexicalEntry[]> { return this.repository.findByLevel(level); }
  async getTopFrequencyEntries(limit: number): Promise<LexicalEntry[]> { return this.repository.findByRankRange(1, Math.max(1, limit)).slice(0, limit); }
  async getVocabularyForChapter(chapterId: string, options: { level?: LexicalLevel; limit?: number } = {}): Promise<LexicalEntry[]> { return this.repository.findByChapter(chapterId).filter((entry) => !options.level || entry.pedagogy.estimatedLevel === options.level).slice(0, options.limit ?? 20); }
  async getUnknownWordsInText(text: string, knownVocabularyIds: string[] = []): Promise<Array<{ token: string; entry?: LexicalEntry; isRare: boolean }>> {
    const known = new Set(knownVocabularyIds);
    const tokens = text.match(/[A-Za-zĀ-ȳ]+/gu) || [];
    const out: Array<{ token: string; entry?: LexicalEntry; isRare: boolean }> = [];
    for (const token of tokens) {
      const lookup = await this.lookup(token);
      const entry = lookup.best?.entry;
      if (!entry || !known.has(entry.id)) out.push({ token, entry, isRare: !entry || ["top-5000", "rare", "unknown"].includes(entry.frequency.band) });
    }
    return out;
  }
  async getRecommendedWordsForPlayer(save: PlayerSave, options: { chapterId?: string; limit?: number } = {}): Promise<LexicalEntry[]> { return new VocabularyPriorityEngine(this.repository).getNextWordsForPlayer(save, options); }
  async explainWordForStudent(lemma: string): Promise<{ lemma: string; meaningTrOrEn: string; whyUsefulTr: string; formsToLearn: string[]; examples: string[] } | null> {
    const entry = await this.getEntryByLemma(lemma);
    if (!entry) return null;
    return { lemma: entry.displayLemma, meaningTrOrEn: entry.meanings.shortTr || entry.meanings.shortEn || entry.meanings.en[0] || "?", whyUsefulTr: `${entry.frequency.band} sıklığında, ${entry.pedagogy.estimatedLevel} için ${entry.pedagogy.priority}/100 öncelikli.`, formsToLearn: entry.forms.slice(0, 8).map((item) => item.form), examples: [] };
  }

  private appVocabularyToEntry(item: ReturnType<ContentLoader["getContent"]>["vocabulary"][number]): LexicalEntry {
    return { id: item.id, lemma: normalizeLatinToken(item.latin), displayLemma: item.latin, normalizedLemma: normalizeLatinToken(item.latin), principalParts: item.principalParts || [], pos: (item.pos as LexicalEntry["pos"]) || "unknown", morphology: { gender: (item.gender as LexicalEntry["morphology"]["gender"]) || undefined, declension: (item.declension as LexicalEntry["morphology"]["declension"]) || undefined }, meanings: { en: [], tr: [item.turkish], shortTr: item.turkish }, frequency: { band: "unknown" }, pedagogy: { estimatedLevel: Number(item.level) <= 1 ? "A1" : Number(item.level) <= 3 ? "A2" : "B1", priority: 100, teachAfterGrammarIds: [], usefulChapterIds: [], tags: ["source:app-core", ...item.tags] }, forms: [], source: { type: "app-core", confidence: 1 }, quality: { parseConfidence: 1, warnings: [], needsReview: false } };
  }
}
