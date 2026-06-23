import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "../content/ContentLoader";
import { SaveRepository } from "../save/SaveRepository";
import { GameEngine } from "../core/GameEngine";
import { openDatabase, initDatabase } from "../../db/database";
import type { Scene, DialogueResponseChallenge } from "../types/gameTypes";

function createTestEngineWithDialogueScene(dialogueChallenge: DialogueResponseChallenge): { gameEngine: GameEngine; saveId: string } {
  const db = openDatabase(":memory:");
  initDatabase(db);

  const contentLoader = new ContentLoader();
  contentLoader.load();

  // Inject a mock dialogue-response scene into the default campaign
  const campaign = contentLoader.getContent().campaigns[0];
  const chapter = campaign.chapters[0];
  const quest = chapter.quests[0];

  // Modify the start scene of the quest to be our test dialogue scene
  const testSceneId = "test_dialogue_scene";
  const testScene: Scene = {
    id: testSceneId,
    title: "Test Dialogue Scene",
    locationId: "ludus",
    npcIds: ["magister"],
    description: "NPC ile konusuyorsun.",
    objective: "Kendini tanıt.",
    inputMode: "dialogue-response",
    choices: [],
    dialogueChallenge,
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

  return { gameEngine, saveId: "test-save-id" };
}

test("GameEngine - TEXT_SUBMIT dialogue challenge success path", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    speakerNpcId: "magister",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    successNextSceneId: "success_target_scene",
    reactions: {
      correct: {
        npcLineLatin: "Bene, Marce. Intra.",
        npcLineTr: "Güzel, Marcus. Gir.",
        feedbackTr: "Doğru!",
      },
    },
  };

  const { gameEngine } = createTestEngineWithDialogueScene(challenge);

  // Inject success target scene so transition works
  const campaign = gameEngine["contentLoader"].getContent().campaigns[0];
  campaign.chapters[0].quests[0].scenes.push({
    id: "success_target_scene",
    title: "Success Screen",
    locationId: "ludus",
    npcIds: [],
    description: "Basarili oldun.",
    objective: "Devam et.",
    inputMode: "choice",
    choices: [],
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  });

  let state = await gameEngine.createNewGame("Player1", "vicus_first_days");
  const saveId = state.saveId;
  assert.strictEqual(state.currentScene.id, "test_dialogue_scene");

  // Submit correct answer
  state = await gameEngine.submitAction(saveId, {
    type: "TEXT_SUBMIT",
    text: "Ego sum Marcus.",
  });

  // Verify transition to success scene
  assert.strictEqual(state.currentScene.id, "success_target_scene");

  // Verify dialogue log includes NPC reaction
  const npcReactionLogs = state.dialogueLog.filter(d => d.speakerId === "magister");
  assert.ok(npcReactionLogs.some(d => d.text.includes("Bene, Marce. Intra.")));
  
  // Verify event log contains DIALOGUE_RESPONSE_EVALUATED
  const savedSave = gameEngine.getRawSave(saveId);
  const dialogueEvent = savedSave.eventLog.find(e => e.type === "DIALOGUE_RESPONSE_EVALUATED");
  assert.ok(dialogueEvent);
  assert.strictEqual(dialogueEvent.payload.acceptedAsCorrect, true);
  assert.strictEqual(dialogueEvent.payload.verdict, "exact_correct");
});

test("GameEngine - TEXT_SUBMIT dialogue challenge near miss retryAllowed path", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    speakerNpcId: "magister",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    retryAllowed: true,
    maxAttempts: 3,
  };

  const { gameEngine } = createTestEngineWithDialogueScene(challenge);

  let state = await gameEngine.createNewGame("Player2", "vicus_first_days");
  const saveId = state.saveId;

  // Submit incorrect but similar answer (near miss)
  state = await gameEngine.submitAction(saveId, {
    type: "TEXT_SUBMIT",
    text: "Ego sum Marcusss.",
  });

  // Since retryAllowed is true and attempt is 1 < 3, we should remain on the same scene
  assert.strictEqual(state.currentScene.id, "test_dialogue_scene");

  // Verify attempt flag is stored in save
  const rawSave = gameEngine.getRawSave(saveId);
  assert.strictEqual(rawSave.flags["dialogue_attempts_test_dialogue_scene"], 1);

  // Submit correct answer on second try
  state = await gameEngine.submitAction(saveId, {
    type: "TEXT_SUBMIT",
    text: "Ego sum Marcus.",
  });

  // Should transition to chapter start/quest end or default scene (if successNextSceneId is empty, loops back or moves forward)
  // Here, it Completes the scene. Let's make sure it marked it completed.
  const rawSave2 = gameEngine.getRawSave(saveId);
  assert.ok(rawSave2.completedSceneIds.includes("test_dialogue_scene"));
});

