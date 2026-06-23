import fs from "node:fs";
import path from "node:path";
import type { WorldPresenceContent } from "./WorldPresenceTypes";

export class WorldPresenceContentLoader {
  private cached?: WorldPresenceContent;
  constructor(private readonly dataRoot = path.resolve(process.cwd(), "data")) {}
  load(): WorldPresenceContent {
    if (this.cached) return this.cached;
    const root = path.join(this.dataRoot, "campaigns", "vicus_first_days", "world");
    const read = <T>(name: string, fallback: T): T => {
      const file = path.join(root, name);
      return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) as T : fallback;
    };
    this.cached = {
      locations: read("location-presence.json", []), ambientObjects: read("ambient-objects.json", []),
      readableObjects: read("readable-objects.json", []), rumors: read("rumor-pools.json", []),
      npcMoodProfiles: read("npc-mood-rules.json", []), journalTemplates: read("journal-templates.json", []),
      latinDiscoveries: read("latin-discoveries.json", []), worldReactionTemplates: read("world-reaction-templates.json", [])
    };
    return this.cached;
  }
  clearCache(): void { this.cached = undefined; }
}
