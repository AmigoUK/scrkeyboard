import { describe, expect, it } from 'vitest';
import { getKeyboardCopy } from './keyboardCopy';
import {
  BACKSPACE_SYMBOL_LABEL,
  CAPS_LOCK_SYMBOL_LABEL,
  DIACRITICS_SYMBOL_LABEL,
  ENTER_SYMBOL_LABEL,
  LETTERS_LAYER_LABEL,
  SYMBOL_LAYER_LABEL,
  TAB_SYMBOL_LABEL,
  createKeyboardRows,
  createNumpadRows,
  type KeyboardLayoutState
} from './keyboardLayout';

function layoutState(overrides: Partial<KeyboardLayoutState> = {}): KeyboardLayoutState {
  return {
    capsLockActive: false,
    diacriticsActive: false,
    mode: 'letters',
    shiftActive: false,
    ...overrides
  };
}

describe('createKeyboardRows', () => {
  it('creates the expected main keyboard rows', () => {
    const rows = createKeyboardRows(layoutState());

    expect(rows).toHaveLength(4);
    expect(rows[0][0].label).toBe('q');
    expect(rows[2][0]).toEqual(
      expect.objectContaining({
        active: false,
        ariaLabel: 'CapsLock',
        label: CAPS_LOCK_SYMBOL_LABEL
      })
    );
    expect(rows[2][1]).toEqual(
      expect.objectContaining({
        active: false,
        label: 'Shift'
      })
    );
    expect(rows[2].map((key) => key.label)).toEqual([
      CAPS_LOCK_SYMBOL_LABEL,
      'Shift',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm'
    ]);
    expect(rows[3].map((key) => key.label)).toEqual([
      SYMBOL_LAYER_LABEL,
      DIACRITICS_SYMBOL_LABEL,
      'Close',
      'Space',
      TAB_SYMBOL_LABEL,
      ENTER_SYMBOL_LABEL
    ]);
    expect(rows[3][5].ariaLabel).toBe('Enter');
    expect(rows[3][5].width).toBe('wide');
    expect(rows.flat().some((key) => key.id === 'backspace')).toBe(false);
  });

  it('uppercases letter rows when shift is active', () => {
    const rows = createKeyboardRows(layoutState({ shiftActive: true }));

    expect(rows[0][0].label).toBe('Q');
    expect(rows[1][0].label).toBe('A');
    expect(rows[2][2].label).toBe('Z');
    expect(rows[2][1].active).toBe(true);
  });

  it('uppercases letter rows and marks CapsLock active when CapsLock is active', () => {
    const rows = createKeyboardRows(layoutState({ capsLockActive: true }));

    expect(rows[0][0].label).toBe('Q');
    expect(rows[1][0].label).toBe('A');
    expect(rows[2][2].label).toBe('Z');
    expect(rows[2][0].active).toBe(true);
  });

  it('uses configured language copy for special keys', () => {
    const rows = createKeyboardRows(layoutState(), getKeyboardCopy('pl'));

    expect(rows[2][0].ariaLabel).toBe('CapsLock');
    expect(rows[3].map((key) => key.label)).toEqual([
      SYMBOL_LAYER_LABEL,
      DIACRITICS_SYMBOL_LABEL,
      'Zamknij',
      'Spacja',
      TAB_SYMBOL_LABEL,
      ENTER_SYMBOL_LABEL
    ]);
    expect(rows[3][5].ariaLabel).toBe('Enter');
  });

  describe('the Tab key', () => {
    it('sits between Space and Enter in every mode', () => {
      const letters = createKeyboardRows(layoutState());
      const symbols = createKeyboardRows(layoutState({ mode: 'symbols' }));

      expect(letters[3].map((key) => key.label)).toEqual([
        SYMBOL_LAYER_LABEL,
        DIACRITICS_SYMBOL_LABEL,
        'Close',
        'Space',
        TAB_SYMBOL_LABEL,
        ENTER_SYMBOL_LABEL
      ]);
      expect(symbols[3][4].label).toBe(TAB_SYMBOL_LABEL);
    });

    it('carries a tab action and an accessible label', () => {
      const rows = createKeyboardRows(layoutState());

      expect(rows[3][4]).toEqual(
        expect.objectContaining({
          action: { type: 'tab' },
          ariaLabel: 'Next field',
          id: 'tab'
        })
      );
    });
  });
});

