import { initialiseSettings } from '../shared/settingsStorage';
import {
  shouldSyncContentScriptsForStorageChange,
  syncAndInjectKeyboardContentScriptIntoOpenTabs,
  syncKeyboardContentScriptRegistration
} from './contentScriptRegistration';
import { isSyncContentScriptsMessage } from '../shared/runtimeMessages';

chrome.runtime.onInstalled.addListener(() => {
  void initialiseSettings()
    .then(() => syncKeyboardContentScriptRegistration())
    .catch((error: unknown) => {
      console.error('Failed to initialise ScrKeyboard settings.', error);
    });
});

chrome.runtime.onStartup.addListener(() => {
  void syncKeyboardContentScriptRegistration().catch((error: unknown) => {
    console.error('Failed to sync ScrKeyboard content script registration.', error);
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (!shouldSyncContentScriptsForStorageChange(changes, areaName)) {
    return;
  }

  void syncKeyboardContentScriptRegistration().catch((error: unknown) => {
    console.error('Failed to sync ScrKeyboard content scripts after settings change.', error);
  });
});

chrome.permissions.onAdded.addListener(() => {
  void syncAndInjectKeyboardContentScriptIntoOpenTabs().catch((error: unknown) => {
    console.error('Failed to activate ScrKeyboard after a new site permission was granted.', error);
  });
});

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  if (!isSyncContentScriptsMessage(message)) {
    return false;
  }

  void syncKeyboardContentScriptRegistration()
    .then(() => sendResponse({ ok: true }))
    .catch((error: unknown) => {
      console.error('Failed to sync ScrKeyboard content scripts on request.', error);
      sendResponse({ ok: false });
    });

  return true;
});

export {};
