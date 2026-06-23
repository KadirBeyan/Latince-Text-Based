import type { InputHTMLAttributes } from "react";
import { cx } from "./classNames";

export function VpInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx("vp-input", className)} {...props} />;
}
