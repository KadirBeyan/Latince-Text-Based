type VpStatCardProps = {
  label: string;
  value: string | number;
  detail?: string;
};

export function VpStatCard({ label, value, detail }: VpStatCardProps) {
  return <article className="vp-card vp-card--compact"><p className="eyebrow">{label}</p><strong className="progress-number">{value}</strong>{detail ? <small className="muted">{detail}</small> : null}</article>;
}
