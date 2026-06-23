import React, { useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { debugSetScene, debugAddXp, debugAddCurrency, debugSetFlag, debugCompleteQuest } from "../../api/debugApi";

export const DebugPanel: React.FC = () => {
  const { currentSaveId, gameState, forceSetGameState } = useGameStore();

  const [selectedSceneId, setSelectedSceneId] = useState("");
  const [selectedQuestId, setSelectedQuestId] = useState("");
  const [xpAmount, setXpAmount] = useState(100);
  const [currencyAmount, setCurrencyAmount] = useState(50);
  const [flagKey, setFlagKey] = useState("");
  const [flagValue, setFlagValue] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Render only in development mode
  if (!import.meta.env.DEV) return null;

  const campaign = gameState?.currentCampaign;
  const quests = campaign?.chapters.flatMap(c => c.quests) ?? [];
  const scenes = quests.flatMap(q => q.scenes) ?? [];

  const handleAction = async (actionFn: () => Promise<any>) => {
    if (!currentSaveId) return;
    setError(null);
    setLoading(true);
    try {
      const updatedSave = await actionFn();
      // To sync frontend state, fetch latest GameState or reconstruct it
      // Let's reload GameState from gameStore by calling the state update or refreshing.
      // Since debug update returns PlayerSave, we need to map or reload. Let's fetch latest game state using the saveId:
      const { getGameState } = await import("../../api/gameApi");
      const newState = await getGameState(currentSaveId);
      forceSetGameState(newState);
    } catch (err: any) {
      setError(err?.message ?? "Debug işlemi başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="debug-panel p-3 bg-stone-950/90 border border-red-950 rounded text-stone-100">
      <div className="border-b border-red-900 pb-1 mb-3 flex items-center justify-between">
        <h4 className="text-red-500 font-bold text-xs uppercase tracking-wider">🛠️ Hata Ayıklama (Debug)</h4>
        {loading && <span className="text-[10px] text-stone-400">Yükleniyor...</span>}
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900 text-red-400 text-[10px] p-2 rounded mb-3">
          {error}
        </div>
      )}

      <div className="space-y-4 text-xs">
        {/* Set Scene */}
        <div className="debug-item bg-stone-900/50 p-2 rounded">
          <label className="block text-stone-400 text-[10px] font-bold mb-1">SAHNE DEĞİŞTİR</label>
          <div className="flex gap-1.5">
            <select 
              className="flex-1 bg-stone-950 border border-stone-800 text-stone-300 p-1 text-xs rounded"
              value={selectedSceneId}
              onChange={e => setSelectedSceneId(e.target.value)}
            >
              <option value="">Seçiniz...</option>
              {scenes.map(s => (
                <option key={s.id} value={s.id}>{s.id} ({s.title})</option>
              ))}
            </select>
            <button 
              className="btn-roman border border-red-900 text-[10px] py-1 px-2.5 bg-red-950/20 text-red-400 hover:bg-red-900/40"
              onClick={() => handleAction(() => debugSetScene(currentSaveId!, selectedSceneId))}
              disabled={loading || !selectedSceneId}
            >
              Git
            </button>
          </div>
        </div>

        {/* Quest Complete */}
        <div className="debug-item bg-stone-900/50 p-2 rounded">
          <label className="block text-stone-400 text-[10px] font-bold mb-1">GÖREV TAMAMLA</label>
          <div className="flex gap-1.5">
            <select 
              className="flex-1 bg-stone-950 border border-stone-800 text-stone-300 p-1 text-xs rounded"
              value={selectedQuestId}
              onChange={e => setSelectedQuestId(e.target.value)}
            >
              <option value="">Seçiniz...</option>
              {quests.map(q => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
            <button 
              className="btn-roman border border-red-900 text-[10px] py-1 px-2.5 bg-red-950/20 text-red-400 hover:bg-red-900/40"
              onClick={() => handleAction(() => debugCompleteQuest(currentSaveId!, selectedQuestId))}
              disabled={loading || !selectedQuestId}
            >
              Bitir
            </button>
          </div>
        </div>

        {/* Boosters Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Add XP */}
          <div className="debug-item bg-stone-900/50 p-2 rounded">
            <label className="block text-stone-400 text-[10px] font-bold mb-1">XP EKLE</label>
            <div className="flex gap-1">
              <input 
                type="number" 
                className="w-16 bg-stone-950 border border-stone-800 text-stone-300 p-1 text-xs rounded text-center"
                value={xpAmount}
                onChange={e => setXpAmount(Number(e.target.value))}
              />
              <button 
                className="flex-1 btn-roman border border-red-900 text-[10px] bg-red-950/20 text-red-400 hover:bg-red-900/40"
                onClick={() => handleAction(() => debugAddXp(currentSaveId!, xpAmount))}
                disabled={loading}
              >
                +XP
              </button>
            </div>
          </div>

          {/* Add Currency */}
          <div className="debug-item bg-stone-900/50 p-2 rounded">
            <label className="block text-stone-400 text-[10px] font-bold mb-1">DENARII EKLE</label>
            <div className="flex gap-1">
              <input 
                type="number" 
                className="w-16 bg-stone-950 border border-stone-800 text-stone-300 p-1 text-xs rounded text-center"
                value={currencyAmount}
                onChange={e => setCurrencyAmount(Number(e.target.value))}
              />
              <button 
                className="flex-1 btn-roman border border-red-900 text-[10px] bg-red-950/20 text-red-400 hover:bg-red-900/40"
                onClick={() => handleAction(() => debugAddCurrency(currentSaveId!, currencyAmount))}
                disabled={loading}
              >
                +Para
              </button>
            </div>
          </div>
        </div>

        {/* Set Flag */}
        <div className="debug-item bg-stone-900/50 p-2 rounded">
          <label className="block text-stone-400 text-[10px] font-bold mb-1">DURUM BAYRAĞI AYARLA (FLAG)</label>
          <div className="flex flex-col gap-1.5">
            <input 
              type="text" 
              placeholder="Bayrak Anahtarı (örn: met_senator)" 
              className="bg-stone-950 border border-stone-800 text-stone-300 p-1 text-xs rounded"
              value={flagKey}
              onChange={e => setFlagKey(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-stone-400 text-[10px]">
                <input 
                  type="checkbox"
                  checked={flagValue}
                  onChange={e => setFlagValue(e.target.checked)}
                />
                Değer (True/False)
              </label>
              <button 
                className="btn-roman border border-red-900 text-[10px] py-1 px-3 bg-red-950/20 text-red-400 hover:bg-red-900/40"
                onClick={() => handleAction(() => debugSetFlag(currentSaveId!, flagKey, flagValue))}
                disabled={loading || !flagKey.trim()}
              >
                Ayarla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
