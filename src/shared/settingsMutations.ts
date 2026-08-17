import type { ScrKeyboardSettings, UrlRule } from './settingsTypes';

export interface UpsertWhitelistRuleResult {
  settings: ScrKeyboardSettings;
  rule: UrlRule;
  created: boolean;
}

export function setExtensionEnabled(
  settings: ScrKeyboardSettings,
  enabled: boolean
): ScrKeyboardSettings {
  return {
    ...settings,
    enabled
  };
}

export function upsertWhitelistRule(
  settings: ScrKeyboardSettings,
  rule: UrlRule
): UpsertWhitelistRuleResult {
  const existingIndex = settings.whitelist.findIndex(
    (existingRule) => existingRule.pattern.toLowerCase() === rule.pattern.toLowerCase()
  );

  if (existingIndex === -1) {
    const nextSettings = {
      ...settings,
      whitelist: [...settings.whitelist, rule]
    };

    return {
      settings: nextSettings,
      rule,
      created: true
    };
  }

  const existingRule = settings.whitelist[existingIndex];
  const mergedRule: UrlRule = {
    ...existingRule,
    enabled: true
  };
  const whitelist = [...settings.whitelist];
  whitelist[existingIndex] = mergedRule;

  return {
    settings: {
      ...settings,
      whitelist
    },
    rule: mergedRule,
    created: false
  };
}

