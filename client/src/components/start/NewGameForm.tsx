import { useState } from "react";
import { useGameStore } from "../../stores/gameStore";

export function NewGameForm() {
  const { createGame, actionLoading } = useGameStore();
  const [playerName, setPlayerName] = useState("");

  const canSubmit = playerName.trim().length > 0 && !actionLoading;

  return (
    <form className="new-game-form" onSubmit={(event) => {
      event.preventDefault();
      if (canSubmit) {
        void createGame(playerName.trim());
      }
    }}>
      <div className="panel-heading">
        <p className="eyebrow">Initium</p>
        <h2>Yeni Yolculuk</h2>
        <p>Kısa seviye testini şimdi yapabilir veya doğrudan başlayabilirsin.</p>
      </div>
      <label>
        Oyuncu adı
        <input className="parchment-input" value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Marcus" disabled={actionLoading} />
      </label>
      <button type="submit" disabled={!canSubmit}>{actionLoading ? "Başlatılıyor..." : "Yeni Yolculuk Başlat"}</button>
    </form>
  );
}
