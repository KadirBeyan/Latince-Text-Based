import { useEffect, useState } from "react";
import { getAchievements } from "../../api/assessmentApi";
import { useGameStore } from "../../stores/gameStore";
import type { AchievementState } from "../../types/assessmentTypes";
export function AchievementPanel() { const { currentSaveId, gameState } = useGameStore(); const [items, setItems] = useState<AchievementState[]>(gameState?.achievements ?? []); useEffect(() => { if (currentSaveId) void getAchievements(currentSaveId).then((r) => setItems(r.achievements)); }, [currentSaveId]); return <div className="panel-stack"><div className="panel-card"><div className="panel-kicker">Gloria</div><h3>Başarımlar</h3></div>{items.map((item) => <div className="panel-card" key={item.id}><h4>{item.unlocked ? "✓ " : "○ "}{item.title}</h4><p>{item.description}</p>{item.unlockedAt ? <small>{new Date(item.unlockedAt).toLocaleDateString("tr-TR")}</small> : null}</div>)}</div>; }

