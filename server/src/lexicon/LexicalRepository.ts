import type { AppDatabase } from "../db/database";
import type { FrequencyBand, LexicalEntry, LexicalForm, LexicalImportReport, LexicalLevel, LexicalPos } from "./LexicalTypes";
import { normalizeLatinToken } from "./LexicalText";

type EntryRow = {
  id: string; lemma: string; display_lemma: string; normalized_lemma: string; principal_parts_json: string | null; pos: LexicalPos;
  morphology_json: string; meanings_json: string; frequency_json: string; pedagogy_json: string; source_json: string; quality_json: string;
};
type FormRow = { form: string; normalized_form: string; lemma: string; pos: LexicalPos; features_json: string; confidence: number; source: LexicalForm["source"] };

export class LexicalRepository {
  constructor(private readonly db: AppDatabase) { ensureLexicalSchema(db); }

  upsertEntries(entries: LexicalEntry[]): { inserted: number; updated: number } {
    const now = new Date().toISOString();
    const insertEntry = this.db.prepare(`INSERT INTO lexical_entries (id, lemma, display_lemma, normalized_lemma, principal_parts_json, pos, morphology_json, meanings_json, frequency_json, pedagogy_json, source_json, quality_json, created_at, updated_at) VALUES (@id, @lemma, @displayLemma, @normalizedLemma, @principalParts, @pos, @morphology, @meanings, @frequency, @pedagogy, @source, @quality, @createdAt, @updatedAt) ON CONFLICT(id) DO UPDATE SET lemma=excluded.lemma, display_lemma=excluded.display_lemma, normalized_lemma=excluded.normalized_lemma, principal_parts_json=excluded.principal_parts_json, pos=excluded.pos, morphology_json=excluded.morphology_json, meanings_json=excluded.meanings_json, frequency_json=excluded.frequency_json, pedagogy_json=excluded.pedagogy_json, source_json=excluded.source_json, quality_json=excluded.quality_json, updated_at=excluded.updated_at`);
    const deleteForms = this.db.prepare("DELETE FROM lexical_forms WHERE entry_id = ?");
    const insertForm = this.db.prepare("INSERT INTO lexical_forms (id, entry_id, form, normalized_form, lemma, pos, features_json, confidence, source) VALUES (@id, @entryId, @form, @normalizedForm, @lemma, @pos, @features, @confidence, @source)");
    let inserted = 0;
    let updated = 0;
    const exists = this.db.prepare("SELECT 1 FROM lexical_entries WHERE id = ?");
    const tx = this.db.transaction((items: LexicalEntry[]) => {
      for (const entry of items) {
        const wasExisting = Boolean(exists.get(entry.id));
        insertEntry.run({ id: entry.id, lemma: entry.lemma, displayLemma: entry.displayLemma, normalizedLemma: entry.normalizedLemma, principalParts: JSON.stringify(entry.principalParts), pos: entry.pos, morphology: JSON.stringify(entry.morphology), meanings: JSON.stringify(entry.meanings), frequency: JSON.stringify(entry.frequency), pedagogy: JSON.stringify(entry.pedagogy), source: JSON.stringify(entry.source), quality: JSON.stringify(entry.quality), createdAt: now, updatedAt: now });
        deleteForms.run(entry.id);
        entry.forms.forEach((lexicalForm, index) => insertForm.run({ id: `${entry.id}:${index}:${lexicalForm.normalizedForm}`, entryId: entry.id, form: lexicalForm.form, normalizedForm: lexicalForm.normalizedForm, lemma: lexicalForm.lemma, pos: lexicalForm.pos, features: JSON.stringify(lexicalForm.features), confidence: lexicalForm.confidence, source: lexicalForm.source }));
        if (wasExisting) updated += 1; else inserted += 1;
      }
    });
    tx(entries);
    return { inserted, updated };
  }

