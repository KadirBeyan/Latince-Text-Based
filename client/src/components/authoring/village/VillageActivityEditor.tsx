import { VpCard, VpSectionHeader, VpTextarea } from "../../ui";
import { Field, JsonBlock, split } from "../SceneEditor";

interface VillageActivityEditorProps {
  data: any;
  onChange: (patch: any) => void;
}

export function VillageActivityEditor({ data, onChange }: VillageActivityEditorProps) {
  // Helpers to handle checkbox toggling for timeWindows
  const toggleTimeWindow = (window: string) => {
    const current = data?.timeWindows ?? [];
    if (current.includes(window)) {
      onChange({ timeWindows: current.filter((w: string) => w !== window) });
    } else {
      onChange({ timeWindows: [...current, window] });
    }
  };

  const handleLifePathChange = (pathId: string, value: string) => {
    const numValue = parseInt(value, 10);
    const currentHints = data?.lifePathHints ?? {};
    if (isNaN(numValue) || numValue <= 0) {
      const nextHints = { ...currentHints };
      delete nextHints[pathId];
      onChange({ lifePathHints: nextHints });
    } else {
      onChange({
        lifePathHints: {
          ...currentHints,
          [pathId]: numValue
        }
      });
    }
  };

  return (
    <div className="authoring-editor-stack">
      <VpCard variant="compact">
        <VpSectionHeader eyebrow="Village Activity" title={data?.titleTr ?? data?.title ?? "Etkinlik"} />
        
        <div className="authoring-form-grid">
          <Field label="id" value={data?.id} onChange={(id) => onChange({ id })} />
          <Field label="titleTr" value={data?.titleTr ?? data?.title} onChange={(titleTr) => onChange({ titleTr })} />
          <Field label="locationId" value={data?.locationId} onChange={(locationId) => onChange({ locationId })} />
          <Field label="sceneId" value={data?.sceneId} onChange={(sceneId) => onChange({ sceneId })} />
          
          <Field
            label="relatedNpcIds (comma separated)"
            value={(data?.relatedNpcIds ?? []).join(", ")}
            onChange={(val) => onChange({ relatedNpcIds: split(val) })}
          />
          
          <Field
            label="suggestedSkills (comma separated)"
            value={(data?.suggestedSkills ?? []).join(", ")}
            onChange={(val) => onChange({ suggestedSkills: split(val) })}
          />

          <Field
            label="cooldownDays (number)"
            value={data?.cooldownDays !== undefined ? String(data.cooldownDays) : ""}
            onChange={(val) => {
              const parsed = parseInt(val, 10);
              onChange({ cooldownDays: isNaN(parsed) ? undefined : parsed });
            }}
          />

          <Field
            label="tags (comma separated)"
            value={(data?.tags ?? []).join(", ")}
            onChange={(val) => onChange({ tags: split(val) })}
          />

          {/* Repeatable Checkbox */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", margin: "16px 0 0" }}>
            <input
              type="checkbox"
              checked={!!data?.repeatable}
              onChange={(e) => onChange({ repeatable: e.target.checked })}
            />
            <span>Tekrar Edebilir (Repeatable)</span>
          </label>
        </div>

        {/* Time Windows Multi-select */}
        <div style={{ padding: "0 16px 16px" }}>
          <span style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "8px", color: "var(--vp-sidebar-muted)" }}>
            Zaman Dilimleri (Time Windows)
          </span>
          <div style={{ display: "flex", gap: "16px" }}>
            {["mane", "meridies", "vesper", "nox"].map((time) => {
              const isChecked = (data?.timeWindows ?? []).includes(time);
              return (
                <label key={time} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleTimeWindow(time)}
                  />
                  <span style={{ textTransform: "capitalize", fontSize: "0.88rem" }}>{time}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Life Path Hints Score Fields */}
        <div style={{ padding: "0 16px 16px", borderTop: "1px dashed var(--vp-border)" }}>
          <span style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", margin: "12px 0 8px", color: "var(--vp-sidebar-muted)" }}>
            Gelecek Yol Puanları (Life Path Hints)
          </span>
          <div className="authoring-form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {["ludus", "castra", "mercatura", "scriptura", "templum", "villa"].map((pathId) => (
              <Field
                key={pathId}
                label={`${pathId} Puanı`}
                value={data?.lifePathHints?.[pathId] !== undefined ? String(data.lifePathHints[pathId]) : ""}
                onChange={(val) => handleLifePathChange(pathId, val)}
              />
            ))}
          </div>
        </div>

        <label className="authoring-wide" style={{ padding: "16px" }}>
          <span>descriptionTr</span>
          <VpTextarea
            value={data?.descriptionTr ?? data?.description ?? ""}
            onChange={(event) => onChange({ descriptionTr: event.target.value })}
          />
        </label>
      </VpCard>

      <JsonBlock data={data} onChange={onChange} />
    </div>
  );
}
