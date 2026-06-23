import type { Condition, ID, PlayerSave, Scene, SceneChoice } from "../types/gameTypes";
import { FlagSystem } from "../systems/FlagSystem";
import { InventorySystem } from "../systems/InventorySystem";
import { QuestSystem } from "../systems/QuestSystem";
import { SkillSystem } from "../systems/SkillSystem";
import { NpcRelationshipSystem } from "../systems/NpcRelationshipSystem";
import { NpcMemorySystem } from "../systems/NpcMemorySystem";
import { LocationStateSystem } from "../systems/LocationStateSystem";
import { LivingSceneSystem } from "../systems/LivingSceneSystem";

export class RuleEngine {
  constructor(
    private readonly inventorySystem = new InventorySystem(),
    private readonly skillSystem = new SkillSystem(),
    private readonly questSystem = new QuestSystem(),
    private readonly flagSystem = new FlagSystem()
  ) {}

  checkCondition(save: PlayerSave, condition: Condition): boolean {
    switch (condition.type) {
      case "HAS_ITEM":
        return this.inventorySystem.hasItem(save, condition.itemId, condition.quantity ?? 1);
      case "HAS_SKILL":
        return this.skillSystem.hasSkill(save, condition.skillId, condition.minLevel ?? 1);
      case "FLAG_EQUALS":
        return this.flagSystem.flagEquals(save, condition.key, condition.value);
      case "QUEST_STATUS":
        return this.questSystem.getQuestStatus(save, condition.questId) === condition.status;
      case "MIN_LEVEL":
        return save.level >= condition.level;
      case "SCENE_VISITED":
        return save.visitedSceneIds.includes(condition.sceneId);
      case "SCENE_COMPLETED":
        return save.completedSceneIds.includes(condition.sceneId);
      case "NPC_RELATION_MIN":
        return new NpcRelationshipSystem().hasRelationshipMin({
          save,
          npcId: condition.npcId,
          field: condition.field,
          value: condition.value
        });
      case "NPC_MEMORY_HAS_TAG":
        return new NpcMemorySystem()
          .getNpcMemory(save, condition.npcId)
          .facts.some(fact => fact.tags?.includes(condition.tag));
      case "LOCATION_DISCOVERED":
        return new LocationStateSystem().getLocationState(save, condition.locationId).discovered;
      case "LOCATION_FLAG_EQUALS":
        return new LocationStateSystem().getLocationState(save, condition.locationId).flags[condition.key] === condition.value;
      case "NARRATIVE_FLAG_EQUALS":
        return save.narrativeFlags[condition.key] === condition.value;
      case "SCENE_VISIT_COUNT_MIN":
        return new LivingSceneSystem().getSceneVisitCount(save, condition.sceneId) >= condition.count;
      case "SCENE_LOCAL_FLAG_EQUALS":
        return new LivingSceneSystem().hasSceneLocalFlag(save, condition.sceneId, condition.key, condition.value);
      case "SCENE_INTENT_RESOLVED":
        return new LivingSceneSystem().getOrCreateSceneState(save, condition.sceneId).resolvedIntentIds.includes(condition.intentId);
      case "SCENE_INSPECTED":
        return new LivingSceneSystem().getOrCreateSceneState(save, condition.sceneId).inspectedIds.includes(condition.inspectId);
      case "SCENE_LISTENED":
        return new LivingSceneSystem().getOrCreateSceneState(save, condition.sceneId).listenedIds.includes(condition.listenId);
      case "SCENE_READ":
        return new LivingSceneSystem().getOrCreateSceneState(save, condition.sceneId).readIds.includes(condition.readId);
      case "SCENE_CLUE_DISCOVERED":
        return new LivingSceneSystem().getOrCreateSceneState(save, condition.sceneId).discoveredClueIds.includes(condition.clueId);
      case "SCENE_VOCAB_DISCOVERED":
        return new LivingSceneSystem().getOrCreateSceneState(save, condition.sceneId).discoveredVocabularyIds.includes(condition.vocabularyId);
      case "NPC_INTERACTION_COUNT_MIN": {
        const count = save.narrativeFlags[`npc_interaction_count_${condition.npcId}`] || 0;
        return Number(count) >= condition.count;
      }
    }
  }

  checkConditions(save: PlayerSave, conditions: Condition[]): boolean {
    return conditions.every((condition) => this.checkCondition(save, condition));
  }

  getAvailableChoices(save: PlayerSave, scene: Scene): SceneChoice[] {
    if (scene.inputMode === "hybrid-dialogue" && scene.hybridDialogue) {
      const selected = save.narrativeFlags[`selected_intent_${scene.id}`];
      if (!selected) {
        return scene.hybridDialogue.intents.map(intent => ({
          id: intent.id,
          label: intent.labelTr,
          description: `Latince yaz: ${intent.targetMeaningTr}`,
          conditions: [],
          effects: []
        }));
      }
      return [];
    }
    return (scene.choices || []).filter((choice) => this.checkConditions(save, choice.conditions || []));
  }

  canEnterScene(save: PlayerSave, scene: Scene): boolean {
    return this.checkConditions(save, scene.conditions);
  }

  canUseItem(save: PlayerSave, itemId: ID): boolean {
    return this.inventorySystem.hasItem(save, itemId, 1);
  }
}