  findByLemma(lemma: string): LexicalEntry | null { return this.findByNormalizedLemma(normalizeLatinToken(lemma)); }
  findByNormalizedLemma(normalizedLemma: string): LexicalEntry | null { const row = this.db.prepare("SELECT * FROM lexical_entries WHERE normalized_lemma = ? ORDER BY json_extract(source_json, '$.type') = 'app-core' DESC LIMIT 1").get(normalizedLemma) as EntryRow | undefined; return row ? this.hydrate(row) : null; }
  findEntryById(id: string): LexicalEntry | null { const row = this.db.prepare("SELECT * FROM lexical_entries WHERE id = ?").get(id) as EntryRow | undefined; return row ? this.hydrate(row) : null; }
  findByForm(form: string): Array<{ entry: LexicalEntry; form: LexicalForm }> {
    const rows = this.db.prepare("SELECT entry_id, form, normalized_form, lemma, pos, features_json, confidence, source FROM lexical_forms WHERE normalized_form = ? ORDER BY confidence DESC LIMIT 25").all(normalizeLatinToken(form)) as Array<FormRow & { entry_id: string }>;
    return rows.map((row) => ({ entry: this.findEntryById(row.entry_id), form: this.formFromRow(row) })).filter((item): item is { entry: LexicalEntry; form: LexicalForm } => Boolean(item.entry));
  }
  search(query: string, options: { limit?: number; pos?: LexicalPos; level?: LexicalLevel } = {}): LexicalEntry[] {
    const limit = Math.max(1, Math.min(100, options.limit ?? 20));
    const q = `%${normalizeLatinToken(query)}%`;
    const clauses = ["normalized_lemma LIKE ?"];
    const params: unknown[] = [q];
    if (options.pos) { clauses.push("pos = ?"); params.push(options.pos); }
    if (options.level) { clauses.push("json_extract(pedagogy_json, '$.estimatedLevel') = ?"); params.push(options.level); }
    return (this.db.prepare(`SELECT * FROM lexical_entries WHERE ${clauses.join(" AND ")} ORDER BY COALESCE(json_extract(frequency_json, '$.rank'), 999999), normalized_lemma LIMIT ${limit}`).all(...params) as EntryRow[]).map((row) => this.hydrate(row));
  }
  searchByMeaning(query: string, limit = 20): LexicalEntry[] { return (this.db.prepare("SELECT * FROM lexical_entries WHERE meanings_json LIKE ? ORDER BY COALESCE(json_extract(frequency_json, '$.rank'), 999999) LIMIT ?").all(`%${query}%`, limit) as EntryRow[]).map((row) => this.hydrate(row)); }
  findByFrequencyBand(band: FrequencyBand): LexicalEntry[] { return (this.db.prepare("SELECT * FROM lexical_entries WHERE json_extract(frequency_json, '$.band') = ? ORDER BY json_extract(frequency_json, '$.rank')").all(band) as EntryRow[]).map((row) => this.hydrate(row)); }
  findByRankRange(min: number, max: number): LexicalEntry[] { return (this.db.prepare("SELECT * FROM lexical_entries WHERE json_extract(frequency_json, '$.rank') BETWEEN ? AND ? ORDER BY json_extract(frequency_json, '$.rank')").all(min, max) as EntryRow[]).map((row) => this.hydrate(row)); }
  findByLevel(level: LexicalLevel): LexicalEntry[] { return (this.db.prepare("SELECT * FROM lexical_entries WHERE json_extract(pedagogy_json, '$.estimatedLevel') = ? ORDER BY pedagogy_json DESC, COALESCE(json_extract(frequency_json, '$.rank'), 999999)").all(level) as EntryRow[]).map((row) => this.hydrate(row)); }
  findByChapter(chapterId: string): LexicalEntry[] { return (this.db.prepare("SELECT * FROM lexical_entries WHERE pedagogy_json LIKE ? ORDER BY json_extract(pedagogy_json, '$.priority') DESC LIMIT 200").all(`%${chapterId}%`) as EntryRow[]).map((row) => this.hydrate(row)); }
  count(): number { return (this.db.prepare("SELECT COUNT(*) AS count FROM lexical_entries").get() as { count: number }).count; }
  getStats(): Record<string, unknown> {
    const entryCount = this.count();
    const formCount = (this.db.prepare("SELECT COUNT(*) AS count FROM lexical_forms").get() as { count: number }).count;
    const posCounts = Object.fromEntries((this.db.prepare("SELECT pos, COUNT(*) AS count FROM lexical_entries GROUP BY pos").all() as Array<{ pos: string; count: number }>).map((row) => [row.pos, row.count]));
    const levelCounts = Object.fromEntries((this.db.prepare("SELECT json_extract(pedagogy_json, '$.estimatedLevel') AS level, COUNT(*) AS count FROM lexical_entries GROUP BY level").all() as Array<{ level: string; count: number }>).map((row) => [row.level || "unknown", row.count]));
    const frequencyBandCounts = Object.fromEntries((this.db.prepare("SELECT json_extract(frequency_json, '$.band') AS band, COUNT(*) AS count FROM lexical_entries GROUP BY band").all() as Array<{ band: string; count: number }>).map((row) => [row.band || "unknown", row.count]));
    return { entryCount, formCount, posCounts, levelCounts, frequencyBandCounts };
  }
  saveImportRun(report: LexicalImportReport): void {
    this.db.prepare("INSERT INTO lexical_import_runs (id, source_name, source_path, imported_at, raw_count, normalized_count, inserted_count, updated_count, skipped_count, duplicate_count, warning_count, error_count, report_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(`import-${Date.now()}`, "Latin Frequency Dictionary", report.sourcePath, report.importedAt, report.rawEntryCount, report.normalizedEntryCount, report.insertedCount, report.updatedCount, report.skippedCount, report.duplicateCount, report.warnings.length, report.errors.length, JSON.stringify(report));
  }

  private hydrate(row: EntryRow): LexicalEntry {
    const forms = (this.db.prepare("SELECT form, normalized_form, lemma, pos, features_json, confidence, source FROM lexical_forms WHERE entry_id = ? ORDER BY confidence DESC").all(row.id) as FormRow[]).map((formRow) => this.formFromRow(formRow));
    return { id: row.id, lemma: row.lemma, displayLemma: row.display_lemma, normalizedLemma: row.normalized_lemma, principalParts: JSON.parse(row.principal_parts_json || "[]") as string[], pos: row.pos, morphology: JSON.parse(row.morphology_json), meanings: JSON.parse(row.meanings_json), frequency: JSON.parse(row.frequency_json), pedagogy: JSON.parse(row.pedagogy_json), source: JSON.parse(row.source_json), quality: JSON.parse(row.quality_json), forms };
  }
  private formFromRow(row: FormRow): LexicalForm { return { form: row.form, normalizedForm: row.normalized_form, lemma: row.lemma, pos: row.pos, features: JSON.parse(row.features_json || "{}"), confidence: row.confidence, source: row.source }; }
}

export function ensureLexicalSchema(db: AppDatabase): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lexical_entries (id TEXT PRIMARY KEY, lemma TEXT NOT NULL, display_lemma TEXT NOT NULL, normalized_lemma TEXT NOT NULL, principal_parts_json TEXT, pos TEXT NOT NULL, morphology_json TEXT, meanings_json TEXT, frequency_json TEXT, pedagogy_json TEXT, source_json TEXT, quality_json TEXT, created_at TEXT, updated_at TEXT);
    CREATE TABLE IF NOT EXISTS lexical_forms (id TEXT PRIMARY KEY, entry_id TEXT NOT NULL, form TEXT NOT NULL, normalized_form TEXT NOT NULL, lemma TEXT NOT NULL, pos TEXT NOT NULL, features_json TEXT, confidence REAL, source TEXT, FOREIGN KEY(entry_id) REFERENCES lexical_entries(id));
    CREATE TABLE IF NOT EXISTS lexical_import_runs (id TEXT PRIMARY KEY, source_name TEXT, source_path TEXT, imported_at TEXT, raw_count INTEGER, normalized_count INTEGER, inserted_count INTEGER, updated_count INTEGER, skipped_count INTEGER, duplicate_count INTEGER, warning_count INTEGER, error_count INTEGER, report_json TEXT);
    CREATE INDEX IF NOT EXISTS idx_lexical_entries_normalized_lemma ON lexical_entries(normalized_lemma);
    CREATE INDEX IF NOT EXISTS idx_lexical_entries_pos ON lexical_entries(pos);
    CREATE INDEX IF NOT EXISTS idx_lexical_entries_frequency_rank ON lexical_entries(json_extract(frequency_json, '$.rank'));
    CREATE INDEX IF NOT EXISTS idx_lexical_entries_level ON lexical_entries(json_extract(pedagogy_json, '$.estimatedLevel'));
    CREATE INDEX IF NOT EXISTS idx_lexical_forms_normalized_form ON lexical_forms(normalized_form);
    CREATE INDEX IF NOT EXISTS idx_lexical_forms_entry_id ON lexical_forms(entry_id);
  `);
}
