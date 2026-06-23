import { useGameStore } from "../../stores/gameStore";
import { ChapterCard } from "./ChapterCard";

export function CampaignMap() {
  const { gameState } = useGameStore();
  const campaign = gameState?.currentCampaign;
  if (!campaign) return null;
  return (
    <section className="panel-card campaign-map-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Campaign</p>
        <h3>{campaign.title}</h3>
      </div>
      <div className="campaign-map-list">
        {campaign.chapters.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
            active={chapter.id === gameState.currentChapter?.id}
            progress={gameState.chapterProgress?.[chapter.id]}
          />
        ))}
      </div>
    </section>
  );
}
