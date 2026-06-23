import type { NarrativeMoment } from "../../types/narrativeTypes";
import { CinematicOverlay } from "./CinematicOverlay";

export function ChapterIntroOverlay({ moment }: { moment: NarrativeMoment }) {
  return <CinematicOverlay moment={{ ...moment, latinLine: moment.latinLine ?? "Incipit capitulum." }} />;
}