test("GameEngine - TEXT_SUBMIT dialogue challenge maxAttempts failure path", async () => {
  const challenge: DialogueResponseChallenge = {
    mode: "dialogue-response",
    speakerNpcId: "magister",
    playerIntentTr: "Kendini tanıt.",
    targetMeaningTr: "Ben Marcus'um.",
    canonicalAnswers: ["Ego sum Marcus."],
    retryAllowed: true,
    maxAttempts: 2,
    failureNextSceneId: "failure_target_scene",
  };

  const { gameEngine } = createTestEngineWithDialogueScene(challenge);

  // Inject failure target scene
  const campaign = gameEngine["contentLoader"].getContent().campaigns[0];
  campaign.chapters[0].quests[0].scenes.push({
    id: "failure_target_scene",
    title: "Failure Screen",
    locationId: "ludus",
    npcIds: [],
    description: "Basarisiz oldun.",
    objective: "Devam et.",
    inputMode: "choice",
    choices: [],
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  });

  let state = await gameEngine.createNewGame("Player3", "vicus_first_days");
  const saveId = state.saveId;

  // Submit incorrect answer (attempt 1)
  state = await gameEngine.submitAction(saveId, { type: "TEXT_SUBMIT", text: "Wrong Answer 1" });
  assert.strictEqual(state.currentScene.id, "test_dialogue_scene");

  // Submit incorrect answer (attempt 2 - maxAttempts reached)
  state = await gameEngine.submitAction(saveId, { type: "TEXT_SUBMIT", text: "Wrong Answer 2" });
  
  // Should transition to failure next scene id
  assert.strictEqual(state.currentScene.id, "failure_target_scene");
});

test("GameEngine - hybrid dialogue persists selected intent in activeInteraction", async () => {
  const db = openDatabase(":memory:");
  initDatabase(db);
  const contentLoader = new ContentLoader();
  contentLoader.load();
  const campaign = contentLoader.getContent().campaigns[0];
  const chapter = campaign.chapters[0];
  const quest = chapter.quests[0];
  const scene: Scene = {
    id: "test_hybrid_dialogue_scene",
    title: "Hybrid Dialogue",
    locationId: "ludus",
    npcIds: ["magister"],
    description: "Bir niyet seç ve cevap ver.",
    objective: "Ekmek iste.",
    inputMode: "hybrid-dialogue",
    choices: [],
    hybridDialogue: {
      speakerNpcId: "magister",
      npcPromptLatin: "Quid vis?",
      npcPromptTr: "Ne istiyorsun?",
      intents: [{ id: "want_bread", labelTr: "Ekmek istiyorum", targetMeaningTr: "Ekmek istiyorum.", canonicalAnswers: ["Panem volo."] }],
    },
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };
  quest.scenes = [scene, ...quest.scenes];
  quest.startSceneId = scene.id;
  chapter.startQuestId = quest.id;
  campaign.startChapterId = chapter.id;
  const gameEngine = new GameEngine(contentLoader, new SaveRepository(db));
  let state = await gameEngine.createNewGame("Player4", "vicus_first_days");

  state = await gameEngine.submitAction(state.saveId, { type: "CHOICE_SELECT", choiceId: "want_bread" });
  assert.strictEqual(state.activeInteraction?.selectedIntentId, "want_bread");
  assert.strictEqual(state.narrativeFlags?.selected_intent_test_hybrid_dialogue_scene, undefined);
  assert.strictEqual(state.availableChoices.length, 0);

  state = await gameEngine.submitAction(state.saveId, { type: "TEXT_SUBMIT", text: "Panem volo." });
  assert.ok(gameEngine.getRawSave(state.saveId).completedSceneIds.includes(scene.id));
});

