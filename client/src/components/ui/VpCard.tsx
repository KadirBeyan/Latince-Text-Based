import type { HTMLAttributes } from "react";
import { cx } from "./classNames";

type VpCardVariant = "dark" | "parchment" | "elevated" | "compact" | "interactive";

type VpCardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div";
  variant?: VpCardVariant | VpCardVariant[];
};

export function VpCard({ as: Component = "section", variant = "dark", className, ...props }: VpCardProps) {
  const variants = Array.isArray(variant) ? variant : [variant];
  return <Component className={cx("vp-card", ...variants.map((item) => `vp-card--${item}`), className)} {...props} />;
}
