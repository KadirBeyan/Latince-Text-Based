import type { PlayerSave, Scene, TextChallenge, DialogueResponseChallenge, ActiveInteractionState } from "../types/gameTypes";
import { ContentLoader } from "../content/ContentLoader";
import { EffectRunner } from "../core/EffectRunner";
import { EventBus } from "../core/EventBus";
import { RuleEngine } from "../core/RuleEngine";
import type { LlmClient } from "../../llm/LlmClient";
import { evaluateTextChallenge } from "../../latin/LatinEvaluator";
import { evaluateDialogueResponse } from "../../latin/SemanticLatinEvaluator";
import { NpcDialogueSystem } from "./NpcDialogueSystem";
import { DialogueSystem } from "./DialogueSystem";
import { ErrorMemorySystem } from "./ErrorMemorySystem";
import { MasterySystem } from "./MasterySystem";
import { LocationStateSystem } from "./LocationStateSystem";
import { NpcMemorySystem } from "./NpcMemorySystem";
import { NpcRelationshipSystem } from "./NpcRelationshipSystem";
import { WorldEventSystem } from "./WorldEventSystem";
import { GeneratedContentSystem } from "./GeneratedContentSystem";
import { LivingSceneSystem } from "./LivingSceneSystem";

export class SceneSystem {
  private readonly dialogueSystem = new DialogueSystem();
  private readonly npcDialogueSystem: NpcDialogueSystem;
  private readonly errorMemorySystem = new ErrorMemorySystem();
  private readonly masterySystem = new MasterySystem();

  constructor(
    private readonly contentLoader: ContentLoader,
    private readonly ruleEngine: RuleEngine,
    private readonly effectRunner: EffectRunner,
    private readonly eventBus: EventBus
  ) {
    this.npcDialogueSystem = new NpcDialogueSystem(this.contentLoader);
  }

  enterScene(save: PlayerSave, sceneId: string): PlayerSave {
    const scene = this.requireScene(save, sceneId);
    if (!this.ruleEngine.canEnterScene(save, scene)) {
      throw new Error(`Conditions are not met for scene ${sceneId}.`);
    }
    let moved = this.moveToScene(save, sceneId);
    moved = new LivingSceneSystem().onSceneEnter({
      save: moved,
      sceneId: scene.id,
      eventBus: this.eventBus
    });

    // Initialize active interaction state
    const activeInteraction: ActiveInteractionState = {
      sceneId: scene.id,
      resolvedIntentIds: [],
      attempts: {},
      ...(scene.dialogueSequence ? { activeTurnIndex: 0 } : {})
    };
    moved = { ...moved, activeInteraction };
    
    // Stage 6: Location visiting and NPC memory touch
    if (scene.locationId) {
      moved = new LocationStateSystem().recordVisit({ save: moved, locationId: scene.locationId, eventBus: this.eventBus });
    }
    if (scene.npcIds && Array.isArray(scene.npcIds)) {
      for (const npcId of scene.npcIds) {
        moved = new NpcMemorySystem().ensureNpcMemory(moved, npcId);
      }
    }

    const isFirstVisit = !save.visitedSceneIds.includes(sceneId);
    let visited = this.markSceneVisited(moved, sceneId);

    // Stage 6: First-visit rumor and enter events gating
    if (isFirstVisit) {
      const rumor = new WorldEventSystem().generateDeterministicRumor({ save: visited, locationId: scene.locationId });
      if (rumor) {
        visited = new WorldEventSystem().addWorldEvent({ save: visited, event: rumor, eventBus: this.eventBus });
      }
    }

    const withEnterEvents = isFirstVisit
      ? scene.onEnterEvents.reduce((current, event) => this.eventBus.emit(current, event.type, event.payload), visited)
      : visited;

    const exposed = scene.learningFocus ? this.masterySystem.recordExposure({ save: withEnterEvents, targets: [...scene.learningFocus.grammarIds.map(targetId=>({targetId,targetType:"grammar" as const})), ...scene.learningFocus.vocabularyIds.map(targetId=>({targetId,targetType:"vocabulary" as const})), ...scene.learningFocus.skillIds.map(targetId=>({targetId,targetType:"skill" as const}))] }) : withEnterEvents;
    
    // Stage 6: Emit SCENE_ENTERED event with rich payload
    const exposedWithEntered = this.eventBus.emit(exposed, "SCENE_ENTERED", {
      sceneId: scene.id,
      locationId: scene.locationId,
      npcIds: scene.npcIds
    });

    return this.effectRunner.applyEffects(exposedWithEntered, scene.effects, this.contextFor(exposedWithEntered));
  }

  markSceneVisited(save: PlayerSave, sceneId: string): PlayerSave {
    if (save.visitedSceneIds.includes(sceneId)) {
      return save;
    }
    return { ...save, visitedSceneIds: [...save.visitedSceneIds, sceneId] };
  }

  markSceneCompleted(save: PlayerSave, sceneId: string): PlayerSave {
    if (save.completedSceneIds.includes(sceneId)) {
      return save;
    }
    return { ...save, completedSceneIds: [...save.completedSceneIds, sceneId] };
  }

