import type { LexicalEntry } from "./LexicalTypes";

export function validateLexicalEntry(entry: LexicalEntry): LexicalEntry {
  const warnings = [...entry.quality.warnings];
  if (!entry.normalizedLemma) warnings.push("missing-normalized-lemma");
  if (entry.pos === "unknown") warnings.push("unknown-pos");
  if (!entry.meanings.en.length && !entry.meanings.tr?.length) warnings.push("missing-meaning");
  if (entry.frequency.band === "unknown") warnings.push("unknown-frequency");
  return { ...entry, quality: { ...entry.quality, warnings: [...new Set(warnings)], needsReview: warnings.length > 0 || entry.quality.parseConfidence < 0.75 } };
}
