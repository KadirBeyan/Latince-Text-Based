import React from "react";
import { useGameStore } from "../../stores/gameStore";
import type { MasteryState } from "../../types/gameTypes";

export const MasteryPanel: React.FC = () => {
  const { gameState, generateReviewQuest, actionLoading } = useGameStore();

  const masteryStates = gameState?.masteryStates ?? [];
  const reviewSuggestions = gameState?.reviewSuggestions ?? [];

  const grammarMastery = masteryStates.filter(m => m.targetType === "grammar");
  const vocabularyMastery = masteryStates.filter(m => m.targetType === "vocabulary");
  const skillMastery = masteryStates.filter(m => m.targetType === "skill");

  // Determine strong and weak topics
  const strongTopics = masteryStates.filter(m => m.mastery >= 75);
  const weakTopics = masteryStates.filter(m => m.mastery < 40 && m.seenCount > 0);

  const renderMasteryBar = (m: MasteryState) => {
    const accuracy = m.seenCount > 0 ? Math.round((m.correctCount / m.seenCount) * 100) : 0;
    
    // Choose progress bar colors based on mastery level
    let barColor = "bg-red-600";
    if (m.mastery >= 75) {
      barColor = "bg-emerald-600";
    } else if (m.mastery >= 40) {
      barColor = "bg-amber-600";
    }

    return (
      <div key={m.targetId} className="mastery-item bg-stone-900/40 p-2.5 rounded border border-stone-800/80 mb-2">
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="mastery-id font-mono text-stone-200 font-bold">{m.targetId}</span>
          <span className="mastery-pct font-serif text-gold font-bold">%{m.mastery}</span>
        </div>
        <div className="w-full bg-stone-950 h-2 rounded overflow-hidden">
          <div 
            className={`h-full ${barColor} transition-all duration-500`} 
            style={{ width: `${m.mastery}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-[9px] text-stone-500">
          <span>Görülme: {m.seenCount}</span>
          <span>Doğruluk: %{accuracy} ({m.correctCount}/{m.seenCount})</span>
        </div>
        {m.mastery < 60 && (
          <button
            onClick={() => {
              if (m.targetType === "grammar") {
                generateReviewQuest({ grammarIds: [m.targetId] });
              } else if (m.targetType === "vocabulary") {
                generateReviewQuest({ vocabularyIds: [m.targetId] });
              }
            }}
            disabled={actionLoading}
            style={{
              marginTop: "6px",
              background: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              color: "var(--color-primary-light, #d4af37)",
              borderRadius: "4px",
              padding: "4px 6px",
              fontSize: "0.7rem",
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
              display: "block"
            }}
          >
            {actionLoading ? "Görev Üretiliyor..." : "Zayıf Konudan Görev Üret"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mastery-panel flex flex-col h-full overflow-y-auto pr-1">
      <div className="mb-4">
        <h3 className="roman-panel-title text-gold font-serif text-sm border-b border-gold/20 pb-1 mb-3">
          MAGISTERIUM (USTALIK)
        </h3>
        <p className="text-stone-400 text-xs leading-relaxed">
          Roma seferindeki dil becerilerin, doğru ve yanlış cevaplarına göre gerçek zamanlı olarak hesaplanır.
        </p>
      </div>

      {/* Overview of Strong / Weak */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card-status gold-frame p-2 bg-emerald-950/20 border-emerald-900/40">
          <span className="text-[10px] text-emerald-400 block font-bold mb-1">💪 EN GÜÇLÜ KONULAR</span>
          {strongTopics.length === 0 ? (
            <span className="text-stone-500 text-[10px]">Henüz yok</span>
          ) : (
            <div className="flex flex-col gap-1 max-h-20 overflow-y-auto">
              {strongTopics.slice(0, 3).map(t => (
                <span key={t.targetId} className="text-stone-300 text-[10px] truncate font-mono">
                  • {t.targetId} (%{t.mastery})
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card-status gold-frame p-2 bg-red-950/20 border-red-900/40">
          <span className="text-[10px] text-red-400 block font-bold mb-1">⚠️ GELİŞTİRİLMESİ GEREKEN</span>
          {weakTopics.length === 0 ? (
            <span className="text-stone-500 text-[10px]">Henüz yok</span>
          ) : (
            <div className="flex flex-col gap-1 max-h-20 overflow-y-auto">
              {weakTopics.slice(0, 3).map(t => (
                <span key={t.targetId} className="text-stone-300 text-[10px] truncate font-mono">
                  • {t.targetId} (%{t.mastery})
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review suggestions */}
      {reviewSuggestions.length > 0 && (
        <div className="mb-4 bg-stone-900/60 border border-gold/20 p-2.5 rounded">
          <span className="text-[10px] text-gold font-bold block mb-1">💡 ÇALIŞMA TAVSİYELERİ</span>
          <ul className="list-disc pl-4 text-stone-300 text-[11px] space-y-1">
            {reviewSuggestions.map((sug, idx) => (
              <li key={idx} className="leading-snug">{sug}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Mastery categories */}
      <div className="space-y-4">
        {/* Grammar Section */}
        <div>
          <h4 className="category-title text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">
            Gramatika (Dil Bilgisi)
          </h4>
          {grammarMastery.length === 0 ? (
            <p className="text-stone-600 text-xs italic pl-1">Henüz veri yok.</p>
          ) : (
            grammarMastery.map(renderMasteryBar)
          )}
        </div>

        {/* Vocabulary Section */}
        <div>
          <h4 className="category-title text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">
            Vocabula (Kelime Bilgisi)
          </h4>
          {vocabularyMastery.length === 0 ? (
            <p className="text-stone-600 text-xs italic pl-1">Henüz veri yok.</p>
          ) : (
            vocabularyMastery.map(renderMasteryBar)
          )}
        </div>

        {/* Skill Section */}
        <div>
          <h4 className="category-title text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">
            Habilitates (Beceriler)
          </h4>
          {skillMastery.length === 0 ? (
            <p className="text-stone-600 text-xs italic pl-1">Henüz veri yok.</p>
          ) : (
            skillMastery.map(renderMasteryBar)
          )}
        </div>
      </div>
    </div>
  );
};
