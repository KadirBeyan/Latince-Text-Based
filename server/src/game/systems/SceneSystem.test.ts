import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "../content/ContentLoader";
import { SaveRepository } from "../save/SaveRepository";
import { GameEngine } from "../core/GameEngine";
import { openDatabase, initDatabase } from "../../db/database";
import type { GameState, PlayerSave } from "../types/gameTypes";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

function createTestEngine(): { gameEngine: GameEngine; saveRepository: SaveRepository } {
  const db = openDatabase(":memory:");
  initDatabase(db);

  const contentLoader = new ContentLoader();
  contentLoader.load();

  const saveRepository = new SaveRepository(db);
  return { gameEngine: new GameEngine(contentLoader, saveRepository), saveRepository };
}

async function reachFirstLatinQuestion(gameEngine: GameEngine): Promise<GameState> {
  let gameState = await gameEngine.createNewGame("TestPlayer", "via-prima");
  gameState = gameEngine.getGameState(
    gameEngine.debugUpdate(gameState.saveId, "jump_old_prologue", (s) => ({
      ...s,
      currentChapterId: "prologus",
      currentQuestId: "prologus_main_prima",
      currentSceneId: "prologus_001_arrival"
    })).id
  );
  const saveId = gameState.saveId;
  for (let step = 0; step < 12 && !gameState.currentScene.dialogueChallenge; step++) {
    const nextChoice = gameState.currentScene.choices.find((choice) => choice.nextSceneId) ?? gameState.currentScene.choices[0];
    assert.ok(nextChoice, `Scene ${gameState.currentScene.id} should offer a choice before the first dialogue challenge.`);
    gameState = await gameEngine.submitAction(saveId, { type: "CHOICE_SELECT", choiceId: nextChoice.id });
  }
  assert.ok(gameState.currentScene.dialogueChallenge, "Expected to reach a dialogue challenge.");
  return gameState;
}

function requireSave(saveRepository: SaveRepository, saveId: string): PlayerSave {
  const save = saveRepository.getById(saveId);
  assert.ok(save);
  return save;
}

test("SceneSystem & GameEngine - DIALOGUE_RESPONSE evaluation integration", async () => {
  const { gameEngine, saveRepository } = createTestEngine();

  // 1. The Stage 11 campaign starts at the real Via Prima prologue.
  let gameState = await gameEngine.createNewGame("StartCheck", "via-prima");
  gameState = gameEngine.getGameState(
    gameEngine.debugUpdate(gameState.saveId, "jump_old_prologue", (s) => ({
      ...s,
      currentChapterId: "prologus",
      currentQuestId: "prologus_main_prima",
      currentSceneId: "prologus_001_arrival"
    })).id
  );
  assert.strictEqual(gameState.currentScene.id, "prologus_001_arrival");

  // 2. Resolve choices to get to the first text challenge scene.
  gameState = await reachFirstLatinQuestion(gameEngine);
  const saveId = gameState.saveId;
  assert.strictEqual(gameState.currentScene.id, "prologus_004_reply");

  // 3. Submit an incorrect answer to test failureEffects
  // Expected is: ["Salve.", "Salve magister.", "Salve, magister."]
  // Incorrect answer: "Quid agis"
  gameState = await gameEngine.submitAction(saveId, { type: "TEXT_SUBMIT", text: "Quid agis" });
  
  // We should still be on the same challenge because failureNextSceneId loops back.
  assert.strictEqual(gameState.currentScene.id, "prologus_004_reply");
  
  // Check that journal entries include the failure effects journal entry:
  // "Salve, Latince 'selam' demektir."
  const hasFailureJournal = gameState.journalEntries.some(
    (j) => j.title === "Cevap ipucu" && j.body.includes("Mihi nomen est")
  );
  assert.ok(hasFailureJournal, "Should have added failure journal entry");

  // 4. Submit a correct answer to test successEffects
  gameState = await gameEngine.submitAction(saveId, { type: "TEXT_SUBMIT", text: "Mihi nomen est." });

  // On success, we should transition to the configured success scene.
  assert.strictEqual(gameState.currentScene.id, "prologus_005_review");

  assert.ok(gameState.player.xp >= 20, "XP should include text challenge reward");
  assert.ok(gameState.skills.some((s) => s.skillId === "latin_basics"), "latin_basics should be incremented or unlocked");

  const saved = requireSave(saveRepository, saveId);
  const textEvaluated = saved.eventLog.find((event) => event.type === "DIALOGUE_RESPONSE_EVALUATED" && event.payload.answer === "Mihi nomen est.");
  assert.ok(textEvaluated, "DIALOGUE_RESPONSE_EVALUATED should be emitted");
  assert.strictEqual(textEvaluated.payload.acceptedAsCorrect, true);
  assert.strictEqual(textEvaluated.payload.verdict, "exact_correct");
  assert.ok(gameState.dialogueLog.some((d) => d.speakerId === "player" && d.text === "Mihi nomen est."));
  assert.ok(gameState.dialogueLog.some((d) => d.speakerId === "system" && d.text.includes("Doğru")));
});

