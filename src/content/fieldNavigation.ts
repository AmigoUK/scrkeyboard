import { type EditableTarget, isEditableTarget } from './editableTarget';

const candidateSelector = 'input, textarea, [contenteditable]';

export function findNextEditableField(
  doc: Document,
  activeElement: Element,
  allowPasswordFields: boolean
): EditableTarget | null {
  const fields = Array.from(doc.querySelectorAll<HTMLElement>(candidateSelector)).filter(
    (element) => isNavigable(element, allowPasswordFields)
  );

  if (fields.length === 0) {
    return null;
  }

  const activeIndex = fields.indexOf(activeElement as HTMLElement);

  if (activeIndex === -1) {
    return fields[0] as EditableTarget;
  }

  const next = fields[activeIndex + 1];

  return next ? (next as EditableTarget) : null;
}

function isNavigable(element: HTMLElement, allowPasswordFields: boolean): boolean {
  if (!isEditableTarget(element, allowPasswordFields) && !isExplicitlyContentEditable(element)) {
    return false;
  }

  return isVisible(element);
}

function isExplicitlyContentEditable(element: HTMLElement): boolean {
  return element.getAttribute('contenteditable') === 'true';
}

function isVisible(element: HTMLElement): boolean {
  const view = element.ownerDocument.defaultView;
  let current: HTMLElement | null = element;

  while (current) {
    if (current.hasAttribute('hidden')) {
      return false;
    }

    const style = view?.getComputedStyle(current);

    if (style && (style.display === 'none' || style.visibility === 'hidden')) {
      return false;
    }

    current = current.parentElement;
  }

  return true;
}
