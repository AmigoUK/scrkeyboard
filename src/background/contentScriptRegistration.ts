import { SETTINGS_STORAGE_KEY, loadSettings } from '../shared/settingsStorage';
import type { UrlRule } from '../shared/settingsTypes';
import { normalisePattern } from '../shared/urlPattern';

const KEYBOARD_CONTENT_SCRIPT_ID = 'scrkeyboard-keyboard';
const KEYBOARD_CONTENT_SCRIPT_FILE = 'assets/content.js';

export async function syncKeyboardContentScriptRegistration(): Promise<void> {
  await unregisterKeyboardContentScript();

  const settings = await loadSettings();

  if (!settings.enabled) {
    return;
  }

  const matches = await collectPermittedMatchPatterns(settings.whitelist);

  if (matches.length === 0) {
    return;
  }

  await chrome.scripting.registerContentScripts([
    {
      allFrames: true,
      id: KEYBOARD_CONTENT_SCRIPT_ID,
      js: [KEYBOARD_CONTENT_SCRIPT_FILE],
      matches,
      persistAcrossSessions: true,
      runAt: 'document_idle'
    }
  ]);
}

export function shouldSyncContentScriptsForStorageChange(
  changes: Record<string, chrome.storage.StorageChange>,
  areaName: string
): boolean {
  return areaName === 'sync' && SETTINGS_STORAGE_KEY in changes;
}

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

async function collectPermittedMatchPatterns(rules: UrlRule[]): Promise<string[]> {
  const candidates = [...new Set(rules.filter((rule) => rule.enabled).flatMap((rule) => getContentScriptMatchPatterns(rule.pattern)))];
  const permittedPatterns: string[] = [];

  for (const pattern of candidates) {
    if (
      await chrome.permissions.contains({
        origins: [pattern]
      })
    ) {
      permittedPatterns.push(pattern);
    }
  }

  return permittedPatterns;
}

async function unregisterKeyboardContentScript(): Promise<void> {
  try {
    await chrome.scripting.unregisterContentScripts({
      ids: [KEYBOARD_CONTENT_SCRIPT_ID]
    });
  } catch {
    // Chrome throws when the script is not registered yet.
  }
}