  resolveChoice(save: PlayerSave, choiceId: string): PlayerSave {
    const scene = this.requireScene(save, save.currentSceneId);
    const choice = this.ruleEngine.getAvailableChoices(save, scene).find((candidate) => candidate.id === choiceId);
    if (!choice) {
      throw new Error(`Choice ${choiceId} is not available in scene ${scene.id}.`);
    }

    if (scene.inputMode === "hybrid-dialogue" && scene.hybridDialogue) {
      const intent = scene.hybridDialogue.intents.find(i => i.id === choiceId);
      if (intent) {
        const nextSave = {
          ...save,
          narrativeFlags: {
            ...save.narrativeFlags,
            [`selected_intent_${scene.id}`]: choiceId,
          },
        };
        return this.eventBus.emit(nextSave, "action.choice_selected", {
          choiceId,
          sceneId: scene.id,
          label: intent.labelTr,
          npcIds: scene.npcIds,
          locationId: scene.locationId
        });
      }
    }

    let nextSave = this.effectRunner.applyEffects(save, choice.effects || [], this.contextFor(save));
    nextSave = this.markSceneCompleted(nextSave, scene.id);
    nextSave = this.effectRunner.applyEffects(nextSave, scene.rewards || [], this.contextFor(nextSave));
    if (choice.nextSceneId) {
      nextSave = this.enterScene(nextSave, choice.nextSceneId);
    }
    return this.eventBus.emit(nextSave, "action.choice_selected", { 
      choiceId, 
      sceneId: scene.id,
      label: choice.label,
      npcIds: scene.npcIds,
      locationId: scene.locationId
    });
  }

