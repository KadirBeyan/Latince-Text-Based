import { FlagCheckered } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

export function ChapterProgressPanel() {
  const { gameState } = useGameStore();
  const chapter = gameState?.currentChapter;
  if (!gameState || !chapter) return null;
  const progress = gameState.chapterProgress?.[chapter.id];
  const percent = progress?.progressPercent ?? 0;
  const completed = progress?.completedSceneIds.length ?? 0;
  const total = chapter.quests.flatMap((quest) => quest.scenes).length;
  return (
    <section className="panel-card chapter-progress-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Progressus</p>
        <h3><FlagCheckered size={18} weight="duotone" /> {chapter.title}</h3>
      </div>
      <div className="progress-number">{percent}%</div>
      <div className="roman-progress"><span style={{ width: percent + "%" }} /></div>
      <div className="chapter-metrics">
        <small>{completed}/{total} scenes</small>
        <small>{progress?.completedQuestIds.length ?? 0}/{chapter.quests.length} quests</small>
        <small>{gameState.unlockedChapters?.length ?? 1} open</small>
      </div>
    </section>
  );
}
