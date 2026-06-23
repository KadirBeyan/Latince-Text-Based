import { useMemo, useState } from "react";
import type { NarrativeMoment } from "../../types/narrativeTypes";
import { useCinematicStore } from "../../stores/cinematicStore";
import { useGameStore } from "../../stores/gameStore";
import { mapEventsToNarrativeMoments } from "../../utils/narrativeMomentMapper";

const filters = ["Tümü", "Görevler", "Diyalog", "İlişkiler", "Öğrenme", "Dünya"] as const;
type Filter = typeof filters[number];

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function matches(moment: NarrativeMoment, filter: Filter): boolean {
  if (filter === "Tümü") return true;
  if (filter === "Görevler") return moment.type.includes("quest") || moment.type.includes("chapter") || moment.type === "reward";
  if (filter === "Diyalog") return moment.type.startsWith("dialogue");
  if (filter === "İlişkiler") return moment.type === "relationship-change" || moment.type === "npc-memory-added";
  if (filter === "Öğrenme") return moment.type === "level-up" || moment.type === "mastery-up";
  return moment.type === "world-event" || moment.type === "location-discovered";
}

export function MomentTimeline() {
  const { history } = useCinematicStore();
  const { gameState } = useGameStore();
  const [filter, setFilter] = useState<Filter>("Tümü");
  const moments = useMemo(() => {
    const recent = mapEventsToNarrativeMoments(gameState?.recentEvents ?? [], gameState, []);
    const byId = new Map<string, NarrativeMoment>();
    [...history, ...recent].forEach((moment) => byId.set(moment.id, moment));
    return [...byId.values()].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 50);
  }, [gameState, history]);
  const visible = moments.filter((moment) => matches(moment, filter));
  return (
    <section className="moment-timeline panel-card">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Eventa</p>
        <h3>Olay Akışı</h3>
      </div>
      <div className="timeline-filters" role="tablist" aria-label="Olay filtreleri">
        {filters.map((item) => <button type="button" className={item === filter ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}
      </div>
      {visible.length === 0 ? <p className="empty-state">Henüz gösterilecek olay yok.</p> : null}
      <div className="timeline-list">
        {visible.map((moment) => (
          <article className={`timeline-moment tone-${moment.tone}`} key={moment.id}>
            <div className="timeline-glyph" aria-hidden="true" />
            <div>
              <h4>{moment.titleTr}</h4>
              {moment.subtitleTr ? <p>{moment.subtitleTr}</p> : null}
              {moment.bodyTr ? <small>{moment.bodyTr}</small> : null}
              <time>{formatTime(moment.createdAt)}</time>
            </div>
          </article>
        ))}
      </div>
      {import.meta.env.DEV ? <details className="raw-event-details"><summary>Advanced raw events</summary><pre>{JSON.stringify(gameState?.recentEvents ?? [], null, 2)}</pre></details> : null}
    </section>
  );
}
