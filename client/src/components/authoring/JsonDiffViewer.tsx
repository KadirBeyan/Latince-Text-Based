import { VpCard, VpSectionHeader } from "../ui";

export function JsonDiffViewer({ original, draft }: { original: unknown; draft: unknown }) {
  const changes = diff(original, draft);
  return (
    <VpCard variant="compact" className="json-diff-viewer">
      <VpSectionHeader eyebrow="Diff" title={`${changes.length} change`} />
      <div className="json-diff-list">
        {changes.slice(0, 120).map((change) => <div key={change.path} className={`diff-${change.type}`}><strong>{change.type}</strong><code>{change.path}</code></div>)}
      </div>
    </VpCard>
  );
}

function diff(a: any, b: any, prefix = ""): Array<{ type: "added" | "removed" | "changed"; path: string }> {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (!isObj(a) || !isObj(b)) return [{ type: "changed", path: prefix || "$" }];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].flatMap((key) => key in a && !(key in b) ? [{ type: "removed" as const, path: join(prefix, key) }] : !(key in a) && key in b ? [{ type: "added" as const, path: join(prefix, key) }] : diff(a[key], b[key], join(prefix, key)));
}
function isObj(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === "object"); }
function join(prefix: string, key: string) { return prefix ? `${prefix}.${key}` : key; }
