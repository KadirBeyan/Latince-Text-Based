import { useGameStore } from "../../stores/gameStore";

export function ChoicePanel() {
  const { gameState, submitChoice, actionLoading } = useGameStore();
  const choices = gameState?.availableChoices ?? [];

  if (choices.length === 0) {
    return null;
  }

  return (
    <section className="choice-panel panel-card">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Elige</p>
        <h3>Nasıl ilerleyeceksin?</h3>
      </div>
      <div className="choice-list">
        {choices.map((choice, index) => (
          <button className="choice-button cinematic-choice-card" style={{ animationDelay: `${index * 70}ms` }} type="button" key={choice.id} disabled={actionLoading} onClick={() => void submitChoice(choice.id)}>
            <span>{choice.label}</span>
            <small>{choice.description ?? "Bu niyetle sahnede ilerle."}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
