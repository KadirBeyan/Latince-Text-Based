import { useEffect, useState } from "react";
import { authoringApi } from "../../../api/authoringApi";
import { VpCard, VpSectionHeader, VpEmptyState } from "../../ui";

export function VillageLoopPreview() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Static presence schedule from npc-presence.json for overlay
  const npcPresence: Record<string, Record<string, string>> = {
    mater: { mane: "home_hut", meridies: "village_market", vesper: "home_hut", nox: "home_hut" },
    pater: { mane: "home_hut", meridies: "field_edge", vesper: "village_path", nox: "home_hut" },
    magister_ruralis: { mane: "teacher_corner", meridies: "teacher_corner", vesper: "village_path", nox: "home_hut" },
    mercator_vicus: { mane: "village_market", meridies: "village_market", vesper: "village_path", nox: "home_hut" },
    veteranus: { mane: "veteran_bench", meridies: "veteran_bench", vesper: "shrine", nox: "home_hut" },
    scriba_vicus: { mane: "scribe_table", meridies: "scribe_table", vesper: "scribe_table", nox: "home_hut" },
    sacerdos_vicus: { mane: "shrine", meridies: "shrine", vesper: "shrine", nox: "home_hut" },
    amicus: { mane: "village_path", meridies: "field_edge", vesper: "village_path", nox: "home_hut" }
  };

  const locations = [
    { id: "home_hut", name: "Ev (Casa)", latin: "home_hut" },
    { id: "village_path", name: "Köy Yolu (Vicus)", latin: "village_path" },
    { id: "village_market", name: "Pazar (Mercatus)", latin: "village_market" },
    { id: "field_edge", name: "Tarla (Ager)", latin: "field_edge" },
    { id: "teacher_corner", name: "Okul (Angulus Magistri)", latin: "teacher_corner" },
    { id: "veteran_bench", name: "Gazi Bankı (Subsellium)", latin: "veteran_bench" },
    { id: "scribe_table", name: "Yazıcı (Mensa Scribae)", latin: "scribe_table" },
    { id: "shrine", name: "Sunak (Sacellum)", latin: "shrine" }
  ];

  const timeWindows = ["mane", "meridies", "vesper", "nox"];

  useEffect(() => {
    async function loadData() {
      try {
        const docs = await authoringApi.documents("village-activity");
        setActivities(docs.map((d) => d.data));
      } catch (err) {
        console.error("Failed to load village activities for preview", err);
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, []);

  if (loading) {
    return (
      <VpCard>
        <p style={{ padding: "16px", textAlign: "center" }}>Yükleniyor...</p>
      </VpCard>
    );
  }

  if (activities.length === 0) {
    return (
      <VpCard>
        <VpEmptyState title="Etkinlik Bulunamadı">
          Köy aktivitesi belgeleri yüklenemedi veya dizin boş.
        </VpEmptyState>
      </VpCard>
    );
  }

  return (
    <VpCard variant="compact">
      <VpSectionHeader
        eyebrow="Village Life Loop Preview"
        title="Etkinlik ve NPC Dağılım Matrisi"
        description="Günün vakitlerine ve köy konumlarına göre planlanmış etkinlikler ile vatandaşların konumları."
      />
      <div style={{ overflowX: "auto", padding: "16px" }}>
        <table className="authoring-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.15)", textAlign: "left" }}>
              <th style={{ padding: "12px 8px" }}>Konum (Locus)</th>
              {timeWindows.map((t) => (
                <th key={t} style={{ padding: "12px 8px", textTransform: "uppercase", fontSize: "0.82rem", color: "var(--gold)" }}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <td style={{ padding: "12px 8px", fontWeight: "600", fontSize: "0.9rem" }}>
                  <div>{loc.name}</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.5, fontFamily: "var(--vp-font-mono)" }}>
                    {loc.id}
                  </div>
                </td>
                {timeWindows.map((time) => {
                  // Find NPCs at this location at this time
                  const presentNpcs = Object.entries(npcPresence)
                    .filter(([_, sched]) => sched[time] === loc.id)
                    .map(([npcId]) => npcId);

                  // Find activities in this location at this time
                  const currentActs = activities.filter(
                    (act) => act.locationId === loc.id && (act.timeWindows ?? []).includes(time)
                  );

                  return (
                    <td key={time} style={{ padding: "12px 8px", verticalAlign: "top", fontSize: "0.8rem", width: "22%" }}>
                      {/* NPCs Section */}
                      {presentNpcs.length > 0 && (
                        <div style={{ marginBottom: "8px" }}>
                          <span style={{ fontSize: "0.68rem", fontWeight: "600", color: "var(--vp-text-faint)", display: "block", textTransform: "uppercase" }}>
                            NPCs ({presentNpcs.length})
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "2px" }}>
                            {presentNpcs.map((npc) => (
                              <span
                                key={npc}
                                style={{
                                  backgroundColor: "rgba(214,168,79,0.12)",
                                  color: "var(--gold)",
                                  padding: "1px 5px",
                                  borderRadius: "3px",
                                  fontSize: "0.72rem",
                                  border: "1px solid rgba(214,168,79,0.2)"
                                }}
                              >
                                {npc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Activities Section */}
                      {currentActs.length > 0 ? (
                        <div>
                          <span style={{ fontSize: "0.68rem", fontWeight: "600", color: "var(--vp-text-faint)", display: "block", textTransform: "uppercase" }}>
                            Etkinlikler ({currentActs.length})
                          </span>
                          <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", color: "var(--color-text)" }}>
                            {currentActs.map((act) => (
                              <li key={act.id} style={{ marginBottom: "4px" }}>
                                <span style={{ fontWeight: "500" }}>{act.titleTr}</span>
                                <div style={{ fontSize: "0.72rem", opacity: 0.6 }}>id: {act.id}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        presentNpcs.length === 0 && (
                          <span style={{ fontStyle: "italic", opacity: 0.35 }}>Boş</span>
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VpCard>
  );
}
