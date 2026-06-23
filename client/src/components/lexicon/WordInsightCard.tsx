import type { LexicalEntryDto } from "../../api/lexiconApi";

export function WordInsightCard({ entry }: { entry?: LexicalEntryDto | null }) {
  if (!entry) return <p className="empty-state">Kelime seçilmedi.</p>;
  return (
    <article className="latin-token-row">
      <strong>{entry.displayLemma}</strong>
      <span>{entry.meanings.shortTr || entry.meanings.shortEn || entry.meanings.en[0] || "?"}</span>
      <small>{entry.pos} | {entry.frequency.band}{entry.frequency.rank ? ` #${entry.frequency.rank}` : ""} | {entry.pedagogy.estimatedLevel} | priority {entry.pedagogy.priority}</small>
      <small>{entry.forms.slice(0, 6).map((form) => form.form).join(", ")}</small>
    </article>
  );
}
