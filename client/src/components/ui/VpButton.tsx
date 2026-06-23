import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./classNames";

type VpButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "parchment" | "gold";

type VpButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: VpButtonVariant;
  icon?: ReactNode;
};

export function VpButton({ variant = "primary", icon, className, children, ...props }: VpButtonProps) {
  return (
    <button className={cx("vp-button", `vp-button--${variant}`, className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
