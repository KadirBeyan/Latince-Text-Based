import type { TextareaHTMLAttributes } from "react";
import { cx } from "./classNames";

export function VpTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx("vp-textarea", className)} {...props} />;
}
