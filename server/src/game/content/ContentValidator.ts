import type { Campaign, Condition, Effect, ID, Scene, ValidationIssue, ValidationResult } from "../types/gameTypes";
import type { LoadedContent } from "../types/contentTypes";
import fs from "node:fs";
import path from "node:path";
import { normalizeLatin } from "../../latin/LatinNormalizer";

export class ContentValidator {
  validate(content: LoadedContent): ValidationResult {
    const issues: ValidationIssue[] = [];
    const itemIds = new Set(content.items.map((item) => item.id));
    const skillIds = new Set(content.skills.map((skill) => skill.id));
    const npcIds = new Set(content.npcs.map((npc) => npc.id));
    const grammarIds = new Set(content.grammar.map((topic) => topic.id));
    const vocabularyIds = new Set(content.vocabulary.map((item) => item.id));

    const locationIds = new Set<ID>();
    for (const campaign of content.campaigns) {
      for (const chapter of campaign.chapters) {
        for (const quest of chapter.quests) {
          for (const scene of quest.scenes) {
            if (scene.locationId) {
              locationIds.add(scene.locationId);
            }
          }
        }
      }
    }

    this.addLocationFileIds(locationIds);

    const refs: RefSets = { itemIds, skillIds, npcIds, grammarIds, vocabularyIds, locationIds };

    for (const campaign of content.campaigns) {
      this.validateCampaign(campaign, refs, issues);
    }

    this.validateQuestTemplates(content, refs, issues);
    this.validateSideQuestTemplates(refs, issues);
    this.validateAssessmentContent(refs, issues);

    const errors = issues.filter((issue) => issue.severity === "error");
    const warnings = issues.filter((issue) => issue.severity === "warning");
    return { ok: errors.length === 0, errors, warnings };
  }

  validateCampaignDraft(campaign: Campaign, content: LoadedContent): ValidationResult {
    return this.validate({ ...content, campaigns: [campaign] });
  }

  private validateCampaign(campaign: Campaign, refs: RefSets, issues: ValidationIssue[]): void {
    const chapterIds = new Set(campaign.chapters.map((chapter) => chapter.id));
    if (!chapterIds.has(campaign.startChapterId)) this.push(issues, "error", "INVALID_START_CHAPTER", `campaigns.${campaign.id}.startChapterId`, `Missing start chapter ${campaign.startChapterId}.`, campaign.startChapterId);

    const questList = campaign.chapters.flatMap((chapter) => chapter.quests);
    const questIds = new Set(questList.map((quest) => quest.id));
    if (questIds.size !== questList.length) this.push(issues, "error", "DUPLICATE_QUEST_ID", `campaigns.${campaign.id}.quests`, "Quest ids must be unique within a campaign.");
    const sceneList = questList.flatMap((quest) => quest.scenes);
    const sceneIds = new Set(sceneList.map((scene) => scene.id));
    if (sceneIds.size !== sceneList.length) this.push(issues, "error", "DUPLICATE_SCENE_ID", `campaigns.${campaign.id}.scenes`, "Scene ids must be unique within a campaign.");
    const campaignStartSceneId = (campaign as Campaign & { startSceneId?: ID }).startSceneId;
    if (campaignStartSceneId && !sceneIds.has(campaignStartSceneId)) this.push(issues, "error", "INVALID_CAMPAIGN_START_SCENE", `campaigns.${campaign.id}.startSceneId`, `Missing campaign start scene ${campaignStartSceneId}.`, campaignStartSceneId);

    for (const chapter of campaign.chapters) {
      if (!chapter.quests.some((quest) => quest.id === chapter.startQuestId)) this.push(issues, "error", "INVALID_START_QUEST", `campaigns.${campaign.id}.chapters.${chapter.id}.startQuestId`, `Missing start quest ${chapter.startQuestId}.`, chapter.startQuestId);
      const chapterSceneIds = new Set(chapter.quests.flatMap((quest) => quest.scenes).map((scene) => scene.id));
      const chapterStartSceneId = (chapter as typeof chapter & { startSceneId?: ID }).startSceneId;
      if (chapterStartSceneId && !chapterSceneIds.has(chapterStartSceneId)) this.push(issues, "error", "INVALID_CHAPTER_START_SCENE", `campaigns.${campaign.id}.chapters.${chapter.id}.startSceneId`, `Missing chapter start scene ${chapterStartSceneId}.`, chapterStartSceneId);
      for (const quest of chapter.quests) {
        const ownSceneIds = new Set(quest.scenes.map((scene) => scene.id));
        if (!ownSceneIds.has(quest.startSceneId)) this.push(issues, "error", "INVALID_START_SCENE", `quests.${quest.id}.startSceneId`, `Missing start scene ${quest.startSceneId}.`, quest.startSceneId);
        this.validateConditions(quest.statusConditions, `quests.${quest.id}.statusConditions`, refs, questIds, sceneIds, issues);
        this.validateEffects(quest.rewards, `quests.${quest.id}.rewards`, refs, questIds, sceneIds, issues);
        for (const scene of quest.scenes) this.validateScene(scene, quest.id, refs, questIds, sceneIds, issues);
        this.validateGraph(quest.id, quest.startSceneId, quest.scenes, issues);
      }
    }
  }

