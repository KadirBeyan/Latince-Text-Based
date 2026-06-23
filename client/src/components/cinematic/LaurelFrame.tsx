import type { ReactNode } from "react";

export function LaurelFrame({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "roman" | "muted" }) {
  return <div className={`laurel-frame tone-${tone}`}>{children}</div>;
}
