import type { HTMLAttributes } from "react";
import { cx } from "./classNames";

export function VpToast({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("reward-toast-item animate-toast-in", className)} role="status" {...props} />;
}
