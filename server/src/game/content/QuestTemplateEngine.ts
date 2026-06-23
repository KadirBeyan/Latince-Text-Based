import type { PlayerSave, QuestTemplate, QuestTemplateRenderContext, ID } from "../types/gameTypes";
import type { ContentLoader } from "./ContentLoader";

export class QuestTemplateEngine {
  constructor(private readonly contentLoader: ContentLoader) {}

  loadQuestTemplates(): QuestTemplate[] { return this.contentLoader.getQuestTemplates(); }
  getQuestTemplate(templateId: ID): QuestTemplate | undefined { return this.contentLoader.getQuestTemplate(templateId); }
  getAllQuestTemplates(): QuestTemplate[] { return this.contentLoader.getQuestTemplates(); }

  scoreTemplate(template: QuestTemplate, save: PlayerSave, context: { currentLocationId?: ID; currentNpcId?: ID }): number {
    // 1. Level check
    const level = save.level || 1;
    if (template.trigger.minLevel !== undefined && level < template.trigger.minLevel) return 0;
    if (template.trigger.maxLevel !== undefined && level > template.trigger.maxLevel) return 0;

    let score = 10; // Base score

    // 2. Identify weak grammar and vocab from save state
    const weakGrammar = new Set<string>();
    const weakVocab = new Set<string>();
    const errorTags = new Set<string>();

    // Mastery < 0.6 is considered weak
    for (const ms of save.masteryStates || []) {
      if (ms.mastery < 0.6) {
        if (ms.targetType === "grammar") weakGrammar.add(ms.targetId);
        if (ms.targetType === "vocabulary") weakVocab.add(ms.targetId);
      }
    }

    // Error memory
    for (const err of save.errorMemory || []) {
      errorTags.add(err.tag);
      for (const gid of err.relatedGrammarIds || []) weakGrammar.add(gid);
      for (const vid of err.relatedVocabularyIds || []) weakVocab.add(vid);
    }

    if (template.trigger.weakGrammarIds) {
      const matches = template.trigger.weakGrammarIds.filter((gid) => weakGrammar.has(gid));
      if (matches.length === 0) return 0;
      score += matches.length * 20;
    }

    // Vocab match
    if (template.trigger.weakVocabularyIds) {
      const matches = template.trigger.weakVocabularyIds.filter((vid) => weakVocab.has(vid));
      if (matches.length === 0) return 0;
      score += matches.length * 15;
    }

    // Error tags match
    if (template.trigger.errorTags) {
      const matches = template.trigger.errorTags.filter((tag) => errorTags.has(tag));
      if (matches.length === 0) return 0;
      score += matches.length * 20;
    }

    // 3. Location match
    const campaignScene = this.contentLoader.getScene(save.currentCampaignId, save.currentSceneId);
    const generatedScene = save.generatedQuests?.flatMap((quest) => quest.scenes).find((scene) => scene.id === save.currentSceneId);
    const currentLocation = context.currentLocationId || generatedScene?.locationId || campaignScene?.locationId;
    const discoveredLocations = new Set((save.locationStates || []).filter((state) => state.discovered).map((state) => state.locationId));
    if (template.trigger.locationId) {
      if (template.trigger.locationId !== currentLocation && !discoveredLocations.has(template.trigger.locationId)) return 0;
      score += template.trigger.locationId === currentLocation ? 30 : 15;
    } else if (template.suggestedLocationId === currentLocation) {
      score += 20;
    }

    // 4. NPC match
    if (template.trigger.npcId && context.currentNpcId && template.trigger.npcId === context.currentNpcId) {
      score += 25;
    } else if (template.suggestedNpcId && template.suggestedNpcId === context.currentNpcId) {
      score += 15;
    }

    // 5. Relationship check
    if (template.trigger.relationshipMin) {
      const req = template.trigger.relationshipMin;
      const mem = save.npcMemories?.find((m: any) => m.npcId === req.npcId);
      const val = mem?.relationship?.[req.field] || 0;
      if (val >= req.value) {
        score += 20;
      } else {
        return 0;
      }
    }

    // 6. World events match
    if (template.trigger.worldEventTypes) {
      const now = Date.now();
      const matches = (save.worldEvents || []).filter((event) => template.trigger.worldEventTypes!.includes(event.type) && (!event.expiresAt || Date.parse(event.expiresAt) > now));
      if (matches.length === 0) return 0;
      score += matches.length * 20;
    }

    return score;
  }

  getEligibleTemplates(save: PlayerSave, context: { currentLocationId?: ID; currentNpcId?: ID } = {}): Array<{ template: QuestTemplate; score: number }> {
    const usedTemplateIds = new Set((save.generatedQuests || []).filter((quest) => quest.status === "draft" || quest.status === "active").map((quest) => quest.sourceTemplateId).filter((id): id is ID => Boolean(id)));
    const templates = this.contentLoader.getQuestTemplates();
    const scored = templates
      .filter((template) => !usedTemplateIds.has(template.id))
      .map(template => ({ template, score: this.scoreTemplate(template, save, context) }))
      .filter(t => t.score > 0);
    
    return scored.sort((a, b) => b.score - a.score);
  }

  findEligibleTemplates(params: { save: PlayerSave }): QuestTemplate[] { return this.getEligibleTemplates(params.save).map(({ template }) => template); }
  scoreTemplateEligibility(params: { save: PlayerSave; template: QuestTemplate }): number { return this.scoreTemplate(params.template, params.save, {}); }

  renderText(textTemplate: string, context: QuestTemplateRenderContext): string {
    let text = textTemplate;
    text = text.replace(/{playerName}/g, context.playerName);
    text = text.replace(/{npcName}/g, context.npcName || "");
    text = text.replace(/{locationName}/g, context.locationName || "");
    text = text.replace(/{grammarLabels}/g, context.grammarLabels.join(", "));
    text = text.replace(/{vocabularyLabels}/g, context.vocabularyLabels.join(", "));
    text = text.replace(/{weakTags}/g, context.weakTags.join(", "));
    return text;
  }

  renderTemplateText(templateText: string, context: QuestTemplateRenderContext): string { return this.renderText(templateText, context); }
}
