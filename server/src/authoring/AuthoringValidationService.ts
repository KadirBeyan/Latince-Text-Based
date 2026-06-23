import { ContentLoader } from "../game/content/ContentLoader";
import { ContentQualityAnalyzer } from "../game/content/ContentQualityAnalyzer";
import { ContentValidator } from "../game/content/ContentValidator";
import type { Campaign, Chapter, Quest, Scene, ValidationIssue } from "../game/types/gameTypes";
import type { LoadedContent } from "../game/types/contentTypes";
import { checkTextAgainstLevel } from "../latin/LatinGrammarGatekeeper";
import type { AuthoringContentKind, AuthoringDocument, AuthoringIssue, AuthoringMetrics, AuthoringValidationResult } from "./AuthoringTypes";

export class AuthoringValidationService {
  constructor(private readonly contentLoader = new ContentLoader()) {}

  validateAllContent(): AuthoringValidationResult {
    const content = this.contentLoader.load();
    const base = new ContentValidator().validate(content);
    const issues = [...base.errors, ...base.warnings].map((issue, index) => this.fromContentIssue(issue, index));
    const extra = this.validateLoadedContent(content);
    return this.result([...issues, ...extra]);
  }

  validateDocument(document: AuthoringDocument): AuthoringValidationResult {
    switch (document.kind) {
      case "scene": return this.validateScene(document.data as Scene);
      case "quest": return this.validateQuest(document.data as Quest);
      case "chapter": return this.validateChapter(document.data as Chapter);
      case "npc": return this.validateNpc(document.data);
      case "location": return this.validateLocation(document.data);
      case "grammar":
      case "vocabulary": return this.validateLatinData(document.data);
      case "assessment-question": return this.validateAssessmentQuestion(document.data);
      case "campaign": return this.validateCampaign(document.data as Campaign);
      default: return this.result([]);
    }
  }

