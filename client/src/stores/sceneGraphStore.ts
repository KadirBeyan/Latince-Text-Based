import { useCallback, useMemo, useState } from "react";
import { sceneGraphApi } from "../api/sceneGraphApi";
import type { Scene } from "../types/gameTypes";
import type { SceneGraph, SceneGraphBranchDraftRequest, SceneGraphEdge, SceneGraphEditEdgeRequest, SceneGraphNode, SceneGraphScope } from "../types/sceneGraphTypes";

export type SceneGraphFilters = {
  issuesOnly: boolean;
  errorsOnly: boolean;
  showWarnings: boolean;
  hideUnreachable: boolean;
  showLearningFocus: boolean;
  currentQuestOnly: boolean;
  inputMode: "all" | "choice" | "text" | "hybrid";
  grammarId: string;
  npcId: string;
  locationId: string;
  query: string;
};
export type SceneGraphStoreValue = ReturnType<typeof useSceneGraphStore>;

export function useSceneGraphStore() {
  const [currentGraph, setCurrentGraph] = useState<SceneGraph | null>(null);
  const [scope, setScope] = useState<SceneGraphScope | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<"hierarchical" | "neighborhood">("hierarchical");
  const [editMode, setEditMode] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<SceneGraphEditEdgeRequest | null>(null);
  const [branchDraft, setBranchDraft] = useState<{ sourceSceneId: string; scenes: Partial<Scene>[]; warnings: string[]; autoSaved: false } | null>(null);
  const [filters, setFilters] = useState<SceneGraphFilters>({ issuesOnly: false, errorsOnly: false, showWarnings: true, hideUnreachable: false, showLearningFocus: true, currentQuestOnly: false, inputMode: "all", grammarId: "", npcId: "", locationId: "", query: "" });

  const load = useCallback(async (nextScope: SceneGraphScope) => {
    setLoading(true); setError(null); setScope(nextScope);
    try {
      const graph = nextScope.type === "campaign" ? await sceneGraphApi.campaign(nextScope.campaignId) : nextScope.type === "chapter" ? await sceneGraphApi.chapter(nextScope.chapterId) : nextScope.type === "quest" ? await sceneGraphApi.quest(nextScope.questId) : await sceneGraphApi.sceneNeighborhood(nextScope.sceneId, nextScope.depth);
      setCurrentGraph(graph); setSelectedEdgeId(null); setSelectedNodeId(graph.nodes.find((node) => node.status.isStart)?.id ?? graph.nodes[0]?.id ?? null);
    } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, []);

  const refreshLayout = useCallback(async () => { if (scope) await load(scope); }, [load, scope]);
  const loadCampaignGraph = useCallback((campaignId: string) => load({ type: "campaign", campaignId }), [load]);
  const loadChapterGraph = useCallback((chapterId: string) => load({ type: "chapter", chapterId }), [load]);
  const loadQuestGraph = useCallback((questId: string) => load({ type: "quest", questId }), [load]);
  const loadSceneNeighborhood = useCallback((sceneId: string, depth = 2) => { setLayoutMode("neighborhood"); return load({ type: "scene-neighborhood", sceneId, depth }); }, [load]);

  const selectNode = useCallback((nodeId: string | null) => { setSelectedNodeId(nodeId); setSelectedEdgeId(null); }, []);
  const selectEdge = useCallback((edgeId: string | null) => { setSelectedEdgeId(edgeId); setSelectedNodeId(null); }, []);
  const toggleEditMode = useCallback(() => setEditMode((value) => !value), []);
  const editEdgeTarget = useCallback(async (request: SceneGraphEditEdgeRequest) => {
    setPendingEdit(request); setLoading(true); setError(null);
    try {
      const result = await sceneGraphApi.editEdgeTarget(request);
      if (!result.ok) throw new Error(result.validationErrors?.join("\n") || "Graph edit validation failed.");
      if (result.graph) setCurrentGraph(result.graph);
    } catch (err) { setError(message(err)); } finally { setPendingEdit(null); setLoading(false); }
  }, []);
  const createConnectedScene = useCallback(async (chapterId: string, afterSceneId?: string) => {
    setLoading(true); setError(null);
    try {
      const result = await sceneGraphApi.createScene({ chapterId, afterSceneId, sceneDraft: { title: "New Branch Scene", inputMode: "choice", choices: [] } });
      if (!result.ok) throw new Error(result.validationErrors?.join("\n") || "Scene create validation failed.");
      if (result.graph) setCurrentGraph(result.graph);
    } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, []);
  const deleteEdge = useCallback(async (request: Omit<SceneGraphEditEdgeRequest, "newTargetSceneId">) => {
    setLoading(true); setError(null);
    try {
      const result = await sceneGraphApi.deleteEdge(request);
      if (!result.ok) throw new Error(result.validationErrors?.join("\n") || "Edge delete validation failed.");
      if (result.graph) setCurrentGraph(result.graph);
    } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, []);
  const generateBranchDraft = useCallback(async (request: SceneGraphBranchDraftRequest) => {
    setLoading(true); setError(null);
    try { setBranchDraft(await sceneGraphApi.branchDraft(request)); } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, []);
  const copySnapshot = useCallback(async () => {
    if (!currentGraph) return;
    const snapshot = { scope: currentGraph.scope, nodes: currentGraph.nodes, edges: currentGraph.edges, stats: currentGraph.stats, issues: currentGraph.issues };
    await navigator.clipboard?.writeText(JSON.stringify(snapshot, null, 2));
  }, [currentGraph]);
  const validateGraph = useCallback(async () => { if (scope) await load(scope); }, [load, scope]);

  const selectedNode = useMemo<SceneGraphNode | null>(() => currentGraph?.nodes.find((node) => node.id === selectedNodeId) ?? null, [currentGraph, selectedNodeId]);
  const selectedEdge = useMemo<SceneGraphEdge | null>(() => currentGraph?.edges.find((edge) => edge.id === selectedEdgeId) ?? null, [currentGraph, selectedEdgeId]);
  return { currentGraph, scope, selectedNodeId, selectedEdgeId, selectedSceneId: selectedNode?.sceneId ?? null, selectedNode, selectedEdge, loading, error, layoutMode, filters, editMode, pendingEdit, branchDraft, loadCampaignGraph, loadChapterGraph, loadQuestGraph, loadSceneNeighborhood, selectNode, selectEdge, refreshLayout, setFilters, setLayoutMode, toggleEditMode, editEdgeTarget, createConnectedScene, deleteEdge, generateBranchDraft, copySnapshot, validateGraph, clearError: () => setError(null), clearBranchDraft: () => setBranchDraft(null) };
}

function message(error: unknown): string { return error instanceof Error ? error.message : "Scene graph islemi basarisiz oldu."; }
