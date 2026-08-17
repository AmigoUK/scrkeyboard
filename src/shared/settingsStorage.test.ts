import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initialiseSettings,
  loadSettings,
  saveSettings,
  SETTINGS_STORAGE_KEY
} from './settingsStorage';
import { createDefaultSettings } from './settingsDefaults';

describe('settingsStorage', () => {
  let store: Record<string, unknown>;

  beforeEach(() => {
    store = {};

    vi.stubGlobal('chrome', {
      storage: {
        sync: {
          get: vi.fn(async (key: string) => ({
            [key]: store[key]
          })),
          set: vi.fn(async (items: Record<string, unknown>) => {
            store = {
              ...store,
              ...items
            };
          })
        }
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('initialises default settings when storage is empty', async () => {
    const settings = await initialiseSettings();

    expect(settings).toEqual(createDefaultSettings());
    expect(store[SETTINGS_STORAGE_KEY]).toEqual(createDefaultSettings());
  });

  it('saves and loads normalised settings', async () => {
    const defaults = createDefaultSettings();
    const savedSettings = await saveSettings({
      ...defaults,
      language: 'pl',
      confirmKeyMode: 'ctrlEnter'
    });
    const loadedSettings = await loadSettings();

    expect(savedSettings.language).toBe('pl');
    expect(loadedSettings.language).toBe('pl');
    expect(loadedSettings.confirmKeyMode).toBe('ctrlEnter');
  });
});

