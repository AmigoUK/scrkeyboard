import { describe, expect, it } from 'vitest';
import { normaliseSettings } from './settingsValidation';

describe('normaliseSettings', () => {
  it('returns default settings for invalid input', () => {
    const settings = normaliseSettings(null);

    expect(settings.schemaVersion).toBe(1);
    expect(settings.enabled).toBe(true);
    expect(settings.language).toBe('en');
    expect(settings.whitelist).toEqual([]);
    expect(settings.blacklist).toEqual([]);
  });

  it('keeps valid wildcard rules and discards empty entries', () => {
    const settings = normaliseSettings({
      language: 'pl',
      confirmKeyMode: 'ctrlEnter',
      whitelist: [
        {
          id: 'crm',
          pattern: ' https://crm.example.com/orders/* ',
          enabled: true,
          allowPasswordFields: true,
          phrases: [
            {
              id: 'phrase-1',
              label: 'Ready',
              value: 'Ready',
              buttonColour: '#06f',
              enabled: true
            },
            {
              label: '',
              value: 'Ignored'
            }
          ]
        },
        {
          pattern: ''
        }
      ],
      blacklist: [
        {
          pattern: 'https://crm.example.com/admin/*',
          enabled: true
        }
      ]
    });

    expect(settings.language).toBe('pl');
    expect(settings.confirmKeyMode).toBe('ctrlEnter');
    expect(settings.whitelist).toHaveLength(1);
    expect(settings.whitelist[0].pattern).toBe('https://crm.example.com/orders/*');
    expect(settings.whitelist[0].allowPasswordFields).toBe(true);
    expect(settings.whitelist[0].phrases).toHaveLength(1);
    expect(settings.whitelist[0].phrases[0].buttonColour).toBe('#0066ff');
    expect(settings.blacklist).toHaveLength(1);
  });

  it('uses the default phrase colour when a stored colour is invalid', () => {
    const settings = normaliseSettings({
      globalPhrases: [
        {
          label: 'Ready',
          value: 'Ready',
          buttonColour: 'blue'
        }
      ]
    });

    expect(settings.globalPhrases[0].buttonColour).toBe('#ffffff');
  });
});
