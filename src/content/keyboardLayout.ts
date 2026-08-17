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
    };

export interface KeyboardKey {
  id: string;
  label: string;
  action: KeyboardAction;
  width?: 'regular' | 'wide' | 'extraWide';
  active?: boolean;
}

const firstLetterRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const secondLetterRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const thirdLetterRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

export function createKeyboardRows(shiftActive: boolean, capsLockActive: boolean): KeyboardKey[][] {
  const uppercaseActive = shiftActive || capsLockActive;

  return [
    createCharacterRow(firstLetterRow, uppercaseActive),
    createCharacterRow(secondLetterRow, uppercaseActive),
    [
      {
        id: 'caps-lock',
        label: 'CapsLock',
        action: {
          type: 'capsLock'
        },
        width: 'wide',
        active: capsLockActive
      },
      {
        id: 'shift',
        label: 'Shift',
        action: {
          type: 'shift'
        },
        width: 'wide',
        active: shiftActive
      },
      ...createCharacterRow(thirdLetterRow, uppercaseActive),
      {
        id: 'backspace',
        label: 'Backspace',
        action: {
          type: 'backspace'
        },
        width: 'wide'
      }
    ],
    [
      {
        id: 'close',
        label: 'Close',
        action: {
          type: 'close'
        },
        width: 'wide'
      },
      {
        id: 'space',
        label: 'Space',
        action: {
          type: 'space'
        },
        width: 'extraWide'
      },
      {
        id: 'enter',
        label: 'Enter',
        action: {
          type: 'enter'
        },
        width: 'wide'
      }
    ]
  ];
}

export function createNumpadRows(): KeyboardKey[][] {
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
        label: 'Backspace',
        action: {
          type: 'backspace'
        },
        width: 'wide'
      }
    ]
  ];
}

function createCharacterRow(characters: string[], shiftActive: boolean): KeyboardKey[] {
  return characters.map((character) => {
    const value = shiftActive ? character.toUpperCase() : character;

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
