import { SETTINGS_STORAGE_KEY, loadSettings } from '../shared/settingsStorage';
import type { Phrase, UrlRuleEvaluation } from '../shared/settingsTypes';
import { evaluateUrlRules } from '../shared/urlPattern';
import { type EditableTarget, resolveEditableTarget } from './editableTarget';
import { createKeyboardView, type KeyboardView } from './keyboardView';
import type { KeyboardAction } from './keyboardLayout';
import { deleteBackward, dispatchEnter, insertText } from './textEditing';

const readyEventName = 'scrkeyboard:content-ready';

let activeTarget: EditableTarget | null = null;
let evaluation: UrlRuleEvaluation | null = null;
let keyboardView: KeyboardView | null = null;

if (!document.documentElement.dataset.scrkeyboardContentReady) {
  document.documentElement.dataset.scrkeyboardContentReady = 'true';
  void initialiseContentScript();
}

async function initialiseContentScript(): Promise<void> {
  document.addEventListener('focusin', handleFocusIn, true);
  document.addEventListener('pointerdown', handleDocumentPointerDown, true);
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && SETTINGS_STORAGE_KEY in changes) {
      void refreshEvaluation();
    }
  });

  await refreshEvaluation();
  activateEditableTarget(document.activeElement);

  document.dispatchEvent(
    new CustomEvent(readyEventName, {
      detail: {
        active: evaluation?.active ?? false
      }
    })
  );
}

async function refreshEvaluation(): Promise<void> {
  const settings = await loadSettings();
  evaluation = evaluateUrlRules(settings, window.location.href);
  document.documentElement.dataset.scrkeyboardActive = String(evaluation.active);

  if (!evaluation.active) {
    activeTarget = null;
    keyboardView?.hide();
  }
}

function handleFocusIn(event: FocusEvent): void {
  activateEditableTarget(event.target);
}

function activateEditableTarget(target: EventTarget | null): void {
  if (!evaluation?.active) {
    return;
  }

  const editableTarget = resolveEditableTarget(target, evaluation.allowPasswordFields);

  if (!editableTarget) {
    return;
  }

  activeTarget = editableTarget;
  getKeyboardView().show(evaluation.phrases);
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (!keyboardView || keyboardView.containsTarget(event.target)) {
    return;
  }

  if (resolveEditableTarget(event.target, evaluation?.allowPasswordFields ?? false)) {
    return;
  }

  activeTarget = null;
  keyboardView.hide();
}

function getKeyboardView(): KeyboardView {
  if (!keyboardView) {
    keyboardView = createKeyboardView({
      onAction: handleKeyboardAction,
      onPhrase: handlePhrase
    });
  }

  return keyboardView;
}

function handleKeyboardAction(action: KeyboardAction): void {
  if (action.type === 'close') {
    activeTarget = null;
    keyboardView?.hide();
    return;
  }

  if (!activeTarget) {
    return;
  }

  switch (action.type) {
    case 'character':
      insertText(activeTarget, action.value);
      break;
    case 'backspace':
      deleteBackward(activeTarget);
      break;
    case 'space':
      insertText(activeTarget, ' ');
      break;
    case 'shift':
      break;
    case 'enter':
      dispatchEnter(activeTarget, false);
      activeTarget = null;
      keyboardView?.hide();
      break;
  }
}

function handlePhrase(phrase: Phrase): void {
  if (!activeTarget) {
    return;
  }

  insertText(activeTarget, phrase.value);
}
