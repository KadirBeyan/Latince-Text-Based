import { useState } from "react";

type FreeformActionBoxProps = {
  onSubmit: (text: string) => void;
  actionLoading: boolean;
};

export function FreeformActionBox({ onSubmit, actionLoading }: FreeformActionBoxProps) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim() || actionLoading) return;
    onSubmit(inputText.trim());
    setInputText("");
  };

  return (
    <div 
      className="freeform-action-box panel-card"
      style={{
        marginTop: "1.2rem",
        padding: "1rem",
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px dashed rgba(255, 255, 255, 0.12)",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <span 
          style={{ 
            fontSize: "0.8rem", 
            fontWeight: "600", 
            color: "var(--accent-gold, #c3a05c)",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          Özgür Eylemler / Freeform
        </span>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted, #8e8e93)" }}>
          Başka bir şey yapmak istiyorsan Türkçe yazıp gönder (örn: "etrafı incele", "anneme yardım etmeyi teklif et").
        </p>
      </div>

      <div 
        style={{ 
          display: "flex", 
          gap: "0.5rem", 
          marginTop: "0.75rem",
          alignItems: "center"
        }}
      >
        <input
          type="text"
          value={inputText}
          disabled={actionLoading}
          placeholder="Yapmak istediğin eylemi yaz..."
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          style={{
            flexGrow: 1,
            padding: "0.6rem 0.8rem",
            borderRadius: "6px",
            backgroundColor: "rgba(10, 8, 6, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#ffffff",
            fontSize: "0.95rem"
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() || actionLoading}
          style={{
            backgroundColor: "rgba(195, 160, 92, 0.15)",
            border: "1px solid var(--accent-gold, #c3a05c)",
            color: "var(--accent-gold, #c3a05c)",
            fontWeight: "bold",
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            cursor: !inputText.trim() || actionLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseOver={e => {
            if (inputText.trim() && !actionLoading) {
              e.currentTarget.style.backgroundColor = "var(--accent-gold, #c3a05c)";
              e.currentTarget.style.color = "#0a0806";
            }
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = "rgba(195, 160, 92, 0.15)";
            e.currentTarget.style.color = "var(--accent-gold, #c3a05c)";
          }}
        >
          {actionLoading ? "Yorumlanıyor..." : "Gönder"}
        </button>
      </div>
    </div>
  );
}
