import type { PlayerSave } from "../types/gameTypes";

export class SceneProgressionService {
  markVisited(save: PlayerSave, sceneId: string): PlayerSave {
    if (save.visitedSceneIds.includes(sceneId)) return save;
    return { ...save, visitedSceneIds: [...save.visitedSceneIds, sceneId] };
  }

  markCompleted(save: PlayerSave, sceneId: string): PlayerSave {
    if (save.completedSceneIds.includes(sceneId)) return save;
    return { ...save, completedSceneIds: [...save.completedSceneIds, sceneId] };
  }
}
