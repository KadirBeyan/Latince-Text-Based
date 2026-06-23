import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "../content/ContentLoader";
import { SaveRepository } from "../save/SaveRepository";
import { GameEngine } from "../core/GameEngine";
import { openDatabase, initDatabase } from "../../db/database";
import type { Scene, SceneInteractionModel, PlayerSave } from "../types/gameTypes";

function createTestEngineWithInteractionScene(interactionModel: SceneInteractionModel): { gameEngine: GameEngine; saveRepository: SaveRepository; saveId: string } {
  const db = openDatabase(":memory:");
  initDatabase(db);

  const contentLoader = new ContentLoader();
  contentLoader.load();

  // Inject a mock interaction scene into the default campaign
  const campaign = contentLoader.getContent().campaigns[0];
  const chapter = campaign.chapters[0];
  const quest = chapter.quests[0];

  const testSceneId = "test_interaction_scene";
  const testScene: Scene = {
    id: testSceneId,
    title: "Test Interaction Scene",
    locationId: "ludus",
    npcIds: ["magister"],
    description: "NPC ile etkilesime geciyorsun.",
    objective: "Niyetini sec.",
    inputMode: "choice", // fallback
    choices: [],
    interactionModel,
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };

  // Prepend test scene and point the quest start scene to it
  quest.scenes = [testScene, ...quest.scenes];
  quest.startSceneId = testSceneId;
  chapter.startQuestId = quest.id;
  campaign.startChapterId = chapter.id;

  const saveRepository = new SaveRepository(db);
  const gameEngine = new GameEngine(contentLoader, saveRepository);

  return { gameEngine, saveRepository, saveId: "test-save-id" };
}

test("SceneSystem - resolveIntentSelect immediately resolves when requiresLatin is false", async () => {
  const model: SceneInteractionModel = {
    mode: "interaction-loop",
    openingNarrationTr: "Gözlemliyorsun.",
    intents: [
      {
        id: "intent_inspect",
        labelTr: "Masayı incele",
        verb: "inspect",
        requiresLatin: false,
        resolution: {
          resultNarrationTr: "Masada eski bir mektup buldun.",
          consequences: [
            {
              id: "c1",
              kind: "latin",
              titleTr: "Eski mektup keşfedildi",
              tone: "success"
            }
          ]
        }
      }
    ]
  };

  const { gameEngine, saveRepository } = createTestEngineWithInteractionScene(model);
  let state = await gameEngine.createNewGame("Marcus", "vicus_first_days");
  const saveId = state.saveId;

  assert.strictEqual(state.currentScene.id, "test_interaction_scene");
  assert.ok(state.activeInteraction);
  assert.strictEqual(state.activeInteraction.selectedIntentId, undefined);

  // Select intent that does not require Latin
  state = await gameEngine.submitAction(saveId, {
    type: "INTENT_SELECT",
    saveId,
    sceneId: "test_interaction_scene",
    intentId: "intent_inspect"
  });

  // Verify that it resolved immediately
  assert.ok(state.activeInteraction);
  assert.strictEqual(state.activeInteraction.selectedIntentId, undefined);
  assert.deepStrictEqual(state.activeInteraction.resolvedIntentIds, ["intent_inspect"]);

  // Verify dialogue entries added
  const dialogueLog = state.dialogueLog;
  assert.ok(dialogueLog.some(d => d.text === "Masada eski bir mektup buldun."));
});

test("SceneSystem - resolveIntentSelect locks selectedIntentId when requiresLatin is true", async () => {
  const model: SceneInteractionModel = {
    mode: "interaction-loop",
    intents: [
      {
        id: "intent_speak_latin",
        labelTr: "Merhaba de",
        verb: "speak",
        requiresLatin: true,
        playerIntentTr: "Merhaba de",
        targetMeaningTr: "Merhaba.",
        canonicalAnswers: ["Salve.", "Salvete."],
        resolution: {
          resultNarrationTr: "Selamlaştın."
        }
      }
    ]
  };

  const { gameEngine, saveRepository } = createTestEngineWithInteractionScene(model);
  let state = await gameEngine.createNewGame("Marcus", "vicus_first_days");
  const saveId = state.saveId;

  // Select intent requiring Latin
  state = await gameEngine.submitAction(saveId, {
    type: "INTENT_SELECT",
    saveId,
    sceneId: "test_interaction_scene",
    intentId: "intent_speak_latin"
  });

  // Verify selected intent id is locked
  assert.ok(state.activeInteraction);
  assert.strictEqual(state.activeInteraction.selectedIntentId, "intent_speak_latin");
});
