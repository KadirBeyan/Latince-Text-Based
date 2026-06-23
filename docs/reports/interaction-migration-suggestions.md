# Interaction Loop Migration Suggestions Report

This report outlines suggestions for migrating legacy choice/text/dialogue-response challenges to the new Stage 18 **Immersive RPG Interaction Loop** intents.

## Campaign: Via Prima (via-prima)

### Chapter: Köyde İlk Günler (vicus_prologue)

#### Quest: In Vico (vicus_prologue_main)

##### Scene: Mater'e Yardım (vicus_activity_help_mater)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Annenle birlikte taze ekmekleri sepetlere doldurup pazar yoluna koyuldunuz. Yolda sana köyün eski günlerinden bahsediyor.",
    "intents": [
      {
        "id": "vicus_activity_help_mater_complete",
        "labelTr": "Ekmek sepetini teslim et ve eve dön",
        "descriptionTr": "Mater'in teşekkürlerini alıp eve dön.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "help_mater_bread",
              "npcIds": [
                "mater"
              ],
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
    ]
  }
}
```

##### Scene: Tabelaları İnceleme (vicus_activity_inspect_signs)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Köy girişindeki eski taş tabelaları dikkatle okuyorsun. Arkadaşın amicus yanına gelip yazıları anlamana yardım ediyor.",
    "intents": [
      {
        "id": "vicus_activity_inspect_signs_complete",
        "labelTr": "Tabelayı okumayı bitir",
        "descriptionTr": "Yeni kelimeleri aklında tutarak yola dön.",
        "verb": "inspect",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "inspect_village_signs",
              "npcIds": [
                "amicus"
              ],
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
    ]
  }
}
```

##### Scene: Kuyudan Su Çekme (vicus_activity_carry_water)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Köy kuyusundan ağır kovalarla su çekiyorsun. Pater düzenli adımlarla taşımayı öğütlüyor.",
    "intents": [
      {
        "id": "vicus_activity_carry_water_complete",
        "labelTr": "Kovaları eve yerleştir",
        "descriptionTr": "Pater'in onayını alıp dinlen.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "carry_water",
              "npcIds": [
                "pater"
              ],
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
    ]
  }
}
```

##### Scene: Askerlik Anıları (vicus_activity_listen_veteran)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Veteranus bankında oturmuş, bastonuyla yere lejyon düzenini çiziyor. 'Castra'da her şey kurallara göredir' diyor.",
    "intents": [
      {
        "id": "vicus_activity_listen_veteran_complete",
        "labelTr": "Veteranus'a teşekkür edip ayrıl",
        "descriptionTr": "Askeri terimleri zihnine kazı.",
        "verb": "leave",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "listen_to_veteran",
              "npcIds": [
                "veteranus"
              ],
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
    ]
  }
}
```

##### Scene: Pazar Hazırlığı (vicus_activity_help_mercator)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Tüccar mercator tezgaha dizilecek zeytin ve incirleri ayıklıyor. Latince sayıları saymanı istiyor.",
    "intents": [
      {
        "id": "vicus_activity_help_mercator_complete",
        "labelTr": "İşi tamamla ve yardım et",
        "descriptionTr": "Mercator'un pazar tüyolarını al.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "help_mercator_market",
              "npcIds": [
                "mercator_vicus"
              ],
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
    ]
  }
}
```

##### Scene: Harfler ve Parşömenler (vicus_activity_observe_scribe)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Scriba, köyün vergi ve tahıl kayıtlarını parşömene geçiriyor. Sana mürekkep yapımını gösteriyor.",
    "intents": [
      {
        "id": "vicus_activity_observe_scribe_complete",
        "labelTr": "Yazıcıya saygılarını sunup ayrıl",
        "descriptionTr": "Resmi kayıtların önemini kavra.",
        "verb": "leave",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "observe_scribe_table",
              "npcIds": [
                "scriba_vicus"
              ],
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
    ]
  }
}
```

##### Scene: Sunak Selamı (vicus_activity_greet_shrine)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Sunağın önünde ministra küçük bir ritüel gerçekleştiriyor. Sana Lares ruhlarına saygılı olmayı öğretiyor.",
    "intents": [
      {
        "id": "vicus_activity_greet_shrine_complete",
        "labelTr": "Tapınaktan ayrıl",
        "descriptionTr": "Gönül huzuruyla yola koyul.",
        "verb": "leave",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "greet_at_shrine",
              "npcIds": [
                "ministra"
              ],
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
    ]
  }
}
```

##### Scene: Harf Egzersizleri (vicus_activity_practice_magister)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Magister ruralis, elindeki ahşap tablete harfleri kazıyor. Seni de kelimeleri seslendirmeye çağırıyor.",
    "intents": [
      {
        "id": "vicus_activity_practice_magister_complete",
        "labelTr": "Magister'a teşekkür et",
        "descriptionTr": "Telaffuz pratiği yapıp ayrıl.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "practice_with_magister",
              "npcIds": [
                "magister_ruralis"
              ],
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
    ]
  }
}
```

##### Scene: Tarla Arkadaşlığı (vicus_activity_follow_friend)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Amicus tarlada çalışırken yanına gidip ona yardım ediyorsun. Köyün dedikodularından bahsediyor.",
    "intents": [
      {
        "id": "vicus_activity_follow_friend_complete",
        "labelTr": "Tarladan ayrıl",
        "descriptionTr": "Günün yorgunluğuyla eve dön.",
        "verb": "leave",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "follow_friend_to_fields",
              "npcIds": [
                "amicus"
              ],
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
    ]
  }
}
```

##### Scene: Akşam Sohbeti (vicus_activity_family_talk)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ev halkı ocak başında toplandı. Avia tenceredeki çorbayı karıştırırken pater günün işlerini soruyor.",
    "intents": [
      {
        "id": "vicus_activity_family_talk_complete",
        "labelTr": "Ocak başından kalk",
        "descriptionTr": "Günü tamamlamak için dinlen.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "evening_family_talk",
              "npcIds": [
                "mater",
                "pater",
                "avia"
              ],
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
    ]
  }
}
```

##### Scene: Roma'da Eğitim (vicus_activity_ask_ludus)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Magister'a büyük şehirdeki 'ludus' okullarında eğitimin nasıl olduğunu soruyorsun. Sana Roma'daki okulların disiplinli olduğunu söylüyor.",
    "intents": [
      {
        "id": "vicus_activity_ask_ludus_complete",
        "labelTr": "Roma okullarını aklında tut",
        "descriptionTr": "Okul yoluna dair ilk ipucunu al.",
        "verb": "inspect",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "ask_about_ludus",
              "npcIds": [
                "magister_ruralis"
              ],
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
    ]
  }
}
```

##### Scene: Castra Hayatı (vicus_activity_ask_castra)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Veteranus'a lejyon kamplarındaki disiplin ve düzeni soruyorsun. Sana 'Castra'da her şey kurallara göre akar' diyor.",
    "intents": [
      {
        "id": "vicus_activity_ask_castra_complete",
        "labelTr": "Askerlik yolunu aklında tut",
        "descriptionTr": "Castra yoluna dair ilk ipucunu al.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "ask_about_castra",
              "npcIds": [
                "veteranus"
              ],
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
    ]
  }
}
```

##### Scene: Roma Pazarı (vicus_activity_ask_trade)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Mercator'a Roma pazarındaki büyük ticareti soruyorsun. Sana 'Mercatura, Roma'nın kalbidir' diyor.",
    "intents": [
      {
        "id": "vicus_activity_ask_trade_complete",
        "labelTr": "Ticaret yollarını aklında tut",
        "descriptionTr": "Ticaret yoluna dair ilk ipucunu al.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "ask_about_trade",
              "npcIds": [
                "mercator_vicus"
              ],
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
    ]
  }
}
```

##### Scene: Ot Toplama (vicus_activity_collect_herbs)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Büyükannen Avia'nın ilaçları için tarla kenarından şifalı otlar topluyorsun. Otların yerlerini inceliyorsun.",
    "intents": [
      {
        "id": "vicus_activity_collect_herbs_complete",
        "labelTr": "Otları topla ve eve dön",
        "descriptionTr": "Otları Avia'ya teslim et.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "collect_herbs",
              "npcIds": [
                "avia"
              ],
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
    ]
  }
}
```

##### Scene: Balmumu Harfleri (vicus_activity_scribe_wax)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Scriba'nın yanında stilus ile balmumu tablete harfler kazıyorsun. Harflerin çizgisini takip etmelisin.",
    "intents": [
      {
        "id": "vicus_activity_scribe_wax_complete",
        "labelTr": "Yazıyı scriba'ya göster",
        "descriptionTr": "Yazma pratiğini tamamla.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "scribe_wax",
              "npcIds": [
                "scriba_vicus"
              ],
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
    ]
  }
}
```

##### Scene: Sunak Adağı (vicus_activity_shrine_offering)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Lares sunağına buğday taneleri bırakıyorsun. Ministra ruhların bereket sunacağını söylüyor.",
    "intents": [
      {
        "id": "vicus_activity_shrine_offering_complete",
        "labelTr": "Sunağı selamlayıp ayrıl",
        "descriptionTr": "Dua et ve tapınaktan çık.",
        "verb": "leave",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "shrine_offering",
              "npcIds": [
                "ministra"
              ],
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
    ]
  }
}
```

