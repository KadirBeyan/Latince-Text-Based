import { test } from "node:test";
import assert from "node:assert";
import { CacheService } from "./CacheService";

test("CacheService expires entries and tracks stats", async () => {
  const cache = new CacheService();
  cache.set("latin", "amo", 5);
  assert.strictEqual(cache.get("latin"), "amo");
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.strictEqual(cache.get("latin"), undefined);
  assert.deepStrictEqual(cache.stats(), { keys: 0, hits: 1, misses: 1 });
});

test("CacheService clear removes keys", () => {
  const cache = new CacheService();
  cache.set("a", 1, 1000);
  cache.clear();
  assert.strictEqual(cache.stats().keys, 0);
});
