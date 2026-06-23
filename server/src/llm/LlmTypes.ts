import type { LatinEvaluationResult } from "../latin/LatinEvaluator";
import type { Scene } from "../game/types/gameTypes";

export type LlmProvider = "openai" | "lmstudio" | "ollama" | "custom";

export interface LlmProviderConfig {
  provider: LlmProvider;
  baseUrl: string;
  apiKey?: string;
  model: string;
  temperature?: number;
  timeoutMs?: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmChatRequest {
  messages: ChatMessage[];
  temperature?: number;
  responseFormat?: "json" | "text";
}

export interface LlmChatResponse {
  text: string;
  raw?: unknown;
}

export interface LatinAnswerEvaluationContext {
  playerAnswer: string;
  expectedAnswers: string[];
  prompt: string;
  sceneId: string;
  questId: string;
  playerLevel: number;
  unlockedSkills: string[];
  context?: Record<string, unknown>;
}

export interface SceneNarrationContext {
  sceneDescription: string;
  sceneObjective: string;
  npcProfiles: Array<{ id: string; name: string; description: string }>;
  playerName: string;
  playerLevel: number;
  unlockedSkills: string[];
  locationState?: { locationId: string; mood?: string; visitCount: number };
  activeWorldEvents?: string[];
  importantNpcMemoryFacts?: string[];
  narrativeFlags?: Record<string, boolean | string | number>;
}

export interface SceneNarrationResult {
  narrationTr: string;
  npcLineLatin?: string;
  npcLineTr?: string;
  objectiveReminderTr: string;
  worldMoodTr?: string;
}

export interface HintContext {
  prompt: string;
  expectedAnswers: string[];
  playerLevel: number;
  unlockedSkills: string[];
}

export interface HintResult {
  hintTr: string;
  miniExampleLatin?: string;
  miniExampleTr?: string;
}

export interface NpcReplyContext {
  npcName: string;
  npcDescription: string;
  playerText: string;
  evaluation: LatinEvaluationResult;
  playerLevel: number;
  npcMemoryFacts?: string[];
  npcRelationship?: { trust: number; respect: number; familiarity: number };
  locationState?: { locationId: string; mood?: string; visitCount: number };
  activeWorldEvents?: string[];
  sideQuestSuggestions?: string[];
  playerWeakMasteryTargets?: string[];
  recentChoices?: string[];
  recentEvaluations?: string[];
}

export interface NpcReplyResult {
  npcLineLatin: string;
  npcLineTr: string;
  tone: string;
  memoryReferenceUsed: boolean;
}

export interface SceneDraftContext {
  grammarIds: string[];
  vocabularyIds: string[];
  locationId: string;
  npcIds: string[];
  difficulty: "intro" | "practice" | "review" | "challenge";
  count: number;
}

export interface SceneDraftResult {
  drafts: Scene[];
  parseError?: string;
}
