import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "./content/ContentLoader";
import { QuestTemplateEngine } from "./content/QuestTemplateEngine";
import { GeneratedContentValidator } from "./content/GeneratedContentValidator";
import { GeneratedSceneBuilder } from "./content/GeneratedSceneBuilder";
import { GeneratedContentSystem } from "./systems/GeneratedContentSystem";
import { QuestRewardBalancer } from "./systems/QuestRewardBalancer";
import { DynamicQuestSystem } from "./systems/DynamicQuestSystem";
import { GameEngine } from "./core/GameEngine";
import { SaveRepository } from "./save/SaveRepository";
import { openDatabase, initDatabase } from "../db/database";
import type { PlayerSave, GeneratedQuest } from "./types/gameTypes";

const loader = new ContentLoader();
loader.load();

function createTestSave(): PlayerSave {
  return {
    schemaVersion: 4,
    id: "test-save-id",
    playerName: "Test Player",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentCampaignId: "vicus_first_days",
    currentChapterId: "village_first_days",
    currentQuestId: "vicus_prologue_main",
    currentSceneId: "vicus_001_home_morning",
    level: 1,
    xp: 0,
    currency: 0,
    streak: { current: 0, best: 0 },
    masteryStates: [
      { targetId: "greetings", targetType: "grammar", seenCount: 5, correctCount: 1, wrongCount: 4, mastery: 0.2 }
    ],
    seenRewardEventIds: [],
    flags: {},
    inventory: [],
    skills: [],
    questStates: {},
    completedSceneIds: [],
    visitedSceneIds: [],
    journalEntries: [],
    dialogueLog: [],
    eventLog: [],
    errorMemory: [
      {
        tag: "spelling-error",
        count: 2,
        lastSeenAt: new Date().toISOString(),
        relatedSceneIds: ["vicus_001_home_morning"],
        relatedGrammarIds: ["greetings"],
        relatedVocabularyIds: ["vocab-salve"]
      }
    ],
    npcMemories: [],
    locationStates: [],
    worldEvents: [],
    activeSideQuestSuggestions: [
      {
        id: "sug-1",
        templateId: "vicus_side_greetings_teacher",
        title: "Selamlaşma Pratiği",
        npcId: "magister_ruralis",
        locationId: "teacher_corner",
        reason: "Selamlaşma zayıf",
        difficulty: "intro",
        status: "suggested",
        createdAt: new Date().toISOString(),
        relatedGrammarIds: ["greetings"],
        relatedVocabularyIds: ["vocab-salve"],
        relatedErrorTags: []
      }
    ],
    narrativeFlags: {},
    generatedQuests: [], assessmentAttempts: [], achievements: [], analyticsSnapshots: []
  };
}

test("QuestTemplateEngine scores templates correctly based on save and context", () => {
  const engine = new QuestTemplateEngine(loader);
  const save = createTestSave();

  // Test greetings review template
  const templates = engine.getEligibleTemplates(save, { currentLocationId: "teacher_corner", currentNpcId: "magister_ruralis" });
  assert.ok(templates.length > 0);
  
  const greetingsTemplate = templates.find(t => t.template.id === "vicus_greetings_teacher_review");
  assert.ok(greetingsTemplate);
  assert.ok(greetingsTemplate.score > 10, "Greetings template should have a boosted score due to weak grammar");

  // Test rendering
  const rendered = engine.renderText("Hello {playerName} at {npcName}", {
    playerName: "Marcus",
    npcName: "Aelius",
    grammarLabels: [],
    vocabularyLabels: [],
    weakTags: []
  });
  assert.strictEqual(rendered, "Hello Marcus at Aelius");
});

test("GeneratedContentValidator verifies valid and flags invalid generated quests", () => {
  const save = createTestSave();
  const engine = new QuestTemplateEngine(loader);
  const template = loader.getQuestTemplates().find(t => t.id === "vicus_greetings_teacher_review");
  assert.ok(template);

  const quest = GeneratedSceneBuilder.buildQuestFromTemplate(template, save, loader, engine);
  const validation = GeneratedContentValidator.validateGeneratedQuest(quest, loader.getContent());
  assert.ok(validation.ok, "Built template quest should be valid");

  // Corrupt the quest by changing scene IDs to not start with gen_scene_
  const corruptedQuest = {
    ...quest,
    scenes: quest.scenes.map(s => ({ ...s, id: "invalid_id" }))
  };
  const corruptedValidation = GeneratedContentValidator.validateGeneratedQuest(corruptedQuest, loader.getContent());
  assert.ok(!corruptedValidation.ok, "Corrupted quest ID should fail validation");
  assert.ok(corruptedValidation.errors.some(e => e.code === "INVALID_SCENE_ID"));
});

