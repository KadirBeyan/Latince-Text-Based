import { test } from "node:test";
import assert from "node:assert";
import { NpcMemorySystem } from "./NpcMemorySystem";
import { NpcRelationshipSystem } from "./NpcRelationshipSystem";
import { LocationStateSystem } from "./LocationStateSystem";
import { WorldEventSystem } from "./WorldEventSystem";
import { SideQuestSystem } from "./SideQuestSystem";
import type { PlayerSave } from "../types/gameTypes";

const createBaseSave = (): PlayerSave => ({
  schemaVersion: 3,
  id: "test-save",
  playerName: "Aeneas",
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
  errorMemory: [],
  npcMemories: [],
  locationStates: [],
  worldEvents: [],
  activeSideQuestSuggestions: [],
  narrativeFlags: {},
  generatedQuests: [], assessmentAttempts: [], achievements: [], analyticsSnapshots: []
});

test("NpcMemorySystem - manage memories and importance pruning", () => {
  const system = new NpcMemorySystem();
  let save = createBaseSave();

  // Record interactions
  save = system.recordNpcInteraction({
    save,
    npcId: "magister",
    summary: "Magister selamı önemsiyor.",
    importance: 80,
    tags: ["greetings"]
  });

  const memory = save.npcMemories.find(m => m.npcId === "magister");
  assert.ok(memory);
  assert.strictEqual(memory.facts.length, 1);
  assert.strictEqual(memory.facts[0].text, "Magister selamı önemsiyor.");
  assert.strictEqual(memory.facts[0].importance, 80);

  // Fill up memory up to limit (30) to test pruning
  for (let i = 0; i < 35; i++) {
    save = system.recordNpcInteraction({
      save,
      npcId: "magister",
      summary: `Hafıza ${i}`,
      importance: i === 5 ? 5 : 50 + i, // Make one fact low importance (5)
      tags: ["test"]
    });
  }

  const updatedMemory = save.npcMemories.find(m => m.npcId === "magister");
  assert.ok(updatedMemory);
  // Max size limit should clamp to 30
  assert.ok(updatedMemory.facts.length <= 30);
  
  // The lowest importance fact (importance 5) should have been pruned
  const hasPrunedFact = updatedMemory.facts.some(f => f.text === "Hafıza 5");
  assert.strictEqual(hasPrunedFact, false);
});

test("NpcRelationshipSystem - defaults and relationship clamping", () => {
  const system = new NpcRelationshipSystem();
  let save = createBaseSave();

  // Test default initialization
  save = system.updateRelationship({
    save,
    npcId: "marcus",
    delta: { trust: 10 }
  });

  const rel = save.npcMemories.find(m => m.npcId === "marcus")?.relationship;
  assert.ok(rel);
  // Default respect=40, familiarity=10. trust initialized to 40 + 10 = 50.
  assert.strictEqual(rel.trust, 50);
  assert.strictEqual(rel.respect, 40);
  assert.strictEqual(rel.familiarity, 10);

  // Test clamping bounds [0, 100]
  save = system.updateRelationship({
    save,
    npcId: "marcus",
    delta: { trust: 200, respect: -100 }
  });

  const clampedRel = save.npcMemories.find(m => m.npcId === "marcus")?.relationship;
  assert.ok(clampedRel);
  assert.strictEqual(clampedRel.trust, 100);
  assert.strictEqual(clampedRel.respect, 0);
});

test("LocationStateSystem - discovery and mood updates", () => {
  const system = new LocationStateSystem();
  let save = createBaseSave();

  // Discover location
  save = system.discoverLocation({ save, locationId: "forum" });
  let state = save.locationStates.find(l => l.locationId === "forum");
  assert.ok(state);
  assert.strictEqual(state.discovered, true);
  assert.strictEqual(state.visitCount, 0);

  // Record visit
  save = system.recordVisit({ save, locationId: "forum" });
  state = save.locationStates.find(l => l.locationId === "forum");
  assert.ok(state);
  assert.strictEqual(state.visitCount, 1);

  // Set mood and flags
  save = system.setLocationMood({ save, locationId: "forum", mood: "tense" });
  save = system.setLocationFlag({ save, locationId: "forum", key: "is_locked", value: true });
  
  state = save.locationStates.find(l => l.locationId === "forum");
  assert.ok(state);
  assert.strictEqual(state.mood, "tense");
  assert.strictEqual(state.flags.is_locked, true);
});

test("WorldEventSystem - active events and rumors", () => {
  const system = new WorldEventSystem();
  let save = createBaseSave();

  // Add active news
  save = system.addWorldEvent({
    save,
    event: {
      type: "news",
      title: "Haberler",
      text: "Roma'da hava güzel.",
      importance: 50
    }
  });

  // Add expired news
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  save = system.addWorldEvent({
    save,
    event: {
      type: "news",
      title: "Eski Haber",
      text: "Dün yağmur yağdı.",
      importance: 10,
      expiresAt: yesterday.toISOString()
    }
  });

  const active = system.getActiveWorldEvents(save);
  assert.strictEqual(active.length, 1);
  assert.strictEqual(active[0].title, "Haberler");

  // Mark seen
  save = system.markWorldEventSeen({ save, eventId: active[0].id });
  assert.strictEqual(save.worldEvents[0].seen, true);
});

test("SideQuestSystem - generate suggestions from errors", () => {
  const system = new SideQuestSystem();
  let save = createBaseSave();

  // Inject weak mastery / error memory to trigger side quests
  save.errorMemory = [
    {
      tag: "missing-sum",
      count: 2,
      lastSeenAt: new Date().toISOString(),
      relatedSceneIds: [],
      relatedGrammarIds: [],
      relatedVocabularyIds: []
    }
  ];

  save = system.refreshSideQuestSuggestions(save);
  
  // Should have generated suggestions
  assert.ok(save.activeSideQuestSuggestions.length > 0);
  const suggestion = save.activeSideQuestSuggestions[0];
  assert.strictEqual(suggestion.status, "suggested");

  // Accept suggestion
  save = system.acceptSideQuestSuggestion({ save, suggestionId: suggestion.id });
  assert.strictEqual(save.activeSideQuestSuggestions[0].status, "accepted");

  // Dismiss suggestion
  save = system.dismissSideQuestSuggestion({ save, suggestionId: suggestion.id });
  assert.strictEqual(save.activeSideQuestSuggestions[0].status, "dismissed");
});
