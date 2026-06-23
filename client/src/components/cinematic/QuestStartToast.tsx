import type { NarrativeMoment } from "../../types/narrativeTypes";
import { NarrativeToast } from "./NarrativeToast";

export function QuestStartToast({ moment, onDismiss }: { moment: NarrativeMoment; onDismiss?: (id: string) => void }) {
  return <NarrativeToast moment={moment} onDismiss={onDismiss} />;
}
