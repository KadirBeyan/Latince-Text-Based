# Via Prima Beta QA Checklist

Durum değerleri: `pass`, `fail`, `todo`. Otomatik test sütunu ilgili komut veya spec dosyasını gösterir.

## 1. Player Onboarding

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| İlk açılış | Start screen boş veya broken görünmez | Temiz AppData ile uygulamayı aç | `e2e/player-flow.spec.ts` | todo |
| Yeni yolculuk | Ad girilince oyun ve ilk objective açılır | Ad gir, Yeni Yolculuk Başlat'a bas | `e2e/player-flow.spec.ts` | todo |
| Placement seçimi | Test önerilir, oyun için zorunlu değildir | Oyuna gir, Placement panelini aç veya doğrudan oyna | Kısmi | todo |

## 2. Core Gameplay

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Choice action | Geçerli seçim sahneyi değiştirir, effects/event uygulanır | İlk choice'a bas, state ve event log'u kontrol et | `e2e/player-flow.spec.ts`, server tests | todo |
| Text challenge | Doğru, yakın, yanlış ve boş cevap güvenli ele alınır | Dört cevap türünü sırayla gönder | `SceneSystem.test.ts` | todo |
| Progression | XP, currency, mastery, streak ve achievement engine tarafından güncellenir | Ödüllü sahne tamamla | `ProgressionAndMastery.test.ts` | todo |

## 3. Latin Evaluation

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Deterministic evaluation | LLM olmadan feedback ve hata etiketleri oluşur | LLM'yi kapat, Latince cevap gönder | `SceneSystem.test.ts` | todo |
| JSON repair/guard | Geçersiz LLM çıktısı oyunu çökertmez veya ödül uydurmaz | Mock invalid response ile action gönder | `JsonRepair.test.ts`, `LlmOutputGuard*.test.ts` | todo |

## 4. LLM Fallback

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| LLM disabled | Tüm temel oyun deterministic çalışır | LLM kullan kapalıyken choice/text akışını bitir | `e2e/llm-settings.spec.ts` | todo |
| Discovery offline | Ollama kapalıyken crash olmaz, empty/error state görünür | Modelleri Tara'ya bas | `e2e/llm-settings.spec.ts` | todo |
| Timeout fallback | Timeout event log'a yazılır ve güvenli fallback döner | Düşük timeout ile cevap gönder | `OpenAiCompatibleClient.test.ts` | todo |

## 5. Save/Load

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Save reload | Menüye dönüp kayıt açılınca aynı state gelir | Oyna, menüye dön, kaydı aç | `e2e/player-flow.spec.ts` | todo |
| Migration/integrity | Eski schema migrate olur, corrupt kayıt raporlanır | Fixture kayıtları DB'ye ekleyip checker çalıştır | `npm run check:saves` | todo |
| Log trim | Event/dialogue log 200 kayıt sınırına onarılabilir | Uzun loglu save için repair çalıştır | `SaveIntegrityService.test.ts` | todo |

## 6. Dynamic Quests

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Generate/accept | Generated ve review quest save/load olur | Öneri üret, kabul et, uygulamayı yeniden aç | `GeneratedQuestsStage7.test.ts` | todo |
| Reward guard | Üretilen ödül limitleri aşmaz | Challenge ve review quest üret | `GeneratedQuestsStage7.test.ts` | todo |

## 7. Assessment

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Placement complete | assessmentProfile ve attempt kaydolur | Placement başlat, tamamla, kaydı yeniden aç | `AssessmentSystems.test.ts` | todo |
| Placement skip | Test yapılmadan oyun devam eder | Yeni oyunda doğrudan choice seç | `e2e/player-flow.spec.ts` | todo |

## 8. Lexicon

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Lookup | Lemma/form araması sonuç ve açıklama döndürür | Lingua panelinde bilinen form ara | `LatinLexicalEngine.test.ts` | todo |
| Performance | Tekrarlı lookup kullanılabilir gecikmededir | Aynı kelimeyi art arda ara | Manuel + `/api/system/performance` | todo |

