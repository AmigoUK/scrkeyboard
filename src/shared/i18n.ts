export function translate(messageName: string, substitutions?: string | string[]): string {
  if (typeof chrome === 'undefined' || !chrome.i18n) {
    return messageName;
  }

  return chrome.i18n.getMessage(messageName, substitutions) || messageName;
}
