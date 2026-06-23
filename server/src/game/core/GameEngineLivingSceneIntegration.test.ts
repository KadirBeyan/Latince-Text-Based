import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "../content/ContentLoader";
import { SaveRepository } from "../save/SaveRepository";
import { GameEngine } from "./GameEngine";
import { openDatabase, initDatabase } from "../../db/database";

function createTestEngine(): GameEngine {
  const db = openDatabase(":memory:");
  initDatabase(db);
  const contentLoader = new ContentLoader();
  contentLoader.load();
  const saveRepository = new SaveRepository(db);
  return new GameEngine(contentLoader, saveRepository);
}

test("GameEngine - builds livingScene view state on game start", async () => {
  const gameEngine = createTestEngine();
  const state = await gameEngine.createNewGame("LivingPlayer");

  assert.ok(state.livingScene, "livingScene property should be defined in GameState");
  assert.strictEqual(state.livingScene.sceneId, "vicus_001_home_morning");
  assert.strictEqual(state.livingScene.visitCount, 1);
  assert.strictEqual(state.livingScene.isRevisit, false);
  assert.ok(Array.isArray(state.livingScene.ambientActions));
});