  validateScene(scene: Scene): AuthoringValidationResult {
    const content = this.contentLoader.load();
    const sceneIds = new Set(content.campaigns.flatMap((c) => c.chapters).flatMap((c) => c.quests).flatMap((q) => q.scenes).map((s) => s.id));
    const locationIds = this.locationIds(content);
    const npcIds = new Set(content.npcs.map((npc) => npc.id));
    const grammarIds = new Set(content.grammar.map((item) => item.id));
    const vocabularyIds = new Set(content.vocabulary.map((item) => item.id));
    const skillIds = new Set(content.skills.map((item) => item.id));
    const issues: AuthoringIssue[] = [];
    const add = this.adder(issues, "scene", scene?.id);
    if (!scene?.id) add("error", "MISSING_ID", "Scene id zorunlu.", "id");
    if (!scene?.title?.trim()) add("error", "MISSING_TITLE", "Scene title/titleTr zorunlu.", "title");
    if (!scene?.description?.trim()) add("error", "MISSING_DESCRIPTION", "Scene description/descriptionTr zorunlu.", "description");
    if (scene?.locationId && !locationIds.has(scene.locationId)) add("error", "UNKNOWN_LOCATION", `locationId bulunamadi: ${scene.locationId}`, "locationId", [scene.locationId]);
    for (const id of scene?.npcIds ?? []) if (!npcIds.has(id)) add("error", "UNKNOWN_NPC", `NPC bulunamadi: ${id}`, "npcIds", [id]);
    if (!new Set(["choice", "text", "hybrid", "dialogue-response", "hybrid-dialogue"]).has(scene?.inputMode)) add("error", "INVALID_INPUT_MODE", "inputMode choice/text/hybrid/dialogue-response/hybrid-dialogue olmali.", "inputMode");
    if ((scene.inputMode === "text" || scene.inputMode === "hybrid") && !scene.textChallenge) add("error", "MISSING_TEXT_CHALLENGE", "Text/hybrid sahnede textChallenge gerekli.", "textChallenge");
    if (scene.inputMode === "dialogue-response" && !scene.dialogueChallenge) add("error", "MISSING_DIALOGUE_CHALLENGE", "Dialogue-response sahnede dialogueChallenge gerekli.", "dialogueChallenge");
    if (scene.inputMode === "hybrid-dialogue" && !scene.hybridDialogue) add("error", "MISSING_HYBRID_DIALOGUE", "Hybrid-dialogue sahnede hybridDialogue gerekli.", "hybridDialogue");

    if (scene.dialogueChallenge) {
      const dialogue = scene.dialogueChallenge;
      if (!dialogue.playerIntentTr?.trim()) add("error", "MISSING_PLAYER_INTENT", "Diyalog challenge playerIntentTr zorunlu.", "dialogueChallenge.playerIntentTr");
      if (!dialogue.targetMeaningTr?.trim()) add("error", "MISSING_TARGET_MEANING", "Diyalog challenge targetMeaningTr zorunlu.", "dialogueChallenge.targetMeaningTr");
      if (!dialogue.canonicalAnswers?.length) add("error", "MISSING_CANONICAL_ANSWERS", "Diyalog challenge canonicalAnswers en az bir eleman icermeli.", "dialogueChallenge.canonicalAnswers");
      if (dialogue.speakerNpcId && !npcIds.has(dialogue.speakerNpcId)) add("error", "UNKNOWN_NPC", `Hoparlor NPC bulunamadi: ${dialogue.speakerNpcId}`, "dialogueChallenge.speakerNpcId");
      if (dialogue.successNextSceneId && !sceneIds.has(dialogue.successNextSceneId)) add("error", "INVALID_NEXT_SCENE", `successNextSceneId bulunamadi: ${dialogue.successNextSceneId}`, "dialogueChallenge.successNextSceneId");
      if (dialogue.failureNextSceneId && !sceneIds.has(dialogue.failureNextSceneId)) add("error", "INVALID_NEXT_SCENE", `failureNextSceneId bulunamadi: ${dialogue.failureNextSceneId}`, "dialogueChallenge.failureNextSceneId");
      if (dialogue.evaluation && typeof dialogue.evaluation.minimumConfidence === "number" && (dialogue.evaluation.minimumConfidence < 0 || dialogue.evaluation.minimumConfidence > 1)) add("error", "INVALID_CONFIDENCE_THRESHOLD", "minimumConfidence 0 ile 1 arasinda olmali.", "dialogueChallenge.evaluation.minimumConfidence");
    }
    if (scene.hybridDialogue) {
      const hybrid = scene.hybridDialogue;
      if (hybrid.speakerNpcId && !npcIds.has(hybrid.speakerNpcId)) add("error", "UNKNOWN_NPC", `Hoparlor NPC bulunamadi: ${hybrid.speakerNpcId}`, "hybridDialogue.speakerNpcId");
      if (!hybrid.intents?.length) add("error", "MISSING_INTENTS", "Hybrid diyalog intents bos olamaz.", "hybridDialogue.intents");
      else {
        for (const [idx, intent] of hybrid.intents.entries()) {
          if (!intent.id) add("error", "MISSING_INTENT_ID", "Intent id zorunlu.", `hybridDialogue.intents.${idx}.id`);
          if (!intent.labelTr) add("error", "MISSING_INTENT_LABEL", "Intent labelTr zorunlu.", `hybridDialogue.intents.${idx}.labelTr`);
          if (!intent.targetMeaningTr) add("error", "MISSING_INTENT_MEANING", "Intent targetMeaningTr zorunlu.", `hybridDialogue.intents.${idx}.targetMeaningTr`);
          if (!intent.canonicalAnswers?.length) add("error", "MISSING_INTENT_ANSWERS", "Intent canonicalAnswers en az bir eleman icermeli.", `hybridDialogue.intents.${idx}.canonicalAnswers`);
        }
      }
    }

    if (scene.textChallenge && (!Array.isArray(scene.textChallenge.expectedAnswers) || scene.textChallenge.expectedAnswers.length === 0)) add("error", "MISSING_EXPECTED_ANSWERS", "expectedAnswers bos olamaz.", "textChallenge.expectedAnswers");
    if ((scene.inputMode === "choice" || scene.inputMode === "hybrid") && (!Array.isArray(scene.choices) || scene.choices.length === 0)) add("error", "MISSING_CHOICES", "Choice/hybrid sahnede en az bir choice gerekli.", "choices");
    const nextChecks: Array<{ id?: string; path: string }> = [
      { id: scene.successNextSceneId, path: "successNextSceneId" },
      { id: scene.failureNextSceneId, path: "failureNextSceneId" },
      { id: scene.textChallenge?.successNextSceneId, path: "textChallenge.successNextSceneId" },
      { id: scene.textChallenge?.failureNextSceneId, path: "textChallenge.failureNextSceneId" },
      { id: scene.dialogueChallenge?.successNextSceneId, path: "dialogueChallenge.successNextSceneId" },
      { id: scene.dialogueChallenge?.failureNextSceneId, path: "dialogueChallenge.failureNextSceneId" },
      ...(scene.choices ?? []).map((choice, index) => ({ id: choice.nextSceneId, path: `choices.${index}.nextSceneId` })),
    ];
    for (const item of nextChecks.filter((item) => item.id)) if (!sceneIds.has(item.id!)) add("error", "INVALID_NEXT_SCENE", `nextSceneId bulunamadi: ${item.id}`, item.path, [item.id!]);
    for (const id of scene.learningFocus?.grammarIds ?? []) if (!grammarIds.has(id)) add("error", "UNKNOWN_GRAMMAR", `Grammar id bulunamadi: ${id}`, "learningFocus.grammarIds", [id]);
    for (const id of scene.learningFocus?.vocabularyIds ?? []) if (!vocabularyIds.has(id)) add("error", "UNKNOWN_VOCABULARY", `Vocabulary id bulunamadi: ${id}`, "learningFocus.vocabularyIds", [id]);
    for (const id of scene.learningFocus?.skillIds ?? []) if (!skillIds.has(id)) add("error", "UNKNOWN_SKILL", `Skill id bulunamadi: ${id}`, "learningFocus.skillIds", [id]);
    for (const [index, effect] of (scene.effects ?? []).entries()) if (!effect?.type) add("error", "INVALID_EFFECT", "Effect type eksik.", `effects.${index}`);
    for (const [index, effect] of (scene.rewards ?? []).entries()) if ((effect.type === "ADD_XP" && effect.amount > 150) || (effect.type === "ADD_CURRENCY" && effect.amount > 100)) add("warning", "HIGH_REWARD", "Sahne odulu beklenenden yuksek.", `rewards.${index}`);
    for (const answer of scene.textChallenge?.expectedAnswers ?? []) {
      const gate = checkTextAgainstLevel({ text: answer, contentLoader: this.contentLoader, playerLevel: 1, allowedGrammarIds: scene.learningFocus?.grammarIds ?? [], knownVocabularyIds: scene.learningFocus?.vocabularyIds });
      if (!gate.ok) add("warning", "LATIN_GATE_WARNING", gate.violations.map((v) => v.messageTr).join(" ") || "Latince seviye kapisi uyarisi.", "textChallenge.expectedAnswers");
    }
    try {
      const report = new ContentQualityAnalyzer(this.contentLoader).analyzeScene(scene);
      for (const issue of report.issues) add(issue.severity, issue.code.toUpperCase(), issue.message, issue.path);
    } catch {
      add("info", "QUALITY_ANALYSIS_SKIPPED", "Latin kalite analizi bu sahne icin tamamlanamadi.", scene.id);
    }
    
    if (scene.interactionModel) {
      const model = scene.interactionModel;
      if (!model.intents || model.intents.length === 0) {
        add("error", "MISSING_INTENTS", "Interaction intents bos olamaz.", "interactionModel.intents");
      } else {
        const intentIds = new Set<string>();
        for (const [idx, intent] of model.intents.entries()) {
          const basePath = `interactionModel.intents.${idx}`;
          if (!intent.id) {
            add("error", "MISSING_INTENT_ID", "Intent id zorunlu.", `${basePath}.id`);
          } else {
            if (intentIds.has(intent.id)) {
              add("error", "DUPLICATE_INTENT_ID", `Duplicate intent id: ${intent.id}`, `${basePath}.id`);
            }
            intentIds.add(intent.id);
          }

          if (!intent.labelTr) {
            add("error", "MISSING_INTENT_LABEL", "Intent labelTr zorunlu.", `${basePath}.labelTr`);
          }

          if (!intent.verb) {
            add("error", "MISSING_INTENT_VERB", "Intent verb zorunlu.", `${basePath}.verb`);
          }

          if (intent.requiresLatin) {
            if (!intent.targetMeaningTr) {
              add("error", "MISSING_INTENT_MEANING", "requiresLatin true olan intent icin targetMeaningTr zorunlu.", `${basePath}.targetMeaningTr`);
            }
            if (!intent.canonicalAnswers || intent.canonicalAnswers.length === 0) {
              add("error", "MISSING_CANONICAL_ANSWERS", "requiresLatin true olan intent icin canonicalAnswers zorunlu.", `${basePath}.canonicalAnswers`);
            }
          } else {
            if (!intent.resolution && (!intent.effects || intent.effects.length === 0) && !intent.nextSceneId) {
              add("error", "MISSING_RESOLUTION_OR_EFFECT", "requiresLatin false olan intent icin resolution, effects veya nextSceneId en az biri olmali.", basePath);
            }
          }

          if (intent.successNextSceneId && !sceneIds.has(intent.successNextSceneId)) {
            add("error", "INVALID_NEXT_SCENE", `successNextSceneId bulunamadi: ${intent.successNextSceneId}`, `${basePath}.successNextSceneId`);
          }
          if (intent.failureNextSceneId && !sceneIds.has(intent.failureNextSceneId)) {
            add("error", "INVALID_NEXT_SCENE", `failureNextSceneId bulunamadi: ${intent.failureNextSceneId}`, `${basePath}.failureNextSceneId`);
          }
          if (intent.nextSceneId && !sceneIds.has(intent.nextSceneId)) {
            add("error", "INVALID_NEXT_SCENE", `nextSceneId bulunamadi: ${intent.nextSceneId}`, `${basePath}.nextSceneId`);
          }

          if (intent.failureBehavior === "branch" && !intent.failureNextSceneId && (!intent.failureBranches || intent.failureBranches.length === 0)) {
            add("error", "MISSING_FAILURE_BRANCH", "failureBehavior branch ise failureBranches veya failureNextSceneId olmali.", basePath);
          }
        }
      }
    }

    if (scene.dialogueSequence) {
      const seq = scene.dialogueSequence;
      if (!seq.turns || seq.turns.length === 0) {
        add("error", "EMPTY_DIALOGUE_SEQUENCE", "Dialogue sequence turns bos olamaz.", "dialogueSequence.turns");
      } else {
        for (const [tIdx, turn] of seq.turns.entries()) {
          const turnPath = `dialogueSequence.turns.${tIdx}`;
          if (!turn.speakerNpcId || !npcIds.has(turn.speakerNpcId)) {
            add("error", "UNKNOWN_NPC", `Turn NPC bulunamadi: ${turn.speakerNpcId}`, `${turnPath}.speakerNpcId`);
          }
          if (!turn.intents || turn.intents.length === 0) {
            add("error", "MISSING_INTENTS", "Turn intents bos olamaz.", `${turnPath}.intents`);
          } else {
            const intentIds = new Set<string>();
            for (const [idx, intent] of turn.intents.entries()) {
              const basePath = `${turnPath}.intents.${idx}`;
              if (!intent.id) {
                add("error", "MISSING_INTENT_ID", "Intent id zorunlu.", `${basePath}.id`);
              } else {
                if (intentIds.has(intent.id)) {
                  add("error", "DUPLICATE_INTENT_ID", `Duplicate intent id: ${intent.id}`, `${basePath}.id`);
                }
                intentIds.add(intent.id);
              }
              if (!intent.labelTr) {
                add("error", "MISSING_INTENT_LABEL", "Intent labelTr zorunlu.", `${basePath}.labelTr`);
              }
              if (intent.requiresLatin) {
                if (!intent.targetMeaningTr) {
                  add("error", "MISSING_INTENT_MEANING", "requiresLatin true olan intent icin targetMeaningTr zorunlu.", `${basePath}.targetMeaningTr`);
                }
                if (!intent.canonicalAnswers || intent.canonicalAnswers.length === 0) {
                  add("error", "MISSING_CANONICAL_ANSWERS", "requiresLatin true olan intent icin canonicalAnswers zorunlu.", `${basePath}.canonicalAnswers`);
                }
              }
            }
          }
        }
      }
      if (seq.completionNextSceneId && !sceneIds.has(seq.completionNextSceneId)) {
        add("error", "INVALID_NEXT_SCENE", `completionNextSceneId bulunamadi: ${seq.completionNextSceneId}`, "dialogueSequence.completionNextSceneId");
      }
    }

    if (scene.revisitVariants) {
      for (const [vIdx, variant] of scene.revisitVariants.entries()) {
        const variantPath = `revisitVariants.${vIdx}`;
        if (!variant.id) add("error", "MISSING_VARIANT_ID", "Revisit variant id zorunlu.", `${variantPath}.id`);
        if (!variant.conditions || variant.conditions.length === 0) {
          add("warning", "MISSING_VARIANT_CONDITIONS", "Revisit variant conditions bos olmamali.", `${variantPath}.conditions`);
        }
        if (variant.choicesOverride) {
          for (const [cIdx, choice] of variant.choicesOverride.entries()) {
            if (choice.nextSceneId && !sceneIds.has(choice.nextSceneId)) {
              add("error", "INVALID_NEXT_SCENE", `Revisit variant secenegindeki nextSceneId bulunamadi: ${choice.nextSceneId}`, `${variantPath}.choicesOverride.${cIdx}.nextSceneId`);
            }
          }
        }
      }
    }

    return this.result(issues);
  }

