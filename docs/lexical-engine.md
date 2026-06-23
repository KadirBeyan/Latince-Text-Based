# Latin Lexical Intelligence Engine

Stage 11.5 adds a shared lexical layer for Latin lookup, morphology hints, frequency ranking, level mapping, and player-specific vocabulary planning. The engine is not a replacement for app-core vocabulary; app-core/manual entries keep priority and imported frequency dictionary data acts as a private fallback and enrichment layer.

## Pipeline

EPUB -> raw text extraction -> raw lexical entries -> normalized lexical entries -> SQLite lexical database -> form index -> lemma/frequency indexes -> pedagogical level mapping -> priority scoring -> assessment and dynamic quest vocabulary pools.

## Schema

`LexicalEntry` stores lemma, principal parts, POS, morphology, meanings, frequency band/rank, pedagogy metadata, generated forms, source metadata, and parse quality. `LexicalForm` indexes inflected forms with grammatical features and confidence.

SQLite tables:

- `lexical_entries`
- `lexical_forms`
- `lexical_import_runs`

Indexes cover normalized lemma, POS, rank, level, normalized form, and entry id.

## Frequency And Level Mapping

- top 1-250: A1
- top 251-750: A2
- top 751-2000: B1
- top 2001-3500: B2
- 3501+: advanced

Function words and very common classroom words can be promoted to A1 priority even when rank metadata is incomplete.

## Priority

Priority is scored from frequency, POS usefulness, curriculum usefulness, chapter relevance, and complexity/review penalties. Chapter tags currently cover `ludus`, `domus`, `forum`, `bibliotheca`, `castra`, and `via-appia`.

## Integrations

- `LatinLemmaService` exposes lexical DB fallback helpers.
- `LatinFormAnalyzer` checks imported lexical forms before heuristic guesses.
- `LatinDifficultyScorer` adds frequency dictionary vocabulary difficulty signals.
- `VocabularyPriorityEngine` provides chapter, assessment, and next-word pools.
- API endpoints live under `/api/lexicon`.

## Copyright And Local Data

Imported EPUB content is treated as private/local user data. The app does not show the book text, does not create a production full dictionary UI, and does not add a full export button. UI panels only show single lookup results, stats, short structured word data, and small import samples for verification.

## Known Parser Limits

The parser is heuristic because EPUB typography varies. It recognizes common headword, grammar, meaning, and numeric frequency patterns, but suspicious entries are skipped or marked `needsReview`. Parser warnings are reported in import reports and should not break gameplay.
