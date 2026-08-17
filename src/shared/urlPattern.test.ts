import { describe, expect, it } from 'vitest';
import { doesUrlMatchPattern, evaluateUrlRules, isSupportedPageUrl } from './urlPattern';
import { createDefaultSettings } from './settingsDefaults';

describe('urlPattern', () => {
  it('matches full URL wildcard patterns', () => {
    expect(
      doesUrlMatchPattern('https://crm.example.com/orders/123', 'https://crm.example.com/orders/*')
    ).toBe(true);
    expect(
      doesUrlMatchPattern('https://crm.example.com/invoices/123', 'https://crm.example.com/orders/*')
    ).toBe(false);
  });

  it('matches operator-friendly URL fragments without a scheme', () => {
    expect(doesUrlMatchPattern('https://crm.example.com/orders/123', 'crm.example.com/orders/*')).toBe(
      true
    );
  });

  it('rejects unsupported page URLs', () => {
    expect(isSupportedPageUrl('chrome://extensions')).toBe(false);
    expect(isSupportedPageUrl('file:///tmp/example.html')).toBe(false);
  });
});

describe('evaluateUrlRules', () => {
  it('keeps the extension inactive until a whitelist rule matches', () => {
    const settings = createDefaultSettings();

    expect(evaluateUrlRules(settings, 'https://crm.example.com/orders').active).toBe(false);
  });

  it('combines global and per-rule phrases when a whitelist rule matches', () => {
    const settings = {
      ...createDefaultSettings(),
      whitelist: [
        {
          id: 'crm',
          pattern: 'https://crm.example.com/*',
          enabled: true,
          allowPasswordFields: false,
          phrases: [
            {
              id: 'crm-ready',
              label: 'Ready',
              value: 'Ready',
              enabled: true
            }
          ]
        }
      ]
    };

    const evaluation = evaluateUrlRules(settings, 'https://crm.example.com/orders');

    expect(evaluation.active).toBe(true);
    expect(evaluation.phrases.map((phrase) => phrase.label)).toEqual(['OK', 'Done', 'Ready']);
  });

  it('lets blacklist rules override whitelist rules', () => {
    const settings = {
      ...createDefaultSettings(),
      whitelist: [
        {
          id: 'crm',
          pattern: 'https://crm.example.com/*',
          enabled: true,
          allowPasswordFields: false,
          phrases: []
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

    const evaluation = evaluateUrlRules(settings, 'https://crm.example.com/admin/users');

    expect(evaluation.active).toBe(false);
    expect(evaluation.blocked).toBe(true);
    expect(evaluation.matchedBlacklistRule?.id).toBe('crm-admin');
  });
});

