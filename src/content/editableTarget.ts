export type EditableTarget = HTMLInputElement | HTMLTextAreaElement | HTMLElement;

const editableInputTypes = new Set([
  '',
  'email',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'url'
]);

export function resolveEditableTarget(
  target: EventTarget | null,
  allowPasswordFields: boolean
): EditableTarget | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const element = target.closest('input, textarea, [contenteditable]');

  if (!element || !(element instanceof HTMLElement)) {
    return null;
  }

  return isEditableTarget(element, allowPasswordFields) ? element : null;
}

export function isEditableTarget(
  element: HTMLElement,
  allowPasswordFields: boolean
): element is EditableTarget {
  if (element instanceof HTMLTextAreaElement) {
    return !element.disabled && !element.readOnly;
  }

  if (element instanceof HTMLInputElement) {
    const type = element.type.toLowerCase();

    if (!editableInputTypes.has(type)) {
      return false;
    }

    if (type === 'password' && !allowPasswordFields) {
      return false;
    }

    return !element.disabled && !element.readOnly;
  }

  return element.isContentEditable;
}

