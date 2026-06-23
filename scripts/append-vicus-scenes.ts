import fs from "node:fs";
import path from "node:path";

const vicusPath = path.resolve(process.cwd(), "data/campaigns/via-prima/chapters/vicus.json");
const data = JSON.parse(fs.readFileSync(vicusPath, "utf8"));

const newScenes = [
  {
    "id": "vicus_activity_help_mater",
    "title": "Mater'e Yardım",
    "locationId": "home_hut",
    "npcIds": ["mater"],
    "description": "Annenle birlikte taze ekmekleri sepetlere doldurup pazar yoluna koyuldunuz. Yolda sana köyün eski günlerinden bahsediyor.",
    "objective": "Sepeti pazar yerine ulaştır.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_help_mater_complete",
        "label": "Ekmek sepetini teslim et ve eve dön",
        "description": "Mater'in teşekkürlerini alıp eve dön.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "help_mater_bread",
              "npcIds": ["mater"],
              "lifePathChanges": {
                "villa": 2,
                "mercatura": 1
              },
              "summaryTr": "Mater ile birlikte pazar meydanına ekmek taşıdın."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Ekmek taşıma işini tamamladın, zaman ilerledi."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_001_home_morning"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_inspect_signs",
    "title": "Tabelaları İnceleme",
    "locationId": "village_path",
    "npcIds": ["amicus"],
    "description": "Köy girişindeki eski taş tabelaları dikkatle okuyorsun. Arkadaşın amicus yanına gelip yazıları anlamana yardım ediyor.",
    "objective": "Harfleri hecele ve anlamlandır.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_inspect_signs_complete",
        "label": "Tabelayı okumayı bitir",
        "description": "Yeni kelimeleri aklında tutarak yola dön.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "inspect_village_signs",
              "npcIds": ["amicus"],
              "lifePathChanges": {
                "ludus": 1,
                "scriptura": 1
              },
              "summaryTr": "Köy girişindeki yazılı tabelaları inceledin."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "observatio",
              "amount": 10,
              "reasonTr": "Tabeladaki ince harf detaylarını fark ettin."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Yazıları incelemek epey vaktini aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_002_village_path"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_carry_water",
    "title": "Kuyudan Su Çekme",
    "locationId": "home_hut",
    "npcIds": ["pater"],
    "description": "Köy kuyusundan ağır kovalarla su çekiyorsun. Pater düzenli adımlarla taşımayı öğütlüyor.",
    "objective": "Kovaları eve taşı.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_carry_water_complete",
        "label": "Kovaları eve yerleştir",
        "description": "Pater'in onayını alıp dinlen.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "carry_water",
              "npcIds": ["pater"],
              "lifePathChanges": {
                "villa": 1,
                "castra": 1
              },
              "summaryTr": "Kuyudan su çekip evdeki kapları doldurdun."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "labor",
              "amount": 12,
              "reasonTr": "Fiziksel dayanıklılığın arttı."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Su taşırken vakit hızla geçti."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_001_home_morning"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_listen_veteran",
    "title": "Askerlik Anıları",
    "locationId": "veteran_bench",
    "npcIds": ["veteranus"],
    "description": "Veteranus bankında oturmuş, bastonuyla yere lejyon düzenini çiziyor. 'Castra'da her şey kurallara göredir' diyor.",
    "objective": "Emir türlerini dinle.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_listen_veteran_complete",
        "label": "Veteranus'a teşekkür edip ayrıl",
        "description": "Askeri terimleri zihnine kazı.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "listen_to_veteran",
              "npcIds": ["veteranus"],
              "lifePathChanges": {
                "castra": 2,
                "auctoritas": 1
              },
              "summaryTr": "Veteranus'tan lejyon anılarını dinledin."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Askerlik anıları vaktini aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_006_veteran_bench"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_help_mercator",
    "title": "Pazar Hazırlığı",
    "locationId": "village_market",
    "npcIds": ["mercator_vicus"],
    "description": "Tüccar mercator tezgaha dizilecek zeytin ve incirleri ayıklıyor. Latince sayıları saymanı istiyor.",
    "objective": "Malları say ve yerleştir.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_help_mercator_complete",
        "label": "İşi tamamla ve yardım et",
        "description": "Mercator'un pazar tüyolarını al.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "help_mercator_market",
              "npcIds": ["mercator_vicus"],
              "lifePathChanges": {
                "mercatura": 2
              },
              "summaryTr": "Pazarda mercator'a tezgâh işlerinde yardım ettin."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "mercatura",
              "amount": 15,
              "reasonTr": "Hesaplama becerin gelişti."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Pazar işleri vakit alır."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_003_market_help"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_observe_scribe",
    "title": "Harfler ve Parşömenler",
    "locationId": "scribe_table",
    "npcIds": ["scriba_vicus"],
    "description": "Scriba, köyün vergi ve tahıl kayıtlarını parşömene geçiriyor. Sana mürekkep yapımını gösteriyor.",
    "objective": "Yazıyı gözlemle.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_observe_scribe_complete",
        "label": "Yazıcıya saygılarını sunup ayrıl",
        "description": "Resmi kayıtların önemini kavra.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "observe_scribe_table",
              "npcIds": ["scriba_vicus"],
              "lifePathChanges": {
                "scriptura": 2,
                "ludus": 1
              },
              "summaryTr": "Scriba'nın yazı yazmasını gözlemledin."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Yazı işlerini izlemek vakit aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_007_scribe_table"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_greet_shrine",
    "title": "Sunak Selamı",
    "locationId": "shrine",
    "npcIds": ["ministra"],
    "description": "Sunağın önünde ministra küçük bir ritüel gerçekleştiriyor. Sana Lares ruhlarına saygılı olmayı öğretiyor.",
    "objective": "Tapınak ritüelini izle.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_greet_shrine_complete",
        "label": "Tapınaktan ayrıl",
        "description": "Gönül huzuruyla yola koyul.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "greet_at_shrine",
              "npcIds": ["ministra"],
              "lifePathChanges": {
                "templum": 2
              },
              "summaryTr": "Tapınakta ministra ile selamlaştın."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "pietas",
              "amount": 10,
              "reasonTr": "Ruhani görevlere saygı gösterdin."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Sunakta dua etmek vakit aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_008_shrine"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_practice_magister",
    "title": "Harf Egzersizleri",
    "locationId": "teacher_corner",
    "npcIds": ["magister_ruralis"],
    "description": "Magister ruralis, elindeki ahşap tablete harfleri kazıyor. Seni de kelimeleri seslendirmeye çağırıyor.",
    "objective": "Basit Latince kelimeleri oku.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_practice_magister_complete",
        "label": "Magister'a teşekkür et",
        "description": "Telaffuz pratiği yapıp ayrıl.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "practice_with_magister",
              "npcIds": ["magister_ruralis"],
              "lifePathChanges": {
                "ludus": 2,
                "scriptura": 1
              },
              "summaryTr": "Magister ile basit harf pratiği yaptın."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "lingua",
              "amount": 15,
              "reasonTr": "Latince telaffuzun gelişti."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Harf çalışması vakit aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_005_teacher_corner"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_follow_friend",
    "title": "Tarla Arkadaşlığı",
    "locationId": "field_edge",
    "npcIds": ["amicus"],
    "description": "Amicus tarlada çalışırken yanına gidip ona yardım ediyorsun. Köyün dedikodularından bahsediyor.",
    "objective": "Arkadaşınla tarlada çalış.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_follow_friend_complete",
        "label": "Tarladan ayrıl",
        "description": "Günün yorgunluğuyla eve dön.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "follow_friend_to_fields",
              "npcIds": ["amicus"],
              "lifePathChanges": {
                "villa": 2
              },
              "summaryTr": "Amicus ile tarlada çalışıp sohbet ettin."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Tarla işleri vakit aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_004_field_edge"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_family_talk",
    "title": "Akşam Sohbeti",
    "locationId": "home_hut",
    "npcIds": ["mater", "pater", "avia"],
    "description": "Ev halkı ocak başında toplandı. Avia tenceredeki çorbayı karıştırırken pater günün işlerini soruyor.",
    "objective": "Aileyle sohbet et.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_family_talk_complete",
        "label": "Ocak başından kalk",
        "description": "Günü tamamlamak için dinlen.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "evening_family_talk",
              "npcIds": ["mater", "pater", "avia"],
              "lifePathChanges": {
                "villa": 2
              },
              "summaryTr": "Aileyle ocak başında akşam sohbeti yaptın."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Akşam vakti geceye yaklaştı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_001_home_morning"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_ask_ludus",
    "title": "Roma'da Eğitim",
    "locationId": "teacher_corner",
    "npcIds": ["magister_ruralis"],
    "description": "Magister'a büyük şehirdeki 'ludus' okullarında eğitimin nasıl olduğunu soruyorsun. Sana Roma'daki okulların disiplinli olduğunu söylüyor.",
    "objective": "Eğitim yolları hakkında bilgi al.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_ask_ludus_complete",
        "label": "Roma okullarını aklında tut",
        "description": "Okul yoluna dair ilk ipucunu al.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "ask_about_ludus",
              "npcIds": ["magister_ruralis"],
              "lifePathChanges": {
                "ludus": 3
              },
              "summaryTr": "Magister ile Roma okulları hakkında konuştun."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Eğitim konuşması zaman aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_005_teacher_corner"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_ask_castra",
    "title": "Castra Hayatı",
    "locationId": "veteran_bench",
    "npcIds": ["veteranus"],
    "description": "Veteranus'a lejyon kamplarındaki disiplin ve düzeni soruyorsun. Sana 'Castra'da her şey kurallara göre akar' diyor.",
    "objective": "Ordu kampları hakkında bilgi al.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_ask_castra_complete",
        "label": "Askerlik yolunu aklında tut",
        "description": "Castra yoluna dair ilk ipucunu al.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "ask_about_castra",
              "npcIds": ["veteranus"],
              "lifePathChanges": {
                "castra": 3
              },
              "summaryTr": "Veteranus ile Castra hayatı hakkında konuştun."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Konuşma vakit aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_006_veteran_bench"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_ask_trade",
    "title": "Roma Pazarı",
    "locationId": "village_market",
    "npcIds": ["mercator_vicus"],
    "description": "Mercator'a Roma pazarındaki büyük ticareti soruyorsun. Sana 'Mercatura, Roma'nın kalbidir' diyor.",
    "objective": "Ticaret yolları hakkında bilgi al.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_ask_trade_complete",
        "label": "Ticaret yollarını aklında tut",
        "description": "Ticaret yoluna dair ilk ipucunu al.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "ask_about_trade",
              "npcIds": ["mercator_vicus"],
              "lifePathChanges": {
                "mercatura": 3
              },
              "summaryTr": "Mercator ile Roma ticareti hakkında konuştun."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Konuşma vakit aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_003_market_help"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_collect_herbs",
    "title": "Ot Toplama",
    "locationId": "field_edge",
    "npcIds": ["avia"],
    "description": "Büyükannen Avia'nın ilaçları için tarla kenarından şifalı otlar topluyorsun. Otların yerlerini inceliyorsun.",
    "objective": "Şifalı otları bul.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_collect_herbs_complete",
        "label": "Otları topla ve eve dön",
        "description": "Otları Avia'ya teslim et.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "collect_herbs",
              "npcIds": ["avia"],
              "lifePathChanges": {
                "villa": 1
              },
              "summaryTr": "Avia için tarladan şifalı otlar topladın."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "observatio",
              "amount": 10,
              "reasonTr": "Otların şekillerini inceledin."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Ot toplamak zaman aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_004_field_edge"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_scribe_wax",
    "title": "Balmumu Harfleri",
    "locationId": "scribe_table",
    "npcIds": ["scriba_vicus"],
    "description": "Scriba'nın yanında stilus ile balmumu tablete harfler kazıyorsun. Harflerin çizgisini takip etmelisin.",
    "objective": "Harfleri düzgün kazı.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_scribe_wax_complete",
        "label": "Yazıyı scriba'ya göster",
        "description": "Yazma pratiğini tamamla.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "scribe_wax",
              "npcIds": ["scriba_vicus"],
              "lifePathChanges": {
                "scriptura": 2
              },
              "summaryTr": "Scriba gözetiminde balmumu tablete yazı çalıştın."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "scriptura",
              "amount": 15,
              "reasonTr": "Stilus tutuşun gelişti."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Yazı çalışması vakit aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_007_scribe_table"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_shrine_offering",
    "title": "Sunak Adağı",
    "locationId": "shrine",
    "npcIds": ["ministra"],
    "description": "Lares sunağına buğday taneleri bırakıyorsun. Ministra ruhların bereket sunacağını söylüyor.",
    "objective": "Adağı sun.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_shrine_offering_complete",
        "label": "Sunağı selamlayıp ayrıl",
        "description": "Dua et ve tapınaktan çık.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "shrine_offering",
              "npcIds": ["ministra"],
              "lifePathChanges": {
                "templum": 3
              },
              "summaryTr": "Tapınak sunağına buğday adağı bıraktın."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Sunakta adak töreni zaman aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_008_shrine"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_veteran_story",
    "title": "Kartaca Savaşları",
    "locationId": "veteran_bench",
    "npcIds": ["veteranus"],
    "description": "Veteranus sana Hannibal'a karşı verilen büyük savaşları ve Scipio'nun zaferini anlatıyor.",
    "objective": "Tarihi anlatıyı dinle.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_veteran_story_complete",
        "label": "Tarihi dersi al",
        "description": "Lejyon şerefini aklında tut.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "veteran_story",
              "npcIds": ["veteranus"],
              "lifePathChanges": {
                "castra": 2
              },
              "summaryTr": "Veteranus'tan Kartaca Savaşları anlatısını dinledin."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Büyük tarih anlatısı zaman aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_006_veteran_bench"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_market_bargain",
    "title": "Pazarlık Pratiği",
    "locationId": "village_market",
    "npcIds": ["mercator_vicus"],
    "description": "Mercator zeytinyağı testisini satmaya çalışıyor. Fiyatı uygun kelimelerle düşürmelisin.",
    "objective": "Pazarlık et.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_market_bargain_complete",
        "label": "Pazarlığı bitir",
        "description": "Alışverişi tamamla.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "market_bargain",
              "npcIds": ["mercator_vicus"],
              "lifePathChanges": {
                "mercatura": 2
              },
              "summaryTr": "Mercator ile zeytinyağı için pazarlık pratikleri yaptın."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "urbanitas",
              "amount": 10,
              "reasonTr": "Sosyal ilişkilerde kelime seçimin iyileşti."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Pazarlık yapmak vakit aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_003_market_help"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_field_labor",
    "title": "Toprak Laboru",
    "locationId": "field_edge",
    "npcIds": ["pater"],
    "description": "Pater ile birlikte toprağı çapalıyor ve yabani otları temizliyorsunuz. Güneş altında ter döküyorsun.",
    "objective": "Tarlada çalış.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_field_labor_complete",
        "label": "İşi tamamla ve dinlen",
        "description": "Aletleri temizleyip tarladan ayrıl.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "field_labor",
              "npcIds": ["pater"],
              "lifePathChanges": {
                "villa": 2
              },
              "summaryTr": "Pater ile birlikte tarlada çapa yaptın."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "labor",
              "amount": 15,
              "reasonTr": "Toprak işçiliğinde tecrübe kazandın."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Tarla çapalama işi zaman aldı."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_004_field_edge"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  },
  {
    "id": "vicus_activity_morning_prayer",
    "title": "Sabah Duası",
    "locationId": "shrine",
    "npcIds": ["ministra"],
    "description": "Sabahın erken vaktinde sunağa gidip günün bereketi için tanrılara şükran sunuyorsun.",
    "objective": "Sabah duasını et.",
    "inputMode": "choice",
    "choices": [
      {
        "id": "vicus_activity_morning_prayer_complete",
        "label": "Duayı bitirip ayrıl",
        "description": "Sunaktan huzurla çık.",
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "morning_prayer",
              "npcIds": ["ministra"],
              "lifePathChanges": {
                "templum": 2
              },
              "summaryTr": "Sunağın önünde ministra ile sabah duasını gerçekleştirdin."
            }
          },
          {
            "type": "ADD_RPG_SKILL_PROGRESS",
            "payload": {
              "skillId": "pietas",
              "amount": 10,
              "reasonTr": "Ritüellere bağlılığın arttı."
            }
          },
          {
            "type": "ADVANCE_VILLAGE_TIME",
            "reasonTr": "Dua etmek sabah vaktini doldurdu."
          },
          {
            "type": "GO_TO_SCENE",
            "sceneId": "vicus_008_shrine"
          }
        ]
      }
    ],
    "conditions": [],
    "effects": [],
    "rewards": [],
    "onEnterEvents": []
  }
];

data.quests[0].scenes = [...data.quests[0].scenes, ...newScenes];
fs.writeFileSync(vicusPath, JSON.stringify(data, null, 2), "utf8");
console.log("Appended 20 activity scenes to vicus.json successfully!");
