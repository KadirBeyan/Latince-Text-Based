import type { ConversationOption } from "../../../types/gameTypes";

type ConversationOptionCardProps = {
  option: ConversationOption;
  disabled?: boolean;
  onClick: () => void;
};

export function ConversationOptionCard({ option, disabled, onClick }: ConversationOptionCardProps) {
  const getVerbIcon = (verb: string) => {
    switch (verb) {
      case "speak": return "💬";
      case "ask": return "❓";
      case "inspect": return "🔍";
      case "listen": return "👂";
      case "wait": return "⏳";
      case "help": return "🤝";
      case "refuse": return "🙅";
      case "leave": return "🚪";
      case "remember": return "🧠";
      case "read": return "📖";
      default: return "📜";
    }
  };

  return (
    <button
      className={`conversation-option-card ${option.requiresLatin ? "requires-latin" : ""}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        textAlign: "left",
        width: "100%",
        padding: "1rem",
        borderRadius: "8px",
        background: option.requiresLatin 
          ? "linear-gradient(to right, rgba(230, 180, 80, 0.08), rgba(240, 200, 100, 0.03))"
          : "rgba(255, 255, 255, 0.03)",
        border: option.requiresLatin
          ? "1px solid rgba(195, 160, 92, 0.35)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        opacity: disabled ? 0.6 : 1
      }}
    >
      <div 
        className="option-icon-wrapper"
        style={{
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "6px",
          backgroundColor: option.requiresLatin ? "rgba(195, 160, 92, 0.15)" : "rgba(255, 255, 255, 0.05)",
          flexShrink: 0
        }}
      >
        {getVerbIcon(option.verb)}
      </div>
      <div style={{ flexGrow: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontWeight: "600", color: "var(--text-primary, #e4e4e7)" }}>
            {option.labelTr}
          </span>
          {option.requiresLatin && (
            <span 
              className="badge-latin-required"
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: "4px",
                backgroundColor: "rgba(195, 160, 92, 0.2)",
                color: "#e6b450",
                border: "1px solid rgba(195, 160, 92, 0.3)",
                fontWeight: "bold",
                letterSpacing: "0.5px"
              }}
            >
              Latince Cevapla
            </span>
          )}
        </div>
        {option.descriptionTr && (
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted, #8e8e93)" }}>
            {option.descriptionTr}
          </p>
        )}
      </div>
    </button>
  );
}
