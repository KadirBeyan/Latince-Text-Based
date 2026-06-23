import type { ReactNode } from "react";
import { cx } from "./classNames";

type VpTab<T extends string> = { id: T; label: ReactNode; disabled?: boolean };

type VpTabsProps<T extends string> = {
  tabs: Array<VpTab<T>>;
  active: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  className?: string;
};

export function VpTabs<T extends string>({ tabs, active, onChange, ariaLabel, className }: VpTabsProps<T>) {
  return (
    <nav className={cx("vp-tabs", className)} aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <button key={tab.id} type="button" className={active === tab.id ? "active" : ""} disabled={tab.disabled} onClick={() => onChange(tab.id)}>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
