import { test } from "node:test";
import assert from "node:assert";
import { RuleEngine } from "./RuleEngine";
import type { PlayerSave } from "../types/gameTypes";

const MOCK_SAVE: PlayerSave = {
  schemaVersion: 2,
  id: "test-save",
  playerName: "Aeneas",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentCampaignId: "vicus_first_days",
  currentChapterId: "village_first_days",
  currentQuestId: "vicus_prologue_main",
  currentSceneId: "vicus_001_home_morning",
  level: 3,
  xp: 150,
  currency: 0,
  streak: { current: 0, best: 0 },
  masteryStates: [],
  seenRewardEventIds: [],
  flags: {
    has_lesson_tools: true,
    completed_tutorial: false,
  },
  inventory: [
    { itemId: "wax_tablet", quantity: 1 }
  ],
  skills: [
    { skillId: "latin_basics", level: 2, unlocked: true }
  ],
  questStates: {},
  completedSceneIds: [],
  visitedSceneIds: ["vicus_001_home_morning"],
  journalEntries: [],
  dialogueLog: [],
  eventLog: [],
  npcMemories: [],
  locationStates: [],
  worldEvents: [],
  activeSideQuestSuggestions: [],
  narrativeFlags: {},
  generatedQuests: [], assessmentAttempts: [], achievements: [], analyticsSnapshots: []
};

test("RuleEngine - MIN_LEVEL condition", () => {
  const engine = new RuleEngine();
  
  assert.ok(engine.checkCondition(MOCK_SAVE, { type: "MIN_LEVEL", level: 2 }));
  assert.ok(engine.checkCondition(MOCK_SAVE, { type: "MIN_LEVEL", level: 3 }));
  assert.strictEqual(engine.checkCondition(MOCK_SAVE, { type: "MIN_LEVEL", level: 4 }), false);
});

test("RuleEngine - FLAG_EQUALS condition", () => {
  const engine = new RuleEngine();

  assert.ok(engine.checkCondition(MOCK_SAVE, { type: "FLAG_EQUALS", key: "has_lesson_tools", value: true }));
  assert.ok(engine.checkCondition(MOCK_SAVE, { type: "FLAG_EQUALS", key: "completed_tutorial", value: false }));
  assert.strictEqual(engine.checkCondition(MOCK_SAVE, { type: "FLAG_EQUALS", key: "non_existent", value: true }), false);
});

test("RuleEngine - HAS_ITEM and HAS_SKILL", () => {
  const engine = new RuleEngine();

  assert.ok(engine.checkCondition(MOCK_SAVE, { type: "HAS_ITEM", itemId: "wax_tablet", quantity: 1 }));
  assert.strictEqual(engine.checkCondition(MOCK_SAVE, { type: "HAS_ITEM", itemId: "stylus", quantity: 1 }), false);

  assert.ok(engine.checkCondition(MOCK_SAVE, { type: "HAS_SKILL", skillId: "latin_basics", minLevel: 1 }));
  assert.ok(engine.checkCondition(MOCK_SAVE, { type: "HAS_SKILL", skillId: "latin_basics", minLevel: 2 }));
  assert.strictEqual(engine.checkCondition(MOCK_SAVE, { type: "HAS_SKILL", skillId: "latin_greetings" }), false);
});
