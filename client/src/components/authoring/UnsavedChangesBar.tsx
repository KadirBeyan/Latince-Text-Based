import { ArrowCounterClockwise, FloppyDisk, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { VpButton } from "../ui";

export function UnsavedChangesBar({ visible, saving, statusMessage, onSave, onValidate, onDiscard }: { visible: boolean; saving: boolean; statusMessage?: string | null; onSave: () => void; onValidate: () => void; onDiscard: () => void }) {
  if (!visible && !statusMessage) return null;
  return (
    <div className={visible ? "authoring-unsaved" : "authoring-unsaved is-clean"}>
      <span>{visible ? <WarningCircle size={18} weight="bold" /> : <ShieldCheck size={18} weight="bold" />} {visible ? "Kaydedilmemis degisiklikler" : statusMessage}</span>
      {statusMessage && visible ? <small>{statusMessage}</small> : null}
      {visible ? <VpButton variant="ghost" icon={<ArrowCounterClockwise size={17} />} onClick={onDiscard}>Discard changes</VpButton> : null}
      <VpButton variant="ghost" onClick={onValidate}>Validate</VpButton>
      <VpButton icon={<FloppyDisk size={18} />} disabled={saving || !visible} onClick={onSave}>{saving ? "Saving" : "Save"}</VpButton>
    </div>
  );
}
