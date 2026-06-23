import { requestJson } from "./gameApi";

export async function getDebugSave(saveId: string): Promise<any> {
  return requestJson<any>(`/api/debug/save/${encodeURIComponent(saveId)}`);
}

export async function debugSetScene(saveId: string, sceneId: string): Promise<any> {
  return requestJson<any>(`/api/debug/save/${encodeURIComponent(saveId)}/set-scene`, {
    method: "POST",
    body: JSON.stringify({ sceneId }),
  });
}

export async function debugAddXp(saveId: string, amount: number): Promise<any> {
  return requestJson<any>(`/api/debug/save/${encodeURIComponent(saveId)}/add-xp`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function debugAddCurrency(saveId: string, amount: number): Promise<any> {
  return requestJson<any>(`/api/debug/save/${encodeURIComponent(saveId)}/add-currency`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function debugSetFlag(saveId: string, key: string, value: boolean | string | number): Promise<any> {
  return requestJson<any>(`/api/debug/save/${encodeURIComponent(saveId)}/set-flag`, {
    method: "POST",
    body: JSON.stringify({ key, value }),
  });
}

export async function debugCompleteQuest(saveId: string, questId: string): Promise<any> {
  return requestJson<any>(`/api/debug/save/${encodeURIComponent(saveId)}/complete-quest`, {
    method: "POST",
    body: JSON.stringify({ questId }),
  });
}
