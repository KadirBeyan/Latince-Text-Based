import type { Effect, PlayerSave } from "../types/gameTypes";
import type { EffectContext } from "../types/eventTypes";
import { ContentLoader } from "../content/ContentLoader";
import { DialogueSystem } from "../systems/DialogueSystem";
import { FlagSystem } from "../systems/FlagSystem";
import { InventorySystem } from "../systems/InventorySystem";
import { JournalSystem } from "../systems/JournalSystem";
import { ProgressionSystem } from "../systems/ProgressionSystem";
import { QuestSystem } from "../systems/QuestSystem";
import { SkillSystem } from "../systems/SkillSystem";
import { EventBus } from "./EventBus";
import { MasterySystem } from "../systems/MasterySystem";
import { NpcMemorySystem } from "../systems/NpcMemorySystem";
import { NpcRelationshipSystem } from "../systems/NpcRelationshipSystem";
import { LocationStateSystem } from "../systems/LocationStateSystem";
import { WorldEventSystem } from "../systems/WorldEventSystem";
import { CampaignProgressSystem } from "../systems/CampaignProgressSystem";

import { GeneratedContentSystem } from "../systems/GeneratedContentSystem";
import { LivingSceneSystem } from "../systems/LivingSceneSystem";

export class EffectRunner {
  constructor(
    private readonly contentLoader: ContentLoader,
    private readonly eventBus: EventBus,
    private readonly progressionSystem = new ProgressionSystem(),
    private readonly inventorySystem = new InventorySystem(),
    private readonly flagSystem = new FlagSystem(),
    private readonly skillSystem = new SkillSystem(),
    private readonly questSystem = new QuestSystem(),
    private readonly journalSystem = new JournalSystem(),
    private readonly dialogueSystem = new DialogueSystem(),
    private readonly masterySystem = new MasterySystem()
  ) {}

  applyEffects(save: PlayerSave, effects: Effect[], context: EffectContext): PlayerSave {
    return effects.reduce((currentSave, effect) => this.applyEffect(currentSave, effect, context), save);
  }

