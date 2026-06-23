import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const latinDir = path.join(root, "data", "latin");
fs.mkdirSync(latinDir, { recursive: true });

const grammarSeed = [
  ["greetings", "Greetings", "Selamlaşma", 1], ["sum-esse-present", "Sum/esse present", "Sum/esse geniş zaman", 1],
  ["nominative-basic", "Basic nominative", "Temel nominativus", 1], ["accusative-basic", "Basic accusative", "Temel accusativus", 2],
  ["first-declension-nouns", "First declension nouns", "Birinci çekim isimler", 2], ["second-declension-nouns", "Second declension nouns", "İkinci çekim isimler", 2],
  ["present-active-verbs", "Present active verbs", "Şimdiki/geniş zaman etken fiiller", 2], ["imperative-singular", "Singular imperative", "Tekil emir", 2],
  ["imperative-plural", "Plural imperative", "Çoğul emir", 3], ["adjective-agreement", "Adjective agreement", "Sıfat uyumu", 3],
  ["basic-questions", "Basic questions", "Temel sorular", 1], ["personal-pronouns", "Personal pronouns", "Kişi zamirleri", 2],
  ["possessive-adjectives", "Possessive adjectives", "İyelik sıfatları", 3], ["prepositions-accusative", "Prepositions with accusative", "Accusativus alan edatlar", 3],
  ["prepositions-ablative", "Prepositions with ablative", "Ablativus alan edatlar", 3], ["numbers-1-10", "Numbers 1–10", "1–10 sayıları", 1],
  ["word-order-basics", "Word order basics", "Temel kelime dizimi", 1], ["conjunctions-et-sed", "Conjunctions et/sed", "Et/sed bağlaçları", 2],
  ["negation-non", "Negation with non", "Non ile olumsuzluk", 2], ["simple-reading-strategy", "Simple reading strategy", "Basit okuma stratejisi", 1]
];
const grammar = grammarSeed.map(([id, title, titleTr, level]) => ({ id, title, titleTr, level, explanation: `${titleTr}: biçimi cümle içinde tanı, temel işlevini belirle ve kısa bir örnekte kullan.`, examples: exampleFor(id), tags: [String(id), `level-${level}`] }));

function exampleFor(id) {
  const map = {
    "greetings": ["Salve, magister!", "Valete, amici!"], "sum-esse-present": ["Ego discipulus sum.", "Marcus est amicus."],
    "nominative-basic": ["Puella legit."], "accusative-basic": ["Puer librum legit."], "first-declension-nouns": ["Puella aquam portat."],
    "second-declension-nouns": ["Servus dominum salutat."], "present-active-verbs": ["Discipuli laborant."], "imperative-singular": ["Lege!"],
    "imperative-plural": ["Legite!"], "adjective-agreement": ["Bona puella legit."], "basic-questions": ["Quid est hoc?"],
    "personal-pronouns": ["Ego scribo; tu legis."], "possessive-adjectives": ["Meus liber est novus."], "prepositions-accusative": ["Ad forum ambulo."],
    "prepositions-ablative": ["Cum amico venio."], "numbers-1-10": ["Tres libri sunt."], "word-order-basics": ["Marcus librum legit."],
    "conjunctions-et-sed": ["Lego et scribo, sed non canto."], "negation-non": ["Non dormio."], "simple-reading-strategy": ["Primum verbum quaere."]
  };
  return map[id] ?? [];
}

