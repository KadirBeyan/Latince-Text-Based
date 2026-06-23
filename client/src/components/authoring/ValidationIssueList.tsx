import { VpBadge, VpCard, VpEmptyState, VpSectionHeader } from "../ui";
import type { AuthoringValidationResult } from "../../types/authoringTypes";
import { useFieldFocus } from "./useFieldFocus";

export function ValidationIssueList({ validation }: { validation: AuthoringValidationResult | null }) {
  const focusField = useFieldFocus();
  const issues = validation ? [...validation.errors, ...validation.warnings, ...validation.info] : [];
  return (
    <VpCard variant="compact" className="authoring-side-card">
      <VpSectionHeader eyebrow="Validation" title={validation ? `Score ${validation.score}` : "No result"} />
      <div className="authoring-chip-row">
        <VpBadge variant={validation?.ok ? "success" : "red"}>{validation?.ok ? "Valid" : "Needs QA"}</VpBadge>
        <VpBadge variant="red">{validation?.errors.length ?? 0} error</VpBadge>
        <VpBadge variant="gold">{validation?.warnings.length ?? 0} warning</VpBadge>
      </div>
      {issues.length === 0 ? <VpEmptyState title="Temiz">Bu belge icin aktif issue yok.</VpEmptyState> : (
        <ul className="authoring-issue-list">
          {issues.slice(0, 80).map((issue) => <li key={issue.id} className={`is-${issue.severity}`}><button type="button" onClick={() => focusField(issue.path)}><strong>{issue.code}</strong><span>{issue.messageTr}</span><small>{issue.path}</small></button></li>)}
        </ul>
      )}
    </VpCard>
  );
}
