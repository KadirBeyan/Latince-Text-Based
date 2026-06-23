import { useEffect, useState } from "react";
import { EditorShell } from "./components/editor/EditorShell";
import { AuthoringStudio } from "./components/authoring/AuthoringStudio";
import { AppShell } from "./components/layout/AppShell";
import { StartScreen } from "./components/start/StartScreen";
import { GameProvider, useGameStore } from "./stores/gameStore";
import { SettingsProvider } from "./stores/settingsStore";
import { SessionSummaryModal } from "./components/game/SessionSummaryModal";
import { ErrorBoundary } from "./components/system/ErrorBoundary";
import { CinematicProvider } from "./components/cinematic/CinematicProvider";
import { CinematicStoreProvider } from "./stores/cinematicStore";

function AppContent() {
  const { gameState, loading, error, clearError, loadSaves } = useGameStore();
  const { setRightPanelTab } = useGameStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [authoringOpen, setAuthoringOpen] = useState(false);

  useEffect(() => {
    void loadSaves();
  }, [loadSaves]);
  useEffect(() => { const open = () => setEditorOpen(true); window.addEventListener("open-content-editor", open); return () => window.removeEventListener("open-content-editor", open); }, []);
  useEffect(() => { const open = () => setAuthoringOpen(true); window.addEventListener("open-authoring-studio", open); return () => window.removeEventListener("open-authoring-studio", open); }, []);
  useEffect(() => { const open = () => setRightPanelTab("settings"); window.addEventListener("open-systema-panel", open); return () => window.removeEventListener("open-systema-panel", open); }, [setRightPanelTab]);
  useEffect(() => { if (localStorage.getItem("via-prima-open-systema") === "1") { localStorage.removeItem("via-prima-open-systema"); setRightPanelTab("settings"); } }, [setRightPanelTab]);

  if (editorOpen && import.meta.env.DEV) return <EditorShell onClose={() => setEditorOpen(false)} />;
  if (authoringOpen) return <AuthoringStudio onClose={() => setAuthoringOpen(false)} />;

  return (
    <div className="app-root">
      {error ? (
        <div className="error-band" role="alert">
          <span>{error}</span>
          <button type="button" onClick={clearError}>Kapat</button>
        </div>
      ) : null}
      <CinematicProvider>
        {loading && !gameState ? <div className="loading-screen">Kayıtlar yoklanıyor...</div> : gameState ? <AppShell /> : <StartScreen />}
      </CinematicProvider>
      
      {gameState && (
        <>
          <SessionSummaryModal />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <GameProvider>
          <CinematicStoreProvider>
            <AppContent />
          </CinematicStoreProvider>
        </GameProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