  async resolveTextChallenge(save: PlayerSave, text: string, llmClient?: LlmClient): Promise<PlayerSave> {
    const scene = this.requireCurrentScene(save);

    if (save.activeInteraction?.selectedIntentId) {
      return this.resolveIntentTextChallenge(save, text, llmClient);
    }

    // Dialogue Challenge flow
    const dialogueChallenge = scene.dialogueChallenge || (scene.inputMode === "hybrid-dialogue" && scene.hybridDialogue ? (() => {
      const selectedIntentId = save.narrativeFlags[`selected_intent_${scene.id}`];
      if (!selectedIntentId) return null;
      const intent = scene.hybridDialogue.intents.find(i => i.id === selectedIntentId);
      if (!intent) return null;
      return {
        mode: "dialogue-response" as const,
        speakerNpcId: scene.hybridDialogue.speakerNpcId,
        npcPromptLatin: scene.hybridDialogue.npcPromptLatin,
        npcPromptTr: scene.hybridDialogue.npcPromptTr,
        playerIntentTr: intent.labelTr,
        targetMeaningTr: intent.targetMeaningTr,
        canonicalAnswers: intent.canonicalAnswers,
        grammarFocusIds: intent.grammarFocusIds,
        vocabularyFocusIds: intent.vocabularyFocusIds,
        successNextSceneId: scene.successNextSceneId,
        failureNextSceneId: scene.failureNextSceneId,
        retryAllowed: true,
        maxAttempts: 3,
        evaluation: {
          allowEquivalentMeaning: true,
          allowWordOrderVariation: true,
          requireContextMatch: true,
          useLlmSemanticJudge: true,
          minimumConfidence: 0.5
        }
      } as DialogueResponseChallenge;
    })() : null);

    if (dialogueChallenge) {
      const sceneContext = {
        sceneId: scene.id,
        titleTr: scene.title,
        locationId: scene.locationId,
        npcIds: scene.npcIds,
        previousDialogue: save.dialogueLog,
      };

      const playerContext = {
        level: save.level,
        assessmentLevel: save.assessmentProfile?.estimatedLevel || "A0",
        knownGrammarIds: save.masteryStates.filter(s => s.targetType === "grammar" && s.mastery >= 50).map(s => s.targetId),
        knownVocabularyIds: save.masteryStates.filter(s => s.targetType === "vocabulary" && s.mastery >= 50).map(s => s.targetId),
      };

      const llmConfig = (llmClient as any)?.config;

      const evaluation = await evaluateDialogueResponse({
        answer: text,
        challenge: dialogueChallenge,
        sceneContext,
        playerContext,
        llmConfig,
      });

      const isCorrect = evaluation.acceptedAsCorrect;
      let nextSceneId = isCorrect
        ? dialogueChallenge.successNextSceneId || scene.successNextSceneId
        : dialogueChallenge.failureNextSceneId || scene.failureNextSceneId;

      const attemptsKey = `dialogue_attempts_${scene.id}`;
      const attempts = (save.flags[attemptsKey] as number || 0) + 1;
      let nextSave = { ...save };
      nextSave.flags[attemptsKey] = attempts;

      if (!isCorrect) {
        const retryAllowed = dialogueChallenge.retryAllowed !== false;
        const maxAttempts = dialogueChallenge.maxAttempts ?? 3;
        if (retryAllowed && attempts < maxAttempts) {
          nextSceneId = undefined; // Stay on the same scene
        }
      }

      const effects = isCorrect
        ? dialogueChallenge.successEffects || []
        : dialogueChallenge.failureEffects || [];

      nextSave = this.effectRunner.applyEffects(nextSave, effects, this.contextFor(nextSave));
      const errorTags = evaluation.errors.filter(e => e.severity === "error").map(e => e.code);
      nextSave = this.errorMemorySystem.record(nextSave, errorTags, scene);

      const mockEvaluation = {
        isCorrect,
        score: isCorrect ? (evaluation.verdict === "exact_correct" ? 100 : 85) : 0,
        mode: evaluation.debug?.source || "fallback",
        feedbackTr: evaluation.feedbackTr,
        correctedLatin: evaluation.matchedCanonicalAnswer || dialogueChallenge.canonicalAnswers[0],
        errorTags,
        grammarNotes: evaluation.grammarNoteTr ? [evaluation.grammarNoteTr] : [],
        vocabularyNotes: evaluation.vocabularyNoteTr ? [evaluation.vocabularyNoteTr] : [],
        confidence: evaluation.confidence,
      };

      const beforeMastery = new Map(nextSave.masteryStates.map(state => [`${state.targetType}:${state.targetId}`, state.mastery]));
      nextSave = this.masterySystem.recordEvaluation({ save: nextSave, evaluation: mockEvaluation as any, scene });
      const focusGrammar = scene.learningFocus?.grammarIds || [];
      const focusVocab = scene.learningFocus?.vocabularyIds || [];
      const focusSkill = scene.learningFocus?.skillIds || [];
      for (const state of nextSave.masteryStates) {
        const before = beforeMastery.get(`${state.targetType}:${state.targetId}`);
        const isFocused = (state.targetType === "grammar" && focusGrammar.includes(state.targetId)) ||
                          (state.targetType === "vocabulary" && focusVocab.includes(state.targetId)) ||
                          (state.targetType === "skill" && focusSkill.includes(state.targetId));
        if (before !== state.mastery || (isFocused && before === undefined)) {
          nextSave = this.eventBus.emit(nextSave, "MASTERY_UPDATED", { targetId: state.targetId, targetType: state.targetType, before, after: state.mastery });
        }
      }

      // Update NPC Memory and relationships
      if (scene.npcIds && scene.npcIds.length > 0) {
        const relationshipSystem = new NpcRelationshipSystem();
        const memorySystem = new NpcMemorySystem();

        for (const npcId of scene.npcIds) {
          if (isCorrect) {
            nextSave = relationshipSystem.updateRelationship({
              save: nextSave,
              npcId,
              delta: { familiarity: 1, respect: npcId === "magister" ? 2 : 1 },
              reason: "Doğru diyalog cevabı verdi.",
              eventBus: this.eventBus
            });
            nextSave = memorySystem.addNpcMemoryFact({
              save: nextSave,
              npcId,
              text: `Öğrenci bu sahnede doğru diyalog cevabı verdi: ${text.slice(0, 60)}`,
              importance: 30,
              relatedSceneId: scene.id,
              relatedQuestId: nextSave.currentQuestId,
              tags: ["correct-answer"],
              eventBus: this.eventBus
            });
          } else {
            nextSave = relationshipSystem.updateRelationship({
              save: nextSave,
              npcId,
              delta: { familiarity: 1 },
              reason: "Yanlış diyalog cevabı verdi.",
              eventBus: this.eventBus
            });
            nextSave = memorySystem.addNpcMemoryFact({
              save: nextSave,
              npcId,
              text: `Öğrenci bu sahnede diyalog cevabında zorlandı.`,
              importance: 40,
              relatedSceneId: scene.id,
              relatedQuestId: nextSave.currentQuestId,
              tags: ["struggled"],
              eventBus: this.eventBus
            });
          }
        }
      }

      if (isCorrect) {
        nextSave = this.markSceneCompleted(nextSave, scene.id);
        nextSave = this.effectRunner.applyEffects(nextSave, scene.rewards || [], this.contextFor(nextSave));
      }

      // Event log updates
      nextSave = this.eventBus.emit(nextSave, "DIALOGUE_RESPONSE_EVALUATED", {
        sceneId: scene.id,
        npcId: dialogueChallenge.speakerNpcId || scene.npcIds[0] || "system",
        verdict: evaluation.verdict,
        acceptedAsCorrect: isCorrect,
        confidence: evaluation.confidence,
        answer: text,
        targetMeaningTr: dialogueChallenge.targetMeaningTr,
        feedbackTr: evaluation.feedbackTr,
        errors: evaluation.errors,
        meaningMatches: evaluation.meaningMatches,
        grammarOk: evaluation.grammarOk,
        contextOk: evaluation.contextOk,
        levelAppropriate: evaluation.levelAppropriate,
        normalizedAnswer: evaluation.normalizedAnswer,
        matchedCanonicalAnswer: evaluation.matchedCanonicalAnswer,
        matchedVariant: evaluation.matchedVariant,
        detectedMeaningTr: evaluation.detectedMeaningTr,
        grammarNoteTr: evaluation.grammarNoteTr,
        vocabularyNoteTr: evaluation.vocabularyNoteTr,
        contextNoteTr: evaluation.contextNoteTr,
        npcReaction: evaluation.npcReaction,
        transitionSceneId: nextSceneId,
      });

      // Dialogue log updates (player answer and system/NPC reply)
      nextSave = this.dialogueSystem.addDialogue(nextSave, "player", text, "la");
      if (evaluation.feedbackTr) {
        nextSave = this.dialogueSystem.addDialogue(nextSave, "system", evaluation.feedbackTr, "tr");
      }

      const reaction = evaluation.npcReaction;
      const npcId = dialogueChallenge.speakerNpcId || scene.npcIds[0] || "system";
      if (reaction?.npcLineLatin) {
        nextSave = this.dialogueSystem.addDialogue(nextSave, npcId, reaction.npcLineLatin, "la");
        if (reaction.npcLineTr) {
          nextSave = this.dialogueSystem.addDialogue(nextSave, npcId, `(${reaction.npcLineTr})`, "tr");
        }
      }

      if (nextSceneId) {
        nextSave = this.enterScene(nextSave, nextSceneId);
      }

      return nextSave;
    }

    // Default Text Challenge flow
    if (!scene.textChallenge) {
      throw new Error(`Scene ${scene.id} does not have a text challenge.`);
    }
    const challenge = scene.textChallenge;

    // Evaluate answer via LatinEvaluator
    const evaluation = await evaluateTextChallenge({
      playerAnswer: text,
      expectedAnswers: [...challenge.expectedAnswers, ...(challenge.acceptedVariants ?? [])],
      prompt: challenge.prompt,
      sceneId: scene.id,
      questId: save.currentQuestId,
      playerLevel: save.level,
      unlockedSkills: save.skills.filter((s) => s.unlocked).map((s) => s.skillId),
      context: { strictness: challenge.strictness, evaluationMode: challenge.evaluationMode },
      llmClient: challenge.evaluationMode === "deterministic" ? undefined : llmClient,
      contentLoader: this.contentLoader,
    });

    const nextSceneId = evaluation.isCorrect
      ? challenge.successNextSceneId ?? scene.successNextSceneId
      : challenge.failureNextSceneId ?? scene.failureNextSceneId;

    const effects = evaluation.isCorrect ? challenge.successEffects : challenge.failureEffects;

    let nextSave = this.effectRunner.applyEffects(save, effects, this.contextFor(save));
    nextSave = this.errorMemorySystem.record(nextSave, evaluation.errorTags, scene);
    const beforeMastery = new Map(nextSave.masteryStates.map(state => [`${state.targetType}:${state.targetId}`, state.mastery]));
    nextSave = this.masterySystem.recordEvaluation({ save: nextSave, evaluation, scene });
    const focusGrammar = scene.learningFocus?.grammarIds || [];
    const focusVocab = scene.learningFocus?.vocabularyIds || [];
    const focusSkill = scene.learningFocus?.skillIds || [];
    for (const state of nextSave.masteryStates) {
      const before = beforeMastery.get(`${state.targetType}:${state.targetId}`);
      const isFocused = (state.targetType === "grammar" && focusGrammar.includes(state.targetId)) ||
                        (state.targetType === "vocabulary" && focusVocab.includes(state.targetId)) ||
                        (state.targetType === "skill" && focusSkill.includes(state.targetId));
      if (before !== state.mastery || (isFocused && before === undefined)) {
        nextSave = this.eventBus.emit(nextSave, "MASTERY_UPDATED", { targetId: state.targetId, targetType: state.targetType, before, after: state.mastery });
      }
    }
    
    // Stage 6: Update NPC Memory and relationships based on correctness
    if (scene.npcIds && scene.npcIds.length > 0) {
      const relationshipSystem = new NpcRelationshipSystem();
      const memorySystem = new NpcMemorySystem();

      for (const npcId of scene.npcIds) {
        if (evaluation.isCorrect) {
          const delta = {
            familiarity: 1,
            respect: npcId === "magister" ? 2 : 1
          };
          nextSave = relationshipSystem.updateRelationship({
            save: nextSave,
            npcId,
            delta,
            reason: "Doğru Latince cevabı verdi.",
            eventBus: this.eventBus
          });

          nextSave = memorySystem.addNpcMemoryFact({
            save: nextSave,
            npcId,
            text: `Öğrenci bu sahnede doğru Latince cevap verdi: ${text.slice(0, 60)}`,
            importance: 30,
            relatedSceneId: scene.id,
            relatedQuestId: nextSave.currentQuestId,
            tags: ["correct-answer"],
            eventBus: this.eventBus
          });
        } else {
          nextSave = relationshipSystem.updateRelationship({
            save: nextSave,
            npcId,
            delta: { familiarity: 1 },
            reason: "Yanlış Latince cevabı verdi.",
            eventBus: this.eventBus
          });

          const tagsStr = evaluation.errorTags && evaluation.errorTags.length > 0
            ? evaluation.errorTags.join(", ")
            : "bilinmeyen konular";

          nextSave = memorySystem.addNpcMemoryFact({
            save: nextSave,
            npcId,
            text: `Öğrenci bu sahnede ${tagsStr} konusunda zorlandı.`,
            importance: 40,
            relatedSceneId: scene.id,
            relatedQuestId: nextSave.currentQuestId,
            tags: ["struggled", ...evaluation.errorTags],
            eventBus: this.eventBus
          });
        }
      }
    }

    if (evaluation.isCorrect) {
      nextSave = this.markSceneCompleted(nextSave, scene.id);
      nextSave = this.effectRunner.applyEffects(nextSave, scene.rewards, this.contextFor(nextSave));
    }

    // Event log updates
    nextSave = this.eventBus.emit(nextSave, "TEXT_EVALUATED", {
      sceneId: scene.id,
      playerAnswer: text,
      evaluation,
    });
    if (evaluation.llmError) {
      nextSave = this.eventBus.emit(nextSave, "LLM_ERROR", {
        error: evaluation.llmError,
        action: "evaluateLatinAnswer",
        sceneId: scene.id,
      });
    }

    // Dialogue log updates (player answer and Turkish feedback)
    nextSave = this.dialogueSystem.addDialogue(nextSave, "player", text, "la");
    nextSave = this.dialogueSystem.addDialogue(nextSave, "system", evaluation.feedbackTr, "tr");

    // Generate NPC reply
    const npcReply = await this.npcDialogueSystem.generateNpcReply(nextSave, scene, text, evaluation, llmClient);

    const npcId = scene.npcIds[0] || "system";
    nextSave = this.eventBus.emit(nextSave, "NPC_REPLY_GENERATED", {
      npcId,
      reply: npcReply,
    });

    // Add NPC dialogue to log
    nextSave = this.dialogueSystem.addDialogue(nextSave, npcId, npcReply.npcLineLatin, "la");
    if (npcReply.npcLineTr) {
      nextSave = this.dialogueSystem.addDialogue(nextSave, npcId, `(${npcReply.npcLineTr})`, "tr");
    }

    if (nextSceneId) {
      nextSave = this.enterScene(nextSave, nextSceneId);
    }

    return nextSave;
  }

