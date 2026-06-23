import { useEffect } from "react";
import { VpCard, VpEmptyState, VpSectionHeader, VpStatCard } from "../../ui";
import { useAuthoringStore } from "../../../stores/authoringStore";
import { useSceneGraphStore } from "../../../stores/sceneGraphStore";
import { GraphLegend } from "./GraphLegend";
import { SceneGraphCanvas } from "./SceneGraphCanvas";
import { SceneGraphInspector } from "./SceneGraphInspector";
import { SceneGraphToolbar } from "./SceneGraphToolbar";

export function SceneGraphEditor() {
  const authoring = useAuthoringStore();
  const store = useSceneGraphStore();
  const { currentGraph, loading, loadChapterGraph, loadQuestGraph, loadSceneNeighborhood } = store;
  useEffect(() => {
    const doc = authoring.selectedDocument;
    if (currentGraph || loading) return;
    if (doc?.kind === "chapter") void loadChapterGraph(doc.id);
    else if (doc?.kind === "quest") void loadQuestGraph(doc.id);
    else if (doc?.kind === "scene") void loadSceneNeighborhood(doc.id, 2);
    else {
      const firstChapter = authoring.tree.flatMap((group) => group.children ?? []).find((item) => item.kind === "chapter");
      if (firstChapter) void loadChapterGraph(firstChapter.id);
    }
  }, [authoring.selectedDocument, authoring.tree, currentGraph, loading, loadChapterGraph, loadQuestGraph, loadSceneNeighborhood]);
  const graph = store.currentGraph;
  return <div className="scene-graph-editor"><div className="scene-graph-main"><VpCard variant="compact" className="scene-graph-heading"><VpSectionHeader eyebrow="Visual Scene Graph" title="Scene Graph Editor" description="Chapter, quest ve scene neighborhood baglantilarini read-only graph uzerinden incele." />{store.error ? <div className="error-band"><span>{store.error}</span><button type="button" onClick={store.clearError}>Kapat</button></div> : null}</VpCard><SceneGraphToolbar tree={authoring.tree} store={store} />{graph ? <div className="scene-graph-stats"><VpStatCard label="Nodes" value={graph.stats.nodeCount} /><VpStatCard label="Edges" value={graph.stats.edgeCount} /><VpStatCard label="Broken" value={graph.stats.brokenLinkCount} /><VpStatCard label="Dead ends" value={graph.stats.deadEndCount} /></div> : null}<SceneGraphCanvas store={store} />{graph?.issues.length ? <VpCard variant="compact" className="scene-graph-issues"><strong>Graph Issues</strong><ul className="authoring-issue-list">{graph.issues.slice(0, 12).map((issue) => <li key={issue.id} className={`is-${issue.severity}`}><button type="button" className="authoring-link-button" onClick={() => { const node = graph.nodes.find((item) => item.sceneId === issue.sceneId || item.sceneId === issue.targetId); if (node) store.selectNode(node.id); }}><span>{issue.code}</span><small>{issue.messageTr}</small></button></li>)}</ul></VpCard> : null}</div><aside className="scene-graph-side"><GraphLegend />{store.loading ? <VpCard><VpEmptyState title="Yukleniyor">Graph hazirlaniyor...</VpEmptyState></VpCard> : <SceneGraphInspector store={store} />}</aside></div>;
}
