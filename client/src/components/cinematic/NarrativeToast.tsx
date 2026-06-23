import { CheckCircle, Gift, MapPin, Scroll, Sparkle, WarningCircle, X } from "@phosphor-icons/react";
import type { NarrativeMoment } from "../../types/narrativeTypes";

const icons = { check: CheckCircle, gift: Gift, map: MapPin, scroll: Scroll, sparkle: Sparkle, warning: WarningCircle, x: X };

export function NarrativeToast({ moment, onDismiss }: { moment: NarrativeMoment; onDismiss?: (id: string) => void }) {
  const Icon = icons[moment.icon as keyof typeof icons] ?? Scroll;
  return (
    <article className={`narrative-toast tone-${moment.tone}`} onClick={() => onDismiss?.(moment.id)}>
      <Icon size={20} weight="duotone" aria-hidden="true" />
      <div>
        <strong>{moment.titleTr}</strong>
        {moment.subtitleTr ? <span>{moment.subtitleTr}</span> : null}
      </div>
    </article>
  );
}