  async resolveIntentSelect(save: PlayerSave, intentId: string, sceneId: string): Promise<PlayerSave> {
    const scene = this.requireCurrentScene(save);
    
    if (!scene.interactionModel && !scene.dialogueSequence) {
      throw new Error(`Scene ${scene.id} is not an interaction loop scene.`);
    }

    let intent: any;
    if (scene.dialogueSequence) {
      const turnIndex = save.activeInteraction?.activeTurnIndex ?? 0;
      const turn = scene.dialogueSequence.turns[turnIndex];
      if (!turn) {
        throw new Error(`Invalid turn index ${turnIndex} for dialogue sequence.`);
      }
      intent = turn.intents.find(i => i.id === intentId);
    } else if (scene.interactionModel) {
      intent = scene.interactionModel.intents.find(i => i.id === intentId);
    }

    if (!intent && save.activeInteraction?.attempts) {
      const tempOptions = (save.activeInteraction as any).tempOptions || [];
      intent = tempOptions.find((i: any) => i.id === intentId);
    }

    if (!intent) {
      throw new Error(`Intent ${intentId} not found in current scene context.`);
    }

    if (intent.conditions && !this.ruleEngine.checkConditions(save, intent.conditions)) {
      throw new Error(`Conditions are not met for intent ${intentId}.`);
    }

    let activeInteraction = save.activeInteraction || {
      sceneId: scene.id,
      resolvedIntentIds: [],
      attempts: {}
    };

    if (!intent.requiresLatin) {
      let nextSave = { ...save };
      
      if (intent.effects && intent.effects.length > 0) {
        nextSave = this.effectRunner.applyEffects(nextSave, intent.effects, this.contextFor(nextSave));
      }

      nextSave = new LivingSceneSystem().recordInteractionResolved({
        save: nextSave,
        sceneId: scene.id,
        intentId,
        eventBus: this.eventBus
      });
      const resolvedIntentIds = nextSave.livingSceneStates?.[scene.id]?.resolvedIntentIds || [];

      if (intent.resolution) {
        const res = intent.resolution;
        if (res.resultNarrationTr) {
          nextSave = this.dialogueSystem.addDialogue(nextSave, "system", res.resultNarrationTr, "tr");
        }
        if (res.npcReactionLatin) {
          const speaker = intent.speakerNpcId || scene.npcIds[0] || "npc";
          nextSave = this.dialogueSystem.addDialogue(nextSave, speaker, res.npcReactionLatin, "la");
          if (res.npcReactionTr) {
            nextSave = this.dialogueSystem.addDialogue(nextSave, speaker, `(${res.npcReactionTr})`, "tr");
          }
        }
        if (res.revealedTextTr) {
          nextSave = this.dialogueSystem.addDialogue(nextSave, "system", res.revealedTextTr, "tr");
        }
      }

      let nextTurnIndex = activeInteraction.activeTurnIndex;
      if (scene.dialogueSequence) {
        nextTurnIndex = (activeInteraction.activeTurnIndex ?? 0) + 1;
        if (nextTurnIndex >= scene.dialogueSequence.turns.length) {
          if (scene.dialogueSequence.completionEffects) {
            nextSave = this.effectRunner.applyEffects(nextSave, scene.dialogueSequence.completionEffects, this.contextFor(nextSave));
          }
          nextSave = this.markSceneCompleted(nextSave, scene.id);
          if (scene.dialogueSequence.completionNextSceneId) {
            nextSave = this.enterScene(nextSave, scene.dialogueSequence.completionNextSceneId);
            return nextSave;
          }
        }
      }

      nextSave.activeInteraction = {
        ...activeInteraction,
        resolvedIntentIds,
        activeTurnIndex: nextTurnIndex,
        selectedIntentId: undefined,
        tempOptions: undefined
      };

      if (intent.nextSceneId) {
        nextSave = this.markSceneCompleted(nextSave, scene.id);
        nextSave = this.enterScene(nextSave, intent.nextSceneId);
      }

      nextSave = this.eventBus.emit(nextSave, "INTENT_RESOLVED", {
        sceneId: scene.id,
        intentId,
        verb: intent.verb,
        requiresLatin: false,
        resolution: intent.resolution
      });

      return nextSave;
    } else {
      const updatedInteraction = {
        ...activeInteraction,
        selectedIntentId: intentId,
        selectedAt: new Date().toISOString()
      };
      
      let nextSave: PlayerSave = {
        ...save,
        activeInteraction: updatedInteraction
      };

      nextSave = this.eventBus.emit(nextSave, "INTENT_SELECTED", {
        sceneId: scene.id,
        intentId
      });

      return nextSave;
    }
  }

