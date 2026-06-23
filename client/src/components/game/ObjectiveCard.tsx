import { useGameStore } from "../../stores/gameStore";

export function ObjectiveCard({ compact = false }: { compact?: boolean }) {
  const { gameState } = useGameStore();
  if (!gameState) {
    return null;
  }
  const scene = gameState.currentScene;
  const currentQuestId = gameState.currentQuest?.id;
  const generatedQuest = currentQuestId?.startsWith("gen_quest_")
    ? gameState.generatedQuests?.find((quest) => quest.id === currentQuestId)
    : undefined;
  const objective = scene.objective === "Review your progress." ? "İlerlemeni gözden geçir." : scene.objective;

  return (
    <section className={compact ? "objective-card objective-card-compact" : "objective-card panel-card"}>
      <div>
        <p className="eyebrow">Opus</p>
        <h3>{gameState.currentQuest?.title || "Aktif görev"}</h3>
        {generatedQuest ? <span className="mode-chip">Dinamik Görev · {generatedQuest.metadata?.generatedBy || "template"}</span> : null}
      </div>
      {!compact ? <p>{objective || gameState.currentQuest?.description || "Bu sahnenin görevini tamamla."}</p> : null}
      {!compact && generatedQuest?.reason ? <p style={{ opacity: 0.68, fontSize: "0.78rem" }}>{generatedQuest.reason}</p> : null}
      {scene.textChallenge?.prompt ? <p className="prompt-line">{scene.textChallenge.prompt}</p> : null}
      {!compact ? <span className="mode-chip">{scene.inputMode === "choice" ? "seçim" : scene.inputMode === "text" ? "yazılı cevap" : "karma"}</span> : null}
    </section>
  );
}
