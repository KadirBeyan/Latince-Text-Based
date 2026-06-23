import { test } from "node:test";
import assert from "node:assert";
import { RuleEngine } from "./RuleEngine";
import { LivingSceneSystem } from "../systems/LivingSceneSystem";
import type { PlayerSave } from "../types/gameTypes";

function createEmptySave(): PlayerSave {
  return {
    schemaVersion: 5,
    id: "test-save",
    playerName: "Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentCampaignId: "via-prima",
    currentChapterId: "prologus",
    currentQuestId: "quest_prima_dies",
    currentSceneId: "ludus_intro",
    level: 1,
    xp: 0,
    currency: 0,
    streak: { current: 0, best: 0 },
    masteryStates: [],
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
    npcMemories: [],
    locationStates: [],
    worldEvents: [],
    activeSideQuestSuggestions: [],
    narrativeFlags: {},
    generatedQuests: [],
    assessmentAttempts: [],
    achievements: [],
    analyticsSnapshots: [],
    livingSceneStates: {}
  };
}

test("RuleEngine - checks SCENE_VISIT_COUNT_MIN", () => {
  const engine = new RuleEngine();
  const livingSceneSystem = new LivingSceneSystem();
  let save = createEmptySave();

  const cond = { type: "SCENE_VISIT_COUNT_MIN" as const, sceneId: "ludus_intro", count: 2 };
  assert.strictEqual(engine.checkCondition(save, cond), false);

  save = livingSceneSystem.onSceneEnter({ save, sceneId: "ludus_intro" });
  assert.strictEqual(engine.checkCondition(save, cond), false);

  save = livingSceneSystem.onSceneEnter({ save, sceneId: "ludus_intro" });
  assert.strictEqual(engine.checkCondition(save, cond), true);
});

test("RuleEngine - checks SCENE_LOCAL_FLAG_EQUALS", () => {
  const engine = new RuleEngine();
  const livingSceneSystem = new LivingSceneSystem();
  let save = createEmptySave();

  const cond = { type: "SCENE_LOCAL_FLAG_EQUALS" as const, sceneId: "ludus_intro", key: "is_sunny", value: true };
  assert.strictEqual(engine.checkCondition(save, cond), false);

  save = livingSceneSystem.setLocalFlag({ save, sceneId: "ludus_intro", key: "is_sunny", value: true });
  assert.strictEqual(engine.checkCondition(save, cond), true);
});
