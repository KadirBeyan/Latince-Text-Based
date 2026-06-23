import { useGameStore } from "../../stores/gameStore";
import discipulusAvatar from "../../assets/discipulus-avatar.png";

export function ProgressPanel() {
  const { gameState } = useGameStore();
  const player = gameState?.player;
  const xp = player?.xp ?? 0;
  const currency = player?.currency ?? 0;
  const streak = player?.streak;
  
  const xpToNextLevel = 100 - (xp % 100);
  const progressPercent = xp % 100;

  return (
    <section className="panel-card progress-panel">
      <div className="player-card">
        <img className="player-avatar" src={discipulusAvatar} alt="Discipulus avatar" />
        <div className="player-title">
          <p className="eyebrow">Discipulus</p>
          <h3>{player?.playerName || player?.name || "Marcus Valerius"}</h3>
          <span>Roma Vatandaşı</span>
        </div>
      </div>

      <div className="stats-row">
        <span>{currency} Denarii</span>
        {streak && streak.current > 0 ? (
          <span title={`En iyi: ${streak.best} gün`}>
            {streak.current} Gün Seri
          </span>
        ) : (
          <span>Seri yok</span>
        )}
      </div>

      <div className="level-row">
        <span>Seviye</span>
        <strong>{player?.level ?? 1}</strong>
      </div>

      <div className="roman-progress" aria-label="XP ilerleme">
        <span style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="xp-line">
        <span>XP: {xp}</span>
        <span>Sonraki: {xpToNextLevel} XP</span>
      </div>

      <div className="chapter-card">
        <p className="eyebrow">Actus I · Caput III</p>
        <h4>{gameState?.currentQuest?.title || "Prima Dies"}</h4>
        <span className="text-stone-400 text-xs">{gameState?.currentChapter?.title || "Ludus"}</span>
      </div>
    </section>
  );
}
