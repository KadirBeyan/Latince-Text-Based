import { test } from "node:test";
import assert from "node:assert";
import { AuthoringPreviewService } from "./AuthoringPreviewService";

test("AuthoringPreviewService previews a scene without a real save", () => {
  const service = new AuthoringPreviewService();
  const preview = service.previewScene({ id: "preview_scene", title: "Preview", locationId: "ludus", npcIds: [], description: "Preview scene", objective: "Inspect", inputMode: "choice", choices: [], textChallenge: null, conditions: [], effects: [], rewards: [], onEnterEvents: [] });
  assert.strictEqual(preview.mode, "preview");
  assert.strictEqual(preview.saveId, null);
});
