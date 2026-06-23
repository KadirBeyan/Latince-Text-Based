import { useEffect, useRef } from "react";
import { CheckCircle, Gift, Handshake, MapPin, Scroll, Sparkle, Trophy, WarningCircle, XCircle } from "@phosphor-icons/react";
import type { NarrativeMoment } from "../../types/narrativeTypes";
import { useCinematicStore } from "../../stores/cinematicStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { RewardReveal } from "./RewardReveal";
import { RomanDivider } from "./RomanDivider";

const icons = { check: CheckCircle, gift: Gift, handshake: Handshake, laurel: Trophy, map: MapPin, scroll: Scroll, sparkle: Sparkle, trophy: Trophy, warning: WarningCircle, x: XCircle };

export function CinematicOverlay({ moment }: { moment: NarrativeMoment }) {
  const { dismissActive, reducedMotion } = useCinematicStore();
  const { settings } = useSettingsStore();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const Icon = icons[moment.icon as keyof typeof icons] ?? Scroll;

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissActive();
      if (event.key === "Tab") {
        const focusable = closeRef.current;
        if (focusable) {
          event.preventDefault();
          focusable.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismissActive]);

  return (
    <div className="cinematic-backdrop" role="presentation">
      <section className={`cinematic-overlay tone-${moment.tone}`} role="dialog" aria-modal="true" aria-labelledby="cinematic-title" aria-describedby="cinematic-body">
        <div className="cinematic-icon"><Icon size={40} weight="duotone" aria-hidden="true" /></div>
        {moment.latinLine ? <p className="cinematic-latin">{moment.latinLine}</p> : null}
        <h2 id="cinematic-title">{moment.titleTr}</h2>
        {moment.subtitleTr ? <p className="cinematic-subtitle">{moment.subtitleTr}</p> : null}
        <RomanDivider />
        {moment.bodyTr ? <p id="cinematic-body" className="cinematic-body">{moment.bodyTr}</p> : null}
        <RewardReveal rewardSummary={moment.rewardSummary} reducedMotion={reducedMotion || !settings.rewardAnimations} />
        <button ref={closeRef} type="button" className="cinematic-continue" onClick={dismissActive}>Devam Et</button>
      </section>
    </div>
  );
}