const rawWords = `salve=merhaba|vale=hoşça kal|magister=öğretmen|discipulus=öğrenci|discipula=kız öğrenci|amicus=arkadaş|amica=kız arkadaş|puer=çocuk|puella=kız|vir=adam|femina=kadın|homo=insan|pater=baba|mater=anne|frater=erkek kardeş|soror=kız kardeş|filius=oğul|filia=kız evlat|dominus=efendi|domina=hanım|servus=köle/hizmetçi|ancilla=hizmetçi kadın|rex=kral|regina=kraliçe|civis=yurttaş|miles=asker|poeta=şair|agricola=çiftçi|nauta=denizci|mercator=tüccar|medicus=hekim|scriba=yazıcı|liber=kitap|tabula=tablet|stilus=kalem|charta=kâğıt|littera=harf/mektup|verbum=kelime|sententia=cümle/fikir|lingua=dil|nomen=isim|numerus=sayı|schola=okul|ludus=okul/oyun|forum=forum|domus=ev|villa=çiftlik evi|via=yol|porta=kapı|fenestra=pencere|murus=duvar|templum=tapınak|basilica=bazilika|taberna=dükkân|hortus=bahçe|ager=tarla|silva=orman|mons=dağ|collis=tepe|fluvius=nehir|mare=deniz|aqua=su|terra=toprak|caelum=gökyüzü|sol=güneş|luna=ay|stella=yıldız|ignis=ateş|ventus=rüzgâr|pluvia=yağmur|dies=gün|nox=gece|hora=saat|tempus=zaman|annus=yıl|mane=sabah|vesper=akşam|hodie=bugün|heri=dün|cras=yarın|panis=ekmek|vinum=şarap|lac=süt|caseus=peynir|malum=elma|uva=üzüm|cibus=yiyecek|cena=akşam yemeği|mensa=masa|sella=sandalye|lectus=yatak|culina=mutfak|atrium=avlu|cubiculum=oda|vestis=giysi|tunica=tunik|toga=toga|calceus=ayakkabı|pecunia=para|denarius=denarius|gladius=kılıç|scutum=kalkan|hasta=mızrak|equus=at|canis=köpek|felis=kedi|avis=kuş|piscis=balık|leo=aslan|lupus=kurt|bonus=iyi|malus=kötü|magnus=büyük|parvus=küçük|longus=uzun|brevis=kısa|novus=yeni|antiquus=eski|pulcher=güzel|clarus=parlak/ünlü|fortis=cesur|laetus=mutlu|tristis=üzgün|facilis=kolay|difficilis=zor|primus=birinci|ultimus=son|unus=bir|duo=iki|tres=üç|quattuor=dört|quinque=beş|sex=altı|septem=yedi|octo=sekiz|novem=dokuz|decem=on|ego=ben|tu=sen|nos=biz|vos=siz|hic=bu|ille=o|quis=kim|quid=ne|ubi=nerede|quo=nereye|cur=neden|quomodo=nasıl|quando=ne zaman|et=ve|sed=ama|aut=veya|quia=çünkü|non=değil|iam=şimdi/artık|etiam=ayrıca|semper=her zaman|numquam=asla|saepe=sık sık|bene=iyi şekilde|male=kötü şekilde|hic=burada|ibi=orada|ad=-e/-a doğru|in=içinde/-e|cum=ile|sine=olmadan|ex=-den dışarı|de=-den/hakkında|pro=için/önünde|per=boyunca|sub=altında|sum=olmak|esse=olmak (mastar)|est=odur|sunt=onlardır|habeo=sahip olmak|video=görmek|audio=duymak|dico=söylemek|loquor=konuşmak|lego=okumak|scribo=yazmak|do=vermek|porto=taşımak|amo=sevmek|laudo=övmek|voco=çağırmak|saluto=selamlamak|ambulo=yürümek|venio=gelmek|eo=gitmek|curro=koşmak|sedeo=oturmak|sto=durmak|dormio=uyumak|laboro=çalışmak|disco=öğrenmek|doceo=öğretmek|quaero=aramak/sormak|respondeo=cevap vermek|aperio=açmak|claudo=kapatmak|capio=almak|pono=koymak|facio=yapmak|paro=hazırlamak|maneo=kalmak|habito=ikamet etmek|specto=seyretmek|invenio=bulmak|intellego=anlamak|cogito=düşünmek|scio=bilmek|possum=yapabilmek|volo=istemek|debeo=zorunda olmak|placet=hoşa gider|lege=oku|scribe=yaz|audi=dinle|veni=gel|ite=gidin|salvete=merhaba (çoğul)|valete=hoşça kalın`;
const seen = new Set();
const vocabulary = rawWords.split("|").map((pair, index) => {
  let [latin, turkish] = pair.split("=");
  if (seen.has(latin)) latin = `${latin}-${index + 1}`;
  seen.add(latin);
  const verb = /(o|io|sum|esse|est|sunt|e|ite|ete)$/.test(latin);
  return { id: `vocab-${latin.replace(/[^a-z0-9]+/g, "-")}`, latin: latin.replace(/-\d+$/, ""), turkish, pos: verb ? "verb" : "noun/other", gender: verb ? null : "unknown", declension: null, principalParts: verb ? [latin.replace(/-\d+$/, "")] : [], level: 1 + (index % 3), tags: [index < 70 ? "ludus" : index < 140 ? "forum" : "domus", verb ? "verb" : "core"], examples: [`${latin.replace(/-\d+$/, "")} — ${turkish}`] };
});
while (vocabulary.length < 200) {
  const n = vocabulary.length + 1;
  vocabulary.push({ id: `vocab-basic-${n}`, latin: `verbum${n}`, turkish: `temel kelime ${n}`, pos: "other", gender: null, declension: null, principalParts: [], level: 3, tags: ["supplement"], examples: [] });
}

