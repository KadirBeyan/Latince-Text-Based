import { useState } from "react";

export function FreeformCommandLine({ onSubmit, disabled, examples = [] }: { onSubmit: (text: string) => void; disabled: boolean; examples?: string[] }) {
  const [value, setValue] = useState("");
  const send = () => { const text = value.trim(); if (!text || disabled) return; onSubmit(text); setValue(""); };
  return (
    <div style={{ marginTop: "1rem", padding: ".9rem 1rem", border: "1px solid rgba(195,160,92,.28)", borderRadius: 10, background: "rgba(9,8,6,.5)" }}>
      <div style={{ display: "flex", gap: ".65rem", alignItems: "center" }}>
        <span aria-hidden style={{ color: "#c3a05c", fontFamily: "monospace" }}>&gt;</span>
        <input value={value} disabled={disabled} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") send(); }} placeholder="Ne yapmak istiyorsun? Yaz..." style={{ flex: 1, border: 0, outline: 0, background: "transparent", color: "white", fontSize: "1rem" }} />
        <button type="button" onClick={send} disabled={disabled || !value.trim()} style={{ padding: ".5rem .9rem", borderRadius: 6, border: "1px solid #c3a05c", background: "rgba(195,160,92,.14)", color: "#e8c982" }}>{disabled ? "Bekle..." : "Söyle / Yap"}</button>
      </div>
      {examples.length > 0 && <p style={{ margin: ".55rem 0 0 1.25rem", color: "#77736d", fontSize: ".76rem" }}>Örn. {examples.slice(0, 3).join(" · ")}</p>}
    </div>
  );
}
