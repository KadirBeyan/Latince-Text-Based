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
  let state = await gameEngine.createNewGame("LivingPlayer", "via-prima");
  
  // Jump to old prologue start scene to preserve Stage 11 test assertions
  state = gameEngine.getGameState(
    gameEngine.debugUpdate(state.saveId, "jump_old_prologue", (s) => ({
      ...s,
      currentChapterId: "prologus",
      currentQuestId: "prologus_main_prima",
      currentSceneId: "prologus_001_arrival",
      livingSceneStates: {
        ...s.livingSceneStates,
        "prologus_001_arrival": {
          sceneId: "prologus_001_arrival",
          visitCount: 1,
          localFlags: {},
          inspectedIds: [],
          listenedIds: [],
          readIds: [],
          discoveredClueIds: [],
          discoveredVocabularyIds: [],
          discoveredGrammarIds: [],
          resolvedIntentIds: []
        }
      }
    })).id
  );

  assert.ok(state.livingScene, "livingScene property should be defined in GameState");
  assert.strictEqual(state.livingScene.sceneId, "prologus_001_arrival");
  assert.strictEqual(state.livingScene.visitCount, 1);
  assert.strictEqual(state.livingScene.isRevisit, false);
  assert.ok(Array.isArray(state.livingScene.ambientActions));
});
