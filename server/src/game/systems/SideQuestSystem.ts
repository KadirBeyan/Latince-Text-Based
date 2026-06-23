import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { PlayerSave, SideQuestSuggestion, SideQuestTemplate, MasteryState, PlayerErrorMemory } from "../types/gameTypes";
import { EventBus } from "../core/EventBus";

export class SideQuestSystem {
  constructor(private readonly dataRoot = path.resolve(process.cwd(), "data")) {}

  loadSideQuestTemplates(): SideQuestTemplate[] {
    const filePath = path.join(this.dataRoot, "side-quest-templates.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as SideQuestTemplate[];
  }

  getEligibleTemplates(params: {
    save: PlayerSave;
    masteryStates: MasteryState[];
    errorMemory?: PlayerErrorMemory[];
  }): SideQuestTemplate[] {
    const { save, masteryStates, errorMemory = [] } = params;
    const templates = this.loadSideQuestTemplates();

    const weakGrammars = masteryStates.filter(m => m.targetType === "grammar" && m.mastery < 40).map(m => m.targetId);
    const weakVocabs = masteryStates.filter(m => m.targetType === "vocabulary" && m.mastery < 40).map(m => m.targetId);
    const badTags = errorMemory.filter(e => e.count >= 2).map(e => e.tag);

    // Filter templates
    return templates.filter(template => {
      const trigger = template.trigger;
      
      // Filter out templates already suggested or accepted in active list
      const isAlreadyActive = save.activeSideQuestSuggestions.some(
        s => s.templateId === template.id && (s.status === "suggested" || s.status === "accepted")
      );
      if (isAlreadyActive) return false;

      let matches = false;
      if (typeof trigger.minLevel === "number" && save.level >= trigger.minLevel) {
        matches = true;
      }
      if (trigger.weakGrammarIds?.some(id => weakGrammars.includes(id))) {
        matches = true;
      }
      if (trigger.weakVocabularyIds?.some(id => weakVocabs.includes(id))) {
        matches = true;
      }
      if (trigger.errorTags?.some(tag => badTags.includes(tag))) {
        matches = true;
      }

      return matches;
    });
  }

  createSuggestionFromTemplate(params: {
    save: PlayerSave;
    template: SideQuestTemplate;
  }): SideQuestSuggestion {
    const { template } = params;
    return {
      id: randomUUID(),
      templateId: template.id,
      title: template.title,
      reason: template.reasonTemplate,
      relatedGrammarIds: template.learningFocus.grammarIds,
      relatedVocabularyIds: template.learningFocus.vocabularyIds,
      relatedErrorTags: template.trigger.errorTags ?? [],
      suggestedLocationId: template.suggestedLocationId,
      suggestedNpcId: template.suggestedNpcId,
      difficulty: template.difficulty,
      createdAt: new Date().toISOString(),
      status: "suggested"
    };
  }

  refreshSideQuestSuggestions(save: PlayerSave): PlayerSave {
    const active = save.activeSideQuestSuggestions.filter(
      s => s.status === "suggested" || s.status === "accepted"
    );
    if (active.length >= 3) {
      return save;
    }

    const eligible = this.getEligibleTemplates({
      save,
      masteryStates: save.masteryStates,
      errorMemory: save.errorMemory
    });

    const needed = 3 - active.length;
    const additions = eligible.slice(0, needed).map(template => 
      this.createSuggestionFromTemplate({ save, template })
    );

    if (additions.length === 0) return save;

    return {
      ...save,
      activeSideQuestSuggestions: [...save.activeSideQuestSuggestions, ...additions]
    };
  }

  acceptSideQuestSuggestion(params: {
    save: PlayerSave;
    suggestionId: string;
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, suggestionId, eventBus } = params;
    const suggestion = save.activeSideQuestSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return save;

    const updated = { ...suggestion, status: "accepted" as const };
    let nextSave = {
      ...save,
      activeSideQuestSuggestions: save.activeSideQuestSuggestions.map(s => s.id === suggestionId ? updated : s)
    };

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SIDE_QUEST_ACCEPTED", { suggestionId, templateId: suggestion.templateId, title: suggestion.title });
    }

    return nextSave;
  }

  dismissSideQuestSuggestion(params: {
    save: PlayerSave;
    suggestionId: string;
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, suggestionId, eventBus } = params;
    const suggestion = save.activeSideQuestSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return save;

    const updated = { ...suggestion, status: "dismissed" as const };
    let nextSave = {
      ...save,
      activeSideQuestSuggestions: save.activeSideQuestSuggestions.map(s => s.id === suggestionId ? updated : s)
    };

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SIDE_QUEST_DISMISSED", { suggestionId, templateId: suggestion.templateId, title: suggestion.title });
    }

    return nextSave;
  }
}
