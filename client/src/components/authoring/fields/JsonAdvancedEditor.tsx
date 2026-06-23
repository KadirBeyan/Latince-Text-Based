import { useMemo, useState } from "react";
import { VpTextarea } from "../../ui";

export function JsonAdvancedEditor({ value, onChange, title = "Gelismis JSON" }: { value: unknown; onChange: (value: any) => void; title?: string }) {
  const [text, setText] = useState(() => JSON.stringify(value ?? {}, null, 2));
  const [error, setError] = useState<string | null>(null);
  const rendered = useMemo(() => JSON.stringify(value ?? {}, null, 2), [value]);
  return (
    <details className="authoring-advanced-json" onToggle={(event) => { if ((event.currentTarget as HTMLDetailsElement).open) setText(rendered); }}>
      <summary>{title}</summary>
      {error ? <small className="authoring-inline-error">JSON gecersiz: {error}</small> : null}
      <VpTextarea className="authoring-json" value={text} onChange={(event) => {
        const next = event.target.value;
        setText(next);
        try { const parsed = JSON.parse(next); setError(null); onChange(parsed); } catch (err) { setError(err instanceof Error ? err.message : "parse error"); }
      }} />
    </details>
  );
}
