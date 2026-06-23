import fs from "node:fs";
import path from "node:path";

function checkCoverage() {
  const dataRoot = path.resolve(process.cwd(), "data");
  const reportsDir = path.resolve(process.cwd(), "docs", "reports");
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Load JSON files
  const activitiesPath = path.join(dataRoot, "village", "village-activities.json");
  const npcPresencePath = path.join(dataRoot, "village", "npc-presence.json");
  const ambientEventsPath = path.join(dataRoot, "village", "ambient-events.json");
  const vicusChapterPath = path.join(dataRoot, "campaigns", "via-prima", "chapters", "vicus.json");

  console.log("Analyzing Village Life RPG Loop Coverage...");

  if (!fs.existsSync(activitiesPath)) {
    console.error("Missing village-activities.json!");
    process.exit(1);
  }
  if (!fs.existsSync(npcPresencePath)) {
    console.error("Missing npc-presence.json!");
    process.exit(1);
  }
  if (!fs.existsSync(ambientEventsPath)) {
    console.error("Missing ambient-events.json!");
    process.exit(1);
  }
  if (!fs.existsSync(vicusChapterPath)) {
    console.error("Missing vicus.json!");
    process.exit(1);
  }

  const activities = JSON.parse(fs.readFileSync(activitiesPath, "utf8"));
  const npcPresence = JSON.parse(fs.readFileSync(npcPresencePath, "utf8"));
  const ambientEvents = JSON.parse(fs.readFileSync(ambientEventsPath, "utf8"));
  const vicusChapter = JSON.parse(fs.readFileSync(vicusChapterPath, "utf8"));

  // 1. Scene existence validation
  const chapterScenes = new Set<string>();
  for (const quest of vicusChapter.quests || []) {
    for (const scene of quest.scenes || []) {
      chapterScenes.add(scene.id);
    }
  }

  const missingScenes: string[] = [];
  for (const act of activities) {
    if (!chapterScenes.has(act.sceneId)) {
      missingScenes.push(`${act.id} -> missing sceneId: ${act.sceneId}`);
    }
  }

  // 2. Distributions
  const locationCounts: Record<string, number> = {};
  const timeCounts: Record<string, number> = { mane: 0, meridies: 0, vesper: 0, nox: 0 };
  const npcCounts: Record<string, number> = {};
  const pathCounts: Record<string, number> = { ludus: 0, castra: 0, mercatura: 0, scriptura: 0, templum: 0, villa: 0 };

  for (const act of activities) {
    locationCounts[act.locationId] = (locationCounts[act.locationId] || 0) + 1;
    
    for (const tw of act.timeWindows || []) {
      timeCounts[tw] = (timeCounts[tw] || 0) + 1;
    }

    for (const npc of act.relatedNpcIds || []) {
      npcCounts[npc] = (npcCounts[npc] || 0) + 1;
    }

    if (act.lifePathHints) {
      for (const [pathKey, val] of Object.entries(act.lifePathHints)) {
        pathCounts[pathKey] = (pathCounts[pathKey] || 0) + (val as number);
      }
    }
  }

  // Generate Report
  const reportPath = path.join(reportsDir, "village-life-coverage.md");
  let report = `# Village Life RPG Loop Coverage Report\n\n`;
  report += `*Generated automatically on ${new Date().toLocaleDateString('tr-TR')}*\n\n`;

  report += `## Summary Metrics\n`;
  report += `- **Total Activities**: ${activities.length}\n`;
  report += `- **Total Ambient Events**: ${ambientEvents.length}\n`;
  report += `- **Unique NPCs Tracked**: ${Object.keys(npcPresence).length}\n`;
  report += `- **Scenes Configured in Campaign**: ${chapterScenes.size}\n\n`;

  report += `## Activity Scene Validity\n`;
  if (missingScenes.length === 0) {
    report += `> [!NOTE]\n`;
    report += `> **All ${activities.length} activity sceneIds are successfully registered as active scenes in \`vicus.json\`!**\n\n`;
  } else {
    report += `> [!WARNING]\n`;
    report += `> **Found ${missingScenes.length} activities pointing to missing campaign scenes:**\n`;
    for (const missing of missingScenes) {
      report += `> - ${missing}\n`;
    }
    report += `\n`;
  }

  report += `## Activity Distribution by Location\n`;
  report += `| Location ID | Activity Count |\n`;
  report += `| --- | --- |\n`;
  for (const [loc, count] of Object.entries(locationCounts)) {
    report += `| \`${loc}\` | ${count} |\n`;
  }
  report += `\n`;

  report += `## Activity Distribution by Time Window\n`;
  report += `| Time of Day | Available Activities |\n`;
  report += `| --- | --- |\n`;
  for (const [time, count] of Object.entries(timeCounts)) {
    report += `| \`${time}\` | ${count} |\n`;
  }
  report += `\n`;

  report += `## NPC Activity Connections\n`;
  report += `| NPC ID | Activity Appearances | Scheduled Locations (Mane / Meridies / Vesper / Nox) |\n`;
  report += `| --- | --- | --- |\n`;
  for (const [npc, schedule] of Object.entries(npcPresence)) {
    const count = npcCounts[npc] || 0;
    const schedText = `${schedule.mane} / ${schedule.meridies} / ${schedule.vesper} / ${schedule.nox}`;
    report += `| \`${npc}\` | ${count} | ${schedText} |\n`;
  }
  report += `\n`;

  report += `## Career Path Weight (Affinities)\n`;
  report += `| Career Path (Fatum) | Combined Reward Value |\n`;
  report += `| --- | --- |\n`;
  for (const [pathKey, val] of Object.entries(pathCounts)) {
    report += `| **${pathKey.toUpperCase()}** | +${val} |\n`;
  }
  report += `\n`;

  report += `## Ambient Events List\n`;
  report += `| ID | Location | Time Windows | Once? | Condition Count |\n`;
  report += `| --- | --- | --- | --- | --- |\n`;
  for (const event of ambientEvents) {
    const loc = event.locationId || "Any";
    const tw = event.timeWindows ? event.timeWindows.join(", ") : "Any";
    const condCount = event.conditions ? event.conditions.length : 0;
    report += `| \`${event.id}\` | \`${loc}\` | ${tw} | ${event.once ? "Yes" : "No"} | ${condCount} |\n`;
  }

  fs.writeFileSync(reportPath, report, "utf8");
  console.log(`Coverage report generated successfully at ${reportPath}`);
  
  if (missingScenes.length > 0) {
    process.exit(1);
  }
}

checkCoverage();
