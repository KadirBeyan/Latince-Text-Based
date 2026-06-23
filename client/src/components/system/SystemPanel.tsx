import { DebugPanel } from "../debug/DebugPanel";
import { LlmSettingsPanel } from "../panels/LlmSettingsPanel";
import { BackupRestorePanel } from "./BackupRestorePanel";
import { CachePanel } from "./CachePanel";
import { DesktopInfoPanel } from "./DesktopInfoPanel";
import { SaveIntegrityPanel } from "./SaveIntegrityPanel";
import { LexiconImportPanel } from "../lexicon/LexiconImportPanel";
import { LexiconStatsPanel } from "../lexicon/LexiconStatsPanel";
import { ContentOverridesPanel } from "./ContentOverridesPanel";
import { CinematicPreferencesPanel } from "./CinematicPreferencesPanel";

export function SystemPanel() {
  return (
    <div className="system-panel-stack">
      <DesktopInfoPanel />
      <CinematicPreferencesPanel />
      <LlmSettingsPanel />
      <BackupRestorePanel />
      <ContentOverridesPanel />
      <SaveIntegrityPanel />
      <LexiconImportPanel />
      <LexiconStatsPanel />
      <CachePanel />
      {import.meta.env.DEV ? <DebugPanel /> : null}
    </div>
  );
}
