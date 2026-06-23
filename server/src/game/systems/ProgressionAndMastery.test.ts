import { test } from "node:test";
import assert from "node:assert";
import { ProgressionSystem } from "./ProgressionSystem";
import { MasterySystem } from "./MasterySystem";
import { SessionSummarySystem } from "./SessionSummarySystem";
import type { PlayerSave } from "../types/gameTypes";

const MOCK_SAVE: PlayerSave = {
  schemaVersion: 2,
  id: "test-save",
  playerName: "Marcus",
  createdAt: "2026-06-20T12:00:00Z",
  updatedAt: "2026-06-20T12:00:00Z",
  currentCampaignId: "vicus_first_days",
  currentChapterId: "caput-1",
  currentQuestId: "quest-1",
  currentSceneId: "scene-1",
  level: 1,
  xp: 50,
  currency: 10,
  streak: {
    current: 1,
    best: 1,
    lastActiveDate: "2026-06-20",
  },
  masteryStates: [
    {
      targetId: "vocab-sum",
      targetType: "vocabulary",
      seenCount: 2,
      correctCount: 1,
      wrongCount: 1,
      mastery: 50,
    }
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
  npcMemories: [],
  locationStates: [],
  worldEvents: [],
  activeSideQuestSuggestions: [],
  narrativeFlags: {},
  generatedQuests: [], assessmentAttempts: [], achievements: [], analyticsSnapshots: []
};

test("ProgressionSystem - calculateLevel and XP checks", () => {
  const system = new ProgressionSystem();

  assert.strictEqual(system.calculateLevel(0), 1);
  assert.strictEqual(system.calculateLevel(99), 1);
  assert.strictEqual(system.calculateLevel(100), 2);
  assert.strictEqual(system.calculateLevel(250), 3);

  const updated = system.addXp(MOCK_SAVE, 60); // Total XP: 110
  assert.strictEqual(updated.xp, 110);
  assert.strictEqual(updated.level, 2);
  assert.strictEqual(system.getXpToNextLevel(updated), 90);
  assert.strictEqual(system.getProgressPercent(updated), 10);
});

test("ProgressionSystem - updateDailyStreak daily check", () => {
  const system = new ProgressionSystem();

  // Same day -> no change
  const todayDate = new Date("2026-06-20T15:00:00Z");
  const sameDay = system.updateDailyStreak(MOCK_SAVE, todayDate);
  assert.strictEqual(sameDay.streak.current, 1);

  // Next day -> increments
  const nextDate = new Date("2026-06-21T10:00:00Z");
  const nextDay = system.updateDailyStreak(MOCK_SAVE, nextDate);
  assert.strictEqual(nextDay.streak.current, 2);
  assert.strictEqual(nextDay.streak.best, 2);
  assert.strictEqual(nextDay.streak.lastActiveDate, "2026-06-21");

  // Multi-day gap -> resets to 1
  const gapDate = new Date("2026-06-25T12:00:00Z");
  const gapDay = system.updateDailyStreak(MOCK_SAVE, gapDate);
  assert.strictEqual(gapDay.streak.current, 1);
  assert.strictEqual(gapDay.streak.best, 1); // Best is not lowered if it was 1. But since we check reset, best of MOCK_SAVE is 1, so best remains 1.
});

test("MasterySystem - updateMastery correctly increments stats", () => {
  const system = new MasterySystem();

  // Correct answer
  const correctState = system.updateMastery({
    save: MOCK_SAVE,
    targetId: "vocab-sum",
    targetType: "vocabulary",
    isCorrect: true,
  });

  const correctTarget = correctState.masteryStates.find(m => m.targetId === "vocab-sum")!;
  assert.strictEqual(correctTarget.seenCount, 3);
  assert.strictEqual(correctTarget.correctCount, 2);
  assert.strictEqual(correctTarget.wrongCount, 1);
  assert.ok(correctTarget.mastery > 50, "Mastery score should increase for correct answer");

  // Wrong answer
  const wrongState = system.updateMastery({
    save: MOCK_SAVE,
    targetId: "vocab-sum",
    targetType: "vocabulary",
    isCorrect: false,
  });

  const wrongTarget = wrongState.masteryStates.find(m => m.targetId === "vocab-sum")!;
  assert.strictEqual(wrongTarget.seenCount, 3);
  assert.strictEqual(wrongTarget.correctCount, 1);
  assert.strictEqual(wrongTarget.wrongCount, 2);
  assert.strictEqual(wrongTarget.mastery, 50, "Mastery score should remain same for wrong answer");
});

test("SessionSummarySystem - parse event logs and compile stats", () => {
  const system = new SessionSummarySystem();

  const saveWithEvents: PlayerSave = {
    ...MOCK_SAVE,
    completedSceneIds: ["scene-1"],
    eventLog: [
      { id: "e1", type: "scene.entered", timestamp: "2026-06-20T12:01:00Z", payload: { sceneId: "scene-1" } },
      { id: "e2", type: "TEXT_EVALUATED", timestamp: "2026-06-20T12:02:00Z", payload: { evaluation: { isCorrect: true, score: 90, errorTags: [] } } },
      { id: "e3", type: "TEXT_EVALUATED", timestamp: "2026-06-20T12:03:00Z", payload: { evaluation: { isCorrect: false, score: 40, errorTags: ["missing-sum"] } } },
      { id: "e4", type: "XP_ADDED", timestamp: "2026-06-20T12:04:00Z", payload: { amount: 35 } },
      { id: "e5", type: "CURRENCY_ADDED", timestamp: "2026-06-20T12:04:00Z", payload: { amount: 15 } },
      { id: "e6", type: "ITEM_ADDED", timestamp: "2026-06-20T12:04:00Z", payload: { itemId: "gladius", quantity: 1 } },
      { id: "e7", type: "SKILL_INCREMENTED", timestamp: "2026-06-20T12:04:00Z", payload: { skillId: "latin_basics", amount: 1 } },
      { id: "e8", type: "MASTERY_UPDATED", timestamp: "2026-06-20T12:04:00Z", payload: { targetId: "vocab-sum", targetType: "vocabulary", before: 50, after: 75 } },
    ],
  };

  const summary = system.getSessionSummary(saveWithEvents);

  assert.strictEqual(summary.completedScenes, 1);
  assert.strictEqual(summary.correctAnswers, 1);
  assert.strictEqual(summary.wrongAnswers, 1);
  assert.strictEqual(summary.xpGained, 35);
  assert.strictEqual(summary.currencyGained, 15);
  assert.deepStrictEqual(summary.newItems, ["gladius"]);
  assert.deepStrictEqual(summary.newSkills, ["latin_basics"]);
  assert.strictEqual(summary.improvedMastery.length, 1);
  assert.strictEqual(summary.improvedMastery[0].targetId, "vocab-sum");
  assert.strictEqual(summary.improvedMastery[0].before, 50);
  assert.strictEqual(summary.improvedMastery[0].after, 75);
});
