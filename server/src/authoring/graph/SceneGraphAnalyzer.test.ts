import { test } from "node:test";
import assert from "node:assert";
import { SceneGraphAnalyzer } from "./SceneGraphAnalyzer";
import type { SceneGraph } from "./SceneGraphTypes";

test("SceneGraphAnalyzer catches broken links, unreachable scenes, dead ends and missing completion", () => {
  const graph: SceneGraph = {
    scope: { type: "quest", questId: "q" },
    nodes: [node("scene:start", "start", true), node("scene:lost", "lost"), { ...node("missing:ghost", "ghost"), type: "missing-scene", status: { ...node("missing:ghost", "ghost").status, isMissing: true } }],
    edges: [{ id: "e1", source: "scene:start", target: "missing:ghost", type: "choice", label: "ghost", status: { valid: true, hasCondition: false, isBroken: true }, issues: [] }],
    issues: [],
    stats: { nodeCount: 0, edgeCount: 0, reachableCount: 0, unreachableCount: 0, deadEndCount: 0, brokenLinkCount: 0, cycleCount: 0, completionPathCount: 0 },
  };
  const analyzed = new SceneGraphAnalyzer().applyIssues(graph);
  assert.ok(analyzed.issues.some((issue) => issue.code === "broken-link"));
  assert.ok(analyzed.issues.some((issue) => issue.code === "unreachable-scene"));
  assert.ok(analyzed.issues.some((issue) => issue.code === "dead-end"));
  assert.ok(analyzed.issues.some((issue) => issue.code === "missing-completion"));
});

function node(id: string, sceneId: string, start = false): SceneGraph["nodes"][number] {
  return { id, sceneId, type: "choice-scene", title: sceneId, npcIds: [], status: { reachable: false, hasErrors: false, hasWarnings: false, isStart: start, isCompletion: false, isDeadEnd: false, isMissing: false }, issueCounts: { errors: 0, warnings: 0, info: 0 } };
}
