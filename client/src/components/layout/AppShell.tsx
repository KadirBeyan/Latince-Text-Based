import { GameScreen } from "../game/GameScreen";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <div className="app-shell">
      <TopBar />
      <LeftPanel />
      <main className="game-main">
        <GameScreen />
      </main>
      <RightPanel />
    </div>
  );
}
