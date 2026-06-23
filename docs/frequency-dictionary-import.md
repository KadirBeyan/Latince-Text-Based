# Frequency Dictionary Import

Dry run with JSON artifacts:

```bash
npx tsx scripts/import-frequency-dictionary.ts "/mnt/data/Latin Frequency Dictionary_ Th - Hudson, Paul_5051.epub" --dry-run --write-json
```

Write to SQLite and JSON:

```bash
npx tsx scripts/import-frequency-dictionary.ts "/mnt/data/Latin Frequency Dictionary_ Th - Hudson, Paul_5051.epub" --write-db --write-json
```

Inspect:

```bash
npx tsx scripts/inspect-lexicon.ts --stats
npx tsx scripts/inspect-lexicon.ts amo
npx tsx scripts/inspect-lexicon.ts puerum
```

Artifacts are written to `data/imported/`:

- `frequency-dictionary.raw.json`
- `frequency-dictionary.normalized.json`
- `frequency-dictionary.import-report.json`
- `lexical-index.json`

These files are development/local import artifacts, not production dictionary pages.
