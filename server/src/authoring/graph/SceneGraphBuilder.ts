import { ContentLoader } from "../../game/content/ContentLoader";
import type { Campaign, Chapter, Condition, Effect, Quest, Scene } from "../../game/types/gameTypes";
import type { LoadedContent } from "../../game/types/contentTypes";
import { SceneGraphAnalyzer } from "./SceneGraphAnalyzer";
import { SceneGraphLayoutService } from "./SceneGraphLayoutService";
import type { SceneGraph, SceneGraphEdge, SceneGraphEdgeType, SceneGraphNode, SceneGraphNodeType, SceneGraphScope } from "./SceneGraphTypes";

type SceneRef = { scene: Scene; quest: Quest; chapter: Chapter; campaign: Campaign };
type SceneWithAuthoringLinks = Scene & { nextSceneId?: string };
type ChapterWithAuthoringLinks = Chapter & { startSceneId?: string };

export class SceneGraphBuilder {
  constructor(
    private readonly contentLoader = new ContentLoader(),
    private readonly analyzer = new SceneGraphAnalyzer(),
    private readonly layout = new SceneGraphLayoutService(),
  ) {}

  async buildSceneGraph(scope: SceneGraphScope): Promise<SceneGraph> {
    if (scope.type === "campaign") return this.buildCampaignGraph(scope.campaignId);
    if (scope.type === "chapter") return this.buildChapterGraph(scope.chapterId);
    if (scope.type === "quest") return this.buildQuestGraph(scope.questId);
    return this.buildSceneNeighborhoodGraph(scope.sceneId, scope.depth);
  }

  async buildCampaignGraph(campaignId: string): Promise<SceneGraph> {
    const content = this.contentLoader.load();
    const campaign = content.campaigns.find((item) => item.id === campaignId);
    if (!campaign) throw new Error(`Campaign not found: ${campaignId}`);
    return this.finish({ type: "campaign", campaignId }, this.refsForCampaign(campaign), campaign);
  }

  async buildChapterGraph(chapterId: string): Promise<SceneGraph> {
    const content = this.contentLoader.load();
    const ref = this.refsForContent(content).find((item) => item.chapter.id === chapterId);
    if (!ref) throw new Error(`Chapter not found: ${chapterId}`);
    return this.finish({ type: "chapter", chapterId }, this.refsForChapter(ref.chapter, ref.campaign), ref.campaign);
  }

  async buildQuestGraph(questId: string): Promise<SceneGraph> {
    const content = this.contentLoader.load();
    const ref = this.refsForContent(content).find((item) => item.quest.id === questId);
    if (!ref) throw new Error(`Quest not found: ${questId}`);
    return this.finish({ type: "quest", questId }, this.refsForQuest(ref.quest, ref.chapter, ref.campaign), ref.campaign);
  }

  async buildSceneNeighborhoodGraph(sceneId: string, depth: number): Promise<SceneGraph> {
    const content = this.contentLoader.load();
    const allRefs = this.refsForContent(content);
    const center = allRefs.find((item) => item.scene.id === sceneId);
    if (!center) throw new Error(`Scene not found: ${sceneId}`);
    const all = this.finishSync({ type: "campaign", campaignId: center.campaign.id }, allRefs, center.campaign, false);
    const incident = new Map<string, Set<string>>();
    for (const edge of all.edges) {
      const s = edge.source.replace(/^scene:/, "");
      const t = edge.target.replace(/^scene:/, "").replace(/^missing:/, "");
      incident.set(s, new Set([...(incident.get(s) ?? []), t]));
      incident.set(t, new Set([...(incident.get(t) ?? []), s]));
    }
    const keep = new Set<string>([sceneId]);
    let frontier = new Set<string>([sceneId]);
    for (let i = 0; i < Math.max(1, Math.min(depth, 4)); i += 1) {
      const next = new Set<string>();
      for (const id of frontier) for (const linked of incident.get(id) ?? []) if (!keep.has(linked)) { keep.add(linked); next.add(linked); }
      frontier = next;
    }
    const refs = allRefs.filter((item) => keep.has(item.scene.id));
    return this.finish({ type: "scene-neighborhood", sceneId, depth }, refs, center.campaign, true);
  }

  private finish(scope: SceneGraphScope, refs: SceneRef[], campaign: Campaign, neighborhood = false): SceneGraph {
    return this.finishSync(scope, refs, campaign, neighborhood);
  }

