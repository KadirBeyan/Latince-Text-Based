import { useEffect, useState } from "react";
import { listSaveIntegrity, repairSave, type SaveIntegrityReport } from "../../api/systemApi";

export function SaveIntegrityPanel() {
  const [reports, setReports] = useState<SaveIntegrityReport[]>([]);
  const [message, setMessage] = useState("");

  async function refresh() { setReports(await listSaveIntegrity()); }
  useEffect(() => { void refresh(); }, []);

  async function repair(saveId: string) {
    const result = await repairSave(saveId);
    setMessage(result.repaired ? "Kayıt onarıldı." : "Otomatik onarım gerektiren alan bulunamadı.");
    await refresh();
  }

  return (
    <section className="panel-card system-card">
      <div className="panel-heading compact-heading"><p className="eyebrow">Integritas</p><h3>Save integrity</h3></div>
      <div className="settings-actions"><button type="button" onClick={() => void refresh()}>Kontrol Et</button></div>
      {message ? <p className="test-result success">{message}</p> : null}
      <div className="system-list">
        {reports.length === 0 ? <p className="empty-state">Kayıt bulunamadı.</p> : reports.map((report) => (
          <article key={report.saveId} className="system-list-item">
            <strong>{report.saveId}</strong>
            <span className={report.ok ? "test-result success" : "test-result danger"}>{report.ok ? "OK" : `${report.issues.length} sorun`}</span>
            <button type="button" onClick={() => void repair(report.saveId)}>Repair</button>
            {report.issues.length > 0 ? <p>{report.issues.map((issue) => issue.message).join(" | ")}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
