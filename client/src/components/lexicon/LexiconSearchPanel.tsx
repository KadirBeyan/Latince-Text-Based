import { useState } from "react";
import { lookupLexicon, type LexicalEntryDto } from "../../api/lexiconApi";
import { WordInsightCard } from "./WordInsightCard";

export function LexiconSearchPanel() {
  const [query, setQuery] = useState("amo");
  const [entry, setEntry] = useState<LexicalEntryDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function runSearch() { setError(null); try { const result = await lookupLexicon(query); setEntry(result.best?.entry || null); } catch (err) { setError(err instanceof Error ? err.message : "Lookup failed."); } }
  return (
    <section className="panel-card latin-analysis-panel">
      <div className="panel-heading compact-heading"><p className="eyebrow">Lingua</p><h3>Lexicon</h3></div>
      <div className="inline-form"><input value={query} onChange={(event) => setQuery(event.target.value)} /><button type="button" onClick={runSearch}>Ara</button></div>
      {error ? <p className="danger">{error}</p> : null}
      <WordInsightCard entry={entry} />
    </section>
  );
}
