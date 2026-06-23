import { useState } from "react";
import { importFrequencyDictionary, type LexicalImportReportDto } from "../../api/lexiconApi";

export function LexiconImportPanel() {
  const [epubPath, setEpubPath] = useState("");
  const [writeDb, setWriteDb] = useState(false);
  const [report, setReport] = useState<LexicalImportReportDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function runImport() { setError(null); try { const result = await importFrequencyDictionary({ epubPath, dryRun: !writeDb, writeDb, writeJson: true }); setReport(result.report); } catch (err) { setError(err instanceof Error ? err.message : "Import failed."); } }
  return <section className="panel-card"><div className="panel-heading compact-heading"><p className="eyebrow">Systema</p><h3>Frequency Import</h3></div><div className="inline-form"><input value={epubPath} onChange={(event) => setEpubPath(event.target.value)} placeholder="/path/to/book.epub" /><button type="button" onClick={runImport}>Import</button></div><label className="toggle-row"><input type="checkbox" checked={writeDb} onChange={(event) => setWriteDb(event.target.checked)} /> DB’ye yaz</label>{error ? <p className="danger">{error}</p> : null}{report ? <div className="latin-token-list"><div className="latin-token-row"><strong>{report.rawEntryCount}</strong><span>raw</span><small>{report.normalizedEntryCount} entries, {report.formCount} forms</small></div><div className="latin-token-row"><strong>{report.confidenceAverage}</strong><span>confidence</span><small>skipped {report.skippedCount}, duplicate {report.duplicateCount}, db {report.wroteDb ? "yes" : "no"}</small></div><div className="latin-token-row"><strong>Sample</strong><small>{report.sampleEntries.slice(0, 5).map((entry) => entry.displayLemma).join(", ")}</small></div></div> : null}</section>;
}