  validateQuest(quest: Quest): AuthoringValidationResult {
    const issues: AuthoringIssue[] = [];
    const add = this.adder(issues, "quest", quest?.id);
    if (!quest?.id) add("error", "MISSING_ID", "Quest id zorunlu.", "id");
    if (!quest?.title?.trim()) add("error", "MISSING_TITLE", "Quest title/titleTr zorunlu.", "title");
    const sceneIds = new Set((quest?.scenes ?? []).map((scene) => scene.id));
    if (!sceneIds.has(quest?.startSceneId)) add("error", "INVALID_START_SCENE", "startSceneId quest sahneleri icinde olmali.", "startSceneId", [quest?.startSceneId].filter(Boolean) as string[]);
    for (const scene of quest?.scenes ?? []) this.validateScene(scene).errors.concat(this.validateScene(scene).warnings).forEach((issue) => issues.push(issue));
    const reachable = this.reachableScenes(quest.startSceneId, quest.scenes ?? []);
    for (const scene of quest.scenes ?? []) if (!reachable.has(scene.id)) add("warning", "UNREACHABLE_SCENE", `Sahne startScene'den ulasilamaz: ${scene.id}`, `scenes.${scene.id}`, [scene.id]);
    return this.result(issues);
  }

  validateChapter(chapter: Chapter): AuthoringValidationResult {
    const issues: AuthoringIssue[] = [];
    const add = this.adder(issues, "chapter", chapter?.id);
    if (!chapter?.id) add("error", "MISSING_ID", "Chapter id zorunlu.", "id");
    if (!chapter?.title?.trim()) add("error", "MISSING_TITLE", "Chapter title/titleTr zorunlu.", "title");
    if (!chapter?.quests?.length) add("error", "NO_QUESTS", "Chapter en az bir quest icermeli.", "quests");
    const sceneIds = new Set((chapter?.quests ?? []).flatMap((quest) => quest.scenes).map((scene) => scene.id));
    const startScene = (chapter as Chapter & { startSceneId?: string }).startSceneId;
    if (startScene && !sceneIds.has(startScene)) add("error", "INVALID_CHAPTER_START_SCENE", "startSceneId chapter sahneleri icinde olmali.", "startSceneId", [startScene]);
    for (const quest of chapter?.quests ?? []) this.validateQuest(quest).errors.concat(this.validateQuest(quest).warnings).forEach((issue) => issues.push(issue));
    return this.result(issues);
  }

