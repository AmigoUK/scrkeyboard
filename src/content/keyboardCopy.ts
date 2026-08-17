import type { LocaleCode } from '../shared/settingsTypes';

export interface KeyboardCopy {
  backspace: string;
  capsLock: string;
  close: string;
  enter: string;
  lettersMode: string;
  shift: string;
  space: string;
  symbolsMode: string;
}

const copyByLanguage: Record<LocaleCode, KeyboardCopy> = {
  en: {
    backspace: 'Backspace',
    capsLock: 'CapsLock',
    close: 'Close',
    enter: 'Enter',
    lettersMode: 'Letters',
    shift: 'Shift',
    space: 'Space',
    symbolsMode: 'Symbols'
  },
  pl: {
    backspace: 'Usuń',
    capsLock: 'CapsLock',
    close: 'Zamknij',
    enter: 'Enter',
    lettersMode: 'Litery',
    shift: 'Shift',
    space: 'Spacja',
    symbolsMode: 'Symbole'
  }
};

export function getKeyboardCopy(language: LocaleCode): KeyboardCopy {
  return copyByLanguage[language];
}