test("QuestRewardBalancer calculates correct values and clamps rewards", () => {
  // intro uses 10 XP and 1 currency per scene
  const introReward = QuestRewardBalancer.calculateRewards("intro", 3, 1);
  assert.strictEqual(introReward.xp, 30);
  assert.strictEqual(introReward.currency, 3);

  const bigReward = QuestRewardBalancer.calculateRewards("challenge", 10, 20);
  assert.ok(bigReward.xp && bigReward.xp <= 120, "XP must be clamped to 120");
  assert.ok(bigReward.currency && bigReward.currency <= 20, "Currency must be clamped to 20");
});

test("GeneratedContentSystem manages quest state and draft/active caps", () => {
  let save = createTestSave();
  const engine = new QuestTemplateEngine(loader);
  const template = loader.getQuestTemplates()[0];
  assert.ok(template);

  // 1. Add quest drafts up to limit
  for (let i = 0; i < 6; i++) {
    const quest = GeneratedSceneBuilder.buildQuestFromTemplate(template, save, loader, engine);
    quest.id = `gen_quest_test_${i}`;
    save = GeneratedContentSystem.addGeneratedQuest(save, quest);
  }

  const drafts = save.generatedQuests.filter((q: any) => q.status === "draft");
  assert.strictEqual(drafts.length, 5, "Draft count must be capped at 5");

  // 2. Accept quest and test active cap
  const qId1 = drafts[0].id;
  const qId2 = drafts[1].id;
  const qId3 = drafts[2].id;
  const qId4 = drafts[3].id;

  save = GeneratedContentSystem.acceptQuest(save, qId1);
  save = GeneratedContentSystem.acceptQuest(save, qId2);
  save = GeneratedContentSystem.acceptQuest(save, qId3);

  assert.throws(() => {
    GeneratedContentSystem.acceptQuest(save, qId4);
  }, /Active generated quest cap/);

  // 3. Start generated quest
  save = GeneratedContentSystem.startQuest(save, qId1);
  assert.strictEqual(save.currentQuestId, qId1);
  assert.strictEqual(save.currentSceneId, save.generatedQuests.find((q: any) => q.id === qId1)?.scenes[0].id);

  // 4. Complete quest and return to the previous campaign position
  save = GeneratedContentSystem.completeQuest(save, qId1);
  assert.strictEqual(save.currentQuestId, "vicus_prologue_main");
  assert.strictEqual(save.currentSceneId, "vicus_001_home_morning");
  assert.strictEqual(save.generatedQuests.find((q: any) => q.id === qId1)?.status, "completed");
});

test("QuestTemplateEngine excludes duplicate active or draft templates", () => {
  const engine = new QuestTemplateEngine(loader);
  const save = createTestSave();
  save.generatedQuests = [{
    ...GeneratedSceneBuilder.buildQuestFromTemplate(loader.getQuestTemplate("vicus_greetings_teacher_review")!, save, loader, engine),
    sourceTemplateId: "vicus_greetings_teacher_review"
  }];
  assert.ok(!engine.getEligibleTemplates(save).some((entry) => entry.template.id === "vicus_greetings_teacher_review"));
});

test("GeneratedContentValidator enforces input modes, duplicate ids and allowed effects", () => {
  const save = createTestSave();
  const engine = new QuestTemplateEngine(loader);
  const quest = GeneratedSceneBuilder.buildQuestFromTemplate(loader.getQuestTemplates()[0], save, loader, engine);
  quest.scenes[0] = { ...quest.scenes[0], inputMode: "text", textChallenge: undefined };
  quest.scenes[1] = { ...quest.scenes[1], id: quest.scenes[0].id, effects: [{ type: "SET_FLAG", key: "unsafe", value: true }] };
  const validation = GeneratedContentValidator.validateGeneratedQuest(quest, loader.getContent());
  assert.ok(!validation.ok);
  assert.ok(validation.errors.some((issue) => issue.code === "MISSING_TEXT_CHALLENGE"));
  assert.ok(validation.errors.some((issue) => issue.code === "DUPLICATE_SCENE_ID"));
  assert.ok(validation.errors.some((issue) => issue.code === "FORBIDDEN_EFFECT"));
});