  validateCampaign(campaign: Campaign): AuthoringValidationResult {
    const issues: AuthoringIssue[] = [];
    const add = this.adder(issues, "campaign", campaign?.id);
    if (!campaign?.id) add("error", "MISSING_ID", "Campaign id zorunlu.", "id");
    if (!campaign?.title?.trim()) add("error", "MISSING_TITLE", "Campaign title zorunlu.", "title");
    if (!campaign?.chapters?.length) add("error", "NO_CHAPTERS", "Campaign en az bir chapter icermeli.", "chapters");
    if (!campaign?.chapters?.some((chapter) => chapter.id === campaign.startChapterId)) add("error", "INVALID_START_CHAPTER", "startChapterId campaign chapter listesinde olmali.", "startChapterId");
    return this.result(issues);
  }

  validateNpc(npc: any): AuthoringValidationResult {
    const content = this.contentLoader.load();
    const issues: AuthoringIssue[] = [];
    const add = this.adder(issues, "npc", npc?.id);
    if (!npc?.id) add("error", "MISSING_ID", "NPC id zorunlu.", "id");
    if (!npc?.name) add("error", "MISSING_NAME", "NPC name zorunlu.", "name");
    if (!npc?.role) add("warning", "MISSING_ROLE", "NPC role bos.", "role");
    if (npc?.defaultLocationId && !this.locationIds(content).has(npc.defaultLocationId)) add("error", "UNKNOWN_LOCATION", `defaultLocationId bulunamadi: ${npc.defaultLocationId}`, "defaultLocationId");
    return this.result(issues);
  }

