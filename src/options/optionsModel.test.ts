import { describe, expect, it, vi } from 'vitest';
import { createDefaultSettings } from '../shared/settingsDefaults';
import { DEFAULT_PHRASE_BUTTON_COLOUR } from '../shared/phraseColours';
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
      buttonColour: DEFAULT_PHRASE_BUTTON_COLOUR,
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
    expect(completed.buttonColour).toBe(DEFAULT_PHRASE_BUTTON_COLOUR);
    expect(completed.enabled).toBe(true);
  });

  it('normalises phrase colour edits', () => {
    const phrase = createEmptyPhrase('site');
    const updated = mergePhrasePatch(phrase, {
      buttonColour: '#06f'
    });

    expect(updated.buttonColour).toBe('#0066ff');
  });

  it('exports settings and phrases to CSV with escaped values', () => {
    const settings = {
      ...createDefaultSettings(),
      globalPhrases: [
        {
          id: 'global-help',
          label: 'Help',
          value: 'Need "support", please',
          buttonColour: '#276ef1',
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
              buttonColour: '#0f766e',
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
        'type,scope,enabled,pattern,allow_password_fields,label,value,button_colour',
        'global_phrase,global,true,,,Help,"Need ""support"", please",#276ef1',
        'whitelist_rule,crm,true,https://crm.example.com/orders/*,true,,,',
        'site_phrase,crm,false,https://crm.example.com/orders/*,,Done,Done,#0f766e',
        'blacklist_rule,crm-admin,true,https://crm.example.com/admin/*,,,,',
        ''
      ].join('\n')
    );
  });
});
