import type { HintLevel } from "../../../types/gameTypes";

export function LatinThinkingHint({ level }: { level: HintLevel }) {
  const hints: Record<HintLevel, string> = {
    nudge: "Önce kısa ve açık bir cümle kur. Niyetini taşıyan fiili düşün.",
    vocabulary: "Kelime yardımı: mater = anne, possum = yapabilirim, porto = taşıyorum.",
    structure: "Yapıyı sadeleştir: Certe veya Possum ile başlayıp eylemi ekleyebilirsin.",
    example: "Örnek yapı: “Certe, mater.” veya “Panem porto.”"
  };
  return <p style={{ margin: 0, color: "#c9b98d", fontSize: ".86rem" }}>{hints[level]}</p>;
}
