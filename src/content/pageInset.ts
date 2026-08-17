const insetMargin = 24;

let previousBodyPaddingBottom: string | null = null;
let previousScrollPaddingBottom: string | null = null;

export function applyKeyboardPageInset(keyboardHeight: number): void {
  if (!document.body || keyboardHeight <= 0) {
    return;
  }

  if (previousBodyPaddingBottom === null) {
    previousBodyPaddingBottom = document.body.style.paddingBottom;
  }

  if (previousScrollPaddingBottom === null) {
    previousScrollPaddingBottom = document.documentElement.style.scrollPaddingBottom;
  }

  const inset = `${Math.ceil(keyboardHeight + insetMargin)}px`;
  document.body.style.paddingBottom = inset;
  document.documentElement.style.scrollPaddingBottom = inset;
}

export function clearKeyboardPageInset(): void {
  if (previousBodyPaddingBottom !== null && document.body) {
    document.body.style.paddingBottom = previousBodyPaddingBottom;
  }

  if (previousScrollPaddingBottom !== null) {
    document.documentElement.style.scrollPaddingBottom = previousScrollPaddingBottom;
  }

  previousBodyPaddingBottom = null;
  previousScrollPaddingBottom = null;
}
