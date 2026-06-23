import { test } from "node:test";
import assert from "node:assert";
import { AuthoringValidationService } from "./AuthoringValidationService";
import type { Scene } from "../game/types/gameTypes";

test("AuthoringValidationService - dialogue-response validation checks", () => {
  const service = new AuthoringValidationService();

  // 1. Missing dialogue challenge in dialogue-response mode
  const scene1: Scene = {
    id: "test_scene_1",
    title: "Test Scene 1",
    locationId: "ludus",
    npcIds: [],
    description: "NPC ile konusuyorsun.",
    objective: "Kendini tanıt.",
    inputMode: "dialogue-response",
    choices: [],
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };

  const result1 = service.validateScene(scene1);
  assert.strictEqual(result1.ok, false);
  assert.ok(result1.errors.some(i => i.code === "MISSING_DIALOGUE_CHALLENGE"));

  // 2. Missing playerIntentTr and targetMeaningTr
  const scene2: Scene = {
    id: "test_scene_2",
    title: "Test Scene 2",
    locationId: "ludus",
    npcIds: [],
    description: "NPC ile konusuyorsun.",
    objective: "Kendini tanıt.",
    inputMode: "dialogue-response",
    choices: [],
    dialogueChallenge: {
      mode: "dialogue-response",
      playerIntentTr: "", // empty
      targetMeaningTr: "", // empty
      canonicalAnswers: [], // empty
    },
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };

  const result2 = service.validateScene(scene2);
  assert.strictEqual(result2.ok, false);
  assert.ok(result2.errors.some(i => i.code === "MISSING_PLAYER_INTENT"));
  assert.ok(result2.errors.some(i => i.code === "MISSING_TARGET_MEANING"));
  assert.ok(result2.errors.some(i => i.code === "MISSING_CANONICAL_ANSWERS"));
});

test("AuthoringValidationService - hybrid-dialogue validation checks", () => {
  const service = new AuthoringValidationService();

  // 1. Missing hybridDialogue in hybrid-dialogue mode
  const scene1: Scene = {
    id: "test_scene_h1",
    title: "Test Scene H1",
    locationId: "ludus",
    npcIds: [],
    description: "NPC ile konusuyorsun.",
    objective: "Kendini tanıt.",
    inputMode: "hybrid-dialogue",
    choices: [],
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };

  const result1 = service.validateScene(scene1);
  assert.strictEqual(result1.ok, false);
  assert.ok(result1.errors.some(i => i.code === "MISSING_HYBRID_DIALOGUE"));

  // 2. Invalid intents configuration
  const scene2: Scene = {
    id: "test_scene_h2",
    title: "Test Scene H2",
    locationId: "ludus",
    npcIds: [],
    description: "NPC ile konusuyorsun.",
    objective: "Kendini tanıt.",
    inputMode: "hybrid-dialogue",
    choices: [],
    hybridDialogue: {
      intents: [
        {
          id: "", // empty
          labelTr: "", // empty
          targetMeaningTr: "", // empty
          canonicalAnswers: [], // empty
        },
      ],
    },
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };

  const result2 = service.validateScene(scene2);
  assert.strictEqual(result2.ok, false);
  assert.ok(result2.errors.some(i => i.code === "MISSING_INTENT_ID"));
  assert.ok(result2.errors.some(i => i.code === "MISSING_INTENT_LABEL"));
  assert.ok(result2.errors.some(i => i.code === "MISSING_INTENT_MEANING"));
  assert.ok(result2.errors.some(i => i.code === "MISSING_INTENT_ANSWERS"));
});
