import { describe, expect, it } from 'vitest';
import { getContentScriptMatchPatterns } from './hostPermissions';

describe('getContentScriptMatchPatterns', () => {
  it('creates a Chrome match pattern from an explicit HTTPS rule', () => {
    expect(getContentScriptMatchPatterns('https://crm.example.com/orders/*')).toEqual([
      'https://crm.example.com/*'
    ]);
  });

  it('expands scheme wildcard rules to HTTP and HTTPS', () => {
    expect(getContentScriptMatchPatterns('*://*.example.com/app/*')).toEqual([
      'http://*.example.com/*',
      'https://*.example.com/*'
    ]);
  });

  it('does not create host permissions from fragment rules', () => {
    expect(getContentScriptMatchPatterns('crm.example.com/orders/*')).toEqual([]);
  });
});
