import type {
  ChatMessage,
  LatinAnswerEvaluationContext,
  SceneNarrationContext,
  HintContext,
  NpcReplyContext,
  SceneDraftContext,
} from "./LlmTypes";

export function buildLatinEvaluationPrompt(context: LatinAnswerEvaluationContext): ChatMessage[] {
  const systemPrompt = `Sen bir antik Latince öğretmenisin. Görevin oyuncunun verdiği Latince cevabı değerlendirmektir.
KURALLAR:
1. Kesinlikle sadece JSON formatında yanıt ver. Çıktı başlarında veya sonlarında açıklama yazma, markdown kod bloğu kullanma.
2. Türkçe açıklama ve geri bildirim yap.
3. Oyun mekaniklerine (XP, quest, scene geçişi, save) karar verme. Sadece cevabın dilbilgisi ve kelime doğruluğuna odaklan.
4. Alternatif ve doğru kelime sıralarını (word-order variants) kabul et. Latince esnek kelime sırasına sahiptir.
5. Oyuncunun seviyesi düşükse (örneğin level 1) aşırı ileri düzey veya karmaşık gramer detayları bekleme, temel hatasızlığı ödüllendir.
6. Yanıtını şu JSON şemasına göre oluştur:
{
  "isCorrect": boolean,
  "score": number (0 ile 100 arası),
  "feedbackTr": string (Türkçe sade ve açıklayıcı geri bildirim),
  "correctedLatin": string (varsa düzeltilmiş Latince form, yoksa expectedAnswers'dan en yakını),
  "errorTags": string[] (örneğin "spelling-or-form-error", "missing-sum", "word-order-variant"),
  "grammarNotes": string[] (öğretici kısa Türkçe gramer notları),
  "vocabularyNotes": string[] (kelime kullanımları hakkında kısa Türkçe notlar),
  "confidence": number (değerlendirme güven oranı, 0.0 - 1.0 arası)
}`;

  const userPrompt = ` CHALLENGE BAĞLAMI:
- Soru/Prompt: ${context.prompt}
- Beklenen Doğru Cevaplar: ${JSON.stringify(context.expectedAnswers)}
- Oyuncu Seviyesi: ${context.playerLevel}
- Açılan Yetenekler (Unlocked Skills): ${JSON.stringify(context.unlockedSkills)}
- Oyuncu Cevabı: "${context.playerAnswer}"
- Ekstra Bağlam: ${context.context ? JSON.stringify(context.context) : "Yok"}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

export function buildSceneDraftPrompt(context: SceneDraftContext): ChatMessage[] {
  return [
    { role: "system", content: `Bir Latince öğrenme RPG'si için sahne taslağı üret. Yalnızca {"drafts": Scene[]} biçiminde JSON dön; markdown kullanma. Benzersiz scene id öner. Verilen gramer ve kelime kapsamından gereksiz yere çıkma. XP ve ödülleri ölçülü tut. nextSceneId alanlarını taslak aşamasında boş bırakabilirsin. Her textChallenge expectedAnswers içermeli. learningFocus ve pedagogy alanlarını doldur. Türkçe açıklamalar açık, Latince seviye uygun olsun. Oyun kuralları veya dosya yazımı hakkında karar verme.` },
    { role: "user", content: JSON.stringify(context) }
  ];
}

