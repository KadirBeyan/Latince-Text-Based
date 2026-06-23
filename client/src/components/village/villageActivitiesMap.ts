import { VillageActivity } from "../../types/gameTypes";

export const VILLAGE_ACTIVITIES_MAP: Record<string, { titleTr: string; descriptionTr: string; tags: string[] }> = {
  help_mater_bread: {
    titleTr: "Mater'e Ekmek Taşımada Yardım Et",
    descriptionTr: "Annenle birlikte taze ekmekleri pazar yerine götür.",
    tags: ["family", "labor"]
  },
  inspect_village_signs: {
    titleTr: "Köy Girişindeki Tabelaları İncele",
    descriptionTr: "Yazıları ve işaretleri yakından oku.",
    tags: ["study", "observatio"]
  },
  carry_water: {
    titleTr: "Kuyudan Su Taşı",
    descriptionTr: "Ev halkı için kuyudan su çek ve kovaları doldur.",
    tags: ["labor"]
  },
  listen_to_veteran: {
    titleTr: "Veteranus'un Hikayesini Dinle",
    descriptionTr: "Eski askerin anlattığı lejyon disiplinini dinle.",
    tags: ["military", "narrative"]
  },
  help_mercator_market: {
    titleTr: "Mercator'a Tezgâhta Yardım Et",
    descriptionTr: "Gelen malları tasnif et ve fiyatları yaz.",
    tags: ["trade", "labor"]
  },
  observe_scribe_table: {
    titleTr: "Yazıcının Masasını İncele",
    descriptionTr: "Scriba'nın parşömen üzerindeki titiz çalışmasını izle.",
    tags: ["study", "writing"]
  },
  greet_at_shrine: {
    titleTr: "Tapınak Girişinde Selam Ver",
    descriptionTr: "Koruyucu ruhlara Pietas ile yaklaş.",
    tags: ["ritual", "pietas"]
  },
  practice_with_magister: {
    titleTr: "Magister ile Harf Pratiği",
    descriptionTr: "Ruralis öğretmen ile basit heceleri oku.",
    tags: ["study", "language"]
  },
  follow_friend_to_fields: {
    titleTr: "Arkadaşınla Tarlaya Git",
    descriptionTr: "Tarla sınırındaki işleri yapıp sohbet et.",
    tags: ["social", "labor"]
  },
  evening_family_talk: {
    titleTr: "Aileyle Akşam Sohbeti",
    descriptionTr: "Ocak başında günün olaylarını değerlendir.",
    tags: ["family", "narrative"]
  },
  ask_about_ludus: {
    titleTr: "Magister'a Okulu Sor",
    descriptionTr: "Gelecekte Roma'da eğitim alma yollarını araştır.",
    tags: ["narrative", "path"]
  },
  ask_about_castra: {
    titleTr: "Veteranus'a Castra Hayatını Sor",
    descriptionTr: "Askeri kamplarda hayatın nasıl olduğunu öğren.",
    tags: ["narrative", "path"]
  },
  ask_about_trade: {
    titleTr: "Mercator ile Ticaret Konuş",
    descriptionTr: "Malların taşınması ve büyük şehir pazarlarını öğren.",
    tags: ["narrative", "path"]
  },
  collect_herbs: {
    titleTr: "Tarla Kenarından Ot Topla",
    descriptionTr: "Avia'nın ilaçları için şifalı otlar topla.",
    tags: ["labor"]
  },
  scribe_wax: {
    titleTr: "Balmumu Tablete Harf Kazı",
    descriptionTr: "Scriba'nın gözetiminde Latince kelimeleri yaz.",
    tags: ["study", "writing"]
  },
  shrine_offering: {
    titleTr: "Sunak Hediyesi Bırak",
    descriptionTr: "Küçük bir denarius veya buğday sun.",
    tags: ["ritual", "pietas"]
  },
  veteran_story: {
    titleTr: "Veteranus'tan Kartaca Savaşları",
    descriptionTr: "Eski askerin anlattığı büyük sefer hikayesini dinle.",
    tags: ["narrative", "military"]
  },
  market_bargain: {
    titleTr: "Pazarlık Pratiği Yap",
    descriptionTr: "Mercator ile küçük bir zeytinyağı testisi için pazarlık yap.",
    tags: ["trade", "language"]
  },
  field_labor: {
    titleTr: "Tarlada Ağır Çalışma",
    descriptionTr: "Toprağı çapalayarak labor gücünü kanıtla.",
    tags: ["labor"]
  },
  morning_prayer: {
    titleTr: "Sabah Duası",
    descriptionTr: "Günün bereketli geçmesi için Lares sunaklarında dua et.",
    tags: ["ritual", "pietas"]
  }
};

export function getFullActivityDetails(id: string): VillageActivity {
  const mapped = VILLAGE_ACTIVITIES_MAP[id];
  return {
    id,
    titleTr: mapped?.titleTr || id.replaceAll("_", " "),
    descriptionTr: mapped?.descriptionTr || "",
    locationId: "",
    timeWindows: [],
    relatedNpcIds: [],
    tags: mapped?.tags || [],
    repeatable: true,
    sceneId: ""
  };
}
