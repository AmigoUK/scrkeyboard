import { describe, expect, it } from 'vitest';
import { createKeyboardRows, createNumpadRows } from './keyboardLayout';

describe('createKeyboardRows', () => {
  it('creates the expected main keyboard rows', () => {
    const rows = createKeyboardRows(false, false);

    expect(rows).toHaveLength(4);
    expect(rows[0][0].label).toBe('q');
    expect(rows[2][0]).toEqual(
      expect.objectContaining({
        active: false,
        label: 'CapsLock'
      })
    );
    expect(rows[2][1]).toEqual(
      expect.objectContaining({
        active: false,
        label: 'Shift'
      })
    );
    expect(rows[3].map((key) => key.label)).toEqual(['Close', 'Space', 'Enter']);
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
});

describe('createNumpadRows', () => {
  it('creates a right-hand numeric keypad layout', () => {
    const rows = createNumpadRows();

    expect(rows).toHaveLength(4);
    expect(rows[0].map((key) => key.label)).toEqual(['7', '8', '9']);
    expect(rows[1].map((key) => key.label)).toEqual(['4', '5', '6']);
    expect(rows[2].map((key) => key.label)).toEqual(['1', '2', '3']);
    expect(rows[3].map((key) => key.label)).toEqual(['0', 'Backspace']);
  });
});
