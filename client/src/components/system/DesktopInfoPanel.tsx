import { useEffect, useState } from "react";
import { getHealth, getSystemInfo, type DesktopInfo } from "../../api/systemApi";
import { ensureBackendRunning, getTauriAppInfo, openAppDataDir, type TauriAppInfo, type TauriBackendInfo } from "../../api/tauriApi";

export function DesktopInfoPanel() {
  const [info, setInfo] = useState<DesktopInfo | null>(null);
  const [appInfo, setAppInfo] = useState<TauriAppInfo | null>(null);
  const [backendInfo, setBackendInfo] = useState<TauriBackendInfo | null>(null);
  const [health, setHealth] = useState<string>("yoklanıyor");

  async function refresh() {
    const nextBackendInfo = await ensureBackendRunning().catch(() => null);
    const [nextInfo, nextHealth, nextAppInfo] = await Promise.all([getSystemInfo(), getHealth(), getTauriAppInfo().catch(() => null)]);
    setInfo(nextInfo);
    setAppInfo(nextAppInfo);
    setBackendInfo(nextBackendInfo);
    setHealth(nextHealth.ok ? "çalışıyor" : "erişilemiyor");
  }

  useEffect(() => { void refresh().catch(() => setHealth("erişilemiyor")); }, []);

  return (
    <section className="panel-card system-card">
      <div className="panel-heading compact-heading"><p className="eyebrow">Desktop</p><h3>App durumu</h3></div>
      <dl className="system-info-list">
        <dt>Backend</dt><dd>{health}</dd>
        <dt>API</dt><dd>{backendInfo?.apiBase ?? "http://localhost:3001"}</dd>
        <dt>Yönetim</dt><dd>{backendInfo?.managedByTauri ? "Tauri" : "harici/dev"}</dd>
        <dt>Version</dt><dd>{appInfo?.version ?? info?.version ?? "-"}</dd>
        <dt>Mode</dt><dd>{info?.mode ?? "-"}</dd>
        <dt>App data</dt><dd>{appInfo?.appDataDir ?? info?.appDataDir ?? "-"}</dd>
        <dt>Database</dt><dd>{info?.databasePath ?? "-"}</dd>
      </dl>
      <div className="settings-actions">
        <button type="button" onClick={() => void refresh()}>Yenile</button>
        <button type="button" onClick={() => void openAppDataDir()}>App Data Aç</button>
      </div>
    </section>
  );
}
