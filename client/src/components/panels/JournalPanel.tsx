import { useGameStore } from "../../stores/gameStore";

function formatDate(value?: string): string {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function JournalPanel() {
  const { gameState } = useGameStore();
  const entries = gameState?.journalEntries ?? [];

  return (
    <section className="panel-card journal-panel parchment-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Diarium</p>
        <h3>Diarium</h3>
      </div>
      {entries.length === 0 ? <p className="empty-state">Henüz günlük kaydı yok.</p> : null}
      {entries.map((entry, index) => (
        <article className="journal-entry" key={entry.id || `${entry.title}-${index}`}>
          <h4>{entry.title}</h4>
          <p>{entry.text || entry.body}</p>
          <small>{formatDate(entry.createdAt || entry.timestamp)}</small>
        </article>
      ))}
    </section>
  );
}
