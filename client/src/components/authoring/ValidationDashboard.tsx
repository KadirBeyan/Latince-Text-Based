import { VpBadge, VpCard, VpSectionHeader } from "../ui";
import { useAuthoringStore } from "../../stores/authoringStore";

export function ValidationDashboard() {
  const { allValidation, metrics, validateAll } = useAuthoringStore();
  const issues = allValidation ? [...allValidation.errors, ...allValidation.warnings, ...allValidation.info] : [];
  return <div className="authoring-editor-stack"><VpCard variant="compact"><VpSectionHeader eyebrow="Validation" title={`Global score ${allValidation?.score ?? metrics?.validationScore ?? "-"}`} /><button type="button" className="authoring-link-button" onClick={() => void validateAll()}>Run validation</button><div className="authoring-chip-row"><VpBadge variant="red">{allValidation?.errors.length ?? metrics?.errors ?? 0} errors</VpBadge><VpBadge variant="gold">{allValidation?.warnings.length ?? metrics?.warnings ?? 0} warnings</VpBadge><VpBadge variant="muted">{allValidation?.info.length ?? metrics?.info ?? 0} info</VpBadge></div></VpCard><VpCard variant="compact"><VpSectionHeader eyebrow="Top Issues" title="Issue codes" /><div className="authoring-graph">{(metrics?.topIssueCodes ?? []).map((item) => <span key={item.code}>{item.code}: {item.count}</span>)}</div></VpCard><VpCard variant="compact"><VpSectionHeader eyebrow="Issues" title={`${issues.length} entries`} /><ul className="authoring-issue-list">{issues.map((issue) => <li key={issue.id} className={`is-${issue.severity}`}><strong>{issue.code}</strong><span>{issue.messageTr}</span><small>{issue.path}</small></li>)}</ul></VpCard></div>;
}
