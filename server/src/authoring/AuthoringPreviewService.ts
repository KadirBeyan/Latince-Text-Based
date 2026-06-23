import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import type { GameAction, GameState, PlayerSave, Scene } from "../game/types/gameTypes";
import { ContentLoader } from "../game/content/ContentLoader";
import { GameEngine } from "../game/core/GameEngine";
import { SaveRepository } from "../game/save/SaveRepository";
import { initDatabase } from "../db/database";
import type { LlmProviderConfig } from "../llm/LlmTypes";

export type PreviewSession = {
  id: string;
  source: { kind: "scene" | "quest" | "chapter"; id: string };
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  save: PlayerSave;
  initialSave: PlayerSave;
  state: GameState;
  useLlm: boolean;
  llmConfig?: LlmProviderConfig;
};

const TTL_MS = 2 * 60 * 60 * 1000;

export class AuthoringPreviewService {
  private readonly previews = new Map<string, PreviewSession>();
  private readonly db = new Database(":memory:");
  private readonly saveRepository: SaveRepository;
  private readonly engine: GameEngine;

  constructor(private readonly contentLoader = new ContentLoader()) {
    initDatabase(this.db);
    this.contentLoader.load();
    this.saveRepository = new SaveRepository(this.db);
    this.engine = new GameEngine(this.contentLoader, this.saveRepository);
  }

  previewScene(scene: Scene, saveId?: string) {
    return { mode: "preview", saveId: saveId ?? null, scene, renderedAt: new Date().toISOString() };
  }

  async createPreviewSessionFromScene(sceneId: string, options: { saveId?: string; useLlm?: boolean; llmConfig?: LlmProviderConfig } = {}) {
    const located = this.findScene(sceneId);
    if (!located) throw new Error("Preview scene not found.");
    const session = await this.createSession({ kind: "scene", id: sceneId }, located.scene.id, options);
    return this.response(session, this.snapshot(session.initialSave, session.save));
  }

  async createPreviewSessionFromQuest(questId: string, options: { saveId?: string; useLlm?: boolean; llmConfig?: LlmProviderConfig } = {}) {
    const content = this.contentLoader.load();
    const quest = content.campaigns.flatMap((campaign) => campaign.chapters).flatMap((chapter) => chapter.quests).find((item) => item.id === questId);
    if (!quest) throw new Error("Preview quest not found.");
    const session = await this.createSession({ kind: "quest", id: questId }, quest.startSceneId, options);
    return this.response(session, this.snapshot(session.initialSave, session.save));
  }

  async createPreviewSessionFromDraftScene(sceneDraft: Scene, options: { useLlm?: boolean; llmConfig?: LlmProviderConfig } = {}) {
    const content = this.contentLoader.load();
    const campaign = content.campaigns[0];
    const chapter = campaign?.chapters[0];
    const quest = chapter?.quests[0];
    if (!campaign || !chapter || !quest) throw new Error("Draft preview needs at least one campaign/chapter/quest.");
    const normalizedDraft = { ...sceneDraft, choices: sceneDraft.choices ?? [], effects: sceneDraft.effects ?? [], rewards: sceneDraft.rewards ?? [], conditions: sceneDraft.conditions ?? [], onEnterEvents: sceneDraft.onEnterEvents ?? [] };
    quest.scenes = [...quest.scenes.filter((scene) => scene.id !== normalizedDraft.id), normalizedDraft];
    const session = await this.createSession({ kind: "scene", id: normalizedDraft.id }, normalizedDraft.id, options, false);
    return this.response(session, this.snapshot(session.initialSave, session.save));
  }

  async processPreviewAction(previewId: string, action: GameAction) {
    const session = this.requirePreview(previewId);
    const before = session.save;
    const state = await this.engine.submitAction(session.save.id, action, session.useLlm ? session.llmConfig : undefined);
    const save = this.engine.getRawSave(session.save.id);
    const updated = this.touch({ ...session, save, state });
    return this.response(updated, this.snapshot(before, save));
  }

  getPreviewState(previewId: string) {
    const session = this.requirePreview(previewId);
    return this.response(session, this.snapshot(session.initialSave, session.save));
  }

  resetPreview(previewId: string) {
    const session = this.requirePreview(previewId);
    this.saveRepository.update({ ...session.initialSave, updatedAt: new Date().toISOString() });
    const state = this.engine.getGameState(session.initialSave.id);
    const save = this.engine.getRawSave(session.initialSave.id);
    const updated = this.touch({ ...session, save, state });
    return this.response(updated, this.snapshot(session.save, save));
  }

  discardPreview(previewId: string) {
    const session = this.previews.get(previewId);
    if (session) this.saveRepository.delete(session.save.id);
    return { ok: this.previews.delete(previewId) };
  }

