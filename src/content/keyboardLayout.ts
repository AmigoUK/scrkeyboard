import { applyDiacritic } from './diacritics';
import type { KeyboardCopy } from './keyboardCopy';

export type KeyboardMode = 'letters' | 'symbols';

export interface KeyboardLayoutState {
  capsLockActive: boolean;
  diacriticsActive: boolean;
  mode: KeyboardMode;
  shiftActive: boolean;
}

export type KeyboardAction =
  | {
      type: 'character';
      value: string;
    }
  | {
      type: 'backspace';
    }
  | {
      type: 'space';
    }
  | {
      type: 'shift';
    }
  | {
      type: 'capsLock';
    }
  | {
      type: 'enter';
    }
  | {
      type: 'close';
    }
  | {
      type: 'symbolLayer';
    }
  | {
      type: 'diacritics';
    };

export interface KeyboardKey {
  id: string;
  label: string;
  action: KeyboardAction;
  ariaLabel?: string;
  width?: 'regular' | 'wide' | 'extraWide';
  active?: boolean;
  disabled?: boolean;
}

export const BACKSPACE_SYMBOL_LABEL = '⌫';
export const CAPS_LOCK_SYMBOL_LABEL = '⇪';
export const DIACRITICS_SYMBOL_LABEL = 'ĄĘ';
export const ENTER_SYMBOL_LABEL = '↵';

const defaultCopy: KeyboardCopy = {
  backspace: 'Backspace',
  capsLock: 'CapsLock',
  close: 'Close',
  diacritics: 'Polish characters',
  enter: 'Enter',
  lettersMode: 'Letters',
  shift: 'Shift',
  space: 'Space',
  symbolsMode: 'Symbols'
};

export const SYMBOL_LAYER_LABEL = '?#';
export const LETTERS_LAYER_LABEL = 'ABC';

const firstLetterRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const secondLetterRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const thirdLetterRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

const firstSymbolRow = ['!', '#', '$', '%', '&', '*', '(', ')', ':', ';'];
const secondSymbolRow = ['"', "'", '+', '=', '<', '>', '[', ']', '?'];
const thirdSymbolRow = ['~', '^', '|', '\\', '{', '}', '§'];

export function createKeyboardRows(
  state: KeyboardLayoutState,
  copy: KeyboardCopy = defaultCopy
): KeyboardKey[][] {
  const { capsLockActive, diacriticsActive, shiftActive } = state;
  const uppercaseActive = shiftActive || capsLockActive;

  const symbolsMode = state.mode === 'symbols';
  const firstRow = symbolsMode
    ? createSymbolRow(firstSymbolRow)
    : createCharacterRow(firstLetterRow, uppercaseActive, diacriticsActive);
  const secondRow = symbolsMode
    ? createSymbolRow(secondSymbolRow)
    : createCharacterRow(secondLetterRow, uppercaseActive, diacriticsActive);
  const thirdRow = symbolsMode
    ? createSymbolRow(thirdSymbolRow)
    : createCharacterRow(thirdLetterRow, uppercaseActive, diacriticsActive);

  return [
    firstRow,
    secondRow,
    [
      {
        id: 'caps-lock',
        label: CAPS_LOCK_SYMBOL_LABEL,
        ariaLabel: copy.capsLock,
        action: {
          type: 'capsLock'
        },
        width: 'wide',
        active: capsLockActive,
        ...(symbolsMode ? { disabled: true } : {})
      },
      {
        id: 'shift',
        label: copy.shift,
        action: {
          type: 'shift'
        },
        width: 'wide',
        active: shiftActive,
        ...(symbolsMode ? { disabled: true } : {})
      },
      ...thirdRow
    ],
    [
      {
        id: 'symbol-layer',
        label: symbolsMode ? LETTERS_LAYER_LABEL : SYMBOL_LAYER_LABEL,
        ariaLabel: symbolsMode ? copy.lettersMode : copy.symbolsMode,
        action: {
          type: 'symbolLayer'
        }
      },
      {
        id: 'diacritics',
        label: DIACRITICS_SYMBOL_LABEL,
        ariaLabel: copy.diacritics,
        action: {
          type: 'diacritics'
        },
        active: state.diacriticsActive
      },
      {
        id: 'close',
        label: copy.close,
        action: {
          type: 'close'
        },
        width: 'wide'
      },
      {
        id: 'space',
        label: copy.space,
        action: {
          type: 'space'
        },
        width: 'extraWide'
      },
      {
        id: 'enter',
        label: ENTER_SYMBOL_LABEL,
        ariaLabel: copy.enter,
        action: {
          type: 'enter'
        },
        width: 'wide'
      }
    ]
  ];
}

export function createNumpadRows(copy: KeyboardCopy = defaultCopy): KeyboardKey[][] {
  return [
    createDigitRow(['7', '8', '9']),
    createDigitRow(['4', '5', '6']),
    createDigitRow(['1', '2', '3']),
    [
      {
        id: 'numpad-0',
        label: '0',
        action: {
          type: 'character',
          value: '0'
        },
        width: 'wide'
      },
      {
        id: 'numpad-backspace',
        label: BACKSPACE_SYMBOL_LABEL,
        ariaLabel: copy.backspace,
        action: {
          type: 'backspace'
        }
      }
    ]
  ];
}

function createCharacterRow(
  characters: string[],
  shiftActive: boolean,
  diacriticsActive: boolean
): KeyboardKey[] {
  return characters.map((character) => {
    const cased = shiftActive ? character.toUpperCase() : character;
    const value = diacriticsActive ? applyDiacritic(cased) : cased;

    return {
      id: `character-${character}`,
      label: value,
      action: {
        type: 'character',
        value
      }
    };
  });
}

function createSymbolRow(characters: string[]): KeyboardKey[] {
  return characters.map((character) => ({
    id: `symbol-${character}`,
    label: character,
    action: {
      type: 'character',
      value: character
    }
  }));
}

function createDigitRow(characters: string[]): KeyboardKey[] {
  return characters.map((character) => ({
    id: `numpad-${character}`,
    label: character,
    action: {
      type: 'character',
      value: character
    }
  }));
}
