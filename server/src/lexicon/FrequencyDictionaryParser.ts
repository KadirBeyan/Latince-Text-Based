import type { RawLexicalEntry } from "./LexicalTypes";

const GRAMMAR_RE = /^\(([^)]{1,40})\)$/u;
const NUMBER_RE = /^(?:rank\s*)?(\d{1,5})(?:\s+(\d{1,9}))?$/iu;
const COUNT_RE = /^count\s+(\d{1,9})$/iu;
const INLINE_ENTRY_RE = /^(.{1,140}?)\s+(\([^)]{1,40}\))\s+(.+?)\s+(\d{1,9})$/u;
const HEADWORD_RE = /^[A-Za-zĀ-ȳ][A-Za-zĀ-ȳ\s,'-]{0,90}$/u;

export function parseFrequencyDictionary(lines: string[]): RawLexicalEntry[] {
  const entries: RawLexicalEntry[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const inline = parseInlineEntry(lines[index], index);
    if (inline) {
      entries.push(inline);
      continue;
    }
    if (!detectEntryBoundary(lines, index)) continue;
    const parsed = parseEntry(lines, index);
    if (parsed.entry) {
      entries.push(parsed.entry);
      index = parsed.nextIndex - 1;
    }
  }
  return entries;
}

export function detectEntryBoundary(lines: string[], index: number): boolean {
  const line = lines[index]?.trim() || "";
  if (!parseHeadwordLine(line)) return false;
  const next = lines[index + 1]?.trim() || "";
  const after = lines[index + 2]?.trim() || "";
  return Boolean(parseGrammarLine(next) || next.includes(";") || /[a-z]/iu.test(next) || parseGrammarLine(after));
}

export function parseHeadwordLine(line: string): string | null {
  const cleaned = line.replace(/^\d+\s+/u, "").trim();
  if (!HEADWORD_RE.test(cleaned)) return null;
  if (/\b(chapter|contents|copyright|frequency|dictionary|latin|english)\b/iu.test(cleaned)) return null;
  if (cleaned.split(/\s+/u).length > 8) return null;
  return cleaned;
}

export function parseGrammarLine(line: string): string | undefined {
  const match = line.trim().match(GRAMMAR_RE);
  return match ? match[0] : undefined;
}

export function parseMeaningLines(lines: string[]): string {
  return lines.filter((line) => !parseFrequencyLine(line) && !parseGrammarLine(line)).join(" ").replace(/\s+/gu, " ").trim();
}

export function parseFrequencyLine(line: string): { rank?: number; count?: number } | undefined {
  const countMatch = line.trim().match(COUNT_RE);
  if (countMatch) return { count: Number(countMatch[1]) };
  const match = line.trim().match(NUMBER_RE);
  if (!match) return undefined;
  return { rank: Number(match[1]), count: match[2] ? Number(match[2]) : undefined };
}

function parseInlineEntry(line: string, sourceIndex: number): RawLexicalEntry | null {
  const match = line.trim().match(INLINE_ENTRY_RE);
  if (!match) return null;
  const rawHeadword = parseHeadwordLine(match[1]);
  const rawGrammar = parseGrammarLine(match[2]);
  const rawMeaning = match[3].replace(/\s+/gu, " ").trim();
  const count = match[4];
  if (!rawHeadword || !rawGrammar || rawMeaning.length < 2) return null;
  return { rawHeadword, rawGrammar, rawMeaning, rawFrequency: `count ${count}`, rawLines: [line], sourceIndex, parseConfidence: 0.95, warnings: [] };
}

function parseEntry(lines: string[], sourceIndex: number): { entry: RawLexicalEntry | null; nextIndex: number } {
  const warnings: string[] = [];
  const rawHeadword = parseHeadwordLine(lines[sourceIndex] || "");
  if (!rawHeadword) return { entry: null, nextIndex: sourceIndex + 1 };
  const rawLines = [lines[sourceIndex]];
  let rawGrammar: string | undefined;
  let rawFrequency: string | undefined;
  const meaningLines: string[] = [];
  let nextIndex = sourceIndex + 1;

  for (; nextIndex < Math.min(lines.length, sourceIndex + 8); nextIndex += 1) {
    const line = lines[nextIndex].trim();
    if (nextIndex > sourceIndex + 1 && detectEntryBoundary(lines, nextIndex)) break;
    if (!rawGrammar && parseGrammarLine(line)) {
      rawGrammar = line;
      rawLines.push(line);
      continue;
    }
    if (!rawFrequency && parseFrequencyLine(line)) {
      rawFrequency = line;
      rawLines.push(line);
      if (meaningLines.length) {
        nextIndex += 1;
        break;
      }
      continue;
    }
    if (line.length > 0) {
      meaningLines.push(line);
      rawLines.push(line);
    }
    if (meaningLines.join(" ").length > 240) break;
  }

  const rawMeaning = parseMeaningLines(meaningLines);
  if (!rawMeaning) warnings.push("missing-meaning");
  if (!rawGrammar) warnings.push("missing-grammar");
  if (!rawFrequency) warnings.push("missing-frequency");
  const parseConfidence = rawHeadword && rawGrammar && rawMeaning && rawFrequency ? 0.95 : rawHeadword && rawMeaning ? 0.7 : 0.35;
  if (!rawMeaning || parseConfidence < 0.5) return { entry: null, nextIndex };
  return { entry: { rawHeadword, rawGrammar, rawMeaning, rawFrequency, rawLines, sourceIndex, parseConfidence, warnings }, nextIndex };
}
