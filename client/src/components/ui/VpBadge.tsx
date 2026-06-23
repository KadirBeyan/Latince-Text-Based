import type { HTMLAttributes } from "react";
import { cx } from "./classNames";

type VpBadgeVariant = "gold" | "bronze" | "red" | "success" | "muted" | "level" | "grammar" | "vocabulary";

export function VpBadge({ variant = "muted", className, ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: VpBadgeVariant }) {
  const mapped = variant === "level" ? "gold" : variant === "grammar" ? "bronze" : variant === "vocabulary" ? "success" : variant;
  return <span className={cx("vp-badge", `vp-badge--${mapped}`, className)} {...props} />;
}