  validateLocation(location: any): AuthoringValidationResult {
    const content = this.contentLoader.load();
    const locations = this.locationIds(content);
    const npcs = new Set(content.npcs.map((npc) => npc.id));
    const issues: AuthoringIssue[] = [];
    const add = this.adder(issues, "location", location?.id);
    if (!location?.id) add("error", "MISSING_ID", "Location id zorunlu.", "id");
    if (!location?.title && !location?.titleTr) add("error", "MISSING_TITLE", "Location title/titleTr zorunlu.", "title");
    for (const id of location?.connectedLocationIds ?? []) if (!locations.has(id)) add("error", "UNKNOWN_LOCATION", `Bagli lokasyon bulunamadi: ${id}`, "connectedLocationIds", [id]);
    for (const id of location?.defaultNpcIds ?? []) if (!npcs.has(id)) add("error", "UNKNOWN_NPC", `Varsayilan NPC bulunamadi: ${id}`, "defaultNpcIds", [id]);
    return this.result(issues);
  }

  validateLatinData(data: any): AuthoringValidationResult {
    const issues: AuthoringIssue[] = [];
    const add = this.adder(issues, data?.latin ? "vocabulary" : "grammar", data?.id);
    if (!data?.id) add("error", "MISSING_ID", "Latin data id zorunlu.", "id");
    if (data?.latin && !data?.principalParts) add("warning", "MISSING_PRINCIPAL_PARTS", "Vocabulary principalParts alani eksik.", "principalParts");
    if (!data?.latin && !Array.isArray(data?.examples)) add("warning", "MISSING_EXAMPLES", "Grammar examples alani olmali.", "examples");
    return this.result(issues);
  }

