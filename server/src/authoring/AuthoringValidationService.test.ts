import { test } from "node:test";
import assert from "node:assert";
import { AuthoringValidationService } from "./AuthoringValidationService";
import type { Scene } from "../game/types/gameTypes";

test("AuthoringValidationService catches invalid scene references and empty expected answers", () => {
  const service = new AuthoringValidationService();
  const scene: Scene = { id: "bad_scene", title: "Bad", locationId: "missing_location", npcIds: [], description: "Short description", objective: "Test", inputMode: "text", choices: [], textChallenge: { id: "tc", prompt: "Respond", expectedAnswers: [], successEffects: [], failureEffects: [], successNextSceneId: "missing_scene" }, conditions: [], effects: [], rewards: [], onEnterEvents: [] };
  const result = service.validateScene(scene);
  assert.strictEqual(result.ok, false);
  assert.ok(result.errors.some((issue) => issue.code === "UNKNOWN_LOCATION"));
  assert.ok(result.errors.some((issue) => issue.code === "MISSING_EXPECTED_ANSWERS"));
  assert.ok(result.errors.some((issue) => issue.code === "INVALID_NEXT_SCENE"));
});
