import { useEffect, useState } from "react";
import { getLexiconStats, type LexiconStats } from "../../api/lexiconApi";

export function LexiconStatsPanel() {
  const [stats, setStats] = useState<LexiconStats | null>(null);
  useEffect(() => { void getLexiconStats().then(setStats).catch(() => setStats(null)); }, []);
  return <section className="panel-card"><div className="panel-heading compact-heading"><p className="eyebrow">Systema</p><h3>Lexicon Stats</h3></div>{stats ? <div className="latin-token-list"><div className="latin-token-row"><strong>{stats.entryCount}</strong><span>entries</span><small>{stats.formCount} forms</small></div><div className="latin-token-row"><strong>POS</strong><small>{Object.entries(stats.posCounts).map(([key, value]) => `${key}:${value}`).join(", ")}</small></div><div className="latin-token-row"><strong>Levels</strong><small>{Object.entries(stats.levelCounts).map(([key, value]) => `${key}:${value}`).join(", ")}</small></div></div> : <p className="empty-state">Lexicon boş veya server kapalı.</p>}</section>;
}
