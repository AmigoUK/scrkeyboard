import { normalisePattern } from './urlPattern';

export function getContentScriptMatchPatterns(rulePattern: string): string[] {
  const pattern = normalisePattern(rulePattern);
  const match = pattern.match(/^(\*|https?|http):\/\/([^/]+)(?:\/.*)?$/i);

  if (!match) {
    return [];
  }

  const [, scheme, host] = match;

  if (!host || host === '*') {
    return [];
  }

  if (scheme === '*') {
    return [`http://${host}/*`, `https://${host}/*`];
  }

  return [`${scheme.toLowerCase()}://${host}/*`];
}
