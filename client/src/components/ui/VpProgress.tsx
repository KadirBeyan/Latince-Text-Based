type VpProgressProps = {
  value: number;
  max?: number;
  label?: string;
};

export function VpProgress({ value, max = 100, label }: VpProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return <div className="vp-progress" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}><span style={{ width: `${pct}%` }} /></div>;
}