test("GameEngine - hybrid dialogue migrates legacy selected intent from narrativeFlags", async () => {
  const db = openDatabase(":memory:");
  initDatabase(db);
  const contentLoader = new ContentLoader();
  contentLoader.load();
  const campaign = contentLoader.getContent().campaigns[0];
  const chapter = campaign.chapters[0];
  const quest = chapter.quests[0];
  const scene: Scene = {
    id: "legacy_hybrid_dialogue_scene",
    title: "Legacy Hybrid Dialogue",
    locationId: "ludus",
    npcIds: ["magister"],
    description: "Eski save migration.",
    objective: "Ekmek iste.",
    inputMode: "hybrid-dialogue",
    choices: [],
    hybridDialogue: {
      speakerNpcId: "magister",
      npcPromptLatin: "Quid vis?",
      npcPromptTr: "Ne istiyorsun?",
      intents: [{ id: "want_bread", labelTr: "Ekmek istiyorum", targetMeaningTr: "Ekmek istiyorum.", canonicalAnswers: ["Panem volo."] }],
    },
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };
  quest.scenes = [scene, ...quest.scenes];
  quest.startSceneId = scene.id;
  chapter.startQuestId = quest.id;
  campaign.startChapterId = chapter.id;
  const saveRepository = new SaveRepository(db);
  const gameEngine = new GameEngine(contentLoader, saveRepository);
  const state = await gameEngine.createNewGame("LegacyPlayer", "vicus_first_days");
  const raw = gameEngine.getRawSave(state.saveId);
  saveRepository.update({
    ...raw,
    activeInteraction: undefined,
    narrativeFlags: { ...raw.narrativeFlags, selected_intent_legacy_hybrid_dialogue_scene: "want_bread" },
  });

  const nextState = await gameEngine.submitAction(state.saveId, { type: "TEXT_SUBMIT", text: "Panem volo." });
  assert.ok(gameEngine.getRawSave(state.saveId).completedSceneIds.includes(scene.id));
  assert.strictEqual(nextState.narrativeFlags?.selected_intent_legacy_hybrid_dialogue_scene, undefined);
  assert.strictEqual(gameEngine.getRawSave(state.saveId).activeInteraction?.selectedIntentId, "want_bread");
});

test("GameEngine - hybrid dialogue rejects text submit without selected intent", async () => {
  const db = openDatabase(":memory:");
  initDatabase(db);
  const contentLoader = new ContentLoader();
  contentLoader.load();
  const campaign = contentLoader.getContent().campaigns[0];
  const chapter = campaign.chapters[0];
  const quest = chapter.quests[0];
  const scene: Scene = {
    id: "missing_intent_hybrid_dialogue_scene",
    title: "Missing Intent Hybrid Dialogue",
    locationId: "ludus",
    npcIds: ["magister"],
    description: "Intent secilmedi.",
    objective: "Ekmek iste.",
    inputMode: "hybrid-dialogue",
    choices: [],
    hybridDialogue: {
      speakerNpcId: "magister",
      npcPromptLatin: "Quid vis?",
      npcPromptTr: "Ne istiyorsun?",
      intents: [{ id: "want_bread", labelTr: "Ekmek istiyorum", targetMeaningTr: "Ekmek istiyorum.", canonicalAnswers: ["Panem volo."] }],
    },
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };
  quest.scenes = [scene, ...quest.scenes];
  quest.startSceneId = scene.id;
  chapter.startQuestId = quest.id;
  campaign.startChapterId = chapter.id;
  const gameEngine = new GameEngine(contentLoader, new SaveRepository(db));
  const state = await gameEngine.createNewGame("NoIntentPlayer", "vicus_first_days");

  await assert.rejects(
    () => gameEngine.submitAction(state.saveId, { type: "TEXT_SUBMIT", text: "Panem volo." }),
    /requires a selected dialogue intent/,
  );
});
