import type { RuntimeConfig } from "../../config/RuntimeConfig";
import type { Campaign, Chapter, Effect, Quest, Scene } from "../../game/types/gameTypes";
import { AuthoringFileService } from "../AuthoringFileService";
import { AuthoringValidationService } from "../AuthoringValidationService";
import { SceneGraphBuilder } from "./SceneGraphBuilder";
import type { SceneGraphEditEdgeRequest, SceneGraphEditResult } from "./SceneGraphTypes";

type LocatedScene = { file: string; root: Campaign | Chapter; chapter: Chapter; quest: Quest; scene: Scene };
type SceneWithAuthoringLinks = Scene & { nextSceneId?: string };

export class SceneGraphEditService {
  constructor(
    private readonly runtime: Pick<RuntimeConfig, "enableAuthoringWrites">,
    private readonly fileService = new AuthoringFileService(),
    private readonly validationService = new AuthoringValidationService(),
    private readonly graphBuilder = new SceneGraphBuilder(),
  ) {}

  async editEdgeTarget(request: SceneGraphEditEdgeRequest): Promise<SceneGraphEditResult> {
    this.ensureWrites();
    const target = await this.findScene(request.newTargetSceneId);
    if (!target) throw new Error(`Target scene not found: ${request.newTargetSceneId}`);
    const located = await this.findScene(request.sourceSceneId);
    if (!located) throw new Error(`Source scene not found: ${request.sourceSceneId}`);
    const backupPath = await this.fileService.createContentBackup(located.file);
    const before = structuredClone(located.root);
    this.applyEdgeEdit(located.scene, request);
    await this.fileService.writeJsonFileSafe(located.file, located.root);
    const validation = this.validationService.validateAllContent();
    if (!validation.ok) {
      await this.fileService.writeJsonFileSafe(located.file, before);
      return { ok: false, backupPath, validationErrors: validation.errors.map((issue) => issue.messageTr) };
    }
    return { ok: true, backupPath, graph: await this.graphBuilder.buildQuestGraph(located.quest.id) };
  }

  async createConnectedScene(params: { chapterId: string; afterSceneId?: string; connectFrom?: Omit<SceneGraphEditEdgeRequest, "newTargetSceneId">; sceneDraft: Partial<Scene> }): Promise<SceneGraphEditResult & { sceneId?: string }> {
    this.ensureWrites();
    const located = await this.findChapter(params.chapterId);
    if (!located) throw new Error(`Chapter not found: ${params.chapterId}`);
    const quest = params.afterSceneId ? located.chapter.quests.find((item) => item.scenes.some((scene) => scene.id === params.afterSceneId)) : located.chapter.quests[0];
    if (!quest) throw new Error("Target quest not found for new scene.");
    const sceneId = this.uniqueSceneId(params.sceneDraft.id ?? `${quest.id}_branch`, new Set(located.chapter.quests.flatMap((item) => item.scenes.map((scene) => scene.id))));
    const scene: Scene = {
      id: sceneId,
      title: params.sceneDraft.title ?? "New Branch Scene",
      locationId: params.sceneDraft.locationId ?? quest.scenes[0]?.locationId ?? "unknown",
      npcIds: params.sceneDraft.npcIds ?? [],
      description: params.sceneDraft.description ?? "Draft scene created from graph editor.",
      objective: params.sceneDraft.objective ?? "Continue the branch.",
      inputMode: params.sceneDraft.inputMode ?? "choice",
      choices: params.sceneDraft.choices ?? [],
      textChallenge: params.sceneDraft.textChallenge ?? null,
      conditions: params.sceneDraft.conditions ?? [],
      effects: params.sceneDraft.effects ?? [],
      rewards: params.sceneDraft.rewards ?? [],
      onEnterEvents: params.sceneDraft.onEnterEvents ?? [],
      learningFocus: params.sceneDraft.learningFocus,
      pedagogy: params.sceneDraft.pedagogy,
      reviewTags: params.sceneDraft.reviewTags,
    };
    const backupPath = await this.fileService.createContentBackup(located.file);
    const before = structuredClone(located.root);
    quest.scenes.push(scene);
    if (params.connectFrom) this.applyEdgeEdit((await this.findSceneInRoot(located.root, params.connectFrom.sourceSceneId))?.scene ?? scene, { ...params.connectFrom, newTargetSceneId: sceneId });
    await this.fileService.writeJsonFileSafe(located.file, located.root);
    const validation = this.validationService.validateAllContent();
    if (!validation.ok) {
      await this.fileService.writeJsonFileSafe(located.file, before);
      return { ok: false, backupPath, sceneId, validationErrors: validation.errors.map((issue) => issue.messageTr) };
    }
    return { ok: true, backupPath, sceneId, graph: await this.graphBuilder.buildChapterGraph(params.chapterId) };
  }

