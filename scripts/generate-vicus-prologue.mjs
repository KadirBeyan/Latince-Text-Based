import fs from "node:fs";
import path from "node:path";

const out = path.resolve("data/campaigns/via-prima/chapters/vicus.json");

const baseVocab = ["vocab-salve", "vocab-vale", "vocab-nomen", "vocab-mihi", "vocab-aqua", "vocab-panis"];
const grammar = ["greetings-basic", "sum-esse-present", "ego-tu-basic", "simple-sentence-basic"];

const scenes = [
  ["vicus_001_home_morning", "Evde Sabah", "home_hut", ["mater", "pater"], "Şafak evin küçük kapısından içeri sızıyor. Mater su kabını, pater de dışarıdaki yolu işaret ediyor.", "Ailenle konuş ve köy sabahına hazırlan.", "mater", "Salve, fili. Quid hodie agis?", "Günaydın, evlat. Bugün ne yapacaksın?", "urbanitas", "villa", "vicus_002_village_path", "Mater sende ev sözüne kulak veren bir dikkat görüyor."],
  ["vicus_002_village_path", "Köy Yoluna Çıkış", "village_path", ["amicus"], "Toprak yol boyunca komşular selam verir; uzakta pazarın ve tarlanın sesleri birbirine karışır.", "Köy yolunda ilk selamlaşmaları yönet.", "amicus", "Salve! Venisne mecum?", "Selam! Benimle geliyor musun?", "lingua", "villa", "vicus_003_market_help", "Komşular doğru selamını hatırlar."],
  ["vicus_003_market_help", "Pazarda Yardım", "village_market", ["mercator_vicus"], "Küçük pazarda panis, aqua ve birkaç denarius konuşulur. Mercator seni tartının yanına çağırır.", "Mercator'a yardım et ve alışveriş sözlerini öğren.", "mercator_vicus", "Panem vides? Pretium dic.", "Ekmeği görüyor musun? Fiyatı söyle.", "mercatura", "mercatura", "vicus_004_field_edge", "Mercator pazarlığa yatkın olduğunu sezdi."],
  ["vicus_004_field_edge", "Tarla Kenarı", "field_edge", ["pater"], "Tarlanın kenarında saban izi, taşlar ve küçük bir su oluğu var. Pater kısa emirlerle işi gösterir.", "Tarla işinde dikkat ve labor göster.", "pater", "Porta aquam, quaeso.", "Suyu getir, lütfen.", "labor", "villa", "vicus_005_teacher_corner", "Pater pratik işlerde güvenilir olduğunu fark etti."],
  ["vicus_005_teacher_corner", "Magister ile Karşılaşma", "teacher_corner", ["magister_ruralis"], "Bir duvar gölgesinde magister çocuklara kısa cümleler söyletiyor. Seni görünce sorusunu sana çevirir.", "Kendini Latince tanıt.", "magister_ruralis", "Quis es? Quod est nomen tibi?", "Kimsin? Adın nedir?", "lingua", "ludus", "vicus_006_veteran_bench", "Magister sende öğrenme isteği görüyor."],
  ["vicus_006_veteran_bench", "Veteranus'un Bankı", "veteran_bench", ["veteranus"], "Eski asker gölgede oturur; bastonunu yere vurup kısa emirleri açık ve sakin söyler.", "Veteranus'un düzenli sözlerini anla.", "veteranus", "Sta. Audi. Responde.", "Dur. Dinle. Cevap ver.", "disciplina", "castra", "vicus_007_scribe_table", "Veteranus sende disiplin fark ediyor."],
  ["vicus_007_scribe_table", "Scriba'nın Masası", "scribe_table", ["scriba_vicus"], "Tabula üzerinde balmumu çizikleri, yanında stilus ve küçük notlar durur.", "Yazıcının masasındaki harfleri çöz.", "scriba_vicus", "Litteras vides? Lege lente.", "Harfleri görüyor musun? Yavaş oku.", "scriptura", "scriptura", "vicus_008_shrine", "Scriba yazıya yatkınlığını not etti."],
  ["vicus_008_shrine", "Küçük Tapınak", "shrine", ["ministra", "avia"], "Köyün küçük tapınak alanında tütsü kokusu ve sessiz bir saygı var.", "Ritüel sözlerini saygıyla karşıla.", "ministra", "Salve. Dis bene dic.", "Selam. Tanrılara iyi söz söyle.", "pietas", "templum", "vicus_009_old_oak", "Ministra sende pietas gördü."],
  ["vicus_009_old_oak", "Yaşlı Ağacın Yanı", "old_oak", ["avia", "amicus"], "Yaşlı ağacın altında avia eski bir aile sözünü tekrar eder; amicus köy dışındaki yolu izler.", "Hatırayı dinle ve merakını tart.", "avia", "Memoria familiam servat.", "Hafıza aileyi korur.", "memoria", "templum", "vicus_010_friend_talk", "Avia güçlü hafızanı gülümseyerek andı."],
  ["vicus_010_friend_talk", "Arkadaşla Konuşma", "village_path", ["amicus"], "Amicus yol taşına oturmuş, pazarı, okulu ve asker hikâyelerini aynı anda konuşmak istiyor.", "Arkadaşının merakına cevap ver.", "amicus", "Visne videre mundum?", "Dünyayı görmek ister misin?", "observatio", "ludus", "vicus_011_lost_token", "Amicus sende köy dışına bakan bir dikkat sezdi."],
  ["vicus_011_lost_token", "Kayıp Küçük Eşya", "village_market", ["mercator_vicus", "amicus"], "Pazar kalabalığında küçük bir işaret taşı kaybolmuş. Herkes başka bir yeri gösteriyor.", "Kayıp eşyayı durumu kilitlemeden çöz.", "mercator_vicus", "Ubi est signum parvum?", "Küçük işaret nerede?", "observatio", "mercatura", "vicus_012_evening_family", "Mercator dikkatli bakışını aklında tuttu."],
  ["vicus_012_evening_family", "Aile Akşamı", "home_hut", ["mater", "pater", "avia"], "Akşam ateşi yanarken aile gün içinde kiminle konuştuğunu sorar. Cevapların küçük ama anlamlıdır.", "Günün izlerini aileyle paylaş.", "mater", "Narres, quaeso. Quid didicisti?", "Anlat lütfen. Ne öğrendin?", "urbanitas", "villa", "vicus_013_market_revisit", "Ailen hangi yollara yaklaştığını sezdi."],
  ["vicus_013_market_revisit", "Pazara Dönüş", "village_market", ["mercator_vicus"], "Ertesi sabah mercator seni tanır; bu kez fiyatı değil, sözü nasıl söylediğini dinler.", "Pazardaki ikinci karşılaşmayı yönet.", "mercator_vicus", "Dic clare: panis et aqua.", "Açık söyle: ekmek ve su.", "mercatura", "mercatura", "vicus_014_teacher_notice", "Mercator pazarlık yolunu bir kez daha açtı."],
  ["vicus_014_teacher_notice", "Magister'in Fark Etmesi", "teacher_corner", ["magister_ruralis"], "Magister önceki selamını hatırlıyor. Tabulayı sana uzatıp kısa bir cümle kurmanı ister.", "Öğrenmeye yatkınlığını göster.", "magister_ruralis", "Ego disco. Tu quoque?", "Ben öğreniyorum. Sen de mi?", "lingua", "ludus", "vicus_015_veteran_task", "Magister ludus kapısını zihninde araladı."],
  ["vicus_015_veteran_task", "Veteranus'un Küçük Görevi", "veteran_bench", ["veteranus"], "Veteranus yere üç çizgi çeker. Sözleri kısa, bakışı ölçülüdür.", "Emirleri sakinlikle takip et.", "veteranus", "Ambula, sta, audi.", "Yürü, dur, dinle.", "disciplina", "castra", "vicus_016_scribe_mark", "Veteranus castra yoluna dair seni not etti."],
  ["vicus_016_scribe_mark", "Scriba'nın İşareti", "scribe_table", ["scriba_vicus"], "Scriba bir isim listesinin kenarına küçük bir işaret koymuş; senden onu okumanı bekler.", "İşareti ve harfleri çöz.", "scriba_vicus", "Nomen tuum scribe.", "Adını yaz.", "scriptura", "scriptura", "vicus_017_shrine_choice", "Scriba scriptura yolunu sessizce işaretledi."],
  ["vicus_017_shrine_choice", "Tapınakta Sessiz Seçim", "shrine", ["ministra"], "Ministra küçük bir kaseyi taş basamağa koyar. Ritüelin gösteriş değil dikkat istediğini söyler.", "Saygılı sözü tamamla.", "ministra", "Vale et memento.", "Hoşça kal ve hatırla.", "pietas", "templum", "vicus_018_prologue_close", "Ministra gelenek yoluna yatkınlığını sezdi."],
  ["vicus_018_prologue_close", "Köyde Kapılar Aralanır", "old_oak", ["magister_ruralis", "mercator_vicus", "veteranus", "scriba_vicus", "ministra", "amicus"], "Günün sonunda köy aynı köydür ama insanlar seni başka gözle görür. Okul, askerlik, ticaret, yazı, tapınak ve tarla yolu artık yalnızca söz değildir.", "Prologue'u kapat ve yolların işaretlerini yanında taşı.", "magister_ruralis", "Viae multae sunt. Elige postea.", "Yollar çoktur. Sonra seçersin.", "memoria", "ludus", null, "Köy seni ilk kez gerçekten tanıdı."]
];

