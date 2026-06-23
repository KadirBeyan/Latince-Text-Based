import test from "node:test";
import assert from "node:assert";
import { sanitizeGeneratedQuestDraft } from "./LlmOutputGuard";

const scene = (index: number) => ({
  id: `gen_scene_${index}`,
  role: index === 0 ? "intro" : "practice",
  title: `Scene ${index}`,
  description: "Kısa açıklama",
  objective: "Devam et",
  inputMode: "choice",
  choices: [{ label: "Devam", nextSceneId: index < 6 ? `gen_scene_${index + 1}` : undefined }],
  effects: [{ type: "SET_FLAG", key: "forbidden", value: true }]
});

test("sanitizeGeneratedQuestDraft rejects drafts with fewer than two scenes", () => {
  assert.strictEqual(sanitizeGeneratedQuestDraft({ title: "Eksik", scenes: [scene(0)] }), null);
});

test("sanitizeGeneratedQuestDraft clamps scenes and strips LLM effects", () => {
  const quest = sanitizeGeneratedQuestDraft({ title: "Uzun görev", scenes: Array.from({ length: 8 }, (_, index) => scene(index)) });
  assert.ok(quest);
  assert.strictEqual(quest.scenes.length, 6);
  assert.ok(quest.scenes.every((candidate) => candidate.effects.length === 0));
  assert.strictEqual(new Set(quest.scenes.map((candidate) => candidate.id)).size, quest.scenes.length);
});
