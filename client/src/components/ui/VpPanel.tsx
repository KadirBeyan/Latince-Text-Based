import type { HTMLAttributes } from "react";
import { cx } from "./classNames";

export function VpPanel({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cx("vp-panel", className)} {...props} />;
}
