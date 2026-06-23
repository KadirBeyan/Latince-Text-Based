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

test("EffectRunner - applies SET_SCENE_LOCAL_FLAG and ADD_SCENE_CLUE", () => {
  const contentLoader = new ContentLoader();
  const eventBus = new EventBus();
  const runner = new EffectRunner(contentLoader, eventBus);
  const livingSceneSystem = new LivingSceneSystem();

  let save = createEmptySave();

  save = runner.applyEffects(
    save,
    [
      { type: "SET_SCENE_LOCAL_FLAG", sceneId: "vicus_001_home_morning", key: "dirty", value: true },
      { type: "ADD_SCENE_CLUE", sceneId: "vicus_001_home_morning", clueId: "blood_stain" }
    ],
    { campaignId: "vicus_first_days", chapterId: "village_first_days", questId: "vicus_prologue_main", sceneId: "vicus_001_home_morning" }
  );

  assert.strictEqual(livingSceneSystem.hasSceneLocalFlag(save, "vicus_001_home_morning", "dirty", true), true);
  const state = livingSceneSystem.getOrCreateSceneState(save, "vicus_001_home_morning");
  assert.ok(state.discoveredClueIds.includes("blood_stain"));
});
