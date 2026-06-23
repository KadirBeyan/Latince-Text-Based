import type { NarrativeMoment } from "../../types/narrativeTypes";
import { CinematicOverlay } from "./CinematicOverlay";

export function ChapterCompleteOverlay({ moment }: { moment: NarrativeMoment }) {
  return <CinematicOverlay moment={{ ...moment, latinLine: moment.latinLine ?? "Bene fecisti." }} />;
}
