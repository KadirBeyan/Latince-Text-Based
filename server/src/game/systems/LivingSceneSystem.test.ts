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

test("LivingSceneSystem - visit count increments and tracks enters", () => {
  const system = new LivingSceneSystem();
  let save = createEmptySave();

  assert.strictEqual(system.getSceneVisitCount(save, "ludus_intro"), 0);

  save = system.onSceneEnter({ save, sceneId: "ludus_intro" });
  assert.strictEqual(system.getSceneVisitCount(save, "ludus_intro"), 1);

  save = system.onSceneEnter({ save, sceneId: "ludus_intro" });
  assert.strictEqual(system.getSceneVisitCount(save, "ludus_intro"), 2);
});

test("LivingSceneSystem - local flags and clue discovery", () => {
  const system = new LivingSceneSystem();
  let save = createEmptySave();

  assert.strictEqual(system.hasSceneLocalFlag(save, "ludus_intro", "opened_gate"), false);

  save = system.setLocalFlag({ save, sceneId: "ludus_intro", key: "opened_gate", value: true });
  assert.strictEqual(system.hasSceneLocalFlag(save, "ludus_intro", "opened_gate"), true);
  assert.strictEqual(system.hasSceneLocalFlag(save, "ludus_intro", "opened_gate", true), true);
  assert.strictEqual(system.hasSceneLocalFlag(save, "ludus_intro", "opened_gate", false), false);

  save = system.addSceneClue({ save, sceneId: "ludus_intro", clueId: "secret_note" });
  const state = system.getOrCreateSceneState(save, "ludus_intro");
  assert.ok(state.discoveredClueIds.includes("secret_note"));
});
