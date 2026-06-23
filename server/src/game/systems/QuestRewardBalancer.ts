import type { GeneratedQuest, RewardBundle, ID } from "../types/gameTypes";

export class QuestRewardBalancer {
  static buildRewardBundleForGeneratedQuest(params: {
    difficulty: GeneratedQuest["difficulty"];
    sceneCount: number;
    learningFocus: GeneratedQuest["learningFocus"];
    playerLevel: number;
  }): RewardBundle {
    const perScene = { intro: 10, practice: 14, review: 12, challenge: 22 }[params.difficulty];
    const currencyPerScene = { intro: 1, practice: 2, review: 1, challenge: 4 }[params.difficulty];
    const levelBonus = Math.min(1.25, 1 + Math.max(0, params.playerLevel - 1) * 0.03);
    const reward: RewardBundle = {
      xp: Math.min(120, Math.max(1, Math.round(perScene * params.sceneCount * levelBonus))),
      currency: Math.min(20, Math.max(1, currencyPerScene * params.sceneCount))
    };
    if (params.difficulty === "review") {
      reward.masteryTargets = [
        ...params.learningFocus.grammarIds.map((targetId) => ({ targetId, targetType: "grammar" as const, amount: 1 })),
        ...params.learningFocus.vocabularyIds.map((targetId) => ({ targetId, targetType: "vocabulary" as const, amount: 1 }))
      ].slice(0, 4);
    }
    return reward;
  }

  static calculateRewards(
    difficulty: "intro" | "practice" | "review" | "challenge",
    sceneCount: number,
    playerLevel: number
  ): RewardBundle {
    return this.buildRewardBundleForGeneratedQuest({ difficulty, sceneCount, learningFocus: { grammarIds: [], vocabularyIds: [], skillIds: [] }, playerLevel });
  }

  static balanceQuestRewards(quest: GeneratedQuest, playerLevel: number): GeneratedQuest {
    if (!quest.scenes || quest.scenes.length === 0) return quest;

    const reward = this.buildRewardBundleForGeneratedQuest({ difficulty: quest.difficulty, sceneCount: quest.scenes.length, learningFocus: quest.learningFocus, playerLevel });

    // Find the final scene (the last scene in the array is the resolution)
    const finalSceneIndex = quest.scenes.length - 1;
    const finalScene = { ...quest.scenes[finalSceneIndex] };

    // Inject APPLY_REWARD_BUNDLE into choices in the final scene
    if (finalScene.choices && finalScene.choices.length > 0) {
      finalScene.choices = finalScene.choices.map(choice => {
        const effects = [...(choice.effects || [])];
        // Remove any existing reward bundle effects to prevent duplicates
        const filteredEffects: import("../types/gameTypes").Effect[] = effects.filter(e => e.type !== "APPLY_REWARD_BUNDLE");
        filteredEffects.push({
          type: "APPLY_REWARD_BUNDLE",
          reward
        });
        return {
          ...choice,
          effects: filteredEffects
        };
      });
    } else {
      // If no choices, append directly to scene's effects/rewards
      const rewardsList = [...(finalScene.rewards || [])];
      const filteredRewards: import("../types/gameTypes").Effect[] = rewardsList.filter(e => e.type !== "APPLY_REWARD_BUNDLE");
      filteredRewards.push({
        type: "APPLY_REWARD_BUNDLE",
        reward
      });
      finalScene.rewards = filteredRewards;
    }

    const updatedScenes = [...quest.scenes];
    updatedScenes[finalSceneIndex] = finalScene;

    return {
      ...quest,
      scenes: updatedScenes
    };
  }
}
