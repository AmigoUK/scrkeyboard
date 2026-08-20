import { SETTINGS_STORAGE_KEY, loadSettings } from '../shared/settingsStorage';
import type { UrlRule } from '../shared/settingsTypes';
import { getContentScriptMatchPatterns } from '../shared/hostPermissions';
import { evaluateUrlRules } from '../shared/urlPattern';

export { getContentScriptMatchPatterns } from '../shared/hostPermissions';

const KEYBOARD_CONTENT_SCRIPT_ID = 'scrkeyboard-keyboard';
const KEYBOARD_CONTENT_SCRIPT_FILE = 'assets/content.js';

// Several independent events (settings storage changes, popup and options
// requests, granted permissions) can ask for a sync at the same time. The
// unregister/register pair is not atomic, so overlapping syncs would both
// clear the registration and then both register the same ID, which Chrome
// rejects with "Duplicate script ID". Queue the syncs so they never overlap.
let pendingSync: Promise<void> = Promise.resolve();

export function syncKeyboardContentScriptRegistration(): Promise<void> {
  const sync = pendingSync.then(reregisterKeyboardContentScript, reregisterKeyboardContentScript);

  pendingSync = sync.catch(() => undefined);

  return sync;
}

async function reregisterKeyboardContentScript(): Promise<void> {
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

export async function syncAndInjectKeyboardContentScriptIntoOpenTabs(): Promise<void> {
  await syncKeyboardContentScriptRegistration();

  const settings = await loadSettings();

  if (!settings.enabled) {
    return;
  }

  const tabs = await chrome.tabs.query({});

  await Promise.allSettled(
    tabs.map(async (tab) => {
      if (!tab.id || !tab.url || !evaluateUrlRules(settings, tab.url).active) {
        return;
      }

      await chrome.scripting.executeScript({
        files: [KEYBOARD_CONTENT_SCRIPT_FILE],
        target: {
          allFrames: true,
          tabId: tab.id
        }
      });
    })
  );
}

export function shouldSyncContentScriptsForStorageChange(
  changes: Record<string, chrome.storage.StorageChange>,
  areaName: string
): boolean {
  return areaName === 'sync' && SETTINGS_STORAGE_KEY in changes;
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
