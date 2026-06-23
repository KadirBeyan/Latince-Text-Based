import { useSettingsStore } from "../../stores/settingsStore";

export function CinematicPreferencesPanel() {
  const { settings, updateSettings } = useSettingsStore();
  return (
    <section className="panel-card compact-settings cinematic-preferences-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Cinematica</p>
        <h3>Sinematik Tercihler</h3>
      </div>
      <label className="checkbox-row">
        <input type="checkbox" checked={settings.cinematicOverlays} onChange={(event) => updateSettings({ cinematicOverlays: event.currentTarget.checked })} />
        <span>Cinematic overlays</span>
      </label>
      <label className="checkbox-row">
        <input type="checkbox" checked={settings.sceneTransitions} onChange={(event) => updateSettings({ sceneTransitions: event.currentTarget.checked })} />
        <span>Scene transitions</span>
      </label>
      <label className="checkbox-row">
        <input type="checkbox" checked={settings.rewardAnimations} onChange={(event) => updateSettings({ rewardAnimations: event.currentTarget.checked })} />
        <span>Reward animations</span>
      </label>
      <label className="checkbox-row">
        <input type="checkbox" checked={settings.narrativeToasts} onChange={(event) => updateSettings({ narrativeToasts: event.currentTarget.checked })} />
        <span>Narrative toasts</span>
      </label>
      <label className="settings-field">
        <span>Reduced motion</span>
        <select value={settings.reducedMotionMode} onChange={(event) => updateSettings({ reducedMotionMode: event.currentTarget.value as "system" | "on" | "off" })}>
          <option value="system">System preference</option>
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </label>
    </section>
  );
}
