import type { PlayerSave, LivingSceneState, FlagValue } from "../types/gameTypes";
import { EventBus } from "../core/EventBus";

export class LivingSceneSystem {
  getOrCreateSceneState(save: PlayerSave, sceneId: string): LivingSceneState {
    const states = save.livingSceneStates || {};
    const existing = states[sceneId];
    if (existing) return existing;
    return {
      sceneId,
      visitCount: 0,
      localFlags: {},
      resolvedIntentIds: [],
      inspectedIds: [],
      listenedIds: [],
      readIds: [],
      discoveredClueIds: [],
      discoveredVocabularyIds: [],
      discoveredGrammarIds: []
    };
  }

  updateSceneState(save: PlayerSave, sceneId: string, updater: (state: LivingSceneState) => LivingSceneState): PlayerSave {
    const states = { ...(save.livingSceneStates || {}) };
    const current = states[sceneId] || this.getOrCreateSceneState(save, sceneId);
    states[sceneId] = updater(current);
    return {
      ...save,
      livingSceneStates: states
    };
  }

  onSceneEnter(params: { save: PlayerSave; sceneId: string; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => ({
      ...state,
      visitCount: state.visitCount + 1,
      lastVisitedAt: new Date().toISOString()
    }));
    
    if (eventBus) {
      const visitCount = nextSave.livingSceneStates?.[sceneId]?.visitCount || 1;
      nextSave = eventBus.emit(nextSave, "SCENE_VISITED", { sceneId, visitCount });
    }
    return nextSave;
  }

  recordInteractionResolved(params: { save: PlayerSave; sceneId: string; intentId: string; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, intentId, eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => {
      if (state.resolvedIntentIds.includes(intentId)) return state;
      return {
        ...state,
        resolvedIntentIds: [...state.resolvedIntentIds, intentId]
      };
    });

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SCENE_INTENT_RESOLVED", { sceneId, intentId });
    }
    return nextSave;
  }

  recordInspection(params: { save: PlayerSave; sceneId: string; inspectId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[]; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, inspectId, vocabularyIds = [], grammarIds = [], clueIds = [], eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => {
      const inspectedIds = state.inspectedIds.includes(inspectId) ? state.inspectedIds : [...state.inspectedIds, inspectId];
      const discoveredVocabularyIds = [...new Set([...state.discoveredVocabularyIds, ...vocabularyIds])];
      const discoveredGrammarIds = [...new Set([...state.discoveredGrammarIds, ...grammarIds])];
      const discoveredClueIds = [...new Set([...state.discoveredClueIds, ...clueIds])];

      return {
        ...state,
        inspectedIds,
        discoveredVocabularyIds,
        discoveredGrammarIds,
        discoveredClueIds
      };
    });

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SCENE_INSPECTED", { sceneId, inspectId, vocabularyIds, grammarIds, clueIds });
    }
    return nextSave;
  }

  recordListening(params: { save: PlayerSave; sceneId: string; listenId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[]; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, listenId, vocabularyIds = [], grammarIds = [], clueIds = [], eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => {
      const listenedIds = state.listenedIds.includes(listenId) ? state.listenedIds : [...state.listenedIds, listenId];
      const discoveredVocabularyIds = [...new Set([...state.discoveredVocabularyIds, ...vocabularyIds])];
      const discoveredGrammarIds = [...new Set([...state.discoveredGrammarIds, ...grammarIds])];
      const discoveredClueIds = [...new Set([...state.discoveredClueIds, ...clueIds])];

      return {
        ...state,
        listenedIds,
        discoveredVocabularyIds,
        discoveredGrammarIds,
        discoveredClueIds
      };
    });

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SCENE_LISTENED", { sceneId, listenId, vocabularyIds, grammarIds, clueIds });
    }
    return nextSave;
  }

  recordReading(params: { save: PlayerSave; sceneId: string; readId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[]; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, readId, vocabularyIds = [], grammarIds = [], clueIds = [], eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => {
      const readIds = state.readIds.includes(readId) ? state.readIds : [...state.readIds, readId];
      const discoveredVocabularyIds = [...new Set([...state.discoveredVocabularyIds, ...vocabularyIds])];
      const discoveredGrammarIds = [...new Set([...state.discoveredGrammarIds, ...grammarIds])];
      const discoveredClueIds = [...new Set([...state.discoveredClueIds, ...clueIds])];

      return {
        ...state,
        readIds,
        discoveredVocabularyIds,
        discoveredGrammarIds,
        discoveredClueIds
      };
    });

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SCENE_READ", { sceneId, readId, vocabularyIds, grammarIds, clueIds });
    }
    return nextSave;
  }

  setLocalFlag(params: { save: PlayerSave; sceneId: string; key: string; value: FlagValue; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, key, value, eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => ({
      ...state,
      localFlags: {
        ...state.localFlags,
        [key]: value
      }
    }));

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SCENE_LOCAL_FLAG_CHANGED", { sceneId, key, value });
    }
    return nextSave;
  }

  addSceneClue(params: { save: PlayerSave; sceneId: string; clueId: string; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, clueId, eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => {
      if (state.discoveredClueIds.includes(clueId)) return state;
      return {
        ...state,
        discoveredClueIds: [...state.discoveredClueIds, clueId]
      };
    });

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SCENE_CLUE_DISCOVERED", { sceneId, clueId });
    }
    return nextSave;
  }

  addSceneDiscoveredVocab(params: { save: PlayerSave; sceneId: string; vocabularyId: string; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, vocabularyId, eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => {
      if (state.discoveredVocabularyIds.includes(vocabularyId)) return state;
      return {
        ...state,
        discoveredVocabularyIds: [...state.discoveredVocabularyIds, vocabularyId]
      };
    });

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SCENE_VOCAB_DISCOVERED", { sceneId, vocabularyId });
    }
    return nextSave;
  }

  addSceneDiscoveredGrammar(params: { save: PlayerSave; sceneId: string; grammarId: string; eventBus?: EventBus }): PlayerSave {
    const { save, sceneId, grammarId, eventBus } = params;
    let nextSave = this.updateSceneState(save, sceneId, (state) => {
      if (state.discoveredGrammarIds.includes(grammarId)) return state;
      return {
        ...state,
        discoveredGrammarIds: [...state.discoveredGrammarIds, grammarId]
      };
    });

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "SCENE_GRAMMAR_DISCOVERED", { sceneId, grammarId });
    }
    return nextSave;
  }

  hasSceneLocalFlag(save: PlayerSave, sceneId: string, key: string, value?: FlagValue): boolean {
    const state = this.getOrCreateSceneState(save, sceneId);
    if (value === undefined) {
      return state.localFlags[key] !== undefined;
    }
    return state.localFlags[key] === value;
  }

  getSceneVisitCount(save: PlayerSave, sceneId: string): number {
    const state = this.getOrCreateSceneState(save, sceneId);
    return state.visitCount;
  }
}
