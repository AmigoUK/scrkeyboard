import './popup.css';
import { translate } from '../shared/i18n';
import { loadSettings, saveSettings } from '../shared/settingsStorage';
import { setExtensionEnabled, upsertWhitelistRule } from '../shared/settingsMutations';
import type { ScrkeyboardSettings } from '../shared/settingsTypes';
import {
  createWhitelistRuleForPage,
  getDisplayHost,
  getOriginPermissionPattern
} from '../shared/siteAccess';

document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
  const messageName = element.dataset.i18n;

  if (messageName) {
    element.textContent = translate(messageName);
  }
});

const enabledToggle = document.querySelector<HTMLInputElement>('#enabled-toggle');
const enabledLabel = document.querySelector<HTMLElement>('#enabled-label');
const currentSiteElement = document.querySelector<HTMLElement>('#current-site');
const statusMessage = document.querySelector<HTMLElement>('#status-message');
const addCurrentSiteButton = document.querySelector<HTMLButtonElement>('#add-current-site');

let settings: ScrkeyboardSettings | null = null;
let currentTabUrl: string | null = null;

document.querySelector<HTMLButtonElement>('#open-options')?.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

enabledToggle?.addEventListener('change', async () => {
  if (!settings || !enabledToggle) {
    return;
  }

  try {
    settings = await saveSettings(setExtensionEnabled(settings, enabledToggle.checked));
    renderEnabledState(settings.enabled);
    setStatus('settingsSaved');
  } catch (error) {
    console.error('Failed to save popup settings.', error);
    setStatus('popupError');
  }
});

addCurrentSiteButton?.addEventListener('click', async () => {
  if (!settings || !currentTabUrl) {
    return;
  }

  const permissionPattern = getOriginPermissionPattern(currentTabUrl);
  const whitelistRule = createWhitelistRuleForPage(currentTabUrl);
  const displayHost = getDisplayHost(currentTabUrl);

  if (!permissionPattern || !whitelistRule || !displayHost) {
    setStatus('unsupportedPage');
    return;
  }

  addCurrentSiteButton.disabled = true;

  try {
    const hasPermission = await chrome.permissions.contains({
      origins: [permissionPattern]
    });
    const permissionGranted =
      hasPermission ||
      (await chrome.permissions.request({
        origins: [permissionPattern]
      }));

    if (!permissionGranted) {
      setStatus('permissionDenied');
      return;
    }

    const result = upsertWhitelistRule(settings, whitelistRule);
    settings = await saveSettings(result.settings);
    setStatus(result.created ? 'siteApproved' : 'siteAlreadyApproved', displayHost);
  } catch (error) {
    console.error('Failed to add the current site.', error);
    setStatus('popupError');
  } finally {
    addCurrentSiteButton.disabled = false;
  }
});

void initialisePopup();

async function initialisePopup(): Promise<void> {
  try {
    const [loadedSettings, activeTab] = await Promise.all([loadSettings(), getActiveTab()]);
    settings = loadedSettings;
    currentTabUrl = activeTab?.url ?? null;

    renderEnabledState(settings.enabled);
    renderCurrentSite(currentTabUrl);
  } catch (error) {
    console.error('Failed to initialise popup.', error);
    setStatus('popupError');
    setAddCurrentSiteEnabled(false);
  }
}

async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  return tab ?? null;
}

function renderEnabledState(enabled: boolean): void {
  if (enabledToggle) {
    enabledToggle.checked = enabled;
  }

  if (enabledLabel) {
    enabledLabel.textContent = translate(enabled ? 'enabled' : 'disabled');
  }
}

function renderCurrentSite(pageUrl: string | null): void {
  const displayHost = pageUrl ? getDisplayHost(pageUrl) : null;

  if (currentSiteElement) {
    currentSiteElement.textContent = displayHost ?? '-';
    currentSiteElement.title = displayHost ?? '';
  }

  if (!displayHost) {
    setStatus('unsupportedPage');
    setAddCurrentSiteEnabled(false);
    return;
  }

  setStatus('popupStatus');
  setAddCurrentSiteEnabled(true);
}

function setStatus(messageName: string, substitutions?: string | string[]): void {
  if (statusMessage) {
    statusMessage.textContent = translate(messageName, substitutions);
  }
}

function setAddCurrentSiteEnabled(enabled: boolean): void {
  if (addCurrentSiteButton) {
    addCurrentSiteButton.disabled = !enabled;
  }
}
