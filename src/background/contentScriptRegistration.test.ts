import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getContentScriptMatchPatterns,
  shouldSyncContentScriptsForStorageChange,
  syncAndInjectKeyboardContentScriptIntoOpenTabs,
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
        executeScript: vi.fn(async () => undefined),
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
      },
      tabs: {
        query: vi.fn(async () => [
          {
            id: 123,
            url: 'https://crm.example.com/orders/123'
          },
          {
            id: 456,
            url: 'https://other.example.com/orders/123'
          }
        ])
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

  it('never registers a duplicate script ID when syncs overlap', async () => {
    const registeredIds = new Set<string>();

    chrome.scripting.registerContentScripts = vi.fn(
      async (scripts: chrome.scripting.RegisteredContentScript[]) => {
        for (const script of scripts) {
          if (registeredIds.has(script.id)) {
            throw new Error(`Duplicate script ID '${script.id}'`);
          }

          registeredIds.add(script.id);
        }
      }
    );
    chrome.scripting.unregisterContentScripts = vi.fn(
      async (filter?: chrome.scripting.ContentScriptFilter) => {
        for (const id of filter?.ids ?? []) {
          if (!registeredIds.has(id)) {
            throw new Error(`Nonexistent script ID '${id}'`);
          }

          registeredIds.delete(id);
        }
      }
    ) as unknown as typeof chrome.scripting.unregisterContentScripts;

    await expect(
      Promise.all([
        syncKeyboardContentScriptRegistration(),
        syncKeyboardContentScriptRegistration(),
        syncKeyboardContentScriptRegistration()
      ])
    ).resolves.toEqual([undefined, undefined, undefined]);

    expect([...registeredIds]).toEqual(['scrkeyboard-keyboard']);
  });

  it('injects the keyboard content script into open tabs that match active whitelist rules', async () => {
    await syncAndInjectKeyboardContentScriptIntoOpenTabs();

    expect(chrome.scripting.executeScript).toHaveBeenCalledTimes(1);
    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      files: ['assets/content.js'],
      target: {
        allFrames: true,
        tabId: 123
      }
    });
  });
});
