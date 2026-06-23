import { useGameStore } from "../../stores/gameStore";

export function GrammarHintPanel() {
  const { hint, requestHint, actionLoading } = useGameStore();

  return (
    <section className="panel-card grammar-hint-panel parchment-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Auxilium</p>
        <h3>Auxilia</h3>
      </div>
      {!hint ? <p className="empty-state">Takılırsan ipucu isteyebilirsin.</p> : null}
      {hint ? (
        <div className="hint-body">
          <p>{hint.hintTr}</p>
          {hint.miniExampleLatin ? <p className="latin-small">{hint.miniExampleLatin}</p> : null}
          {hint.miniExampleTr ? <p className="muted">{hint.miniExampleTr}</p> : null}
        </div>
      ) : null}
      <button type="button" disabled={actionLoading} onClick={() => void requestHint()}>Yeni ipucu iste</button>
    </section>
  );
}
