import { randomUUID } from "node:crypto";
import type { PlayerSave, GameEvent, DialogueEntry } from "../types/gameTypes";
import type { ConversationFlow, ConversationNode, ConversationOption, ConversationRuntimeState, ActiveConversationView, ConversationActionResult } from "../types/ConversationTypes";
import { evaluateDialogueResponse } from "../../latin/SemanticLatinEvaluator";
import { EffectRunner } from "../core/EffectRunner";
import { EventBus } from "../core/EventBus";
import { ContentLoader } from "../content/ContentLoader";
import type { LlmProviderConfig } from "../../llm/LlmTypes";

export class ConversationEngine {
  constructor(
    private readonly contentLoader: ContentLoader,
    private readonly effectRunner: EffectRunner,
    private readonly eventBus: EventBus
  ) {}

  startConversation(params: {
    save: PlayerSave;
    flowId: string;
    sceneId?: string;
  }): {
    save: PlayerSave;
    state: ConversationRuntimeState;
    events: GameEvent[];
  } {
    const { save, flowId } = params;
    const flow = this.contentLoader.getConversationFlow(flowId);
    if (!flow) {
      throw new Error(`Conversation flow ${flowId} not found.`);
    }

    const state: ConversationRuntimeState = {
      flowId,
      currentNodeId: flow.startNodeId,
      startedAt: new Date().toISOString(),
      visitedNodeIds: [flow.startNodeId],
      attempts: {},
      completed: false
    };

    let nextSave: PlayerSave = {
      ...save,
      activeConversation: state
    };

    let events: GameEvent[] = [];

    // Emit event that conversation started
    nextSave = this.eventBus.emit(nextSave, "conversation.started", { flowId, startNodeId: flow.startNodeId });

    // Run enter effects for start node
    const startNode = flow.nodes.find(n => n.id === flow.startNodeId);
    if (startNode && startNode.onEnterEffects) {
      nextSave = this.effectRunner.applyEffects(nextSave, startNode.onEnterEffects, {
        campaignId: nextSave.currentCampaignId,
        chapterId: nextSave.currentChapterId,
        questId: nextSave.currentQuestId,
        sceneId: nextSave.currentSceneId
      });
    }

    return {
      save: nextSave,
      state: nextSave.activeConversation!,
      events
    };
  }

