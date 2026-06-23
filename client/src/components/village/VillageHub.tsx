import { useGameStore } from "../../stores/gameStore";
import { VillageTimeBadge } from "./VillageTimeBadge";
import { VillageActivityBoard } from "./VillageActivityBoard";
import { VillageLocationList } from "./VillageLocationList";
import { VillageNpcPresencePanel } from "./VillageNpcPresencePanel";
import { VillageRoutineTimeline } from "./VillageRoutineTimeline";
import { VillageDaySummary } from "./VillageDaySummary";
import { VillagePathPressurePanel } from "./VillagePathPressurePanel";
import { VillageRestPanel } from "./VillageRestPanel";
import forumHero from "../../assets/roman-forum-hero.png";

export function VillageHub() {
  const { gameState, submitChoice, startConversation } = useGameStore();

  if (!gameState || !gameState.villageLife) {
    return null;
  }

  const { villageLife, availableChoices, currentScene, player } = gameState;
  const { dayState } = villageLife;

  // Header and image mapping (optional: we can use a generic hero background or customize per location)
  const locationBannerImages: Record<string, string> = {
    home_hut: forumHero, // fallback to forum hero or other assets if we have them
    village_path: forumHero,
    village_market: forumHero,
    field_edge: forumHero,
    teacher_corner: forumHero,
    veteran_bench: forumHero,
    scribe_table: forumHero,
    shrine: forumHero
  };

  const bannerImg = (currentScene.locationId && locationBannerImages[currentScene.locationId]) || forumHero;

  return (
    <div className="village-hub-container">
      {/* 1. Header Banner */}
      <section className="scene-card village-banner-card">
        <div
          className="scene-hero village-hero"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(9,8,6,.15), rgba(9,8,6,.78)), url(${bannerImg})`
          }}
        >
          <div className="scene-meta-row">
            <span className="scene-badge scene-badge--gold">RUSTICA VITA · KÖY HAYATI</span>
            <span className="scene-badge">Gün {dayState.dayNumber}</span>
          </div>
          <h2 className="scene-title">{currentScene.title}</h2>
          <p className="scene-subtitle">
            <span>Latince Köy Hayatı RPG Simülasyonu</span>
          </p>
        </div>
        <div className="parchment-card narrative-scroll">
          <p className="scene-description dropcap">{currentScene.description}</p>
        </div>
      </section>

      {/* 2. Main Grid Layout */}
      <div className="village-grid-layout">
        {/* Left Column: Interactions and Traveling */}
        <div className="village-grid-left">
          <VillageActivityBoard
            activities={villageLife.availableActivities || []}
            availableChoices={availableChoices}
            onSubmitChoice={submitChoice}
            onStartConversation={startConversation}
            actionsUsed={dayState.actionsUsedThisPeriod}
            maxActions={dayState.maxActionsPerPeriod}
          />
          
          <VillageLocationList
            availableChoices={availableChoices}
            onSubmitChoice={submitChoice}
            currentLocationId={currentScene.locationId}
          />
        </div>

        {/* Right Column: Stats, Time, and History */}
        <div className="village-grid-right">
          <VillageTimeBadge
            dayNumber={dayState.dayNumber}
            timeOfDay={dayState.timeOfDay}
            actionsUsed={dayState.actionsUsedThisPeriod}
            maxActions={dayState.maxActionsPerPeriod}
          />

          <VillageRestPanel
            availableChoices={availableChoices}
            onSubmitChoice={submitChoice}
            locationId={currentScene.locationId}
            dayNumber={dayState.dayNumber}
          />

          <VillageNpcPresencePanel
            nearbyNpcIds={villageLife.nearbyNpcs || []}
          />

          <VillagePathPressurePanel
            lifePathHints={player?.characterProfile?.lifePathHints}
          />

          <VillageRoutineTimeline
            dayState={dayState}
          />

          <VillageDaySummary
            villageLife={villageLife}
          />
        </div>
      </div>
    </div>
  );
}
