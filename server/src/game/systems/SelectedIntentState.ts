import type { ActiveInteractionState, PlayerSave, Scene } from "../types/gameTypes";

export function getSelectedIntentId(save: PlayerSave, scene: Scene): string | undefined {
  if (save.activeInteraction?.sceneId === scene.id && save.activeInteraction.selectedIntentId) {
    return save.activeInteraction.selectedIntentId;
  }
  const legacy = save.narrativeFlags?.[legacySelectedIntentKey(scene.id)];
  return typeof legacy === "string" && legacy.trim() ? legacy : undefined;
}

export function withSelectedIntent(save: PlayerSave, scene: Scene, intentId: string): PlayerSave {
  const activeInteraction = baseActiveInteraction(save, scene);
  return stripLegacySelectedIntent({
    ...save,
    activeInteraction: {
      ...activeInteraction,
      selectedIntentId: intentId,
      selectedAt: new Date().toISOString(),
    },
  }, scene.id);
}

export function migrateSelectedIntentToActiveInteraction(save: PlayerSave, scene: Scene): PlayerSave {
  if (save.activeInteraction?.sceneId === scene.id && save.activeInteraction.selectedIntentId) return stripLegacySelectedIntent(save, scene.id);
  const legacyIntentId = getSelectedIntentId(save, scene);
  if (!legacyIntentId) return save;
  return stripLegacySelectedIntent({
    ...save,
    activeInteraction: {
      ...baseActiveInteraction(save, scene),
      selectedIntentId: legacyIntentId,
    },
  }, scene.id);
}

function baseActiveInteraction(save: PlayerSave, scene: Scene): ActiveInteractionState {
  if (save.activeInteraction?.sceneId === scene.id) return save.activeInteraction;
  return {
    sceneId: scene.id,
    resolvedIntentIds: [],
    attempts: {},
    ...(scene.dialogueSequence ? { activeTurnIndex: 0 } : {}),
  };
}

function stripLegacySelectedIntent(save: PlayerSave, sceneId: string): PlayerSave {
  const key = legacySelectedIntentKey(sceneId);
  if (!Object.prototype.hasOwnProperty.call(save.narrativeFlags ?? {}, key)) return save;
  const { [key]: _legacy, ...narrativeFlags } = save.narrativeFlags;
  return { ...save, narrativeFlags };
}

function legacySelectedIntentKey(sceneId: string): string {
  return `selected_intent_${sceneId}`;
}
