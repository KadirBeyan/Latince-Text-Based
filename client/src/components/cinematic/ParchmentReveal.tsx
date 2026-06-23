import type { ReactNode } from "react";

export function ParchmentReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`parchment-reveal ${className}`.trim()}>{children}</div>;
}
