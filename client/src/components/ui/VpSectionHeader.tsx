type VpSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function VpSectionHeader({ eyebrow, title, description }: VpSectionHeaderProps) {
  return <header className="panel-heading">{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h3>{title}</h3>{description ? <p className="muted">{description}</p> : null}</header>;
}
