import type { GameState } from "../../types/gameTypes";

function latinLocation(locationId?: string): string {
  if (!locationId) return "SCRIPTORIUM ROMANUM";
  return locationId.replace(/[-_]/g, " ").toUpperCase();
}

export function SceneTitlePlate({ gameState }: { gameState: GameState }) {
  const scene = gameState.currentScene;
  const focus = scene.learningFocus;
  const mood = gameState.locationStates?.find((location) => location.locationId === scene.locationId)?.mood;
  return (
    <section className="scene-title-plate" aria-label="Sahne başlığı">
      <div className="scene-title-plate-line" aria-hidden="true" />
      <div>
        <p className="scene-title-location">{latinLocation(scene.locationId)}</p>
        <h2>{scene.title}</h2>
        {scene.objective ? <p className="scene-title-objective">Opus: {scene.objective}</p> : null}
        <div className="scene-title-badges" aria-label="Sahne etiketleri">
          {gameState.currentChapter?.title ? <span>{gameState.currentChapter.title}</span> : null}
          {mood ? <span>{mood}</span> : null}
          {focus?.grammarIds.slice(0, 2).map((id) => <span key={id}>Gramer: {id}</span>)}
          {focus?.vocabularyIds.slice(0, 2).map((id) => <span key={id}>Kelime: {id}</span>)}
        </div>
      </div>
    </section>
  );
}
