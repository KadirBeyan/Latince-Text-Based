import { DotsThree, GearSix } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { getLocationLabel } from "../../utils/displayLabels";

export function TopBar() {
  const { gameState, actionLoading, requestNarration, resetCurrentGame, leaveGame, setRightPanelTab, showSessionSummary } = useGameStore();
  const { settings } = useSettingsStore();
  const player = gameState?.player;
  const currency = player?.currency ?? 0;
  const streak = player?.streak?.current ?? 0;
  const xp = player?.xp ?? 0;
  const level = player?.level ?? 1;
  const xpIntoLevel = xp % 100;
  const contextTitle = gameState?.currentQuest?.title ?? gameState?.currentScene?.title ?? "Ludus";
  const contextLocation = getLocationLabel(gameState?.currentScene?.locationId);

  return (
    <header className="top-bar">
      <div className="top-context" aria-live="polite">
        <strong>{contextTitle}</strong>
        <span>{contextLocation}</span>
      </div>
      <div className="top-stats" aria-label="Oyuncu durumu">
        <span className="top-metric"><small>Level</small><strong>{level}</strong></span>
        <span className="top-metric"><small>XP</small><strong>{xpIntoLevel}/100</strong></span>
        <span className="top-metric"><small>Denarii</small><strong>{currency}</strong></span>
        {streak > 0 && <span className="top-metric"><small>Seri</small><strong>{streak}</strong></span>}
        <span className={settings.useLlm ? "status-pill is-on" : "status-pill"}><small>LLM</small><strong>{settings.useLlm ? "Açık" : "Kapalı"}</strong></span>
      </div>
      <div className="top-actions">
        <button className="top-icon-button" type="button" onClick={() => setRightPanelTab("settings")} aria-label="Ayarlar sekmesini aç" title="Systema"><GearSix size={19} weight="bold" /></button>
        <details className="top-overflow">
          <summary aria-label="Diğer işlemler"><DotsThree size={22} weight="bold" /></summary>
          <div>
            <button type="button" onClick={() => void requestNarration()} disabled={actionLoading}>Narratio</button>
            <button type="button" onClick={() => void showSessionSummary()} disabled={actionLoading}>Oturum Özeti</button>
            <button type="button" onClick={() => setRightPanelTab("tabula")}>Raporlar</button>
            <button type="button" onClick={() => window.dispatchEvent(new Event("open-authoring-studio"))}>Authoring</button>
            {import.meta.env.DEV ? <button type="button" onClick={() => window.dispatchEvent(new Event("open-content-editor"))}>Editor</button> : null}
            <button type="button" onClick={leaveGame} disabled={actionLoading}>Ana Menü</button>
            <button type="button" onClick={() => void resetCurrentGame()} disabled={actionLoading}>Oyunu Sıfırla</button>
          </div>
        </details>
      </div>
    </header>
  );
}
