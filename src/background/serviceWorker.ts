import { initialiseSettings } from '../shared/settingsStorage';

chrome.runtime.onInstalled.addListener(() => {
  void initialiseSettings().catch((error: unknown) => {
    console.error('Failed to initialise scrkeyboard settings.', error);
  });
});

export {};
