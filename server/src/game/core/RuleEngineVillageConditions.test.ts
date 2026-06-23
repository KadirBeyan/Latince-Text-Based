import { test } from "node:test";
import assert from "node:assert";
import { RuleEngine } from "./RuleEngine";
import type { PlayerSave } from "../types/gameTypes";

function createEmptySave(): PlayerSave {
  return {
    schemaVersion: 6,
    id: "test-save",
    playerName: "Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentCampaignId: "vicus_first_days",
    currentChapterId: "vicus_prologue",
    currentQuestId: "vicus_prologue_main",
    currentSceneId: "vicus_001_home_morning",
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
    characterProfile: {
      name: "Titus",
      displayName: "Titus",
      origin: "rural_family",
      traits: ["curious"],
      skills: {
        lingua: 1,
        memoria: 1,
        observatio: 1,
        urbanitas: 1,
        auctoritas: 1,
        mercatura: 1,
        disciplina: 1,
        labor: 1,
        scriptura: 1,
        pietas: 1
      },
      backgroundSummaryTr: "",
      createdAt: "",
      lifePathHints: {
        ludus: 5,
        castra: 0,
        mercatura: 0,
        scriptura: 0,
        templum: 0,
        villa: 0
      },
      knownPeople: [],
      homeLocationId: "home_hut",
      currentLifePhase: "village_childhood"
    },
    villageLife: {
      dayState: {
        dayNumber: 2,
        timeOfDay: "meridies",
        actionsUsedThisPeriod: 1,
        maxActionsPerPeriod: 3,
        completedDailyActivityIds: ["help_mater_bread"],
        availableActivityIds: [],
        dayFlags: {
          met_magister: true
        }
      },
      routineHistory: []
    }
  };
}

test("RuleEngine - checks VILLAGE_TIME_EQUALS", () => {
  const engine = new RuleEngine();
  const save = createEmptySave();

  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_TIME_EQUALS", timeOfDay: "meridies" }), true);
  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_TIME_EQUALS", timeOfDay: "mane" }), false);
});

test("RuleEngine - checks VILLAGE_DAY_MIN", () => {
  const engine = new RuleEngine();
  const save = createEmptySave();

  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_DAY_MIN", dayNumber: 2 }), true);
  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_DAY_MIN", dayNumber: 3 }), false);
});

test("RuleEngine - checks VILLAGE_ACTIVITY_COMPLETED / VILLAGE_ACTIVITY_NOT_COMPLETED", () => {
  const engine = new RuleEngine();
  const save = createEmptySave();

  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_ACTIVITY_COMPLETED", activityId: "help_mater_bread" }), true);
  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_ACTIVITY_COMPLETED", activityId: "practice_with_magister" }), false);

  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_ACTIVITY_NOT_COMPLETED", activityId: "practice_with_magister" }), true);
  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_ACTIVITY_NOT_COMPLETED", activityId: "help_mater_bread" }), false);
});

test("RuleEngine - checks VILLAGE_DAY_FLAG_EQUALS", () => {
  const engine = new RuleEngine();
  const save = createEmptySave();

  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_DAY_FLAG_EQUALS", key: "met_magister", value: true }), true);
  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_DAY_FLAG_EQUALS", key: "met_magister", value: false }), false);
});

test("RuleEngine - checks VILLAGE_ACTIONS_AVAILABLE", () => {
  const engine = new RuleEngine();
  const save = createEmptySave();

  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_ACTIONS_AVAILABLE" }), true);
  
  // Set actions used to max
  save.villageLife!.dayState.actionsUsedThisPeriod = 3;
  assert.strictEqual(engine.checkCondition(save, { type: "VILLAGE_ACTIONS_AVAILABLE" }), false);
});

test("RuleEngine - checks LIFE_PATH_HINT_MIN", () => {
  const engine = new RuleEngine();
  const save = createEmptySave();

  assert.strictEqual(engine.checkCondition(save, { type: "LIFE_PATH_HINT_MIN", path: "ludus", value: 3 }), true);
  assert.strictEqual(engine.checkCondition(save, { type: "LIFE_PATH_HINT_MIN", path: "ludus", value: 6 }), false);
});

test("RuleEngine - checks CHARACTER_TRAIT_HAS", () => {
  const engine = new RuleEngine();
  const save = createEmptySave();

  assert.strictEqual(engine.checkCondition(save, { type: "CHARACTER_TRAIT_HAS", trait: "curious" }), true);
  assert.strictEqual(engine.checkCondition(save, { type: "CHARACTER_TRAIT_HAS", trait: "bold" }), false);
});

test("RuleEngine - checks CHARACTER_ORIGIN_EQUALS", () => {
  const engine = new RuleEngine();
  const save = createEmptySave();

  assert.strictEqual(engine.checkCondition(save, { type: "CHARACTER_ORIGIN_EQUALS", origin: "rural_family" }), true);
  assert.strictEqual(engine.checkCondition(save, { type: "CHARACTER_ORIGIN_EQUALS", origin: "trader_family" }), false);
});
