import type { DialogueEntry } from "../../types/gameTypes";
import { useGameStore } from "../../stores/gameStore";
import { getSpeakerLabel } from "../../utils/displayLabels";

function formatTime(value?: string): string {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function entryClass(entry: DialogueEntry): string {
  if (entry.speakerId === "player") {
    return "dialogue-entry player-entry";
  }
  if (entry.speakerId === "system") {
    return "dialogue-entry system-entry";
  }
  return "dialogue-entry npc-entry";
}

export function DialogueLog() {
  const { gameState } = useGameStore();
  const entries = gameState?.dialogueLog ?? [];

  if (entries.length === 0) {
    return null;
  }

  const visibleEntries = entries.slice(-3);

  return (
    <details className="dialogue-log panel-card">
      <summary>
        <span>
          <span className="eyebrow">Dialogus</span>
          Konuşma kaydı
        </span>
        <small>Son {visibleEntries.length} kayıt</small>
      </summary>
      <div className="dialogue-scroll">
        {visibleEntries.map((entry, index) => (
          <article className={entryClass(entry)} key={entry.id || `${entry.speakerId}-${index}`}>
            <div className="dialogue-meta">
              <span>{getSpeakerLabel(entry.speakerId)}</span>
              <span>{entry.language || "system"}</span>
              <span>{formatTime(entry.timestamp)}</span>
            </div>
            <p>{entry.text}</p>
          </article>
        ))}
      </div>
    </details>
  );
}