  private validateScene(scene: Scene, questId: ID, refs: RefSets, questIds: Set<ID>, sceneIds: Set<ID>, issues: ValidationIssue[]): void {
    const base = `quests.${questId}.scenes.${scene.id}`;
    if (scene.locationId && !refs.locationIds.has(scene.locationId)) this.push(issues, "error", "UNKNOWN_LOCATION", `${base}.locationId`, `Unknown locationId ${scene.locationId}.`, scene.locationId);
    for (const npcId of scene.npcIds) if (!refs.npcIds.has(npcId)) this.push(issues, "error", "UNKNOWN_NPC", `${base}.npcIds`, `Unknown npcId ${npcId}.`, npcId);
    const focus = scene.learningFocus;
    if (focus) {
      for (const id of focus.grammarIds) if (!refs.grammarIds.has(id)) this.push(issues, "error", "UNKNOWN_GRAMMAR", `${base}.learningFocus.grammarIds`, `Unknown grammarId ${id}.`, id);
      for (const id of focus.vocabularyIds) if (!refs.vocabularyIds.has(id)) this.push(issues, "error", "UNKNOWN_VOCABULARY", `${base}.learningFocus.vocabularyIds`, `Unknown vocabularyId ${id}.`, id);
      for (const id of focus.skillIds) if (!refs.skillIds.has(id)) this.push(issues, "error", "UNKNOWN_SKILL", `${base}.learningFocus.skillIds`, `Unknown skillId ${id}.`, id);
    }
    const allowedInputModes = new Set(["choice", "text", "hybrid", "dialogue-response", "hybrid-dialogue"]);
    if (!allowedInputModes.has(scene.inputMode)) {
      this.push(issues, "error", "INVALID_INPUT_MODE", `${base}.inputMode`, "inputMode choice/text/hybrid/dialogue-response/hybrid-dialogue olmali.");
    }
    if ((scene.inputMode === "choice" || scene.inputMode === "hybrid") && (!Array.isArray(scene.choices) || scene.choices.length === 0)) this.push(issues, "error", "MISSING_CHOICES", `${base}.choices`, "Choice and hybrid scenes need at least one choice.");
    if ((scene.inputMode === "text" || scene.inputMode === "hybrid") && !scene.textChallenge) this.push(issues, "error", "MISSING_TEXT_CHALLENGE", `${base}.textChallenge`, "Text and hybrid scenes need a textChallenge.");
    if (scene.inputMode === "dialogue-response" && !scene.dialogueChallenge) this.push(issues, "error", "MISSING_DIALOGUE_CHALLENGE", `${base}.dialogueChallenge`, "dialogue-response scene needs a dialogueChallenge.");
    if (scene.inputMode === "hybrid-dialogue" && !scene.hybridDialogue) this.push(issues, "error", "MISSING_HYBRID_DIALOGUE", `${base}.hybridDialogue`, "hybrid-dialogue scene needs a hybridDialogue config.");

    if (scene.reviewTags && (scene.reviewTags.length === 0 || scene.reviewTags.some((tag) => !tag.trim()))) this.push(issues, "warning", "EMPTY_REVIEW_TAG", `${base}.reviewTags`, "reviewTags contains no usable tag.");
    this.validateSceneRef(scene.successNextSceneId, `${base}.successNextSceneId`, sceneIds, issues);
    this.validateSceneRef(scene.failureNextSceneId, `${base}.failureNextSceneId`, sceneIds, issues);
    this.validateConditions(scene.conditions || [], `${base}.conditions`, refs, questIds, sceneIds, issues);
    this.validateEffects([...(scene.effects || []), ...(scene.rewards || [])], `${base}.effects`, refs, questIds, sceneIds, issues);
    if (scene.revisitVariants) {
      for (const variant of scene.revisitVariants) {
        const variantBase = `${base}.revisitVariants.${variant.id}`;
        if (!variant.id) this.push(issues, "error", "MISSING_VARIANT_ID", variantBase, "Revisit variant is missing an ID.");
        this.validateConditions(variant.conditions || [], `${variantBase}.conditions`, refs, questIds, sceneIds, issues);
        if (variant.effects) {
          this.validateEffects(variant.effects, `${variantBase}.effects`, refs, questIds, sceneIds, issues);
        }
        if (variant.choicesOverride) {
          for (const choice of variant.choicesOverride) {
            this.validateSceneRef(choice.nextSceneId, `${variantBase}.choicesOverride.${choice.id}.nextSceneId`, sceneIds, issues);
            this.validateConditions(choice.conditions || [], `${variantBase}.choicesOverride.${choice.id}.conditions`, refs, questIds, sceneIds, issues);
            this.validateEffects(choice.effects || [], `${variantBase}.choicesOverride.${choice.id}.effects`, refs, questIds, sceneIds, issues);
          }
        }
      }
    }
    if ((scene as any).ambientTemplates) {
      for (let i = 0; i < (scene as any).ambientTemplates.length; i++) {
        const config = (scene as any).ambientTemplates[i];
        const ambientBase = `${base}.ambientTemplates[${i}]`;
        if (!config.templateId) {
          this.push(issues, "error", "MISSING_AMBIENT_TEMPLATE_ID", ambientBase, "Ambient config is missing templateId.");
        }
        if (config.conditions) {
          this.validateConditions(config.conditions, `${ambientBase}.conditions`, refs, questIds, sceneIds, issues);
        }
        if (config.effects) {
          this.validateEffects(config.effects, `${ambientBase}.effects`, refs, questIds, sceneIds, issues);
        }
      }
    }
    for (const choice of scene.choices || []) {
      this.validateSceneRef(choice.nextSceneId, `${base}.choices.${choice.id}.nextSceneId`, sceneIds, issues);
      this.validateConditions(choice.conditions || [], `${base}.choices.${choice.id}.conditions`, refs, questIds, sceneIds, issues);
      this.validateEffects(choice.effects || [], `${base}.choices.${choice.id}.effects`, refs, questIds, sceneIds, issues);
    }
    const challenge = scene.textChallenge;
    if (challenge) {
      if (!Array.isArray(challenge.expectedAnswers) || challenge.expectedAnswers.length === 0) this.push(issues, "error", "MISSING_EXPECTED_ANSWERS", `${base}.textChallenge.expectedAnswers`, "Text challenge needs at least one expected answer.");
      if (challenge.acceptedVariants !== undefined && !Array.isArray(challenge.acceptedVariants)) this.push(issues, "error", "INVALID_ACCEPTED_VARIANTS", `${base}.textChallenge.acceptedVariants`, "acceptedVariants must be an array.");
      this.validateSceneRef(challenge.successNextSceneId, `${base}.textChallenge.successNextSceneId`, sceneIds, issues);
      this.validateSceneRef(challenge.failureNextSceneId, `${base}.textChallenge.failureNextSceneId`, sceneIds, issues);
      this.validateEffects([...(challenge.successEffects || []), ...(challenge.failureEffects || [])], `${base}.textChallenge.effects`, refs, questIds, sceneIds, issues);
      const success = challenge.successNextSceneId ?? scene.successNextSceneId;
      const failure = challenge.failureNextSceneId ?? scene.failureNextSceneId;
      if (!success || !failure) this.push(issues, "warning", "TEXT_CHALLENGE_MISSING_PATH", `${base}.textChallenge`, "Text challenge should define both success and failure paths.");
    }

    const dialogue = scene.dialogueChallenge;
    if (dialogue) {
      if (!dialogue.playerIntentTr?.trim()) this.push(issues, "error", "MISSING_PLAYER_INTENT", `${base}.dialogueChallenge.playerIntentTr`, "Dialogue challenge needs playerIntentTr.");
      if (!dialogue.targetMeaningTr?.trim()) this.push(issues, "error", "MISSING_TARGET_MEANING", `${base}.dialogueChallenge.targetMeaningTr`, "Dialogue challenge needs targetMeaningTr.");
      if (!Array.isArray(dialogue.canonicalAnswers) || dialogue.canonicalAnswers.length === 0) {
        this.push(issues, "error", "MISSING_CANONICAL_ANSWERS", `${base}.dialogueChallenge.canonicalAnswers`, "Dialogue challenge needs at least one canonicalAnswer.");
      } else {
        const canonicalNorm = dialogue.canonicalAnswers.map(ans => normalizeLatin(ans));
        if (dialogue.acceptedVariants) {
          for (const variant of dialogue.acceptedVariants) {
            if (canonicalNorm.includes(normalizeLatin(variant))) {
              this.push(issues, "error", "CONFLICTING_VARIANT", `${base}.dialogueChallenge.acceptedVariants`, `Accepted variant "${variant}" is already in canonicalAnswers.`);
            }
          }
        }
        if (dialogue.rejectedMeanings) {
          const variantsNorm = (dialogue.acceptedVariants || []).map(ans => normalizeLatin(ans));
          for (const rej of dialogue.rejectedMeanings) {
            if (rej.exampleLatin) {
              const rNorm = normalizeLatin(rej.exampleLatin);
              if (canonicalNorm.includes(rNorm) || variantsNorm.includes(rNorm)) {
                this.push(issues, "error", "CONFLICTING_REJECTED_MEANING", `${base}.dialogueChallenge.rejectedMeanings`, `Rejected example "${rej.exampleLatin}" conflicts with canonical/accepted answers.`);
              }
            }
          }
        }
      }
      if (dialogue.speakerNpcId && !refs.npcIds.has(dialogue.speakerNpcId)) this.push(issues, "error", "UNKNOWN_NPC", `${base}.dialogueChallenge.speakerNpcId`, `Unknown speakerNpcId ${dialogue.speakerNpcId}.`);
      this.validateSceneRef(dialogue.successNextSceneId, `${base}.dialogueChallenge.successNextSceneId`, sceneIds, issues);
      this.validateSceneRef(dialogue.failureNextSceneId, `${base}.dialogueChallenge.failureNextSceneId`, sceneIds, issues);
      if (dialogue.successEffects) this.validateEffects(dialogue.successEffects, `${base}.dialogueChallenge.successEffects`, refs, questIds, sceneIds, issues);
      if (dialogue.failureEffects) this.validateEffects(dialogue.failureEffects, `${base}.dialogueChallenge.failureEffects`, refs, questIds, sceneIds, issues);
      const success = dialogue.successNextSceneId ?? scene.successNextSceneId;
      const failure = dialogue.failureNextSceneId ?? scene.failureNextSceneId;
      if (!success) this.push(issues, "warning", "DIALOGUE_CHALLENGE_MISSING_SUCCESS_PATH", `${base}.dialogueChallenge`, "Dialogue challenge should define a success path.");
      if (dialogue.retryAllowed === false && !failure) this.push(issues, "error", "DIALOGUE_CHALLENGE_MISSING_FAILURE_PATH", `${base}.dialogueChallenge`, "Dialogue challenge has retryAllowed=false but is missing a failure path.");
      if (dialogue.evaluation && typeof dialogue.evaluation.minimumConfidence === "number" && (dialogue.evaluation.minimumConfidence < 0 || dialogue.evaluation.minimumConfidence > 1)) {
        this.push(issues, "error", "INVALID_CONFIDENCE_THRESHOLD", `${base}.dialogueChallenge.evaluation.minimumConfidence`, "minimumConfidence must be between 0.0 and 1.0.");
      }
    }

    const hybrid = scene.hybridDialogue;
    if (hybrid) {
      if (hybrid.speakerNpcId && !refs.npcIds.has(hybrid.speakerNpcId)) this.push(issues, "error", "UNKNOWN_NPC", `${base}.hybridDialogue.speakerNpcId`, `Unknown speakerNpcId ${hybrid.speakerNpcId}.`);
      if (!Array.isArray(hybrid.intents) || hybrid.intents.length === 0) {
        this.push(issues, "error", "MISSING_INTENTS", `${base}.hybridDialogue.intents`, "hybridDialogue needs at least one intent.");
      } else {
        for (const [idx, intent] of hybrid.intents.entries()) {
          const intentBase = `${base}.hybridDialogue.intents.${idx}`;
          if (!intent.id) this.push(issues, "error", "MISSING_INTENT_ID", intentBase, "Intent needs id.");
          if (!intent.labelTr) this.push(issues, "error", "MISSING_INTENT_LABEL", intentBase, "Intent needs labelTr.");
          if (!intent.targetMeaningTr) this.push(issues, "error", "MISSING_INTENT_MEANING", intentBase, "Intent needs targetMeaningTr.");
          if (!Array.isArray(intent.canonicalAnswers) || intent.canonicalAnswers.length === 0) this.push(issues, "error", "MISSING_INTENT_ANSWERS", intentBase, "Intent needs canonicalAnswers.");
        }
      }
    }

    if (scene.interactionModel) {
      const model = scene.interactionModel;
      if (!model.intents || model.intents.length === 0) {
        this.push(issues, "error", "MISSING_INTENTS", `${base}.interactionModel.intents`, "Interaction intents bos olamaz.");
      } else {
        const intentIds = new Set<string>();
        for (const [idx, intent] of model.intents.entries()) {
          const basePath = `${base}.interactionModel.intents.${idx}`;
          if (!intent.id) {
            this.push(issues, "error", "MISSING_INTENT_ID", `${basePath}.id`, "Intent id zorunlu.");
          } else {
            if (intentIds.has(intent.id)) {
              this.push(issues, "error", "DUPLICATE_INTENT_ID", `${basePath}.id`, `Duplicate intent id: ${intent.id}`);
            }
            intentIds.add(intent.id);
          }

          if (!intent.labelTr) {
            this.push(issues, "error", "MISSING_INTENT_LABEL", `${basePath}.labelTr`, "Intent labelTr zorunlu.");
          }

          if (!intent.verb) {
            this.push(issues, "error", "MISSING_INTENT_VERB", `${basePath}.verb`, "Intent verb zorunlu.");
          }

          if (intent.requiresLatin) {
            if (!intent.targetMeaningTr) {
              this.push(issues, "error", "MISSING_INTENT_MEANING", `${basePath}.targetMeaningTr`, "requiresLatin true olan intent icin targetMeaningTr zorunlu.");
            }
            if (!intent.canonicalAnswers || intent.canonicalAnswers.length === 0) {
              this.push(issues, "error", "MISSING_CANONICAL_ANSWERS", `${basePath}.canonicalAnswers`, "requiresLatin true olan intent icin canonicalAnswers zorunlu.");
            }
          } else {
            if (!intent.resolution && (!intent.effects || intent.effects.length === 0) && !intent.nextSceneId) {
              this.push(issues, "error", "MISSING_RESOLUTION_OR_EFFECT", basePath, "requiresLatin false olan intent icin resolution, effects veya nextSceneId en az biri olmali.");
            }
          }

          if (intent.successNextSceneId && !sceneIds.has(intent.successNextSceneId)) {
            this.push(issues, "error", "INVALID_NEXT_SCENE", `${basePath}.successNextSceneId`, `successNextSceneId bulunamadi: ${intent.successNextSceneId}`);
          }
          if (intent.failureNextSceneId && !sceneIds.has(intent.failureNextSceneId)) {
            this.push(issues, "error", "INVALID_NEXT_SCENE", `${basePath}.failureNextSceneId`, `failureNextSceneId bulunamadi: ${intent.failureNextSceneId}`);
          }
          if (intent.nextSceneId && !sceneIds.has(intent.nextSceneId)) {
            this.push(issues, "error", "INVALID_NEXT_SCENE", `${basePath}.nextSceneId`, `nextSceneId bulunamadi: ${intent.nextSceneId}`);
          }

          if (intent.failureBehavior === "branch" && !intent.failureNextSceneId && (!intent.failureBranches || intent.failureBranches.length === 0)) {
            this.push(issues, "error", "MISSING_FAILURE_BRANCH", basePath, "failureBehavior branch ise failureBranches veya failureNextSceneId olmali.");
          }
        }
      }
    }

    if (scene.dialogueSequence) {
      const seq = scene.dialogueSequence;
      if (!seq.turns || seq.turns.length === 0) {
        this.push(issues, "error", "EMPTY_DIALOGUE_SEQUENCE", `${base}.dialogueSequence.turns`, "Dialogue sequence turns bos olamaz.");
      } else {
        for (const [tIdx, turn] of seq.turns.entries()) {
          const turnPath = `${base}.dialogueSequence.turns.${tIdx}`;
          if (!turn.speakerNpcId || !refs.npcIds.has(turn.speakerNpcId)) {
            this.push(issues, "error", "UNKNOWN_NPC", `${turnPath}.speakerNpcId`, `Turn NPC bulunamadi: ${turn.speakerNpcId}`);
          }
          if (!turn.intents || turn.intents.length === 0) {
            this.push(issues, "error", "MISSING_INTENTS", `${turnPath}.intents`, "Turn intents bos olamaz.");
          } else {
            const intentIds = new Set<string>();
            for (const [idx, intent] of turn.intents.entries()) {
              const basePath = `${turnPath}.intents.${idx}`;
              if (!intent.id) {
                this.push(issues, "error", "MISSING_INTENT_ID", `${basePath}.id`, "Intent id zorunlu.");
              } else {
                if (intentIds.has(intent.id)) {
                  this.push(issues, "error", "DUPLICATE_INTENT_ID", `${basePath}.id`, `Duplicate intent id: ${intent.id}`);
                }
                intentIds.add(intent.id);
              }
              if (!intent.labelTr) {
                this.push(issues, "error", "MISSING_INTENT_LABEL", `${basePath}.labelTr`, "Intent labelTr zorunlu.");
              }
              if (intent.requiresLatin) {
                if (!intent.targetMeaningTr) {
                  this.push(issues, "error", "MISSING_INTENT_MEANING", `${basePath}.targetMeaningTr`, "requiresLatin true olan intent icin targetMeaningTr zorunlu.");
                }
                if (!intent.canonicalAnswers || intent.canonicalAnswers.length === 0) {
                  this.push(issues, "error", "MISSING_CANONICAL_ANSWERS", `${basePath}.canonicalAnswers`, "requiresLatin true olan intent icin canonicalAnswers zorunlu.");
                }
              }
            }
          }
        }
      }
      if (seq.completionNextSceneId && !sceneIds.has(seq.completionNextSceneId)) {
        this.push(issues, "error", "INVALID_NEXT_SCENE", `${base}.dialogueSequence.completionNextSceneId`, `completionNextSceneId bulunamadi: ${seq.completionNextSceneId}`);
      }
    }
  }

