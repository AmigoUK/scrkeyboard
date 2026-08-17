import type { ScrkeyboardSettings } from './settingsTypes';

export const SETTINGS_SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS: ScrkeyboardSettings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  enabled: true,
  language: 'en',
  confirmKeyMode: 'enter',
  globalPhrases: [
    {
      id: 'global-ok',
      label: 'OK',
      value: 'OK',
      enabled: true
    },
    {
      id: 'global-done',
      label: 'Done',
      value: 'Done',
      enabled: true
    }
  ],
  whitelist: [],
  blacklist: []
};

export function createDefaultSettings(): ScrkeyboardSettings {
  return structuredClone(DEFAULT_SETTINGS);
}

