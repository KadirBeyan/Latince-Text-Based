import type { PlayerSave, GeneratedQuest, ID, QuestTemplate } from "../types/gameTypes";
import { QuestTemplateEngine } from "../content/QuestTemplateEngine";
import { GeneratedSceneBuilder } from "../content/GeneratedSceneBuilder";
import { GeneratedContentValidator } from "../content/GeneratedContentValidator";
import { QuestRewardBalancer } from "./QuestRewardBalancer";
import type { LlmClient } from "../../llm/LlmClient";
import { buildGeneratedQuestDraftPrompt } from "../../llm/PromptBuilder";
import { sanitizeGeneratedQuestDraft } from "../../llm/LlmOutputGuard";
import { ContentLoader } from "../content/ContentLoader";
import { checkSceneLatin } from "../../latin/LatinGrammarGatekeeper";
import { generateExercises } from "../../latin/LatinExerciseGenerator";

export class DynamicQuestSystem {
  constructor(
    private readonly contentLoader: ContentLoader,
    private readonly templateEngine: QuestTemplateEngine,
    private readonly llmClient?: LlmClient
  ) {}

  async generateQuestFromSuggestion(save: PlayerSave, suggestionId: ID): Promise<GeneratedQuest> {
    const suggestion = save.activeSideQuestSuggestions?.find(s => s.id === suggestionId);
    if (!suggestion) throw new Error(`Side quest suggestion '${suggestionId}' was not found.`);
    
    // Get eligible templates scored for this player and suggestion context
    const currentLocationId = suggestion?.suggestedLocationId ?? suggestion?.locationId;
    const currentNpcId = suggestion?.suggestedNpcId ?? suggestion?.npcId;
    const eligible = this.templateEngine.getEligibleTemplates(save, { currentLocationId, currentNpcId });

    let template: QuestTemplate;
    if (eligible.length > 0) {
      template = eligible[0].template;
    } else {
      // Hard fallback if no template is eligible
      const allTemplates = this.contentLoader.getQuestTemplates().filter((candidate) => !(save.generatedQuests || []).some((quest) => (quest.status === "draft" || quest.status === "active") && quest.sourceTemplateId === candidate.id));
      template = allTemplates[0] || {
        id: "tmpl_fallback_greetings",
        titleTemplate: "Selamlaşma Pratiği",
        descriptionTemplate: "Temel selamlaşma kurallarını tekrar et.",
        category: "chapter-review",
        trigger: {},
        suggestedLocationId: "ludus_room",
        suggestedNpcId: "magister",
        difficulty: "intro",
        learningFocus: { grammarIds: ["greetings"], vocabularyIds: ["vocab-salve"], skillIds: ["latin_basics"] },
        scenePlan: [
          { role: "intro", inputMode: "choice", objectiveTemplate: "Selam ver." },
          { role: "resolution", inputMode: "choice", objectiveTemplate: "Ayrıl." }
        ],
        rewardProfile: "small",
        reasonTemplate: "Zayıf selamlaşma."
      };
    }

    let quest = await this.tryLlmGeneration(save, template);

    if (!quest) {
      // Deterministic fallback
      quest = GeneratedSceneBuilder.buildQuestFromTemplate(template, save, this.contentLoader, this.templateEngine);
      this.applyExerciseFallback(quest, template.learningFocus.grammarIds, template.learningFocus.vocabularyIds, [], template.difficulty);
      quest.metadata = {
        ...quest.metadata,
        generatedBy: "template"
      };
    }

    quest.sourceSuggestionId = suggestionId;
    quest.sourceTemplateId = template.id;

    return this.finalizeQuest(save, QuestRewardBalancer.balanceQuestRewards(quest, save.level));
  }

