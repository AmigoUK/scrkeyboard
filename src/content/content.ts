import { SETTINGS_STORAGE_KEY, loadSettings } from '../shared/settingsStorage';
import type { ConfirmKeyMode, LocaleCode, Phrase, UrlRuleEvaluation } from '../shared/settingsTypes';
import { evaluateUrlRules } from '../shared/urlPattern';
import { type EditableTarget, resolveEditableTarget } from './editableTarget';
import { createKeyboardView, type KeyboardView } from './keyboardView';
import type { KeyboardAction } from './keyboardLayout';
import { applyKeyboardPageInset, clearKeyboardPageInset } from './pageInset';
import { deleteBackward, dispatchEnter, insertText } from './textEditing';
import { ensureTargetVisibleAboveKeyboard } from './viewportVisibility';

const readyEventName = 'scrkeyboard:content-ready';

let activeTarget: EditableTarget | null = null;
let confirmKeyMode: ConfirmKeyMode = 'enter';
let evaluation: UrlRuleEvaluation | null = null;
let keyboardView: KeyboardView | null = null;
let language: LocaleCode = 'en';

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
  confirmKeyMode = settings.confirmKeyMode;
  language = settings.language;
  evaluation = evaluateUrlRules(settings, window.location.href);
  document.documentElement.dataset.scrkeyboardActive = String(evaluation.active);

  if (!evaluation.active) {
    activeTarget = null;
    hideKeyboardPanel();
    return;
  }

  if (activeTarget) {
    showKeyboardForTarget(activeTarget);
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
  showKeyboardForTarget(editableTarget);
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (!keyboardView || keyboardView.containsTarget(event.target)) {
    return;
  }

  if (resolveEditableTarget(event.target, evaluation?.allowPasswordFields ?? false)) {
    return;
  }

  activeTarget = null;
  hideKeyboardPanel();
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

function showKeyboardForTarget(target: EditableTarget): void {
  if (!evaluation?.active) {
    return;
  }

  const view = getKeyboardView();
  view.show(evaluation.phrases, language);
  window.requestAnimationFrame(() => {
    if (activeTarget !== target) {
      return;
    }

    const keyboardHeight = view.getHeight();
    applyKeyboardPageInset(keyboardHeight);
    ensureTargetVisibleAboveKeyboard(target, keyboardHeight);
  });
}

function hideKeyboardPanel(): void {
  keyboardView?.hide();
  clearKeyboardPageInset();
}

function handleKeyboardAction(action: KeyboardAction): void {
  if (action.type === 'close') {
    activeTarget = null;
    hideKeyboardPanel();
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
    case 'capsLock':
      break;
    case 'enter':
      dispatchEnter(activeTarget, confirmKeyMode === 'ctrlEnter');
      activeTarget = null;
      hideKeyboardPanel();
      break;
  }
}

function handlePhrase(phrase: Phrase): void {
  if (!activeTarget) {
    return;
  }

  insertText(activeTarget, phrase.value);
}
