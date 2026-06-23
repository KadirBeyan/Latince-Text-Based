import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, type Edge, type Node, type ReactFlowInstance } from "reactflow";
import "reactflow/dist/style.css";
import type { SceneGraphEdge, SceneGraphNode as GraphNode } from "../../../types/sceneGraphTypes";
import type { SceneGraphStoreValue } from "../../../stores/sceneGraphStore";
import { ChapterGateNode } from "./ChapterGateNode";
import { GraphEdgeLabel } from "./GraphEdgeLabel";
import { GraphLayoutControls } from "./GraphLayoutControls";
import { SceneGraphMiniMap } from "./SceneGraphMiniMap";
import { SceneNode } from "./SceneNode";
import { QuestNode } from "./QuestNode";

const nodeTypes = { scene: SceneNode, "choice-scene": SceneNode, "text-challenge-scene": SceneNode, "hybrid-scene": SceneNode, "review-scene": SceneNode, "completion-scene": SceneNode, "dead-end": SceneNode, "missing-scene": SceneNode, "quest-start": QuestNode, "chapter-start": ChapterGateNode };
const edgeTypes = { graph: GraphEdgeLabel };

export function SceneGraphCanvas({ store }: { store: SceneGraphStoreValue }) {
  const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
  const graph = store.currentGraph;
  const nodes = useMemo<Node<GraphNode>[]>(() => (graph?.nodes ?? []).filter((node) => visibleNode(node, store)).map((node) => ({ id: node.id, type: node.type, data: node, position: node.position ?? { x: 0, y: 0 } })), [graph, store.filters]);
  const visibleIds = useMemo(() => new Set(nodes.map((node) => node.id)), [nodes]);
  const edges = useMemo<Edge<SceneGraphEdge>[]>(() => (graph?.edges ?? []).filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target)).map((edge) => ({ id: edge.id, source: edge.source, target: edge.target, type: "graph", data: edge, animated: edge.type === "success" || edge.status.isBroken })), [graph, visibleIds]);
  return <div className="scene-graph-canvas"><GraphLayoutControls onFit={() => void instance?.fitView({ padding: 0.18 })} onLayout={() => void store.refreshLayout()} />{graph ? <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView onInit={setInstance} onNodeClick={(_, node) => store.selectNode(node.id)} onEdgeClick={(_, edge) => store.selectEdge(edge.id)} onPaneClick={() => { store.selectNode(null); store.selectEdge(null); }} nodesDraggable={false} nodesConnectable={false} elementsSelectable><Background color="rgba(240,210,138,.12)" gap={28} /><Controls /><SceneGraphMiniMap /></ReactFlow> : <div className="scene-graph-empty">Graph yuklenmedi.</div>}</div>;
}

function visibleNode(node: GraphNode, store: SceneGraphStoreValue): boolean {
  if (store.filters.hideUnreachable && !node.status.reachable) return false;
  if (store.filters.issuesOnly && !node.status.hasErrors && !node.status.hasWarnings) return false;
  if (store.filters.errorsOnly && !node.status.hasErrors) return false;
  if (!store.filters.showWarnings && node.status.hasWarnings && !node.status.hasErrors) return false;
  if (store.filters.currentQuestOnly && store.selectedNode?.questId && node.questId && node.questId !== store.selectedNode.questId) return false;
  if (store.filters.inputMode !== "all" && node.inputMode !== store.filters.inputMode) return false;
  if (store.filters.grammarId && !(node.learningFocus?.grammarIds ?? []).includes(store.filters.grammarId)) return false;
  if (store.filters.npcId && !node.npcIds.includes(store.filters.npcId)) return false;
  if (store.filters.locationId && node.locationId !== store.filters.locationId) return false;
  const query = store.filters.query.trim().toLowerCase();
  if (!query) return true;
  return [node.title, node.sceneId, node.locationId, node.questId, node.chapterId, ...node.npcIds, ...(node.learningFocus?.grammarIds ?? []), ...(node.learningFocus?.vocabularyIds ?? [])].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
}
