import { describe, expect, it } from 'vitest';
import { POLISH_DIACRITICS, applyDiacritic } from './diacritics';

describe('applyDiacritic', () => {
  it('maps every Polish base letter to its variant', () => {
    expect(applyDiacritic('a')).toBe('ą');
    expect(applyDiacritic('c')).toBe('ć');
    expect(applyDiacritic('e')).toBe('ę');
    expect(applyDiacritic('l')).toBe('ł');
    expect(applyDiacritic('n')).toBe('ń');
    expect(applyDiacritic('o')).toBe('ó');
    expect(applyDiacritic('s')).toBe('ś');
    expect(applyDiacritic('x')).toBe('ź');
    expect(applyDiacritic('z')).toBe('ż');
  });

  it('preserves upper case', () => {
    expect(applyDiacritic('A')).toBe('Ą');
    expect(applyDiacritic('Z')).toBe('Ż');
    expect(applyDiacritic('X')).toBe('Ź');
  });

  it('returns letters without a variant unchanged', () => {
    expect(applyDiacritic('q')).toBe('q');
    expect(applyDiacritic('M')).toBe('M');
    expect(applyDiacritic('5')).toBe('5');
  });

  it('is idempotent when applied to an already mapped letter', () => {
    expect(applyDiacritic(applyDiacritic('a'))).toBe('ą');
  });

  it('exposes exactly nine base letters', () => {
    expect(Object.keys(POLISH_DIACRITICS)).toHaveLength(9);
  });
});
