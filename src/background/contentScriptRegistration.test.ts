import { describe, expect, it } from 'vitest';
import {
  getContentScriptMatchPatterns,
  shouldSyncContentScriptsForStorageChange
} from './contentScriptRegistration';
import { SETTINGS_STORAGE_KEY } from '../shared/settingsStorage';

describe('contentScriptRegistration', () => {
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
});