##### Scene: Kartaca Savaşları (vicus_activity_veteran_story)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Veteranus sana Hannibal'a karşı verilen büyük savaşları ve Scipio'nun zaferini anlatıyor.",
    "intents": [
      {
        "id": "vicus_activity_veteran_story_complete",
        "labelTr": "Tarihi dersi al",
        "descriptionTr": "Lejyon şerefini aklında tut.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "veteran_story",
              "npcIds": [
                "veteranus"
              ],
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
    ]
  }
}
```

##### Scene: Pazarlık Pratiği (vicus_activity_market_bargain)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Mercator zeytinyağı testisini satmaya çalışıyor. Fiyatı uygun kelimelerle düşürmelisin.",
    "intents": [
      {
        "id": "vicus_activity_market_bargain_complete",
        "labelTr": "Pazarlığı bitir",
        "descriptionTr": "Alışverişi tamamla.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "market_bargain",
              "npcIds": [
                "mercator_vicus"
              ],
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
    ]
  }
}
```

##### Scene: Toprak Laboru (vicus_activity_field_labor)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Pater ile birlikte toprağı çapalıyor ve yabani otları temizliyorsunuz. Güneş altında ter döküyorsun.",
    "intents": [
      {
        "id": "vicus_activity_field_labor_complete",
        "labelTr": "İşi tamamla ve dinlen",
        "descriptionTr": "Aletleri temizleyip tarladan ayrıl.",
        "verb": "listen",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "field_labor",
              "npcIds": [
                "pater"
              ],
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
    ]
  }
}
```

##### Scene: Sabah Duası (vicus_activity_morning_prayer)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Sabahın erken vaktinde sunağa gidip günün bereketi için tanrılara şükran sunuyorsun.",
    "intents": [
      {
        "id": "vicus_activity_morning_prayer_complete",
        "labelTr": "Duayı bitirip ayrıl",
        "descriptionTr": "Sunaktan huzurla çık.",
        "verb": "leave",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "RECORD_VILLAGE_ACTIVITY",
            "payload": {
              "activityId": "morning_prayer",
              "npcIds": [
                "ministra"
              ],
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
    ]
  }
}
```

### Chapter: Prologus (prologus)

#### Quest: Prima Dies (quest_prima_dies)

##### Scene: Magister Aelius (meet_magister)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Compatibility lesson for the original Via Prima opening.",
    "intents": [
      {
        "id": "listen_to_magister",
        "labelTr": "Listen carefully",
        "descriptionTr": "Dersi dinle.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "UNLOCK_SKILL",
            "skillId": "latin_basics"
          }
        ],
        "nextSceneId": "choose_tablet"
      }
    ]
  }
}
```

##### Scene: Wax and Stylus (choose_tablet)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Compatibility lesson for the original Via Prima opening.",
    "intents": [
      {
        "id": "take_tools",
        "labelTr": "Take both tools",
        "descriptionTr": "Araclari al.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_ITEM",
            "itemId": "wax_tablet",
            "quantity": 1
          },
          {
            "type": "ADD_ITEM",
            "itemId": "stylus",
            "quantity": 1
          },
          {
            "type": "SET_FLAG",
            "key": "has_lesson_tools",
            "value": true
          }
        ],
        "nextSceneId": "first_latin_question"
      }
    ]
  }
}
```

##### Scene: The First Answer (first_latin_question)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Compatibility lesson for the original Via Prima opening.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "NPC’ye selam ver.",
        "playerIntentTr": "NPC’ye Latince selam ver.",
        "canonicalAnswers": [
          "Salve.",
          "Salve magister.",
          "Salve, magister."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "lesson_complete",
        "failureNextSceneId": "first_latin_question",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Iterum saluta.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum non est salutatio.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Lesson Complete (lesson_complete)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Compatibility lesson for the original Via Prima opening.",
    "intents": [
      {
        "id": "continue_to_prologus",
        "labelTr": "Prologus yoluna don",
        "descriptionTr": "Yeni Via Prima akisini surdur.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [],
        "nextSceneId": "prologus_001_arrival"
      }
    ]
  }
}
```

#### Quest: Prologus: prima (prologus_main_prima)

##### Scene: Prologus 001 (prologus_001_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, magister.",
    "intents": [
      {
        "id": "prologus_001_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_002_practice"
      },
      {
        "id": "prologus_001_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Prologus 002 (prologus_002_practice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "prologus_002_practice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_003_voice"
      }
    ]
  }
}
```

##### Scene: Prologus 003 (prologus_003_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es Marcus.",
    "intents": [
      {
        "id": "prologus_003_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_004_reply"
      }
    ]
  }
}
```

#### Quest: Prologus: secunda (prologus_main_secunda)

##### Scene: Prologus 004 (prologus_004_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Mihi nomen est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mihi nomen est.",
        "playerIntentTr": "Kendini Latince tanıt.",
        "canonicalAnswers": [
          "Mihi nomen est.",
          "Mihi nomen est",
          "mihi nomen est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "prologus_005_review",
        "failureNextSceneId": "prologus_004_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Paene. Te ipsum dic.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "De te ipso respondere debes.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Prologus 005 (prologus_005_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Vale, amice.",
    "intents": [
      {
        "id": "prologus_005_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_006_path"
      },
      {
        "id": "prologus_005_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Prologus 006 (prologus_006_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, magister.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Salve, magister.",
        "playerIntentTr": "NPC’ye Latince selam ver.",
        "canonicalAnswers": [
          "Salve, magister.",
          "Salve, magister",
          "salve, magister."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "prologus_007_arrival",
        "failureNextSceneId": "prologus_006_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Iterum saluta.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum non est salutatio.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Prologus: tertia (prologus_main_tertia)

##### Scene: Prologus 007 (prologus_007_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "prologus_007_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_008_practice"
      }
    ]
  }
}
```

##### Scene: Prologus 008 (prologus_008_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es Marcus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Tu es Marcus.",
        "playerIntentTr": "Karşındaki kişiyi Latince tanıt.",
        "canonicalAnswers": [
          "Tu es Marcus.",
          "Tu es Marcus",
          "tu es marcus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [
          {
            "meaningTr": "Ben kendimi tanıtıyorum.",
            "exampleLatin": "Ego sum Marcus.",
            "reasonTr": "Burada karşındaki kişiden söz etmen gerekiyor; birinci şahıs bağlama uymuyor."
          }
        ],
        "successNextSceneId": "prologus_009_voice",
        "failureNextSceneId": "prologus_008_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. De illo responde.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hic de altera persona respondendum est.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Prologus 009 (prologus_009_voice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Mihi nomen est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mihi nomen est.",
        "playerIntentTr": "Kendini Latince tanıt.",
        "canonicalAnswers": [
          "Mihi nomen est.",
          "Mihi nomen est",
          "mihi nomen est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "prologus_010_reply",
        "failureNextSceneId": "prologus_009_voice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Paene. Te ipsum dic.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "De te ipso respondere debes.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Prologus: quarta (prologus_main_quarta)

##### Scene: Prologus 010 (prologus_010_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Vale, amice.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "NPC’ye veda et.",
        "playerIntentTr": "NPC’ye Latince veda et.",
        "canonicalAnswers": [
          "Vale, amice.",
          "Vale, amice",
          "vale, amice."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "prologus_011_review",
        "failureNextSceneId": "prologus_010_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Vale, amice.",
            "npcLineTr": "Hoşça kal, dostum.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Vale, amice.",
            "npcLineTr": "Hoşça kal, dostum.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Vale, amice.",
            "npcLineTr": "Hoşça kal, dostum.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Dic vale.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum non est valedictio.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Prologus 011 (prologus_011_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, magister.",
    "intents": [
      {
        "id": "prologus_011_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_012_path"
      }
    ]
  }
}
```

##### Scene: Prologus 012 (prologus_012_path)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "prologus_012_path_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_013_arrival"
      }
    ]
  }
}
```

#### Quest: Prologus: auxilium (prologus_side_auxilium)

