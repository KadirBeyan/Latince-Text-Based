import { LexicalRepository } from "./LexicalRepository";

export class LexicalStatsService {
  constructor(private readonly repository: LexicalRepository) {}
  getStats() { return this.repository.getStats(); }
}