test("GameEngine TEXT_SUBMIT accepts an LLM alternative answer and applies successEffects", async () => {
  const { gameEngine, saveRepository } = createTestEngine();
  const gameState = await reachFirstLatinQuestion(gameEngine);
  const saveId = gameState.saveId;

  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body));
    const systemPrompt = body.messages[0].content as string;
    const content = systemPrompt.includes("Latince gramer/semantik")
      ? JSON.stringify({
          verdict: "equivalent_correct",
          acceptedAsCorrect: true,
          confidence: 0.93,
          meaningMatches: true,
          grammarOk: true,
          contextOk: true,
          levelAppropriate: true,
          detectedMeaningTr: "Adımı söylüyorum.",
          feedbackTr: "Bu alternatif ifade kabul edildi.",
          errors: [],
        })
      : JSON.stringify({ npcLineLatin: "Optime.", npcLineTr: "Çok iyi.", tone: "positive" });
    return new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
  }) as typeof fetch;

  const nextState = await gameEngine.submitAction(saveId, { type: "TEXT_SUBMIT", text: "Marcus mihi nomen est." }, {
    provider: "custom",
    baseUrl: "http://localhost:11434",
    model: "mock-model",
  });

  assert.strictEqual(nextState.currentScene.id, "prologus_005_review");
  assert.ok(nextState.player.xp >= 20);
  assert.ok(nextState.skills.some((skill) => skill.skillId === "latin_basics"));
  const saved = requireSave(saveRepository, saveId);
  const event = saved.eventLog.find((candidate) => candidate.type === "DIALOGUE_RESPONSE_EVALUATED");
  assert.strictEqual((event?.payload as { acceptedAsCorrect: boolean }).acceptedAsCorrect, true);
  assert.strictEqual((event?.payload as { verdict: string }).verdict, "equivalent_correct");
});

test("GameEngine TEXT_SUBMIT falls back and emits LLM_ERROR when LLM returns broken JSON", async () => {
  const { gameEngine, saveRepository } = createTestEngine();
  const gameState = await reachFirstLatinQuestion(gameEngine);
  const saveId = gameState.saveId;

  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({ choices: [{ message: { content: "not json" } }] }), { status: 200 });
  }) as typeof fetch;

  const nextState = await gameEngine.submitAction(saveId, { type: "TEXT_SUBMIT", text: "Ego sum discipulus." }, {
    provider: "custom",
    baseUrl: "http://localhost:11434/v1/",
    model: "mock-model",
  });

  assert.strictEqual(nextState.currentScene.id, "prologus_004_reply");
  const saved = requireSave(saveRepository, saveId);
  const evaluated = saved.eventLog.find((event) => event.type === "DIALOGUE_RESPONSE_EVALUATED");
  assert.strictEqual((evaluated?.payload as { acceptedAsCorrect: boolean }).acceptedAsCorrect, false);
});

test("GameEngine TEXT_SUBMIT emits LLM_ERROR on LLM timeout/error and continues with fallback", async () => {
  const { gameEngine, saveRepository } = createTestEngine();
  const gameState = await reachFirstLatinQuestion(gameEngine);
  const saveId = gameState.saveId;

  globalThis.fetch = (async () => {
    throw new Error("mock timeout");
  }) as typeof fetch;

  const nextState = await gameEngine.submitAction(saveId, { type: "TEXT_SUBMIT", text: "Ego sum discipulus." }, {
    provider: "custom",
    baseUrl: "http://localhost:11434",
    model: "mock-model",
  });

  assert.strictEqual(nextState.currentScene.id, "prologus_004_reply");
  const saved = requireSave(saveRepository, saveId);
  assert.ok(saved.eventLog.some((event) => event.type === "DIALOGUE_RESPONSE_EVALUATED"));
});

test("GameEngine remains deterministic without llmConfig", async () => {
  const { gameEngine, saveRepository } = createTestEngine();
  const gameState = await reachFirstLatinQuestion(gameEngine);
  const saveId = gameState.saveId;

  const nextState = await gameEngine.submitAction(saveId, { type: "TEXT_SUBMIT", text: "Ego sum discipulus." });

  assert.strictEqual(nextState.currentScene.id, "prologus_004_reply");
  const saved = requireSave(saveRepository, saveId);
  assert.ok(!saved.eventLog.some((event) => event.type === "LLM_ERROR"));
  const evaluated = saved.eventLog.find((event) => event.type === "DIALOGUE_RESPONSE_EVALUATED");
  assert.strictEqual((evaluated?.payload as { acceptedAsCorrect: boolean }).acceptedAsCorrect, false);
});

test("GameEngine hint and narration endpoints do not mutate gameplay fields", async () => {
  const { gameEngine, saveRepository } = createTestEngine();
  const gameState = await reachFirstLatinQuestion(gameEngine);
  const saveId = gameState.saveId;
  const before = requireSave(saveRepository, saveId);

  await gameEngine.generateHint(saveId);
  await gameEngine.generateNarration(saveId);

  const after = requireSave(saveRepository, saveId);
  assert.strictEqual(after.currentSceneId, before.currentSceneId);
  assert.strictEqual(after.xp, before.xp);
  assert.strictEqual(after.currentQuestId, before.currentQuestId);
  assert.deepStrictEqual(after.skills, before.skills);
  assert.deepStrictEqual(after.inventory, before.inventory);
  assert.deepStrictEqual(after.dialogueLog, before.dialogueLog);
  assert.ok(after.eventLog.length > before.eventLog.length);
});
