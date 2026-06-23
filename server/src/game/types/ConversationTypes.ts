import type { Condition, Effect, DialogueReaction, ID } from "./gameTypes";

export type ConversationFlow = {
  id: string;
  titleTr: string;
  startNodeId: string;
  relatedQuestId?: string;
  relatedActivityId?: string;
  npcIds: string[];
  locationIds: string[];
  nodes: ConversationNode[];
  completionEffects?: Effect[];
  completionNextSceneId?: string;
};

export type ConversationNode = {
  id: string;
  speakerNpcId?: string;
  narrationTr?: string;
  narrationLatin?: string;
  npcLineLatin?: string;
  npcLineTr?: string;
  playerContextTr?: string;
  options: ConversationOption[];
  onEnterEffects?: Effect[];
  conditions?: Condition[];
  isEnding?: boolean;
  endingSummaryTr?: string;
};

export type ConversationOption = {
  id: string;
  labelTr: string;
  descriptionTr?: string;
  verb:
    | "speak"
    | "ask"
    | "inspect"
    | "listen"
    | "wait"
    | "help"
    | "refuse"
    | "leave"
    | "remember"
    | "read"
    | "custom";
  requiresLatin: boolean;
  playerIntentTr?: string;
  targetMeaningTr?: string;
  canonicalAnswers?: string[];
  acceptedVariants?: string[];
  conditions?: Condition[];
  effects?: Effect[];
  nextNodeId?: string;
  successNextNodeId?: string;
  failureNextNodeId?: string;
  failureBehavior?: "retry" | "node" | "soft-fail" | "continue";
  npcReactions?: {
    correct?: DialogueReaction;
    nearMiss?: DialogueReaction;
    wrong?: DialogueReaction;
    contextWrong?: DialogueReaction;
  };
  resolutionTr?: string;
  resolutionLatin?: string;
};

export type ConversationRuntimeState = {
  flowId: string;
  currentNodeId: string;
  startedAt: string;
  visitedNodeIds: string[];
  selectedOptionId?: string;
  attempts: Record<string, number>;
  completed: boolean;
};

export type ActiveConversationView = {
  flowId: string;
  currentNode: ConversationNode;
  options: ConversationOption[];
  completed: boolean;
};

export type ConversationActionResult = {
  save: any; // PlayerSave placeholder
  events: any[]; // GameEvent placeholder
  dialogueLog: any[]; // DialogueEntry placeholder
  nodeTransitioned: boolean;
};
