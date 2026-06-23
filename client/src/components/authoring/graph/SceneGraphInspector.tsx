import { GitBranch, MagicWand, Play, TextAlignLeft, Trash } from "@phosphor-icons/react";
import { VpBadge, VpButton, VpCard, VpEmptyState, VpSectionHeader } from "../../ui";
import type { SceneGraphStoreValue } from "../../../stores/sceneGraphStore";
import { useAuthoringStore } from "../../../stores/authoringStore";
import type { SceneGraphEdge } from "../../../types/sceneGraphTypes";

export function SceneGraphInspector({ store }: { store: SceneGraphStoreValue }) {
  const authoring = useAuthoringStore();
  const graph = store.currentGraph;
  const node = store.selectedNode;
  const edge = store.selectedEdge;
  if (!graph) return <VpCard className="scene-graph-inspector"><VpEmptyState title="Graph yok">Bir chapter veya quest graph yukle.</VpEmptyState></VpCard>;
  if (edge) {
    const source = graph.nodes.find((item) => item.id === edge.source);
    const target = graph.nodes.find((item) => item.id === edge.target);
    return <VpCard className="scene-graph-inspector"><VpSectionHeader eyebrow="Edge" title={edge.label ?? edge.type} description={`${source?.sceneId ?? edge.source} -> ${target?.sceneId ?? edge.target}`} /><dl className="authoring-facts"><dt>Type</dt><dd>{edge.type}</dd><dt>Status</dt><dd>{edge.status.isBroken ? "broken" : "valid"}</dd><dt>Choice</dt><dd>{edge.choiceId ?? "-"}</dd><dt>Effect</dt><dd>{edge.effectId ?? "-"}</dd><dt>Condition</dt><dd>{edge.conditionSummary ?? "-"}</dd></dl>{edge.issues.length ? <IssueList issues={edge.issues} /> : null}<div className="authoring-toolbar"><VpButton variant="ghost" disabled={!source?.sceneId} onClick={() => source?.sceneId && void authoring.selectDocument("scene", source.sceneId)}>Source scene</VpButton><VpButton variant="ghost" disabled={!target?.sceneId || target.status.isMissing} onClick={() => target?.sceneId && void authoring.selectDocument("scene", target.sceneId)}>Target scene</VpButton><VpButton variant="danger" disabled={!store.editMode || !source?.sceneId || edge.type === "chapter-start" || edge.type === "quest-start"} onClick={() => changeTarget(store, source?.sceneId, edge)}>Target'i degistir</VpButton><VpButton variant="danger" icon={<Trash size={16} />} disabled={!store.editMode || !source?.sceneId || edge.type === "chapter-start" || edge.type === "quest-start"} onClick={() => deleteEdge(store, source?.sceneId, edge)}>Edge sil</VpButton></div></VpCard>;
  }
  if (!node) return <VpCard className="scene-graph-inspector"><VpEmptyState title="Secim yok">Node veya edge sec.</VpEmptyState></VpCard>;
  const incoming = graph.edges.filter((item) => item.target === node.id);
  const outgoing = graph.edges.filter((item) => item.source === node.id);
  const issues = graph.issues.filter((issue) => issue.sceneId === node.sceneId || issue.targetId === node.sceneId);
  return <VpCard className="scene-graph-inspector"><VpSectionHeader eyebrow={node.type} title={node.title} description={node.sceneId ?? node.id} /><div className="scene-graph-inspector__badges"><VpBadge variant={node.status.reachable ? "success" : "muted"}>{node.status.reachable ? "reachable" : "unreachable"}</VpBadge>{node.status.isStart ? <VpBadge variant="bronze">start</VpBadge> : null}{node.status.isCompletion ? <VpBadge variant="gold">completion</VpBadge> : null}{node.status.isDeadEnd ? <VpBadge variant="red">dead end</VpBadge> : null}</div><dl className="authoring-facts"><dt>Chapter</dt><dd>{node.chapterId ?? "-"}</dd><dt>Quest</dt><dd>{node.questId ?? "-"}</dd><dt>Location</dt><dd>{node.locationId ?? "-"}</dd><dt>NPCs</dt><dd>{node.npcIds.join(", ") || "-"}</dd><dt>Input</dt><dd>{node.inputMode ?? "-"}</dd><dt>Incoming</dt><dd>{incoming.length}</dd><dt>Outgoing</dt><dd>{outgoing.length}</dd></dl>{node.learningFocus?.grammarIds.length ? <p className="authoring-muted">Grammar: {node.learningFocus.grammarIds.join(", ")}</p> : null}{node.learningFocus?.vocabularyIds.length ? <p className="authoring-muted">Vocabulary: {node.learningFocus.vocabularyIds.join(", ")}</p> : null}<EdgeList title="Incoming" edges={incoming} graph={graph} onSelect={store.selectEdge} /><EdgeList title="Outgoing" edges={outgoing} graph={graph} onSelect={store.selectEdge} />{issues.length ? <IssueList issues={issues} /> : null}{store.branchDraft?.sourceSceneId === node.sceneId ? <DraftPreview store={store} /> : null}<div className="authoring-toolbar"><VpButton variant="ghost" icon={<TextAlignLeft size={16} />} disabled={!node.sceneId} onClick={() => node.sceneId && void authoring.selectDocument("scene", node.sceneId)}>Scene Editor'da Ac</VpButton><VpButton variant="ghost" icon={<Play size={16} />} disabled={!node.sceneId}>Playtest</VpButton><VpButton variant="ghost" icon={<GitBranch size={16} />} disabled={!node.sceneId} onClick={() => node.sceneId && void store.loadSceneNeighborhood(node.sceneId, 2)}>Neighborhood</VpButton><VpButton variant="ghost" icon={<MagicWand size={16} />} disabled={!node.sceneId} onClick={() => node.sceneId && void store.generateBranchDraft({ sourceSceneId: node.sceneId, branchPurpose: "review", grammarIds: node.learningFocus?.grammarIds.slice(0, 2), vocabularyIds: node.learningFocus?.vocabularyIds.slice(0, 2), targetDifficulty: "review", sceneCount: 2 })}>Branch Taslagi</VpButton><VpButton variant="danger" disabled={!store.editMode || !node.chapterId || !node.sceneId} onClick={() => node.chapterId && void store.createConnectedScene(node.chapterId, node.sceneId)}>Create Branch</VpButton></div></VpCard>;
}

