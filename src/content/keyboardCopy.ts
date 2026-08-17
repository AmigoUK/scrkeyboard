import type { LocaleCode } from '../shared/settingsTypes';

export interface KeyboardCopy {
  backspace: string;
  capsLock: string;
  close: string;
  diacritics: string;
  enter: string;
  lettersMode: string;
  shift: string;
  space: string;
  symbolsMode: string;
  tab: string;
}

const copyByLanguage: Record<LocaleCode, KeyboardCopy> = {
  en: {
    backspace: 'Backspace',
    capsLock: 'CapsLock',
    close: 'Close',
    diacritics: 'Polish characters',
    enter: 'Enter',
    lettersMode: 'Letters',
    shift: 'Shift',
    space: 'Space',
    symbolsMode: 'Symbols',
    tab: 'Next field'
  },
  pl: {
    backspace: 'Usuń',
    capsLock: 'CapsLock',
    close: 'Zamknij',
    diacritics: 'Polskie znaki',
    enter: 'Enter',
    lettersMode: 'Litery',
    shift: 'Shift',
    space: 'Spacja',
    symbolsMode: 'Symbole',
    tab: 'Następne pole'
  }
};

export function getKeyboardCopy(language: LocaleCode): KeyboardCopy {
  return copyByLanguage[language];
}
