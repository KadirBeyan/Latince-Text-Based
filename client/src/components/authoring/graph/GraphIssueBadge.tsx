import { VpBadge } from "../../ui";

export function GraphIssueBadge({ errors, warnings, info }: { errors: number; warnings: number; info: number }) {
  if (!errors && !warnings && !info) return <VpBadge variant="success">ok</VpBadge>;
  if (errors) return <VpBadge variant="red">{errors} error</VpBadge>;
  if (warnings) return <VpBadge variant="gold">{warnings} warning</VpBadge>;
  return <VpBadge variant="muted">{info} info</VpBadge>;
}
