import { useState } from "react";
import { useGameStore } from "../../stores/gameStore";

export function LatinInput() {
  const { submitText, requestHint, actionLoading } = useGameStore();
  const [text, setText] = useState("");
  const canSubmit = text.trim().length > 0 && !actionLoading;

  function send() {
    if (!canSubmit) {
      return;
    }
    const answer = text.trim();
    setText("");
    void submitText(answer);
  }

  return (
    <section className="latin-input panel-card">
      <div className="module-title">RESPONDE LATINE</div>
      <p>İlk cevabını Latince yaz.</p>
      <label>
        Latince cevap
        <textarea
          className="parchment-input"
          value={text}
          disabled={actionLoading}
          placeholder="Latince cevabını yaz: Salve, magister..."
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
        />
      </label>
      <div className="input-actions">
        <button type="button" disabled={!canSubmit} onClick={send}>Gönder</button>
        <button type="button" disabled={actionLoading} onClick={() => void requestHint()}>İpucu İste</button>
      </div>
    </section>
  );
}
