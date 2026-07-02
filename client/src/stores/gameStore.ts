import { createContext, createElement, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { createCharacterSave, createNewGame, deleteSave as deleteSaveApi, getGameState, listSaves, requestHint as requestHintApi, requestNarration as requestNarrationApi, resetGame, submitGameAction, getSessionSummary } from "../api/gameApi";
import { refreshSideQuestSuggestions, acceptSideQuestSuggestion, dismissSideQuestSuggestion } from "../api/sideQuestApi";
import {
  generateQuestFromSuggestion as apiGenerateQuestFromSuggestion,
  generateReviewQuest as apiGenerateReviewQuest,
  acceptGeneratedQuest as apiAcceptGeneratedQuest,
  dismissGeneratedQuest as apiDismissGeneratedQuest,
  startGeneratedQuest as apiStartGeneratedQuest
} from "../api/generatedQuestApi";
import type { GameState, HintResult, NarrationResult, SaveSummary, GameEvent, SessionSummary } from "../types/gameTypes";
import type { CharacterCreationPayload } from "../types/characterTypes";
import { useSettingsStore } from "./settingsStore";

export type RightPanelTab = "feedback" | "journal" | "hint" | "inventory" | "skills" | "settings" | "events" | "mastery" | "lingua" | "rota" | "tabula" | "gloria" | "mundus" | "personae";

type GameContextValue = {
  currentSaveId: string | null;
  gameState: GameState | null;
  saves: SaveSummary[];
  narration: NarrationResult | null;
  hint: HintResult | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  selectedRightPanelTab: RightPanelTab;
  seenEventIds: string[];
  activeModal: "level-up" | "quest-complete" | "session-summary" | null;
  activeModalEvent: GameEvent | null;
  rewardToasts: GameEvent[];
  sessionSummary: SessionSummary | null;
  loadSaves: () => Promise<void>;
  createGame: (playerName: string) => Promise<void>;
  createCharacterGame: (payload: CharacterCreationPayload) => Promise<void>;
  loadGame: (saveId: string) => Promise<void>;
  deleteSave: (saveId: string) => Promise<void>;
  submitChoice: (choiceId: string) => Promise<void>;
  submitText: (text: string) => Promise<void>;
  submitIntent: (intentId: string) => Promise<void>;
  clearSelectedIntent: () => void;
  requestHint: () => Promise<void>;
  requestNarration: () => Promise<void>;
  resetCurrentGame: () => Promise<void>;
  leaveGame: () => void;
  clearError: () => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  closeModal: () => void;
  dismissToast: (id: string) => void;
  showSessionSummary: () => Promise<void>;
  forceSetGameState: (state: GameState) => void;
  refreshSideQuests: () => Promise<void>;
  acceptSideQuest: (suggestionId: string) => Promise<void>;
  dismissSideQuest: (suggestionId: string) => Promise<void>;
  generateQuestFromSuggestion: (suggestionId: string) => Promise<void>;
  generateReviewQuest: (params: { grammarIds?: string[]; vocabularyIds?: string[]; errorTags?: string[] }) => Promise<void>;
  acceptGeneratedQuest: (generatedQuestId: string) => Promise<void>;
  dismissGeneratedQuest: (generatedQuestId: string) => Promise<void>;
  startGeneratedQuest: (generatedQuestId: string) => Promise<void>;
  startConversation: (flowId: string) => Promise<void>;
  selectConversationOption: (optionId: string) => Promise<void>;
  submitConversationText: (text: string) => Promise<void>;
  exitConversation: () => Promise<void>;
  submitFreeformAction: (text: string) => Promise<void>;
  submitFreeformLatin: (text: string) => Promise<void>;
};

const GameContext = createContext<GameContextValue | null>(null);
const LAST_SAVE_KEY = "via-prima:last-save-id";
const AUTO_RESUME_DISABLED_KEY = "via-prima:auto-resume-disabled";

function readStoredValue(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The game still works when browser storage is unavailable.
  }
}

function removeStoredValue(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // The game still works when browser storage is unavailable.
  }
}