  selectConversationOption(params: {
    save: PlayerSave;
    flowId: string;
    nodeId: string;
    optionId: string;
  }): ConversationActionResult {
    const { save, flowId, nodeId, optionId } = params;
    const flow = this.contentLoader.getConversationFlow(flowId);
    if (!flow) throw new Error(`Flow ${flowId} not found.`);
    const node = flow.nodes.find(n => n.id === nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found.`);
    const option = node.options.find(o => o.id === optionId);
    if (!option) throw new Error(`Option ${optionId} not found.`);

    let nextSave = { ...save };
    let events: GameEvent[] = [];
    let dialogueLog: DialogueEntry[] = [];

    // Add player log
    const playerEntry: DialogueEntry = {
      id: randomUUID(),
      speakerId: "player",
      text: option.labelTr,
      language: "Turkish",
      timestamp: new Date().toISOString()
    };
    nextSave.dialogueLog = [...nextSave.dialogueLog, playerEntry];
    dialogueLog.push(playerEntry);

    // If options requires Latin, mark selected option and wait for text submission
    if (option.requiresLatin) {
      if (nextSave.activeConversation) {
        nextSave.activeConversation = {
          ...nextSave.activeConversation,
          selectedOptionId: optionId
        };
      }
      return {
        save: nextSave,
        events,
        dialogueLog,
        nodeTransitioned: false
      };
    }

    // Apply option effects
    if (option.effects && option.effects.length > 0) {
      nextSave = this.effectRunner.applyEffects(nextSave, option.effects, {
        campaignId: nextSave.currentCampaignId,
        chapterId: nextSave.currentChapterId,
        questId: nextSave.currentQuestId,
        sceneId: nextSave.currentSceneId
      });
    }

    // Transition to nextNodeId
    const nextNodeId = option.nextNodeId;
    let nodeTransitioned = false;
    if (nextNodeId) {
      nextSave = this.transitionToNode(nextSave, flow, nextNodeId, events, dialogueLog);
      nodeTransitioned = true;
    }

    return {
      save: nextSave,
      events,
      dialogueLog,
      nodeTransitioned
    };
  }

  async submitConversationText(params: {
    save: PlayerSave;
    flowId: string;
    nodeId: string;
    optionId: string;
    answer: string;
    llmConfig?: LlmProviderConfig;
  }): Promise<ConversationActionResult> {
    const { save, flowId, nodeId, optionId, answer, llmConfig } = params;
    const flow = this.contentLoader.getConversationFlow(flowId);
    if (!flow) throw new Error(`Flow ${flowId} not found.`);
    const node = flow.nodes.find(n => n.id === nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found.`);
    const option = node.options.find(o => o.id === optionId);
    if (!option) throw new Error(`Option ${optionId} not found.`);

    let nextSave = { ...save };
    let events: GameEvent[] = [];
    let dialogueLog: DialogueEntry[] = [];

    // Add player Latin submission to log
    const playerEntry: DialogueEntry = {
      id: randomUUID(),
      speakerId: "player",
      text: answer,
      language: "Latin",
      timestamp: new Date().toISOString()
    };
    nextSave.dialogueLog = [...nextSave.dialogueLog, playerEntry];
    dialogueLog.push(playerEntry);

    // Build dialogue response challenge
    const challenge = {
      mode: "dialogue-response" as const,
      playerIntentTr: option.playerIntentTr || option.labelTr,
      targetMeaningTr: option.targetMeaningTr || option.labelTr,
      canonicalAnswers: option.canonicalAnswers || [],
      acceptedVariants: option.acceptedVariants || [],
      reactions: option.npcReactions
    };

    const evaluation = await evaluateDialogueResponse({
      answer,
      challenge,
      sceneContext: {
        sceneId: nextSave.currentSceneId,
        locationId: node.speakerNpcId ? node.speakerNpcId : undefined
      },
      playerContext: {
        level: nextSave.level
      },
      llmConfig
    });

    // Record attempt count
    if (nextSave.activeConversation) {
      const currentAttempts = nextSave.activeConversation.attempts[optionId] ?? 0;
      nextSave.activeConversation.attempts = {
        ...nextSave.activeConversation.attempts,
        [optionId]: currentAttempts + 1
      };
    }

    if (evaluation.acceptedAsCorrect) {
      // Clear selected option
      if (nextSave.activeConversation) {
        nextSave.activeConversation = {
          ...nextSave.activeConversation,
          selectedOptionId: undefined
        };
      }

      // Add NPC correct line to log
      if (evaluation.npcReaction?.npcLineLatin) {
        const npcEntry: DialogueEntry = {
          id: randomUUID(),
          speakerId: node.speakerNpcId || "npc",
          text: evaluation.npcReaction.npcLineLatin,
          translationTr: evaluation.npcReaction.npcLineTr,
          language: "Latin",
          timestamp: new Date().toISOString()
        };
        nextSave.dialogueLog = [...nextSave.dialogueLog, npcEntry];
        dialogueLog.push(npcEntry);
      }

      // Apply option effects
      if (option.effects && option.effects.length > 0) {
        nextSave = this.effectRunner.applyEffects(nextSave, option.effects, {
          campaignId: nextSave.currentCampaignId,
          chapterId: nextSave.currentChapterId,
          questId: nextSave.currentQuestId,
          sceneId: nextSave.currentSceneId
        });
      }

      // Move to successNode
      const targetNodeId = option.successNextNodeId || option.nextNodeId;
      if (targetNodeId) {
        nextSave = this.transitionToNode(nextSave, flow, targetNodeId, events, dialogueLog);
      }

      return {
        save: nextSave,
        events,
        dialogueLog,
        nodeTransitioned: true
      };
    } else {
      // Handle failure behaviors: retry, node, soft-fail, continue
      const behavior = option.failureBehavior || "retry";

      if (behavior === "retry") {
        // Stay on node, display reaction
        if (evaluation.npcReaction?.npcLineLatin) {
          const npcEntry: DialogueEntry = {
            id: randomUUID(),
            speakerId: node.speakerNpcId || "npc",
            text: evaluation.npcReaction.npcLineLatin,
            translationTr: evaluation.npcReaction.npcLineTr,
            language: "Latin",
            timestamp: new Date().toISOString()
          };
          nextSave.dialogueLog = [...nextSave.dialogueLog, npcEntry];
          dialogueLog.push(npcEntry);
        }
        return {
          save: nextSave,
          events,
          dialogueLog,
          nodeTransitioned: false
        };
      } else {
        // Node / soft-fail / continue transition
        // Clear selected option
        if (nextSave.activeConversation) {
          nextSave.activeConversation = {
            ...nextSave.activeConversation,
            selectedOptionId: undefined
          };
        }

        if (evaluation.npcReaction?.npcLineLatin) {
          const npcEntry: DialogueEntry = {
            id: randomUUID(),
            speakerId: node.speakerNpcId || "npc",
            text: evaluation.npcReaction.npcLineLatin,
            translationTr: evaluation.npcReaction.npcLineTr,
            language: "Latin",
            timestamp: new Date().toISOString()
          };
          nextSave.dialogueLog = [...nextSave.dialogueLog, npcEntry];
          dialogueLog.push(npcEntry);
        }

        const targetNodeId = option.failureNextNodeId || option.nextNodeId;
        if (targetNodeId) {
          nextSave = this.transitionToNode(nextSave, flow, targetNodeId, events, dialogueLog);
        }

        return {
          save: nextSave,
          events,
          dialogueLog,
          nodeTransitioned: true
        };
      }
    }
  }