## 9. Authoring Studio

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Edit/validate/focus | Issue tıklanınca doğru field odaklanır | Hatalı scene aç, Validate ve issue tıkla | `e2e/authoring-flow.spec.ts` kısmi | todo |
| Preview isolation | Preview gerçek save'i değiştirmez | Session başlat, action gönder, discard et | `AuthoringPreviewService.test.ts` | todo |
| Override save | Save öncesi validation/backup, sonra AppData override | Scene düzenle ve kaydet | `AuthoringContentService.test.ts` | todo |
| Maturity report | Form coverage, raw JSON ve focus/preview durumları görünür | Dashboard'u aç | `/api/authoring/metrics` | todo |

## 10. Scene Graph Editor

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Edge coverage | choice/success/failure/GO_TO_SCENE edge görünür | Chapter ve quest graph aç | `SceneGraphBuilder.test.ts` | todo |
| Issues/navigation | Broken, unreachable, dead-end issue node'a zoom yapar | Bilinen issue'yu tıkla | `SceneGraphAnalyzer.test.ts` kısmi | todo |
| Large graph | 200+ node filtre/search/layout kullanılabilir | Büyük fixture graph yükle | Manuel | todo |

## 11. Tauri Desktop

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Desktop startup | Backend sidecar ve UI açılır | `npm run desktop:dev` | `cargo check` kısmi | todo |
| System paths | AppData ve database bilgisi Systema'da görünür | Desktop Systema panelini aç | `e2e/desktop-smoke.spec.ts` API | todo |

## 12. Backup/Restore

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Create/list | Backup tarih ve boyutla listelenir | Backup Oluştur'a bas | `e2e/desktop-smoke.spec.ts` | todo |
| Restore safety | Restore öncesi safety backup oluşur | Geçerli backup restore et | Backend smoke kısmi | todo |
| Invalid restore | Geçersiz bundle anlaşılır hata verir | Bozuk JSON import et | Manuel | todo |

## 13. AppData Overrides

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Override precedence | Geçerli override source content'in önüne geçer | Scene override kaydet, reload et | `AuthoringContentService.test.ts` | todo |
| Reset/export/import | Override güvenle sıfırlanır ve taşınır | Systema override kontrollerini kullan | Backend service tests kısmi | todo |
| Broken override | Açık hata oluşur, source dosya değişmez | Invalid override fixture yerleştir | Manuel | todo |

## 14. Performance

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Runtime metrics | Uptime, cache, content, DB, request ve memory döner | `/api/system/performance` çağır | `e2e/desktop-smoke.spec.ts` | todo |
| Initial load | 1440x900'de kullanılabilir sürede açılır | Soğuk başlangıcı ölç | Playwright trace/manual | todo |
| Validation/graph | Büyük içerikte bloklayıcı gecikme yoktur | Validate all ve graph layout sürelerini ölç | Manuel | todo |

## 15. UI Polish

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Responsive sweep | 1440x900 ve 1100px altında overlap yoktur | Tüm ana ekranları iki viewport'ta dolaş | Playwright screenshot manual | todo |
| Copy/empty states | Ana UI Türkçe, hata ve boş durumlar kısa/anlaşılırdır | Start, Settings, Systema, Authoring'i kontrol et | Kısmi | todo |

## 16. Accessibility

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Keyboard/focus | Form, modal ve tab akışları klavyeyle kullanılabilir | Sadece Tab/Enter/Escape ile dolaş | Manuel | todo |
| Labels/contrast | Input label, aria-label ve focus ring yeterlidir | Browser accessibility tree ve contrast kontrolü | Playwright locators kısmi | todo |
| Reduced motion | Sistem tercihi animasyonları bastırır | reduced-motion emülasyonu aç | CSS media query | pass |

## 17. Release Build

| Test adı | Beklenen sonuç | Manuel test adımı | Otomatik test | Durum |
|---|---|---|---|---|
| Typecheck/build/tests | Root ve client temiz geçer | Release komutlarını sırayla çalıştır | `npm run qa:check`, `npm run build`, `npm test` | todo |
| Tauri build | Cargo check ve desktop build tamamlanır | `npm run desktop:check`, `npm run desktop:build` | Manuel/CI | todo |
| Beta report | Blocker ve polish listesi üretilir | `npm run beta:report` | Script | todo |