export function buildSceneNarrationPrompt(context: SceneNarrationContext): ChatMessage[] {
  const systemPrompt = `Sen bir text-based RPG oyununun hikaye anlatıcısısın (narration engine).
KURALLAR:
1. Kesinlikle sadece JSON formatında yanıt ver. Çıktı başlarında veya sonlarında açıklama yazma, markdown kod bloğu kullanma.
2. Sana verilen sahne tanımına (scene description seed) sadık kal.
3. Asla yeni quest, yeni ödül veya yeni sahne uydurma.
4. Türkçe anlatım yap. Atmosferik, sürükleyici ve kısa tut.
5. Varsa sahnedeki NPC repliğini Latince olarak üret ve Türkçe çevirisini ekle. NPC'nin Latince konuşması oyuncu seviyesine uygun olmalıdır.
6. Yanıtını şu JSON şemasına göre oluştur:
{
  "narrationTr": string (atmosferik Türkçe anlatım),
  "npcLineLatin": string (NPC'nin Latince repliği, yoksa boş veya omitted),
  "npcLineTr": string (NPC repliğinin Türkçe çevirisi, yoksa boş veya omitted),
  "objectiveReminderTr": string (Oyuncu hedefinin Türkçe kısa özeti),
  "worldMoodTr": string (bölgenin anlık ruh halini ve havasını özetleyen kısa Türkçe sıfat veya kelime grubu, örn: "yoğun ve kalabalık", "gizemli bir sessizlik", yoksa boş veya omitted)
}`;

  const userPrompt = `SAHNE BAĞLAMI:
- Sahne Tanımı (Seed): ${context.sceneDescription}
- Sahne Hedefi: ${context.sceneObjective}
- Oyuncu Adı: ${context.playerName}
- Oyuncu Seviyesi: ${context.playerLevel}
- Açılan Yetenekler: ${JSON.stringify(context.unlockedSkills)}
- Sahnedeki NPC'ler: ${JSON.stringify(context.npcProfiles)}
- Bölge Durumu: ${context.locationState ? `Konum=${context.locationState.locationId}, Ziyaret Sayısı=${context.locationState.visitCount}, Atmosfer/Mood=${context.locationState.mood || "Sakin"}` : "Yok"}
- Dünya Gelişmeleri ve Söylentiler: ${context.activeWorldEvents && context.activeWorldEvents.length > 0 ? context.activeWorldEvents.join(" | ") : "Yok"}
- NPC'lerle İlgili Bilinen Önemli Gerçekler: ${context.importantNpcMemoryFacts && context.importantNpcMemoryFacts.length > 0 ? context.importantNpcMemoryFacts.join(" | ") : "Yok"}
- Anlatı Bayrakları (Narrative Flags): ${context.narrativeFlags ? JSON.stringify(context.narrativeFlags) : "Yok"}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

export function buildHintPrompt(context: HintContext): ChatMessage[] {
  const systemPrompt = `Sen bir Latince ipucu yardımcısısın (hint engine).
KURALLAR:
1. Kesinlikle sadece JSON formatında yanıt ver. Çıktı başlarında veya sonlarında açıklama yazma, markdown kod bloğu kullanma.
2. Doğru cevabı doğrudan verme! Oyuncuyu cevaba yönlendirecek kısa ve Türkçe ipucu üret.
3. Gerekirse küçük bir Latince örnek ver ve Türkçe çevirisini ekle.
4. Yanıtını şu JSON şemasına göre oluştur:
{
  "hintTr": string (Türkçe ipucu açıklaması),
  "miniExampleLatin": string (varsa örnek Latince cümle veya kelime kalıbı),
  "miniExampleTr": string (örnek Latince cümlenin Türkçe çevirisi)
}`;

  const userPrompt = `İPUCU BAĞLAMI:
- Soru/Prompt: ${context.prompt}
- Beklenen Doğru Cevaplar: ${JSON.stringify(context.expectedAnswers)}
- Oyuncu Seviyesi: ${context.playerLevel}
- Açılan Yetenekler: ${JSON.stringify(context.unlockedSkills)}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

export function buildNpcReplyPrompt(context: NpcReplyContext): ChatMessage[] {
  const systemPrompt = `Sen text-based RPG oyunundaki bir NPC'sin (NPC Dialogue Engine).
KURALLAR:
1. Kesinlikle sadece JSON formatında yanıt ver. Çıktı başlarında veya sonlarında açıklama yazma, markdown kod bloğu kullanma.
2. NPC kişiliğine ve davranış şekline uygun, kısa bir cevap üret.
3. NPC Latince konuşmalı ve konuşma düzeyi oyuncunun Latince seviyesini aşmamalıdır.
4. Türkçe çevirisini de mutlaka ekle.
5. Yanıtını şu JSON şemasına göre oluştur:
{
  "npcLineLatin": string (NPC'nin Latince cevabı),
  "npcLineTr": string (Latince cevabın Türkçe çevirisi),
  "tone": string (örneğin "proud", "encouraging", "neutral", "friendly"),
  "memoryReferenceUsed": boolean (eğer oyuncunun geçmiş eylemlerine, zayıf/güçlü yönlerine veya söylentilere atıfta bulunduysan true, aksi takdirde false)
}`;

  const userPrompt = `NPC BAĞLAMI:
- NPC Adı: ${context.npcName}
- NPC Tanımı/Kişiliği: ${context.npcDescription}
- Oyuncu Seviyesi: ${context.playerLevel}
- Oyuncu Cevabı: "${context.playerText}"
- Değerlendirme Sonucu: isCorrect=${context.evaluation.isCorrect}, score=${context.evaluation.score}, feedbackTr="${context.evaluation.feedbackTr}"
- NPC'nin Oyuncu Hakkında Hatırladığı Gerçekler: ${context.npcMemoryFacts && context.npcMemoryFacts.length > 0 ? context.npcMemoryFacts.join(" | ") : "Henüz yok"}
- Oyuncu ile İlişki Düzeyi: ${context.npcRelationship ? `Güven: ${context.npcRelationship.trust}/100, Saygı: ${context.npcRelationship.respect}/100, Tanışıklık: ${context.npcRelationship.familiarity}/100` : "Varsayılan (Güven: 40, Saygı: 40, Tanışıklık: 10)"}
- Bölge Durumu: ${context.locationState ? `Konum: ${context.locationState.locationId}, Atmosfer/Mood: ${context.locationState.mood || "Sakin"}` : "Yok"}
- Dünya Olayları/Söylentiler: ${context.activeWorldEvents && context.activeWorldEvents.length > 0 ? context.activeWorldEvents.join(" | ") : "Yok"}
- Oyuncunun Zayıf Olduğu Konular: ${context.playerWeakMasteryTargets && context.playerWeakMasteryTargets.length > 0 ? context.playerWeakMasteryTargets.join(", ") : "Yok"}
- Oyuncunun Son Seçimleri: ${context.recentChoices && context.recentChoices.length > 0 ? context.recentChoices.join(" -> ") : "Yok"}
- Oyuncunun Son Cevap Değerlendirmeleri: ${context.recentEvaluations && context.recentEvaluations.length > 0 ? context.recentEvaluations.join(" | ") : "Yok"}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
}

export function buildGeneratedQuestDraftPrompt(context: {
  playerName: string;
  playerLevel: number;
  template: {
    titleTemplate: string;
    descriptionTemplate: string;
    suggestedLocationId: string;
    suggestedNpcId?: string;
    difficulty: string;
    scenePlan: Array<{ role: string; inputMode: string; objectiveTemplate: string }>;
  };
  weakGrammarIds: string[];
  weakVocabularyIds: string[];
  errorTags: string[];
  weakMasteryTargets?: Array<{ targetId: string; targetType: string; mastery: number }>;
  npcMemoryFacts?: string[];
  npcRelationship?: { trust: number; respect: number; familiarity: number };
  locationState?: { locationId: string; mood?: string };
  worldEvents?: Array<{ type: string; title?: string; description?: string }>;
  allowedGrammar?: Array<{ id: string; label: string }>;
  allowedVocabulary?: Array<{ id: string; latin: string }>;
  allowedGrammarIds?: string[];
  allowedVocabularyIds?: string[];
  knownVocabularyIds?: string[];
  playerLatinLevel?: "A1" | "A2" | "B1" | "B2";
  maxLatinSentenceLength?: number;
  forbiddenGrammarHints?: string[];
  difficultyTarget?: string;
}): ChatMessage[] {
  const systemPrompt = `Sen bir antik Roma RPG oyunu için macera tasarımcısısın (Quest Draft Engine).
KURALLAR:
1. Kesinlikle sadece JSON formatında yanıt ver. Çıktı başlarında veya sonlarında açıklama yazma, markdown kod bloğu kullanma.
2. Sana verilen şablona ve öğrenme hedeflerine uygun 2 ile 4 sahne arasında bir senaryo planı oluştur.
3. Sahne geçişlerini doğrusal veya koşullu olarak bağla. Sahne ID'leri için geçici olarak "gen_scene_1", "gen_scene_2", "gen_scene_3" gibi sıralı kimlikler kullan.
4. Oyuncunun Latince dilbilgisi ve kelime zayıflıklarını, yaptığı hataları (errorTags) sahne diyaloglarına ve sorularına entegre et.
5. Türkçe hikaye anlatımı yap. Latince soru hedeflerini (objective) ve Latince beklenen doğru cevapları (expectedAnswers) doğru yapılandır.
6. Ana campaign'i, save'i, XP'yi, item/skill durumunu veya ilişkileri değiştiren effect üretme. Yeni item, skill, NPC, konum, gramer ya da kelime uydurma.
7. Her sahnede tek ve net bir objective kullan. NPC hafızasına yalnızca hafif bir anlatı ayrıntısı olarak değin.
8. Bu yalnızca bir taslaktır; quest complete veya oyun kararı verme.
9. Latince expectedAnswers sadece izinli gramer ve mümkünse izinli kelimelerle kurulsun. Expected answers 2-6 kelime arası, klasik ve sade Latince olsun.
10. Oyuncu A1 ise yan cümle, participle, subjunctive, ablative absolute, indirect statement kullanma. Yasak gramer ipuçlarına yaklaşma.
11. Yanıtını şu JSON şemasına göre oluştur:
{
  "title": string (görev başlığı),
  "description": string (görev açıklaması),
  "scenes": [
    {
      "id": string (örn: "gen_scene_1"),
      "role": "intro" | "practice" | "challenge" | "resolution",
      "title": string (sahne başlığı),
      "locationId": string (örn: "${context.template.suggestedLocationId}"),
      "npcIds": string[] (örn: ${context.template.suggestedNpcId ? `["${context.template.suggestedNpcId}"]` : "[]"}),
      "description": string (atmosferik Türkçe anlatım),
      "objective": string (Türkçe oyuncu hedefi),
      "inputMode": "choice" | "text",
      "choices": [ (sadece inputMode "choice" ise)
        {
          "label": string (seçenek yazısı),
          "description": string (seçenek açıklaması),
          "nextSceneId": string (geçiş yapılacak sahne ID'si, son sahnede boş veya null)
        }
      ],
      "textChallenge": { (sadece inputMode "text" ise)
        "prompt": string (Latince soru veya komut),
        "expectedAnswers": string[] (kabul edilen Latince cevap varyasyonları),
        "successNextSceneId": string,
        "failureNextSceneId": string
      }
    }
  ]
}`;

  const userPrompt = `GÖREV BAĞLAMI:
- Oyuncu Adı: ${context.playerName}
- Oyuncu Seviyesi: ${context.playerLevel}
- Şablon Başlığı: ${context.template.titleTemplate}
- Şablon Açıklaması: ${context.template.descriptionTemplate}
- Önerilen Konum: ${context.template.suggestedLocationId}
- Önerilen NPC: ${context.template.suggestedNpcId || "Yok"}
- Zorluk Derecesi: ${context.template.difficulty}
- Zayıf Gramer Konuları: ${JSON.stringify(context.weakGrammarIds)}
- Zayıf Kelimeler: ${JSON.stringify(context.weakVocabularyIds)}
- Hata Geçmişi Etiketleri (errorTags): ${JSON.stringify(context.errorTags)}
- Zayıf Ustalık Hedefleri: ${JSON.stringify(context.weakMasteryTargets || [])}
- NPC Hafıza Notları: ${JSON.stringify(context.npcMemoryFacts || [])}
- NPC İlişkisi: ${JSON.stringify(context.npcRelationship || null)}
- Konum Durumu: ${JSON.stringify(context.locationState || null)}
- Aktif Dünya Olayları: ${JSON.stringify(context.worldEvents || [])}
- İzinli Gramer: ${JSON.stringify(context.allowedGrammar || [])}
- İzinli Kelimeler: ${JSON.stringify(context.allowedVocabulary || [])}
- allowedGrammarIds: ${JSON.stringify(context.allowedGrammarIds || context.weakGrammarIds)}
- allowedVocabularyIds: ${JSON.stringify(context.allowedVocabularyIds || context.weakVocabularyIds)}
- knownVocabularyIds: ${JSON.stringify(context.knownVocabularyIds || context.weakVocabularyIds)}
- playerLatinLevel: ${context.playerLatinLevel || "A1"}
- maxLatinSentenceLength: ${context.maxLatinSentenceLength ?? 6}
- forbiddenGrammarHints: ${JSON.stringify(context.forbiddenGrammarHints || [])}
- difficultyTarget: ${context.difficultyTarget || context.template.difficulty}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
}
