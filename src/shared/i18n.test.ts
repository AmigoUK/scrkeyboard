import { describe, expect, it } from 'vitest';
import { translate } from './i18n';

describe('translate', () => {
  it('returns the message name when the Chrome i18n API is unavailable', () => {
    expect(translate('popupTitle')).toBe('popupTitle');
  });
});

