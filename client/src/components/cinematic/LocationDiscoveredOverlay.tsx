import type { NarrativeMoment } from "../../types/narrativeTypes";
import { CinematicOverlay } from "./CinematicOverlay";

export function LocationDiscoveredOverlay({ moment }: { moment: NarrativeMoment }) {
  return <CinematicOverlay moment={moment} />;
}
