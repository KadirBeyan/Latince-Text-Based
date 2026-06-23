import { useState } from "react";
import type { PendingFreeformLatinState } from "../../../types/gameTypes";
import { LatinThinkingHint } from "./LatinThinkingHint";

export function PendingLatinExpressionPanel({ pending, onSubmit, disabled }: { pending: PendingFreeformLatinState; onSubmit: (text: string) => void; disabled: boolean }) {
  const [value, setValue] = useState("");
  const send = () => { if (value.trim() && !disabled) onSubmit(value.trim()); };
  return (
    <div style={{ padding: "1.15rem", borderRadius: 12, border: "1px solid #c3a05c", background: "linear-gradient(135deg, rgba(55,42,22,.6), rgba(15,12,9,.85))" }}>
      <p style={{ margin: 0, color: "#e6b450", fontSize: ".76rem", letterSpacing: ".08em", textTransform: "uppercase" }}>Lingua Latina</p>
      <h4 style={{ margin: ".35rem 0" }}>{pending.suggestedLatinPromptTr}</h4>
      <p style={{ margin: "0 0 .75rem", color: "#b9b2a8" }}>Hedef anlam: “{pending.targetMeaningTr}”</p>
      <LatinThinkingHint level={pending.hintLevel ?? "nudge"} />
      <textarea value={value} disabled={disabled} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="Latince sözlerini yaz..." style={{ width: "100%", minHeight: 76, marginTop: ".8rem", padding: ".75rem", borderRadius: 7, border: "1px solid rgba(195,160,92,.35)", background: "rgba(0,0,0,.25)", color: "white", fontFamily: "Georgia, serif", fontSize: "1.06rem" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".65rem" }}><small style={{ color: "#8e877e" }}>{pending.attempts ? `${pending.attempts}. denemeden sonra yardım biraz açıldı.` : "Tek bir kusursuz cevap yok; anlamı kurmaya çalış."}</small><button type="button" onClick={send} disabled={disabled || !value.trim()} style={{ padding: ".5rem 1rem", borderRadius: 6, border: 0, background: "#c3a05c", color: "#17120b", fontWeight: 700 }}>Söyle</button></div>
    </div>
  );
}
