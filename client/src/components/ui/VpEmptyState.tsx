type VpEmptyStateProps = {
  title?: string;
  children: string;
};

export function VpEmptyState({ title, children }: VpEmptyStateProps) {
  return <div className="vp-empty-state">{title ? <strong>{title}</strong> : null}<p>{children}</p></div>;
}
