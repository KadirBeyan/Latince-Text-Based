export type FieldPath =
  | "id"
  | "title"
  | "titleTr"
  | "description"
  | "descriptionTr"
  | "locationId"
  | "npcIds"
  | "inputMode"
  | "learningFocus.grammarIds"
  | "learningFocus.vocabularyIds"
  | "learningFocus.skillIds"
  | "textChallenge.expectedAnswers"
  | "textChallenge.successNextSceneId"
  | "textChallenge.failureNextSceneId"
  | "choices"
  | `choices.${number}.nextSceneId`
  | "effects"
  | `effects.${number}`
  | "conditions"
  | `conditions.${number}`
  | "rewards"
  | "rewardBundle.xp"
  | string;

export function normalizeFieldPath(path?: string): FieldPath | undefined {
  if (!path) return undefined;
  if (path === "title") return "titleTr";
  if (path === "description") return "descriptionTr";
  if (path === "nextSceneId") return "choices";
  return path;
}

export function fieldSelector(path: string): string {
  return `[data-field-path="${CSS.escape(path)}"]`;
}
