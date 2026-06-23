import { test } from "node:test";
import assert from "node:assert";
import { LivingSceneSystem } from "./LivingSceneSystem";
import type { PlayerSave } from "../types/gameTypes";

function createEmptySave(): PlayerSave {
  return {
    schemaVersion: 5,
    id: "test-save",
    playerName: "Test",
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

test("LivingSceneSystem - visit count increments and tracks enters", () => {
  const system = new LivingSceneSystem();
  let save = createEmptySave();

  assert.strictEqual(system.getSceneVisitCount(save, "vicus_001_home_morning"), 0);

  save = system.onSceneEnter({ save, sceneId: "vicus_001_home_morning" });
  assert.strictEqual(system.getSceneVisitCount(save, "vicus_001_home_morning"), 1);

  save = system.onSceneEnter({ save, sceneId: "vicus_001_home_morning" });
  assert.strictEqual(system.getSceneVisitCount(save, "vicus_001_home_morning"), 2);
});

test("LivingSceneSystem - local flags and clue discovery", () => {
  const system = new LivingSceneSystem();
  let save = createEmptySave();

  assert.strictEqual(system.hasSceneLocalFlag(save, "vicus_001_home_morning", "opened_gate"), false);

  save = system.setLocalFlag({ save, sceneId: "vicus_001_home_morning", key: "opened_gate", value: true });
  assert.strictEqual(system.hasSceneLocalFlag(save, "vicus_001_home_morning", "opened_gate"), true);
  assert.strictEqual(system.hasSceneLocalFlag(save, "vicus_001_home_morning", "opened_gate", true), true);
  assert.strictEqual(system.hasSceneLocalFlag(save, "vicus_001_home_morning", "opened_gate", false), false);

  save = system.addSceneClue({ save, sceneId: "vicus_001_home_morning", clueId: "secret_note" });
  const state = system.getOrCreateSceneState(save, "vicus_001_home_morning");
  assert.ok(state.discoveredClueIds.includes("secret_note"));
});
