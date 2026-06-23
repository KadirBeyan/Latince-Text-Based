import { VpCard, VpSectionHeader } from "../ui";
import { Field, JsonBlock } from "./SceneEditor";

export function CampaignEditor({ data, onChange }: { data: any; onChange: (patch: any) => void }) {
  return <div className="authoring-editor-stack"><VpCard variant="compact"><VpSectionHeader eyebrow="Campaign" title={data?.title ?? "Campaign"} /><div className="authoring-form-grid"><Field label="id" value={data?.id} onChange={(id) => onChange({ id })} /><Field label="title" value={data?.title} onChange={(title) => onChange({ title })} /><Field label="startChapterId" value={data?.startChapterId} onChange={(startChapterId) => onChange({ startChapterId })} /><Field label="chapterCount" value={data?.chapters?.length ?? 0} onChange={() => undefined} /></div></VpCard><JsonBlock data={data} onChange={onChange} /></div>;
}
