import { LifePathId } from "../../types/gameTypes";

interface VillagePathPressurePanelProps {
  lifePathHints?: Record<LifePathId, number>;
}

export function VillagePathPressurePanel({ lifePathHints }: VillagePathPressurePanelProps) {
  const defaultHints: Record<LifePathId, number> = {
    ludus: 0,
    castra: 0,
    mercatura: 0,
    scriptura: 0,
    templum: 0,
    villa: 0
  };

  const hints = { ...defaultHints, ...lifePathHints };

  // Define details for each life path
  const pathDetails: Record<
    LifePathId,
    { title: string; latin: string; desc: string; icon: string; color: string }
  > = {
    ludus: {
      title: "Gladyatörlük",
      latin: "Ludus",
      desc: "Bedensel dayanıklılık, cesaret ve dövüş sanatı.",
      icon: "⚔️",
      color: "#8b2f25" // Roman Red
    },
    castra: {
      title: "Askerlik & Lejyon",
      latin: "Castra",
      desc: "Disiplin, taktik zeka ve Roma ordusuna hizmet.",
      icon: "🛡️",
      color: "#b47a3c" // Bronze
    },
    mercatura: {
      title: "Tüccarlık & Ticaret",
      latin: "Mercatura",
      desc: "Hesaplama, kurnazlık ve mal alım-satımı.",
      icon: "⚖️",
      color: "#b9822d" // Gold
    },
    scriptura: {
      title: "Yazıcılık & Bürokrasi",
      latin: "Scriptura",
      desc: "Latince dil hakimiyeti, kayıt tutma ve idari işler.",
      icon: "📜",
      color: "#4f6f91" // Info Blue
    },
    templum: {
      title: "Rahiplik & Tapınak",
      latin: "Templum",
      desc: "Dindarlık, tanrılara adaklar ve dini törenler.",
      icon: "🔮",
      color: "#5e371d" // Deep brown
    },
    villa: {
      title: "Tarım & Toprak Yönetimi",
      latin: "Villa",
      desc: "Toprak işleme, hasat, hayvancılık ve çiftlik hayatı.",
      icon: "🍇",
      color: "#4f7a46" // Success Green
    }
  };

  // Find the path with the highest value for flavor commentary
  let leadingPath: LifePathId | null = null;
  let maxVal = 0;
  for (const [pathId, val] of Object.entries(hints)) {
    if (val > maxVal) {
      maxVal = val;
      leadingPath = pathId as LifePathId;
    }
  }

  const getAffinityCommentary = () => {
    if (maxVal === 0) {
      return "Henüz geleceğe dair bir adım atmadın. Köydeki insanlara yardım ederek ve küçük işler yaparak yeteneklerini keşfedebilirsin.";
    }
    if (!leadingPath) return "";
    
    const leading = pathDetails[leadingPath];
    switch (leadingPath) {
      case "ludus":
        return `Köydeki hareketlerin senin gücünü ve cesaretini ön plana çıkarıyor. ${leading.title} yoluna yakın duruyorsun.`;
      case "castra":
        return `Disiplinli duruşun ve savaş gazileriyle geçirdiğin zaman seni orduya hazırlıyor. ${leading.title} yolunda ilerliyorsun.`;
      case "mercatura":
        return `Pazardaki yardımseverliğin ve sayısal zekan tüccarların dikkatini çekiyor. Gözün ${leading.title} üzerinde.`;
      case "scriptura":
        return `Yazıcıların ve öğretmenlerin yanında geçirdiğin vakit okuma yazma merakını gösteriyor. ${leading.title} yolunda öne çıkıyorsun.`;
      case "templum":
        return `Sunağa gösterdiğin saygı ve dini görevler senin manevi yönünü besliyor. ${leading.title} yoluna ilgi duyuyorsun.`;
      case "villa":
        return `Toprakla uğraşmak, hasada yardım etmek seni doğaya yaklaştırıyor. ${leading.title} hayatını benimsiyorsun.`;
    }
  };

  return (
    <div className="village-panel-card">
      <h3 className="village-panel-title">HAYAT YOLU EĞİLİMİ (Fatum)</h3>
      <p className="village-panel-subtitle">Köydeki seçimlerinin gelecekteki kariyer yollarına olan etkisi.</p>
      
      <p className="path-commentary">{getAffinityCommentary()}</p>
      
      <div className="village-path-list">
        {(Object.entries(hints) as [LifePathId, number][]).map(([pathId, val]) => {
          const detail = pathDetails[pathId];
          // Simple scaling: let's assume maximum typical hint score is 10 for visual representation
          const percentage = Math.min(100, (val / 10) * 100);

          return (
            <div key={pathId} className="village-path-row-item">
              <div className="path-meta">
                <span className="path-icon-label">
                  {detail.icon} {detail.title} <span className="latin-sub">({detail.latin})</span>
                </span>
                <span className="path-value-label">Puan: {val}</span>
              </div>
              <div className="path-bar-bg">
                <div
                  className="path-bar-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: detail.color
                  }}
                />
              </div>
              <p className="path-desc-tiny">{detail.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
