import fs from "node:fs";
import type { AppPaths } from "../config/AppPaths";

export type DesktopSettings = {
  llm: {
    provider: "ollama" | "lmstudio" | "openai" | "custom";
    baseUrl: string;
    model: string;
    temperature: number;
    apiKey?: string;
    timeoutMs?: number;
    useLlm?: boolean;
  };
  paths: {
    ollamaModelsPath: string;
    lmStudioModelsPaths: string[];
  };
  ui: {
    theme: string;
  };
  desktop: {
    autoStartBackend: boolean;
    autoDiscoverModels: boolean;
  };
};

export const DEFAULT_DESKTOP_SETTINGS: DesktopSettings = {
  llm: {
    provider: "ollama",
    baseUrl: "http://localhost:11434/v1",
    model: "",
    temperature: 0.2,
    timeoutMs: 30000,
    useLlm: false,
  },
  paths: {
    ollamaModelsPath: `${process.env.HOME ?? ""}/.ollama/models`,
    lmStudioModelsPaths: [
      `${process.env.HOME ?? ""}/.cache/lm-studio/models`,
      `${process.env.HOME ?? ""}/.lmstudio/models`,
    ],
  },
  ui: { theme: "premium-rome" },
  desktop: { autoStartBackend: true, autoDiscoverModels: true },
};

export class SettingsService {
  constructor(private readonly paths: AppPaths) {}

  read(): DesktopSettings {
    if (!fs.existsSync(this.paths.settingsPath)) return DEFAULT_DESKTOP_SETTINGS;
    const parsed = JSON.parse(fs.readFileSync(this.paths.settingsPath, "utf8")) as Partial<DesktopSettings>;
    return this.merge(parsed);
  }

  write(settings: DesktopSettings): DesktopSettings {
    const next = this.merge(settings);
    fs.writeFileSync(this.paths.settingsPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    return next;
  }

  export(): { settings: DesktopSettings; exportedAt: string } {
    return { settings: this.read(), exportedAt: new Date().toISOString() };
  }

  import(payload: unknown): DesktopSettings {
    const candidate = this.unwrap(payload);
    return this.write(candidate);
  }

  private unwrap(payload: unknown): DesktopSettings {
    if (!payload || typeof payload !== "object") throw new Error("Invalid settings payload.");
    const record = payload as { settings?: unknown };
    return (record.settings ?? payload) as DesktopSettings;
  }

  private merge(partial: Partial<DesktopSettings>): DesktopSettings {
    return {
      llm: { ...DEFAULT_DESKTOP_SETTINGS.llm, ...(partial.llm ?? {}) },
      paths: { ...DEFAULT_DESKTOP_SETTINGS.paths, ...(partial.paths ?? {}) },
      ui: { ...DEFAULT_DESKTOP_SETTINGS.ui, ...(partial.ui ?? {}) },
      desktop: { ...DEFAULT_DESKTOP_SETTINGS.desktop, ...(partial.desktop ?? {}) },
    };
  }
}
