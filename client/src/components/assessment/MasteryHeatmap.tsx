import { useGameStore } from "../../stores/gameStore";
export function MasteryHeatmap() { const { gameState } = useGameStore(); const states = gameState?.masteryStates ?? []; return <div className="panel-card"><h4>Mastery Heatmap</h4>{states.length === 0 ? <p>Henüz mastery verisi yok.</p> : states.slice(0, 12).map((state) => <div className="mastery-row" key={state.targetType + state.targetId}><span>{state.targetId}</span><div className="mastery-track"><i style={{ width: String(state.mastery) + "%" }} /></div><strong>{state.mastery}</strong></div>)}</div>; }

