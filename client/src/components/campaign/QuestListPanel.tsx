import { Scroll, Sparkle, Target } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

const labelFor = (type?: string) => type === "side" ? "Side" : type === "review" ? "Review" : "Main";
const iconFor = (type?: string) => type === "side" ? <Sparkle size={15} weight="duotone" /> : type === "review" ? <Scroll size={15} weight="duotone" /> : <Target size={15} weight="duotone" />;

export function QuestListPanel() {
  const { gameState } = useGameStore();
  const chapter = gameState?.currentChapter;
  if (!chapter || !gameState) return null;
  const generated = gameState.generatedQuests || [];
  return (
    <section className="panel-card quest-list-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Quests</p>
        <h3>{chapter.title}</h3>
      </div>
      <div className="quest-list-rows">
        {chapter.quests.map((quest) => {
          const type = (quest as typeof quest & { type?: string }).type;
          const active = quest.id === gameState.currentQuest?.id;
          return (
            <div className={"quest-row " + (active ? "active" : "")} key={quest.id}>
              <span>{iconFor(type)}</span>
              <div>
                <strong>{quest.title}</strong>
                <small>{labelFor(type)} · {quest.scenes.length} scenes</small>
              </div>
            </div>
          );
        })}
        {generated.map((quest) => (
          <div className="quest-row generated" key={quest.id}>
            <span><Sparkle size={15} weight="fill" /></span>
            <div>
              <strong>{quest.title}</strong>
              <small>Generated · {quest.status}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
