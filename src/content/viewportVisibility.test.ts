import { describe, expect, it } from 'vitest';
import { getScrollDeltaToRevealTarget } from './viewportVisibility';

describe('getScrollDeltaToRevealTarget', () => {
  it('scrolls down when the target would be hidden behind the keyboard', () => {
    expect(
      getScrollDeltaToRevealTarget({
        keyboardHeight: 280,
        margin: 24,
        targetBottom: 760,
        targetTop: 720,
        viewportHeight: 900,
        viewportOffsetTop: 0
      })
    ).toBe(164);
  });

  it('scrolls up when the target is above the safe viewport area', () => {
    expect(
      getScrollDeltaToRevealTarget({
        keyboardHeight: 280,
        margin: 24,
        targetBottom: 40,
        targetTop: 8,
        viewportHeight: 900,
        viewportOffsetTop: 0
      })
    ).toBe(-16);
  });

  it('does not scroll when the target is already fully visible', () => {
    expect(
      getScrollDeltaToRevealTarget({
        keyboardHeight: 280,
        margin: 24,
        targetBottom: 500,
        targetTop: 460,
        viewportHeight: 900,
        viewportOffsetTop: 0
      })
    ).toBe(0);
  });

  it('accounts for visual viewport offsets', () => {
    expect(
      getScrollDeltaToRevealTarget({
        keyboardHeight: 220,
        margin: 20,
        targetBottom: 720,
        targetTop: 680,
        viewportHeight: 760,
        viewportOffsetTop: 80
      })
    ).toBe(120);
  });
});
