import type { ContentLoader } from "../game/content/ContentLoader";
import type { VocabularyItem } from "../game/types/contentTypes";
import { openDatabase, type AppDatabase } from "../db/database";
import { LexicalRepository } from "../lexicon/LexicalRepository";
import type { LexicalEntry } from "../lexicon/LexicalTypes";
import { normalizeToken } from "./LatinTokenizer";
export type LatinVocabularyItem = VocabularyItem;
export type LatinVocabularyIndex = { byLemma: Map<string, LatinVocabularyItem>; byForm: Map<string, LatinVocabularyItem[]>; vocabulary: LatinVocabularyItem[] };
const indexes = new WeakMap<ContentLoader, LatinVocabularyIndex>();
export function getKnownForms(item: LatinVocabularyItem): string[] { return [...new Set([item.latin, ...(item.principalParts || [])].map(normalizeToken).filter(Boolean))]; }
export function buildVocabularyFormIndex(vocabulary: LatinVocabularyItem[]): Map<string, LatinVocabularyItem[]> { const result = new Map<string, LatinVocabularyItem[]>(); for (const item of vocabulary) for (const form of getKnownForms(item)) result.set(form, [...(result.get(form) || []), item]); return result; }
export function loadVocabularyIndex(contentLoader: ContentLoader): LatinVocabularyIndex { const cached = indexes.get(contentLoader); if (cached) return cached; const vocabulary = contentLoader.getContent().vocabulary; const index = { vocabulary, byLemma: new Map(vocabulary.map((item) => [normalizeToken(item.latin), item])), byForm: buildVocabularyFormIndex(vocabulary) }; indexes.set(contentLoader, index); return index; }
export function findByLatinForm(form: string, contentLoader?: ContentLoader): LatinVocabularyItem[] { return contentLoader ? loadVocabularyIndex(contentLoader).byForm.get(normalizeToken(form)) || [] : []; }
export function findByLemma(lemma: string, contentLoader?: ContentLoader): LatinVocabularyItem | undefined { return contentLoader?.getContent().vocabulary.find((item) => normalizeToken(item.latin) === normalizeToken(lemma)); }
let lexicalDb: AppDatabase | undefined;
let lexicalRepository: LexicalRepository | undefined;
function getLexicalRepository(): LexicalRepository | undefined { try { if (!lexicalDb) lexicalDb = openDatabase(); if (!lexicalRepository) lexicalRepository = new LexicalRepository(lexicalDb); return lexicalRepository; } catch { return undefined; } }
export function findLexicalEntryByLemma(lemma: string): LexicalEntry | undefined { return getLexicalRepository()?.findByLemma(lemma) || undefined; }
export function findLexicalEntriesByForm(form: string): Array<{ entry: LexicalEntry; form: LexicalEntry["forms"][number] }> { return getLexicalRepository()?.findByForm(form) || []; }
export function guessLemmaFromForm(form: string): string[] { const value = normalizeToken(form); const guesses = new Set<string>([value]); const replacements: Array<[RegExp, string]> = [[/(arum|is|as|am|ae)$/u, "a"], [/(orum|os|um|o|i)$/u, "us"], [/(orum|is|a|um|o|i)$/u, "um"], [/(amus|atis|ant|as|at)$/u, "o"], [/(emus|etis|ent|es|et)$/u, "eo"], [/(imus|itis|iunt|unt|is|it)$/u, "o"]]; for (const [ending, replacement] of replacements) if (ending.test(value)) guesses.add(value.replace(ending, replacement)); if (value.endsWith("um")) guesses.add(value.slice(0, -2)); return [...guesses].filter(Boolean); }
