import { MapPin, Megaphone, Scroll, ArrowCounterClockwise, Check, Trash } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";
import { GeneratedQuestPanel } from "./GeneratedQuestPanel";

const LOCATIONS_CONFIG: Record<string, { label: string; note: string }> = {
  ludus_room: { label: "Ludus (Okul)", note: "Zihnini eğit, Latince öğren." },
  forum: { label: "Forum (Meydan)", note: "Romalılarla konuş, ticaret yap ve ikna et." },
  domus: { label: "Domus (Ev)", note: "Dinlen, günlüğünü incele ve düşün." },
  castra: { label: "Castra (Ordugah)", note: "Disiplin, nöbet ve askeri düzen." },
  bibliotheca: { label: "Bibliotheca (Kütüphane)", note: "Antik tomarları çalış ve bilgi edin." }
};

const MOOD_LABELS: Record<string, { text: string; color: string; bg: string }> = {
  calm: { text: "Sakin", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
  busy: { text: "Kalabalık", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.15)" },
  tense: { text: "Gergin", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
  festive: { text: "Şenlikli", color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)" },
  dangerous: { text: "Tehlikeli", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" },
  scholarly: { text: "Akademik", color: "#a78bfa", bg: "rgba(167, 139, 250, 0.15)" }
};

export function MundusPanel() {
  const { gameState, generateQuestFromSuggestion, dismissSideQuest, refreshSideQuests, actionLoading } = useGameStore();

  if (!gameState) return null;

  const currentLocId = gameState.currentScene.locationId;
  const locationStates = gameState.locationStates || [];
  const worldEvents = gameState.worldEvents || [];
  const sideQuests = gameState.sideQuestSuggestions || [];

  return (
    <section className="panel-card mundus-panel" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Location States */}
      <div>
        <div className="panel-heading compact-heading" style={{ marginBottom: "12px" }}>
          <p className="eyebrow">Loci</p>
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}><MapPin size={18} weight="duotone" /> Konum Durumları</h3>
        </div>
        <div className="location-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Object.entries(LOCATIONS_CONFIG).map(([id, info]) => {
            const state = locationStates.find(l => l.locationId === id);
            const isDiscovered = state?.discovered ?? (id === "ludus_room" || id === "forum"); // Defaults
            const visitCount = state?.visitCount ?? 0;
            const mood = state?.mood;
            const moodInfo = mood ? MOOD_LABELS[mood] : null;
            const isCurrent = currentLocId === id;

            return (
              <div key={id} className={`location-item ${isCurrent ? "current" : ""}`} style={{
                border: isCurrent ? "1px solid var(--color-primary, #d4af37)" : "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "6px",
                padding: "10px 12px",
                background: isCurrent ? "rgba(212, 175, 55, 0.05)" : isDiscovered ? "rgba(255, 255, 255, 0.01)" : "rgba(255,255,255,0.002)",
                opacity: isDiscovered ? 1 : 0.5,
                transition: "all 0.3s ease"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: isCurrent ? "var(--color-primary-light, #d4af37)" : "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>
                    {info.label} {isCurrent && <span style={{ fontSize: "0.75rem", fontStyle: "italic", color: "var(--color-primary, #d4af37)", marginLeft: "4px" }}>(Buradasınız)</span>}
                  </span>
                  
                  {isDiscovered && moodInfo && (
                    <span style={{
                      fontSize: "0.75rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: moodInfo.bg,
                      color: moodInfo.color,
                      fontWeight: 500
                    }}>{moodInfo.text}</span>
                  )}
                </div>

                <p style={{ margin: "0 0 6px 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                  {isDiscovered ? info.note : "Keşfedilmemiş Konum"}
                </p>

                {isDiscovered && (
                  <div style={{ display: "flex", gap: "10px", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                    <span>Ziyaret: {visitCount}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. World Events / Rumors */}
      <div>
        <div className="panel-heading compact-heading" style={{ marginBottom: "12px" }}>
          <p className="eyebrow">Famae</p>
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}><Megaphone size={18} weight="duotone" /> Dünyadan Söylentiler</h3>
        </div>
        {worldEvents.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: "0", padding: "10px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "6px" }}>
            Şu an ortalık sakin. Yeni söylenti veya haber bulunmuyor.
          </p>
        ) : (
          <div className="rumors-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {worldEvents.map(event => (
              <div key={event.id} style={{
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "6px",
                padding: "10px 12px",
                background: event.type === "rumor" ? "rgba(245, 158, 11, 0.02)" : "rgba(255, 255, 255, 0.02)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem", color: event.type === "rumor" ? "#f59e0b" : "#60a5fa" }}>
                    {event.type === "rumor" ? "Söylenti: " : "Haber: "}{event.title}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
                    önem: {event.importance}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", lineHeight: "1.3" }}>
                  {event.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Side Quests suggestions */}
      <div>
        <div className="panel-heading compact-heading" style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="eyebrow">Missiones</p>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}><Scroll size={18} weight="duotone" /> Latince Gelişim Görevleri</h3>
          </div>
          {sideQuests.length < 3 && (
            <button
              onClick={() => refreshSideQuests()}
              disabled={actionLoading}
              title="Yeni görev önerileri ara"
              style={{
                background: "none",
                border: "none",
                color: "var(--color-primary-light, #d4af37)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.8rem",
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: "rgba(212, 175, 55, 0.08)",
                transition: "opacity 0.2s"
              }}
            >
              <ArrowCounterClockwise size={14} className={actionLoading ? "spin" : ""} /> Yenile
            </button>
          )}
        </div>

        {sideQuests.length === 0 ? (
          <div style={{
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "20px 10px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: "0 0 10px 0" }}>
              Şu an önerilen gelişim görevi bulunmuyor. Yanlış cevaplar verdikçe veya yeni konulara çalıştıkça size özel görevler üretilir.
            </p>
            <button
              onClick={() => refreshSideQuests()}
              disabled={actionLoading}
              style={{
                background: "var(--color-primary, #d4af37)",
                color: "#1a1a1a",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Görev Önerisi Ara
            </button>
          </div>
        ) : (
          <div className="sidequests-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sideQuests.map(quest => {
              const isAccepted = quest.status === "accepted";
              return (
                <div key={quest.id} style={{
                  border: isAccepted ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "6px",
                  padding: "12px",
                  background: isAccepted ? "rgba(16, 185, 129, 0.02)" : "rgba(255,255,255,0.02)",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-primary-light, #d4af37)" }}>
                      {quest.title}
                    </span>
                    <span style={{
                      fontSize: "0.7rem",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                      fontWeight: 600
                    }}>{quest.difficulty.toUpperCase()}</span>
                  </div>

                  <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", lineHeight: "1.3" }}>
                    {quest.reason}
                  </p>
                  {!isAccepted ? <p style={{ margin: "0 0 8px", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>Bu öneri, oynanabilir kısa bir göreve dönüştürülebilir.</p> : null}

                  {/* Metadata tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
                    {quest.relatedGrammarIds.map(g => (
                      <span key={g} style={{ fontSize: "0.7rem", padding: "1px 4px", background: "rgba(96, 165, 250, 0.1)", color: "#93c5fd", borderRadius: "3px" }}>
                        {g}
                      </span>
                    ))}
                    {quest.relatedVocabularyIds.map(v => (
                      <span key={v} style={{ fontSize: "0.7rem", padding: "1px 4px", background: "rgba(167, 139, 250, 0.1)", color: "#c084fc", borderRadius: "3px" }}>
                        {v}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    {isAccepted ? (
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.75rem",
                        color: "#10b981",
                        fontWeight: 600,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: "rgba(16, 185, 129, 0.1)"
                      }}>
                        <Check size={14} /> Görev Kabul Edildi
                      </span>
                    ) : (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => dismissSideQuest(quest.id)}
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
                          <Trash size={12} /> Reddet
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => generateQuestFromSuggestion(quest.id)}
                          style={{
                            background: "var(--color-primary, #d4af37)",
                            color: "#1a1a1a",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Scroll size={12} /> Göreve Dönüştür
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Generated / Active Dynamic Quests */}
      <div>
        <div className="panel-heading compact-heading" style={{ marginBottom: "12px" }}>
          <p className="eyebrow">Dinamik Görevler</p>
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}><Scroll size={18} weight="duotone" /> Aktif Dinamik Görevler</h3>
        </div>
        <GeneratedQuestPanel />
      </div>
    </section>
  );
}
