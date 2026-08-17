import { describe, expect, it } from 'vitest';
import { getReadableTextColour, normaliseButtonColour } from './phraseColours';

describe('phraseColours', () => {
  it('normalises supported hex colours', () => {
    expect(normaliseButtonColour('#06F')).toBe('#0066ff');
    expect(normaliseButtonColour('#276EF1')).toBe('#276ef1');
  });

  it('falls back for invalid colours', () => {
    expect(normaliseButtonColour('blue')).toBe('#ffffff');
    expect(normaliseButtonColour(null)).toBe('#ffffff');
  });

  it('chooses readable text colours against light and dark backgrounds', () => {
    expect(getReadableTextColour('#ffffff')).toBe('#000000');
    expect(getReadableTextColour('#17202a')).toBe('#ffffff');
    expect(getReadableTextColour('#ca8a04')).toBe('#000000');
    expect(getReadableTextColour('#276ef1')).toBe('#000000');
  });
});