  async resolveIntentTextChallenge(save: PlayerSave, text: string, llmClient?: LlmClient): Promise<PlayerSave> {
    const scene = this.requireCurrentScene(save);
    const activeInteraction = save.activeInteraction;
    if (!activeInteraction?.selectedIntentId) {
      throw new Error("No active selected intent to resolve.");
    }

    const intentId = activeInteraction.selectedIntentId;
    let intent: any;
    let turn: any;
    if (scene.dialogueSequence) {
      const turnIndex = activeInteraction.activeTurnIndex ?? 0;
      turn = scene.dialogueSequence.turns[turnIndex];
      intent = turn?.intents.find((i: any) => i.id === intentId);
    } else if (scene.interactionModel) {
      intent = scene.interactionModel.intents.find(i => i.id === intentId);
    }

    if (!intent && (activeInteraction as any).tempOptions) {
      intent = ((activeInteraction as any).tempOptions || []).find((i: any) => i.id === intentId);
    }

    if (!intent) {
      throw new Error(`Intent ${intentId} not found in current scene context.`);
    }

    const dialogueChallenge: DialogueResponseChallenge = {
      mode: "dialogue-response",
      speakerNpcId: intent.speakerNpcId || scene.npcIds[0],
      npcPromptLatin: turn?.npcLineLatin || scene.interactionModel?.npcLineLatin,
      npcPromptTr: turn?.npcLineTr || scene.interactionModel?.npcLineTr,
      playerIntentTr: intent.playerIntentTr || intent.labelTr,
      targetMeaningTr: intent.targetMeaningTr || "",
      canonicalAnswers: intent.canonicalAnswers || [],
      acceptedVariants: intent.acceptedVariants || [],
      rejectedMeanings: intent.rejectedMeanings || [],
      grammarFocusIds: intent.grammarFocusIds || [],
      vocabularyFocusIds: intent.vocabularyFocusIds || [],
      successNextSceneId: intent.successNextSceneId,
      failureNextSceneId: intent.failureNextSceneId,
      retryAllowed: intent.failureBehavior === "retry",
      evaluation: {
        allowEquivalentMeaning: true,
        allowWordOrderVariation: true,
        requireContextMatch: true,
        useLlmSemanticJudge: true,
        minimumConfidence: 0.5
      },
      reactions: intent.responseReactions
    };

    const sceneContext = {
      sceneId: scene.id,
      titleTr: scene.title,
      locationId: scene.locationId,
      npcIds: scene.npcIds,
      previousDialogue: save.dialogueLog,
    };

    const playerContext = {
      level: save.level,
      assessmentLevel: save.assessmentProfile?.estimatedLevel || "A0",
      knownGrammarIds: save.masteryStates.filter(s => s.targetType === "grammar" && s.mastery >= 50).map(s => s.targetId),
      knownVocabularyIds: save.masteryStates.filter(s => s.targetType === "vocabulary" && s.mastery >= 50).map(s => s.targetId),
    };

    const llmConfig = (llmClient as any)?.config;

    const evaluation = await evaluateDialogueResponse({
      answer: text,
      challenge: dialogueChallenge,
      sceneContext,
      playerContext,
      llmConfig,
    });

    const isCorrect = evaluation.acceptedAsCorrect;
    const attempts = { ...(activeInteraction.attempts || {}) };
    attempts[intentId] = (attempts[intentId] || 0) + 1;

    let nextSave = { ...save };
    const errorTags = evaluation.errors.filter(e => e.severity === "error").map(e => e.code);
    nextSave = this.errorMemorySystem.record(nextSave, errorTags, scene);

    const mockEvaluation = {
      isCorrect,
      score: isCorrect ? (evaluation.verdict === "exact_correct" ? 100 : 85) : 0,
      mode: evaluation.debug?.source || "fallback",
      feedbackTr: evaluation.feedbackTr,
      correctedLatin: evaluation.matchedCanonicalAnswer || dialogueChallenge.canonicalAnswers[0],
      errorTags,
      grammarNotes: evaluation.grammarNoteTr ? [evaluation.grammarNoteTr] : [],
      vocabularyNotes: evaluation.vocabularyNoteTr ? [evaluation.vocabularyNoteTr] : [],
      confidence: evaluation.confidence,
    };

    const beforeMastery = new Map(nextSave.masteryStates.map(state => [`${state.targetType}:${state.targetId}`, state.mastery]));
    nextSave = this.masterySystem.recordEvaluation({ save: nextSave, evaluation: mockEvaluation as any, scene });
    const focusGrammar = scene.learningFocus?.grammarIds || [];
    const focusVocab = scene.learningFocus?.vocabularyIds || [];
    const focusSkill = scene.learningFocus?.skillIds || [];
    for (const state of nextSave.masteryStates) {
      const before = beforeMastery.get(`${state.targetType}:${state.targetId}`);
      const isFocused = (state.targetType === "grammar" && focusGrammar.includes(state.targetId)) ||
                        (state.targetType === "vocabulary" && focusVocab.includes(state.targetId)) ||
                        (state.targetType === "skill" && focusSkill.includes(state.targetId));
      if (before !== state.mastery || (isFocused && before === undefined)) {
        nextSave = this.eventBus.emit(nextSave, "MASTERY_UPDATED", { targetId: state.targetId, targetType: state.targetType, before, after: state.mastery });
      }
    }

    if (scene.npcIds && scene.npcIds.length > 0) {
      const relationshipSystem = new NpcRelationshipSystem();
      const memorySystem = new NpcMemorySystem();
      for (const npcId of scene.npcIds) {
        if (isCorrect) {
          nextSave = relationshipSystem.updateRelationship({
            save: nextSave,
            npcId,
            delta: { familiarity: 1, respect: npcId === "magister" ? 2 : 1 },
            reason: "Doğru diyalog cevabı verdi.",
            eventBus: this.eventBus
          });
        } else {
          nextSave = relationshipSystem.updateRelationship({
            save: nextSave,
            npcId,
            delta: { familiarity: 1 },
            reason: "Yanlış diyalog cevabı verdi.",
            eventBus: this.eventBus
          });
        }
      }
    }

    nextSave = this.eventBus.emit(nextSave, "DIALOGUE_RESPONSE_EVALUATED", {
      sceneId: scene.id,
      npcId: dialogueChallenge.speakerNpcId || scene.npcIds[0] || "system",
      verdict: evaluation.verdict,
      acceptedAsCorrect: isCorrect,
      confidence: evaluation.confidence,
      answer: text,
      targetMeaningTr: dialogueChallenge.targetMeaningTr,
      feedbackTr: evaluation.feedbackTr,
      errors: evaluation.errors,
      npcReaction: evaluation.npcReaction
    });

    nextSave = this.dialogueSystem.addDialogue(nextSave, "player", text, "la");
    if (evaluation.feedbackTr) {
      nextSave = this.dialogueSystem.addDialogue(nextSave, "system", evaluation.feedbackTr, "tr");
    }
    const reaction = evaluation.npcReaction;
    const npcId = dialogueChallenge.speakerNpcId || scene.npcIds[0] || "system";
    if (reaction?.npcLineLatin) {
      nextSave = this.dialogueSystem.addDialogue(nextSave, npcId, reaction.npcLineLatin, "la");
      if (reaction.npcLineTr) {
        nextSave = this.dialogueSystem.addDialogue(nextSave, npcId, `(${reaction.npcLineTr})`, "tr");
      }
    }

    if (isCorrect) {
      if (intent.effects && intent.effects.length > 0) {
        nextSave = this.effectRunner.applyEffects(nextSave, intent.effects, this.contextFor(nextSave));
      }

      nextSave = new LivingSceneSystem().recordInteractionResolved({
        save: nextSave,
        sceneId: scene.id,
        intentId,
        eventBus: this.eventBus
      });
      const resolvedIntentIds = nextSave.livingSceneStates?.[scene.id]?.resolvedIntentIds || [];

      if (intent.resolution) {
        const res = intent.resolution;
        if (res.resultNarrationTr) {
          nextSave = this.dialogueSystem.addDialogue(nextSave, "system", res.resultNarrationTr, "tr");
        }
        if (res.npcReactionLatin) {
          const speaker = intent.speakerNpcId || scene.npcIds[0] || "npc";
          nextSave = this.dialogueSystem.addDialogue(nextSave, speaker, res.npcReactionLatin, "la");
          if (res.npcReactionTr) {
            nextSave = this.dialogueSystem.addDialogue(nextSave, speaker, `(${res.npcReactionTr})`, "tr");
          }
        }
      }

      let nextTurnIndex = activeInteraction.activeTurnIndex;
      if (scene.dialogueSequence) {
        nextTurnIndex = (activeInteraction.activeTurnIndex ?? 0) + 1;
        if (nextTurnIndex >= scene.dialogueSequence.turns.length) {
          if (scene.dialogueSequence.completionEffects) {
            nextSave = this.effectRunner.applyEffects(nextSave, scene.dialogueSequence.completionEffects, this.contextFor(nextSave));
          }
          nextSave = this.markSceneCompleted(nextSave, scene.id);
          if (scene.dialogueSequence.completionNextSceneId) {
            nextSave = this.enterScene(nextSave, scene.dialogueSequence.completionNextSceneId);
            return nextSave;
          }
        }
      }

      nextSave.activeInteraction = {
        ...activeInteraction,
        attempts,
        resolvedIntentIds,
        activeTurnIndex: nextTurnIndex,
        selectedIntentId: undefined,
        tempOptions: undefined
      };

      const transitionSceneId = intent.successNextSceneId || intent.nextSceneId;
      if (transitionSceneId) {
        nextSave = this.markSceneCompleted(nextSave, scene.id);
        nextSave = this.enterScene(nextSave, transitionSceneId);
      }

      nextSave = this.eventBus.emit(nextSave, "INTENT_RESOLVED", {
        sceneId: scene.id,
        intentId,
        verb: intent.verb,
        requiresLatin: true,
        verdict: evaluation.verdict,
        acceptedAsCorrect: true,
        resolution: intent.resolution
      });

      return nextSave;
    } else {
      const matchedBranch = (intent.failureBranches || []).find((b: any) => b.verdict === evaluation.verdict);
      
      if (matchedBranch) {
        if (matchedBranch.npcReactionLatin) {
          nextSave = this.dialogueSystem.addDialogue(nextSave, npcId, matchedBranch.npcReactionLatin, "la");
          if (matchedBranch.npcReactionTr) {
            nextSave = this.dialogueSystem.addDialogue(nextSave, npcId, `(${matchedBranch.npcReactionTr})`, "tr");
          }
        }
        if (matchedBranch.narrationTr) {
          nextSave = this.dialogueSystem.addDialogue(nextSave, "system", matchedBranch.narrationTr, "tr");
        }

        let tempOptions = undefined;
        if (matchedBranch.options && matchedBranch.options.length > 0) {
          tempOptions = matchedBranch.options;
        }

        const retry = matchedBranch.retryAllowed !== false;
        const branchNextSceneId = matchedBranch.nextSceneId;

        nextSave.activeInteraction = {
          ...activeInteraction,
          attempts,
          selectedIntentId: retry ? intentId : undefined,
          tempOptions
        } as any;

        if (branchNextSceneId) {
          nextSave = this.enterScene(nextSave, branchNextSceneId);
        }

        nextSave = this.eventBus.emit(nextSave, "INTENT_RESOLVED", {
          sceneId: scene.id,
          intentId,
          verb: intent.verb,
          requiresLatin: true,
          verdict: evaluation.verdict,
          acceptedAsCorrect: false
        });

        return nextSave;
      } else {
        const behavior = intent.failureBehavior || "retry";

        if (behavior === "retry") {
          nextSave.activeInteraction = {
            ...activeInteraction,
            attempts,
            selectedIntentId: intentId
          };
        } else if (behavior === "branch" && intent.failureNextSceneId) {
          nextSave.activeInteraction = {
            ...activeInteraction,
            attempts,
            selectedIntentId: undefined
          };
          nextSave = this.enterScene(nextSave, intent.failureNextSceneId);
        } else if (behavior === "soft-fail") {
          if (intent.effects && intent.effects.length > 0) {
            nextSave = this.effectRunner.applyEffects(nextSave, intent.effects, this.contextFor(nextSave));
          }
          nextSave.activeInteraction = {
            ...activeInteraction,
            attempts,
            selectedIntentId: undefined
          };
        } else if (behavior === "continue" && intent.nextSceneId) {
          nextSave.activeInteraction = {
            ...activeInteraction,
            attempts,
            selectedIntentId: undefined
          };
          nextSave = this.enterScene(nextSave, intent.nextSceneId);
        } else {
          nextSave.activeInteraction = {
            ...activeInteraction,
            attempts,
            selectedIntentId: intentId
          };
        }

        nextSave = this.eventBus.emit(nextSave, "INTENT_RESOLVED", {
          sceneId: scene.id,
          intentId,
          verb: intent.verb,
          requiresLatin: true,
          verdict: evaluation.verdict,
          acceptedAsCorrect: false
        });

        return nextSave;
      }
    }
  }

