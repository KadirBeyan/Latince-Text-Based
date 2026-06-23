import type { ReactNode } from "react";

type VpModalProps = {
  title: string;
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

export function VpModal({ title, open, children, onClose }: VpModalProps) {
  if (!open) return null;
  return (
    <div className="roman-modal-backdrop animate-fade-in" role="presentation" onMouseDown={onClose}>
      <section className="roman-modal-container animate-modal-zoom" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="panel-heading">
          <p className="eyebrow">Dialogus</p>
          <h2>{title}</h2>
        </header>
        {children}
      </section>
    </div>
  );
}