  validateAssessmentQuestion(question: any): AuthoringValidationResult {
    const content = this.contentLoader.load();
    const grammarIds = new Set(content.grammar.map((item) => item.id));
    const vocabularyIds = new Set(content.vocabulary.map((item) => item.id));
    const skillIds = new Set(content.skills.map((item) => item.id));
    const types = new Set(["multiple-choice", "latin-input", "translate-to-latin", "translate-to-turkish", "parse-word", "fill-blank"]);
    const issues: AuthoringIssue[] = [];
    const add = this.adder(issues, "assessment-question", question?.id);
    if (!question?.id) add("error", "MISSING_ID", "Assessment question id zorunlu.", "id");
    if (!types.has(question?.type)) add("error", "INVALID_TYPE", "Question type gecersiz.", "type");
    if (question?.type === "multiple-choice" && (!Array.isArray(question?.choices) || question.choices.length < 2)) add("error", "MISSING_CHOICES", "Multiple-choice icin en az iki secenek gerekli.", "choices");
    if (!Array.isArray(question?.expectedAnswers) || question.expectedAnswers.length === 0) add("error", "MISSING_EXPECTED_ANSWERS", "expectedAnswers gerekli.", "expectedAnswers");
    for (const id of question?.grammarIds ?? []) if (!grammarIds.has(id)) add("error", "UNKNOWN_GRAMMAR", `Grammar bulunamadi: ${id}`, "grammarIds", [id]);
    for (const id of question?.vocabularyIds ?? []) if (!vocabularyIds.has(id)) add("error", "UNKNOWN_VOCABULARY", `Vocabulary bulunamadi: ${id}`, "vocabularyIds", [id]);
    for (const id of question?.skillIds ?? []) if (!skillIds.has(id)) add("error", "UNKNOWN_SKILL", `Skill bulunamadi: ${id}`, "skillIds", [id]);
    return this.result(issues);
  }