  private validateGraph(questId: ID, startId: ID, scenes: Scene[], issues: ValidationIssue[]): void {
    const sceneById = new Map(scenes.map((scene) => [scene.id, scene]));
    const edges = new Map(scenes.map((scene) => [scene.id, this.sceneEdges(scene)]));
    const reachable = new Set<ID>();
    const visiting = new Set<ID>();
    const visited = new Set<ID>();
    const stack: ID[] = [];
    const reportedCycles = new Set<string>();
    const walk = (id: ID): void => {
      reachable.add(id);
      if (visiting.has(id)) return;
      if (visited.has(id)) return;
      visiting.add(id);
      stack.push(id);
      for (const edge of edges.get(id) ?? []) {
        if (!edges.has(edge.targetSceneId)) continue;
        if (visiting.has(edge.targetSceneId)) {
          const cycleStart = stack.indexOf(edge.targetSceneId);
          const cyclePath = [...stack.slice(Math.max(cycleStart, 0)), edge.targetSceneId];
          const cycleKey = cyclePath.join("->");
          if (!reportedCycles.has(cycleKey)) {
            reportedCycles.add(cycleKey);
            this.pushCycleIssue(questId, edge, cyclePath, sceneById, issues);
          }
          continue;
        }
        walk(edge.targetSceneId);
      }
      stack.pop();
      visiting.delete(id);
      visited.add(id);
    };
    walk(startId);
    for (const scene of scenes) if (!reachable.has(scene.id)) this.push(issues, "warning", "UNREACHABLE_SCENE", `quests.${questId}.scenes.${scene.id}`, `Scene ${scene.id} is unreachable from ${startId}.`, scene.id);
  }

