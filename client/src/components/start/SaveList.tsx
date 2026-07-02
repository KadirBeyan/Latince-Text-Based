import { Trash } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

function formatDate(value?: string): string {
  if (!value) {
    return "Tarih yok";
  }
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function SaveList() {
  const { saves, loadGame, deleteSave, actionLoading, loading } = useGameStore();

  function confirmDelete(saveId: string, playerName: string): void {
    if (window.confirm(`${playerName} kaydını kalıcı olarak silmek istiyor musun?`)) {
      void deleteSave(saveId);
    }
  }

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
            <div className="save-actions">
              <button type="button" onClick={() => void loadGame(save.id)} disabled={actionLoading}>Devam Et</button>
              <button
                type="button"
                className="save-delete-button"
                onClick={() => confirmDelete(save.id, save.playerName)}
                disabled={actionLoading}
                aria-label={`${save.playerName} kaydını sil`}
                title="Kaydı sil"
              >
                <Trash size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
