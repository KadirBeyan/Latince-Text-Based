import type { InteractionIntent, Effect } from "../types/gameTypes";

export interface AmbientTemplateParams {
  id: string;
  labelTr: string;
  descriptionTr?: string;
  verb: "inspect" | "listen" | "read" | "remember" | "wait" | "custom";
  previewConsequenceTr?: string;
  effects: Effect[];
}

export class AmbientActionTemplates {
  private static templates: Record<string, Omit<AmbientTemplateParams, "id" | "effects">> = {
    inspect_object: {
      labelTr: "Çevreyi İncele",
      descriptionTr: "Etraftaki nesneleri ve detayları dikkatlice gözden geçir.",
      verb: "inspect",
      previewConsequenceTr: "Çevredeki bir şeyi keşfedebilir veya ipucu bulabilirsin."
    },
    inspect_inscription: {
      labelTr: "Yazıtı İncele",
      descriptionTr: "Taş yüzeydeki veya duvardaki Latince yazıyı oku.",
      verb: "inspect",
      previewConsequenceTr: "Eski bir yazıtın anlamını çözebilirsin."
    },
    listen_crowd: {
      labelTr: "Etrafı Dinle",
      descriptionTr: "Çevredeki insanların konuşmalarına kulak kabart.",
      verb: "listen",
      previewConsequenceTr: "Dedikodulardan veya fısıltılardan bilgi edinebilirsin."
    },
    remember_lesson: {
      labelTr: "Geçmiş Dersi Hatırla",
      descriptionTr: "Aldığın eğitimleri ve gramer kurallarını zihninde canlandır.",
      verb: "remember",
      previewConsequenceTr: "Gramer veya kelime bilgini tazeleyebilirsin."
    },
    ask_for_example: {
      labelTr: "Örnek Cümle İste",
      descriptionTr: "Karşındakinden kullandığı ifadelere dair bir örnek vermesini iste.",
      verb: "remember",
      previewConsequenceTr: "Latince bir kelimenin kullanımına dair örnek görebilirsin."
    },
    wait_and_observe: {
      labelTr: "Bekle ve Gözlemle",
      descriptionTr: "Sessizce durup insanların ve çevrenin hareketlerini izle.",
      verb: "wait",
      previewConsequenceTr: "Çevredeki değişimleri veya NPC davranışlarını fark edebilirsin."
    },
    read_sign: {
      labelTr: "Tabelayı Oku",
      descriptionTr: "Dükkanın veya binanın üzerindeki tabelayı oku.",
      verb: "read",
      previewConsequenceTr: "Mekan hakkında yeni bir kelime öğrenebilirsin."
    },
    observe_npc: {
      labelTr: "NPC'yi Gözlemle",
      descriptionTr: "Kişinin tavırlarını, kıyafetlerini ve duruşunu incele.",
      verb: "inspect",
      previewConsequenceTr: "Karşındaki kişinin ruh hali veya niyeti hakkında ipucu bulabilirsin."
    }
  };

  static createIntent(params: {
    templateId: string;
    sceneId: string;
    customId?: string;
    labelTrOverride?: string;
    descriptionTrOverride?: string;
    effects?: Effect[];
    previewConsequenceTr?: string;
  }): InteractionIntent {
    const { templateId, sceneId, customId, labelTrOverride, descriptionTrOverride, effects = [], previewConsequenceTr } = params;
    const base = this.templates[templateId];
    if (!base) {
      return {
        id: customId || `${sceneId}_ambient_${templateId}`,
        labelTr: labelTrOverride || "Gözlem Yap",
        descriptionTr: descriptionTrOverride || "Çevreyi gözlemle.",
        verb: "inspect",
        requiresLatin: false,
        effects
      };
    }

    return {
      id: customId || `${sceneId}_ambient_${templateId}`,
      labelTr: labelTrOverride || base.labelTr,
      descriptionTr: descriptionTrOverride || base.descriptionTr,
      verb: base.verb as any,
      requiresLatin: false,
      previewConsequenceTr: previewConsequenceTr || base.previewConsequenceTr,
      effects
    };
  }
}
