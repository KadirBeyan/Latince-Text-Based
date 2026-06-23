import type { ValidationResult } from "../../types/gameTypes";
export function ValidationPanel({ result }: { result?: ValidationResult }) {
  if (!result) return <section className="validation-panel"><h3>Validation</h3><p>Henüz çalıştırılmadı.</p></section>;
  return <section className="validation-panel"><h3>{result.ok ? "Geçerli" : "Hatalı"}</h3>{[...result.errors, ...result.warnings].map((i, n) => <p key={`${i.code}-${n}`} className={`issue-${i.severity}`}><b>{i.code}</b> {i.path}: {i.message}</p>)}</section>;
}
