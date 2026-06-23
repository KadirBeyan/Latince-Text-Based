import { test } from "node:test";
import assert from "node:assert";
import { SceneGraphBuilder } from "./SceneGraphBuilder";

test("SceneGraphBuilder creates chapter graph nodes, edges, issues and positions", async () => {
  const graph = await new SceneGraphBuilder().buildChapterGraph("village_first_days");
  assert.ok(graph.nodes.length > 0);
  assert.ok(graph.edges.some((edge) => edge.type === "quest-start"));
  assert.ok(graph.edges.some((edge) => edge.type === "choice" || edge.type === "condition-locked"));
  assert.ok(graph.nodes.every((node) => node.position));
  assert.strictEqual(graph.stats.nodeCount, graph.nodes.length);
  assert.strictEqual(graph.stats.edgeCount, graph.edges.length);
});

test("SceneGraphBuilder creates scene neighborhood graph", async () => {
  const graph = await new SceneGraphBuilder().buildSceneNeighborhoodGraph("vicus_001_home_morning", 1);
  assert.ok(graph.nodes.some((node) => node.sceneId === "vicus_001_home_morning"));
  assert.strictEqual(graph.scope.type, "scene-neighborhood");
});
