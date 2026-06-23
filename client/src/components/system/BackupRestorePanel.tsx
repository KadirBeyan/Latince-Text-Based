import { useEffect, useState } from "react";
import { createBackup, exportFullData, importFullData, listBackups, restoreBackup, type BackupSummary } from "../../api/systemApi";
import { revealFile } from "../../api/tauriApi";

export function BackupRestorePanel() {
  const [backups, setBackups] = useState<BackupSummary[]>([]);
  const [message, setMessage] = useState("");
  const [fullDataText, setFullDataText] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() { setBackups(await listBackups()); }
  useEffect(() => { void refresh(); }, []);

  async function create() {
    setBusy(true);
    try { const backup = await createBackup(); setMessage(`Backup oluşturuldu: ${backup.id}`); await refresh(); }
    finally { setBusy(false); }
  }

  async function restore(id: string) {
    setBusy(true);
    try { const result = await restoreBackup(id); setMessage(`${result.restoredSaves} kayıt restore edildi. Safety backup hazır.`); await refresh(); }
    finally { setBusy(false); }
  }

  async function exportFull() {
    setBusy(true);
    try {
      const data = await exportFullData();
      setFullDataText(JSON.stringify(data, null, 2));
      setMessage("Full export hazır.");
    } finally { setBusy(false); }
  }

  async function importFull() {
    setBusy(true);
    try {
      const result = await importFullData(JSON.parse(fullDataText)) as { restoredSaves?: number };
      setMessage(`${result.restoredSaves ?? 0} kayıt import edildi.`);
      await refresh();
    } finally { setBusy(false); }
  }

  return (
    <section className="panel-card system-card">
      <div className="panel-heading compact-heading"><p className="eyebrow">Tutela</p><h3>Backup / Restore</h3></div>
      <div className="settings-actions"><button type="button" onClick={() => void create()} disabled={busy}>Backup Oluştur</button><button type="button" onClick={() => void refresh()}>Listeyi Yenile</button></div>
      <label>
        Full export / import JSON
        <textarea value={fullDataText} onChange={(event) => setFullDataText(event.target.value)} rows={5} placeholder="Full backup JSON" />
      </label>
      <div className="settings-actions"><button type="button" onClick={() => void exportFull()} disabled={busy}>Full Export</button><button type="button" onClick={() => void importFull()} disabled={busy || !fullDataText.trim()}>Full Import</button></div>
      {message ? <p className="test-result success">{message}</p> : null}
      <div className="system-list">
        {backups.length === 0 ? <p className="empty-state">Henüz backup yok.</p> : backups.map((backup) => (
          <article key={backup.id} className="system-list-item">
            <strong>{backup.id}</strong>
            <span>{Math.round(backup.sizeBytes / 1024)} KB</span>
            <button type="button" onClick={() => void restore(backup.id)} disabled={busy}>Restore</button>
            <button type="button" onClick={() => void revealFile(backup.filePath)}>Göster</button>
          </article>
        ))}
      </div>
    </section>
  );
}
