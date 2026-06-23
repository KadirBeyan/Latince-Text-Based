import type { NarrativeMoment } from "../../types/narrativeTypes";
import { CinematicOverlay } from "./CinematicOverlay";

export function RelationshipMomentOverlay({ moment }: { moment: NarrativeMoment }) {
  return <CinematicOverlay moment={moment} />;
}