describe('createKeyboardRows in symbols mode', () => {
  it('replaces the letter rows with symbol rows', () => {
    const rows = createKeyboardRows(layoutState({ mode: 'symbols' }));

    expect(rows).toHaveLength(4);
    expect(rows[0].map((key) => key.label)).toEqual([
      '!', '#', '$', '%', '&', '*', '(', ')', ':', ';'
    ]);
    expect(rows[1].map((key) => key.label)).toEqual([
      '/', '_', '"', "'", '+', '=', '<', '>', '[', ']'
    ]);
    expect(rows[2].map((key) => key.label)).toEqual([
      CAPS_LOCK_SYMBOL_LABEL, 'Shift', '~', '^', '|', '\\', '{', '}', '?'
    ]);
  });

  it('disables CapsLock and Shift in symbols mode but keeps their positions', () => {
    const rows = createKeyboardRows(layoutState({ mode: 'symbols' }));

    expect(rows[2][0].disabled).toBe(true);
    expect(rows[2][1].disabled).toBe(true);
    expect(rows[2][2].disabled).toBeUndefined();
  });

  it('does not disable CapsLock and Shift in letters mode', () => {
    const rows = createKeyboardRows(layoutState());

    expect(rows[2][0].disabled).toBeUndefined();
    expect(rows[2][1].disabled).toBeUndefined();
  });

  it('labels the mode key ?# in letters mode and ABC in symbols mode', () => {
    expect(createKeyboardRows(layoutState())[3][0]).toEqual(
      expect.objectContaining({
        action: { type: 'symbolLayer' },
        id: 'symbol-layer',
        label: SYMBOL_LAYER_LABEL
      })
    );
    expect(createKeyboardRows(layoutState({ mode: 'symbols' }))[3][0].label).toBe(
      LETTERS_LAYER_LABEL
    );
  });

  it('leaves symbol keys unaffected by shift', () => {
    const rows = createKeyboardRows(layoutState({ mode: 'symbols', shiftActive: true }));

    expect(rows[0][0].label).toBe('!');
  });

  it('makes every character needed for an email address, a slashed date and a hyphenated reference reachable', () => {
    const symbolRows = createKeyboardRows(layoutState({ mode: 'symbols' }));
    const numpadRows = createNumpadRows();

    const typeableCharacters = new Set(
      [...symbolRows.flat(), ...numpadRows.flat()]
        .filter((key) => key.action.type === 'character')
        .map((key) => (key.action as { type: 'character'; value: string }).value)
    );

    // '/' and '.' for a slashed date (12/03), '-' for a hyphenated reference
    // (ORD-2024/15), '_' for reference formats that use an underscore instead
    // of a hyphen (ORD_2024/15), and '@' and '.' plus letters for an email
    // address (a.smith@example.com). ':' covers times on the same forms, and
    // ',' covers thousands or decimal separators in numeric fields.
    for (const character of ['/', '_', '.', ',', '-', '@', ':']) {
      expect(typeableCharacters.has(character)).toBe(true);
    }
  });
});

describe('createKeyboardRows with diacritics active', () => {
  it('maps only the letters that have a Polish variant', () => {
    const rows = createKeyboardRows(layoutState({ diacriticsActive: true }));

    expect(rows[0].map((key) => key.label)).toEqual([
      'q', 'w', 'ę', 'r', 't', 'y', 'u', 'i', 'ó', 'p'
    ]);
    expect(rows[1].map((key) => key.label)).toEqual([
      'ą', 'ś', 'd', 'f', 'g', 'h', 'j', 'k', 'ł'
    ]);
    expect(rows[2].slice(2).map((key) => key.label)).toEqual([
      'ż', 'ź', 'ć', 'v', 'b', 'ń', 'm'
    ]);
  });

  it('inserts the mapped character, not the base letter', () => {
    const rows = createKeyboardRows(layoutState({ diacriticsActive: true }));

    expect(rows[1][0].action).toEqual({ type: 'character', value: 'ą' });
  });

  it('produces upper-case variants when shift is also active', () => {
    const rows = createKeyboardRows(
      layoutState({ diacriticsActive: true, shiftActive: true })
    );

    expect(rows[1][0].label).toBe('Ą');
    expect(rows[1][0].action).toEqual({ type: 'character', value: 'Ą' });
  });

  it('marks the diacritics key active and keeps it in every mode', () => {
    const letters = createKeyboardRows(layoutState({ diacriticsActive: true }));
    const symbols = createKeyboardRows(layoutState({ mode: 'symbols' }));

    expect(letters[3][1]).toEqual(
      expect.objectContaining({
        action: { type: 'diacritics' },
        active: true,
        id: 'diacritics',
        label: DIACRITICS_SYMBOL_LABEL
      })
    );
    expect(symbols[3][1].label).toBe(DIACRITICS_SYMBOL_LABEL);
    expect(symbols[3][1].active).toBe(false);
  });

  it('leaves symbol rows untouched when diacritics are active', () => {
    const rows = createKeyboardRows(
      layoutState({ diacriticsActive: true, mode: 'symbols' })
    );

    expect(rows[0][0].label).toBe('!');
  });
});

describe('createNumpadRows', () => {
  it('creates a right-hand numeric keypad with a symbol column', () => {
    const rows = createNumpadRows();

    expect(rows).toHaveLength(4);
    expect(rows[0].map((key) => key.label)).toEqual(['7', '8', '9', '.']);
    expect(rows[1].map((key) => key.label)).toEqual(['4', '5', '6', ',']);
    expect(rows[2].map((key) => key.label)).toEqual(['1', '2', '3', '-']);
    expect(rows[3].map((key) => key.label)).toEqual(['0', BACKSPACE_SYMBOL_LABEL, '@']);
    expect(rows[3][1].ariaLabel).toBe('Backspace');
    expect(rows[3][1].width).toBeUndefined();
  });

  it('inserts the symbol as a character action', () => {
    const rows = createNumpadRows();

    expect(rows[0][3].action).toEqual({ type: 'character', value: '.' });
    expect(rows[0][3].id).toBe('keypad-symbol-.');
  });
});
