import type { EditableTarget } from './editableTarget';

export interface VisibilityGeometry {
  keyboardHeight: number;
  margin: number;
  targetBottom: number;
  targetTop: number;
  viewportHeight: number;
  viewportOffsetTop: number;
}

export function getScrollDeltaToRevealTarget(geometry: VisibilityGeometry): number {
  const visibleTop = geometry.viewportOffsetTop + geometry.margin;
  const visibleBottom =
    geometry.viewportOffsetTop + geometry.viewportHeight - geometry.keyboardHeight - geometry.margin;

  if (geometry.targetBottom > visibleBottom) {
    return geometry.targetBottom - visibleBottom;
  }

  if (geometry.targetTop < visibleTop) {
    return geometry.targetTop - visibleTop;
  }

  return 0;
}

export function ensureTargetVisibleAboveKeyboard(
  target: EditableTarget,
  keyboardHeight: number,
  margin = 24
): void {
  if (keyboardHeight <= 0) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const viewport = window.visualViewport;
  const delta = getScrollDeltaToRevealTarget({
    keyboardHeight,
    margin,
    targetBottom: rect.bottom,
    targetTop: rect.top,
    viewportHeight: viewport?.height ?? window.innerHeight,
    viewportOffsetTop: viewport?.offsetTop ?? 0
  });

  if (delta === 0) {
    return;
  }

  window.scrollBy({
    behavior: 'smooth',
    top: delta
  });
}