  private finishSync(scope: SceneGraphScope, refs: SceneRef[], campaign: Campaign, neighborhood: boolean): SceneGraph {
    const visibleIds = new Set(refs.map((ref) => ref.scene.id));
    const allRefs = this.refsForCampaign(campaign);
    const bySceneId = new Map(allRefs.map((ref) => [ref.scene.id, ref]));
    const nodes = refs.map((ref) => this.sceneNode(ref));
    const edges: SceneGraphEdge[] = [];
    for (const ref of refs) this.pushSceneEdges(edges, ref, bySceneId, visibleIds);
    for (const chapter of campaign.chapters) {
      if (scope.type === "campaign" || scope.type === "chapter") {
        const startQuest = chapter.quests.find((quest) => quest.id === chapter.startQuestId) ?? chapter.quests[0];
        const chapterStartSceneId = (chapter as ChapterWithAuthoringLinks).startSceneId ?? startQuest?.startSceneId;
        if (chapterStartSceneId && visibleIds.has(chapterStartSceneId)) {
          const startId = `chapter-start:${chapter.id}`;
          nodes.push(this.gateNode(startId, "chapter-start", chapter.title, chapter.id));
          edges.push(this.edge(startId, this.targetNodeId(chapterStartSceneId, visibleIds), "chapter-start", "chapter start"));
        }
      }
      for (const quest of chapter.quests) {
        if (visibleIds.has(quest.startSceneId) && (scope.type === "campaign" || scope.type === "chapter" || scope.type === "quest")) {
          const startId = `quest-start:${quest.id}`;
          nodes.push(this.gateNode(startId, "quest-start", quest.title, chapter.id, quest.id));
          edges.push(this.edge(startId, this.targetNodeId(quest.startSceneId, visibleIds), "quest-start", "quest start"));
        }
      }
    }
    for (const targetId of new Set(edges.filter((edge) => edge.target.startsWith("missing:")).map((edge) => edge.target))) nodes.push(this.missingNode(targetId.replace(/^missing:/, "")));
    const empty: SceneGraph = { scope, nodes, edges, issues: [], stats: { nodeCount: nodes.length, edgeCount: edges.length, reachableCount: 0, unreachableCount: 0, deadEndCount: 0, brokenLinkCount: 0, cycleCount: 0, completionPathCount: 0 } };
    return this.layout.layoutGraph(this.analyzer.applyIssues(empty), { neighborhood });
  }

  private pushSceneEdges(edges: SceneGraphEdge[], ref: SceneRef, bySceneId: Map<string, SceneRef>, visibleIds: Set<string>): void {
    const scene = ref.scene as SceneWithAuthoringLinks;
    const source = `scene:${scene.id}`;
    if (scene.nextSceneId) edges.push(this.edge(source, this.targetNodeId(scene.nextSceneId, visibleIds), "next", "next"));
    if (scene.successNextSceneId) edges.push(this.edge(source, this.targetNodeId(scene.successNextSceneId, visibleIds), "success", "success"));
    if (scene.failureNextSceneId) edges.push(this.edge(source, this.targetNodeId(scene.failureNextSceneId, visibleIds), "failure", "failure"));
    for (const choice of scene.choices ?? []) {
      if (!choice.nextSceneId) continue;
      const edgeType: SceneGraphEdgeType = (choice.conditions?.length ?? 0) > 0 ? "condition-locked" : "choice";
      edges.push(this.edge(source, this.targetNodeId(choice.nextSceneId, visibleIds), edgeType, this.truncate(choice.label), choice.id, undefined, this.conditionSummary(choice.conditions)));
    }
    if (scene.textChallenge?.successNextSceneId) edges.push(this.edge(source, this.targetNodeId(scene.textChallenge.successNextSceneId, visibleIds), "success", "success"));
    if (scene.textChallenge?.failureNextSceneId) edges.push(this.edge(source, this.targetNodeId(scene.textChallenge.failureNextSceneId, visibleIds), "failure", "failure"));
    const effects = [...(scene.effects ?? []), ...(scene.rewards ?? []), ...(scene.choices ?? []).flatMap((choice) => choice.effects ?? []), ...(scene.textChallenge?.successEffects ?? []), ...(scene.textChallenge?.failureEffects ?? [])];
    effects.forEach((effect, index) => {
      if (effect.type === "GO_TO_SCENE") edges.push(this.edge(source, this.targetNodeId(effect.sceneId, visibleIds), bySceneId.has(effect.sceneId) ? "effect-go-to" : "effect-go-to", "effect", undefined, `${index}`));
    });
  }

