import { useEffect, useState } from "react";
import { getAnalytics } from "../../api/assessmentApi";
import { useGameStore } from "../../stores/gameStore";
import type { LearningAnalyticsSummary } from "../../types/assessmentTypes";
import { MasteryHeatmap } from "./MasteryHeatmap";
export function AnalyticsDashboard() { const { currentSaveId, gameState } = useGameStore(); const [summary, setSummary] = useState<LearningAnalyticsSummary | undefined>(gameState?.analyticsSummary as LearningAnalyticsSummary | undefined); useEffect(() => { if (currentSaveId) void getAnalytics(currentSaveId, "all-time").then((r) => setSummary(r.summary)); }, [currentSaveId]); return <div className="panel-stack"><div className="panel-card"><div className="panel-kicker">Tabula</div><h3>Gelişim Raporu</h3><div className="metric-grid"><span>Doğruluk <strong>%{summary?.accuracy ?? 0}</strong></span><span>Doğru <strong>{summary?.correctAnswers ?? 0}</strong></span><span>Yanlış <strong>{summary?.wrongAnswers ?? 0}</strong></span><span>XP <strong>{summary?.xpGained ?? 0}</strong></span></div></div><div className="panel-card"><h4>Sık Hatalar</h4>{(summary?.mostCommonErrorTags ?? []).map((item) => <p key={item.tag}>{item.tag}: {item.count}</p>)}</div><MasteryHeatmap /></div>; }

