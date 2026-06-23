import { test } from "node:test";
import assert from "node:assert";
import { EffectRunner } from "./EffectRunner";
import { ContentLoader } from "../content/ContentLoader";
import { EventBus } from "./EventBus";
import type { PlayerSave } from "../types/gameTypes";

function createMockSave(): PlayerSave {
  return {
    schemaVersion: 6,
    id: "test-save",
    playerName: "Test",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentCampaignId: "via-prima",
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
        ludus: 0,
        castra: 0,
        mercatura: 0,
        scriptura: 0,
        templum: 0,
        villa: 0
      },
      knownPeople: [],
      homeLocationId: "home_hut",
      currentLifePhase: "village_childhood",
      skillProgress: {
        lingua: 90,
        memoria: 0,
        observatio: 0,
        urbanitas: 0,
        auctoritas: 0,
        mercatura: 0,
        disciplina: 0,
        labor: 0,
        scriptura: 0,
        pietas: 0
      }
    },
    villageLife: {
      dayState: {
        dayNumber: 1,
        timeOfDay: "mane",
        actionsUsedThisPeriod: 0,
        maxActionsPerPeriod: 3,
        completedDailyActivityIds: [],
        availableActivityIds: [],
        dayFlags: {}
      },
      routineHistory: []
    }
  };
}

test("EffectRunner - applies village effects", () => {
  const contentLoader = new ContentLoader();
  const eventBus = new EventBus();
  const runner = new EffectRunner(contentLoader, eventBus);

  let save = createMockSave();

  // 1. SET_VILLAGE_DAY_FLAG
  save = runner.applyEffects(
    save,
    [{ type: "SET_VILLAGE_DAY_FLAG", key: "helped_mother", value: true }],
    { campaignId: "via-prima", chapterId: "vicus_prologue", questId: "vicus_prologue_main", sceneId: "vicus_001_home_morning" }
  );
  assert.strictEqual(save.villageLife?.dayState.dayFlags.helped_mother, true);

  // 2. RECORD_VILLAGE_ACTIVITY
  save = runner.applyEffects(
    save,
    [{
      type: "RECORD_VILLAGE_ACTIVITY",
      payload: {
        activityId: "help_mater_bread",
        npcIds: ["mater"],
        lifePathChanges: { villa: 2 },
        summaryTr: "Ekmek tasima isi bitti."
      }
    }],
    { campaignId: "via-prima", chapterId: "vicus_prologue", questId: "vicus_prologue_main", sceneId: "vicus_001_home_morning" }
  );
  assert.strictEqual(save.villageLife?.dayState.actionsUsedThisPeriod, 1);
  assert.ok(save.villageLife?.dayState.completedDailyActivityIds.includes("help_mater_bread"));
  assert.strictEqual(save.characterProfile?.lifePathHints.villa, 2);

  // 3. ADVANCE_VILLAGE_TIME
  save = runner.applyEffects(
    save,
    [{ type: "ADVANCE_VILLAGE_TIME" }],
    { campaignId: "via-prima", chapterId: "vicus_prologue", questId: "vicus_prologue_main", sceneId: "vicus_001_home_morning" }
  );
  assert.strictEqual(save.villageLife?.dayState.timeOfDay, "meridies");

  // 4. START_NEW_VILLAGE_DAY
  save = runner.applyEffects(
    save,
    [{ type: "START_NEW_VILLAGE_DAY" }],
    { campaignId: "via-prima", chapterId: "vicus_prologue", questId: "vicus_prologue_main", sceneId: "vicus_001_home_morning" }
  );
  assert.strictEqual(save.villageLife?.dayState.dayNumber, 2);
  assert.strictEqual(save.villageLife?.dayState.timeOfDay, "mane");
});

test("EffectRunner - applies ADD_RPG_SKILL_PROGRESS & handles level ups", () => {
  const contentLoader = new ContentLoader();
  const eventBus = new EventBus();
  const runner = new EffectRunner(contentLoader, eventBus);

  let save = createMockSave();

  // Skill starts at progress 90, level 1. Adding 15 progress should result in progress 5, level 2.
  save = runner.applyEffects(
    save,
    [{
      type: "ADD_RPG_SKILL_PROGRESS",
      payload: {
        skillId: "lingua",
        amount: 15,
        reasonTr: "Harika Latin pratik!"
      }
    }],
    { campaignId: "via-prima", chapterId: "vicus_prologue", questId: "vicus_prologue_main", sceneId: "vicus_001_home_morning" }
  );

  assert.strictEqual(save.characterProfile?.skills.lingua, 2);
  assert.strictEqual(save.characterProfile?.skillProgress?.lingua, 5);

  const levelUpEvent = save.eventLog?.find((e: any) => e.type === "RPG_SKILL_PROGRESS_ADDED");
  assert.ok(levelUpEvent);
  assert.strictEqual(levelUpEvent.payload.levelsGained, 1);
});