const latinAnswers = {
  urbanitas: ["Salve", "Salve.", "Salve mater"],
  lingua: ["Ego sum Marcus", "Ego sum Marcus.", "Marcus sum", "Nomen mihi Marcus est"],
  mercatura: ["Panis est bonus", "Panem video", "Aquam habeo"],
  labor: ["Aquam porto", "Porto aquam", "Aqua est hic"],
  disciplina: ["Audio", "Audio et sto", "Sto et audio"],
  scriptura: ["Nomen scribo", "Litteras lego", "Tabulam video"],
  pietas: ["Salve", "Bene dic", "Vale"],
  memoria: ["Memoria bona est", "Memento", "Familia est memoria"],
  observatio: ["Video viam", "Signum video", "Ecce signum"]
};

function effect(path, amount = 1, reasonTr = "Köydeki biri sende bu yola yakınlık sezdi.") {
  return { type: "ADD_LIFE_PATH_HINT", payload: { path, amount, reasonTr } };
}

function makeScene(row, index) {
  const [id, title, locationId, npcIds, description, objective, activeNpcId, npcLineLatin, npcLineTr, skill, pathHint, nextSceneId, reasonTr] = row;
  const latinId = `${id}_latin`;
  const inspectId = `${id}_inspect`;
  const listenId = `${id}_listen`;
  const skillIntent = `${id}_skill`;
  const goId = `${id}_continue`;
  const isLast = !nextSceneId;
  return {
    id,
    title,
    locationId,
    npcIds,
    description,
    objective,
    inputMode: "choice",
    choices: [{
      id: `${id}_schema_continue`,
      label: isLast ? "Günü kapat" : "Devam et",
      description: isLast ? "Prologue izlerini toparla." : "Şema uyumluluğu için aynı geçiş yolu.",
      conditions: [],
      effects: isLast ? [{ type: "SET_LIFE_PHASE", payload: { phase: "path_selection" } }, { type: "MARK_SCENE_COMPLETED", sceneId: id }] : [],
      nextSceneId: nextSceneId ?? undefined
    }],
    textChallenge: null,
    dialogueChallenge: null,
    hybridDialogue: null,
    conditions: [],
    effects: [],
    rewards: [],
    onEnterEvents: [{ type: "scene.entered", payload: { sceneId: id } }],
    learningFocus: { grammarIds: grammar, vocabularyIds: baseVocab, skillIds: [skill], difficulty: index < 6 ? "intro" : "practice" },
    reviewTags: ["greetings-basic", skill],
    interactionModel: {
      mode: "interaction-loop",
      openingNarrationTr: description,
      openingNarrationLatin: "In vico mane statis. Verba parva viam aperiunt.",
      activeNpcId,
      npcLineLatin,
      npcLineTr,
      intents: [
        {
          id: inspectId,
          labelTr: "Çevreyi dikkatle incele",
          descriptionTr: "Mekandaki nesnelere ve insanların tavrına bak.",
          verb: "inspect",
          requiresLatin: false,
          effects: [
            { type: "MARK_SCENE_INSPECTED", sceneId: id, inspectId, vocabularyIds: baseVocab.slice(0, 2), clueIds: [`${id}_clue`] },
            effect(pathHint, 1, reasonTr)
          ],
          resolution: { resultNarrationTr: "Küçük ayrıntılar gözünün önünde birleşir; köy sana biraz daha okunur gelir.", consequences: [{ id: `${id}_consq_inspect`, kind: "knowledge", titleTr: "Ayrıntı Fark Edildi", bodyTr: reasonTr, tone: "success" }] }
        },
        {
          id: latinId,
          labelTr: "Latince cevap ver",
          descriptionTr: "Kısa ama bağlama uygun bir cümle kur.",
          verb: skill === "mercatura" ? "bargain" : "speak",
          tone: skill === "auctoritas" ? "bold" : "polite",
          requiresLatin: true,
          speakerNpcId: activeNpcId,
          targetNpcId: activeNpcId,
          playerIntentTr: npcLineTr,
          targetMeaningTr: latinAnswers[skill]?.[0] ?? "Salve.",
          canonicalAnswers: latinAnswers[skill] ?? ["Salve"],
          acceptedVariants: ["Salve", "Vale"],
          grammarFocusIds: grammar,
          vocabularyFocusIds: baseVocab,
          skillFocusIds: [skill],
          effects: [effect(pathHint, 2, reasonTr), { type: "INCREMENT_NPC_INTERACTION_COUNT", npcId: activeNpcId }],
          successNextSceneId: nextSceneId ?? undefined,
          failureNextSceneId: nextSceneId ?? undefined,
          failureBehavior: "soft-fail",
          responseReactions: { correct: { npcLineLatin: "Bene dictum.", npcLineTr: "Güzel söyledin.", feedbackTr: reasonTr }, wrong: { npcLineLatin: "Leniter; iterum disces.", npcLineTr: "Sakin; yine öğreneceksin.", feedbackTr: "Söz tam oturmadı ama konuşma seni durdurmadı." } },
          failureBranches: [{ verdict: "wrong", npcReactionLatin: "Non perfecte, sed intellego.", npcReactionTr: "Kusursuz değil, ama anlıyorum.", narrationTr: "Yanlışlık hikayeyi kilitlemez; karşındaki sana daha basit bir yol açar.", nextSceneId: nextSceneId ?? undefined, retryAllowed: false }],
          resolution: { resultNarrationTr: "Latince sözün mekanda küçük bir yankı bırakır.", npcReactionLatin: "Bene.", npcReactionTr: "İyi.", consequences: [{ id: `${id}_consq_latin`, kind: "latin", titleTr: "Latince Kullanıldı", bodyTr: reasonTr, tone: "gold" }] }
        },
        {
          id: skillIntent,
          labelTr: "Becerine güvenerek yaklaş",
          descriptionTr: `${skill} becerin yeterliyse daha iyi bir izlenim bırakırsın.`,
          verb: "approach",
          requiresLatin: false,
          conditions: [{ type: "RPG_SKILL_MIN", payload: { skillId: skill, value: 2 } }],
          effects: [effect(pathHint, 2, reasonTr), { type: "ADD_NPC_MEMORY", npcId: activeNpcId, text: reasonTr, importance: 35, tags: [skill, pathHint] }],
          resolution: { resultNarrationTr: "Hazırlıklı davranışın fark edilir; bu küçük an ileride hatırlanabilir.", consequences: [{ id: `${id}_consq_skill`, kind: "memory", titleTr: "İyi İzlenim", bodyTr: reasonTr, tone: "success" }] }
        },
        {
          id: goId,
          labelTr: isLast ? "Günü zihninde toparla" : "Yola devam et",
          descriptionTr: isLast ? "Bu ilk köy günlerinin izlerini yanında taşı." : "Bu karşılaşmayı kapatıp bir sonraki yere geç.",
          verb: isLast ? "remember" : "leave",
          requiresLatin: false,
          effects: isLast ? [{ type: "SET_LIFE_PHASE", payload: { phase: "path_selection" } }, { type: "MARK_SCENE_COMPLETED", sceneId: id }] : [],
          nextSceneId: nextSceneId ?? undefined,
          resolution: { resultNarrationTr: isLast ? "Köy seni tanıdı; yollar henüz seçilmedi, sadece işaretlendi." : "Köy yolu bir sonraki karşılaşmaya açılır." }
        }
      ],
      defaultIntentId: inspectId,
      afterIntentResolution: { showConsequences: true, showNextActions: true, autoContinueOnSuccess: false }
    },
    revisitVariants: [{ id: `${id}_revisit`, conditions: [{ type: "SCENE_VISIT_COUNT_MIN", sceneId: id, count: 2 }], titleOverride: `${title} (Tekrar)`, descriptionOverride: `[Tekrar Ziyaret] ${description} İnsanların bakışı artık biraz daha tanıdık.` }],
    ambientTemplates: [
      { templateId: "inspect_object", customId: `${id}_ambient_inspect`, labelTrOverride: "Küçük ayrıntıları incele", effects: [{ type: "MARK_SCENE_INSPECTED", sceneId: id, inspectId: `${id}_ambient_inspect`, clueIds: [`${id}_ambient_clue`] }] },
      { templateId: index % 3 === 0 ? "read_sign" : "listen_crowd", customId: `${id}_ambient_listen`, labelTrOverride: index % 3 === 0 ? "Yazıyı oku" : "Sözleri dinle", effects: [index % 3 === 0 ? { type: "MARK_SCENE_READ", sceneId: id, readId: `${id}_ambient_listen`, vocabularyIds: baseVocab.slice(0, 1) } : { type: "MARK_SCENE_LISTENED", sceneId: id, listenId: `${id}_ambient_listen`, vocabularyIds: baseVocab.slice(0, 1) }] },
      { templateId: "remember_lesson", customId: `${id}_ambient_remember`, labelTrOverride: "Sözü aklında tut", effects: [{ type: "ADD_LIFE_PATH_HINT", payload: { path: pathHint, amount: 1, reasonTr: "Bu anı hatırlaman ileride yolunu etkileyebilir." } }] }
    ]
  };
}