function IssueList({ issues }: { issues: Array<{ id: string; severity: string; messageTr: string; code: string }> }) {
  return <ul className="authoring-issue-list">{issues.map((issue) => <li key={issue.id} className={`is-${issue.severity}`}><strong>{issue.code}</strong><span>{issue.messageTr}</span></li>)}</ul>;
}

function changeTarget(store: SceneGraphStoreValue, sourceSceneId: string | undefined, edge: NonNullable<SceneGraphStoreValue["selectedEdge"]>) {
  if (!sourceSceneId) return;
  const target = window.prompt("Yeni target scene id");
  if (!target || !window.confirm("Graph edit validation + backup ile uygulanacak. Devam?")) return;
  const edgeKind = edgeToEditKind(edge);
  void store.editEdgeTarget({ sourceSceneId, edgeKind, choiceId: edge.choiceId, effectId: edge.effectId, newTargetSceneId: target });
}

function deleteEdge(store: SceneGraphStoreValue, sourceSceneId: string | undefined, edge: SceneGraphEdge) {
  if (!sourceSceneId || !window.confirm("Optional edge silinecek. Backup + validation calisacak. Devam?")) return;
  const edgeKind = edgeToEditKind(edge);
  void store.deleteEdge({ sourceSceneId, edgeKind, choiceId: edge.choiceId, effectId: edge.effectId });
}

function EdgeList({ title, edges, graph, onSelect }: { title: string; edges: SceneGraphEdge[]; graph: NonNullable<SceneGraphStoreValue["currentGraph"]>; onSelect: (edgeId: string | null) => void }) {
  if (!edges.length) return null;
  return <div className="scene-graph-link-list"><strong>{title}</strong>{edges.slice(0, 8).map((edge) => { const source = graph.nodes.find((node) => node.id === edge.source); const target = graph.nodes.find((node) => node.id === edge.target); return <button key={edge.id} type="button" onClick={() => onSelect(edge.id)}><span>{edge.type}</span><small>{source?.sceneId ?? edge.source}{" -> "}{target?.sceneId ?? edge.target}</small></button>; })}</div>;
}

function DraftPreview({ store }: { store: SceneGraphStoreValue }) {
  const draft = store.branchDraft;
  if (!draft) return null;
  return <div className="scene-graph-draft-preview"><strong>Branch draft preview</strong><small>{draft.autoSaved ? "saved" : "not auto-saved"}</small>{draft.warnings.map((warning) => <p key={warning}>{warning}</p>)}<ul>{draft.scenes.map((scene) => <li key={scene.id}>{scene.id}</li>)}</ul><VpButton variant="ghost" onClick={store.clearBranchDraft}>Kapat</VpButton></div>;
}

function edgeToEditKind(edge: SceneGraphEdge): "next" | "choice" | "success" | "failure" | "effect-go-to" {
  if (edge.type === "condition-locked" || edge.type === "choice") return "choice";
  if (edge.type === "effect-go-to") return "effect-go-to";
  if (edge.type === "failure") return "failure";
  if (edge.type === "success") return "success";
  return "next";
}