  async deleteEdge(params: { sourceSceneId: string; edgeKind: "next" | "choice" | "success" | "failure" | "effect-go-to"; choiceId?: string; effectId?: string }): Promise<SceneGraphEditResult> {
    this.ensureWrites();
    const located = await this.findScene(params.sourceSceneId);
    if (!located) throw new Error(`Source scene not found: ${params.sourceSceneId}`);
    const backupPath = await this.fileService.createContentBackup(located.file);
    const before = structuredClone(located.root);
    this.applyEdgeEdit(located.scene, { ...params, newTargetSceneId: undefined as unknown as string });
    await this.fileService.writeJsonFileSafe(located.file, located.root);
    const validation = this.validationService.validateAllContent();
    if (!validation.ok) {
      await this.fileService.writeJsonFileSafe(located.file, before);
      return { ok: false, backupPath, validationErrors: validation.errors.map((issue) => issue.messageTr) };
    }
    return { ok: true, backupPath, graph: await this.graphBuilder.buildQuestGraph(located.quest.id) };
  }

  private applyEdgeEdit(scene: Scene, request: SceneGraphEditEdgeRequest): void {
    const value = request.newTargetSceneId || undefined;
    if (request.edgeKind === "next") {
      (scene as SceneWithAuthoringLinks).nextSceneId = value;
      return;
    }
    if (request.edgeKind === "success") {
      if (scene.textChallenge) scene.textChallenge.successNextSceneId = value;
      else scene.successNextSceneId = value;
      return;
    }
    if (request.edgeKind === "failure") {
      if (scene.textChallenge) scene.textChallenge.failureNextSceneId = value;
      else scene.failureNextSceneId = value;
      return;
    }
    if (request.edgeKind === "choice") {
      const choice = scene.choices.find((item) => item.id === request.choiceId);
      if (!choice) throw new Error("Choice edge requires a valid choiceId.");
      choice.nextSceneId = value;
      return;
    }
    const goTo = this.goToEffects(scene)[Number(request.effectId ?? 0)];
    if (!goTo) throw new Error("GO_TO_SCENE edge requires a valid effectId.");
    goTo.sceneId = request.newTargetSceneId;
  }

  private goToEffects(scene: Scene): Array<Extract<Effect, { type: "GO_TO_SCENE" }>> {
    const all = [...scene.effects, ...scene.rewards, ...scene.choices.flatMap((choice) => choice.effects), ...(scene.textChallenge?.successEffects ?? []), ...(scene.textChallenge?.failureEffects ?? [])];
    return all.filter((effect): effect is Extract<Effect, { type: "GO_TO_SCENE" }> => effect.type === "GO_TO_SCENE");
  }

  private ensureWrites(): void {
    if (!this.runtime.enableAuthoringWrites) throw new Error("Authoring writes are disabled in this runtime mode.");
  }

  private async findScene(sceneId: string): Promise<LocatedScene | undefined> {
    for (const file of await this.fileService.listContentFiles("data/campaigns")) {
      const root = await this.fileService.readJsonFileSafe<Campaign | Chapter>(file);
      const found = await this.findSceneInRoot(root, sceneId);
      if (found) return { file, root, ...found };
    }
    return undefined;
  }

  private async findChapter(chapterId: string): Promise<{ file: string; root: Campaign | Chapter; chapter: Chapter } | undefined> {
    for (const file of await this.fileService.listContentFiles("data/campaigns")) {
      const root = await this.fileService.readJsonFileSafe<Campaign | Chapter>(file);
      const chapters = "startChapterId" in root ? root.chapters : [root];
      const chapter = chapters.find((item) => item.id === chapterId);
      if (chapter) return { file, root, chapter };
    }
    return undefined;
  }

  private async findSceneInRoot(root: Campaign | Chapter, sceneId: string): Promise<Omit<LocatedScene, "file" | "root"> | undefined> {
    const chapters = "startChapterId" in root ? root.chapters : [root];
    for (const chapter of chapters) for (const quest of chapter.quests) {
      const scene = quest.scenes.find((item) => item.id === sceneId);
      if (scene) return { chapter, quest, scene };
    }
    return undefined;
  }

  private uniqueSceneId(base: string, existing: Set<string>): string {
    let id = base.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    let index = 2;
    while (existing.has(id)) id = `${base}_${index++}`;
    return id;
  }
}
