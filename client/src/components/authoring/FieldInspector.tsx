import { VpBadge, VpCard, VpSectionHeader } from "../ui";
import type { AuthoringDocument } from "../../types/authoringTypes";

export function FieldInspector({ document, data }: { document: AuthoringDocument | null; data: any }) {
  const keys = data && typeof data === "object" ? Object.keys(data) : [];
  return (
    <VpCard variant="compact" className="authoring-side-card">
      <VpSectionHeader eyebrow="Inspector" title={document?.title ?? "Document"} />
      <div className="authoring-chip-row">
        {document ? <VpBadge variant="gold">{document.kind}</VpBadge> : null}
        {document?.updatedAt ? <VpBadge variant="muted">{new Date(document.updatedAt).toLocaleString()}</VpBadge> : null}
      </div>
      <dl className="authoring-facts">
        <dt>ID</dt><dd>{document?.id ?? "-"}</dd>
        <dt>Path</dt><dd>{document?.path ?? "-"}</dd>
        <dt>Fields</dt><dd>{keys.length}</dd>
      </dl>
    </VpCard>
  );
}