  private transitionToNode(
    save: PlayerSave,
    flow: ConversationFlow,
    nodeId: string,
    events: GameEvent[],
    dialogueLog: DialogueEntry[]
  ): PlayerSave {
    let nextSave = { ...save };
    const node = flow.nodes.find(n => n.id === nodeId);
    if (!node) throw new Error(`Transition target node ${nodeId} not found.`);

    if (nextSave.activeConversation) {
      nextSave.activeConversation = {
        ...nextSave.activeConversation,
        currentNodeId: nodeId,
        visitedNodeIds: [...nextSave.activeConversation.visitedNodeIds, nodeId]
      };
    }

    // Run Enter Effects
    if (node.onEnterEffects && node.onEnterEffects.length > 0) {
      nextSave = this.effectRunner.applyEffects(nextSave, node.onEnterEffects, {
        campaignId: nextSave.currentCampaignId,
        chapterId: nextSave.currentChapterId,
        questId: nextSave.currentQuestId,
        sceneId: nextSave.currentSceneId
      });
    }

    // Add NPC / Narration line to dialogue log
    if (node.narrationTr) {
      const logEntry: DialogueEntry = {
        id: randomUUID(),
        speakerId: "narrator",
        text: node.narrationTr,
        language: "Turkish",
        timestamp: new Date().toISOString()
      };
      nextSave.dialogueLog = [...nextSave.dialogueLog, logEntry];
      dialogueLog.push(logEntry);
    } else if (node.npcLineLatin) {
      const logEntry: DialogueEntry = {
        id: randomUUID(),
        speakerId: node.speakerNpcId || "npc",
        text: node.npcLineLatin,
        translationTr: node.npcLineTr,
        language: "Latin",
        timestamp: new Date().toISOString()
      };
      nextSave.dialogueLog = [...nextSave.dialogueLog, logEntry];
      dialogueLog.push(logEntry);
    }

    // Check if node is ending
    if (node.isEnding) {
      // Apply flow completion effects
      if (flow.completionEffects && flow.completionEffects.length > 0) {
        nextSave = this.effectRunner.applyEffects(nextSave, flow.completionEffects, {
          campaignId: nextSave.currentCampaignId,
          chapterId: nextSave.currentChapterId,
          questId: nextSave.currentQuestId,
          sceneId: nextSave.currentSceneId
        });
      }

      // Move to completionNextSceneId if defined
      if (flow.completionNextSceneId) {
        nextSave = {
          ...nextSave,
          currentSceneId: flow.completionNextSceneId
        };
      }

      // Mark runtime state completed and clear conversation state from save
      if (nextSave.activeConversation) {
        nextSave.activeConversation = {
          ...nextSave.activeConversation,
          completed: true
        };
      }
      nextSave.activeConversation = undefined;
    }

    return nextSave;
  }

  getActiveConversationView(save: PlayerSave): ActiveConversationView | undefined {
    if (!save.activeConversation) return undefined;
    const { flowId, currentNodeId, completed } = save.activeConversation;
    const flow = this.contentLoader.getConversationFlow(flowId);
    if (!flow) return undefined;
    const node = flow.nodes.find(n => n.id === currentNodeId);
    if (!node) return undefined;

    return {
      flowId,
      currentNode: node,
      options: node.options,
      completed
    };
  }
}