  private sceneEdges(scene: Scene): SceneGraphEdge[] {
    return [
      this.edge(scene, "scene.successNextSceneId", scene.successNextSceneId, scene),
      this.edge(scene, "scene.failureNextSceneId", scene.failureNextSceneId, scene),
      ...scene.choices.map((choice) => this.edge(scene, `choice.${choice.id}`, choice.nextSceneId, choice, choice.conditions)),
      this.edge(scene, "textChallenge.successNextSceneId", scene.textChallenge?.successNextSceneId, scene.textChallenge ?? undefined),
      this.edge(scene, "textChallenge.failureNextSceneId", scene.textChallenge?.failureNextSceneId, scene.textChallenge ?? undefined),
      this.edge(scene, "dialogueChallenge.successNextSceneId", scene.dialogueChallenge?.successNextSceneId, scene.dialogueChallenge ?? undefined),
      this.edge(scene, "dialogueChallenge.failureNextSceneId", scene.dialogueChallenge?.failureNextSceneId, scene.dialogueChallenge ?? undefined),
    ].filter((edge): edge is SceneGraphEdge => Boolean(edge));
  }

  private edge(sourceScene: Scene, transitionId: string, targetSceneId?: ID, metadata?: CycleMetadata, conditions?: Condition[]): SceneGraphEdge | undefined {
    if (!targetSceneId) return undefined;
    return {
      sourceSceneId: sourceScene.id,
      targetSceneId,
      transitionId,
      conditions: conditions && conditions.length > 0 ? JSON.stringify(conditions) : undefined,
      intentional: Boolean(metadata?.allowCycle || metadata?.intentionalCycle || sourceScene.allowCycle || sourceScene.intentionalCycle),
      loopPurpose: metadata?.loopPurpose || sourceScene.loopPurpose,
    };
  }

