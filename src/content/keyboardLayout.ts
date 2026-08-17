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
}

const digitRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const firstLetterRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const secondLetterRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const thirdLetterRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

export function createKeyboardRows(shiftActive: boolean): KeyboardKey[][] {
  return [
    createCharacterRow(digitRow, false),
    createCharacterRow(firstLetterRow, shiftActive),
    createCharacterRow(secondLetterRow, shiftActive),
    [
      {
        id: 'shift',
        label: 'Shift',
        action: {
          type: 'shift'
        },
        width: 'wide'
      },
      ...createCharacterRow(thirdLetterRow, shiftActive),
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

