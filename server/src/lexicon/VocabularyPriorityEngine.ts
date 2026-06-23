import type { PlayerSave } from "../game/types/gameTypes";
import type { LexicalEntry, LexicalLevel } from "./LexicalTypes";
import { LexicalRepository } from "./LexicalRepository";

export class VocabularyPriorityEngine {
  constructor(private readonly repository: LexicalRepository) {}
  scoreWordForPlayer(entry: LexicalEntry, save: PlayerSave, options: { chapterId?: string } = {}): number {
    const known = new Set([...(save.masteryStates || []).filter((state) => state.targetType === "vocabulary" && state.mastery > 0.75).map((state) => state.targetId)]);
    let score = entry.pedagogy.priority;
    if (known.has(entry.id)) score -= 60;
    if (options.chapterId && entry.pedagogy.usefulChapterIds.includes(options.chapterId)) score += 20;
    if ((save.errorMemory || []).some((err) => err.relatedVocabularyIds?.includes(entry.id))) score += 18;
    if (["rare", "unknown"].includes(entry.frequency.band)) score -= 25;
    return score;
  }
  getNextWordsForPlayer(save: PlayerSave, options: { chapterId?: string; limit?: number; level?: LexicalLevel } = {}): LexicalEntry[] {
    const pool = options.chapterId ? this.repository.findByChapter(options.chapterId) : this.repository.findByRankRange(1, 2000);
    return this.balancePos(pool.filter((entry) => !options.level || entry.pedagogy.estimatedLevel === options.level).sort((a, b) => this.scoreWordForPlayer(b, save, options) - this.scoreWordForPlayer(a, save, options)), options.limit ?? 10);
  }
  getReviewWordsForPlayer(save: PlayerSave, options: { limit?: number } = {}): LexicalEntry[] {
    const weak = (save.masteryStates || []).filter((state) => state.targetType === "vocabulary" && state.mastery < 0.6).map((state) => this.repository.findEntryById(state.targetId)).filter((entry): entry is LexicalEntry => Boolean(entry));
    return weak.slice(0, options.limit ?? 10);
  }
  getChapterVocabularyPlan(chapterId: string, level?: LexicalLevel): LexicalEntry[] { return this.repository.findByChapter(chapterId).filter((entry) => !level || entry.pedagogy.estimatedLevel === level).slice(0, 20); }
  getAssessmentVocabularyPool(params: { minRank?: number; maxRank?: number; level?: LexicalLevel; limit?: number } = {}): LexicalEntry[] { return this.repository.findByRankRange(params.minRank ?? 1, params.maxRank ?? 500).filter((entry) => !params.level || entry.pedagogy.estimatedLevel === params.level).slice(0, params.limit ?? 100); }
  private balancePos(entries: LexicalEntry[], limit: number): LexicalEntry[] { const counts: Record<string, number> = {}; const out: LexicalEntry[] = []; for (const entry of entries) { if ((counts[entry.pos] || 0) >= Math.ceil(limit / 2)) continue; out.push(entry); counts[entry.pos] = (counts[entry.pos] || 0) + 1; if (out.length >= limit) break; } return out; }
}