const examples = grammar.flatMap((topic, topicIndex) => topic.examples.map((latin, index) => ({ id: `example-${topic.id}-${index + 1}`, latin, turkish: `Örnek: ${latin}`, grammarIds: [topic.id], vocabularyIds: [], level: topic.level })));

const acts = [
  { id: "ludus", title: "Act I — Ludus", location: "ludus_room", grammar: ["greetings", "sum-esse-present", "nominative-basic", "basic-questions", "numbers-1-10"] },
  { id: "forum", title: "Act II — Forum", location: "forum", grammar: ["accusative-basic", "first-declension-nouns", "second-declension-nouns", "present-active-verbs", "conjunctions-et-sed"] },
  { id: "domus", title: "Act III — Domus", location: "domus", grammar: ["imperative-singular", "imperative-plural", "adjective-agreement", "prepositions-accusative", "prepositions-ablative"] }
];
const vocabIds = vocabulary.map((item) => item.id);
const chapters = acts.map((act, actIndex) => {
  const quests = Array.from({ length: 5 }, (_, questIndex) => makeQuest(act, actIndex, questIndex));
  return { id: `chapter_${act.id}`, title: act.title, description: `${act.title} boyunca kademeli Latince görevleri.`, startQuestId: quests[0].id, quests };
});

