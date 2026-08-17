import type { LocaleCode } from '../shared/settingsTypes';

export interface KeyboardCopy {
  backspace: string;
  capsLock: string;
  close: string;
  enter: string;
  shift: string;
  space: string;
}

const copyByLanguage: Record<LocaleCode, KeyboardCopy> = {
  en: {
    backspace: 'Backspace',
    capsLock: 'CapsLock',
    close: 'Close',
    enter: 'Enter',
    shift: 'Shift',
    space: 'Space'
  },
  pl: {
    backspace: 'Usuń',
    capsLock: 'CapsLock',
    close: 'Zamknij',
    enter: 'Enter',
    shift: 'Shift',
    space: 'Spacja'
  }
};

export function getKeyboardCopy(language: LocaleCode): KeyboardCopy {
  return copyByLanguage[language];
}
