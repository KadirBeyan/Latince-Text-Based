# Via Prima Content Guide

## Scene Rules

Keep every scene focused on one learning target. Use short Turkish narration, A1 Latin sentences of 2-6 words, and A2 sentences of 3-10 words. Avoid B1 structures such as subjunctive, participles, indirect statement, and ablative absolute.

Every scene should include an id, title, description, locationId, npcIds, inputMode, objective, effects, rewards, learningFocus, and either choices, textChallenge, or both for hybrid scenes.

## Quest Rules

Main quests carry the chapter path. Side quests are short practice moments tied to a location or NPC. Review quests should map directly to weak grammar or vocabulary ids so the learning path and dynamic quest systems can recommend them.

Dynamic quest templates should use one of the Stage 11 categories: chapter-review, npc-favor, location-rumor, grammar-remediation, or vocabulary-practice. Keep trigger ids aligned with learningFocus ids so weak mastery can select the template naturally.

## Grammar And Vocabulary IDs

Use ids from data/latin/grammar-a1.json, grammar-a2.json, and the vocabulary packs. Scene learningFocus ids must exist in the runtime indexes data/latin/grammar.json and data/latin/vocabulary.json.

## Chapter Structure

A Via Prima chapter includes titleLatin, locationIds, npcIds, grammarFocus, vocabularyFocus, estimatedSceneCount, unlockConditions, and main/side/review quest id arrays. The playable runtime shape remains chapters -> quests -> scenes.

## LearningFocus

Prefer one grammar id and 2-4 vocabulary ids per scene. Use difficulty intro, practice, review, or challenge. Keep skillIds small and stable, usually latin_basics, latin_reading, or latin_forms.

## Latin Difficulty

A1 chapters should use greetings, sum/esse, nominative, simple sentences, and basic gender/adjective agreement. A2 chapters may add accusative, direct objects, imperatives, prepositions, conjunctions, and short reading comprehension.

## TextChallenge Answers

Provide multiple expectedAnswers and acceptedVariants. Use loose or normal strictness for early practice, normal or strict for challenge scenes. Failure feedback should be brief and corrective.

## NPC Tone

Magister is calm and pedagogical. Marcus is friendly and sometimes wrong. Julia is careful. Mercator prompts object forms. Scriba supports reading. Miles teaches commands without heavy combat. Lydia handles route language.

## Validation

Run typecheck/build and content validation after edits. Check for duplicate scene ids, invalid nextSceneIds, unknown npc/location/grammar/vocabulary ids, empty expectedAnswers, missing choices, unreachable scenes, and excessive rewards.

`GET /api/content/validate` returns global errors/warnings plus chapterReports. Use chapterReports to quickly verify scene count, text challenge count, hybrid scenes, and per-chapter issue counts.