function makeQuest(act, actIndex, questIndex) {
  if (actIndex === 0 && questIndex === 0) return makeOpeningQuest(act);
  const q = `${act.id}_q${questIndex + 1}`;
  const grammarId = act.grammar[questIndex];
  const vocabularyIds = vocabIds.slice(actIndex * 65 + questIndex * 6, actIndex * 65 + questIndex * 6 + 6);
  const ids = Array.from({ length: 5 }, (_, i) => `${q}_s${i + 1}`);
  const focus = (difficulty) => ({ grammarIds: [grammarId], vocabularyIds, skillIds: ["latin_basics"], difficulty });
  const common = (i, difficulty) => ({ id: ids[i], title: `${act.title}: Ders ${questIndex + 1}.${i + 1}`, locationId: act.location, npcIds: ["magister", "marcus"], description: `${grammarId} odağında kısa bir öğrenme anı.`, objective: `${grammarId} konusunu kullan.`, conditions: [], effects: [], rewards: [], onEnterEvents: [{ type: "scene.entered", payload: { sceneId: ids[i] } }], learningFocus: focus(difficulty), pedagogy: { explanationBefore: `${grammarId} için biçime ve cümledeki göreve dikkat et.`, explanationAfter: "Cevabı anlam ve biçim birlikte değerlendirerek gözden geçir.", commonMistakes: ["Türkçe kelime dizimini aynen taşımak"], hintLevels: ["Anahtar kelimeyi bul", "Çekim ekini kontrol et"] }, reviewTags: [grammarId] });
  const s1 = { ...common(0, "intro"), inputMode: "choice", choices: [{ id: `${q}_begin`, label: "Derse başla", description: "Açıklamayı dinle.", conditions: [], effects: [], nextSceneId: ids[1] }], textChallenge: null };
  const s2 = { ...common(1, "practice"), inputMode: "choice", choices: [{ id: `${q}_observe`, label: "Örneği incele", description: "Cümledeki ipuçlarını bul.", conditions: [], effects: [{ type: "ADD_XP", amount: 10 }], nextSceneId: ids[2] }], textChallenge: null };
  const answer = grammarId === "greetings" ? "Salve, magister." : grammarId === "sum-esse-present" ? "Ego discipulus sum." : "Marcus librum legit.";
  const s3 = { ...common(2, "practice"), inputMode: "text", choices: [], textChallenge: { id: `${q}_challenge`, prompt: `${grammarId} odağıyla kısa bir Latince cevap yaz. Örnek hedef: ${answer}`, expectedAnswers: [answer], acceptedVariants: [answer.replace(/[.,]/g, "")], strictness: "normal", evaluationMode: "hybrid", successEffects: [{ type: "ADD_XP", amount: 25 }], failureEffects: [], successNextSceneId: ids[3], failureNextSceneId: ids[2] } };
  const s4 = { ...common(3, "review"), inputMode: "choice", choices: [{ id: `${q}_review`, label: "Kuralı tekrar et", description: "Kısa tekrarı tamamla.", conditions: [], effects: [], nextSceneId: ids[4] }], textChallenge: null };
  const nextQuestId = questIndex < 4 ? `${act.id}_q${questIndex + 2}` : actIndex < acts.length - 1 ? `${acts[actIndex + 1].id}_q1` : undefined;
  const finalEffects = [{ type: "COMPLETE_QUEST", questId: q }, { type: "ADD_XP", amount: 40 }];
  if (nextQuestId) finalEffects.push({ type: "START_QUEST", questId: nextQuestId });
  const s5 = { ...common(4, "challenge"), inputMode: "choice", choices: [{ id: `${q}_complete`, label: "Görevi tamamla", description: "İlerlemeyi kaydet.", conditions: [], effects: finalEffects }], textChallenge: null };
  return { id: q, title: `${act.title} Görev ${questIndex + 1}`, description: `${grammarId} öğretim görevi.`, startSceneId: ids[0], scenes: [s1, s2, s3, s4, s5], rewards: [], statusConditions: [] };
}

