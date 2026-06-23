import { test } from "node:test";
import assert from "node:assert";
import { normalizeLatin, latinEquals, latinSimilarity } from "./LatinNormalizer";

test("LatinNormalizer - basic normalization and casing", () => {
  assert.strictEqual(normalizeLatin("Salve!"), "salve");
  assert.strictEqual(normalizeLatin("Sūm discipulus."), "sum discipulus");
  assert.strictEqual(normalizeLatin("  AMAT  "), "amat");
});

test("LatinNormalizer - macron stripping", () => {
  assert.strictEqual(normalizeLatin("āēīōūȳ ĀĒĪŌŪȲ"), "aeiouy aeiouy");
});

test("LatinNormalizer - tolerate IU and VU", () => {
  assert.strictEqual(normalizeLatin("jam", { tolerateIU: false }), "jam");
  assert.strictEqual(normalizeLatin("jam", { tolerateIU: true }), "iam");

  assert.strictEqual(normalizeLatin("verbum", { tolerateVU: false }), "verbum");
  assert.strictEqual(normalizeLatin("verbum", { tolerateVU: true }), "uerbum");
});

test("LatinNormalizer - equality check", () => {
  assert.ok(latinEquals("Salve!", "salve"));
  assert.ok(latinEquals("Sūm discipulus.", "sum discipulus"));
  assert.ok(latinEquals("salve magister", "Salve, Magister."));
});

test("LatinNormalizer - similarity score", () => {
  assert.strictEqual(latinSimilarity("", ""), 1.0);
  assert.strictEqual(latinSimilarity("salve", ""), 0.0);

  const highSimilarity = latinSimilarity("salvee", "salve");
  assert.ok(highSimilarity >= 0.8 && highSimilarity < 1.0);

  const lowSimilarity = latinSimilarity("salve", "discipulus");
  assert.ok(lowSimilarity < 0.3);
});