function messageFromError(error: unknown): string {
  return error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.";
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { getLlmConfigOrUndefined } = useSettingsStore();
  const [currentSaveId, setCurrentSaveId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const [saves, setSaves] = useState<SaveSummary[]>([]);
  const [narration, setNarration] = useState<NarrationResult | null>(null);
  const [hint, setHint] = useState<HintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRightPanelTab, setRightPanelTab] = useState<RightPanelTab>("feedback");

  // Mastery and Progression Event States
  const seenEventIdsRef = useRef<string[]>([]);
  const [seenEventIds, setSeenEventIds] = useState<string[]>(() => {
    const stored = readStoredValue("via-prima:seen-event-ids");
    const parsed = stored ? JSON.parse(stored) : [];
    seenEventIdsRef.current = parsed;
    return parsed;
  });

  const [activeModal, setActiveModal] = useState<"level-up" | "quest-complete" | "session-summary" | null>(null);
  const [activeModalEvent, setActiveModalEvent] = useState<GameEvent | null>(null);
  const [rewardToasts, setRewardToasts] = useState<GameEvent[]>([]);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  const markEventAsSeen = useCallback((eventId: string) => {
    if (!seenEventIdsRef.current.includes(eventId)) {
      seenEventIdsRef.current = [...seenEventIdsRef.current, eventId];
      setSeenEventIds(seenEventIdsRef.current);
      writeStoredValue("via-prima:seen-event-ids", JSON.stringify(seenEventIdsRef.current));
    }
  }, []);

  const applyGameState = useCallback((state: GameState) => {
    gameStateRef.current = state;
    setGameState(state);
    setCurrentSaveId(state.saveId);
    writeStoredValue(LAST_SAVE_KEY, state.saveId);
    removeStoredValue(AUTO_RESUME_DISABLED_KEY);

    // Process new, unseen events for modals and toasts
    if (state.recentEvents && Array.isArray(state.recentEvents)) {
      const unseenEvents = state.recentEvents.filter(ev => !seenEventIdsRef.current.includes(ev.id));
      
      let newLevelUp: GameEvent | null = null;
      let newQuestComplete: GameEvent | null = null;
      const newToasts: GameEvent[] = [];
      const newlySeenIds: string[] = [];

      for (const ev of unseenEvents) {
        if (ev.type === "LEVEL_UP") {
          newLevelUp = ev;
        } else if (ev.type === "QUEST_COMPLETED") {
          newQuestComplete = ev;
        } else if (
          ["ITEM_ADDED", "SKILL_UNLOCKED", "SKILL_INCREMENTED", "CURRENCY_ADDED", "REWARD_BUNDLE_APPLIED"].includes(ev.type)
        ) {
          newToasts.push(ev);
          newlySeenIds.push(ev.id);
        }
      }

      if (newLevelUp) {
        setActiveModal("level-up");
        setActiveModalEvent(newLevelUp);
      } else if (newQuestComplete) {
        setActiveModal("quest-complete");
        setActiveModalEvent(newQuestComplete);
      }

      if (newToasts.length > 0) {
        setRewardToasts(prev => [...prev, ...newToasts]);
        seenEventIdsRef.current = [...seenEventIdsRef.current, ...newlySeenIds];
        setSeenEventIds(seenEventIdsRef.current);
        writeStoredValue("via-prima:seen-event-ids", JSON.stringify(seenEventIdsRef.current));
      }
    }
  }, []);

  const forceSetGameState = useCallback((state: GameState) => {
    applyGameState(state);
  }, [applyGameState]);

  const loadSaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const saveSummaries = await listSaves();
      setSaves(saveSummaries);

      if (!gameStateRef.current && readStoredValue(AUTO_RESUME_DISABLED_KEY) !== "true") {
        const storedSaveId = readStoredValue(LAST_SAVE_KEY);
        const resumeSaveId = saveSummaries.some((save) => save.id === storedSaveId)
          ? storedSaveId
          : saveSummaries[0]?.id;

        if (resumeSaveId) {
          applyGameState(await getGameState(resumeSaveId));
        }
      }
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setLoading(false);
    }
  }, [applyGameState]);

  const createGame = useCallback(async (playerName: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const state = await createNewGame(playerName);
      applyGameState(state);
      setNarration(null);
      setHint(null);
      setSaves(await listSaves());
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState]);

  const createCharacterGame = useCallback(async (payload: CharacterCreationPayload) => {
    setActionLoading(true);
    setError(null);
    try {
      const state = await createCharacterSave(payload);
      applyGameState(state);
      setNarration(null);
      setHint(null);
      setSaves(await listSaves());
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState]);

  const loadGame = useCallback(async (saveId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      applyGameState(await getGameState(saveId));
      setNarration(null);
      setHint(null);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState]);

  const deleteSave = useCallback(async (saveId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await deleteSaveApi(saveId);
      setSaves(result.saves);
      if (currentSaveId === saveId) {
        setCurrentSaveId(null);
        setGameState(null);
        gameStateRef.current = null;
        setNarration(null);
        setHint(null);
      }
      if (readStoredValue(LAST_SAVE_KEY) === saveId) {
        removeStoredValue(LAST_SAVE_KEY);
      }
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId]);

  const submitChoice = useCallback(async (choiceId: string) => {
    if (!currentSaveId) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({ saveId: currentSaveId, action: { type: "CHOICE_SELECT", choiceId }, llmConfig: getLlmConfigOrUndefined() });
      applyGameState(state);
      setNarration(null);
      setHint(null);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, getLlmConfigOrUndefined]);

  const submitText = useCallback(async (text: string) => {
    if (!currentSaveId) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({ saveId: currentSaveId, action: { type: "TEXT_SUBMIT", text }, llmConfig: getLlmConfigOrUndefined() });
      applyGameState(state);
      setRightPanelTab("feedback");
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, getLlmConfigOrUndefined]);

  const submitIntent = useCallback(async (intentId: string) => {
    if (!currentSaveId || !gameState?.currentScene?.id) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({
        saveId: currentSaveId,
        action: {
          type: "INTENT_SELECT",
          saveId: currentSaveId,
          sceneId: gameState.currentScene.id,
          intentId
        },
        llmConfig: getLlmConfigOrUndefined()
      });
      applyGameState(state);
      setNarration(null);
      setHint(null);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, gameState?.currentScene?.id, getLlmConfigOrUndefined]);

  const clearSelectedIntent = useCallback(() => {
    if (!gameState || !gameState.activeInteraction) {
      return;
    }
    forceSetGameState({
      ...gameState,
      activeInteraction: {
        ...gameState.activeInteraction,
        selectedIntentId: undefined
      }
    });
  }, [gameState, forceSetGameState]);

  const requestHint = useCallback(async () => {
    if (!currentSaveId) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      setHint(await requestHintApi({ saveId: currentSaveId, llmConfig: getLlmConfigOrUndefined() }));
      setRightPanelTab("lingua");
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, getLlmConfigOrUndefined]);

  const requestNarration = useCallback(async () => {
    if (!currentSaveId) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      setNarration(await requestNarrationApi({ saveId: currentSaveId, llmConfig: getLlmConfigOrUndefined() }));
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, getLlmConfigOrUndefined]);

  const resetCurrentGame = useCallback(async () => {
    if (!currentSaveId) {
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      applyGameState(await resetGame(currentSaveId));
      setNarration(null);
      setHint(null);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId]);

  const leaveGame = useCallback(() => {
    gameStateRef.current = null;
    setGameState(null);
    setCurrentSaveId(null);
    setNarration(null);
    setHint(null);
    removeStoredValue(LAST_SAVE_KEY);
    writeStoredValue(AUTO_RESUME_DISABLED_KEY, "true");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const closeModal = useCallback(() => {
    if (activeModalEvent && activeModalEvent.id) {
      markEventAsSeen(activeModalEvent.id);
    }
    setActiveModal(null);
    setActiveModalEvent(null);
  }, [activeModalEvent, markEventAsSeen]);

  const dismissToast = useCallback((id: string) => {
    setRewardToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showSessionSummary = useCallback(async () => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const summary = await getSessionSummary(currentSaveId);
      setSessionSummary(summary);
      setActiveModal("session-summary");
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId]);

  const refreshSideQuests = useCallback(async () => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await refreshSideQuestSuggestions(currentSaveId);
      applyGameState(state);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, applyGameState]);

  const acceptSideQuest = useCallback(async (suggestionId: string) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await acceptSideQuestSuggestion(currentSaveId, suggestionId);
      applyGameState(state);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, applyGameState]);

  const dismissSideQuest = useCallback(async (suggestionId: string) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await dismissSideQuestSuggestion(currentSaveId, suggestionId);
      applyGameState(state);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, applyGameState]);

  const generateQuestFromSuggestion = useCallback(async (suggestionId: string) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const llmConfig = getLlmConfigOrUndefined();
      const state = await apiGenerateQuestFromSuggestion(currentSaveId, suggestionId, llmConfig);
      applyGameState(state);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, applyGameState, getLlmConfigOrUndefined]);

  const generateReviewQuest = useCallback(async (params: { grammarIds?: string[]; vocabularyIds?: string[]; errorTags?: string[] }) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const llmConfig = getLlmConfigOrUndefined();
      const state = await apiGenerateReviewQuest(currentSaveId, params, llmConfig);
      applyGameState(state);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, applyGameState, getLlmConfigOrUndefined]);

  const acceptGeneratedQuest = useCallback(async (generatedQuestId: string) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await apiAcceptGeneratedQuest(currentSaveId, generatedQuestId);
      applyGameState(state);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, applyGameState]);

  const dismissGeneratedQuest = useCallback(async (generatedQuestId: string) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await apiDismissGeneratedQuest(currentSaveId, generatedQuestId);
      applyGameState(state);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, applyGameState]);

  const startGeneratedQuest = useCallback(async (generatedQuestId: string) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await apiStartGeneratedQuest(currentSaveId, generatedQuestId);
      applyGameState(state);
      setRightPanelTab("feedback");
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [currentSaveId, applyGameState]);

  const startConversation = useCallback(async (flowId: string) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({
        saveId: currentSaveId,
        action: {
          type: "START_CONVERSATION",
          saveId: currentSaveId,
          flowId,
          sceneId: gameState?.currentScene?.id
        },
        llmConfig: getLlmConfigOrUndefined()
      });
      applyGameState(state);
      setNarration(null);
      setHint(null);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, getLlmConfigOrUndefined, gameState]);

  const selectConversationOption = useCallback(async (optionId: string) => {
    if (!currentSaveId || !gameState?.activeConversation) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({
        saveId: currentSaveId,
        action: {
          type: "CONVERSATION_OPTION_SELECT",
          saveId: currentSaveId,
          flowId: gameState.activeConversation.flowId,
          nodeId: gameState.activeConversation.currentNodeId,
          optionId
        },
        llmConfig: getLlmConfigOrUndefined()
      });
      applyGameState(state);
      setNarration(null);
      setHint(null);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, getLlmConfigOrUndefined, gameState]);

  const submitConversationText = useCallback(async (text: string) => {
    if (!currentSaveId || !gameState?.activeConversation || !gameState.activeConversation.selectedOptionId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({
        saveId: currentSaveId,
        action: {
          type: "CONVERSATION_TEXT_SUBMIT",
          saveId: currentSaveId,
          flowId: gameState.activeConversation.flowId,
          nodeId: gameState.activeConversation.currentNodeId,
          optionId: gameState.activeConversation.selectedOptionId,
          answer: text
        },
        llmConfig: getLlmConfigOrUndefined()
      });
      applyGameState(state);
      setRightPanelTab("feedback");
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, getLlmConfigOrUndefined, gameState]);

  const exitConversation = useCallback(async () => {
    if (!currentSaveId || !gameState?.activeConversation) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({
        saveId: currentSaveId,
        action: {
          type: "CONVERSATION_EXIT",
          saveId: currentSaveId,
          flowId: gameState.activeConversation.flowId
        },
        llmConfig: getLlmConfigOrUndefined()
      });
      applyGameState(state);
      setNarration(null);
      setHint(null);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, getLlmConfigOrUndefined, gameState]);

  const submitFreeformAction = useCallback(async (text: string) => {
    if (!currentSaveId) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({
        saveId: currentSaveId,
        action: {
          type: "FREEFORM_ACTION_SUBMIT",
          saveId: currentSaveId,
          sceneId: gameState?.currentScene?.id,
          flowId: gameState?.activeConversation?.flowId,
          nodeId: gameState?.activeConversation?.currentNodeId,
          inputText: text
        },
        llmConfig: getLlmConfigOrUndefined()
      });
      applyGameState(state);
      setNarration(null);
      setHint(null);
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, getLlmConfigOrUndefined, gameState]);

  const submitFreeformLatin = useCallback(async (text: string) => {
    if (!currentSaveId || !gameState?.pendingFreeformLatin) return;
    setActionLoading(true);
    setError(null);
    try {
      const state = await submitGameAction({
        saveId: currentSaveId,
        action: { type: "FREEFORM_LATIN_SUBMIT", saveId: currentSaveId, pendingFreeformLatinId: gameState.pendingFreeformLatin.id, answer: text },
        llmConfig: getLlmConfigOrUndefined()
      });
      applyGameState(state);
      setRightPanelTab("feedback");
    } catch (err) {
      setError(messageFromError(err));
    } finally {
      setActionLoading(false);
    }
  }, [applyGameState, currentSaveId, getLlmConfigOrUndefined, gameState]);

  const value = useMemo(() => ({
    currentSaveId,
    gameState,
    saves,
    narration,
    hint,
    loading,
    actionLoading,
    error,
    selectedRightPanelTab,
    seenEventIds,
    activeModal,
    activeModalEvent,
    rewardToasts,
    sessionSummary,
    loadSaves,
    createGame,
    createCharacterGame,
    loadGame,
    deleteSave,
    submitChoice,
    submitText,
    submitIntent,
    clearSelectedIntent,
    requestHint,
    requestNarration,
    resetCurrentGame,
    leaveGame,
    clearError,
    setRightPanelTab,
    closeModal,
    dismissToast,
    showSessionSummary,
    forceSetGameState,
    refreshSideQuests,
    acceptSideQuest,
    dismissSideQuest,
    generateQuestFromSuggestion,
    generateReviewQuest,
    acceptGeneratedQuest,
    dismissGeneratedQuest,
    startGeneratedQuest,
    startConversation,
    selectConversationOption,
    submitConversationText,
    exitConversation,
    submitFreeformAction,
    submitFreeformLatin,
  }), [
    currentSaveId,
    gameState,
    saves,
    narration,
    hint,
    loading,
    actionLoading,
    error,
    selectedRightPanelTab,
    seenEventIds,
    activeModal,
    activeModalEvent,
    rewardToasts,
    sessionSummary,
    loadSaves,
    createGame,
    createCharacterGame,
    loadGame,
    deleteSave,
    submitChoice,
    submitText,
    submitIntent,
    clearSelectedIntent,
    requestHint,
    requestNarration,
    resetCurrentGame,
    leaveGame,
    clearError,
    closeModal,
    dismissToast,
    showSessionSummary,
    forceSetGameState,
    refreshSideQuests,
    acceptSideQuest,
    dismissSideQuest,
    generateQuestFromSuggestion,
    generateReviewQuest,
    acceptGeneratedQuest,
    dismissGeneratedQuest,
    startGeneratedQuest,
    startConversation,
    selectConversationOption,
    submitConversationText,
    exitConversation,
    submitFreeformAction,
  ]);

  return createElement(GameContext.Provider, { value }, children);
}

export function useGameStore(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameStore must be used inside GameProvider.");
  }
  return context;
}
