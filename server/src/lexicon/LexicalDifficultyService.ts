import type { PlayerSave } from "../game/types/gameTypes";
import type { LexicalEntry, LexicalLevel } from "./LexicalTypes";
import { LatinLexicalEngine } from "./LatinLexicalEngine";

export class LexicalDifficultyService {
  constructor(private readonly engine: LatinLexicalEngine) {}
  scoreWordDifficulty(entry: LexicalEntry): number { const rank = entry.frequency.rank; if (!rank) return 80; if (rank <= 250) return 12; if (rank <= 500) return 24; if (rank <= 1000) return 42; if (rank <= 2000) return 58; if (rank <= 5000) return 74; return 90; }
  async scoreTextLexicalDifficulty(text: string, save?: PlayerSave): Promise<{ score: number; unknownWords: string[]; rareWords: string[]; reasons: string[] }> {
    const tokens = text.match(/[A-Za-zĀ-ȳ]+/gu) || [];
    const scores: number[] = [];
    const unknownWords: string[] = [];
    const rareWords: string[] = [];
    for (const token of tokens) { const entry = (await this.engine.lookup(token)).best?.entry; if (!entry) { unknownWords.push(token); scores.push(85); continue; } const score = this.scoreWordDifficulty(entry); scores.push(score); if (score >= 74) rareWords.push(token); }
    const score = Math.round(scores.reduce((sum, value) => sum + value, 0) / Math.max(1, scores.length));
    const known = save ? new Set((save.masteryStates || []).filter((state) => state.targetType === "vocabulary" && state.mastery > 0.75).map((state) => state.targetId)) : undefined;
    const reasons = [`Lexical score ${score}.`];
    if (unknownWords.length) reasons.push(`${unknownWords.length} unknown token.`);
    if (rareWords.length) reasons.push(`${rareWords.length} rare/out-of-level token.`);
    if (known?.size) reasons.push(`${known.size} mastered vocabulary ids considered.`);
    return { score, unknownWords, rareWords, reasons };
  }
  async detectOutOfLevelVocabulary(text: string, allowedLevel: LexicalLevel): Promise<string[]> { const order: LexicalLevel[] = ["A1", "A2", "B1", "B2", "advanced"]; const allowed = order.indexOf(allowedLevel); const tokens = text.match(/[A-Za-zĀ-ȳ]+/gu) || []; const out: string[] = []; for (const token of tokens) { const entry = (await this.engine.lookup(token)).best?.entry; if (entry && order.indexOf(entry.pedagogy.estimatedLevel) > allowed) out.push(token); } return out; }
  async detectRareWords(text: string): Promise<string[]> { return (await this.scoreTextLexicalDifficulty(text)).rareWords; }
  async detectUnknownWords(text: string): Promise<string[]> { return (await this.scoreTextLexicalDifficulty(text)).unknownWords; }
}