  async generateReviewQuest(
    save: PlayerSave,
    params: { grammarIds?: ID[]; vocabularyIds?: ID[]; errorTags?: string[] }
  ): Promise<GeneratedQuest> {
    const allTemplates = this.contentLoader.getQuestTemplates();
    
    // Score all templates
    const eligible = this.templateEngine.getEligibleTemplates(save);

    // Prioritize templates containing requested grammar or vocabulary
    let bestTemplate: QuestTemplate | undefined;
    if (params.grammarIds && params.grammarIds.length > 0) {
      const match = eligible.find(e => 
        e.template.learningFocus.grammarIds.some(gid => params.grammarIds!.includes(gid))
      );
      if (match) bestTemplate = match.template;
    }
    if (!bestTemplate && params.vocabularyIds && params.vocabularyIds.length > 0) {
      const match = eligible.find(e => 
        e.template.learningFocus.vocabularyIds.some(vid => params.vocabularyIds!.includes(vid))
      );
      if (match) bestTemplate = match.template;
    }
    if (!bestTemplate && eligible.length > 0) {
      bestTemplate = eligible[0].template;
    }
    if (!bestTemplate) bestTemplate = allTemplates.find((candidate) => !(save.generatedQuests || []).some((quest) => (quest.status === "draft" || quest.status === "active") && quest.sourceTemplateId === candidate.id));
    if (!bestTemplate) throw new Error("No eligible quest template is available for this review request.");

    let quest = await this.tryLlmGeneration(save, bestTemplate);

    if (!quest) {
      quest = GeneratedSceneBuilder.buildQuestFromTemplate(bestTemplate, save, this.contentLoader, this.templateEngine);
      this.applyExerciseFallback(quest, params.grammarIds || bestTemplate.learningFocus.grammarIds, params.vocabularyIds || bestTemplate.learningFocus.vocabularyIds, params.errorTags || [], bestTemplate.difficulty);
      quest.metadata = {
        ...quest.metadata,
        generatedBy: "template"
      };
    }

    quest.sourceTemplateId = bestTemplate.id;
    quest.metadata = {
      generatedBy: quest.metadata?.generatedBy ?? "template",
      relatedMasteryTargets: params.grammarIds || bestTemplate.learningFocus.grammarIds,
      relatedErrorTags: params.errorTags
    };

    return this.finalizeQuest(save, QuestRewardBalancer.balanceQuestRewards(quest, save.level));
  }

  async generateQuestFromTemplate(save: PlayerSave, template: QuestTemplate): Promise<GeneratedQuest> {
    const generated = await this.tryLlmGeneration(save, template) || GeneratedSceneBuilder.buildQuestFromTemplate(template, save, this.contentLoader, this.templateEngine);
    return this.finalizeQuest(save, QuestRewardBalancer.balanceQuestRewards(generated, save.level));
  }

  buildDeterministicQuestFromTemplate(save: PlayerSave, template: QuestTemplate): GeneratedQuest {
    return this.finalizeQuest(save, QuestRewardBalancer.balanceQuestRewards(GeneratedSceneBuilder.buildQuestFromTemplate(template, save, this.contentLoader, this.templateEngine), save.level));
  }

  async buildHybridQuestWithLlm(save: PlayerSave, template: QuestTemplate): Promise<GeneratedQuest> {
    const quest = await this.tryLlmGeneration(save, template);
    if (!quest) throw new Error("LLM quest draft failed validation.");
    return this.finalizeQuest(save, QuestRewardBalancer.balanceQuestRewards(quest, save.level));
  }

  private finalizeQuest(save: PlayerSave, quest: GeneratedQuest): GeneratedQuest {
    const validation = GeneratedContentValidator.validateGeneratedQuest(quest, this.contentLoader.getContent(), (save.generatedQuests || []).map((existing) => existing.id), { contentLoader: this.contentLoader, playerLevel: save.level, allowedGrammarIds: quest.learningFocus.grammarIds, knownVocabularyIds: quest.learningFocus.vocabularyIds });
    const finalized = { ...quest, validation };
    if (!validation.ok) throw new Error(`Generated quest failed validation: ${validation.errors.map((issue) => issue.message).join("; ")}`);
    return finalized;
  }

