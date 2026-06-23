import { getSpeakerLabel } from "../../utils/displayLabels";

interface VillageNpcPresencePanelProps {
  nearbyNpcIds: string[];
}

export function VillageNpcPresencePanel({ nearbyNpcIds }: VillageNpcPresencePanelProps) {
  const npcRoles: Record<string, { role: string; desc: string; icon: string }> = {
    mater: { role: "Mater", desc: "Sıcak ekmek kokusuyla seni karşılayan şefkatli annen.", icon: "👵" },
    pater: { role: "Pater", desc: "Tarlada veya işinin başında sessizce çalışan baban.", icon: "👨" },
    avia: { role: "Avia", desc: "Eski Roma efsanelerini fısıldayan bilge büyükannen.", icon: "👵" },
    magister_ruralis: { role: "Magister", desc: "Gençlere okuma-yazma ve hesap öğreten sabırlı hoca.", icon: "👨‍🏫" },
    mercator_vicus: { role: "Mercator", desc: "Uzak şehirlerden getirdiği malları satan kurnaz tüccar.", icon: "🧑‍💼" },
    veteranus: { role: "Veteranus", desc: "Roma lejyonlarında savaşmış, yara izleriyle dolu ihtiyar.", icon: "🛡️" },
    scriba_vicus: { role: "Scriba", desc: "Resmi belgeleri ve mektupları Latince kaleme alan memur.", icon: "📜" },
    ministra: { role: "Ministra", desc: "Sunaktaki kutsal ateşi koruyan tapınak hizmetkarı.", icon: "🔮" },
    amicus: { role: "Amicus", desc: "Köyde birlikte koşturup oyun oynadığın sadık dostun.", icon: "🧑" }
  };

  if (nearbyNpcIds.length === 0) {
    return (
      <div className="village-panel-card npc-presence-empty">
        <h3 className="village-panel-title">ETRAFTAKİ KİŞİLER</h3>
        <p className="empty-text">Şu an buralarda kimsecikler görünmüyor.</p>
      </div>
    );
  }

  return (
    <div className="village-panel-card">
      <h3 className="village-panel-title">ETRAFTAKİ KİŞİLER (Cives)</h3>
      <p className="village-panel-subtitle">Bu vakitte seninle aynı bölgede olan köylüler.</p>
      <div className="village-npc-list">
        {nearbyNpcIds.map((npcId) => {
          const name = getSpeakerLabel(npcId);
          const meta = npcRoles[npcId] || { role: "Köylü", desc: "Köyün kendi halinde bir sakini.", icon: "👤" };

          return (
            <div key={npcId} className="village-npc-row">
              <div className="npc-avatar">{meta.icon}</div>
              <div className="npc-info">
                <div className="npc-name-row">
                  <span className="npc-name">{name}</span>
                  <span className="npc-role-tag">{meta.role}</span>
                </div>
                <p className="npc-desc">{meta.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
