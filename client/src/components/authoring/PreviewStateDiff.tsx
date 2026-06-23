import { VpBadge } from "../ui";

export function PreviewStateDiff({ diff }: { diff: any }) {
  if (!diff) return null;
  const chips = [
    diff.xp ? `XP ${signed(diff.xp)}` : null,
    diff.currency ? `Coin ${signed(diff.currency)}` : null,
    diff.sceneChanged ? `Scene ${diff.sceneChanged.from} -> ${diff.sceneChanged.to}` : null,
    diff.flagsChanged?.length ? `Flags ${diff.flagsChanged.length}` : null,
    diff.questStatusChanged?.length ? `Quests ${diff.questStatusChanged.length}` : null,
    diff.relationshipChanged?.length ? `NPC ${diff.relationshipChanged.length}` : null,
    diff.locationFlagsChanged?.length ? `Locations ${diff.locationFlagsChanged.length}` : null,
  ].filter(Boolean);
  return <div className="authoring-chip-row">{chips.length ? chips.map((chip) => <VpBadge key={chip} variant="gold">{chip}</VpBadge>) : <VpBadge>Degisim yok</VpBadge>}</div>;
}

function signed(value: number) { return value > 0 ? `+${value}` : String(value); }
