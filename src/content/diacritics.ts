export const POLISH_DIACRITICS: Readonly<Record<string, string>> = {
  a: 'ą',
  c: 'ć',
  e: 'ę',
  l: 'ł',
  n: 'ń',
  o: 'ó',
  s: 'ś',
  x: 'ź',
  z: 'ż'
};

export function applyDiacritic(character: string): string {
  const lowerCase = character.toLowerCase();
  const variant = POLISH_DIACRITICS[lowerCase];

  if (!variant) {
    return character;
  }

  return character === lowerCase ? variant : variant.toUpperCase();
}
