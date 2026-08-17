import { describe, expect, it, vi } from 'vitest';
import { createDefaultSettings } from '../shared/settingsDefaults';
import {
  createEmptyBlacklistRule,
  createEmptyPhrase,
  createEmptyWhitelistRule,
  createSettingsFromControls,
  mergePhrasePatch,
  settingsToCsv
} from './optionsModel';

describe('optionsModel', () => {
  it('creates empty editable rows with stable defaults', () => {
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-id'
    });

    expect(createEmptyPhrase('global')).toEqual({
      id: 'global-test-id',
      label: '',
      value: '',
      enabled: true
    });
    expect(createEmptyWhitelistRule()).toEqual({
      id: 'whitelist-test-id',
      pattern: '',
      enabled: true,
      allowPasswordFields: false,
      phrases: []
    });
    expect(createEmptyBlacklistRule()).toEqual({
      id: 'blacklist-test-id',
      pattern: '',
      enabled: true
    });

    vi.unstubAllGlobals();
  });

  it('updates general controls without losing configured rules', () => {
    const settings = {
      ...createDefaultSettings(),
      whitelist: [
        {
          id: 'site',
          pattern: 'https://crm.example.com/*',
          enabled: true,
          allowPasswordFields: false,
          phrases: []
        }
      ]
    };

    const updated = createSettingsFromControls(settings, {
      enabled: false,
      language: 'pl',
      confirmKeyMode: 'ctrlEnter'
    });

    expect(updated.enabled).toBe(false);
    expect(updated.language).toBe('pl');
    expect(updated.confirmKeyMode).toBe('ctrlEnter');
    expect(updated.whitelist).toHaveLength(1);
  });

  it('merges phrase edits without losing earlier field changes', () => {
    const phrase = createEmptyPhrase('site');
    const labelled = mergePhrasePatch(phrase, {
      label: 'Loop'
    });
    const completed = mergePhrasePatch(labelled, {
      value: 'LOOP_OK'
    });

    expect(completed.label).toBe('Loop');
    expect(completed.value).toBe('LOOP_OK');
    expect(completed.enabled).toBe(true);
  });

  it('exports settings and phrases to CSV with escaped values', () => {
    const settings = {
      ...createDefaultSettings(),
      globalPhrases: [
        {
          id: 'global-help',
          label: 'Help',
          value: 'Need "support", please',
          enabled: true
        }
      ],
      whitelist: [
        {
          id: 'crm',
          pattern: 'https://crm.example.com/orders/*',
          enabled: true,
          allowPasswordFields: true,
          phrases: [
            {
              id: 'crm-done',
              label: 'Done',
              value: 'Done',
              enabled: false
            }
          ]
        }
      ],
      blacklist: [
        {
          id: 'crm-admin',
          pattern: 'https://crm.example.com/admin/*',
          enabled: true
        }
      ]
    };

    expect(settingsToCsv(settings)).toBe(
      [
        'type,scope,enabled,pattern,allow_password_fields,label,value',
        'global_phrase,global,true,,,Help,"Need ""support"", please"',
        'whitelist_rule,crm,true,https://crm.example.com/orders/*,true,,',
        'site_phrase,crm,false,https://crm.example.com/orders/*,,Done,Done',
        'blacklist_rule,crm-admin,true,https://crm.example.com/admin/*,,,',
        ''
      ].join('\n')
    );
  });
});
