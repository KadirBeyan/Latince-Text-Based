import React, { useState } from "react";

export function DialogueResponseComposer({
  onSend,
  onHint,
  loading
}: {
  onSend: (text: string) => void;
  onHint: () => void;
  loading: boolean;
}) {
  const [text, setText] = useState("");
  const canSubmit = text.trim().length > 0 && !loading;

  function handleSend() {
    if (!canSubmit) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <div className="dialogue-response-composer panel-card">
      <div className="module-title">RESPONDE</div>
      <p className="composer-instruction">NPC'ye Latince cevap ver. Kısa, doğal ve sahne niyetine uygun olsun.</p>
      <textarea
        className="parchment-input dialogue-textarea"
        value={text}
        disabled={loading}
        placeholder="Örn. Ego sum Marcus."
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <div className="dialogue-composer-actions">
        <button type="button" className="composer-button send-btn" disabled={!canSubmit} onClick={handleSend}>
          Cevap Ver
        </button>
        <button type="button" className="composer-button hint-btn" disabled={loading} onClick={onHint}>
          İpucu İste
        </button>
      </div>
    </div>
  );
}