  cleanupExpiredPreviews() {
    const now = Date.now();
    let count = 0;
    for (const [id, session] of this.previews) {
      if (Date.parse(session.expiresAt) <= now) {
        this.discardPreview(id);
        count += 1;
      }
    }
    return { ok: true, count };
  }

  async createPreviewSaveFromScene(sceneId: string) {
    return this.createPreviewSessionFromScene(sceneId);
  }

  async runPreviewAction(previewId: string, action: GameAction) {
    return this.processPreviewAction(previewId, action);
  }

  discardPreviewSave(previewId: string) {
    return this.discardPreview(previewId);
  }

  getActivePreviewCount(): number {
    this.cleanupExpiredPreviews();
    return this.previews.size;
  }

  private async createSession(source: PreviewSession["source"], sceneId: string, options: { useLlm?: boolean; llmConfig?: LlmProviderConfig }, refreshContent = true) {
    this.cleanupExpiredPreviews();
    const state = await this.engine.createNewGame("Authoring Preview");
    const save = this.engine.getRawSave(state.saveId);
    const located = this.findScene(sceneId, refreshContent);
    if (!located) throw new Error(`Scene ${sceneId} was not found.`);
    const previewSave = this.saveRepository.update({
      ...save,
      currentCampaignId: located.campaignId,
      currentChapterId: located.chapterId,
      currentQuestId: located.questId,
      currentSceneId: sceneId,
      visitedSceneIds: save.visitedSceneIds.includes(sceneId) ? save.visitedSceneIds : [...save.visitedSceneIds, sceneId],
    });
    const previewState = this.engine.getGameState(previewSave.id);
    const now = new Date();
    const session: PreviewSession = {
      id: `preview_${randomUUID()}`,
      source,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + TTL_MS).toISOString(),
      save: this.engine.getRawSave(previewSave.id),
      initialSave: structuredClone(this.engine.getRawSave(previewSave.id)),
      state: previewState,
      useLlm: options.useLlm === true,
      llmConfig: options.llmConfig,
    };
    this.previews.set(session.id, session);
    return session;
  }

  private response(session: PreviewSession, diff: ReturnType<AuthoringPreviewService["snapshot"]>) {
    return {
      previewId: session.id,
      state: session.state,
      save: session.save,
      source: session.source,
      mode: "preview" as const,
      expiresAt: session.expiresAt,
      recentEvents: session.save.eventLog.slice(-12),
      stateDiff: diff,
      warnings: Date.parse(session.expiresAt) <= Date.now() ? ["Preview session expired."] : [],
    };
  }

  private snapshot(before: PlayerSave, after: PlayerSave) {
    return {
      xp: after.xp - before.xp,
      currency: after.currency - before.currency,
      sceneChanged: before.currentSceneId !== after.currentSceneId ? { from: before.currentSceneId, to: after.currentSceneId } : undefined,
      flagsChanged: changedKeys(before.flags, after.flags),
      narrativeFlagsChanged: changedKeys(before.narrativeFlags, after.narrativeFlags),
      questStatusChanged: changedKeys(before.questStates, after.questStates),
      relationshipChanged: after.npcMemories.filter((memory) => JSON.stringify(before.npcMemories.find((item) => item.npcId === memory.npcId)?.relationship) !== JSON.stringify(memory.relationship)).map((memory) => ({ npcId: memory.npcId, relationship: memory.relationship })),
      locationFlagsChanged: after.locationStates.filter((state) => JSON.stringify(before.locationStates.find((item) => item.locationId === state.locationId)?.flags) !== JSON.stringify(state.flags)).map((state) => ({ locationId: state.locationId, flags: state.flags })),
    };
  }

  private touch(session: PreviewSession): PreviewSession {
    const updated = { ...session, updatedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + TTL_MS).toISOString() };
    this.previews.set(updated.id, updated);
    return updated;
  }

  private requirePreview(previewId: string): PreviewSession {
    this.cleanupExpiredPreviews();
    const session = this.previews.get(previewId);
    if (!session) throw new Error("Preview not found.");
    return session;
  }

  private findScene(sceneId: string, refreshContent = true) {
    const content = refreshContent ? this.contentLoader.load() : this.contentLoader.getContent();
    for (const campaign of content.campaigns) for (const chapter of campaign.chapters) for (const quest of chapter.quests) for (const scene of quest.scenes) {
      if (scene.id === sceneId) return { campaignId: campaign.id, chapterId: chapter.id, questId: quest.id, scene };
    }
    return undefined;
  }
}

function changedKeys(before: Record<string, unknown>, after: Record<string, unknown>): string[] {
  return [...new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])].filter((key) => JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key]));
}
