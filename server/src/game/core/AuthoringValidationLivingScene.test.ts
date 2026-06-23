import { test } from "node:test";
import assert from "node:assert";
import { ContentValidator } from "../content/ContentValidator";
import type { LoadedContent } from "../types/contentTypes";
import type { Campaign } from "../types/gameTypes";

test("ContentValidator - validates invalid revisitVariants scene references", () => {
  const validator = new ContentValidator();
  
  // A minimum loaded content setup with a duplicate/invalid scene transition in revisit variants
  const mockContent: LoadedContent = {
    campaigns: [
      {
        id: "via-prima",
        title: "Via Prima",
        chapters: [
          {
            id: "prologus",
            title: "Prologus",
            quests: [
              {
                id: "quest_1",
                title: "Quest 1",
                startSceneId: "scene_1",
                statusConditions: [],
                rewards: [],
                scenes: [
                  {
                    id: "scene_1",
                    title: "Scene 1",
                    locationId: "loc_1",
                    npcIds: [],
                    description: "Desc",
                    objective: "Obj",
                    inputMode: "choice",
                    choices: [],
                    conditions: [],
                    effects: [],
                    rewards: [],
                    onEnterEvents: [],
                    revisitVariants: [
                      {
                        id: "variant_1",
                        conditions: [],
                        choicesOverride: [
                          {
                            id: "choice_1",
                            label: "Choice 1",
                            conditions: [],
                            effects: [],
                            nextSceneId: "invalid_scene_id" // Invalid reference!
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      } as unknown as Campaign
    ],
    npcs: [],
    items: [],
    skills: [],
    grammar: [],
    vocabulary: [],
    examples: [],
    questTemplates: []
  };

  const report = validator.validate(mockContent);
  assert.strictEqual(report.ok, false);
  const nextSceneErrors = report.errors.filter((e) => e.code === "INVALID_NEXT_SCENE");
  assert.ok(nextSceneErrors.length > 0, "Should detect invalid nextSceneId inside revisit variant choicesOverride.");
});
