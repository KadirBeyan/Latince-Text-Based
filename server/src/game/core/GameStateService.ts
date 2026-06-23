import type { GameState, PlayerSave } from "../types/gameTypes";
import { ContentLoader } from "../content/ContentLoader";
import { EventBus } from "./EventBus";
import { RuleEngine } from "./RuleEngine";
import { ReviewSystem } from "../systems/ReviewSystem";
import { MasterySystem } from "../systems/MasterySystem";
import { buildAnalyticsSummary } from "../../assessment/AnalyticsSystem";
import { CampaignProgressSystem } from "../systems/CampaignProgressSystem";
import { LivingSceneSystem } from "../systems/LivingSceneSystem";
import { NpcMemoryReactionSystem } from "../systems/NpcMemoryReactionSystem";
import { AmbientActionTemplates } from "../content/AmbientActionTemplates";
import { VillageLifeSystem } from "../systems/VillageLifeSystem";

export class GameStateService {
  private readonly reviewSystem = new ReviewSystem();
  private readonly masterySystem = new MasterySystem();
  private readonly campaignProgressSystem = new CampaignProgressSystem();
  constructor(
    private readonly contentLoader: ContentLoader,
    private readonly ruleEngine: RuleEngine,
    private readonly eventBus: EventBus
  ) {}

