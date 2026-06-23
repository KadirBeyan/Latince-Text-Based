import { normalizeLatin } from "./LatinNormalizer";
import type { LatinToken } from "./LatinTypes";
export function normalizeToken(token: string): string { return normalizeLatin(token, { stripPunctuation: true, normalizeWhitespace: true }); }
export function tokenizeLatin(input: string): LatinToken[] { if (!input.trim()) return []; const tokens: LatinToken[] = []; const matcher = /[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu; let match: RegExpExecArray | null; while ((match = matcher.exec(input)) !== null) { const normalized = normalizeToken(match[0]); if (normalized) tokens.push({ raw: match[0], normalized, index: tokens.length, start: match.index, end: match.index + match[0].length }); } return tokens; }
export function splitLatinSentences(input: string): string[] { return input.split(/(?<=[.!?])\s+|\n+/u).map((part) => part.trim()).filter(Boolean); }

