import { FloppyDisk, WarningCircle } from "@phosphor-icons/react";
import { VpButton } from "../ui";

export function UnsavedChangesBar({ visible, saving, onSave, onValidate }: { visible: boolean; saving: boolean; onSave: () => void; onValidate: () => void }) {
  if (!visible) return null;
  return <div className="authoring-unsaved"><span><WarningCircle size={18} weight="bold" /> Kaydedilmemis degisiklikler</span><VpButton variant="ghost" onClick={onValidate}>Validate</VpButton><VpButton icon={<FloppyDisk size={18} />} disabled={saving} onClick={onSave}>{saving ? "Saving" : "Save"}</VpButton></div>;
}
