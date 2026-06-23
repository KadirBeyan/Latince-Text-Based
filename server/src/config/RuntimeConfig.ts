import { ensureAppDirectories, getAppPaths, type AppPaths } from "./AppPaths";

export type RuntimeConfig = {
  isProduction: boolean;
  isDesktop: boolean;
  appVersion: string;
  appDataDir: string;
  paths: AppPaths;
  enableEditorWrites: boolean;
  enableAuthoringStudio: boolean;
  enableAuthoringWrites: boolean;
  enableLlmDrafts: boolean;
  enableDebugEndpoints: boolean;
  enableFileSystemModelScan: boolean;
};

export function getRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const isProduction = env.NODE_ENV === "production";
  const paths = ensureAppDirectories(getAppPaths());
  const editorFlag = env.VIA_PRIMA_ENABLE_EDITOR_WRITES;
  const authoringFlag = env.VIA_PRIMA_ENABLE_AUTHORING_STUDIO;
  const authoringWriteFlag = env.VIA_PRIMA_ENABLE_AUTHORING_WRITES;
  const llmDraftFlag = env.VIA_PRIMA_ENABLE_LLM_DRAFTS;
  const debugFlag = env.VIA_PRIMA_ENABLE_DEBUG_ENDPOINTS;
  const isDesktop = env.VIA_PRIMA_DESKTOP === "1" || env.TAURI_ENV_PLATFORM !== undefined;
  return {
    isProduction,
    isDesktop,
    appVersion: env.npm_package_version ?? "0.1.0",
    appDataDir: paths.appDataDir,
    paths,
    enableEditorWrites: isProduction ? editorFlag === "1" : editorFlag !== "0",
    enableAuthoringStudio: isProduction ? authoringFlag !== "0" : authoringFlag !== "0",
    enableAuthoringWrites: isProduction ? authoringWriteFlag === "1" || (isDesktop && authoringWriteFlag !== "0") : authoringWriteFlag !== "0",
    enableLlmDrafts: isProduction ? llmDraftFlag === "1" || (isDesktop && llmDraftFlag !== "0") : llmDraftFlag !== "0",
    enableDebugEndpoints: isProduction ? debugFlag === "1" : debugFlag !== "0",
    enableFileSystemModelScan: env.VIA_PRIMA_ENABLE_MODEL_SCAN !== "0",
  };
}
