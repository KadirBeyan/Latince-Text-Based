import fs from "node:fs";
import path from "node:path";

const chaptersDir = path.resolve(process.cwd(), "data", "campaigns", "via-prima", "chapters");
const targets = ["prologus.json", "forum.json", "bibliotheca.json", "domus.json"];

for (const filename of targets) {
  const filepath = path.join(chaptersDir, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`File not found: ${filepath}`);
    continue;
  }

  const chapter = JSON.parse(fs.readFileSync(filepath, "utf8"));
  let sceneCount = 0;

  for (const quest of chapter.quests || []) {
    for (const scene of quest.scenes || []) {
      // Modify first 8 scenes
      if (sceneCount >= 8) break;
      sceneCount++;

      // Inject Revisit Variant
      scene.revisitVariants = [
        {
          id: `${scene.id}_revisit`,
          conditions: [
            { type: "SCENE_VISIT_COUNT_MIN", sceneId: scene.id, count: 2 }
          ],
          titleOverride: `${scene.title} (Tekrar Ziyaret)`,
          descriptionOverride: `[Tekrar Ziyaret] Buraya daha önce de gelmiştin. Çevre tanıdık geliyor. İnsanlar seni aşina gözlerle süzüyor.`
        }
      ];

      // Inject Ambient Templates
      scene.ambientTemplates = [
        {
          templateId: "inspect_object",
          customId: `${scene.id}_ambient_inspect`,
          labelTrOverride: "Etrafı Gözlemle",
          descriptionTrOverride: "Çevredeki nesnelere ve detaylara göz gezdir.",
          effects: [
            {
              type: "MARK_SCENE_INSPECTED",
              sceneId: scene.id,
              inspectId: `${scene.id}_ambient_inspect`
            }
          ]
        },
        {
          templateId: "remember_lesson",
          customId: `${scene.id}_ambient_remember`,
          labelTrOverride: "Dersleri Hatırla",
          descriptionTrOverride: "Geçmiş gramer ve kelime derslerini zihninde canlandır.",
          effects: [
            {
              type: "SET_SCENE_LOCAL_FLAG",
              sceneId: scene.id,
              key: "remembered_lesson",
              value: true
            }
          ]
        }
      ];

      console.log(`Injected living scene properties into scene: ${scene.id}`);
    }
  }

  fs.writeFileSync(filepath, JSON.stringify(chapter, null, 2), "utf8");
  console.log(`Saved changes to ${filepath}`);
}
