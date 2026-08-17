import type { UrlRule } from './settingsTypes';
import { isSupportedPageUrl } from './urlPattern';

export function getOriginPermissionPattern(pageUrl: string): string | null {
  if (!isSupportedPageUrl(pageUrl)) {
    return null;
  }

  const url = new URL(pageUrl);
  return `${url.protocol}//${url.host}/*`;
}

export function getDisplayHost(pageUrl: string): string | null {
  if (!isSupportedPageUrl(pageUrl)) {
    return null;
  }

  return new URL(pageUrl).host;
}

export function createWhitelistRuleForPage(pageUrl: string, id = createRuleId('site')): UrlRule | null {
  const pattern = getOriginPermissionPattern(pageUrl);

  if (!pattern) {
    return null;
  }

  return {
    id,
    pattern,
    enabled: true,
    allowPasswordFields: false,
    phrases: []
  };
}

function createRuleId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

