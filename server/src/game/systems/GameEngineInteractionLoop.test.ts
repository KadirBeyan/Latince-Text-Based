import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "../content/ContentLoader";
import { SaveRepository } from "../save/SaveRepository";
import { GameEngine } from "../core/GameEngine";
import { openDatabase, initDatabase } from "../../db/database";
import type { Scene, DialogueSequence, PlayerSave } from "../types/gameTypes";

function createTestEngineWithDialogueSequence(dialogueSequence: DialogueSequence): { gameEngine: GameEngine; saveRepository: SaveRepository; saveId: string } {
  const db = openDatabase(":memory:");
  initDatabase(db);

  const contentLoader = new ContentLoader();
  contentLoader.load();

  // Inject a mock dialogue sequence scene into default campaign
  const campaign = contentLoader.getContent().campaigns[0];
  const chapter = campaign.chapters[0];
  const quest = chapter.quests[0];

  const testSceneId = "test_dialogue_seq_scene";
  const testScene: Scene = {
    id: testSceneId,
    title: "Test Dialogue Seq Scene",
    locationId: "ludus",
    npcIds: ["magister"],
    description: "NPC ile linear diyalog yapiyorsun.",
    objective: "Niyetini sec.",
    inputMode: "choice",
    choices: [],
    dialogueSequence,
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };

  // Add a target scene for dialogue completion
  const completionScene: Scene = {
    id: "completion_scene",
    title: "Completion Scene",
    locationId: "ludus",
    npcIds: ["magister"],
    description: "Diyalog tamamlandi.",
    objective: "Tamamlandi.",
    inputMode: "choice",
    choices: [],
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };

  quest.scenes = [testScene, completionScene, ...quest.scenes];
  quest.startSceneId = testSceneId;
  chapter.startQuestId = quest.id;
  campaign.startChapterId = chapter.id;

  const saveRepository = new SaveRepository(db);
  const gameEngine = new GameEngine(contentLoader, saveRepository);

  return { gameEngine, saveRepository, saveId: "test-save-id" };
}

test("GameEngine - Dialogue Sequence linear turn progression and success path", async () => {
  const sequence: DialogueSequence = {
    id: "seq_1",
    completionNextSceneId: "completion_scene",
    turns: [
      {
        id: "turn_0",
        speakerNpcId: "magister",
        npcLineLatin: "Salve, discipule.",
        intents: [
          {
            id: "intent_turn0",
            labelTr: "Merhaba de",
            verb: "speak",
            requiresLatin: true,
            playerIntentTr: "Merhaba de",
            targetMeaningTr: "Merhaba.",
            canonicalAnswers: ["Salve."],
            resolution: {
              resultNarrationTr: "Selamlaştınız."
            }
          }
        ]
      },
      {
        id: "turn_1",
        speakerNpcId: "magister",
        npcLineLatin: "Quid est nomen tibi?",
        intents: [
          {
            id: "intent_turn1",
            labelTr: "Adını söyle",
            verb: "speak",
            requiresLatin: true,
            playerIntentTr: "Adını söyle",
            targetMeaningTr: "Ben Marcus'um.",
            canonicalAnswers: ["Ego sum Marcus."],
            resolution: {
              resultNarrationTr: "Adını söyledin."
            }
          }
        ]
      }
    ]
  };

  const { gameEngine } = createTestEngineWithDialogueSequence(sequence);
  let state = await gameEngine.createNewGame("Marcus", "via-prima");
  const saveId = state.saveId;

  // Active interaction should start at turn 0
  assert.strictEqual(state.currentScene.id, "test_dialogue_seq_scene");
  assert.ok(state.activeInteraction);
  assert.strictEqual(state.activeInteraction.activeTurnIndex, 0);

  // Select Turn 0 intent
  state = await gameEngine.submitAction(saveId, {
    type: "INTENT_SELECT",
    saveId,
    sceneId: "test_dialogue_seq_scene",
    intentId: "intent_turn0"
  });

  assert.strictEqual(state.activeInteraction?.selectedIntentId, "intent_turn0");

  // Submit Latin text for Turn 0
  state = await gameEngine.submitAction(saveId, {
    type: "TEXT_SUBMIT",
    text: "Salve"
  });

  // Verify advanced to Turn 1
  assert.ok(state.activeInteraction);
  assert.strictEqual(state.activeInteraction.activeTurnIndex, 1);
  assert.strictEqual(state.activeInteraction.selectedIntentId, undefined);

  // Select Turn 1 intent
  state = await gameEngine.submitAction(saveId, {
    type: "INTENT_SELECT",
    saveId,
    sceneId: "test_dialogue_seq_scene",
    intentId: "intent_turn1"
  });

  // Submit Latin text for Turn 1
  state = await gameEngine.submitAction(saveId, {
    type: "TEXT_SUBMIT",
    text: "Ego sum Marcus"
  });

  // Verify transition to completion scene
  assert.strictEqual(state.currentScene.id, "completion_scene");
});
