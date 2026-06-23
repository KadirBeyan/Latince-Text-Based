import type { FrequencyBand, LexicalLevel, LexicalPos } from "./LexicalTypes";
import { LexicalRepository } from "./LexicalRepository";

export class LexicalSearchService {
  constructor(private readonly repository: LexicalRepository) {}
  searchLexicon(query: string, options: { limit?: number; pos?: LexicalPos; level?: LexicalLevel } = {}) { return this.repository.search(query, options); }
  searchByMeaning(query: string) { return this.repository.searchByMeaning(query); }
  searchByTag(tag: string) { return this.repository.search("", { limit: 100 }).filter((entry) => entry.pedagogy.tags.includes(tag)); }
  searchByPos(pos: LexicalPos) { return this.repository.search("", { pos, limit: 100 }); }
  searchByLevel(level: LexicalLevel) { return this.repository.findByLevel(level); }
  searchByFrequencyBand(band: FrequencyBand) { return this.repository.findByFrequencyBand(band); }
}
