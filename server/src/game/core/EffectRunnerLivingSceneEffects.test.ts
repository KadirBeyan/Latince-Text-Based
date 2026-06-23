import { test } from "node:test";
import assert from "node:assert";
import { EffectRunner } from "./EffectRunner";
import { ContentLoader } from "../content/ContentLoader";
import { EventBus } from "./EventBus";
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

test("EffectRunner - applies SET_SCENE_LOCAL_FLAG and ADD_SCENE_CLUE", () => {
  const contentLoader = new ContentLoader();
  const eventBus = new EventBus();
  const runner = new EffectRunner(contentLoader, eventBus);
  const livingSceneSystem = new LivingSceneSystem();

  let save = createEmptySave();

  save = runner.applyEffects(
    save,
    [
      { type: "SET_SCENE_LOCAL_FLAG", sceneId: "ludus_intro", key: "dirty", value: true },
      { type: "ADD_SCENE_CLUE", sceneId: "ludus_intro", clueId: "blood_stain" }
    ],
    { campaignId: "via-prima", chapterId: "prologus", questId: "quest_prima_dies", sceneId: "ludus_intro" }
  );

  assert.strictEqual(livingSceneSystem.hasSceneLocalFlag(save, "ludus_intro", "dirty", true), true);
  const state = livingSceneSystem.getOrCreateSceneState(save, "ludus_intro");
  assert.ok(state.discoveredClueIds.includes("blood_stain"));
});
