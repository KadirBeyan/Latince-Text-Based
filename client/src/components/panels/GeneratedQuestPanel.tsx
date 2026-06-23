import { useGameStore } from "../../stores/gameStore";
import { Check, Trash, Play, ShieldWarning } from "@phosphor-icons/react";
import { useState } from "react";

export function GeneratedQuestPanel() {
  const { gameState, acceptGeneratedQuest, dismissGeneratedQuest, startGeneratedQuest, actionLoading } = useGameStore();
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

  if (!gameState) return null;

  const generatedQuests = gameState.generatedQuests || [];

  if (generatedQuests.length === 0) {
    return (
      <div className="panel-card" style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
          Henüz üretilmiş görev yok.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {generatedQuests.map((quest) => {
        const isDraft = quest.status === "draft";
        const isExpanded = expandedQuestId === quest.id;
        const validation = quest.validation || { ok: true, errors: [], warnings: [] };
        const validationLabel = !validation.ok ? "Hatalı, başlatılamaz" : validation.warnings.length > 0 ? "Uyarılar var" : "Geçerli";

        return (
          <div
            key={quest.id}
            className="generated-quest-card"
            style={{
              border: isDraft ? "1px solid rgba(212, 175, 55, 0.2)" : "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "8px",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.015)",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--color-primary-light, #d4af37)" }}>
                  {quest.title}
                </h4>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>
                  Konum: {quest.locationId} · NPC: {quest.npcIds.join(", ") || "yok"}
                </p>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: isDraft ? "rgba(212, 175, 55, 0.15)" : "rgba(16, 185, 129, 0.15)",
                  color: isDraft ? "#fcd34d" : "#34d399",
                  fontWeight: 600
                }}
              >
                {isDraft ? "TASLAK" : "AKTİF"}
              </span>
            </div>

            {/* Description */}
            <p style={{ margin: "4px 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>
              {quest.description}
            </p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{quest.reason}</p>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
              {quest.difficulty} · {quest.scenes.length} sahne · {quest.metadata?.generatedBy || "template"}
            </p>

            {/* Learning Focus */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", margin: "4px 0" }}>
              {quest.learningFocus.grammarIds.map(g => (
                <span key={g} style={{ fontSize: "0.7rem", padding: "1px 4px", background: "rgba(96, 165, 250, 0.1)", color: "#93c5fd", borderRadius: "3px" }}>
                  {g}
                </span>
              ))}
              {quest.learningFocus.vocabularyIds.map(v => (
                <span key={v} style={{ fontSize: "0.7rem", padding: "1px 4px", background: "rgba(167, 139, 250, 0.1)", color: "#c084fc", borderRadius: "3px" }}>
                  {v}
                </span>
              ))}
            </div>

            {/* Validation Details */}
            <div style={{ marginTop: "4px" }}>
              <button
                onClick={() => setExpandedQuestId(isExpanded ? null : quest.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <ShieldWarning size={14} /> Doğrulama Durumu:
                <span style={{ color: !validation.ok ? "#f87171" : validation.warnings.length ? "#fcd34d" : "#34d399", fontWeight: 600 }}>{validationLabel}</span>
                {isExpanded ? "(Gizle)" : "(Detaylar)"}
              </button>

              {isExpanded && (
                <div
                  style={{
                    marginTop: "6px",
                    padding: "8px",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}
                >
                  {validation.ok && (
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.5)" }}>Görev başarıyla doğrulandı, oynanmaya hazır.</p>
                  )}
                  {validation.errors.map((e, idx) => (
                    <div key={idx} style={{ color: "#f87171" }}>
                      <strong>[Hata]</strong> {e.message} ({e.path})
                    </div>
                  ))}
                  {validation.warnings.map((w, idx) => (
                    <div key={idx} style={{ color: "#fcd34d" }}>
                      <strong>[Uyarı]</strong> {w.message} ({w.path})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                disabled={actionLoading}
                onClick={() => dismissGeneratedQuest(quest.id)}
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  color: "#f87171",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Trash size={12} /> Sil / Yoksay
              </button>

              {isDraft && (
                <button
                  disabled={actionLoading || !validation.ok}
                  onClick={() => acceptGeneratedQuest(quest.id)}
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    color: "#34d399",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Check size={12} /> Kabul Et
                </button>
              )}

              <button
                disabled={actionLoading || !validation.ok}
                onClick={() => startGeneratedQuest(quest.id)}
                style={{
                  background: "var(--color-primary, #d4af37)",
                  color: "#1a1a1a",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Play size={12} weight="fill" /> Başla
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
