import { useGameStore } from "../../stores/gameStore";
import { getLocationLabel } from "../../utils/displayLabels";
import forumHero from "../../assets/roman-forum-hero.png";
import magisterPortrait from "../../assets/magister-portrait.png";

export function ScenePanel() {
  const { gameState, narration } = useGameStore();
  const scene = gameState?.currentScene;
  if (!scene || !gameState) {
    return null;
  }

  const sceneTitle = scene.title.trim().toUpperCase() === "LESSON COMPLETE" ? "LECTIO PERFECTA" : scene.title;
  const sceneDescription = scene.description === "Magister Aelius nods. The first lesson is complete, and the wax now holds your first Latin words."
    ? "Magister Aelius başını onaylayarak sallıyor. İlk ders tamamlandı; balmumu artık ilk Latince sözlerini taşıyor."
    : scene.description;

  const currentLocId = scene.locationId;
  const locationState = gameState.locationStates?.find(l => l.locationId === currentLocId);
  const mood = narration?.worldMoodTr || locationState?.mood;

  return (
    <section className="scene-card">
      <div className="scene-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(9,8,6,.15), rgba(9,8,6,.78)), url(${forumHero})` }}>
        <div className="scene-meta-row">
          {gameState.currentQuest?.id?.startsWith("gen_quest_") ? (
            <span className="scene-badge scene-badge--gold">Dinamik görev</span>
          ) : (
            <span className="scene-badge">Actus I / Caput III</span>
          )}
          {gameState.currentQuest?.title ? <span className="scene-badge">{gameState.currentQuest.title}</span> : null}
        </div>
        <h2 className="scene-title">{sceneTitle}</h2>
        <p className="scene-subtitle">
          <span>{getLocationLabel(scene.locationId)} · Roma, mane</span>
          {mood ? <span className="scene-badge scene-badge--gold">{mood}</span> : null}
        </p>
      </div>
      <div className="parchment-card narrative-scroll">
        <p className="scene-description dropcap">{narration?.narrationTr || sceneDescription}</p>
      </div>
      {narration?.npcLineLatin ? (
        <div className="npc-dialogue-card">
          <div className="npc-medallion-wrap">
            <img className="npc-medallion" src={magisterPortrait} alt="Magister" />
            <span className="npc-nameplate">Magister</span>
          </div>
          <div className="npc-speech">
            <p className="latin-quote">{narration.npcLineLatin}</p>
            {narration.npcLineTr ? <p className="translation-text">{narration.npcLineTr}</p> : null}
          </div>
        </div>
      ) : null}
      {narration?.objectiveReminderTr ? <p className="objective-reminder">{narration.objectiveReminderTr}</p> : null}

    </section>
  );
}
