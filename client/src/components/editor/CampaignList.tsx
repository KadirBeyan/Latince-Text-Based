import type { Campaign } from "../../types/gameTypes";
export function CampaignList({ campaigns, onSelect }: { campaigns: Array<Pick<Campaign, "id" | "title" | "description">>; onSelect: (id: string) => void }) {
  return <aside className="editor-list"><h2>Campaigns</h2>{campaigns.map((c) => <button key={c.id} onClick={() => onSelect(c.id)}><strong>{c.title}</strong><small>{c.description}</small></button>)}</aside>;
}
