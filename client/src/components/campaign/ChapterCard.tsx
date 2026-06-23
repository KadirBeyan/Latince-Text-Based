import { Bank, BookOpen, Coins, House, MapTrifold, Shield, Signpost, Student } from "@phosphor-icons/react";
import type { Chapter, ChapterProgress } from "../../types/gameTypes";
import { LocationUnlockBadge } from "./LocationUnlockBadge";

const icons = [Signpost, Student, House, Coins, BookOpen, Shield, MapTrifold, Bank];

type Props = { chapter: Chapter; index: number; active: boolean; progress?: ChapterProgress };

export function ChapterCard({ chapter, index, active, progress }: Props) {
  const Icon = icons[index] ?? BookOpen;
  const meta = chapter as Chapter & { titleLatin?: string; grammarFocus?: string[]; vocabularyFocus?: string[]; estimatedSceneCount?: number; recommendedLevel?: string };
  const percent = progress?.progressPercent ?? (active ? 1 : 0);
  return (
    <article className={"campaign-chapter-card " + (active ? "active" : "")}>
      <div className="chapter-icon"><Icon size={20} weight="duotone" /></div>
      <div className="chapter-card-main">
        <header>
          <div>
            <p className="eyebrow">{meta.titleLatin || chapter.title}</p>
            <h4>{chapter.title}</h4>
          </div>
          <LocationUnlockBadge unlocked={progress?.unlocked ?? index === 0} completed={progress?.completed} />
        </header>
        <p>{chapter.description}</p>
        <div className="chapter-focus-row">
          {(meta.grammarFocus || []).slice(0, 2).map((focus) => <span key={focus}>{focus.replaceAll("-", " ")}</span>)}
        </div>
        <div className="chapter-metrics">
          <small>{meta.estimatedSceneCount ?? chapter.quests.flatMap((quest) => quest.scenes).length} scenes</small>
          <small>{chapter.quests.length} quests</small>
          <small>{meta.recommendedLevel || "Via"}</small>
        </div>
        <div className="roman-progress chapter-progress" aria-label={chapter.title + " progress"}>
          <span style={{ width: Math.max(0, Math.min(100, percent)) + "%" }} />
        </div>
      </div>
    </article>
  );
}