##### Scene: Prologus 013 (prologus_013_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es Marcus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Tu es Marcus.",
        "playerIntentTr": "Karşındaki kişiyi Latince tanıt.",
        "canonicalAnswers": [
          "Tu es Marcus.",
          "Tu es Marcus",
          "tu es marcus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [
          {
            "meaningTr": "Ben kendimi tanıtıyorum.",
            "exampleLatin": "Ego sum Marcus.",
            "reasonTr": "Burada karşındaki kişiden söz etmen gerekiyor; birinci şahıs bağlama uymuyor."
          }
        ],
        "successNextSceneId": "prologus_014_practice",
        "failureNextSceneId": "prologus_013_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. De illo responde.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hic de altera persona respondendum est.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Prologus 014 (prologus_014_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Mihi nomen est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mihi nomen est.",
        "playerIntentTr": "Kendini Latince tanıt.",
        "canonicalAnswers": [
          "Mihi nomen est.",
          "Mihi nomen est",
          "mihi nomen est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "prologus_015_voice",
        "failureNextSceneId": "prologus_014_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Paene. Te ipsum dic.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "De te ipso respondere debes.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Prologus: amicus (prologus_side_amicus)

##### Scene: Prologus 015 (prologus_015_voice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Vale, amice.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "NPC’ye veda et.",
        "playerIntentTr": "NPC’ye Latince veda et.",
        "canonicalAnswers": [
          "Vale, amice.",
          "Vale, amice",
          "vale, amice."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "prologus_016_reply",
        "failureNextSceneId": "prologus_015_voice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Vale, amice.",
            "npcLineTr": "Hoşça kal, dostum.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Vale, amice.",
            "npcLineTr": "Hoşça kal, dostum.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Vale, amice.",
            "npcLineTr": "Hoşça kal, dostum.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Dic vale.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum non est valedictio.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Prologus 016 (prologus_016_reply)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, magister.",
    "intents": [
      {
        "id": "prologus_016_reply_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_017_review"
      }
    ]
  }
}
```

#### Quest: Prologus: nota (prologus_side_nota)

##### Scene: Prologus 017 (prologus_017_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "prologus_017_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_018_path"
      },
      {
        "id": "prologus_017_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

#### Quest: Prologus: brevis (prologus_side_brevis)

##### Scene: Prologus 018 (prologus_018_path)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es Marcus.",
    "intents": [
      {
        "id": "prologus_018_path_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "prologus_019_arrival"
      }
    ]
  }
}
```

#### Quest: Prologus: memoria (prologus_side_memoria)

##### Scene: Prologus 019 (prologus_019_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Mihi nomen est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mihi nomen est.",
        "playerIntentTr": "Kendini Latince tanıt.",
        "canonicalAnswers": [
          "Mihi nomen est.",
          "Mihi nomen est",
          "mihi nomen est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "prologus_020_practice",
        "failureNextSceneId": "prologus_019_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Paene. Te ipsum dic.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "De te ipso respondere debes.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Prologus: recapitulatio (prologus_review_recapitulatio)

##### Scene: Prologus 020 (prologus_020_practice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Prologus bolumunde kisa bir ogrenme ani. Hedef cumle: Vale, amice.",
    "intents": [
      {
        "id": "prologus_020_practice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_001_arrival"
      }
    ]
  }
}
```

### Chapter: Ludus (ludus)

#### Quest: Ludus: prima (ludus_main_prima)

##### Scene: Ludus 001 (ludus_001_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puer est discipulus.",
    "intents": [
      {
        "id": "ludus_001_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_002_practice"
      },
      {
        "id": "ludus_001_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Ludus 002 (ludus_002_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puella est bona.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella est bona.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella est bona.",
          "Puella est bona",
          "puella est bona."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_003_voice",
        "failureNextSceneId": "ludus_002_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Ludus 003 (ludus_003_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Liber est novus.",
    "intents": [
      {
        "id": "ludus_003_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_004_reply"
      }
    ]
  }
}
```

##### Scene: Ludus 004 (ludus_004_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Ego sum discipulus.",
        "playerIntentTr": "Kendini Latince tanıt.",
        "canonicalAnswers": [
          "Ego sum discipulus.",
          "Ego sum discipulus",
          "ego sum discipulus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [
          {
            "meaningTr": "Sen ... değilsin; kişi karıştı discipulus.",
            "exampleLatin": "Tu es discipulus.",
            "reasonTr": "Cümle Latince kurulmuş olabilir, fakat burada kendini tanıtman gerekiyor; ikinci şahıs bağlama uymuyor."
          }
        ],
        "successNextSceneId": "ludus_005_review",
        "failureNextSceneId": "ludus_004_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Paene. Te ipsum dic.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "De te ipso respondere debes.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Ludus: secunda (ludus_main_secunda)

##### Scene: Ludus 005 (ludus_005_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es magister.",
    "intents": [
      {
        "id": "ludus_005_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_006_path"
      },
      {
        "id": "ludus_005_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Ludus 006 (ludus_006_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puer est discipulus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer est discipulus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer est discipulus.",
          "Puer est discipulus",
          "puer est discipulus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_007_arrival",
        "failureNextSceneId": "ludus_006_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Ludus 007 (ludus_007_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puella est bona.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella est bona.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella est bona.",
          "Puella est bona",
          "puella est bona."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_008_practice",
        "failureNextSceneId": "ludus_007_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Ludus 008 (ludus_008_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Liber est novus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Liber est novus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Liber est novus.",
          "Liber est novus",
          "liber est novus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_009_voice",
        "failureNextSceneId": "ludus_008_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Ludus: tertia (ludus_main_tertia)

##### Scene: Ludus 009 (ludus_009_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "ludus_009_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_010_reply"
      },
      {
        "id": "ludus_009_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Ludus 010 (ludus_010_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es magister.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Tu es magister.",
        "playerIntentTr": "Karşındaki kişiyi Latince tanıt.",
        "canonicalAnswers": [
          "Tu es magister.",
          "Tu es magister",
          "tu es magister."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [
          {
            "meaningTr": "Ben kendimi tanıtıyorum.",
            "exampleLatin": "Ego sum magister.",
            "reasonTr": "Burada karşındaki kişiden söz etmen gerekiyor; birinci şahıs bağlama uymuyor."
          }
        ],
        "successNextSceneId": "ludus_011_review",
        "failureNextSceneId": "ludus_010_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. De illo responde.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hic de altera persona respondendum est.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Ludus 011 (ludus_011_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puer est discipulus.",
    "intents": [
      {
        "id": "ludus_011_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_012_path"
      }
    ]
  }
}
```

##### Scene: Ludus 012 (ludus_012_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puella est bona.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella est bona.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella est bona.",
          "Puella est bona",
          "puella est bona."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_013_arrival",
        "failureNextSceneId": "ludus_012_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Ludus: quarta (ludus_main_quarta)

##### Scene: Ludus 013 (ludus_013_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Liber est novus.",
    "intents": [
      {
        "id": "ludus_013_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_014_practice"
      },
      {
        "id": "ludus_013_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Ludus 014 (ludus_014_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Ego sum discipulus.",
        "playerIntentTr": "Kendini Latince tanıt.",
        "canonicalAnswers": [
          "Ego sum discipulus.",
          "Ego sum discipulus",
          "ego sum discipulus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [
          {
            "meaningTr": "Sen ... değilsin; kişi karıştı discipulus.",
            "exampleLatin": "Tu es discipulus.",
            "reasonTr": "Cümle Latince kurulmuş olabilir, fakat burada kendini tanıtman gerekiyor; ikinci şahıs bağlama uymuyor."
          }
        ],
        "successNextSceneId": "ludus_015_voice",
        "failureNextSceneId": "ludus_014_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Paene. Te ipsum dic.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "De te ipso respondere debes.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Ludus 015 (ludus_015_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es magister.",
    "intents": [
      {
        "id": "ludus_015_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_016_reply"
      }
    ]
  }
}
```

##### Scene: Ludus 016 (ludus_016_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puer est discipulus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer est discipulus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer est discipulus.",
          "Puer est discipulus",
          "puer est discipulus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_017_review",
        "failureNextSceneId": "ludus_016_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Ludus: auxilium (ludus_side_auxilium)

##### Scene: Ludus 017 (ludus_017_review)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puella est bona.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella est bona.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella est bona.",
          "Puella est bona",
          "puella est bona."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_018_path",
        "failureNextSceneId": "ludus_017_review",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      },
      {
        "id": "ludus_017_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_018_path"
      },
      {
        "id": "ludus_017_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Ludus 018 (ludus_018_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Liber est novus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Liber est novus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Liber est novus.",
          "Liber est novus",
          "liber est novus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_019_arrival",
        "failureNextSceneId": "ludus_018_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Ludus: amicus (ludus_side_amicus)

##### Scene: Ludus 019 (ludus_019_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "ludus_019_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_020_practice"
      }
    ]
  }
}
```

##### Scene: Ludus 020 (ludus_020_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es magister.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Tu es magister.",
        "playerIntentTr": "Karşındaki kişiyi Latince tanıt.",
        "canonicalAnswers": [
          "Tu es magister.",
          "Tu es magister",
          "tu es magister."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [
          {
            "meaningTr": "Ben kendimi tanıtıyorum.",
            "exampleLatin": "Ego sum magister.",
            "reasonTr": "Burada karşındaki kişiden söz etmen gerekiyor; birinci şahıs bağlama uymuyor."
          }
        ],
        "successNextSceneId": "ludus_021_voice",
        "failureNextSceneId": "ludus_020_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte dicis.",
            "npcLineTr": "Doğru söylüyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. De illo responde.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hic de altera persona respondendum est.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Ludus: nota (ludus_side_nota)

##### Scene: Ludus 021 (ludus_021_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puer est discipulus.",
    "intents": [
      {
        "id": "ludus_021_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_022_reply"
      },
      {
        "id": "ludus_021_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Ludus 022 (ludus_022_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Puella est bona.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella est bona.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella est bona.",
          "Puella est bona",
          "puella est bona."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "ludus_023_review",
        "failureNextSceneId": "ludus_022_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Ludus: brevis (ludus_side_brevis)

##### Scene: Ludus 023 (ludus_023_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Liber est novus.",
    "intents": [
      {
        "id": "ludus_023_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "ludus_024_path"
      }
    ]
  }
}
```

