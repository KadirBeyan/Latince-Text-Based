import assert from "node:assert/strict";
import test from "node:test";
import Database from "better-sqlite3";
import { parseFrequencyDictionary } from "./FrequencyDictionaryParser";
import { normalizeRawLexicalEntry } from "./LexicalNormalizer";
import { buildFormsForEntry } from "./LexicalIndexBuilder";
import { validateLexicalEntry } from "./LexicalValidator";
import { LexicalRepository } from "./LexicalRepository";
import { LatinLexicalEngine } from "./LatinLexicalEngine";
import { VocabularyPriorityEngine } from "./VocabularyPriorityEngine";
import { LexicalDifficultyService } from "./LexicalDifficultyService";
import { ContentLoader } from "../game/content/ContentLoader";
import type { PlayerSave } from "../game/types/gameTypes";

function sampleEntries() {
  const raw = parseFrequencyDictionary([
    "amo, amare, amavi, amatus", "(v, 1st)", "love; like", "15",
    "puer, pueri", "(m, 2nd)", "boy, child", "120",
    "bonus, bona, bonum", "(adj)", "good", "300"
  ]);
  return raw.map((entry, index) => normalizeRawLexicalEntry(entry, index + 1)).filter(Boolean).map((entry) => validateLexicalEntry({ ...entry!, forms: buildFormsForEntry(entry!) }));
}

test("FrequencyDictionaryParser parses verb noun and adjective entries", () => {
  const entries = sampleEntries();
  assert.equal(entries.length, 3);
  assert.equal(entries[0].pos, "verb");
  assert.equal(entries[1].morphology.declension, "2");
  assert.equal(entries[2].pos, "adjective");
});

test("FrequencyDictionaryParser parses inline EPUB entry format", () => {
  const raw = parseFrequencyDictionary(["amo, amare, amavi, amatus (v, 1st) love; like. 999"]);
  assert.equal(raw.length, 1);
  assert.equal(raw[0].rawHeadword, "amo, amare, amavi, amatus");
  assert.equal(raw[0].rawGrammar, "(v, 1st)");
  assert.equal(raw[0].rawFrequency, "count 999");
});

test("LexicalIndexBuilder generates useful forms", () => {
  const entries = sampleEntries();
  const puer = entries.find((entry) => entry.normalizedLemma === "puer");
  const amo = entries.find((entry) => entry.normalizedLemma === "amo");
  assert.ok(puer?.forms.some((form) => form.normalizedForm === "puerum" && form.features.case === "accusative"));
  assert.ok(amo?.forms.some((form) => form.normalizedForm === "amas" && form.features.person === "2"));
});

test("LexicalRepository and LatinLexicalEngine lookup lemma and inflected form", async () => {
  const db = new Database(":memory:");
  const repository = new LexicalRepository(db);
  repository.upsertEntries(sampleEntries());
  const loader = new ContentLoader();
  const engine = new LatinLexicalEngine(repository, loader);
  const lemma = await engine.lookup("amo");
  const form = await engine.lookup("puerum");
  assert.equal(lemma.best?.entry.normalizedLemma, "amo");
  assert.equal(form.best?.entry.normalizedLemma, "puer");
  assert.equal(form.best?.form?.features.case, "accusative");
  db.close();
});

test("VocabularyPriorityEngine avoids known words and LexicalDifficultyService scores rare words harder", async () => {
  const db = new Database(":memory:");
  const repository = new LexicalRepository(db);
  const entries = sampleEntries();
  repository.upsertEntries(entries);
  const save = { masteryStates: [{ targetId: entries[0].id, targetType: "vocabulary", mastery: 0.9 }] } as PlayerSave;
  const priority = new VocabularyPriorityEngine(repository).getNextWordsForPlayer(save, { limit: 2 });
  assert.notEqual(priority[0]?.id, entries[0].id);
  const loader = new ContentLoader();
  loader.load();
  const difficulty = await new LexicalDifficultyService(new LatinLexicalEngine(repository, loader)).scoreTextLexicalDifficulty("amo puerum xyzzy");
  assert.ok(difficulty.unknownWords.includes("xyzzy"));
  assert.ok(difficulty.score > 20);
  db.close();
});
