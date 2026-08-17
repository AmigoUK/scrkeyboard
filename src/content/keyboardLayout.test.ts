import { describe, expect, it } from 'vitest';
import { createKeyboardRows } from './keyboardLayout';

describe('createKeyboardRows', () => {
  it('creates the expected MVP keyboard rows', () => {
    const rows = createKeyboardRows(false);

    expect(rows).toHaveLength(5);
    expect(rows[0].map((key) => key.label)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
    expect(rows[1][0].label).toBe('q');
    expect(rows[3][0].label).toBe('Shift');
    expect(rows[4].map((key) => key.label)).toEqual(['Close', 'Space', 'Enter']);
  });

  it('uppercases letter rows when shift is active', () => {
    const rows = createKeyboardRows(true);

    expect(rows[1][0].label).toBe('Q');
    expect(rows[2][0].label).toBe('A');
    expect(rows[3][1].label).toBe('Z');
  });
});