#### Quest: Ludus: memoria (ludus_side_memoria)

##### Scene: Ludus 024 (ludus_024_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Ego sum discipulus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Ego sum discipulus.",
        "playerIntentTr": "Kendini Latince tanıt.",
        "canonicalAnswers": [
          "Ego sum discipulus.",
          "Ego sum discipulus",
          "ego sum discipulus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [
          {
            "meaningTr": "Sen ... değilsin; kişi karıştı discipulus.",
            "exampleLatin": "Tu es discipulus.",
            "reasonTr": "Cümle Latince kurulmuş olabilir, fakat burada kendini tanıtman gerekiyor; ikinci şahıs bağlama uymuyor."
          }
        ],
        "successNextSceneId": "ludus_025_arrival",
        "failureNextSceneId": "ludus_024_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Intellego.",
            "npcLineTr": "Güzel. Anladım.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Paene. Te ipsum dic.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "De te ipso respondere debes.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Ludus: recapitulatio (ludus_review_recapitulatio)

##### Scene: Ludus 025 (ludus_025_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Ludus bolumunde kisa bir ogrenme ani. Hedef cumle: Tu es magister.",
    "intents": [
      {
        "id": "ludus_025_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_001_arrival"
      },
      {
        "id": "ludus_025_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

### Chapter: Domus (domus)

#### Quest: Domus: prima (domus_main_prima)

##### Scene: Domus 002 (domus_002_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Pater est magnus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Pater est magnus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Pater est magnus.",
          "Pater est magnus",
          "pater est magnus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_003_voice",
        "failureNextSceneId": "domus_002_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Domus 003 (domus_003_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Filia est parva.",
    "intents": [
      {
        "id": "domus_003_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_004_reply"
      }
    ]
  }
}
```

##### Scene: Domus 004 (domus_004_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Servus est in domo.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Servus est in domo.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Servus est in domo.",
          "Servus est in domo",
          "servus est in domo."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_005_review",
        "failureNextSceneId": "domus_004_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Domus: secunda (domus_main_secunda)

##### Scene: Domus 005 (domus_005_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Familia est magna.",
    "intents": [
      {
        "id": "domus_005_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_006_path"
      },
      {
        "id": "domus_005_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Domus 006 (domus_006_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Mater est bona.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mater est bona.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Mater est bona.",
          "Mater est bona",
          "mater est bona."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_007_arrival",
        "failureNextSceneId": "domus_006_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Domus 007 (domus_007_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Pater est magnus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Pater est magnus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Pater est magnus.",
          "Pater est magnus",
          "pater est magnus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_008_practice",
        "failureNextSceneId": "domus_007_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Domus 008 (domus_008_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Filia est parva.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Filia est parva.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Filia est parva.",
          "Filia est parva",
          "filia est parva."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_009_voice",
        "failureNextSceneId": "domus_008_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Domus: tertia (domus_main_tertia)

##### Scene: Domus 009 (domus_009_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Servus est in domo.",
    "intents": [
      {
        "id": "domus_009_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_010_reply"
      },
      {
        "id": "domus_009_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Domus 010 (domus_010_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Familia est magna.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Familia est magna.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Familia est magna.",
          "Familia est magna",
          "familia est magna."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_011_review",
        "failureNextSceneId": "domus_010_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Domus 011 (domus_011_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Mater est bona.",
    "intents": [
      {
        "id": "domus_011_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_012_path"
      }
    ]
  }
}
```

##### Scene: Domus 012 (domus_012_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Pater est magnus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Pater est magnus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Pater est magnus.",
          "Pater est magnus",
          "pater est magnus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_013_arrival",
        "failureNextSceneId": "domus_012_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Domus: quarta (domus_main_quarta)

##### Scene: Domus 013 (domus_013_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Filia est parva.",
    "intents": [
      {
        "id": "domus_013_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_014_practice"
      },
      {
        "id": "domus_013_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Domus 014 (domus_014_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Servus est in domo.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Servus est in domo.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Servus est in domo.",
          "Servus est in domo",
          "servus est in domo."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_015_voice",
        "failureNextSceneId": "domus_014_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Domus 015 (domus_015_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Familia est magna.",
    "intents": [
      {
        "id": "domus_015_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_016_reply"
      }
    ]
  }
}
```

##### Scene: Domus 016 (domus_016_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Mater est bona.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mater est bona.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Mater est bona.",
          "Mater est bona",
          "mater est bona."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_017_review",
        "failureNextSceneId": "domus_016_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Domus: auxilium (domus_side_auxilium)

##### Scene: Domus 017 (domus_017_review)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Pater est magnus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Pater est magnus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Pater est magnus.",
          "Pater est magnus",
          "pater est magnus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_018_path",
        "failureNextSceneId": "domus_017_review",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      },
      {
        "id": "domus_017_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_018_path"
      },
      {
        "id": "domus_017_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Domus 018 (domus_018_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Filia est parva.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Filia est parva.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Filia est parva.",
          "Filia est parva",
          "filia est parva."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_019_arrival",
        "failureNextSceneId": "domus_018_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Domus: amicus (domus_side_amicus)

##### Scene: Domus 019 (domus_019_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Servus est in domo.",
    "intents": [
      {
        "id": "domus_019_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_020_practice"
      }
    ]
  }
}
```

##### Scene: Domus 020 (domus_020_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Familia est magna.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Familia est magna.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Familia est magna.",
          "Familia est magna",
          "familia est magna."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_021_voice",
        "failureNextSceneId": "domus_020_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Domus: nota (domus_side_nota)

##### Scene: Domus 021 (domus_021_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Mater est bona.",
    "intents": [
      {
        "id": "domus_021_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_022_reply"
      },
      {
        "id": "domus_021_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Domus 022 (domus_022_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Pater est magnus.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Pater est magnus.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Pater est magnus.",
          "Pater est magnus",
          "pater est magnus."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_023_review",
        "failureNextSceneId": "domus_022_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Domus: brevis (domus_side_brevis)

##### Scene: Domus 023 (domus_023_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Filia est parva.",
    "intents": [
      {
        "id": "domus_023_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "domus_024_path"
      }
    ]
  }
}
```

#### Quest: Domus: memoria (domus_side_memoria)

##### Scene: Domus 024 (domus_024_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Servus est in domo.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Servus est in domo.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Servus est in domo.",
          "Servus est in domo",
          "servus est in domo."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "domus_025_arrival",
        "failureNextSceneId": "domus_024_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Domus: recapitulatio (domus_review_recapitulatio)

##### Scene: Domus 025 (domus_025_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Domus bolumunde kisa bir ogrenme ani. Hedef cumle: Familia est magna.",
    "intents": [
      {
        "id": "domus_025_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_001_arrival"
      },
      {
        "id": "domus_025_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

### Chapter: Forum (forum)

#### Quest: Forum: prima (forum_main_prima)

##### Scene: Forum 002 (forum_002_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puella panem portat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella panem portat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella panem portat.",
          "Puella panem portat",
          "puella panem portat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_003_voice",
        "failureNextSceneId": "forum_002_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 003 (forum_003_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus tabulam habet.",
    "intents": [
      {
        "id": "forum_003_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_004_reply"
      }
    ]
  }
}
```

