import type { ScrkeyboardSettings, UrlRule } from './settingsTypes';

export interface UpsertWhitelistRuleResult {
  settings: ScrkeyboardSettings;
  rule: UrlRule;
  created: boolean;
}

export function setExtensionEnabled(
  settings: ScrkeyboardSettings,
  enabled: boolean
): ScrkeyboardSettings {
  return {
    ...settings,
    enabled
  };
}

export function upsertWhitelistRule(
  settings: ScrkeyboardSettings,
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

