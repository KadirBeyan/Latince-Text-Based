import type { PlayerSave, GeneratedQuest, ID, Scene } from "../types/gameTypes";
import type { EventBus } from "../core/EventBus";

export class GeneratedContentSystem {
  static isGeneratedSceneId(sceneId: string): boolean { return sceneId.startsWith("gen_scene_"); }

  static getGeneratedQuest(params: { save: PlayerSave; generatedQuestId: ID }): GeneratedQuest | undefined {
    return params.save.generatedQuests?.find((quest) => quest.id === params.generatedQuestId);
  }

  static listGeneratedQuests(save: PlayerSave): GeneratedQuest[] { return [...(save.generatedQuests || [])]; }

  static findGeneratedScene(params: { save: PlayerSave; sceneId: ID }): { quest: GeneratedQuest; scene: Scene } | null {
    for (const quest of params.save.generatedQuests || []) {
      const scene = quest.scenes.find((candidate) => candidate.id === params.sceneId);
      if (scene) return { quest, scene };
    }
    return null;
  }

  static expireOldGeneratedQuests(save: PlayerSave, now = new Date()): PlayerSave {
    const generatedQuests = (save.generatedQuests || []).map((quest) =>
      (quest.status === "draft" || quest.status === "active") && quest.expiresAt && Date.parse(quest.expiresAt) <= now.getTime()
        ? { ...quest, status: "expired" as const }
        : quest
    );
    const expiredCurrent = generatedQuests.find((quest) => quest.id === save.currentQuestId && quest.status === "expired");
    const returnContext = expiredCurrent?.metadata?.returnContext;
    return {
      ...save,
      generatedQuests,
      ...(returnContext ? { currentCampaignId: returnContext.campaignId, currentChapterId: returnContext.chapterId, currentQuestId: returnContext.questId, currentSceneId: returnContext.sceneId } : {})
    };
  }

  static cleanupExpiredQuests(save: PlayerSave): PlayerSave { return this.expireOldGeneratedQuests(save); }

  static addGeneratedQuest(save: PlayerSave, quest: GeneratedQuest, eventBus?: EventBus): PlayerSave {
    if (!quest.id.startsWith("gen_quest_")) throw new Error("Generated quest id must start with 'gen_quest_'.");
    if (!quest.validation.ok) throw new Error("Generated quest failed validation and cannot be saved.");
    let nextSave = this.expireOldGeneratedQuests(save);
    if ((nextSave.generatedQuests || []).some((existing) => existing.id === quest.id)) throw new Error(`Generated quest '${quest.id}' already exists.`);

    const quests = [...(nextSave.generatedQuests || [])];
    const drafts = quests.filter((candidate) => candidate.status === "draft").sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    const idsToRemove = new Set(drafts.slice(0, Math.max(0, drafts.length - 4)).map((candidate) => candidate.id));
    nextSave = { ...nextSave, generatedQuests: [...quests.filter((candidate) => !idsToRemove.has(candidate.id)), quest] };
    return eventBus ? eventBus.emit(nextSave, "GENERATED_QUEST_CREATED", { questId: quest.id, templateId: quest.sourceTemplateId }) : nextSave;
  }

  static activateGeneratedQuest(params: { save: PlayerSave; generatedQuestId: ID; eventBus?: EventBus }): PlayerSave {
    return this.acceptQuest(params.save, params.generatedQuestId, params.eventBus);
  }

  static acceptQuest(save: PlayerSave, questId: ID, eventBus?: EventBus): PlayerSave {
    const quests = [...(save.generatedQuests || [])];
    const questIdx = quests.findIndex((quest) => quest.id === questId);
    if (questIdx === -1) throw new Error(`Quest '${questId}' not found.`);
    if (!quests[questIdx].validation.ok) throw new Error(`Quest '${questId}' failed validation and cannot be activated.`);
    if (quests[questIdx].status !== "draft") return save;
    if (quests.filter((quest) => quest.status === "active").length >= 3) throw new Error("Active generated quest cap (3) reached. Dismiss or complete an active quest first.");
    quests[questIdx] = { ...quests[questIdx], status: "active" };
    const nextSave = { ...save, generatedQuests: quests };
    return eventBus ? eventBus.emit(nextSave, "GENERATED_QUEST_ACTIVATED", { questId }) : nextSave;
  }