##### Scene: Forum 004 (forum_004_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Mercator pecuniam quaerit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mercator pecuniam quaerit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Mercator pecuniam quaerit.",
          "Mercator pecuniam quaerit",
          "mercator pecuniam quaerit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_005_review",
        "failureNextSceneId": "forum_004_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 005 (forum_005_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Non vinum emo.",
    "intents": [
      {
        "id": "forum_005_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_006_path"
      },
      {
        "id": "forum_005_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

#### Quest: Forum: secunda (forum_main_secunda)

##### Scene: Forum 006 (forum_006_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer librum videt.",
          "Puer librum videt",
          "puer librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_007_arrival",
        "failureNextSceneId": "forum_006_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 007 (forum_007_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puella panem portat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella panem portat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella panem portat.",
          "Puella panem portat",
          "puella panem portat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_008_practice",
        "failureNextSceneId": "forum_007_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 008 (forum_008_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus tabulam habet.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus tabulam habet.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus tabulam habet.",
          "Marcus tabulam habet",
          "marcus tabulam habet."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_009_voice",
        "failureNextSceneId": "forum_008_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 009 (forum_009_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Mercator pecuniam quaerit.",
    "intents": [
      {
        "id": "forum_009_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_010_reply"
      },
      {
        "id": "forum_009_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Forum 010 (forum_010_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Non vinum emo.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Non vinum emo.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Non vinum emo.",
          "Non vinum emo",
          "non vinum emo."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_011_review",
        "failureNextSceneId": "forum_010_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Forum: tertia (forum_main_tertia)

##### Scene: Forum 011 (forum_011_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum videt.",
    "intents": [
      {
        "id": "forum_011_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_012_path"
      }
    ]
  }
}
```

##### Scene: Forum 012 (forum_012_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puella panem portat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella panem portat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella panem portat.",
          "Puella panem portat",
          "puella panem portat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_013_arrival",
        "failureNextSceneId": "forum_012_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 013 (forum_013_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus tabulam habet.",
    "intents": [
      {
        "id": "forum_013_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_014_practice"
      },
      {
        "id": "forum_013_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Forum 014 (forum_014_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Mercator pecuniam quaerit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mercator pecuniam quaerit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Mercator pecuniam quaerit.",
          "Mercator pecuniam quaerit",
          "mercator pecuniam quaerit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_015_voice",
        "failureNextSceneId": "forum_014_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 015 (forum_015_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Non vinum emo.",
    "intents": [
      {
        "id": "forum_015_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_016_reply"
      }
    ]
  }
}
```

#### Quest: Forum: quarta (forum_main_quarta)

##### Scene: Forum 016 (forum_016_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer librum videt.",
          "Puer librum videt",
          "puer librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_017_review",
        "failureNextSceneId": "forum_016_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 017 (forum_017_review)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puella panem portat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella panem portat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella panem portat.",
          "Puella panem portat",
          "puella panem portat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_018_path",
        "failureNextSceneId": "forum_017_review",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      },
      {
        "id": "forum_017_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_018_path"
      },
      {
        "id": "forum_017_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Forum 018 (forum_018_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus tabulam habet.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus tabulam habet.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus tabulam habet.",
          "Marcus tabulam habet",
          "marcus tabulam habet."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_019_arrival",
        "failureNextSceneId": "forum_018_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 019 (forum_019_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Mercator pecuniam quaerit.",
    "intents": [
      {
        "id": "forum_019_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_020_practice"
      }
    ]
  }
}
```

#### Quest: Forum: auxilium (forum_side_auxilium)

##### Scene: Forum 020 (forum_020_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Non vinum emo.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Non vinum emo.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Non vinum emo.",
          "Non vinum emo",
          "non vinum emo."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_021_voice",
        "failureNextSceneId": "forum_020_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 021 (forum_021_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum videt.",
    "intents": [
      {
        "id": "forum_021_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_022_reply"
      },
      {
        "id": "forum_021_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Forum 022 (forum_022_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puella panem portat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella panem portat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella panem portat.",
          "Puella panem portat",
          "puella panem portat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_023_review",
        "failureNextSceneId": "forum_022_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Forum: amicus (forum_side_amicus)

##### Scene: Forum 023 (forum_023_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus tabulam habet.",
    "intents": [
      {
        "id": "forum_023_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_024_path"
      }
    ]
  }
}
```

##### Scene: Forum 024 (forum_024_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Mercator pecuniam quaerit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Mercator pecuniam quaerit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Mercator pecuniam quaerit.",
          "Mercator pecuniam quaerit",
          "mercator pecuniam quaerit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_025_arrival",
        "failureNextSceneId": "forum_024_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Forum: nota (forum_side_nota)