const chapter = {
  id: "vicus_prologue",
  title: "Köyde İlk Günler",
  titleTr: "Köyde İlk Günler",
  titleLatin: "In Vico",
  description: "Roma dünyasına küçük bir köyde sıradan biri olarak başlıyorsun.",
  descriptionTr: "Roma dünyasına küçük bir köyde sıradan biri olarak başlıyorsun.",
  order: 0,
  startQuestId: "vicus_prologue_main",
  startSceneId: "vicus_001_home_morning",
  locationIds: ["home_hut", "village_path", "field_edge", "village_market", "shrine", "old_oak", "teacher_corner", "veteran_bench", "scribe_table"],
  npcIds: ["mater", "pater", "avia", "magister_ruralis", "mercator_vicus", "veteranus", "scriba_vicus", "ministra", "amicus"],
  grammarFocus: grammar,
  vocabularyFocus: baseVocab,
  estimatedSceneCount: 18,
  unlockConditions: [],
  mainQuests: ["vicus_prologue_main"],
  sideQuests: [],
  reviewQuests: [],
  quests: [{
    id: "vicus_prologue_main",
    title: "In Vico",
    description: "Köydeki ilk günler, karakterin ilerideki hayat yollarına sessiz işaretler bırakır.",
    startSceneId: "vicus_001_home_morning",
    scenes: scenes.map(makeScene),
    rewards: [],
    statusConditions: []
  }]
};

fs.writeFileSync(out, `${JSON.stringify(chapter, null, 2)}\n`, "utf8");
console.log(`Wrote ${out}`);
