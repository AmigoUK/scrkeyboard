import { describe, expect, it } from 'vitest';
import { getKeyboardCopy } from './keyboardCopy';
import {
  BACKSPACE_SYMBOL_LABEL,
  CAPS_LOCK_SYMBOL_LABEL,
  ENTER_SYMBOL_LABEL,
  createKeyboardRows,
  createNumpadRows
} from './keyboardLayout';

describe('createKeyboardRows', () => {
  it('creates the expected main keyboard rows', () => {
    const rows = createKeyboardRows(false, false);

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
    expect(rows[2][9].label).toBe(BACKSPACE_SYMBOL_LABEL);
    expect(rows[2][9].ariaLabel).toBe('Backspace');
    expect(rows[2][9].width).toBeUndefined();
    expect(rows[3].map((key) => key.label)).toEqual(['Close', 'Space', ENTER_SYMBOL_LABEL]);
    expect(rows[3][2].ariaLabel).toBe('Enter');
    expect(rows[3][2].shape).toBe('enterL');
  });

  it('uppercases letter rows when shift is active', () => {
    const rows = createKeyboardRows(true, false);

    expect(rows[0][0].label).toBe('Q');
    expect(rows[1][0].label).toBe('A');
    expect(rows[2][2].label).toBe('Z');
    expect(rows[2][1].active).toBe(true);
  });

  it('uppercases letter rows and marks CapsLock active when CapsLock is active', () => {
    const rows = createKeyboardRows(false, true);

    expect(rows[0][0].label).toBe('Q');
    expect(rows[1][0].label).toBe('A');
    expect(rows[2][2].label).toBe('Z');
    expect(rows[2][0].active).toBe(true);
  });

  it('uses configured language copy for special keys', () => {
    const rows = createKeyboardRows(false, false, getKeyboardCopy('pl'));

    expect(rows[2][0].ariaLabel).toBe('CapsLock');
    expect(rows[2][9].label).toBe(BACKSPACE_SYMBOL_LABEL);
    expect(rows[2][9].ariaLabel).toBe('Usuń');
    expect(rows[3].map((key) => key.label)).toEqual(['Zamknij', 'Spacja', ENTER_SYMBOL_LABEL]);
    expect(rows[3][2].ariaLabel).toBe('Enter');
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