  private requireCurrentScene(save: PlayerSave): Scene {
    return this.requireScene(save, save.currentSceneId);
  }

  private requireScene(save: PlayerSave, sceneId: string): Scene {
    if (sceneId.startsWith("gen_scene_")) {
      const generated = GeneratedContentSystem.findGeneratedScene({ save, sceneId });
      if (generated) return generated.scene;
    }
    const scene = this.contentLoader.getScene(save.currentCampaignId, sceneId);
    if (!scene) {
      throw new Error(`Scene ${sceneId} was not found in campaign ${save.currentCampaignId}.`);
    }
    return scene;
  }

  private moveToScene(save: PlayerSave, sceneId: string): PlayerSave {
    if (sceneId.startsWith("gen_scene_")) {
      const generated = GeneratedContentSystem.findGeneratedScene({ save, sceneId });
      if (generated) {
        return {
          ...save,
          currentSceneId: sceneId,
          currentQuestId: generated.quest.id
        };
      }
    }
    const quest = this.contentLoader.findQuestForScene(save.currentCampaignId, sceneId);
    const chapter = this.contentLoader.findChapterForScene(save.currentCampaignId, sceneId);
    if (!quest || !chapter) {
      throw new Error(`Scene ${sceneId} is not attached to a quest and chapter.`);
    }
    return { ...save, currentSceneId: sceneId, currentQuestId: quest.id, currentChapterId: chapter.id };
  }

  private contextFor(save: PlayerSave) {
    return { campaignId: save.currentCampaignId, chapterId: save.currentChapterId, questId: save.currentQuestId, sceneId: save.currentSceneId };
  }
}
