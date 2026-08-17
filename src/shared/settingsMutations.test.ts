import { describe, expect, it } from 'vitest';
import { createDefaultSettings } from './settingsDefaults';
import { setExtensionEnabled, upsertWhitelistRule } from './settingsMutations';

describe('settingsMutations', () => {
  it('updates global extension enablement', () => {
    const settings = createDefaultSettings();

    expect(setExtensionEnabled(settings, false).enabled).toBe(false);
  });

  it('adds a new whitelist rule', () => {
    const settings = createDefaultSettings();
    const result = upsertWhitelistRule(settings, {
      id: 'crm',
      pattern: 'https://crm.example.com/*',
      enabled: true,
      allowPasswordFields: false,
      phrases: []
    });

    expect(result.created).toBe(true);
    expect(result.settings.whitelist).toHaveLength(1);
  });

  it('re-enables an existing whitelist rule instead of duplicating it', () => {
    const settings = {
      ...createDefaultSettings(),
      whitelist: [
        {
          id: 'crm',
          pattern: 'https://crm.example.com/*',
          enabled: false,
          allowPasswordFields: true,
          phrases: []
        }
      ]
    };
    const result = upsertWhitelistRule(settings, {
      id: 'crm-new',
      pattern: 'https://crm.example.com/*',
      enabled: true,
      allowPasswordFields: false,
      phrases: []
    });

    expect(result.created).toBe(false);
    expect(result.settings.whitelist).toHaveLength(1);
    expect(result.rule.id).toBe('crm');
    expect(result.rule.enabled).toBe(true);
    expect(result.rule.allowPasswordFields).toBe(true);
  });
});

