import type { ReactNode } from "react";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { SceneTitlePlate } from "./SceneTitlePlate";

export function SceneTransition({ children }: { children: ReactNode }) {
  const { gameState } = useGameStore();
  const { settings } = useSettingsStore();
  if (!gameState) return <>{children}</>;
  const animated = settings.sceneTransitions && settings.reducedMotionMode !== "on";
  return (
    <div key={gameState.currentScene.id} className={animated ? "scene-transition" : "scene-transition reduced"}>
      <SceneTitlePlate gameState={gameState} />
      <div className="scene-transition-body">{children}</div>
    </div>
  );
}
