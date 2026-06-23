import { LockKeyOpen, SealCheck } from "@phosphor-icons/react";

type Props = { unlocked: boolean; completed?: boolean };

export function LocationUnlockBadge({ unlocked, completed }: Props) {
  const state = completed ? "complete" : unlocked ? "open" : "locked";
  return (
    <span className={"location-unlock-badge " + state} title={completed ? "Chapter completed" : unlocked ? "Chapter unlocked" : "Chapter locked"}>
      {completed ? <SealCheck size={14} weight="fill" /> : <LockKeyOpen size={14} weight={unlocked ? "fill" : "regular"} />}
      <span>{completed ? "Complete" : unlocked ? "Open" : "Locked"}</span>
    </span>
  );
}