test("DynamicQuestSystem produces validated template fallback quests", async () => {
  const engine = new QuestTemplateEngine(loader);
  const save = createTestSave();
  // DynamicQuestSystem without LLM config/client will fallback to template builder
  const system = new DynamicQuestSystem(loader, engine);

  const quest = await system.generateQuestFromSuggestion(save, "sug-1");
  assert.ok(quest);
  assert.strictEqual(quest.status, "draft");
  assert.ok(quest.scenes.length >= 2);
  assert.strictEqual(quest.sourceSuggestionId, "sug-1");
});

test("GameEngine integration flows accept, start, and run choices on generated quests", async () => {
  const db = openDatabase(":memory:");
  initDatabase(db);
  const saveRepository = new SaveRepository(db);

  const save = createTestSave();
  saveRepository.create(save);

  const engine = new GameEngine(loader, saveRepository);

  // 1. Generate quest from suggestion
  let state = await engine.generateQuestFromSuggestion("test-save-id", "sug-1");
  assert.ok(state.generatedQuests && state.generatedQuests.length > 0);
  assert.ok(state.recentEvents.some((event) => event.type === "GENERATED_QUEST_CREATED"));
  
  const genQuestId = state.generatedQuests[0].id;
  assert.strictEqual(state.generatedQuests[0].status, "draft");

  // 2. Accept generated quest
  state = engine.acceptGeneratedQuest("test-save-id", genQuestId);
  assert.strictEqual(state.generatedQuests?.find((q: any) => q.id === genQuestId)?.status, "active");
  assert.ok(state.recentEvents.some((event) => event.type === "GENERATED_QUEST_ACTIVATED"));

  // 3. Start generated quest
  state = engine.startGeneratedQuest("test-save-id", genQuestId);
  assert.strictEqual(state.currentQuest.id, genQuestId);
  assert.strictEqual(state.currentScene.id, state.generatedQuests?.find((q: any) => q.id === genQuestId)?.scenes[0].id);

  // 4. Resolve choice select in generated quest
  const firstChoiceId = state.availableChoices[0].id;
  state = await engine.submitAction("test-save-id", {
    type: "CHOICE_SELECT",
    choiceId: firstChoiceId
  });

  assert.strictEqual(state.currentQuest.id, genQuestId);
  assert.notStrictEqual(state.currentScene.id, state.generatedQuests?.find((q: any) => q.id === genQuestId)?.scenes[0].id);

  // Clean up
  try {
    saveRepository.delete("test-save-id");
  } catch {}
});

test("GameEngine completes a generated quest and safely restores the main campaign scene", async () => {
  const db = openDatabase(":memory:");
  initDatabase(db);
  const saveRepository = new SaveRepository(db);
  saveRepository.create(createTestSave());
  const engine = new GameEngine(loader, saveRepository);
  let state = await engine.generateQuestFromSuggestion("test-save-id", "sug-1");
  const quest = state.generatedQuests![0];
  state = engine.startGeneratedQuest("test-save-id", quest.id);

  for (let step = 0; step < 10 && state.currentQuest.id === quest.id; step++) {
    if (state.currentScene.textChallenge) {
      state = await engine.submitAction("test-save-id", { type: "TEXT_SUBMIT", text: state.currentScene.textChallenge.expectedAnswers[0] });
    } else {
      state = await engine.submitAction("test-save-id", { type: "CHOICE_SELECT", choiceId: state.availableChoices[0].id });
    }
  }

  assert.strictEqual(state.currentQuest.id, "vicus_prologue_main");
  assert.strictEqual(state.currentScene.id, "vicus_001_home_morning");
  assert.strictEqual(engine.getGeneratedQuest("test-save-id", quest.id)?.status, "completed");
  assert.ok(state.recentEvents.some((event) => event.type === "GENERATED_QUEST_COMPLETED"));
});