  private pushCycleIssue(questId: ID, edge: SceneGraphEdge, cyclePath: ID[], sceneById: Map<ID, Scene>, issues: ValidationIssue[]): void {
    const targetScene = sceneById.get(edge.targetSceneId);
    const intentional = edge.intentional || Boolean(targetScene?.allowCycle || targetScene?.intentionalCycle);
    const loopPurpose = edge.loopPurpose || targetScene?.loopPurpose;
    const conditionText = edge.conditions ? ` condition=${edge.conditions}` : "";
    const purposeText = intentional ? ` intentional=true${loopPurpose ? ` loopPurpose=${loopPurpose}` : ""}` : " intentional=false";
    this.push(
      issues,
      "warning",
      "SCENE_GRAPH_CYCLE",
      `quests.${questId}.scenes.${edge.sourceSceneId}`,
      `Quest ${questId} scene graph cycle: path=${cyclePath.join(" -> ")} source=${edge.sourceSceneId} target=${edge.targetSceneId} transition=${edge.transitionId}${conditionText}${purposeText}.`,
      edge.targetSceneId,
    );
    if (intentional && !loopPurpose?.trim()) {
      this.push(issues, "warning", "SCENE_GRAPH_CYCLE_MISSING_PURPOSE", `quests.${questId}.scenes.${edge.sourceSceneId}`, "Intentional cycle should explain loopPurpose", edge.targetSceneId);
    }
  }