  private applyEffect(save: PlayerSave, effect: Effect, context: EffectContext): PlayerSave {
    let nextSave: PlayerSave = save;
    switch (effect.type) {
      case "ADD_XP":
        nextSave = this.withXpEvents(save, effect.amount);
        break;
      case "ADD_CURRENCY":
        nextSave = this.eventBus.emit({ ...save, currency: Math.max(0, save.currency + effect.amount) }, "CURRENCY_ADDED", { amount: effect.amount, total: Math.max(0, save.currency + effect.amount) });
        break;
      case "REMOVE_CURRENCY":
        nextSave = { ...save, currency: Math.max(0, save.currency - effect.amount) };
        break;
      case "APPLY_REWARD_BUNDLE":
        nextSave = this.applyRewardBundle(save, effect.reward);
        break;
      case "ADD_ITEM":
        nextSave = this.inventorySystem.addItem(save, effect.itemId, effect.quantity ?? 1);
        nextSave = this.eventBus.emit(nextSave, "ITEM_ADDED", { itemId: effect.itemId, quantity: effect.quantity ?? 1 });
        break;
      case "REMOVE_ITEM":
        nextSave = this.inventorySystem.removeItem(save, effect.itemId, effect.quantity ?? 1);
        break;
      case "SET_FLAG":
        nextSave = this.flagSystem.setFlag(save, effect.key, effect.value);
        break;
      case "UNLOCK_SKILL":
        nextSave = this.skillSystem.unlockSkill(save, effect.skillId);
        nextSave = this.eventBus.emit(nextSave, "SKILL_UNLOCKED", { skillId: effect.skillId });
        break;
      case "INCREMENT_SKILL":
        nextSave = this.skillSystem.incrementSkill(save, effect.skillId, effect.amount ?? 1);
        nextSave = this.eventBus.emit(nextSave, "SKILL_INCREMENTED", { skillId: effect.skillId, amount: effect.amount ?? 1 });
        break;
      case "START_QUEST":
        if (effect.questId.startsWith("gen_quest_")) {
          nextSave = GeneratedContentSystem.startQuest(save, effect.questId, this.eventBus);
        } else {
          nextSave = this.questSystem.startQuest(save, effect.questId);
        }
        break;
      case "COMPLETE_QUEST":
        if (effect.questId.startsWith("gen_quest_")) {
          nextSave = GeneratedContentSystem.completeQuest(save, effect.questId, this.eventBus);
        } else {
          nextSave = this.questSystem.completeQuest(save, effect.questId);
        }
        nextSave = this.eventBus.emit(nextSave, "QUEST_COMPLETED", { questId: effect.questId });
        break;
      case "FAIL_QUEST":
        if (effect.questId.startsWith("gen_quest_")) {
          nextSave = GeneratedContentSystem.failQuest(save, effect.questId);
        } else {
          nextSave = this.questSystem.failQuest(save, effect.questId);
        }
        break;
      case "ADD_JOURNAL_ENTRY":
        nextSave = this.journalSystem.addEntry(save, { title: effect.title, body: effect.body, sceneId: effect.sceneId ?? context.sceneId, questId: effect.questId ?? context.questId });
        break;
      case "ADD_DIALOGUE_ENTRY":
        nextSave = this.dialogueSystem.addDialogue(save, effect.speakerId, effect.text, effect.language);
        break;
      case "MARK_SCENE_COMPLETED":
        nextSave = this.markSceneCompleted(save, effect.sceneId ?? context.sceneId);
        break;
      case "GO_TO_SCENE":
        nextSave = this.goToScene(save, effect.sceneId);
        break;
      case "ADD_NPC_MEMORY":
        nextSave = new NpcMemorySystem().addNpcMemoryFact({
          save,
          npcId: effect.npcId,
          text: effect.text,
          importance: effect.importance,
          tags: effect.tags,
          eventBus: this.eventBus
        });
        break;
      case "UPDATE_NPC_RELATIONSHIP":
        nextSave = new NpcRelationshipSystem().updateRelationship({
          save,
          npcId: effect.npcId,
          delta: effect.delta,
          reason: effect.reason,
          eventBus: this.eventBus
        });
        break;
      case "DISCOVER_LOCATION":
        nextSave = new LocationStateSystem().discoverLocation({
          save,
          locationId: effect.locationId,
          eventBus: this.eventBus
        });
        break;
      case "SET_LOCATION_FLAG":
        nextSave = new LocationStateSystem().setLocationFlag({
          save,
          locationId: effect.locationId,
          key: effect.key,
          value: effect.value
        });
        break;
      case "SET_LOCATION_MOOD":
        nextSave = new LocationStateSystem().setLocationMood({
          save,
          locationId: effect.locationId,
          mood: effect.mood,
          eventBus: this.eventBus
        });
        break;
      case "ADD_WORLD_EVENT":
        nextSave = new WorldEventSystem().addWorldEvent({
          save,
          event: effect.event,
          eventBus: this.eventBus
        });
        break;
      case "SET_NARRATIVE_FLAG":
        nextSave = {
          ...save,
          narrativeFlags: {
            ...save.narrativeFlags,
            [effect.key]: effect.value
          }
        };
        break;
      case "UNLOCK_CHAPTER":
        nextSave = new CampaignProgressSystem().unlockChapter(save, effect.chapterId);
        break;
      case "COMPLETE_CHAPTER":
        nextSave = new CampaignProgressSystem().completeChapter(save, effect.chapterId);
        break;
      case "SET_SCENE_LOCAL_FLAG":
        nextSave = new LivingSceneSystem().setLocalFlag({
          save,
          sceneId: effect.sceneId,
          key: effect.key,
          value: effect.value,
          eventBus: this.eventBus
        });
        break;
      case "ADD_SCENE_CLUE":
        nextSave = new LivingSceneSystem().addSceneClue({
          save,
          sceneId: effect.sceneId,
          clueId: effect.clueId,
          eventBus: this.eventBus
        });
        break;
      case "MARK_SCENE_INSPECTED":
        nextSave = new LivingSceneSystem().recordInspection({
          save,
          sceneId: effect.sceneId,
          inspectId: effect.inspectId,
          vocabularyIds: effect.vocabularyIds,
          grammarIds: effect.grammarIds,
          clueIds: effect.clueIds,
          eventBus: this.eventBus
        });
        break;
      case "MARK_SCENE_LISTENED":
        nextSave = new LivingSceneSystem().recordListening({
          save,
          sceneId: effect.sceneId,
          listenId: effect.listenId,
          vocabularyIds: effect.vocabularyIds,
          grammarIds: effect.grammarIds,
          clueIds: effect.clueIds,
          eventBus: this.eventBus
        });
        break;
      case "MARK_SCENE_READ":
        nextSave = new LivingSceneSystem().recordReading({
          save,
          sceneId: effect.sceneId,
          readId: effect.readId,
          vocabularyIds: effect.vocabularyIds,
          grammarIds: effect.grammarIds,
          clueIds: effect.clueIds,
          eventBus: this.eventBus
        });
        break;
      case "ADD_SCENE_DISCOVERED_VOCAB":
        nextSave = new LivingSceneSystem().addSceneDiscoveredVocab({
          save,
          sceneId: effect.sceneId,
          vocabularyId: effect.vocabularyId,
          eventBus: this.eventBus
        });
        break;
      case "ADD_SCENE_DISCOVERED_GRAMMAR":
        nextSave = new LivingSceneSystem().addSceneDiscoveredGrammar({
          save,
          sceneId: effect.sceneId,
          grammarId: effect.grammarId,
          eventBus: this.eventBus
        });
        break;
      case "INCREMENT_NPC_INTERACTION_COUNT": {
        const key = `npc_interaction_count_${effect.npcId}`;
        const current = save.narrativeFlags[key] || 0;
        nextSave = {
          ...save,
          narrativeFlags: {
            ...save.narrativeFlags,
            [key]: Number(current) + 1
          }
        };
        nextSave = this.eventBus.emit(nextSave, "NPC_INTERACTION_INCREMENTED", { npcId: effect.npcId, count: Number(current) + 1 });
        break;
      }
    }
    return this.eventBus.emit(nextSave, `effect.${effect.type}`, { effect, context });
  }

