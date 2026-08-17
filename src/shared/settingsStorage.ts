import { createDefaultSettings } from './settingsDefaults';
import type { ScrkeyboardSettings } from './settingsTypes';
import { normaliseSettings } from './settingsValidation';

export const SETTINGS_STORAGE_KEY = 'scrkeyboard.settings.v1';

export async function loadSettings(): Promise<ScrkeyboardSettings> {
  const storage = getSyncStorage();
  const stored = await storage.get(SETTINGS_STORAGE_KEY);

  return normaliseSettings(stored[SETTINGS_STORAGE_KEY]);
}

export async function saveSettings(settings: ScrkeyboardSettings): Promise<ScrkeyboardSettings> {
  const normalisedSettings = normaliseSettings(settings);
  await getSyncStorage().set({
    [SETTINGS_STORAGE_KEY]: normalisedSettings
  });

  return normalisedSettings;
}

export async function initialiseSettings(): Promise<ScrkeyboardSettings> {
  const storage = getSyncStorage();
  const stored = await storage.get(SETTINGS_STORAGE_KEY);
  const existingSettings = stored[SETTINGS_STORAGE_KEY];

  if (existingSettings) {
    return normaliseSettings(existingSettings);
  }

  const defaults = createDefaultSettings();
  await saveSettings(defaults);

  return defaults;
}

function getSyncStorage(): chrome.storage.StorageArea {
  if (typeof chrome === 'undefined' || !chrome.storage?.sync) {
    throw new Error('chrome.storage.sync is not available.');
  }

  return chrome.storage.sync;
}

