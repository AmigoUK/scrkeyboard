import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getContentScriptMatchPatterns,
  shouldSyncContentScriptsForStorageChange,
  syncKeyboardContentScriptRegistration
} from './contentScriptRegistration';
import { SETTINGS_STORAGE_KEY } from '../shared/settingsStorage';

describe('contentScriptRegistration', () => {
  beforeEach(() => {
    vi.stubGlobal('chrome', {
      permissions: {
        contains: vi.fn(async () => true)
      },
      scripting: {
        registerContentScripts: vi.fn(async () => undefined),
        unregisterContentScripts: vi.fn(async () => undefined)
      },
      storage: {
        sync: {
          get: vi.fn(async (key: string) => ({
            [key]: {
              schemaVersion: 1,
              enabled: true,
              language: 'en',
              confirmKeyMode: 'enter',
              globalPhrases: [],
              whitelist: [
                {
                  id: 'crm',
                  pattern: 'https://crm.example.com/orders/*',
                  enabled: true,
                  allowPasswordFields: false,
                  phrases: []
                }
              ],
              blacklist: []
            }
          }))
        }
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates origin match patterns from explicit URL rules', () => {
    expect(getContentScriptMatchPatterns('https://crm.example.com/orders/*')).toEqual([
      'https://crm.example.com/*'
    ]);
  });

  it('supports scheme wildcards by expanding to HTTP and HTTPS', () => {
    expect(getContentScriptMatchPatterns('*://*.example.com/orders/*')).toEqual([
      'http://*.example.com/*',
      'https://*.example.com/*'
    ]);
  });

  it('ignores URL fragments that cannot be converted to host permissions', () => {
    expect(getContentScriptMatchPatterns('crm.example.com/orders/*')).toEqual([]);
  });

  it('detects relevant storage changes', () => {
    expect(
      shouldSyncContentScriptsForStorageChange(
        {
          [SETTINGS_STORAGE_KEY]: {
            oldValue: null,
            newValue: {}
          }
        },
        'sync'
      )
    ).toBe(true);
  });

  it('registers the keyboard content script in all permitted frames', async () => {
    await syncKeyboardContentScriptRegistration();

    expect(chrome.scripting.registerContentScripts).toHaveBeenCalledWith([
      expect.objectContaining({
        allFrames: true,
        js: ['assets/content.js'],
        matches: ['https://crm.example.com/*']
      })
    ]);
  });
});
