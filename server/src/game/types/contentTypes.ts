import type { Campaign, ID, ValidationIssue, ValidationResult, QuestTemplate } from "./gameTypes";

export interface NpcDefinition {
  id: ID;
  name: string;
  description: string;
}

export interface ItemDefinition {
  id: ID;
  name: string;
  description: string;
  usable: boolean;
}

export interface SkillDefinition {
  id: ID;
  name: string;
  description: string;
  maxLevel: number;
}

export type CurriculumLevel = 1 | 2 | 3 | 4 | 5 | string;

export interface GrammarTopic {
  id: ID;
  title: string;
  titleTr: string;
  level: CurriculumLevel;
  explanation: string;
  examples: string[];
  tags: string[];
}

export interface VocabularyItem {
  id: ID;
  latin: string;
  turkish: string;
  pos: string;
  gender: string | null;
  declension: string | null;
  principalParts: string[];
  level: CurriculumLevel;
  tags: string[];
  examples: string[];
}

export interface LatinExample {
  id: ID;
  latin: string;
  turkish: string;
  grammarIds: ID[];
  vocabularyIds: ID[];
  level: CurriculumLevel;
}

import type { ConversationFlow } from "./ConversationTypes";

export interface LoadedContent {
  campaigns: Campaign[];
  npcs: NpcDefinition[];
  items: ItemDefinition[];
  skills: SkillDefinition[];
  grammar: GrammarTopic[];
  vocabulary: VocabularyItem[];
  examples: LatinExample[];
  questTemplates: QuestTemplate[];
  conversations: ConversationFlow[];
}

export type ContentValidationIssue = ValidationIssue;
export type ContentValidationResult = ValidationResult;