  buildState(save: PlayerSave): GameState {
    const currentCampaign = this.contentLoader.getCampaign(save.currentCampaignId);
    const currentChapter = this.contentLoader.getChapter(save.currentCampaignId, save.currentChapterId);
    
    let currentQuest = this.contentLoader.getQuest(save.currentCampaignId, save.currentQuestId);
    let currentScene = this.contentLoader.getScene(save.currentCampaignId, save.currentSceneId);

    if (save.currentQuestId?.startsWith("gen_quest_")) {
      const genQuest = save.generatedQuests?.find(q => q.id === save.currentQuestId);
      if (genQuest) {
        currentQuest = genQuest as any;
        currentScene = genQuest.scenes.find(s => s.id === save.currentSceneId) as any;
      }
    }

    if (!currentCampaign || !currentChapter || !currentQuest || !currentScene) {
      throw new Error(`Save ${save.id} points to missing content. Campaign: ${save.currentCampaignId}, Chapter: ${save.currentChapterId}, Quest: ${save.currentQuestId}, Scene: ${save.currentSceneId}`);
    }

    // Evaluate revisit variants to override title, description, choices
    let activeVariantId: string | undefined = undefined;
    if (currentScene.revisitVariants) {
      for (const variant of currentScene.revisitVariants) {
        if (this.ruleEngine.checkConditions(save, variant.conditions)) {
          activeVariantId = variant.id;
          currentScene = {
            ...currentScene,
            title: variant.titleOverride || currentScene.title,
            description: variant.descriptionOverride || currentScene.description,
            choices: variant.choicesOverride || currentScene.choices,
          };
          break;
        }
      }
    }

    const livingSceneSystem = new LivingSceneSystem();
    const npcMemoryReactionSystem = new NpcMemoryReactionSystem();
    
    const sceneState = livingSceneSystem.getOrCreateSceneState(save, currentScene.id);
    
    const npcReactions = npcMemoryReactionSystem.buildNpcMemoryReactions({
      save,
      npcIds: currentScene.npcIds || [],
      sceneId: currentScene.id
    });

    const ambientActions: any[] = [];
    const sceneAmbientConfigs: any[] = (currentScene as any).ambientTemplates || [];
    for (const config of sceneAmbientConfigs) {
      if (config.conditions && !this.ruleEngine.checkConditions(save, config.conditions)) {
        continue;
      }
      const ambientIntent = AmbientActionTemplates.createIntent({
        templateId: config.templateId,
        sceneId: currentScene.id,
        customId: config.customId,
        labelTrOverride: config.labelTrOverride,
        descriptionTrOverride: config.descriptionTrOverride,
        effects: config.effects,
        previewConsequenceTr: config.previewConsequenceTr
      });
      ambientActions.push(ambientIntent);
    }

    const livingScene = {
      sceneId: currentScene.id,
      visitCount: sceneState.visitCount,
      isRevisit: sceneState.visitCount > 1,
      activeVariantId,
      localFlags: sceneState.localFlags,
      inspectedIds: sceneState.inspectedIds,
      listenedIds: sceneState.listenedIds,
      readIds: sceneState.readIds,
      discoveredClueIds: sceneState.discoveredClueIds,
      discoveredVocabularyIds: sceneState.discoveredVocabularyIds,
      discoveredGrammarIds: sceneState.discoveredGrammarIds,
      npcReactions,
      ambientActions
    };

    const npcMemories = (save.npcMemories || []).filter(m => currentScene.npcIds?.includes(m.npcId));
    const locationStates = (save.locationStates || []).filter(l => l.discovered || l.locationId === currentScene.locationId);
    
    const nowTime = Date.now();
    const worldEvents = (save.worldEvents || [])
      .filter(e => !e.expiresAt || Date.parse(e.expiresAt) > nowTime)
      .filter(e => !e.seen || e.importance >= 50);

    const sideQuestSuggestions = (save.activeSideQuestSuggestions || [])
      .filter(s => s.status === "suggested" || s.status === "accepted");

    const narrativeFlags = save.narrativeFlags || {};

    const generatedQuests = (save.generatedQuests || [])
      .filter(q => q.status === "draft" || q.status === "active")
      .slice(-5);

    const chapterProgress = this.campaignProgressSystem.getCampaignProgress(save, currentCampaign);
    const unlockedChapters = Object.values(chapterProgress).filter((progress) => progress.unlocked).map((progress) => progress.chapterId);

    return {
      saveId: save.id,
      player: { name: save.playerName, level: save.level, xp: save.xp, currency: save.currency, streak: save.streak, characterProfile: save.characterProfile },
      currentCampaign,
      currentChapter,
      currentQuest,
      currentScene,
      availableChoices: this.ruleEngine.getAvailableChoices(save, currentScene),
      inventory: save.inventory,
      skills: save.skills,
      journalEntries: save.journalEntries,
      dialogueLog: save.dialogueLog,
      recentEvents: this.eventBus.getRecentEvents(save, 20),
      uiHints: this.buildHints(save, currentScene.inputMode),
      masteryStates: save.masteryStates,
      reviewSuggestions: this.reviewSystem.createReviewSuggestion(save).suggestions,
      npcMemories,
      locationStates,
      worldEvents,
      sideQuestSuggestions,
      narrativeFlags,
      generatedQuests,
      assessmentProfile: save.assessmentProfile,
      learningPath: save.learningPath ? { ...save.learningPath, steps: save.learningPath.steps.slice(0, 5) } : undefined,
      achievements: save.achievements.filter((achievement) => achievement.unlocked || achievement.progress !== undefined),
      analyticsSummary: buildAnalyticsSummary({ save, range: "session" }),
      chapterProgress,
      unlockedChapters,
      activeInteraction: save.activeInteraction,
      livingScene,
      villageLife: (() => {
        const system = new VillageLifeSystem();
        const saveLife = save.villageLife ? system.getVillageLife(save) : undefined;
        if (!saveLife) return undefined;
        return {
          ...saveLife,
          availableActivities: system.getAvailableVillageActivities({ save, currentLocationId: currentScene.locationId }),
          nearbyNpcs: system.getNearbyNpcs(save, currentScene.locationId),
          ambientEvents: system.getCuratedAmbientEvents(save, currentScene.locationId)
        };
      })()
    };
  }

  private buildHints(save: PlayerSave, inputMode: string): string[] {
    const hints: string[] = [];
    if (inputMode === "text" || inputMode === "hybrid") {
      hints.push("Text answers are matched exactly after simple normalization; LLM evaluation is not enabled yet.");
    }
    if (save.journalEntries.length > 0) {
      hints.push("Journal has entries available.");
    }
    if (!save.assessmentProfile?.placementCompleted) hints.push("Placement test tamamlanmamış.");
    if (save.assessmentProfile?.weaknesses?.[0]) hints.push(`${save.assessmentProfile.weaknesses[0]} zayıf görünüyor.`);
    if (!save.learningPath || save.learningPath.steps.length === 0) hints.push("Bugün 5 soruluk hızlı challenge öneriliyor.");
    hints.push(...this.reviewSystem.createReviewSuggestion(save).suggestions);
    for (const target of this.masterySystem.getWeakTargets(save).slice(0,3)) hints.push(`${target.targetId} ustalığın %${target.mastery}; kısa bir tekrar faydalı olur.`);
    return hints;
  }
}
