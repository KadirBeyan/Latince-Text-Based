import { test } from "node:test";
import assert from "node:assert";
import { ContentIdService } from "./ContentIdService";

test("ContentIdService slugifies Turkish and Latin-ish titles", () => {
  const service = new ContentIdService();
  assert.strictEqual(service.slugifyLatinAware("Forum'da İyi Gün"), "forum_da_iyi_gun");
  assert.strictEqual(service.suggestSceneId("forum", "Mercator price"), "forum_mercator_price");
});
