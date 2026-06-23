import { VpCard, VpSectionHeader } from "../ui";
import { RewardReveal } from "../cinematic/RewardReveal";

type PreviewKind = "scene" | "dialogue" | "quest" | "chapter";

export function CinematicPreview({ kind, data }: { kind: PreviewKind; data: any }) {
  const title = data?.titleTr ?? data?.title ?? (kind === "chapter" ? "Capitulum" : kind === "quest" ? "Quest" : "Sahne");
  const latin = data?.titleLatin ?? (kind === "quest" ? "Opus perfectum" : kind === "chapter" ? "Incipit capitulum" : "Scriptorium Romanum");
  return (
    <VpCard variant="compact" className="cinematic-preview-card">
      <VpSectionHeader eyebrow="Cinematic Preview" title={title} />
      <div className="cinematic-preview-surface">
        <p className="cinematic-preview-latin">{latin}</p>
        <h4>{title}</h4>
        {kind === "scene" ? <p>{data?.objective ?? data?.descriptionTr ?? data?.description ?? "Sahne başlığı, hedef ve öğrenme odağı burada görünür."}</p> : null}
        {kind === "dialogue" ? <DialoguePreview data={data} /> : null}
        {kind === "quest" ? <QuestPreview data={data} /> : null}
        {kind === "chapter" ? <ChapterPreview data={data} /> : null}
      </div>
    </VpCard>
  );
}

function DialoguePreview({ data }: { data: any }) {
  const challenge = data?.dialogueChallenge ?? data;
  return <div className="cinematic-preview-dialogue"><strong>Magister</strong><p>“{challenge?.npcPromptLatin ?? "Quis es?"}”</p><span>{challenge?.playerIntentTr ?? "NPC senden kendini tanıtmanı istiyor."}</span><small>Recte! NPC doğal tepki ve pedagojik notla birlikte görünür.</small></div>;
}

function QuestPreview({ data }: { data: any }) {
  return <div className="cinematic-preview-dialogue"><strong>Görev Tamamlandı</strong><p>{data?.descriptionTr ?? data?.description ?? "Opus perfectum. Emeğin ödüllendirildi."}</p><RewardReveal rewardSummary={{ xp: 40, currency: 8, mastery: data?.learningFocus?.grammarIds?.slice(0, 2) ?? [] }} reducedMotion /></div>;
}

function ChapterPreview({ data }: { data: any }) {
  return <div className="cinematic-preview-dialogue"><strong>Bölüme Başla</strong><p>{data?.descriptionTr ?? data?.description ?? "Yeni bölüm mood, grammar focus ve vocabulary focus rozetleriyle açılır."}</p><div className="scene-title-badges">{(data?.grammarFocus ?? []).slice(0, 3).map((item: string) => <span key={item}>{item}</span>)}</div></div>;
}