  private withXpEvents(save: PlayerSave, amount: number): PlayerSave {
    const oldLevel = save.level;
    let next = this.progressionSystem.addXp(save, amount);
    next = this.eventBus.emit(next, "XP_ADDED", { amount, total: next.xp });
    if (next.level > oldLevel) next = this.eventBus.emit(next, "LEVEL_UP", { oldLevel, newLevel: next.level });
    return next;
  }

  private applyRewardBundle(save: PlayerSave, reward: import("../types/gameTypes").RewardBundle): PlayerSave {
    let next = save;
    if (reward.xp) next = this.withXpEvents(next, reward.xp);
    if (reward.currency) next = this.eventBus.emit({ ...next, currency: Math.max(0, next.currency + reward.currency) }, "CURRENCY_ADDED", { amount: reward.currency, total: Math.max(0, next.currency + reward.currency) });
    for (const item of reward.items ?? []) { next = this.inventorySystem.addItem(next, item.itemId, item.quantity); next = this.eventBus.emit(next, "ITEM_ADDED", { itemId: item.itemId, quantity: item.quantity }); }
    for (const skill of reward.skillIncrements ?? []) { next = this.skillSystem.incrementSkill(next, skill.skillId, skill.amount); next = this.eventBus.emit(next, "SKILL_INCREMENTED", { skillId: skill.skillId, amount: skill.amount }); }
    for (const target of reward.masteryTargets ?? []) { const before=this.masterySystem.getMastery({save:next,...target})?.mastery; next=this.masterySystem.updateMastery({save:next,...target,isCorrect:true,amount:target.amount}); const after=this.masterySystem.getMastery({save:next,...target})?.mastery??0; next=this.eventBus.emit(next,"MASTERY_UPDATED",{targetId:target.targetId,targetType:target.targetType,before,after}); }
    return this.eventBus.emit(next, "REWARD_BUNDLE_APPLIED", { reward });
  }

  private markSceneCompleted(save: PlayerSave, sceneId: string): PlayerSave {
    if (save.completedSceneIds.includes(sceneId)) {
      return save;
    }
    return { ...save, completedSceneIds: [...save.completedSceneIds, sceneId] };
  }

  private goToScene(save: PlayerSave, sceneId: string): PlayerSave {
    const quest = this.contentLoader.findQuestForScene(save.currentCampaignId, sceneId);
    const chapter = this.contentLoader.findChapterForScene(save.currentCampaignId, sceneId);
    if (!quest || !chapter) {
      throw new Error(`Cannot go to unknown scene ${sceneId}.`);
    }
    return { ...save, currentChapterId: chapter.id, currentQuestId: quest.id, currentSceneId: sceneId };
  }
}
