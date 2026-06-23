import fs from "node:fs";
import path from "node:path";
import { openDatabase } from "../db/database";
import { getRuntimeConfig } from "../config/RuntimeConfig";
import type { LexicalEntry, LexicalImportReport } from "./LexicalTypes";
import { extractEpubText } from "./EpubLexiconExtractor";
import { parseFrequencyDictionary } from "./FrequencyDictionaryParser";
import { normalizeRawLexicalEntry } from "./LexicalNormalizer";
import { buildFormsForEntry, buildLexicalIndex } from "./LexicalIndexBuilder";
import { validateLexicalEntry } from "./LexicalValidator";
import { LexicalRepository } from "./LexicalRepository";
import { countBy } from "./LexicalText";

export async function importFrequencyDictionary(params: { epubPath: string; writeJson?: boolean; writeDb?: boolean; outputDir?: string; dryRun?: boolean }): Promise<LexicalImportReport> {
  const importedAt = new Date().toISOString();
  const warnings: string[] = [];
  const errors: string[] = [];
  let rawEntries = [] as ReturnType<typeof parseFrequencyDictionary>;
  let entries: LexicalEntry[] = [];
  try {
    const extraction = await extractEpubText(params.epubPath);
    warnings.push(...extraction.warnings);
    rawEntries = parseFrequencyDictionary(extraction.allLines);
    const seen = new Set<string>();
    entries = rawEntries.map((raw, index) => normalizeRawLexicalEntry(raw, index + 1)).filter((entry): entry is LexicalEntry => Boolean(entry)).map((entry) => validateLexicalEntry({ ...entry, source: { ...entry.source, importedAt }, forms: buildFormsForEntry(entry) })).filter((entry) => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    });
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  const duplicateCount = Math.max(0, rawEntries.length - entries.length);
  const outputDir = params.outputDir || path.resolve(process.cwd(), "data", "imported");
  const index = buildLexicalIndex(entries);
  let insertedCount = 0;
  let updatedCount = 0;
  if (params.writeJson) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, "frequency-dictionary.raw.json"), JSON.stringify(rawEntries.map((entry) => ({ ...entry, rawLines: undefined })), null, 2));
    fs.writeFileSync(path.join(outputDir, "frequency-dictionary.normalized.json"), JSON.stringify(entries.map((entry) => ({ ...entry, forms: entry.forms.slice(0, 20) })), null, 2));
    fs.writeFileSync(path.join(outputDir, "lexical-index.json"), JSON.stringify(index, null, 2));
  }
  if (params.writeDb && !params.dryRun && !errors.length) {
    const db = openDatabase(getRuntimeConfig().paths.databasePath);
    const repository = new LexicalRepository(db);
    const result = repository.upsertEntries(entries);
    insertedCount = result.inserted;
    updatedCount = result.updated;
    db.close();
  }
  const report: LexicalImportReport = {
    importedAt,
    sourcePath: params.epubPath,
    rawEntryCount: rawEntries.length,
    normalizedEntryCount: entries.length,
    formCount: entries.reduce((sum, entry) => sum + entry.forms.length, 0),
    insertedCount,
    updatedCount,
    skippedCount: Math.max(0, rawEntries.length - entries.length),
    duplicateCount,
    posCounts: countBy(entries.map((entry) => entry.pos)),
    levelCounts: countBy(entries.map((entry) => entry.pedagogy.estimatedLevel)),
    frequencyBandCounts: countBy(entries.map((entry) => entry.frequency.band)),
    confidenceAverage: entries.length ? Number((entries.reduce((sum, entry) => sum + entry.quality.parseConfidence, 0) / entries.length).toFixed(3)) : 0,
    warnings: [...warnings, ...entries.flatMap((entry) => entry.quality.warnings.map((warning) => `${entry.id}:${warning}`)).slice(0, 200)],
    errors,
    sampleEntries: entries.slice(0, 20).map((entry) => ({ ...entry, forms: entry.forms.slice(0, 12) })),
    wroteDb: Boolean(params.writeDb && !params.dryRun && !errors.length),
    wroteJson: Boolean(params.writeJson)
  };
  if (params.writeJson) fs.writeFileSync(path.join(outputDir, "frequency-dictionary.import-report.json"), JSON.stringify(report, null, 2));
  if (params.writeDb && !params.dryRun && !errors.length) {
    const db = openDatabase(getRuntimeConfig().paths.databasePath);
    new LexicalRepository(db).saveImportRun(report);
    db.close();
  }
  return report;
}
