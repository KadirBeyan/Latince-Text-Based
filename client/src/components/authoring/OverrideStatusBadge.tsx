import { VpBadge } from "../ui";
import type { AuthoringDocument } from "../../types/authoringTypes";

export function OverrideStatusBadge({ document }: { document: AuthoringDocument | null }) {
  if (!document) return null;
  return <VpBadge variant={document.hasOverride ? "gold" : "success"}>{document.hasOverride ? "Kullanici duzenlemesi" : "Varsayilan content"}</VpBadge>;
}
