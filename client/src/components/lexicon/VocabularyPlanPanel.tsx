import { useEffect, useState } from "react";
import { getChapterVocabulary, type LexicalEntryDto } from "../../api/lexiconApi";

export function VocabularyPlanPanel({ chapterId = "forum" }: { chapterId?: string }) {
  const [entries, setEntries] = useState<LexicalEntryDto[]>([]);
  useEffect(() => { void getChapterVocabulary(chapterId).then(setEntries).catch(() => setEntries([])); }, [chapterId]);
  return <section className="panel-card"><div className="panel-heading compact-heading"><p className="eyebrow">Magisterium</p><h3>Vocabulary Plan</h3></div><div className="latin-token-list">{entries.slice(0, 10).map((entry) => <div key={entry.id} className="latin-token-row"><strong>{entry.displayLemma}</strong><span>{entry.meanings.shortTr || entry.meanings.shortEn || entry.meanings.en[0]}</span><small>{entry.frequency.band} | {entry.pedagogy.estimatedLevel}</small></div>)}</div></section>;
}