##### Scene: Forum 025 (forum_025_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Non vinum emo.",
    "intents": [
      {
        "id": "forum_025_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_026_practice"
      },
      {
        "id": "forum_025_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Forum 026 (forum_026_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer librum videt.",
          "Puer librum videt",
          "puer librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_027_voice",
        "failureNextSceneId": "forum_026_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Forum: brevis (forum_side_brevis)

##### Scene: Forum 027 (forum_027_voice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Puella panem portat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella panem portat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella panem portat.",
          "Puella panem portat",
          "puella panem portat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_028_reply",
        "failureNextSceneId": "forum_027_voice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Forum 028 (forum_028_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus tabulam habet.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus tabulam habet.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus tabulam habet.",
          "Marcus tabulam habet",
          "marcus tabulam habet."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "forum_029_review",
        "failureNextSceneId": "forum_028_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Forum: memoria (forum_side_memoria)

##### Scene: Forum 029 (forum_029_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Mercator pecuniam quaerit.",
    "intents": [
      {
        "id": "forum_029_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "forum_030_path"
      },
      {
        "id": "forum_029_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

#### Quest: Forum: recapitulatio (forum_review_recapitulatio)

##### Scene: Forum 030 (forum_030_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Forum bolumunde kisa bir ogrenme ani. Hedef cumle: Non vinum emo.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Non vinum emo.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Non vinum emo.",
          "Non vinum emo",
          "non vinum emo."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_001_arrival",
        "failureNextSceneId": "forum_030_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

### Chapter: Bibliotheca (bibliotheca)

#### Quest: Bibliotheca: prima (bibliotheca_main_prima)

##### Scene: Bibliotheca 002 (bibliotheca_002_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puella tabulam scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella tabulam scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella tabulam scribit.",
          "Puella tabulam scribit",
          "puella tabulam scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_003_voice",
        "failureNextSceneId": "bibliotheca_002_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Bibliotheca 003 (bibliotheca_003_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Magister discipulos docet.",
    "intents": [
      {
        "id": "bibliotheca_003_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_004_reply"
      }
    ]
  }
}
```

##### Scene: Bibliotheca 004 (bibliotheca_004_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus legit et Julia scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus legit et Julia scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus legit et Julia scribit.",
          "Marcus legit et Julia scribit",
          "marcus legit et julia scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_005_review",
        "failureNextSceneId": "bibliotheca_004_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Bibliotheca: secunda (bibliotheca_main_secunda)

##### Scene: Bibliotheca 005 (bibliotheca_005_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Scriba bene scribit.",
    "intents": [
      {
        "id": "bibliotheca_005_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_006_path"
      },
      {
        "id": "bibliotheca_005_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Bibliotheca 006 (bibliotheca_006_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum legit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer librum legit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer librum legit.",
          "Puer librum legit",
          "puer librum legit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_007_arrival",
        "failureNextSceneId": "bibliotheca_006_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Bibliotheca 007 (bibliotheca_007_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puella tabulam scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella tabulam scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella tabulam scribit.",
          "Puella tabulam scribit",
          "puella tabulam scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_008_practice",
        "failureNextSceneId": "bibliotheca_007_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Bibliotheca 008 (bibliotheca_008_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Magister discipulos docet.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Magister discipulos docet.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Magister discipulos docet.",
          "Magister discipulos docet",
          "magister discipulos docet."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_009_voice",
        "failureNextSceneId": "bibliotheca_008_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Bibliotheca: tertia (bibliotheca_main_tertia)

##### Scene: Bibliotheca 009 (bibliotheca_009_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus legit et Julia scribit.",
    "intents": [
      {
        "id": "bibliotheca_009_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_010_reply"
      },
      {
        "id": "bibliotheca_009_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Bibliotheca 010 (bibliotheca_010_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Scriba bene scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Scriba bene scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Scriba bene scribit.",
          "Scriba bene scribit",
          "scriba bene scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_011_review",
        "failureNextSceneId": "bibliotheca_010_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Bibliotheca 011 (bibliotheca_011_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum legit.",
    "intents": [
      {
        "id": "bibliotheca_011_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_012_path"
      }
    ]
  }
}
```

##### Scene: Bibliotheca 012 (bibliotheca_012_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puella tabulam scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella tabulam scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella tabulam scribit.",
          "Puella tabulam scribit",
          "puella tabulam scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_013_arrival",
        "failureNextSceneId": "bibliotheca_012_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Bibliotheca: quarta (bibliotheca_main_quarta)

##### Scene: Bibliotheca 013 (bibliotheca_013_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Magister discipulos docet.",
    "intents": [
      {
        "id": "bibliotheca_013_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_014_practice"
      },
      {
        "id": "bibliotheca_013_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Bibliotheca 014 (bibliotheca_014_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus legit et Julia scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus legit et Julia scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus legit et Julia scribit.",
          "Marcus legit et Julia scribit",
          "marcus legit et julia scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_015_voice",
        "failureNextSceneId": "bibliotheca_014_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Bibliotheca 015 (bibliotheca_015_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Scriba bene scribit.",
    "intents": [
      {
        "id": "bibliotheca_015_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_016_reply"
      }
    ]
  }
}
```

##### Scene: Bibliotheca 016 (bibliotheca_016_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum legit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer librum legit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer librum legit.",
          "Puer librum legit",
          "puer librum legit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_017_review",
        "failureNextSceneId": "bibliotheca_016_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Bibliotheca: auxilium (bibliotheca_side_auxilium)

##### Scene: Bibliotheca 017 (bibliotheca_017_review)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puella tabulam scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella tabulam scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella tabulam scribit.",
          "Puella tabulam scribit",
          "puella tabulam scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_018_path",
        "failureNextSceneId": "bibliotheca_017_review",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      },
      {
        "id": "bibliotheca_017_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_018_path"
      },
      {
        "id": "bibliotheca_017_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Bibliotheca 018 (bibliotheca_018_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Magister discipulos docet.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Magister discipulos docet.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Magister discipulos docet.",
          "Magister discipulos docet",
          "magister discipulos docet."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_019_arrival",
        "failureNextSceneId": "bibliotheca_018_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Bibliotheca: amicus (bibliotheca_side_amicus)

##### Scene: Bibliotheca 019 (bibliotheca_019_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus legit et Julia scribit.",
    "intents": [
      {
        "id": "bibliotheca_019_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_020_practice"
      }
    ]
  }
}
```

##### Scene: Bibliotheca 020 (bibliotheca_020_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Scriba bene scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Scriba bene scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Scriba bene scribit.",
          "Scriba bene scribit",
          "scriba bene scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_021_voice",
        "failureNextSceneId": "bibliotheca_020_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Bibliotheca: nota (bibliotheca_side_nota)

##### Scene: Bibliotheca 021 (bibliotheca_021_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puer librum legit.",
    "intents": [
      {
        "id": "bibliotheca_021_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_022_reply"
      },
      {
        "id": "bibliotheca_021_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Bibliotheca 022 (bibliotheca_022_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Puella tabulam scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella tabulam scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella tabulam scribit.",
          "Puella tabulam scribit",
          "puella tabulam scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_023_review",
        "failureNextSceneId": "bibliotheca_022_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Bibliotheca: brevis (bibliotheca_side_brevis)

##### Scene: Bibliotheca 023 (bibliotheca_023_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Magister discipulos docet.",
    "intents": [
      {
        "id": "bibliotheca_023_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "bibliotheca_024_path"
      }
    ]
  }
}
```

#### Quest: Bibliotheca: memoria (bibliotheca_side_memoria)

##### Scene: Bibliotheca 024 (bibliotheca_024_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus legit et Julia scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus legit et Julia scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus legit et Julia scribit.",
          "Marcus legit et Julia scribit",
          "marcus legit et julia scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "bibliotheca_025_arrival",
        "failureNextSceneId": "bibliotheca_024_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Bibliotheca: recapitulatio (bibliotheca_review_recapitulatio)

##### Scene: Bibliotheca 025 (bibliotheca_025_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Bibliotheca bolumunde kisa bir ogrenme ani. Hedef cumle: Scriba bene scribit.",
    "intents": [
      {
        "id": "bibliotheca_025_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_001_arrival"
      },
      {
        "id": "bibliotheca_025_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

### Chapter: Castra (castra)

#### Quest: Castra: prima (castra_main_prima)

##### Scene: Castra 002 (castra_002_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Audi, Marce!",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Audi, Marce!",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Audi, Marce!",
          "Audi, Marce",
          "audi, marce!"
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_003_voice",
        "failureNextSceneId": "castra_002_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Castra 003 (castra_003_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Porta scutum.",
    "intents": [
      {
        "id": "castra_003_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_004_reply"
      }
    ]
  }
}
```

##### Scene: Castra 004 (castra_004_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Ducite puerum.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Ducite puerum.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Ducite puerum.",
          "Ducite puerum",
          "ducite puerum."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_005_review",
        "failureNextSceneId": "castra_004_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Castra: secunda (castra_main_secunda)

##### Scene: Castra 005 (castra_005_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: State ad portam.",
    "intents": [
      {
        "id": "castra_005_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_006_path"
      },
      {
        "id": "castra_005_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Castra 006 (castra_006_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Veni!",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Veni!",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Veni!",
          "Veni",
          "veni!"
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_007_arrival",
        "failureNextSceneId": "castra_006_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Castra 007 (castra_007_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Audi, Marce!",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Audi, Marce!",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Audi, Marce!",
          "Audi, Marce",
          "audi, marce!"
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_008_practice",
        "failureNextSceneId": "castra_007_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Castra 008 (castra_008_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Porta scutum.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Porta scutum.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Porta scutum.",
          "Porta scutum",
          "porta scutum."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_009_voice",
        "failureNextSceneId": "castra_008_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Castra: tertia (castra_main_tertia)

##### Scene: Castra 009 (castra_009_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Ducite puerum.",
    "intents": [
      {
        "id": "castra_009_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_010_reply"
      },
      {
        "id": "castra_009_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Castra 010 (castra_010_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: State ad portam.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "State ad portam.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "State ad portam.",
          "State ad portam",
          "state ad portam."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_011_review",
        "failureNextSceneId": "castra_010_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Castra 011 (castra_011_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Veni!",
    "intents": [
      {
        "id": "castra_011_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_012_path"
      }
    ]
  }
}
```

##### Scene: Castra 012 (castra_012_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Audi, Marce!",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Audi, Marce!",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Audi, Marce!",
          "Audi, Marce",
          "audi, marce!"
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_013_arrival",
        "failureNextSceneId": "castra_012_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Castra: quarta (castra_main_quarta)

##### Scene: Castra 013 (castra_013_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Porta scutum.",
    "intents": [
      {
        "id": "castra_013_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_014_practice"
      },
      {
        "id": "castra_013_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Castra 014 (castra_014_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Ducite puerum.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Ducite puerum.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Ducite puerum.",
          "Ducite puerum",
          "ducite puerum."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_015_voice",
        "failureNextSceneId": "castra_014_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Castra 015 (castra_015_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: State ad portam.",
    "intents": [
      {
        "id": "castra_015_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_016_reply"
      }
    ]
  }
}
```

##### Scene: Castra 016 (castra_016_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Veni!",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Veni!",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Veni!",
          "Veni",
          "veni!"
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_017_review",
        "failureNextSceneId": "castra_016_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Castra: auxilium (castra_side_auxilium)

##### Scene: Castra 017 (castra_017_review)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Audi, Marce!",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Audi, Marce!",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Audi, Marce!",
          "Audi, Marce",
          "audi, marce!"
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_018_path",
        "failureNextSceneId": "castra_017_review",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      },
      {
        "id": "castra_017_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_018_path"
      },
      {
        "id": "castra_017_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Castra 018 (castra_018_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Porta scutum.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Porta scutum.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Porta scutum.",
          "Porta scutum",
          "porta scutum."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_019_arrival",
        "failureNextSceneId": "castra_018_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Castra: amicus (castra_side_amicus)

##### Scene: Castra 019 (castra_019_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Ducite puerum.",
    "intents": [
      {
        "id": "castra_019_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_020_practice"
      }
    ]
  }
}
```

##### Scene: Castra 020 (castra_020_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: State ad portam.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "State ad portam.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "State ad portam.",
          "State ad portam",
          "state ad portam."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_021_voice",
        "failureNextSceneId": "castra_020_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Castra: nota (castra_side_nota)

##### Scene: Castra 021 (castra_021_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Veni!",
    "intents": [
      {
        "id": "castra_021_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_022_reply"
      },
      {
        "id": "castra_021_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Castra 022 (castra_022_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Audi, Marce!",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Audi, Marce!",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Audi, Marce!",
          "Audi, Marce",
          "audi, marce!"
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_023_review",
        "failureNextSceneId": "castra_022_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Castra: brevis (castra_side_brevis)

##### Scene: Castra 023 (castra_023_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Porta scutum.",
    "intents": [
      {
        "id": "castra_023_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "castra_024_path"
      }
    ]
  }
}
```

#### Quest: Castra: memoria (castra_side_memoria)

##### Scene: Castra 024 (castra_024_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: Ducite puerum.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Ducite puerum.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Ducite puerum.",
          "Ducite puerum",
          "ducite puerum."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "castra_025_arrival",
        "failureNextSceneId": "castra_024_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Castra: recapitulatio (castra_review_recapitulatio)

##### Scene: Castra 025 (castra_025_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Castra bolumunde kisa bir ogrenme ani. Hedef cumle: State ad portam.",
    "intents": [
      {
        "id": "castra_025_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_001_arrival"
      },
      {
        "id": "castra_025_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

### Chapter: Via Appia (via-appia)

#### Quest: Via Appia: prima (via-appia_main_prima)

##### Scene: Via Appia 001 (via-appia_001_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus ad portam venit.",
    "intents": [
      {
        "id": "via-appia_001_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_002_practice"
      },
      {
        "id": "via-appia_001_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Via Appia 002 (via-appia_002_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puella in villa est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella in villa est.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella in villa est.",
          "Puella in villa est",
          "puella in villa est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_003_voice",
        "failureNextSceneId": "via-appia_002_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Via Appia 003 (via-appia_003_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puer cum Marco ambulat.",
    "intents": [
      {
        "id": "via-appia_003_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_004_reply"
      }
    ]
  }
}
```

##### Scene: Via Appia 004 (via-appia_004_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Servus sine gladio venit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Servus sine gladio venit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Servus sine gladio venit.",
          "Servus sine gladio venit",
          "servus sine gladio venit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_005_review",
        "failureNextSceneId": "via-appia_004_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Via Appia: secunda (via-appia_main_secunda)

##### Scene: Via Appia 005 (via-appia_005_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Viator tabernam intrat.",
    "intents": [
      {
        "id": "via-appia_005_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_006_path"
      },
      {
        "id": "via-appia_005_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Via Appia 006 (via-appia_006_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus ad portam venit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus ad portam venit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus ad portam venit.",
          "Marcus ad portam venit",
          "marcus ad portam venit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_007_arrival",
        "failureNextSceneId": "via-appia_006_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Via Appia 007 (via-appia_007_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puella in villa est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella in villa est.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella in villa est.",
          "Puella in villa est",
          "puella in villa est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_008_practice",
        "failureNextSceneId": "via-appia_007_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Via Appia 008 (via-appia_008_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puer cum Marco ambulat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer cum Marco ambulat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer cum Marco ambulat.",
          "Puer cum Marco ambulat",
          "puer cum marco ambulat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_009_voice",
        "failureNextSceneId": "via-appia_008_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Via Appia: tertia (via-appia_main_tertia)

##### Scene: Via Appia 009 (via-appia_009_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Servus sine gladio venit.",
    "intents": [
      {
        "id": "via-appia_009_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_010_reply"
      },
      {
        "id": "via-appia_009_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Via Appia 010 (via-appia_010_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Viator tabernam intrat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Viator tabernam intrat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Viator tabernam intrat.",
          "Viator tabernam intrat",
          "viator tabernam intrat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_011_review",
        "failureNextSceneId": "via-appia_010_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Via Appia 011 (via-appia_011_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus ad portam venit.",
    "intents": [
      {
        "id": "via-appia_011_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_012_path"
      }
    ]
  }
}
```

##### Scene: Via Appia 012 (via-appia_012_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puella in villa est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella in villa est.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella in villa est.",
          "Puella in villa est",
          "puella in villa est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_013_arrival",
        "failureNextSceneId": "via-appia_012_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Via Appia: quarta (via-appia_main_quarta)

##### Scene: Via Appia 013 (via-appia_013_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puer cum Marco ambulat.",
    "intents": [
      {
        "id": "via-appia_013_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_014_practice"
      },
      {
        "id": "via-appia_013_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Via Appia 014 (via-appia_014_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Servus sine gladio venit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Servus sine gladio venit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Servus sine gladio venit.",
          "Servus sine gladio venit",
          "servus sine gladio venit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_015_voice",
        "failureNextSceneId": "via-appia_014_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Via Appia 015 (via-appia_015_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Viator tabernam intrat.",
    "intents": [
      {
        "id": "via-appia_015_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_016_reply"
      }
    ]
  }
}
```

##### Scene: Via Appia 016 (via-appia_016_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus ad portam venit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus ad portam venit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus ad portam venit.",
          "Marcus ad portam venit",
          "marcus ad portam venit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_017_review",
        "failureNextSceneId": "via-appia_016_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Via Appia: auxilium (via-appia_side_auxilium)

##### Scene: Via Appia 017 (via-appia_017_review)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puella in villa est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella in villa est.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella in villa est.",
          "Puella in villa est",
          "puella in villa est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_018_path",
        "failureNextSceneId": "via-appia_017_review",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      },
      {
        "id": "via-appia_017_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_018_path"
      },
      {
        "id": "via-appia_017_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Via Appia 018 (via-appia_018_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puer cum Marco ambulat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puer cum Marco ambulat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puer cum Marco ambulat.",
          "Puer cum Marco ambulat",
          "puer cum marco ambulat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_019_arrival",
        "failureNextSceneId": "via-appia_018_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Via Appia: amicus (via-appia_side_amicus)

##### Scene: Via Appia 019 (via-appia_019_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Servus sine gladio venit.",
    "intents": [
      {
        "id": "via-appia_019_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_020_practice"
      }
    ]
  }
}
```

##### Scene: Via Appia 020 (via-appia_020_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Viator tabernam intrat.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Viator tabernam intrat.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Viator tabernam intrat.",
          "Viator tabernam intrat",
          "viator tabernam intrat."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_021_voice",
        "failureNextSceneId": "via-appia_020_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Via Appia: nota (via-appia_side_nota)

##### Scene: Via Appia 021 (via-appia_021_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus ad portam venit.",
    "intents": [
      {
        "id": "via-appia_021_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_022_reply"
      },
      {
        "id": "via-appia_021_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Via Appia 022 (via-appia_022_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puella in villa est.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Puella in villa est.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Puella in villa est.",
          "Puella in villa est",
          "puella in villa est."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_023_review",
        "failureNextSceneId": "via-appia_022_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Via Appia: brevis (via-appia_side_brevis)

##### Scene: Via Appia 023 (via-appia_023_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Puer cum Marco ambulat.",
    "intents": [
      {
        "id": "via-appia_023_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "via-appia_024_path"
      }
    ]
  }
}
```

#### Quest: Via Appia: memoria (via-appia_side_memoria)

##### Scene: Via Appia 024 (via-appia_024_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Servus sine gladio venit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Servus sine gladio venit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Servus sine gladio venit.",
          "Servus sine gladio venit",
          "servus sine gladio venit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "via-appia_025_arrival",
        "failureNextSceneId": "via-appia_024_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Via Appia: recapitulatio (via-appia_review_recapitulatio)

##### Scene: Via Appia 025 (via-appia_025_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Via Appia bolumunde kisa bir ogrenme ani. Hedef cumle: Viator tabernam intrat.",
    "intents": [
      {
        "id": "via-appia_025_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_001_arrival"
      },
      {
        "id": "via-appia_025_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

### Chapter: Capitolium (capitolium)

#### Quest: Capitolium: prima (capitolium_main_prima)

##### Scene: Capitolium 001 (capitolium_001_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, amici.",
    "intents": [
      {
        "id": "capitolium_001_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_002_practice"
      },
      {
        "id": "capitolium_001_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Capitolium 002 (capitolium_002_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus librum videt.",
          "Marcus librum videt",
          "marcus librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_003_voice",
        "failureNextSceneId": "capitolium_002_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 003 (capitolium_003_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Veni ad templum.",
    "intents": [
      {
        "id": "capitolium_003_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_004_reply"
      }
    ]
  }
}
```

##### Scene: Capitolium 004 (capitolium_004_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Julia bene scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Julia bene scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Julia bene scribit.",
          "Julia bene scribit",
          "julia bene scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_005_review",
        "failureNextSceneId": "capitolium_004_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 005 (capitolium_005_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Discipulus viae primae es.",
    "intents": [
      {
        "id": "capitolium_005_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_006_path"
      },
      {
        "id": "capitolium_005_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

#### Quest: Capitolium: secunda (capitolium_main_secunda)

##### Scene: Capitolium 006 (capitolium_006_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, amici.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Salve, amici.",
        "playerIntentTr": "NPC’ye Latince selam ver.",
        "canonicalAnswers": [
          "Salve, amici.",
          "Salve, amici",
          "salve, amici."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_007_arrival",
        "failureNextSceneId": "capitolium_006_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Iterum saluta.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum non est salutatio.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 007 (capitolium_007_arrival)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus librum videt.",
          "Marcus librum videt",
          "marcus librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_008_practice",
        "failureNextSceneId": "capitolium_007_arrival",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 008 (capitolium_008_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Veni ad templum.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Veni ad templum.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Veni ad templum.",
          "Veni ad templum",
          "veni ad templum."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_009_voice",
        "failureNextSceneId": "capitolium_008_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 009 (capitolium_009_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Julia bene scribit.",
    "intents": [
      {
        "id": "capitolium_009_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_010_reply"
      },
      {
        "id": "capitolium_009_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Capitolium 010 (capitolium_010_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Discipulus viae primae es.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Discipulus viae primae es.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Discipulus viae primae es.",
          "Discipulus viae primae es",
          "discipulus viae primae es."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_011_review",
        "failureNextSceneId": "capitolium_010_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Capitolium: tertia (capitolium_main_tertia)

##### Scene: Capitolium 011 (capitolium_011_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, amici.",
    "intents": [
      {
        "id": "capitolium_011_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_012_path"
      }
    ]
  }
}
```

##### Scene: Capitolium 012 (capitolium_012_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus librum videt.",
          "Marcus librum videt",
          "marcus librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_013_arrival",
        "failureNextSceneId": "capitolium_012_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 013 (capitolium_013_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Veni ad templum.",
    "intents": [
      {
        "id": "capitolium_013_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_014_practice"
      },
      {
        "id": "capitolium_013_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Capitolium 014 (capitolium_014_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Julia bene scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Julia bene scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Julia bene scribit.",
          "Julia bene scribit",
          "julia bene scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_015_voice",
        "failureNextSceneId": "capitolium_014_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 015 (capitolium_015_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Discipulus viae primae es.",
    "intents": [
      {
        "id": "capitolium_015_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_016_reply"
      }
    ]
  }
}
```

#### Quest: Capitolium: quarta (capitolium_main_quarta)

##### Scene: Capitolium 016 (capitolium_016_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, amici.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Salve, amici.",
        "playerIntentTr": "NPC’ye Latince selam ver.",
        "canonicalAnswers": [
          "Salve, amici.",
          "Salve, amici",
          "salve, amici."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_017_review",
        "failureNextSceneId": "capitolium_016_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Iterum saluta.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum non est salutatio.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 017 (capitolium_017_review)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus librum videt.",
          "Marcus librum videt",
          "marcus librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_018_path",
        "failureNextSceneId": "capitolium_017_review",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      },
      {
        "id": "capitolium_017_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_018_path"
      },
      {
        "id": "capitolium_017_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Capitolium 018 (capitolium_018_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Veni ad templum.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Veni ad templum.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Veni ad templum.",
          "Veni ad templum",
          "veni ad templum."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_019_arrival",
        "failureNextSceneId": "capitolium_018_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 019 (capitolium_019_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Julia bene scribit.",
    "intents": [
      {
        "id": "capitolium_019_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_020_practice"
      }
    ]
  }
}
```

#### Quest: Capitolium: auxilium (capitolium_side_auxilium)

##### Scene: Capitolium 020 (capitolium_020_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Discipulus viae primae es.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Discipulus viae primae es.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Discipulus viae primae es.",
          "Discipulus viae primae es",
          "discipulus viae primae es."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_021_voice",
        "failureNextSceneId": "capitolium_020_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 021 (capitolium_021_voice)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, amici.",
    "intents": [
      {
        "id": "capitolium_021_voice_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_022_reply"
      },
      {
        "id": "capitolium_021_voice_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Capitolium 022 (capitolium_022_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus librum videt.",
          "Marcus librum videt",
          "marcus librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_023_review",
        "failureNextSceneId": "capitolium_022_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Capitolium: amicus (capitolium_side_amicus)

##### Scene: Capitolium 023 (capitolium_023_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Veni ad templum.",
    "intents": [
      {
        "id": "capitolium_023_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_024_path"
      }
    ]
  }
}
```

##### Scene: Capitolium 024 (capitolium_024_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Julia bene scribit.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Julia bene scribit.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Julia bene scribit.",
          "Julia bene scribit",
          "julia bene scribit."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_025_arrival",
        "failureNextSceneId": "capitolium_024_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Capitolium: nota (capitolium_side_nota)

##### Scene: Capitolium 025 (capitolium_025_arrival)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Discipulus viae primae es.",
    "intents": [
      {
        "id": "capitolium_025_arrival_continue",
        "labelTr": "Dikkatle cevap ver",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_026_practice"
      },
      {
        "id": "capitolium_025_arrival_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

##### Scene: Capitolium 026 (capitolium_026_practice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Salve, amici.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Salve, amici.",
        "playerIntentTr": "NPC’ye Latince selam ver.",
        "canonicalAnswers": [
          "Salve, amici.",
          "Salve, amici",
          "salve, amici."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_027_voice",
        "failureNextSceneId": "capitolium_026_practice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Bene. Salve!",
            "npcLineTr": "Güzel. Selam!",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Iterum saluta.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum non est salutatio.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Capitolium: brevis (capitolium_side_brevis)

##### Scene: Capitolium 027 (capitolium_027_voice)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Marcus librum videt.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Marcus librum videt.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Marcus librum videt.",
          "Marcus librum videt",
          "marcus librum videt."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_028_reply",
        "failureNextSceneId": "capitolium_027_voice",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

##### Scene: Capitolium 028 (capitolium_028_reply)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Veni ad templum.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Veni ad templum.",
        "playerIntentTr": "NPC’nin emrini Latince olarak doğru ifade et.",
        "canonicalAnswers": [
          "Veni ad templum.",
          "Veni ad templum",
          "veni ad templum."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_029_review",
        "failureNextSceneId": "capitolium_028_reply",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte. Ita fac.",
            "npcLineTr": "Doğru. Öyle yap.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Imperativum quaere.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Responsum imperativum esse debet.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```

#### Quest: Capitolium: memoria (capitolium_side_memoria)

##### Scene: Capitolium 029 (capitolium_029_review)
- **Current Input Mode:** `choice`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Capitolium bolumunde kisa bir ogrenme ani. Hedef cumle: Julia bene scribit.",
    "intents": [
      {
        "id": "capitolium_029_review_continue",
        "labelTr": "Devam et",
        "descriptionTr": "Kisa aciklamayi uygula.",
        "verb": "wait",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_XP",
            "amount": 5
          }
        ],
        "nextSceneId": "capitolium_030_path"
      },
      {
        "id": "capitolium_029_review_review",
        "labelTr": "Kurali tekrar et",
        "descriptionTr": "Yanlis secimi kisa notla duzelt.",
        "verb": "custom",
        "requiresLatin": false,
        "conditions": [],
        "effects": [
          {
            "type": "ADD_JOURNAL_ENTRY",
            "title": "Kisa tekrar",
            "body": "Kisa Latince cumlelerde ozne, fiil ve varsa nesneyi sirayla bul."
          }
        ]
      }
    ]
  }
}
```

#### Quest: Capitolium: recapitulatio (capitolium_review_recapitulatio)

##### Scene: Capitolium 030 (capitolium_030_path)
- **Current Input Mode:** `dialogue-response`

**Suggested `interactionModel` Configuration:**
```json
{
  "interactionModel": {
    "mode": "interaction-loop",
    "openingNarrationTr": "Magister seni artik discipulus viae primae olarak tanir. Via Prima tamamlandi.",
    "intents": [
      {
        "id": "speak_introduce_self",
        "labelTr": "Kendini tanıt",
        "verb": "speak",
        "requiresLatin": true,
        "targetMeaningTr": "Discipulus viae primae es.",
        "playerIntentTr": "Durumu NPC’ye Latince cümleyle anlat.",
        "canonicalAnswers": [
          "Discipulus viae primae es.",
          "Discipulus viae primae es",
          "discipulus viae primae es."
        ],
        "acceptedVariants": [],
        "rejectedMeanings": [],
        "successNextSceneId": "capitolium_030_path",
        "failureNextSceneId": "capitolium_030_path",
        "failureBehavior": "retry",
        "responseReactions": {
          "correct": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru cevap. Anlam ve bağlam uyuşuyor."
          },
          "equivalentCorrect": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Doğru; farklı ama eşdeğer bir Latince ifade kullandın."
          },
          "acceptableVariant": {
            "npcLineLatin": "Recte narras.",
            "npcLineTr": "Doğru anlatıyorsun.",
            "feedbackTr": "Kabul edilebilir bir varyant."
          },
          "nearMiss": {
            "npcLineLatin": "Paene recte. Iterum tenta.",
            "npcLineTr": "Neredeyse doğru. Tekrar dene.",
            "feedbackTr": "Cevabın yakın; küçük bir biçim ya da kelime hatası var."
          },
          "wrong": {
            "npcLineLatin": "Non ita. Sententiam iterum compone.",
            "npcLineTr": "Böyle değil. Tekrar dene.",
            "feedbackTr": "Cevap hedeflenen anlam veya gramerle uyuşmuyor."
          },
          "contextWrong": {
            "npcLineLatin": "Hoc responsum rem aliam narrat.",
            "npcLineTr": "Bağlamı karıştırdın.",
            "feedbackTr": "Latince yapı doğru olabilir, ama bu konuşma anında beklenen anlam farklı."
          }
        }
      }
    ]
  }
}
```


**Total Suggested Migrations:** 225 scenes.
