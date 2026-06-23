import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LlmProvider, LlmProviderConfig } from "../types/gameTypes";
import { discoverLocalModels, type DiscoveredModel, type ModelDiscoveryError } from "../api/llmApi";
import { getDesktopSettings, putDesktopSettings } from "../api/systemApi";
import { getDefaultModelPaths } from "../api/tauriApi";

export type LlmSettings = {
  useLlm: boolean;
  provider: LlmProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  timeoutMs: number;
  ollamaModelsPath: string;
  lmStudioModelsPaths: string[];
  autoDiscoverModels: boolean;
  cinematicOverlays: boolean;
  sceneTransitions: boolean;
  rewardAnimations: boolean;
  narrativeToasts: boolean;
  reducedMotionMode: "system" | "on" | "off";
};

type SettingsContextValue = {
  settings: LlmSettings;
  updateSettings: (partial: Partial<LlmSettings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (raw: string) => Promise<void>;
  getLlmConfigOrUndefined: () => LlmProviderConfig | undefined;
  discoveredModels: DiscoveredModel[];
  discoveryErrors: ModelDiscoveryError[];
  discoveryLoading: boolean;
  discoveryAttempted: boolean;
  refreshModels: () => Promise<void>;
};

const STORAGE_KEY = "via-prima-settings";

export const DEFAULT_SETTINGS: LlmSettings = {
  useLlm: false,
  provider: "ollama",
  baseUrl: "http://localhost:11434/v1",
  apiKey: "",
  model: "gemma3:4b",
  temperature: 0.2,
  timeoutMs: 30000,
  ollamaModelsPath: "/Users/kadirbeyan/.ollama/models",
  lmStudioModelsPaths: [
    "/Users/kadirbeyan/.cache/lm-studio/models",
    "/Users/kadirbeyan/.lmstudio/models",
  ],
  autoDiscoverModels: true,
  cinematicOverlays: true,
  sceneTransitions: true,
  rewardAnimations: true,
  narrativeToasts: true,
  reducedMotionMode: "system",
};

const providerBaseUrls: Record<LlmProvider, string> = {
  ollama: "http://localhost:11434/v1",
  lmstudio: "http://localhost:1234/v1",
  openai: "https://api.openai.com/v1",
  custom: DEFAULT_SETTINGS.baseUrl,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

type DesktopSettingsPayload = {
  llm?: Partial<Pick<LlmSettings, "provider" | "baseUrl" | "model" | "temperature" | "apiKey" | "timeoutMs" | "useLlm">>;
  paths?: Partial<Pick<LlmSettings, "ollamaModelsPath" | "lmStudioModelsPaths">>;
  desktop?: Partial<Pick<LlmSettings, "autoDiscoverModels">>;
  ui?: Partial<Pick<LlmSettings, "cinematicOverlays" | "sceneTransitions" | "rewardAnimations" | "narrativeToasts" | "reducedMotionMode">>;
};

function loadInitialSettings(): LlmSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<LlmSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LlmSettings>(() => loadInitialSettings());
  const [discoveredModels, setDiscoveredModels] = useState<DiscoveredModel[]>([]);
  const [discoveryErrors, setDiscoveryErrors] = useState<ModelDiscoveryError[]>([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [discoveryAttempted, setDiscoveryAttempted] = useState(false);

  const persist = useCallback((next: LlmSettings) => {
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    void putDesktopSettings(toDesktopPayload(next)).catch(() => undefined);
  }, []);

  const updateSettings = useCallback((partial: Partial<LlmSettings>) => {
    setSettings((current) => {
      const next: LlmSettings = { ...current, ...partial };
      if (partial.provider && partial.provider !== current.provider && partial.provider !== "custom") {
        next.baseUrl = providerBaseUrls[partial.provider];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      void putDesktopSettings(toDesktopPayload(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => persist(DEFAULT_SETTINGS), [persist]);

  const exportSettings = useCallback(() => JSON.stringify(toDesktopPayload(settings), null, 2), [settings]);

  const importSettings = useCallback(async (raw: string) => {
    const parsed = JSON.parse(raw) as DesktopSettingsPayload | LlmSettings;
    const next = "llm" in parsed || "paths" in parsed ? fromDesktopPayload(parsed as DesktopSettingsPayload) : { ...DEFAULT_SETTINGS, ...(parsed as Partial<LlmSettings>) };
    const saved = await putDesktopSettings(toDesktopPayload(next)).catch(() => toDesktopPayload(next));
    persist(fromDesktopPayload(saved));
  }, [persist]);

  const getLlmConfigOrUndefined = useCallback((): LlmProviderConfig | undefined => {
    if (!settings.useLlm) {
      return undefined;
    }
    const config: LlmProviderConfig = {
      provider: settings.provider,
      baseUrl: settings.baseUrl.trim(),
      model: settings.model.trim(),
      temperature: settings.temperature,
      timeoutMs: settings.timeoutMs,
    };
    if (settings.apiKey.trim()) {
      config.apiKey = settings.apiKey.trim();
    }
    return config;
  }, [settings]);

  const refreshModels = useCallback(async () => {
    setDiscoveryLoading(true);
    setDiscoveryErrors([]);
    try {
      const ollamaBaseUrl = settings.provider === "ollama"
        ? settings.baseUrl
        : providerBaseUrls.ollama;
      const result = await discoverLocalModels({
        ollamaBaseUrl,
        ollamaModelsPath: settings.ollamaModelsPath.trim() || undefined,
        lmStudioModelsPaths: settings.lmStudioModelsPaths.map((item) => item.trim()).filter(Boolean),
      });
      setDiscoveredModels(result.models);
      setDiscoveryErrors(result.errors);
    } catch (error) {
      setDiscoveredModels([]);
      setDiscoveryErrors([{ provider: "all", message: error instanceof Error ? error.message : "Model taraması başarısız." }]);
    } finally {
      setDiscoveryAttempted(true);
      setDiscoveryLoading(false);
    }
  }, [settings.baseUrl, settings.lmStudioModelsPaths, settings.ollamaModelsPath, settings.provider]);

  useEffect(() => {
    if (settings.autoDiscoverModels) void refreshModels();
  }, []);

  useEffect(() => {
    void getDesktopSettings<DesktopSettingsPayload>()
      .then((remote) => {
        const next = fromDesktopPayload(remote);
        setSettings(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    void getDefaultModelPaths()
      .then((paths) => {
        if (paths.length < 3) return;
        setSettings((current) => {
          const next = {
            ...current,
            ollamaModelsPath: current.ollamaModelsPath || paths[0],
            lmStudioModelsPaths: current.lmStudioModelsPaths.length > 0 ? current.lmStudioModelsPaths : paths.slice(1),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          void putDesktopSettings(toDesktopPayload(next)).catch(() => undefined);
          return next;
        });
      })
      .catch(() => undefined);
  }, []);

  const value = useMemo(() => ({
    settings, updateSettings, resetSettings, exportSettings, importSettings, getLlmConfigOrUndefined,
    discoveredModels, discoveryErrors, discoveryLoading, discoveryAttempted, refreshModels,
  }), [settings, updateSettings, resetSettings, exportSettings, importSettings, getLlmConfigOrUndefined, discoveredModels, discoveryErrors, discoveryLoading, discoveryAttempted, refreshModels]);

  return createElement(SettingsContext.Provider, { value }, children);
}

function toDesktopPayload(settings: LlmSettings): DesktopSettingsPayload {
  return {
    llm: {
      provider: settings.provider,
      baseUrl: settings.baseUrl,
      model: settings.model,
      temperature: settings.temperature,
      apiKey: settings.apiKey,
      timeoutMs: settings.timeoutMs,
      useLlm: settings.useLlm,
    },
    paths: {
      ollamaModelsPath: settings.ollamaModelsPath,
      lmStudioModelsPaths: settings.lmStudioModelsPaths,
    },
    ui: {
      theme: "premium-rome",
      cinematicOverlays: settings.cinematicOverlays,
      sceneTransitions: settings.sceneTransitions,
      rewardAnimations: settings.rewardAnimations,
      narrativeToasts: settings.narrativeToasts,
      reducedMotionMode: settings.reducedMotionMode,
    },
    desktop: { autoDiscoverModels: settings.autoDiscoverModels },
  } as DesktopSettingsPayload;
}

function fromDesktopPayload(payload: DesktopSettingsPayload): LlmSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...(payload.llm ?? {}),
    ollamaModelsPath: payload.paths?.ollamaModelsPath ?? DEFAULT_SETTINGS.ollamaModelsPath,
    lmStudioModelsPaths: payload.paths?.lmStudioModelsPaths ?? DEFAULT_SETTINGS.lmStudioModelsPaths,
    autoDiscoverModels: payload.desktop?.autoDiscoverModels ?? DEFAULT_SETTINGS.autoDiscoverModels,
    cinematicOverlays: payload.ui?.cinematicOverlays ?? DEFAULT_SETTINGS.cinematicOverlays,
    sceneTransitions: payload.ui?.sceneTransitions ?? DEFAULT_SETTINGS.sceneTransitions,
    rewardAnimations: payload.ui?.rewardAnimations ?? DEFAULT_SETTINGS.rewardAnimations,
    narrativeToasts: payload.ui?.narrativeToasts ?? DEFAULT_SETTINGS.narrativeToasts,
    reducedMotionMode: payload.ui?.reducedMotionMode ?? DEFAULT_SETTINGS.reducedMotionMode,
  };
}

export function useSettingsStore(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsStore must be used inside SettingsProvider.");
  }
  return context;
}
