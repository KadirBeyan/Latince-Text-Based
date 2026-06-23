import { useGameStore } from "../../stores/gameStore";

function formatDate(value?: string): string {
  if (!value) {
    return "Tarih yok";
  }
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function SaveList() {
  const { saves, loadGame, actionLoading, loading } = useGameStore();

  return (
    <section className="save-list">
      <div className="panel-heading">
        <p className="eyebrow">Memoria</p>
        <h2>Kayıtlı oyunlar</h2>
      </div>
      {loading ? <p className="muted">Kayıtlar yükleniyor...</p> : null}
      {!loading && saves.length === 0 ? <p className="empty-state">Henüz kayıtlı oyun yok.</p> : null}
      <div className="save-items">
        {saves.map((save) => (
          <article className="save-item" key={save.id}>
            <div>
              <h3>{save.playerName}</h3>
              <p>{save.level ? `Lv ${save.level}` : "Seviye bilgisi yok"}{typeof save.xp === "number" ? ` · ${save.xp} XP` : ""}</p>
              <small>{formatDate(save.updatedAt)}</small>
            </div>
            <button type="button" onClick={() => void loadGame(save.id)} disabled={actionLoading}>Devam Et</button>
          </article>
        ))}
      </div>
    </section>
  );
}