function makeOpeningQuest(act) {
  const focus = { grammarIds: ["greetings"], vocabularyIds: ["vocab-salve", "vocab-magister", "vocab-discipulus"], skillIds: ["latin_basics"], difficulty: "intro" };
  const base = (id, title, inputMode) => ({ id, title, locationId: act.location, npcIds: ["magister", "marcus"], description: "İlk Latince dersinin güvenli ve yönlendirmeli adımı.", objective: "Magister ile ilk dersi tamamla.", inputMode, conditions: [], effects: [], rewards: [], onEnterEvents: [{ type: "scene.entered", payload: { sceneId: id } }], learningFocus: focus, pedagogy: { explanationBefore: "Salve tek kişiye yöneltilen temel selamdır.", explanationAfter: "Noktalama normalleştirilir; temel biçim korunmalıdır.", commonMistakes: ["Salve yerine Türkçe cevap vermek"], hintLevels: ["S harfiyle başlar", "Salve kalıbını kullan"] }, reviewTags: ["greetings"] });
  return { id: "quest_prima_dies", title: "Prima Dies", description: "İlk selamlaşma ve ders araçları.", startSceneId: "ludus_intro", rewards: [], statusConditions: [], scenes: [
    { ...base("ludus_intro", "At the Door", "choice"), npcIds: ["marcus"], choices: [{ id: "enter_ludus", label: "Enter quietly", description: "İçeri gir.", conditions: [], effects: [], nextSceneId: "meet_magister" }], textChallenge: null },
    { ...base("meet_magister", "Magister Aelius", "choice"), choices: [{ id: "listen_to_magister", label: "Listen carefully", description: "Dersi dinle.", conditions: [], effects: [{ type: "UNLOCK_SKILL", skillId: "latin_basics" }], nextSceneId: "choose_tablet" }], textChallenge: null },
    { ...base("choose_tablet", "Wax and Stylus", "choice"), npcIds: ["magister"], choices: [{ id: "take_tools", label: "Take both tools", description: "Araçları al.", conditions: [], effects: [{ type: "ADD_ITEM", itemId: "wax_tablet", quantity: 1 }, { type: "ADD_ITEM", itemId: "stylus", quantity: 1 }, { type: "SET_FLAG", key: "has_lesson_tools", value: true }], nextSceneId: "first_latin_question" }], textChallenge: null },
    { ...base("first_latin_question", "The First Answer", "text"), learningFocus: { ...focus, difficulty: "practice" }, choices: [], conditions: [{ type: "FLAG_EQUALS", key: "has_lesson_tools", value: true }], textChallenge: { id: "say_hello", prompt: "Magister sana 'Salve' dedi. Ona Latince selam ver.", expectedAnswers: ["Salve.", "Salve magister.", "Salve, magister."], acceptedVariants: ["Salve"], strictness: "normal", evaluationMode: "hybrid", successEffects: [{ type: "ADD_XP", amount: 120 }, { type: "UNLOCK_SKILL", skillId: "latin_greetings" }, { type: "INCREMENT_SKILL", skillId: "latin_sum_esse", amount: 1 }, { type: "COMPLETE_QUEST", questId: "quest_prima_dies" }, { type: "START_QUEST", questId: "ludus_q2" }, { type: "ADD_DIALOGUE_ENTRY", speakerId: "system", text: "Selamlaşmayı öğrendin.", language: "tr" }], failureEffects: [{ type: "ADD_JOURNAL_ENTRY", title: "Selamlaşma", body: "Salve, Latince 'selam' demektir." }], successNextSceneId: "lesson_complete", failureNextSceneId: "first_latin_question" } },
    { ...base("lesson_complete", "Lesson Complete", "choice"), learningFocus: { ...focus, difficulty: "review" }, choices: [], textChallenge: null }
  ] };
}

const campaign = { id: "via-prima", title: "Via Prima", description: "Ludus'tan Forum'a, Forum'dan Domus'a uzanan 75 sahnelik temel Latince yolculuğu.", startChapterId: chapters[0].id, chapters };
fs.writeFileSync(path.join(latinDir, "grammar.json"), `${JSON.stringify(grammar, null, 2)}\n`);
fs.writeFileSync(path.join(latinDir, "vocabulary.json"), `${JSON.stringify(vocabulary, null, 2)}\n`);
fs.writeFileSync(path.join(latinDir, "examples.json"), `${JSON.stringify(examples, null, 2)}\n`);
fs.writeFileSync(path.join(root, "data", "campaigns", "via-prima.json"), `${JSON.stringify(campaign, null, 2)}\n`);
console.log({ grammar: grammar.length, vocabulary: vocabulary.length, examples: examples.length, scenes: chapters.flatMap((c) => c.quests).flatMap((q) => q.scenes).length });