  static dismissGeneratedQuest(params: { save: PlayerSave; generatedQuestId: ID; eventBus?: EventBus }): PlayerSave {
    return this.dismissQuest(params.save, params.generatedQuestId, params.eventBus);
  }

  static dismissQuest(save: PlayerSave, questId: ID, eventBus?: EventBus): PlayerSave {
    const quests = [...(save.generatedQuests || [])];
    const index = quests.findIndex((quest) => quest.id === questId);
    if (index === -1) return save;
    quests[index] = { ...quests[index], status: "dismissed" };
    const nextSave = { ...save, generatedQuests: quests };
    return eventBus ? eventBus.emit(nextSave, "GENERATED_QUEST_DISMISSED", { questId }) : nextSave;
  }

  static startQuest(save: PlayerSave, questId: ID, eventBus?: EventBus): PlayerSave {
    let nextSave = this.expireOldGeneratedQuests(save);
    let quest = this.getGeneratedQuest({ save: nextSave, generatedQuestId: questId });
    if (!quest) throw new Error(`Quest '${questId}' not found.`);
    if (quest.status === "expired" || quest.status === "dismissed" || quest.status === "completed" || quest.status === "failed") throw new Error(`Quest '${questId}' cannot be started from status '${quest.status}'.`);
    if (!quest.validation.ok) throw new Error(`Quest '${questId}' failed validation and cannot be started.`);
    if (quest.status === "draft") nextSave = this.acceptQuest(nextSave, questId, eventBus);
    quest = this.getGeneratedQuest({ save: nextSave, generatedQuestId: questId })!;
    const returnContext = save.currentQuestId.startsWith("gen_quest_") ? quest.metadata?.returnContext : {
      campaignId: save.currentCampaignId,
      chapterId: save.currentChapterId,
      questId: save.currentQuestId,
      sceneId: save.currentSceneId
    };
    const generatedQuests = nextSave.generatedQuests.map((candidate) => candidate.id === questId ? {
      ...candidate,
      metadata: { ...candidate.metadata, generatedBy: candidate.metadata?.generatedBy || "template", returnContext }
    } : candidate);
    return { ...nextSave, generatedQuests, currentQuestId: questId, currentSceneId: quest.scenes[0].id };
  }

  static completeGeneratedQuest(params: { save: PlayerSave; generatedQuestId: ID; eventBus?: EventBus }): PlayerSave {
    return this.completeQuest(params.save, params.generatedQuestId, params.eventBus);
  }

  static completeQuest(save: PlayerSave, questId: ID, eventBus?: EventBus): PlayerSave {
    const quests = [...(save.generatedQuests || [])];
    const index = quests.findIndex((quest) => quest.id === questId);
    if (index === -1) return save;
    const returnContext = quests[index].metadata?.returnContext;
    quests[index] = { ...quests[index], status: "completed", completedAt: new Date().toISOString() };
    let nextSave: PlayerSave = { ...save, generatedQuests: quests };
    if (save.currentQuestId === questId && returnContext) {
      nextSave = { ...nextSave, currentCampaignId: returnContext.campaignId, currentChapterId: returnContext.chapterId, currentQuestId: returnContext.questId, currentSceneId: returnContext.sceneId };
    }
    return eventBus ? eventBus.emit(nextSave, "GENERATED_QUEST_COMPLETED", { questId }) : nextSave;
  }

  static failQuest(save: PlayerSave, questId: ID): PlayerSave {
    const quests = [...(save.generatedQuests || [])];
    const index = quests.findIndex((quest) => quest.id === questId);
    if (index === -1) return save;
    const returnContext = quests[index].metadata?.returnContext;
    quests[index] = { ...quests[index], status: "failed", failedAt: new Date().toISOString() };
    if (save.currentQuestId === questId && returnContext) return { ...save, generatedQuests: quests, currentCampaignId: returnContext.campaignId, currentChapterId: returnContext.chapterId, currentQuestId: returnContext.questId, currentSceneId: returnContext.sceneId };
    return { ...save, generatedQuests: quests };
  }
}
