#!/usr/bin/env tsx
import { importFrequencyDictionary } from "../server/src/importers/importFrequencyDictionary";

async function main() {
  const [epubPath, ...flags] = process.argv.slice(2);
  if (!epubPath) throw new Error("Usage: npx tsx scripts/import-frequency-dictionary.ts <book.epub> [--dry-run] [--write-json] [--write-db]");
  const report = await importFrequencyDictionary({ epubPath, dryRun: flags.includes("--dry-run"), writeJson: flags.includes("--write-json"), writeDb: flags.includes("--write-db") });
  console.log(JSON.stringify({ rawEntryCount: report.rawEntryCount, normalizedEntryCount: report.normalizedEntryCount, formCount: report.formCount, insertedCount: report.insertedCount, updatedCount: report.updatedCount, skippedCount: report.skippedCount, duplicateCount: report.duplicateCount, posCounts: report.posCounts, frequencyBandCounts: report.frequencyBandCounts, levelCounts: report.levelCounts, confidenceAverage: report.confidenceAverage, wroteDb: report.wroteDb, wroteJson: report.wroteJson, warnings: report.warnings.slice(0, 20), errors: report.errors }, null, 2));
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
