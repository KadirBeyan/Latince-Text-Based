import { useEffect, useState } from "react";
import { VpButton, VpCard, VpEmptyState, VpSectionHeader } from "../ui";
import { authoringApi } from "../../api/authoringApi";
import type { ContentOverrideEntry } from "../../types/authoringTypes";

export function ContentOverridesPanel() {
  const [overrides, setOverrides] = useState<ContentOverrideEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const load = async () => setOverrides(await authoringApi.overrides());
  useEffect(() => { void load(); }, []);
  return <VpCard variant="compact"><VpSectionHeader eyebrow="Content Overrides" title={`${overrides.length} AppData override`} description="Bu degisiklikler paketlenmis varsayilan icerigi bozmaz; AppData override olarak saklanir." /><div className="authoring-toolbar"><VpButton type="button" variant="ghost" onClick={() => void load()}>Yenile</VpButton><VpButton type="button" variant="ghost" onClick={() => void authoringApi.exportOverrides().then((bundle) => setMessage(`${bundle.overrides.length} override export hazir.`))}>Export</VpButton></div>{message ? <small>{message}</small> : null}{overrides.length === 0 ? <VpEmptyState title="Override yok">Kaydedilen kullanici duzenlemesi bulunmuyor.</VpEmptyState> : <div className="authoring-table">{overrides.map((entry) => <div key={entry.relativePath}><strong>{entry.relativePath}</strong><small>{entry.updatedAt}</small><button type="button" onClick={() => void authoringApi.resetOverride(entry.relativePath).then(load)}>Varsayilana dondur</button><button type="button" onClick={() => navigator.clipboard?.writeText(entry.overridePath)}>Override dosyasini ac</button></div>)}</div>}</VpCard>;
}