  getMetrics(): AuthoringMetrics {
    const content = this.contentLoader.load();
    const validation = this.validateAllContent();
    const chapters = content.campaigns.flatMap((campaign) => campaign.chapters);
    const quests = chapters.flatMap((chapter) => chapter.quests);
    const scenes = quests.flatMap((quest) => quest.scenes);
    const issueCounts = new Map<string, number>();
    for (const issue of [...validation.errors, ...validation.warnings, ...validation.info]) issueCounts.set(issue.code, (issueCounts.get(issue.code) ?? 0) + 1);
    const difficultyDistribution: Record<string, number> = {};
    for (const scene of scenes) {
      const key = scene.learningFocus?.difficulty ?? "unset";
      difficultyDistribution[key] = (difficultyDistribution[key] ?? 0) + 1;
    }
    return {
      totals: { chapters: chapters.length, scenes: scenes.length, quests: quests.length, npcs: content.npcs.length, locations: this.locationIds(content).size, grammar: content.grammar.length, vocabulary: content.vocabulary.length },
      validationScore: validation.score,
      errors: validation.errors.length,
      warnings: validation.warnings.length,
      info: validation.info.length,
      difficultyDistribution,
      chapterScores: chapters.map((chapter) => {
        const result = this.validateChapter(chapter);
        return { chapterId: chapter.id, title: chapter.title, score: result.score, errors: result.errors.length, warnings: result.warnings.length };
      }),
      kindIssueCounts: [...validation.errors, ...validation.warnings].reduce<Record<string, number>>((acc, issue) => ({ ...acc, [issue.kind ?? "content"]: (acc[issue.kind ?? "content"] ?? 0) + 1 }), {}),
      topIssueCodes: [...issueCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([code, count]) => ({ code, count })),
      unusedVocabularyFocus: [],
      unrepresentedGrammarFocus: [],
    };
  }

  private validateLoadedContent(content: LoadedContent): AuthoringIssue[] {
    const issues: AuthoringIssue[] = [];
    const grammarIds = new Set(content.grammar.map((item) => item.id));
    const vocabIds = new Set(content.vocabulary.map((item) => item.id));
    if (grammarIds.size !== content.grammar.length) this.adder(issues, "grammar")("error", "DUPLICATE_GRAMMAR_ID", "Duplicate grammar id var.", "data/latin");
    if (vocabIds.size !== content.vocabulary.length) this.adder(issues, "vocabulary")("error", "DUPLICATE_VOCABULARY_ID", "Duplicate vocabulary id var.", "data/latin");
    return issues;
  }

  private reachableScenes(startSceneId: string, scenes: Scene[]): Set<string> {
    const byId = new Map(scenes.map((scene) => [scene.id, scene]));
    const seen = new Set<string>();
    const visit = (id?: string) => {
      if (!id || seen.has(id)) return;
      seen.add(id);
      const scene = byId.get(id);
      if (!scene) return;
      for (const next of [scene.successNextSceneId, scene.failureNextSceneId, scene.textChallenge?.successNextSceneId, scene.textChallenge?.failureNextSceneId, ...scene.choices.map((choice) => choice.nextSceneId)]) visit(next);
    };
    visit(startSceneId);
    return seen;
  }

  private locationIds(content: LoadedContent): Set<string> {
    return new Set(content.campaigns.flatMap((campaign) => campaign.chapters).flatMap((chapter) => chapter.quests).flatMap((quest) => quest.scenes).map((scene) => scene.locationId));
  }

  private fromContentIssue(issue: ValidationIssue, index: number): AuthoringIssue {
    return { id: `content-${index}-${issue.code}`, severity: issue.severity, code: issue.code, messageTr: issue.message, path: issue.path, relatedIds: issue.refId ? [issue.refId] : undefined };
  }

  private adder(issues: AuthoringIssue[], kind: AuthoringIssue["kind"], contentId?: string) {
    return (severity: AuthoringIssue["severity"], code: string, messageTr: string, issuePath?: string, relatedIds?: string[]) => {
      issues.push({ id: `${kind ?? "content"}-${contentId ?? "unknown"}-${code}-${issues.length}`, severity, code, messageTr, path: issuePath, contentId, kind, relatedIds });
    };
  }

  private result(issues: AuthoringIssue[]): AuthoringValidationResult {
    const errors = issues.filter((issue) => issue.severity === "error");
    const warnings = issues.filter((issue) => issue.severity === "warning");
    const info = issues.filter((issue) => issue.severity === "info");
    const score = Math.max(0, Math.min(100, 100 - errors.length * 18 - warnings.length * 6 - info.length));
    return { ok: errors.length === 0, errors, warnings, info, score };
  }
}
