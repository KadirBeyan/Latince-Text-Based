import { useState } from "react";
import { testLlmConfig } from "../../api/llmApi";
import { useSettingsStore, type LlmSettings } from "../../stores/settingsStore";
import { pickDirectory } from "../../api/tauriApi";

const providers: LlmSettings["provider"][] = ["ollama", "lmstudio", "openai", "custom"];

export function LlmSettingsPanel({ compact = false }: { compact?: boolean }) {
  const {
    settings, updateSettings, resetSettings, exportSettings, importSettings, getLlmConfigOrUndefined,
    discoveredModels, discoveryErrors, discoveryLoading, discoveryAttempted, refreshModels,
  } = useSettingsStore();
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [settingsText, setSettingsText] = useState("");
  const localProvider = settings.provider === "ollama" || settings.provider === "lmstudio";
  const providerModels = localProvider ? discoveredModels.filter((model) => model.provider === settings.provider) : [];
  const selectedModelMissing = localProvider && discoveryAttempted && Boolean(settings.model) && !providerModels.some((model) => model.name === settings.model);

  function updateLmStudioPath(index: number, value: string) {
    const next = [...settings.lmStudioModelsPaths];
    next[index] = value;
    updateSettings({ lmStudioModelsPaths: next });
  }

  async function chooseOllamaPath() {
    const directory = await pickDirectory();
    if (directory) updateSettings({ ollamaModelsPath: directory });
  }

  async function chooseLmStudioPath(index: number) {
    const directory = await pickDirectory();
    if (directory) updateLmStudioPath(index, directory);
  }

  async function runTest() {
    const config = getLlmConfigOrUndefined();
    if (!config) {
      setTestResult({ ok: false, message: "LLM kapalı. Test için önce etkinleştir." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      setTestResult(await testLlmConfig(config));
    } finally {
      setTesting(false);
    }
  }

  return (
    <section className={compact ? "llm-settings compact-settings" : "panel-card llm-settings"}>
      {!compact ? (
        <div className="panel-heading compact-heading">
          <p className="eyebrow">LLM / Optiones</p>
          <h3>Assistens intellegens</h3>
        </div>
      ) : null}
      <label className="checkbox-row">
        <input type="checkbox" checked={settings.useLlm} onChange={(event) => updateSettings({ useLlm: event.target.checked })} />
        LLM kullan
      </label>
      {!settings.useLlm ? <p className="empty-state">LLM kapalı. Oyun deterministic engine ile çalışıyor.</p> : null}
      <label>
        Provider
        <select value={settings.provider} onChange={(event) => updateSettings({ provider: event.target.value as LlmSettings["provider"] })}>
          {providers.map((provider) => <option value={provider} key={provider}>{provider}</option>)}
        </select>
      </label>
      <label>
        Base URL
        <input value={settings.baseUrl} onChange={(event) => updateSettings({ baseUrl: event.target.value })} />
      </label>
      <label>
        Model
        {localProvider ? (
          <select value={settings.model} onChange={(event) => updateSettings({ model: event.target.value })}>
            <option value="">Model seç</option>
            {selectedModelMissing ? <option value={settings.model}>{settings.model} (bulunamadı)</option> : null}
            {providerModels.map((model) => <option value={model.name} key={model.id}>{model.name}</option>)}
          </select>
        ) : (
          <input value={settings.model} onChange={(event) => updateSettings({ model: event.target.value })} />
        )}
      </label>
      {selectedModelMissing ? <p className="test-result danger">Seçili model artık bulunamıyor; ayar korunuyor.</p> : null}
      {localProvider && discoveryAttempted && providerModels.length === 0 ? (
        <p className="test-result danger">Model bulunamadı. Ollama/LM Studio çalışıyor mu veya model path doğru mu?</p>
      ) : null}
      <label className="checkbox-row">
        <input type="checkbox" checked={settings.autoDiscoverModels} onChange={(event) => updateSettings({ autoDiscoverModels: event.target.checked })} />
        Uygulama açılırken modelleri otomatik tara
      </label>
      <label>
        Ollama model path
        <input value={settings.ollamaModelsPath} onChange={(event) => updateSettings({ ollamaModelsPath: event.target.value })} />
      </label>
      <div className="settings-actions"><button type="button" onClick={() => void chooseOllamaPath()}>Klasör Seç</button></div>
      {settings.lmStudioModelsPaths.map((modelsPath, index) => (
        <div key={index}>
          <label>
            LM Studio model path {index + 1}
            <input value={modelsPath} onChange={(event) => updateLmStudioPath(index, event.target.value)} />
          </label>
          <div className="settings-actions"><button type="button" onClick={() => void chooseLmStudioPath(index)}>Klasör Seç</button></div>
        </div>
      ))}
      <label>
        API key
        <input type="password" value={settings.apiKey} onChange={(event) => updateSettings({ apiKey: event.target.value })} />
      </label>
      <label>
        Temperature
        <input type="number" min="0" max="2" step="0.1" value={settings.temperature} onChange={(event) => updateSettings({ temperature: Number(event.target.value) })} />
      </label>
      <label>
        Timeout ms
        <input type="number" min="1000" step="1000" value={settings.timeoutMs} onChange={(event) => updateSettings({ timeoutMs: Number(event.target.value) })} />
      </label>
      <div className="settings-actions">
        <button type="button" onClick={() => void refreshModels()} disabled={discoveryLoading}>{discoveryLoading ? "Taranıyor..." : "Modelleri Tara"}</button>
        <button type="button" onClick={() => void runTest()} disabled={testing}>{testing ? "Test ediliyor..." : "Bağlantıyı Test Et"}</button>
        <button type="button" onClick={resetSettings}>Varsayılana Dön</button>
      </div>
      <label>
        Ayar import / export
        <textarea value={settingsText} onChange={(event) => setSettingsText(event.target.value)} rows={5} placeholder="settings.json içeriği" />
      </label>
      <div className="settings-actions">
        <button type="button" onClick={() => setSettingsText(exportSettings())}>Ayarları dışa aktar</button>
        <button type="button" onClick={() => void importSettings(settingsText)}>Ayarları içe aktar</button>
      </div>
      {testResult ? <p className={testResult.ok ? "test-result success" : "test-result danger"}>{testResult.message}</p> : null}
      {discoveryErrors.length > 0 ? (
        <details className="discovery-errors">
          <summary>Tarama ayrıntıları ({discoveryErrors.length})</summary>
          {discoveryErrors.map((error, index) => <p className="test-result danger" key={`${error.provider}-${index}`}>{error.message}</p>)}
        </details>
      ) : null}
    </section>
  );
}
