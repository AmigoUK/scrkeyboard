import type { ScrkeyboardSettings } from './settingsTypes';
import { DEFAULT_PHRASE_BUTTON_COLOUR } from './phraseColours';

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
      buttonColour: DEFAULT_PHRASE_BUTTON_COLOUR,
      enabled: true
    },
    {
      id: 'global-done',
      label: 'Done',
      value: 'Done',
      buttonColour: DEFAULT_PHRASE_BUTTON_COLOUR,
      enabled: true
    }
  ],
  whitelist: [],
  blacklist: []
};

export function createDefaultSettings(): ScrkeyboardSettings {
  return structuredClone(DEFAULT_SETTINGS);
}
