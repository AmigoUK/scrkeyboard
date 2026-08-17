import { SETTINGS_SCHEMA_VERSION } from '../shared/settingsDefaults';
import { DEFAULT_PHRASE_BUTTON_COLOUR, normaliseButtonColour } from '../shared/phraseColours';
import type {
  BlockRule,
  ConfirmKeyMode,
  LocaleCode,
  Phrase,
  ScrkeyboardSettings,
  UrlRule
} from '../shared/settingsTypes';

export function mergePhrasePatch(phrase: Phrase, patch: Partial<Phrase>): Phrase {
  return {
    ...phrase,
    ...patch,
    buttonColour: normaliseButtonColour(patch.buttonColour ?? phrase.buttonColour)
  };
}

export function createEmptyPhrase(prefix = 'phrase'): Phrase {
  return {
    id: createEntityId(prefix),
    label: '',
    value: '',
    buttonColour: DEFAULT_PHRASE_BUTTON_COLOUR,
    enabled: true
  };
}

export function createEmptyWhitelistRule(): UrlRule {
  return {
    id: createEntityId('whitelist'),
    pattern: '',
    enabled: true,
    allowPasswordFields: false,
    phrases: []
  };
}

export function createEmptyBlacklistRule(): BlockRule {
  return {
    id: createEntityId('blacklist'),
    pattern: '',
    enabled: true
  };
}

export function cloneSettings(settings: ScrkeyboardSettings): ScrkeyboardSettings {
  return structuredClone(settings);
}

export function createSettingsFromControls(
  settings: ScrkeyboardSettings,
  controls: {
    enabled: boolean;
    language: LocaleCode;
    confirmKeyMode: ConfirmKeyMode;
  }
): ScrkeyboardSettings {
  return {
    ...settings,
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    enabled: controls.enabled,
    language: controls.language,
    confirmKeyMode: controls.confirmKeyMode
  };
}

export function settingsToCsv(settings: ScrkeyboardSettings): string {
  const rows = [
    ['type', 'scope', 'enabled', 'pattern', 'allow_password_fields', 'label', 'value', 'button_colour'],
    ...settings.globalPhrases.map((phrase) =>
      createCsvRow({
        type: 'global_phrase',
        scope: 'global',
        enabled: phrase.enabled,
        label: phrase.label,
        value: phrase.value,
        buttonColour: phrase.buttonColour
      })
    ),
    ...settings.whitelist.flatMap((rule) => [
      createCsvRow({
        type: 'whitelist_rule',
        scope: rule.id,
        enabled: rule.enabled,
        pattern: rule.pattern,
        allowPasswordFields: rule.allowPasswordFields
      }),
      ...rule.phrases.map((phrase) =>
        createCsvRow({
          type: 'site_phrase',
          scope: rule.id,
          enabled: phrase.enabled,
          pattern: rule.pattern,
          label: phrase.label,
          value: phrase.value,
          buttonColour: phrase.buttonColour
        })
      )
    ]),
    ...settings.blacklist.map((rule) =>
      createCsvRow({
        type: 'blacklist_rule',
        scope: rule.id,
        enabled: rule.enabled,
        pattern: rule.pattern
      })
    )
  ];

  return `${rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')}\n`;
}

function createCsvRow(input: {
  type: string;
  scope: string;
  enabled: boolean;
  pattern?: string;
  allowPasswordFields?: boolean;
  label?: string;
  value?: string;
  buttonColour?: string;
}): string[] {
  return [
    input.type,
    input.scope,
    String(input.enabled),
    input.pattern ?? '',
    input.allowPasswordFields === undefined ? '' : String(input.allowPasswordFields),
    input.label ?? '',
    input.value ?? '',
    input.buttonColour ?? ''
  ];
}

function escapeCsvCell(value: string): string {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}

function createEntityId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
