import { createDefaultSettings, SETTINGS_SCHEMA_VERSION } from './settingsDefaults';
import type {
  BlockRule,
  ConfirmKeyMode,
  LocaleCode,
  Phrase,
  ScrkeyboardSettings,
  UrlRule
} from './settingsTypes';
import { normaliseButtonColour } from './phraseColours';
import { normalisePattern } from './urlPattern';

const supportedLanguages = new Set<LocaleCode>(['en', 'pl']);
const supportedConfirmKeyModes = new Set<ConfirmKeyMode>(['enter', 'ctrlEnter']);

export function normaliseSettings(input: unknown): ScrkeyboardSettings {
  const defaults = createDefaultSettings();

  if (!isRecord(input)) {
    return defaults;
  }

  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    enabled: readBoolean(input.enabled, defaults.enabled),
    language: readLanguage(input.language, defaults.language),
    confirmKeyMode: readConfirmKeyMode(input.confirmKeyMode, defaults.confirmKeyMode),
    globalPhrases: readPhrases(input.globalPhrases, defaults.globalPhrases, 'global'),
    whitelist: readUrlRules(input.whitelist),
    blacklist: readBlockRules(input.blacklist)
  };
}

function readUrlRules(input: unknown): UrlRule[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item, index) => readUrlRule(item, index))
    .filter((rule): rule is UrlRule => rule !== null);
}

function readBlockRules(input: unknown): BlockRule[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item, index) => readBlockRule(item, index))
    .filter((rule): rule is BlockRule => rule !== null);
}

function readUrlRule(input: unknown, index: number): UrlRule | null {
  if (!isRecord(input)) {
    return null;
  }

  const pattern = readPattern(input.pattern);

  if (!pattern) {
    return null;
  }

  return {
    id: readString(input.id, `whitelist-${index + 1}`),
    pattern,
    enabled: readBoolean(input.enabled, true),
    allowPasswordFields: readBoolean(input.allowPasswordFields, false),
    phrases: readPhrases(input.phrases, [], `whitelist-${index + 1}`)
  };
}

function readBlockRule(input: unknown, index: number): BlockRule | null {
  if (!isRecord(input)) {
    return null;
  }

  const pattern = readPattern(input.pattern);

  if (!pattern) {
    return null;
  }

  return {
    id: readString(input.id, `blacklist-${index + 1}`),
    pattern,
    enabled: readBoolean(input.enabled, true)
  };
}

function readPhrases(input: unknown, fallback: Phrase[], prefix: string): Phrase[] {
  if (!Array.isArray(input)) {
    return structuredClone(fallback);
  }

  return input
    .map((item, index) => readPhrase(item, index, prefix))
    .filter((phrase): phrase is Phrase => phrase !== null);
}

function readPhrase(input: unknown, index: number, prefix: string): Phrase | null {
  if (!isRecord(input)) {
    return null;
  }

  const label = readString(input.label, '').trim();
  const value = readString(input.value, '').trim();

  if (!label || !value) {
    return null;
  }

  return {
    id: readString(input.id, `${prefix}-phrase-${index + 1}`),
    label,
    value,
    buttonColour: normaliseButtonColour(input.buttonColour),
    enabled: readBoolean(input.enabled, true)
  };
}

function readPattern(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }

  return normalisePattern(input);
}

function readLanguage(input: unknown, fallback: LocaleCode): LocaleCode {
  return typeof input === 'string' && supportedLanguages.has(input as LocaleCode)
    ? (input as LocaleCode)
    : fallback;
}

function readConfirmKeyMode(input: unknown, fallback: ConfirmKeyMode): ConfirmKeyMode {
  return typeof input === 'string' && supportedConfirmKeyModes.has(input as ConfirmKeyMode)
    ? (input as ConfirmKeyMode)
    : fallback;
}

function readBoolean(input: unknown, fallback: boolean): boolean {
  return typeof input === 'boolean' ? input : fallback;
}

function readString(input: unknown, fallback: string): string {
  return typeof input === 'string' && input.trim() ? input.trim() : fallback;
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}
