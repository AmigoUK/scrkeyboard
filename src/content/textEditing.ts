import type { EditableTarget } from './editableTarget';

export function insertText(target: EditableTarget, text: string): void {
  target.focus();

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;

    target.setRangeText(text, start, end, 'end');
    dispatchInputEvent(target);
    return;
  }

  document.execCommand('insertText', false, text);
  dispatchInputEvent(target);
}

export function deleteBackward(target: EditableTarget): void {
  target.focus();

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;

    if (start !== end) {
      target.setRangeText('', start, end, 'end');
    } else if (start > 0) {
      target.setRangeText('', start - 1, start, 'end');
    }

    dispatchInputEvent(target);
    return;
  }

  document.execCommand('delete', false);
  dispatchInputEvent(target);
}

export function dispatchEnter(target: EditableTarget, ctrlKey: boolean): void {
  const keyboardEventInit: KeyboardEventInit = {
    bubbles: true,
    cancelable: true,
    code: 'Enter',
    composed: true,
    ctrlKey,
    key: 'Enter'
  };

  target.dispatchEvent(new KeyboardEvent('keydown', keyboardEventInit));
  target.dispatchEvent(new KeyboardEvent('keypress', keyboardEventInit));
  target.dispatchEvent(new KeyboardEvent('keyup', keyboardEventInit));
}

function dispatchInputEvent(target: EditableTarget): void {
  target.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      composed: true,
      inputType: 'insertText'
    })
  );
}

