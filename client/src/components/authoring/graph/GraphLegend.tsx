import { VpBadge, VpCard } from "../../ui";

export function GraphLegend() {
  return <VpCard variant="compact" className="scene-graph-legend"><VpBadge variant="bronze">choice</VpBadge><VpBadge variant="gold">text</VpBadge><VpBadge variant="red">hybrid</VpBadge><VpBadge variant="success">completion</VpBadge><VpBadge variant="muted">unreachable</VpBadge></VpCard>;
}
