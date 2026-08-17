export const DEFAULT_PHRASE_BUTTON_COLOUR = '#ffffff';

export const PHRASE_BUTTON_COLOUR_PRESETS = [
  '#ffffff',
  '#276ef1',
  '#0f766e',
  '#ca8a04',
  '#dc2626',
  '#7c3aed',
  '#17202a'
];

const shortHexColourPattern = /^#[0-9a-f]{3}$/i;
const hexColourPattern = /^#[0-9a-f]{6}$/i;

export function normaliseButtonColour(
  input: unknown,
  fallback = DEFAULT_PHRASE_BUTTON_COLOUR
): string {
  if (typeof input !== 'string') {
    return fallback;
  }

  const value = input.trim();

  if (hexColourPattern.test(value)) {
    return value.toLowerCase();
  }

  if (shortHexColourPattern.test(value)) {
    const [, red, green, blue] = value.toLowerCase();
    return `#${red}${red}${green}${green}${blue}${blue}`;
  }

  return fallback;
}

export function getReadableTextColour(backgroundColour: string): '#000000' | '#ffffff' {
  const { red, green, blue } = parseHexColour(normaliseButtonColour(backgroundColour));
  const backgroundLuminance = getRelativeLuminance(red, green, blue);
  const blackContrast = getContrastRatio(backgroundLuminance, 0);
  const whiteContrast = getContrastRatio(backgroundLuminance, 1);

  return blackContrast >= whiteContrast ? '#000000' : '#ffffff';
}

function parseHexColour(colour: string): {
  red: number;
  green: number;
  blue: number;
} {
  return {
    red: Number.parseInt(colour.slice(1, 3), 16),
    green: Number.parseInt(colour.slice(3, 5), 16),
    blue: Number.parseInt(colour.slice(5, 7), 16)
  };
}

function getRelativeLuminance(red: number, green: number, blue: number): number {
  const [linearRed, linearGreen, linearBlue] = [red, green, blue].map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
}

function getContrastRatio(backgroundLuminance: number, textLuminance: number): number {
  const lighter = Math.max(backgroundLuminance, textLuminance);
  const darker = Math.min(backgroundLuminance, textLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}
