import { describe, expect, it } from 'vitest';
import { getKeyboardCopy } from './keyboardCopy';
import {
  BACKSPACE_SYMBOL_LABEL,
  CAPS_LOCK_SYMBOL_LABEL,
  ENTER_SYMBOL_LABEL,
  LETTERS_LAYER_LABEL,
  SYMBOL_LAYER_LABEL,
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
      'Close',
      'Space',
      ENTER_SYMBOL_LABEL
    ]);
    expect(rows[3][3].ariaLabel).toBe('Enter');
    expect(rows[3][3].width).toBe('wide');
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
      'Zamknij',
      'Spacja',
      ENTER_SYMBOL_LABEL
    ]);
    expect(rows[3][3].ariaLabel).toBe('Enter');
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
      '"', "'", '+', '=', '<', '>', '[', ']', '?'
    ]);
    expect(rows[2].map((key) => key.label)).toEqual([
      CAPS_LOCK_SYMBOL_LABEL, 'Shift', '~', '^', '|', '\\', '{', '}', '§'
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
});

describe('createNumpadRows', () => {
  it('creates a right-hand numeric keypad layout', () => {
    const rows = createNumpadRows();

    expect(rows).toHaveLength(4);
    expect(rows[0].map((key) => key.label)).toEqual(['7', '8', '9']);
    expect(rows[1].map((key) => key.label)).toEqual(['4', '5', '6']);
    expect(rows[2].map((key) => key.label)).toEqual(['1', '2', '3']);
    expect(rows[3].map((key) => key.label)).toEqual(['0', BACKSPACE_SYMBOL_LABEL]);
    expect(rows[3][1].ariaLabel).toBe('Backspace');
    expect(rows[3][1].width).toBeUndefined();
  });
});
