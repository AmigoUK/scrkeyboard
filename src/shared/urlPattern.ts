import type { BlockRule, Phrase, ScrkeyboardSettings, UrlRule, UrlRuleEvaluation } from './settingsTypes';

const supportedProtocols = new Set(['http:', 'https:']);

export function normalisePattern(pattern: string): string {
  return pattern.trim();
}

export function isSupportedPageUrl(url: string): boolean {
  try {
    return supportedProtocols.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

export function doesUrlMatchPattern(url: string, pattern: string): boolean {
  const normalisedPattern = normalisePattern(pattern);

  if (!normalisedPattern || !isSupportedPageUrl(url)) {
    return false;
  }

  const expression = wildcardPatternToRegExp(normalisedPattern);
  return expression.test(url);
}

export function wildcardPatternToRegExp(pattern: string): RegExp {
  const hasExplicitScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(pattern) || pattern.startsWith('*://');
  const escapedPattern = escapeRegExp(pattern).replaceAll('\\*', '.*');
  const source = hasExplicitScheme ? `^${escapedPattern}$` : escapedPattern;

  return new RegExp(source, 'i');
}

export function evaluateUrlRules(settings: ScrkeyboardSettings, url: string): UrlRuleEvaluation {
  const disabledEvaluation = createInactiveEvaluation();

  if (!settings.enabled || !isSupportedPageUrl(url)) {
    return disabledEvaluation;
  }

  const matchedBlacklistRule = settings.blacklist.find((rule) => matchesBlockRule(rule, url)) ?? null;

  if (matchedBlacklistRule) {
    return {
      ...disabledEvaluation,
      blocked: true,
      matchedBlacklistRule
    };
  }

  const matchedWhitelistRule = settings.whitelist.find((rule) => matchesUrlRule(rule, url)) ?? null;

  if (!matchedWhitelistRule) {
    return disabledEvaluation;
  }

  return {
    active: true,
    blocked: false,
    allowPasswordFields: matchedWhitelistRule.allowPasswordFields,
    phrases: collectEnabledPhrases(settings.globalPhrases, matchedWhitelistRule.phrases),
    matchedWhitelistRule,
    matchedBlacklistRule: null
  };
}

function matchesUrlRule(rule: UrlRule, url: string): boolean {
  return rule.enabled && doesUrlMatchPattern(url, rule.pattern);
}

function matchesBlockRule(rule: BlockRule, url: string): boolean {
  return rule.enabled && doesUrlMatchPattern(url, rule.pattern);
}

function collectEnabledPhrases(globalPhrases: Phrase[], rulePhrases: Phrase[]): Phrase[] {
  return [...globalPhrases, ...rulePhrases].filter((phrase) => phrase.enabled);
}

function createInactiveEvaluation(): UrlRuleEvaluation {
  return {
    active: false,
    blocked: false,
    allowPasswordFields: false,
    phrases: [],
    matchedWhitelistRule: null,
    matchedBlacklistRule: null
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

