import { useEffect, useState } from "react";
import { clearCache, getCacheStats, type CacheStats } from "../../api/systemApi";

export function CachePanel() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [message, setMessage] = useState("");
  async function refresh() { setStats(await getCacheStats()); }
  useEffect(() => { void refresh(); }, []);
  async function clear() { const result = await clearCache(); setStats(result.stats); setMessage("Cache temizlendi."); }
  return (
    <section className="panel-card system-card">
      <div className="panel-heading compact-heading"><p className="eyebrow">Cache</p><h3>Performans önbelleği</h3></div>
      <p className="empty-state">Keys: {stats?.keys ?? 0} | Hits: {stats?.hits ?? 0} | Misses: {stats?.misses ?? 0}</p>
      <div className="settings-actions"><button type="button" onClick={() => void refresh()}>Yenile</button><button type="button" onClick={() => void clear()}>Cache Temizle</button></div>
      {message ? <p className="test-result success">{message}</p> : null}
    </section>
  );
}