  private async tryLlmGeneration(save: PlayerSave, template: QuestTemplate): Promise<GeneratedQuest | null> {
    if (!this.llmClient) return null;

    try {
      // 1. Identify weak grammar and vocab
      const weakGrammarIds = template.learningFocus.grammarIds;
      const weakVocabularyIds = template.learningFocus.vocabularyIds;
      const errorTags: string[] = [];

      for (const err of save.errorMemory || []) {
        if (err.relatedGrammarIds.some(g => weakGrammarIds.includes(g))) {
          errorTags.push(err.tag);
        }
      }

      // 2. Build Chat prompt
      const messages = buildGeneratedQuestDraftPrompt({
        playerName: save.playerName,
        playerLevel: save.level,
        template: {
          titleTemplate: template.titleTemplate,
          descriptionTemplate: template.descriptionTemplate,
          suggestedLocationId: template.suggestedLocationId,
          suggestedNpcId: template.suggestedNpcId,
          difficulty: template.difficulty,
          scenePlan: template.scenePlan
        },
        weakGrammarIds,
        weakVocabularyIds,
        errorTags,
        weakMasteryTargets: (save.masteryStates || []).filter((state) => state.mastery < 0.6).map((state) => ({ targetId: state.targetId, targetType: state.targetType, mastery: state.mastery })),
        npcMemoryFacts: (save.npcMemories || []).filter((memory) => memory.npcId === template.suggestedNpcId).flatMap((memory) => memory.facts.slice(-3).map((fact) => fact.text)),
        npcRelationship: (save.npcMemories || []).find((memory) => memory.npcId === template.suggestedNpcId)?.relationship,
        locationState: (save.locationStates || []).find((state) => state.locationId === template.suggestedLocationId),
        worldEvents: (save.worldEvents || []).filter((event) => !event.expiresAt || Date.parse(event.expiresAt) > Date.now()).slice(0, 5),
        allowedGrammar: this.contentLoader.getContent().grammar.filter((topic) => weakGrammarIds.includes(topic.id)).map((topic) => ({ id: topic.id, label: topic.titleTr || topic.title })),
        allowedVocabulary: this.contentLoader.getContent().vocabulary.filter((item) => weakVocabularyIds.includes(item.id)).map((item) => ({ id: item.id, latin: item.latin })),
        allowedGrammarIds: weakGrammarIds,
        allowedVocabularyIds: weakVocabularyIds,
        knownVocabularyIds: weakVocabularyIds,
        playerLatinLevel: save.level <= 1 ? "A1" : save.level <= 3 ? "A2" : save.level <= 6 ? "B1" : "B2",
        maxLatinSentenceLength: save.level <= 1 ? 6 : 10,
        forbiddenGrammarHints: save.level <= 1 ? ["subjunctive", "participle", "ablative absolute", "relative clauses", "indirect statement"] : ["ablative absolute", "indirect statement"],
        difficultyTarget: template.difficulty
      });

      // 3. Call LLM
      const response = await this.llmClient.chat({
        messages,
        responseFormat: "json",
        temperature: 0.7
      });

      if (!response.text) return null;

      // 4. Parse & Sanitize
      const parsed = JSON.parse(response.text);
      const quest = sanitizeGeneratedQuestDraft(parsed, { contentLoader: this.contentLoader, playerLevel: save.level, allowedGrammarIds: weakGrammarIds, knownVocabularyIds: weakVocabularyIds, maxSentenceLength: save.level <= 1 ? 6 : 10, source: "generated-quest" });
      if (!quest) return null;

      // Inject template properties that LLM doesn't generate
      quest.difficulty = template.difficulty;
      quest.learningFocus = template.learningFocus;
      quest.locationId = template.suggestedLocationId;
      quest.npcIds = template.suggestedNpcId ? [template.suggestedNpcId] : [];
      quest.sourceTemplateId = template.id;

      // 5. Validate generated quest
      const latinGate = quest.scenes.map((scene) => checkSceneLatin({ scene, contentLoader: this.contentLoader, playerLevel: save.level, allowedGrammarIds: weakGrammarIds, knownVocabularyIds: weakVocabularyIds }));
      if (latinGate.some((gate) => !gate.ok)) {
        console.warn("LLM Generated quest failed Latin gate. Falling back to template.", latinGate.flatMap((gate) => gate.violations));
        return null;
      }

      const validation = GeneratedContentValidator.validateGeneratedQuest(quest, this.contentLoader.getContent(), [], { contentLoader: this.contentLoader, playerLevel: save.level, allowedGrammarIds: weakGrammarIds, knownVocabularyIds: weakVocabularyIds });
      quest.validation = validation;

      if (!validation.ok) {
        console.warn("LLM Generated quest failed validation. Falling back to template.", validation.errors);
        return null;
      }

      quest.metadata = {
        generatedBy: "hybrid",
        playerLevel: save.level,
        relatedMasteryTargets: weakGrammarIds
      };

      return quest;
    } catch (err) {
      console.error("Error generating quest via LLM, falling back to template:", err);
      return null;
    }
  }

  private applyExerciseFallback(quest: GeneratedQuest, grammarIds: ID[], vocabularyIds: ID[], errorTags: string[], difficulty: GeneratedQuest["difficulty"]): void {
    const exercises = generateExercises({ grammarIds, vocabularyIds, errorTags, count: quest.scenes.length, difficulty, contentLoader: this.contentLoader });
    let index = 0;
    for (const scene of quest.scenes) {
      if (!scene.textChallenge) continue;
      const exercise = exercises[index++ % Math.max(1, exercises.length)];
      if (!exercise) continue;
      scene.objective = exercise.promptTr;
      scene.textChallenge.prompt = exercise.promptTr;
      scene.textChallenge.expectedAnswers = exercise.expectedAnswers;
      scene.learningFocus = { grammarIds: exercise.grammarIds, vocabularyIds: exercise.vocabularyIds.length ? exercise.vocabularyIds : vocabularyIds, skillIds: quest.learningFocus.skillIds, difficulty };
    }
  }
}