  private sceneNode(ref: SceneRef): SceneGraphNode {
    const scene = ref.scene;
    const isCompletion = this.isCompletionScene(scene);
    return {
      id: `scene:${scene.id}`,
      sceneId: scene.id,
      type: this.nodeType(scene, isCompletion),
      title: scene.title || scene.id,
      subtitle: [scene.inputMode, scene.locationId, scene.learningFocus?.grammarIds?.slice(0, 2).join(",")].filter(Boolean).join(" | "),
      chapterId: ref.chapter.id,
      questId: ref.quest.id,
      locationId: scene.locationId,
      npcIds: scene.npcIds ?? [],
      inputMode: scene.inputMode,
      learningFocus: { grammarIds: scene.learningFocus?.grammarIds ?? [], vocabularyIds: scene.learningFocus?.vocabularyIds ?? [], skillIds: scene.learningFocus?.skillIds ?? [] },
      status: { reachable: false, hasErrors: false, hasWarnings: false, isStart: scene.id === ref.quest.startSceneId, isCompletion, isDeadEnd: false, isMissing: false },
      issueCounts: { errors: 0, warnings: 0, info: 0 },
    };
  }

  private gateNode(id: string, type: "chapter-start" | "quest-start", title: string, chapterId?: string, questId?: string): SceneGraphNode {
    return { id, type, title, subtitle: type === "chapter-start" ? "Chapter gate" : "Quest gate", chapterId, questId, npcIds: [], status: { reachable: true, hasErrors: false, hasWarnings: false, isStart: true, isCompletion: false, isDeadEnd: false, isMissing: false }, issueCounts: { errors: 0, warnings: 0, info: 0 } };
  }

  private missingNode(sceneId: string): SceneGraphNode {
    return { id: `missing:${sceneId}`, sceneId, type: "missing-scene", title: sceneId, subtitle: "Missing target", npcIds: [], status: { reachable: false, hasErrors: true, hasWarnings: false, isStart: false, isCompletion: false, isDeadEnd: false, isMissing: true }, issueCounts: { errors: 1, warnings: 0, info: 0 } };
  }

  private edge(source: string, target: string, type: SceneGraphEdgeType, label?: string, choiceId?: string, effectId?: string, conditionSummary?: string): SceneGraphEdge {
    return { id: `${source}->${target}:${type}:${choiceId ?? effectId ?? label ?? "edge"}`, source, target, type, label, choiceId, effectId, conditionSummary, status: { valid: true, hasCondition: Boolean(conditionSummary) || type === "condition-locked", isBroken: target.startsWith("missing:") }, issues: [] };
  }

  private targetNodeId(sceneId: string, visibleIds: Set<string>): string {
    return visibleIds.has(sceneId) ? `scene:${sceneId}` : `missing:${sceneId}`;
  }

  private nodeType(scene: Scene, isCompletion: boolean): SceneGraphNodeType {
    if (isCompletion) return "completion-scene";
    if (scene.reviewTags?.length || scene.learningFocus?.difficulty === "review") return "review-scene";
    if (scene.inputMode === "hybrid") return "hybrid-scene";
    if (scene.inputMode === "text") return "text-challenge-scene";
    if (scene.inputMode === "choice") return "choice-scene";
    return "scene";
  }

  private isCompletionScene(scene: Scene): boolean {
    return [...(scene.effects ?? []), ...(scene.rewards ?? []), ...(scene.choices ?? []).flatMap((choice) => choice.effects ?? [])].some((effect: Effect) => effect.type === "COMPLETE_QUEST" || effect.type === "COMPLETE_CHAPTER") || /complete|completion|final|son|tamam/i.test(scene.id);
  }

  private conditionSummary(conditions: Condition[] = []): string | undefined {
    return conditions.length ? conditions.map((condition) => condition.type).join(", ") : undefined;
  }

  private truncate(value: string): string {
    return value.length > 32 ? `${value.slice(0, 29)}...` : value;
  }

  private refsForContent(content: LoadedContent): SceneRef[] {
    return content.campaigns.flatMap((campaign) => this.refsForCampaign(campaign));
  }

  private refsForCampaign(campaign: Campaign): SceneRef[] {
    return campaign.chapters.flatMap((chapter) => this.refsForChapter(chapter, campaign));
  }

  private refsForChapter(chapter: Chapter, campaign: Campaign): SceneRef[] {
    return chapter.quests.flatMap((quest) => this.refsForQuest(quest, chapter, campaign));
  }

  private refsForQuest(quest: Quest, chapter: Chapter, campaign: Campaign): SceneRef[] {
    return quest.scenes.map((scene) => ({ scene, quest, chapter, campaign }));
  }
}
