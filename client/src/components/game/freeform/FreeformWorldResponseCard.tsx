import type { FreeformWorldResponse } from "../../../types/gameTypes";
import { ConsequencePanel } from "../interaction/ConsequencePanel";

export function FreeformWorldResponseCard({ response }: { response: FreeformWorldResponse }) {
  const color = response.tone === "success" ? "#77c994" : response.tone === "failure" ? "#e7857f" : response.tone === "warning" ? "#e6b450" : "#aeb8c4";
  return <div style={{ padding: "1rem", borderLeft: `3px solid ${color}`, background: "rgba(255,255,255,.025)", borderRadius: 8 }}>
    {response.narrationTr && <p style={{ margin: 0 }}>{response.narrationTr}</p>}
    {response.npcLineLatin && <blockquote style={{ margin: ".7rem 0 .2rem", fontFamily: "Georgia, serif", color: "#f1d99e" }}>“{response.npcLineLatin}”</blockquote>}
    {response.npcLineTr && <small style={{ color: "#999" }}>{response.npcLineTr}</small>}
    {response.feedbackTr && <p style={{ margin: ".6rem 0 0", color }}>{response.feedbackTr}</p>}
    {response.consequencePresentations.length > 0 && <ConsequencePanel consequences={response.consequencePresentations} />}
  </div>;
}
