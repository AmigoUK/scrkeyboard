import { initialiseSettings } from '../shared/settingsStorage';
import {
  shouldSyncContentScriptsForStorageChange,
  syncKeyboardContentScriptRegistration
} from './contentScriptRegistration';
import { isSyncContentScriptsMessage } from '../shared/runtimeMessages';

chrome.runtime.onInstalled.addListener(() => {
  void initialiseSettings()
    .then(() => syncKeyboardContentScriptRegistration())
    .catch((error: unknown) => {
      console.error('Failed to initialise scrkeyboard settings.', error);
    });
});

chrome.runtime.onStartup.addListener(() => {
  void syncKeyboardContentScriptRegistration().catch((error: unknown) => {
    console.error('Failed to sync scrkeyboard content script registration.', error);
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (!shouldSyncContentScriptsForStorageChange(changes, areaName)) {
    return;
  }

  void syncKeyboardContentScriptRegistration().catch((error: unknown) => {
    console.error('Failed to sync scrkeyboard content scripts after settings change.', error);
  });
});

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  if (!isSyncContentScriptsMessage(message)) {
    return false;
  }

  void syncKeyboardContentScriptRegistration()
    .then(() => sendResponse({ ok: true }))
    .catch((error: unknown) => {
      console.error('Failed to sync scrkeyboard content scripts on request.', error);
      sendResponse({ ok: false });
    });

  return true;
});

export {};
