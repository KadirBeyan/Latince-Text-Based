import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "../content/ContentLoader";
import { CampaignProgressSystem } from "./CampaignProgressSystem";
import type { PlayerSave } from "../types/gameTypes";

function save(): PlayerSave {
  return { schemaVersion: 5, id: "s", playerName: "P", createdAt: "", updatedAt: "", currentCampaignId: "vicus_first_days", currentChapterId: "village_first_days", currentQuestId: "vicus_prologue_main", currentSceneId: "vicus_001_home_morning", level: 1, xp: 0, currency: 0, streak: { current: 0, best: 0 }, masteryStates: [], seenRewardEventIds: [], flags: {}, inventory: [], skills: [], questStates: {}, completedSceneIds: [], visitedSceneIds: [], journalEntries: [], dialogueLog: [], eventLog: [], npcMemories: [], locationStates: [], worldEvents: [], activeSideQuestSuggestions: [], narrativeFlags: {}, generatedQuests: [], assessmentAttempts: [], achievements: [], analyticsSnapshots: [], chapterProgress: {} };
}

test("CampaignProgressSystem unlocks and completes chapters", () => {
  const campaign = new ContentLoader().load().campaigns.find((candidate) => candidate.id === "vicus_first_days");
  assert.ok(campaign);
  const system = new CampaignProgressSystem();
  let current = system.unlockChapter(save(), "ludus");
  assert.strictEqual(current.chapterProgress?.ludus.unlocked, true);
  current = system.completeChapter(current, "ludus");
  assert.strictEqual(current.chapterProgress?.ludus.completed, true);
  assert.strictEqual(current.chapterProgress?.ludus.progressPercent, 100);
});

test("CampaignProgressSystem calculates scene progress", () => {
  const campaign = new ContentLoader().load().campaigns.find((candidate) => candidate.id === "vicus_first_days");
  assert.ok(campaign);
  const current = save();
  current.completedSceneIds = ["vicus_001_home_morning", "vicus_002_village_path"];
  const progress = new CampaignProgressSystem().getChapterProgress(current, campaign, "village_first_days");
  assert.strictEqual(progress.completedSceneIds.length, 2);
  assert.ok(progress.progressPercent > 0);
});
