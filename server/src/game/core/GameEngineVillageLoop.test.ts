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

test("GameEngine - full village loop flow", async () => {
  const gameEngine = createTestEngine();

  // 1. Create character save
  let state = await gameEngine.createCharacterSave({
    name: "Titus",
    origin: "unknown_origin",
    traits: ["curious", "practical"],
    skillAllocations: {
      lingua: 3,
      memoria: 3
    }
  }, "via-prima");

  assert.strictEqual(state.currentChapter.id, "vicus_prologue");
  assert.strictEqual(state.currentScene.id, "vicus_001_home_morning");
  assert.ok(state.villageLife);
  assert.strictEqual(state.villageLife!.dayState.dayNumber, 1);
  assert.strictEqual(state.villageLife!.dayState.timeOfDay, "mane");

  // Verify travel choices are present
  const hasTravelToPath = state.availableChoices.some(c => c.id === "travel_village_path");
  assert.ok(hasTravelToPath, "Should have fast travel choice to village path");

  // 2. Travel to Village Path
  state = await gameEngine.submitAction(state.saveId, {
    type: "CHOICE_SELECT",
    choiceId: "travel_village_path"
  });

  assert.strictEqual(state.currentScene.id, "vicus_002_village_path");
  assert.strictEqual(state.villageLife!.dayState.timeOfDay, "mane");

  // Verify activity choices are present at the new location
  const hasInspectSigns = state.availableChoices.some(c => c.id === "activity_inspect_village_signs");
  assert.ok(hasInspectSigns, "Should have activity choice to inspect signs");

  // 3. Advance Time
  state = await gameEngine.submitAction(state.saveId, {
    type: "CHOICE_SELECT",
    choiceId: "action_advance_time"
  });

  assert.strictEqual(state.villageLife!.dayState.timeOfDay, "meridies");
  assert.strictEqual(state.villageLife!.dayState.dayNumber, 1);
});
