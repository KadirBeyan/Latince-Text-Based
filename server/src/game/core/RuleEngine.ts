import type { Condition, ID, PlayerSave, Scene, SceneChoice } from "../types/gameTypes";
import { FlagSystem } from "../systems/FlagSystem";
import { InventorySystem } from "../systems/InventorySystem";
import { QuestSystem } from "../systems/QuestSystem";
import { SkillSystem } from "../systems/SkillSystem";
import { NpcRelationshipSystem } from "../systems/NpcRelationshipSystem";
import { NpcMemorySystem } from "../systems/NpcMemorySystem";
import { LocationStateSystem } from "../systems/LocationStateSystem";
import { LivingSceneSystem } from "../systems/LivingSceneSystem";
import { getSelectedIntentId } from "../systems/SelectedIntentState";

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
      case "RPG_SKILL_MIN":
        return (save.characterProfile?.skills?.[condition.payload.skillId] ?? 0) >= condition.payload.value;
      case "VILLAGE_TIME_EQUALS":
        return (save.villageLife?.dayState.timeOfDay ?? "mane") === condition.timeOfDay;
      case "VILLAGE_DAY_MIN":
        return (save.villageLife?.dayState.dayNumber ?? 1) >= condition.dayNumber;
      case "VILLAGE_ACTIVITY_COMPLETED":
        return save.villageLife?.dayState.completedDailyActivityIds.includes(condition.activityId) ||
          save.villageLife?.routineHistory.some(h => h.activityIds.includes(condition.activityId)) || false;
      case "VILLAGE_ACTIVITY_NOT_COMPLETED":
        return !(save.villageLife?.dayState.completedDailyActivityIds.includes(condition.activityId) ||
          save.villageLife?.routineHistory.some(h => h.activityIds.includes(condition.activityId)));
      case "VILLAGE_DAY_FLAG_EQUALS":
        return save.villageLife?.dayState.dayFlags[condition.key] === condition.value;
      case "VILLAGE_ACTIONS_AVAILABLE":
        return (save.villageLife?.dayState.actionsUsedThisPeriod ?? 0) < (save.villageLife?.dayState.maxActionsPerPeriod ?? 3);
      case "LIFE_PATH_HINT_MIN":
        return (save.characterProfile?.lifePathHints?.[condition.path] ?? 0) >= condition.value;
      case "CHARACTER_TRAIT_HAS":
        return save.characterProfile?.traits.includes(condition.trait) ?? false;
      case "CHARACTER_ORIGIN_EQUALS":
        return save.characterProfile?.origin === condition.origin;
    }
  }

  checkConditions(save: PlayerSave, conditions: Condition[]): boolean {
    return conditions.every((condition) => this.checkCondition(save, condition));
  }

  getAvailableChoices(save: PlayerSave, scene: Scene): SceneChoice[] {
    if (scene.inputMode === "hybrid-dialogue" && scene.hybridDialogue) {
      const selected = getSelectedIntentId(save, scene);
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
    
    let choices = (scene.choices || []).filter((choice) => this.checkConditions(save, choice.conditions || []));

    const LOCATION_SCENE_IDS = new Set([
      "vicus_001_home_morning",
      "vicus_002_village_path",
      "vicus_003_market_help",
      "vicus_004_field_edge",
      "vicus_005_teacher_corner",
      "vicus_006_veteran_bench",
      "vicus_007_scribe_table",
      "vicus_008_shrine",
      "vicus_009_old_oak"
    ]);

    if (save.currentChapterId === "vicus_prologue" && LOCATION_SCENE_IDS.has(scene.id) && save.villageLife) {
      const VillageLifeSystem = require("../systems/VillageLifeSystem").VillageLifeSystem;
      const system = new VillageLifeSystem();

      // 1. Available activities
      const activities = system.getAvailableVillageActivities({ save, currentLocationId: scene.locationId });
      const activityChoices = activities.map((activity: any) => ({
        id: `activity_${activity.id}`,
        label: activity.titleTr,
        description: activity.descriptionTr,
        conditions: [],
        effects: [
          { type: "GO_TO_SCENE", sceneId: activity.sceneId }
        ]
      }));

      // 2. Travel choices
      const LOCATION_NAMES: Record<string, string> = {
        home_hut: "Ev (Home)",
        village_path: "Köy Yolu",
        village_market: "Pazar Yeri",
        field_edge: "Tarla Sınırı",
        teacher_corner: "Okul Köşesi",
        veteran_bench: "Gazi Bankı",
        scribe_table: "Yazıcı Masası",
        shrine: "Tapınak Sunağı",
        old_oak: "Koca Meşe"
      };

      const LOCATION_SCENES: Record<string, string> = {
        home_hut: "vicus_001_home_morning",
        village_path: "vicus_002_village_path",
        village_market: "vicus_003_market_help",
        field_edge: "vicus_004_field_edge",
        teacher_corner: "vicus_005_teacher_corner",
        veteran_bench: "vicus_006_veteran_bench",
        scribe_table: "vicus_007_scribe_table",
        shrine: "vicus_008_shrine",
        old_oak: "vicus_009_old_oak"
      };

      const travelChoices: any[] = [];
      for (const [locId, targetSceneId] of Object.entries(LOCATION_SCENES)) {
        if (locId !== scene.locationId) {
          travelChoices.push({
            id: `travel_${locId}`,
            label: `${LOCATION_NAMES[locId]} Bölgesine Git`,
            description: "Köyde başka bir bölgeye geçiş yap.",
            conditions: [],
            effects: [
              { type: "GO_TO_SCENE", sceneId: targetSceneId }
            ]
          });
        }
      }

      // 3. Time controls
      const timeChoices: any[] = [];
      const dayState = save.villageLife.dayState;

      if (dayState.timeOfDay !== "nox") {
        timeChoices.push({
          id: "action_advance_time",
          label: "Zamanı İlerlet (Dinlen)",
          description: "Köyde zamanı bir sonraki vakte geçirir.",
          conditions: [],
          effects: [
            { type: "ADVANCE_VILLAGE_TIME" }
          ]
        });
      } else if (scene.locationId === "home_hut") {
        timeChoices.push({
          id: "action_start_new_day",
          label: "Uyu ve Yeni Günü Başlat",
          description: "Günü bitirip sabah uyan.",
          conditions: [],
          effects: [
            { type: "START_NEW_VILLAGE_DAY" }
          ]
        });
      }

      // 4. Finish Village choice (Day 3+)
      if (dayState.dayNumber >= 3 && (scene.locationId === "home_hut" || scene.locationId === "old_oak")) {
        timeChoices.push({
          id: "action_finish_village",
          label: "Köyden Ayrıl ve Yolunu Seç",
          description: "Köydeki günleri tamamla ve hayat yoluna karar ver.",
          conditions: [],
          effects: [
            { type: "GO_TO_SCENE", sceneId: "vicus_018_prologue_close" }
          ]
        });
      }

      choices = [...choices, ...activityChoices, ...travelChoices, ...timeChoices];
    }

    return choices;
  }

  canEnterScene(save: PlayerSave, scene: Scene): boolean {
    return this.checkConditions(save, scene.conditions);
  }

  canUseItem(save: PlayerSave, itemId: ID): boolean {
    return this.inventorySystem.hasItem(save, itemId, 1);
  }
}