  private validateConditions(conditions: Condition[], path: string, refs: RefSets, questIds: Set<ID>, sceneIds: Set<ID>, issues: ValidationIssue[]): void {
    for (const condition of conditions) {
      if (condition.type === "HAS_ITEM" && !refs.itemIds.has(condition.itemId)) this.push(issues, "error", "UNKNOWN_ITEM", path, `Unknown itemId ${condition.itemId}.`, condition.itemId);
      if (condition.type === "HAS_SKILL" && !refs.skillIds.has(condition.skillId)) this.push(issues, "error", "UNKNOWN_SKILL", path, `Unknown skillId ${condition.skillId}.`, condition.skillId);
      if (condition.type === "QUEST_STATUS" && !questIds.has(condition.questId)) this.push(issues, "error", "UNKNOWN_QUEST", path, `Unknown questId ${condition.questId}.`, condition.questId);
      if ((condition.type === "SCENE_VISITED" || condition.type === "SCENE_COMPLETED") && !sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId}.`, condition.sceneId);
      if (condition.type === "NPC_RELATION_MIN" && !refs.npcIds.has(condition.npcId)) this.push(issues, "error", "UNKNOWN_NPC", path, `Unknown npcId ${condition.npcId} in NPC_RELATION_MIN condition.`, condition.npcId);
      if (condition.type === "NPC_MEMORY_HAS_TAG" && !refs.npcIds.has(condition.npcId)) this.push(issues, "error", "UNKNOWN_NPC", path, `Unknown npcId ${condition.npcId} in NPC_MEMORY_HAS_TAG condition.`, condition.npcId);
      if (condition.type === "LOCATION_DISCOVERED" && !refs.locationIds.has(condition.locationId)) this.push(issues, "error", "UNKNOWN_LOCATION", path, `Unknown locationId ${condition.locationId} in LOCATION_DISCOVERED condition.`, condition.locationId);
      if (condition.type === "LOCATION_FLAG_EQUALS" && !refs.locationIds.has(condition.locationId)) this.push(issues, "error", "UNKNOWN_LOCATION", path, `Unknown locationId ${condition.locationId} in LOCATION_FLAG_EQUALS condition.`, condition.locationId);
      if (condition.type === "SCENE_VISIT_COUNT_MIN" && !sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId} in SCENE_VISIT_COUNT_MIN condition.`, condition.sceneId);
      if (condition.type === "SCENE_LOCAL_FLAG_EQUALS" && !sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId} in SCENE_LOCAL_FLAG_EQUALS condition.`, condition.sceneId);
      if (condition.type === "SCENE_INTENT_RESOLVED" && !sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId} in SCENE_INTENT_RESOLVED condition.`, condition.sceneId);
      if (condition.type === "SCENE_INSPECTED" && !sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId} in SCENE_INSPECTED condition.`, condition.sceneId);
      if (condition.type === "SCENE_LISTENED" && !sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId} in SCENE_LISTENED condition.`, condition.sceneId);
      if (condition.type === "SCENE_READ" && !sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId} in SCENE_READ condition.`, condition.sceneId);
      if (condition.type === "SCENE_CLUE_DISCOVERED" && !sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId} in SCENE_CLUE_DISCOVERED condition.`, condition.sceneId);
      if (condition.type === "SCENE_VOCAB_DISCOVERED") {
        if (!sceneIds.has(condition.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${condition.sceneId} in SCENE_VOCAB_DISCOVERED condition.`, condition.sceneId);
        if (!refs.vocabularyIds.has(condition.vocabularyId)) this.push(issues, "error", "UNKNOWN_VOCABULARY", path, `Unknown vocabularyId ${condition.vocabularyId} in SCENE_VOCAB_DISCOVERED condition.`, condition.vocabularyId);
      }
      if (condition.type === "NPC_INTERACTION_COUNT_MIN" && !refs.npcIds.has(condition.npcId)) this.push(issues, "error", "UNKNOWN_NPC", path, `Unknown npcId ${condition.npcId} in NPC_INTERACTION_COUNT_MIN condition.`, condition.npcId);
    }
  }

  private validateEffects(effects: Effect[], path: string, refs: RefSets, questIds: Set<ID>, sceneIds: Set<ID>, issues: ValidationIssue[]): void {
    for (const effect of effects) {
      if ((effect.type === "ADD_ITEM" || effect.type === "REMOVE_ITEM") && !refs.itemIds.has(effect.itemId)) this.push(issues, "error", "UNKNOWN_ITEM", path, `Unknown itemId ${effect.itemId}.`, effect.itemId);
      if ((effect.type === "UNLOCK_SKILL" || effect.type === "INCREMENT_SKILL") && !refs.skillIds.has(effect.skillId)) this.push(issues, "error", "UNKNOWN_SKILL", path, `Unknown skillId ${effect.skillId}.`, effect.skillId);
      if ((effect.type === "START_QUEST" || effect.type === "COMPLETE_QUEST" || effect.type === "FAIL_QUEST") && !questIds.has(effect.questId)) this.push(issues, "error", "UNKNOWN_QUEST", path, `Unknown questId ${effect.questId}.`, effect.questId);
      if (effect.type === "GO_TO_SCENE" && !sceneIds.has(effect.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${effect.sceneId}.`, effect.sceneId);
      if (effect.type === "APPLY_REWARD_BUNDLE") {
        if ((effect.reward.xp ?? 0) > 500 || (effect.reward.currency ?? 0) > 250) this.push(issues, "warning", "HIGH_REWARD_BUNDLE", path, "Reward bundle is unusually high.");
        for (const item of effect.reward.items ?? []) if (!refs.itemIds.has(item.itemId)) this.push(issues,"error","UNKNOWN_ITEM",path,`Unknown itemId ${item.itemId}.`,item.itemId);
        for (const skill of effect.reward.skillIncrements ?? []) if (!refs.skillIds.has(skill.skillId)) this.push(issues,"error","UNKNOWN_SKILL",path,`Unknown skillId ${skill.skillId}.`,skill.skillId);
        for (const target of effect.reward.masteryTargets ?? []) { if(target.targetType==="grammar"&&!refs.grammarIds.has(target.targetId))this.push(issues,"error","UNKNOWN_GRAMMAR",path,`Unknown grammarId ${target.targetId}.`,target.targetId); if(target.targetType==="vocabulary"&&!refs.vocabularyIds.has(target.targetId))this.push(issues,"error","UNKNOWN_VOCABULARY",path,`Unknown vocabularyId ${target.targetId}.`,target.targetId); }
      }
      if (effect.type === "ADD_NPC_MEMORY" && !refs.npcIds.has(effect.npcId)) this.push(issues, "error", "UNKNOWN_NPC", path, `Unknown npcId ${effect.npcId} in ADD_NPC_MEMORY effect.`, effect.npcId);
      if (effect.type === "UPDATE_NPC_RELATIONSHIP" && !refs.npcIds.has(effect.npcId)) this.push(issues, "error", "UNKNOWN_NPC", path, `Unknown npcId ${effect.npcId} in UPDATE_NPC_RELATIONSHIP effect.`, effect.npcId);
      if (effect.type === "DISCOVER_LOCATION" && !refs.locationIds.has(effect.locationId)) this.push(issues, "error", "UNKNOWN_LOCATION", path, `Unknown locationId ${effect.locationId} in DISCOVER_LOCATION effect.`, effect.locationId);
      if (effect.type === "SET_LOCATION_FLAG" && !refs.locationIds.has(effect.locationId)) this.push(issues, "error", "UNKNOWN_LOCATION", path, `Unknown locationId ${effect.locationId} in SET_LOCATION_FLAG effect.`, effect.locationId);
      if (effect.type === "SET_LOCATION_MOOD" && !refs.locationIds.has(effect.locationId)) this.push(issues, "error", "UNKNOWN_LOCATION", path, `Unknown locationId ${effect.locationId} in SET_LOCATION_MOOD effect.`, effect.locationId);
      if (effect.type === "ADD_WORLD_EVENT") {
        const ev = effect.event;
        if (ev.relatedNpcId && !refs.npcIds.has(ev.relatedNpcId)) this.push(issues, "error", "UNKNOWN_NPC", path, `Unknown relatedNpcId ${ev.relatedNpcId} in ADD_WORLD_EVENT effect.`, ev.relatedNpcId);
        if (ev.relatedLocationId && !refs.locationIds.has(ev.relatedLocationId)) this.push(issues, "error", "UNKNOWN_LOCATION", path, `Unknown relatedLocationId ${ev.relatedLocationId} in ADD_WORLD_EVENT effect.`, ev.relatedLocationId);
        if (ev.relatedQuestId && !questIds.has(ev.relatedQuestId)) this.push(issues, "error", "UNKNOWN_QUEST", path, `Unknown relatedQuestId ${ev.relatedQuestId} in ADD_WORLD_EVENT effect.`, ev.relatedQuestId);
      }
      if (effect.type === "SET_SCENE_LOCAL_FLAG" && !sceneIds.has(effect.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${effect.sceneId} in SET_SCENE_LOCAL_FLAG effect.`, effect.sceneId);
      if (effect.type === "ADD_SCENE_CLUE" && !sceneIds.has(effect.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${effect.sceneId} in ADD_SCENE_CLUE effect.`, effect.sceneId);
      if (effect.type === "MARK_SCENE_INSPECTED") {
        if (!sceneIds.has(effect.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${effect.sceneId} in MARK_SCENE_INSPECTED effect.`, effect.sceneId);
        for (const vocabId of effect.vocabularyIds ?? []) if (!refs.vocabularyIds.has(vocabId)) this.push(issues, "error", "UNKNOWN_VOCABULARY", path, `Unknown vocabularyId ${vocabId} in MARK_SCENE_INSPECTED effect.`, vocabId);
        for (const gramId of effect.grammarIds ?? []) if (!refs.grammarIds.has(gramId)) this.push(issues, "error", "UNKNOWN_GRAMMAR", path, `Unknown grammarId ${gramId} in MARK_SCENE_INSPECTED effect.`, gramId);
      }
      if (effect.type === "MARK_SCENE_LISTENED") {
        if (!sceneIds.has(effect.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${effect.sceneId} in MARK_SCENE_LISTENED effect.`, effect.sceneId);
        for (const vocabId of effect.vocabularyIds ?? []) if (!refs.vocabularyIds.has(vocabId)) this.push(issues, "error", "UNKNOWN_VOCABULARY", path, `Unknown vocabularyId ${vocabId} in MARK_SCENE_LISTENED effect.`, vocabId);
        for (const gramId of effect.grammarIds ?? []) if (!refs.grammarIds.has(gramId)) this.push(issues, "error", "UNKNOWN_GRAMMAR", path, `Unknown grammarId ${gramId} in MARK_SCENE_LISTENED effect.`, gramId);
      }
      if (effect.type === "MARK_SCENE_READ") {
        if (!sceneIds.has(effect.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${effect.sceneId} in MARK_SCENE_READ effect.`, effect.sceneId);
        for (const vocabId of effect.vocabularyIds ?? []) if (!refs.vocabularyIds.has(vocabId)) this.push(issues, "error", "UNKNOWN_VOCABULARY", path, `Unknown vocabularyId ${vocabId} in MARK_SCENE_READ effect.`, vocabId);
        for (const gramId of effect.grammarIds ?? []) if (!refs.grammarIds.has(gramId)) this.push(issues, "error", "UNKNOWN_GRAMMAR", path, `Unknown grammarId ${gramId} in MARK_SCENE_READ effect.`, gramId);
      }
      if (effect.type === "ADD_SCENE_DISCOVERED_VOCAB") {
        if (!sceneIds.has(effect.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${effect.sceneId} in ADD_SCENE_DISCOVERED_VOCAB effect.`, effect.sceneId);
        if (!refs.vocabularyIds.has(effect.vocabularyId)) this.push(issues, "error", "UNKNOWN_VOCABULARY", path, `Unknown vocabularyId ${effect.vocabularyId} in ADD_SCENE_DISCOVERED_VOCAB effect.`, effect.vocabularyId);
      }
      if (effect.type === "ADD_SCENE_DISCOVERED_GRAMMAR") {
        if (!sceneIds.has(effect.sceneId)) this.push(issues, "error", "UNKNOWN_SCENE", path, `Unknown sceneId ${effect.sceneId} in ADD_SCENE_DISCOVERED_GRAMMAR effect.`, effect.sceneId);
        if (!refs.grammarIds.has(effect.grammarId)) this.push(issues, "error", "UNKNOWN_GRAMMAR", path, `Unknown grammarId ${effect.grammarId} in ADD_SCENE_DISCOVERED_GRAMMAR effect.`, effect.grammarId);
      }
      if (effect.type === "INCREMENT_NPC_INTERACTION_COUNT" && !refs.npcIds.has(effect.npcId)) this.push(issues, "error", "UNKNOWN_NPC", path, `Unknown npcId ${effect.npcId} in INCREMENT_NPC_INTERACTION_COUNT effect.`, effect.npcId);
    }
  }

  private addLocationFileIds(locationIds: Set<ID>): void {
    const dir = path.resolve(process.cwd(), "data", "locations");
    if (!fs.existsSync(dir)) return;
    for (const file of fs.readdirSync(dir).filter((candidate) => candidate.endsWith(".json"))) {
      try {
        const value = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as { id?: ID };
        if (value.id) locationIds.add(value.id);
      } catch {
        // Location parse errors are caught by JSON/content tests; ignore here to keep validation focused.
      }
    }
  }

  private validateSceneRef(id: ID | undefined, path: string, sceneIds: Set<ID>, issues: ValidationIssue[]): void {
    if (id && !sceneIds.has(id)) this.push(issues, "error", "INVALID_NEXT_SCENE", path, `Unknown sceneId ${id}.`, id);
  }

  private validateAssessmentContent(refs: RefSets, issues: ValidationIssue[]): void {
    const dir = path.resolve(process.cwd(), "data", "assessment");
    const bankPath = path.join(dir, "question-bank.json");
    const achievementPath = path.join(dir, "achievements.json");
    const levels = new Set(["A0", "A1", "A2", "B1", "B2"]);
    const difficulties = new Set(["intro", "practice", "review", "challenge"]);
    const types = new Set(["multiple-choice", "latin-input", "translate-to-latin", "translate-to-turkish", "parse-word", "fill-blank"]);
    if (fs.existsSync(bankPath)) {
      try {
        const questions = JSON.parse(fs.readFileSync(bankPath, "utf8")) as any[];
        const ids = new Set<string>();
        questions.forEach((question, index) => {
          const base = "assessment.questions[" + index + "] (" + (question.id || "no-id") + ")";
          if (!question.id || ids.has(question.id)) this.push(issues, "error", "DUPLICATE_ASSESSMENT_QUESTION", base + ".id", "Assessment question id is missing or duplicated.", question.id);
          ids.add(question.id);
          if (!types.has(question.type)) this.push(issues, "error", "INVALID_ASSESSMENT_TYPE", base + ".type", "Invalid question type " + question.type + ".");
          if (!levels.has(question.level)) this.push(issues, "error", "INVALID_ASSESSMENT_LEVEL", base + ".level", "Invalid level " + question.level + ".");
          if (!difficulties.has(question.difficulty)) this.push(issues, "error", "INVALID_ASSESSMENT_DIFFICULTY", base + ".difficulty", "Invalid difficulty " + question.difficulty + ".");
          if (["multiple-choice", "latin-input", "translate-to-latin", "translate-to-turkish", "parse-word", "fill-blank"].includes(question.type) && (!Array.isArray(question.expectedAnswers) || question.expectedAnswers.length === 0)) this.push(issues, "error", "MISSING_ASSESSMENT_EXPECTED", base + ".expectedAnswers", "Assessment question needs expectedAnswers.");
          if (question.type === "multiple-choice" && (!Array.isArray(question.choices) || question.choices.length < 2)) this.push(issues, "error", "MISSING_ASSESSMENT_CHOICES", base + ".choices", "Multiple-choice question needs at least two choices.");
          for (const id of question.grammarIds ?? []) if (!refs.grammarIds.has(id)) this.push(issues, "error", "UNKNOWN_GRAMMAR", base + ".grammarIds", "Unknown grammarId " + id + ".", id);
          for (const id of question.vocabularyIds ?? []) if (!refs.vocabularyIds.has(id)) this.push(issues, "error", "UNKNOWN_VOCABULARY", base + ".vocabularyIds", "Unknown vocabularyId " + id + ".", id);
          for (const id of question.skillIds ?? []) if (!refs.skillIds.has(id)) this.push(issues, "error", "UNKNOWN_SKILL", base + ".skillIds", "Unknown skillId " + id + ".", id);
        });
      } catch (error) { this.push(issues, "error", "ASSESSMENT_BANK_INVALID", "data/assessment/question-bank.json", error instanceof Error ? error.message : "Could not parse assessment question bank."); }
    }
    if (fs.existsSync(achievementPath)) {
      try {
        const achievements = JSON.parse(fs.readFileSync(achievementPath, "utf8")) as any[];
        const ids = new Set<string>();
        achievements.forEach((achievement, index) => { if (!achievement.id || ids.has(achievement.id)) this.push(issues, "error", "DUPLICATE_ACHIEVEMENT", "assessment.achievements[" + index + "].id", "Achievement id is missing or duplicated.", achievement.id); ids.add(achievement.id); if (!achievement.title || !achievement.description) this.push(issues, "error", "INVALID_ACHIEVEMENT", "assessment.achievements[" + index + "]", "Achievement needs title and description."); });
      } catch (error) { this.push(issues, "error", "ACHIEVEMENTS_INVALID", "data/assessment/achievements.json", error instanceof Error ? error.message : "Could not parse achievements."); }
    }
  }

  private push(issues: ValidationIssue[], severity: "error" | "warning", code: string, path: string, message: string, refId?: string): void {
    issues.push({ severity, code, path, message, refId });
  }

  private validateQuestTemplates(content: LoadedContent, refs: RefSets, issues: ValidationIssue[]): void {
    const ids = new Set<ID>();
    const rewardProfiles = new Set(["small", "normal", "review", "challenge"]);
    const categories = new Set(["chapter-review", "npc-favor", "location-rumor", "grammar-remediation", "vocabulary-practice", "review", "grammar-practice", "npc-relationship", "location-event"]);
    for (let index = 0; index < content.questTemplates.length; index++) {
      const template = content.questTemplates[index];
      const base = `questTemplates[${index}] (${template.id || "no-id"})`;
      if (!template.id || ids.has(template.id)) this.push(issues, "error", "DUPLICATE_TEMPLATE_ID", `${base}.id`, `Quest template id '${template.id}' is missing or duplicated.`, template.id);
      ids.add(template.id);
      if (!categories.has(template.category)) this.push(issues, "error", "INVALID_TEMPLATE_CATEGORY", `${base}.category`, `Invalid template category '${template.category}'.`);
      if (!refs.locationIds.has(template.suggestedLocationId)) this.push(issues, "error", "UNKNOWN_LOCATION", `${base}.suggestedLocationId`, `Unknown locationId ${template.suggestedLocationId}.`, template.suggestedLocationId);
      if (template.suggestedNpcId && !refs.npcIds.has(template.suggestedNpcId)) this.push(issues, "error", "UNKNOWN_NPC", `${base}.suggestedNpcId`, `Unknown npcId ${template.suggestedNpcId}.`, template.suggestedNpcId);
      if (!Array.isArray(template.scenePlan) || template.scenePlan.length < 2) this.push(issues, "error", "INVALID_SCENE_PLAN", `${base}.scenePlan`, "Quest template must define at least two scene plan entries.");
      if (!rewardProfiles.has(template.rewardProfile)) this.push(issues, "error", "INVALID_REWARD_PROFILE", `${base}.rewardProfile`, `Invalid rewardProfile '${template.rewardProfile}'.`);
      for (const id of [...(template.trigger.weakGrammarIds || []), ...template.learningFocus.grammarIds]) if (!refs.grammarIds.has(id)) this.push(issues, "error", "UNKNOWN_GRAMMAR", base, `Unknown grammarId ${id}.`, id);
      for (const id of [...(template.trigger.weakVocabularyIds || []), ...template.learningFocus.vocabularyIds]) if (!refs.vocabularyIds.has(id)) this.push(issues, "error", "UNKNOWN_VOCABULARY", base, `Unknown vocabularyId ${id}.`, id);
      for (const id of template.learningFocus.skillIds) if (!refs.skillIds.has(id)) this.push(issues, "error", "UNKNOWN_SKILL", base, `Unknown skillId ${id}.`, id);
      if (template.trigger.npcId && !refs.npcIds.has(template.trigger.npcId)) this.push(issues, "error", "UNKNOWN_NPC", `${base}.trigger.npcId`, `Unknown npcId ${template.trigger.npcId}.`, template.trigger.npcId);
      if (template.trigger.locationId && !refs.locationIds.has(template.trigger.locationId)) this.push(issues, "error", "UNKNOWN_LOCATION", `${base}.trigger.locationId`, `Unknown locationId ${template.trigger.locationId}.`, template.trigger.locationId);
      if (template.trigger.relationshipMin && !refs.npcIds.has(template.trigger.relationshipMin.npcId)) this.push(issues, "error", "UNKNOWN_NPC", `${base}.trigger.relationshipMin`, `Unknown npcId ${template.trigger.relationshipMin.npcId}.`, template.trigger.relationshipMin.npcId);
      for (let sceneIndex = 0; sceneIndex < (template.scenePlan || []).length; sceneIndex++) {
        const plan = template.scenePlan[sceneIndex];
        if (!plan.objectiveTemplate?.trim()) this.push(issues, "error", "MISSING_OBJECTIVE", `${base}.scenePlan[${sceneIndex}]`, "Scene plan objectiveTemplate is required.");
        if ((plan.inputMode === "text" || plan.inputMode === "hybrid") && (!plan.expectedAnswerTemplates || plan.expectedAnswerTemplates.length === 0)) this.push(issues, "error", "MISSING_EXPECTED_ANSWERS", `${base}.scenePlan[${sceneIndex}]`, "Text and hybrid scene plans require expectedAnswerTemplates.");
      }
    }
  }

  private validateSideQuestTemplates(refs: RefSets, issues: ValidationIssue[]): void {
    const fs = require("node:fs");
    const path = require("node:path");
    const filePath = path.resolve(process.cwd(), "data", "side-quest-templates.json");
    if (!fs.existsSync(filePath)) {
      return;
    }
    try {
      const templates = JSON.parse(fs.readFileSync(filePath, "utf8")) as any[];
      for (let i = 0; i < templates.length; i++) {
        const t = templates[i];
        const base = `sideQuestTemplates[${i}] (${t.id || "no-id"})`;
        if (t.suggestedNpcId && !refs.npcIds.has(t.suggestedNpcId)) {
          this.push(issues, "warning", "UNKNOWN_NPC", `${base}.suggestedNpcId`, `Unknown npcId ${t.suggestedNpcId} in side quest template.`, t.suggestedNpcId);
        }
        if (t.suggestedLocationId && !refs.locationIds.has(t.suggestedLocationId)) {
          this.push(issues, "warning", "UNKNOWN_LOCATION", `${base}.suggestedLocationId`, `Unknown locationId ${t.suggestedLocationId} in side quest template.`, t.suggestedLocationId);
        }
        if (t.learningFocus?.grammarIds) {
          for (const gid of t.learningFocus.grammarIds) {
            if (!refs.grammarIds.has(gid)) {
              this.push(issues, "warning", "UNKNOWN_GRAMMAR", `${base}.learningFocus.grammarIds`, `Unknown grammarId ${gid} in side quest template.`, gid);
            }
          }
        }
        if (t.learningFocus?.vocabularyIds) {
          for (const vid of t.learningFocus.vocabularyIds) {
            if (!refs.vocabularyIds.has(vid)) {
              this.push(issues, "warning", "UNKNOWN_VOCABULARY", `${base}.learningFocus.vocabularyIds`, `Unknown vocabularyId ${vid} in side quest template.`, vid);
            }
          }
        }
        if (t.trigger?.weakGrammarIds) {
          for (const gid of t.trigger.weakGrammarIds) {
            if (!refs.grammarIds.has(gid)) {
              this.push(issues, "warning", "UNKNOWN_GRAMMAR", `${base}.trigger.weakGrammarIds`, `Unknown grammarId ${gid} in side quest template.`, gid);
            }
          }
        }
        if (t.trigger?.weakVocabularyIds) {
          for (const vid of t.trigger.weakVocabularyIds) {
            if (!refs.vocabularyIds.has(vid)) {
              this.push(issues, "warning", "UNKNOWN_VOCABULARY", `${base}.trigger.weakVocabularyIds`, `Unknown vocabularyId ${vid} in side quest template.`, vid);
            }
          }
        }
      }
    } catch (e: any) {
      this.push(issues, "warning", "SIDE_QUEST_TEMPLATES_CORRUPT", "side-quest-templates.json", `Could not parse side quest templates: ${e.message}`);
    }
  }
}

interface RefSets {
  itemIds: Set<ID>;
  skillIds: Set<ID>;
  npcIds: Set<ID>;
  grammarIds: Set<ID>;
  vocabularyIds: Set<ID>;
  locationIds: Set<ID>;
}

interface CycleMetadata {
  allowCycle?: boolean;
  intentionalCycle?: boolean;
  loopPurpose?: string;
}

interface SceneGraphEdge {
  sourceSceneId: ID;
  targetSceneId: ID;
  transitionId: string;
  conditions?: string;
  intentional: boolean;
  loopPurpose?: string;
}
