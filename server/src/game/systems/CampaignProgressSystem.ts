import type { Campaign, ChapterProgress, ID, PlayerSave } from "../types/gameTypes";

export class CampaignProgressSystem {
  getChapterProgress(save: PlayerSave, campaign: Campaign, chapterId: ID): ChapterProgress {
    const chapter = campaign.chapters.find((candidate) => candidate.id === chapterId);
    const existing = save.chapterProgress?.[chapterId];
    if (!chapter) {
      return existing ?? { chapterId, unlocked: false, completed: false, completedSceneIds: [], completedQuestIds: [], progressPercent: 0 };
    }
    const sceneIds = chapter.quests.flatMap((quest) => quest.scenes.map((scene) => scene.id));
    const questIds = chapter.quests.map((quest) => quest.id);
    const completedSceneIds = sceneIds.filter((sceneId) => save.completedSceneIds.includes(sceneId));
    const completedQuestIds = questIds.filter((questId) => save.questStates[questId]?.status === "completed");
    const progressPercent = sceneIds.length ? Math.round((completedSceneIds.length / sceneIds.length) * 100) : 0;
    return {
      chapterId,
      unlocked: chapter.id === campaign.startChapterId || Boolean(existing?.unlocked),
      completed: Boolean(existing?.completed) || progressPercent >= 100,
      completedAt: existing?.completedAt,
      completedSceneIds,
      completedQuestIds,
      progressPercent
    };
  }

  getCampaignProgress(save: PlayerSave, campaign: Campaign): Record<ID, ChapterProgress> {
    return Object.fromEntries(campaign.chapters.map((chapter) => [chapter.id, this.getChapterProgress(save, campaign, chapter.id)]));
  }

  unlockChapter(save: PlayerSave, chapterId: ID): PlayerSave {
    const previous = save.chapterProgress?.[chapterId];
    return {
      ...save,
      chapterProgress: {
        ...(save.chapterProgress ?? {}),
        [chapterId]: {
          chapterId,
          unlocked: true,
          completed: previous?.completed ?? false,
          completedAt: previous?.completedAt,
          completedSceneIds: previous?.completedSceneIds ?? [],
          completedQuestIds: previous?.completedQuestIds ?? [],
          progressPercent: previous?.progressPercent ?? 0
        }
      }
    };
  }

  completeChapter(save: PlayerSave, chapterId: ID): PlayerSave {
    const unlocked = this.unlockChapter(save, chapterId);
    const progress = unlocked.chapterProgress ?? {};
    const previous = progress[chapterId];
    return {
      ...unlocked,
      chapterProgress: {
        ...progress,
        [chapterId]: { ...previous, completed: true, completedAt: previous.completedAt ?? new Date().toISOString(), progressPercent: 100 }
      }
    };
  }

  getNextRecommendedChapter(save: PlayerSave, campaign: Campaign): ID | undefined {
    const progress = this.getCampaignProgress(save, campaign);
    return campaign.chapters.find((chapter) => progress[chapter.id]?.unlocked && !progress[chapter.id]?.completed)?.id
      ?? campaign.chapters.find((chapter) => !progress[chapter.id]?.unlocked)?.id;
  }
}
