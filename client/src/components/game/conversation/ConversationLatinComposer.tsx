import { useState, useRef } from "react";
import type { ConversationOption } from "../../../types/gameTypes";

type ConversationLatinComposerProps = {
  option: ConversationOption;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  actionLoading: boolean;
};

export function ConversationLatinComposer({ option, onSubmit, onCancel, actionLoading }: ConversationLatinComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const macrons = ["ā", "ē", "ī", "ō", "ū", "Ā", "Ē", "Ī", "Ō", "Ū"];

  const handleMacronClick = (char: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    const newVal = currentVal.substring(0, start) + char + currentVal.substring(end);
    setText(newVal);

    // Reset selection position after character insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 1, start + 1);
    }, 0);
  };

  const handleSend = () => {
    if (!text.trim() || actionLoading) return;
    onSubmit(text.trim());
  };

  return (
    <div 
      className="conversation-latin-composer panel-card"
      style={{
        border: "1px solid var(--accent-gold, #c3a05c)",
        padding: "1.2rem",
        background: "rgba(30, 25, 20, 0.4)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        borderRadius: "10px",
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
    >
      <div className="composer-intent-header" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.5rem" }}>
        <p className="eyebrow" style={{ color: "#e6b450", fontSize: "0.75rem", letterSpacing: "1px" }}>Niyetin / Intentio</p>
        <h4 style={{ margin: "0.25rem 0", color: "#ffffff" }}>{option.playerIntentTr || option.labelTr}</h4>
        {option.targetMeaningTr && (
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", fontStyle: "italic", color: "var(--text-muted, #8e8e93)" }}>
            Hedef anlam: “{option.targetMeaningTr}”
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div 
          className="macron-helper-row"
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            padding: "0.25rem",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "6px"
          }}
        >
          <span style={{ fontSize: "0.75rem", alignSelf: "center", color: "var(--text-muted, #8e8e93)", padding: "0 0.4rem" }}>Macron Yardımcısı:</span>
          {macrons.map(char => (
            <button
              key={char}
              type="button"
              onClick={() => handleMacronClick(char)}
              disabled={actionLoading}
              style={{
                width: "28px",
                height: "28px",
                padding: 0,
                fontSize: "0.9rem",
                fontWeight: "bold",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#e4e4e7",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "rgba(195, 160, 92, 0.2)"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"}
            >
              {char}
            </button>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="parchment-input"
          value={text}
          disabled={actionLoading}
          placeholder="Bunu Latince ifade etmeye çalış..."
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "0.8rem",
            borderRadius: "6px",
            backgroundColor: "rgba(10, 8, 6, 0.6)",
            border: "1px solid rgba(195, 160, 92, 0.3)",
            color: "#ffffff",
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "1.1rem",
            resize: "vertical"
          }}
        />
      </div>

      <div className="input-actions" style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem" }}>
        <button 
          type="button" 
          onClick={onCancel}
          disabled={actionLoading}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "var(--text-primary, #e4e4e7)",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Seçeneklere Dön
        </button>

        <button 
          type="button" 
          onClick={handleSend}
          disabled={!text.trim() || actionLoading}
          style={{
            backgroundColor: "var(--accent-gold, #c3a05c)",
            border: "1px solid var(--accent-gold, #c3a05c)",
            color: "#0a0806",
            fontWeight: "bold",
            padding: "0.5rem 1.5rem",
            borderRadius: "6px",
            cursor: !text.trim() || actionLoading ? "not-allowed" : "pointer"
          }}
        >
          {actionLoading ? "Gönderiliyor..." : "Cevabı Gönder"}
        </button>
      </div>
    </div>
  );
}
