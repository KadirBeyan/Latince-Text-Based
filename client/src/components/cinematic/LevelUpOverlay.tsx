import type { NarrativeMoment } from "../../types/narrativeTypes";
import { CinematicOverlay } from "./CinematicOverlay";

export function LevelUpOverlay({ moment }: { moment: NarrativeMoment }) {
  return <CinematicOverlay moment={{ ...moment, latinLine: moment.latinLine ?? "Nova aetas." }} />;
}
