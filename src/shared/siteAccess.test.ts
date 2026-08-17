import { describe, expect, it } from 'vitest';
import {
  createWhitelistRuleForPage,
  getDisplayHost,
  getOriginPermissionPattern
} from './siteAccess';

describe('siteAccess', () => {
  it('creates an origin-scoped optional host permission pattern', () => {
    expect(getOriginPermissionPattern('https://crm.example.com/orders/123')).toBe(
      'https://crm.example.com/*'
    );
  });

  it('preserves ports in permission patterns', () => {
    expect(getOriginPermissionPattern('http://localhost:5173/test')).toBe('http://localhost:5173/*');
  });

  it('rejects unsupported URLs', () => {
    expect(getOriginPermissionPattern('chrome://extensions')).toBeNull();
    expect(getDisplayHost('file:///tmp/form.html')).toBeNull();
  });

  it('creates a disabled-password whitelist rule for the current page', () => {
    expect(createWhitelistRuleForPage('https://crm.example.com/orders/123', 'site-test')).toEqual({
      id: 'site-test',
      pattern: 'https://crm.example.com/*',
      enabled: true,
      allowPasswordFields: false,
      phrases: []
    });
  });
});

