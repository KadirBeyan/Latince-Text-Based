import type { NarrativeMoment } from "../../types/narrativeTypes";
import { CinematicOverlay } from "./CinematicOverlay";

export function QuestCompleteOverlay({ moment }: { moment: NarrativeMoment }) {
  return <CinematicOverlay moment={{ ...moment, latinLine: moment.latinLine ?? "Opus perfectum." }} />;
}
