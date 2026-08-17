export type LocaleCode = 'en' | 'pl';

export type ConfirmKeyMode = 'enter' | 'ctrlEnter';

export interface Phrase {
  id: string;
  label: string;
  value: string;
  buttonColour: string;
  enabled: boolean;
}

export interface UrlRule {
  id: string;
  pattern: string;
  enabled: boolean;
  allowPasswordFields: boolean;
  phrases: Phrase[];
}

export interface BlockRule {
  id: string;
  pattern: string;
  enabled: boolean;
}

export interface ScrKeyboardSettings {
  schemaVersion: 1;
  enabled: boolean;
  language: LocaleCode;
  confirmKeyMode: ConfirmKeyMode;
  globalPhrases: Phrase[];
  whitelist: UrlRule[];
  blacklist: BlockRule[];
}

export interface UrlRuleEvaluation {
  active: boolean;
  blocked: boolean;
  allowPasswordFields: boolean;
  phrases: Phrase[];
  matchedWhitelistRule: UrlRule | null;
  matchedBlacklistRule: BlockRule | null;
}
