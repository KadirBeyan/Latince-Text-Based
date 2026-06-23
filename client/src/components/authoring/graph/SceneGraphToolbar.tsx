import { ArrowsOutSimple, Copy, GitBranch, MagnifyingGlass, PencilSimpleLine, WarningCircle } from "@phosphor-icons/react";
import { VpButton, VpCard } from "../../ui";
import type { AuthoringTreeNode } from "../../../types/authoringTypes";
import type { SceneGraphFilters, SceneGraphStoreValue } from "../../../stores/sceneGraphStore";

type Store = SceneGraphStoreValue;

export function SceneGraphToolbar({ tree, store }: { tree: AuthoringTreeNode[]; store: Store }) {
  const docs = uniqueDocs(tree.flatMap((group) => group.children ?? []));
  const campaigns = docs.filter((doc) => doc.kind === "campaign");
  const chapters = docs.filter((doc) => doc.kind === "chapter");
  const quests = docs.filter((doc) => doc.kind === "quest");
  const scenes = docs.filter((doc) => doc.kind === "scene");
  const graphNodes = store.currentGraph?.nodes ?? [];
  const grammarIds = unique(graphNodes.flatMap((node) => node.learningFocus?.grammarIds ?? []));
  const npcIds = unique(graphNodes.flatMap((node) => node.npcIds));
  const locationIds = unique(graphNodes.map((node) => node.locationId).filter(Boolean));
  const patchFilters = (patch: Partial<SceneGraphFilters>) => store.setFilters({ ...store.filters, ...patch });
  return <VpCard variant="compact" className="scene-graph-toolbar">
    <select value={scopeValue(store.scope)} onChange={(event) => { const [kind, id] = event.target.value.split(":"); if (kind === "campaign") void store.loadCampaignGraph(id); if (kind === "chapter") void store.loadChapterGraph(id); if (kind === "quest") void store.loadQuestGraph(id); if (kind === "scene") void store.loadSceneNeighborhood(id, 2); }}>
      <option value="">Scope sec</option>
      {campaigns.map((campaign, index) => <option key={`${campaign.path ?? campaign.id}-${index}`} value={`campaign:${campaign.id}`}>Campaign: {campaign.title}</option>)}
      {chapters.map((chapter, index) => <option key={`${chapter.path ?? chapter.id}-${index}`} value={`chapter:${chapter.id}`}>Chapter: {chapter.title}</option>)}
      {quests.map((quest, index) => <option key={`${quest.path ?? quest.id}-${index}`} value={`quest:${quest.id}`}>Quest: {quest.title}</option>)}
      {scenes.map((scene, index) => <option key={`${scene.path ?? scene.id}-${index}`} value={`scene:${scene.id}`}>Scene: {scene.title}</option>)}
    </select>
    <label><MagnifyingGlass size={16} /><input value={store.filters.query} onChange={(event) => patchFilters({ query: event.target.value })} placeholder="scene, NPC, grammar" /></label>
    <select value={store.filters.inputMode} onChange={(event) => patchFilters({ inputMode: event.target.value as SceneGraphFilters["inputMode"] })}>
      <option value="all">All modes</option><option value="choice">Choice</option><option value="text">Text</option><option value="hybrid">Hybrid</option>
    </select>
    <select value={store.filters.grammarId} onChange={(event) => patchFilters({ grammarId: event.target.value })}><option value="">Grammar</option>{grammarIds.map((id) => <option key={id} value={id}>{id}</option>)}</select>
    <select value={store.filters.npcId} onChange={(event) => patchFilters({ npcId: event.target.value })}><option value="">NPC</option>{npcIds.map((id) => <option key={id} value={id}>{id}</option>)}</select>
    <select value={store.filters.locationId} onChange={(event) => patchFilters({ locationId: event.target.value })}><option value="">Location</option>{locationIds.map((id) => <option key={id} value={id}>{id}</option>)}</select>
    <VpButton variant={store.filters.issuesOnly ? "gold" : "ghost"} icon={<WarningCircle size={16} />} onClick={() => patchFilters({ issuesOnly: !store.filters.issuesOnly })}>Issues</VpButton>
    <VpButton variant={store.filters.errorsOnly ? "danger" : "ghost"} icon={<WarningCircle size={16} />} onClick={() => patchFilters({ errorsOnly: !store.filters.errorsOnly })}>Errors</VpButton>
    <VpButton variant={store.filters.hideUnreachable ? "gold" : "ghost"} onClick={() => patchFilters({ hideUnreachable: !store.filters.hideUnreachable })}>Reachable</VpButton>
    <VpButton variant={store.filters.currentQuestOnly ? "gold" : "ghost"} onClick={() => patchFilters({ currentQuestOnly: !store.filters.currentQuestOnly })}>Quest</VpButton>
    <VpButton variant={store.editMode ? "danger" : "ghost"} icon={<PencilSimpleLine size={16} />} onClick={store.toggleEditMode}>Edit mode</VpButton>
    <VpButton variant="ghost" icon={<ArrowsOutSimple size={16} />} onClick={() => void store.refreshLayout()}>Layout</VpButton>
    <VpButton variant="ghost" icon={<Copy size={16} />} disabled={!store.currentGraph} onClick={() => void store.copySnapshot()}>Snapshot</VpButton>
    <VpButton variant="ghost" icon={<GitBranch size={16} />} onClick={() => void store.validateGraph()}>Validate</VpButton>
  </VpCard>;
}

function scopeValue(scope: Store["scope"]): string {
  if (!scope) return "";
  if (scope.type === "campaign") return `campaign:${scope.campaignId}`;
  if (scope.type === "chapter") return `chapter:${scope.chapterId}`;
  if (scope.type === "quest") return `quest:${scope.questId}`;
  if (scope.type === "scene-neighborhood") return `scene:${scope.sceneId}`;
  return "";
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort();
}

function uniqueDocs(docs: AuthoringTreeNode[]): AuthoringTreeNode[] {
  const seen = new Set<string>();
  return docs.filter((doc) => {
    const key = `${doc.kind}:${doc.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
