import { test } from "node:test";
import assert from "node:assert";
import { ContentLoader } from "./ContentLoader";
import { ContentValidator } from "./ContentValidator";
import type { LoadedContent } from "../types/contentTypes";

function fixture(): LoadedContent { const loader = new ContentLoader(); return structuredClone(loader.load()); }

test("ContentValidator checks grammar and vocabulary references", () => {
  const content = fixture(); const scene = content.campaigns[0].chapters[0].quests[0].scenes[0];
  scene.learningFocus = { grammarIds: ["missing-grammar"], vocabularyIds: ["missing-word"], skillIds: ["latin_basics"], difficulty: "intro" };
  const result = new ContentValidator().validate(content);
  assert.ok(result.errors.some(i => i.code === "UNKNOWN_GRAMMAR"));
  assert.ok(result.errors.some(i => i.code === "UNKNOWN_VOCABULARY"));
});

test("ContentValidator warns about unreachable scenes and errors on invalid nextSceneId", () => {
  const content = fixture(); const quest = content.campaigns[0].chapters[0].quests[0];
  quest.scenes.push({ ...structuredClone(quest.scenes[0]), id: "orphan", choices: [], onEnterEvents: [] });
  quest.scenes[0].choices[0].nextSceneId = "missing-scene";
  const result = new ContentValidator().validate(content);
  assert.ok(result.warnings.some(i => i.code === "UNREACHABLE_SCENE" && i.refId === "orphan"));
  assert.ok(result.errors.some(i => i.code === "INVALID_NEXT_SCENE"));
});

test("ContentValidator reports scene graph cycle path and transition details", () => {
  const content = fixture();
  const quest = content.campaigns[0].chapters[0].quests[0];
  quest.startSceneId = "cycle_a";
  quest.scenes = [
    testScene("cycle_a", "cycle_b", "to_b"),
    testScene("cycle_b", "cycle_c", "to_c"),
    testScene("cycle_c", "cycle_a", "to_a"),
  ];

  const result = new ContentValidator().validate(content);
  const issue = result.warnings.find(i => i.code === "SCENE_GRAPH_CYCLE");
  assert.ok(issue);
  assert.match(issue.message, /path=cycle_a -> cycle_b -> cycle_c -> cycle_a/);
  assert.match(issue.message, /transition=choice.to_a/);
  assert.match(issue.message, /source=cycle_c target=cycle_a/);
});

test("ContentValidator treats allowed cycles as warning and asks for loopPurpose", () => {
  const content = fixture();
  const quest = content.campaigns[0].chapters[0].quests[0];
  quest.startSceneId = "retry_a";
  quest.scenes = [
    testScene("retry_a", "retry_b", "to_b"),
    { ...testScene("retry_b", "retry_a", "retry"), allowCycle: true },
  ];

  const result = new ContentValidator().validate(content);
  assert.ok(result.warnings.some(i => i.code === "SCENE_GRAPH_CYCLE" && i.message.includes("intentional=true")));
  assert.ok(result.warnings.some(i => i.code === "SCENE_GRAPH_CYCLE_MISSING_PURPOSE"));
  assert.ok(!result.errors.some(i => i.code === "SCENE_GRAPH_CYCLE"));
});

test("ContentValidator leaves acyclic scene graph clean", () => {
  const content = fixture();
  const quest = content.campaigns[0].chapters[0].quests[0];
  quest.startSceneId = "linear_a";
  quest.scenes = [testScene("linear_a", "linear_b", "to_b"), testScene("linear_b")];

  const result = new ContentValidator().validate(content);
  assert.ok(!result.warnings.some(i => i.code === "SCENE_GRAPH_CYCLE" && i.path.startsWith(`quests.${quest.id}.`)));
  assert.ok(!result.errors.some(i => i.code === "SCENE_GRAPH_CYCLE" && i.path.startsWith(`quests.${quest.id}.`)));
});

function testScene(id: string, nextSceneId?: string, choiceId = "next") {
  return {
    id,
    title: id,
    locationId: "ludus",
    npcIds: [],
    description: id,
    objective: id,
    inputMode: "choice" as const,
    choices: nextSceneId ? [{ id: choiceId, label: choiceId, description: choiceId, conditions: [], effects: [], nextSceneId }] : [],
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [],
  };
}
