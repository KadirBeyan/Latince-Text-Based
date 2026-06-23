import { test } from "node:test";
import assert from "node:assert";
import { VillageLifeSystem } from "./VillageLifeSystem";
import type { PlayerSave } from "../types/gameTypes";

function createMockSave(): PlayerSave {
  return {
    schemaVersion: 6,
    id: "test-save",
    playerName: "Player",
    createdAt: "",
    updatedAt: "",
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
    chapterProgress: {},
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
      currentLifePhase: "village_childhood"
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

test("VillageLifeSystem initializes state if missing", () => {
  const system = new VillageLifeSystem();
  const saveWithoutVillage = createMockSave();
  delete saveWithoutVillage.villageLife;

  const villageLife = system.getVillageLife(saveWithoutVillage);
  assert.strictEqual(villageLife.dayState.dayNumber, 1);
  assert.strictEqual(villageLife.dayState.timeOfDay, "mane");
});

test("VillageLifeSystem advances time correctly through phases", () => {
  const system = new VillageLifeSystem();
  let state = createMockSave();

  // mane -> meridies
  let res = system.advanceTime({ save: state, reasonTr: "Test" });
  assert.strictEqual(res.save.villageLife?.dayState.timeOfDay, "meridies");
  assert.strictEqual(res.save.villageLife?.dayState.dayNumber, 1);
  assert.strictEqual(res.events[0].type, "VILLAGE_TIME_ADVANCED");

  // meridies -> vesper
  state = res.save;
  res = system.advanceTime({ save: state });
  assert.strictEqual(res.save.villageLife?.dayState.timeOfDay, "vesper");

  // vesper -> nox
  state = res.save;
  res = system.advanceTime({ save: state });
  assert.strictEqual(res.save.villageLife?.dayState.timeOfDay, "nox");

  // nox -> mane & next day
  state = res.save;
  res = system.advanceTime({ save: state });
  assert.strictEqual(res.save.villageLife?.dayState.timeOfDay, "mane");
  assert.strictEqual(res.save.villageLife?.dayState.dayNumber, 2);
});

test("VillageLifeSystem records activities and updates history", () => {
  const system = new VillageLifeSystem();
  let state = createMockSave();

  state = system.recordVillageActivity({
    save: state,
    activityId: "help_mater_bread",
    npcIds: ["mater"],
    lifePathChanges: { villa: 2 },
    summaryTr: "Mater'a yardim ettin."
  });

  const villageLife = state.villageLife!;
  assert.strictEqual(villageLife.dayState.actionsUsedThisPeriod, 1);
  assert.ok(villageLife.dayState.completedDailyActivityIds.includes("help_mater_bread"));
  assert.strictEqual(villageLife.routineHistory.length, 1);
  assert.strictEqual(villageLife.routineHistory[0].dayNumber, 1);
  assert.ok(villageLife.routineHistory[0].activityIds.includes("help_mater_bread"));
  assert.strictEqual(state.characterProfile?.lifePathHints.villa, 2);
});

test("VillageLifeSystem updates day flags", () => {
  const system = new VillageLifeSystem();
  let state = createMockSave();

  state = system.setVillageDayFlag({ save: state, key: "talked_to_veteran", value: true });
  assert.strictEqual(state.villageLife?.dayState.dayFlags.talked_to_veteran, true);
});
