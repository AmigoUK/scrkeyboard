import type { Phrase } from '../shared/settingsTypes';
import type { LocaleCode } from '../shared/settingsTypes';
import { getKeyboardCopy } from './keyboardCopy';
import { createKeyboardRows, createNumpadRows, type KeyboardAction, type KeyboardKey } from './keyboardLayout';
import { loadKeyboardRuntimeState, saveKeyboardRuntimeState } from './keyboardRuntimeState';

export interface KeyboardView {
  containsTarget(target: EventTarget | null): boolean;
  getHeight(): number;
  hide(): void;
  show(phrases: Phrase[], language: LocaleCode): void;
}

export interface KeyboardViewCallbacks {
  onAction: (action: KeyboardAction) => void;
  onPhrase: (phrase: Phrase) => void;
}

export function createKeyboardView(callbacks: KeyboardViewCallbacks): KeyboardView {
  const host = document.createElement('scrkeyboard-panel');
  const shadowRoot = host.attachShadow({
    mode: 'closed'
  });
  const state = {
    capsLockActive: false,
    language: 'en' as LocaleCode,
    phrases: [] as Phrase[],
    shiftActive: false,
    visible: false
  };
  let panelElement: HTMLElement | null = null;

  host.setAttribute('aria-hidden', 'true');
  host.style.display = 'none';
  document.documentElement.append(host);

  function render(): void {
    panelElement = createPanelElement();
    shadowRoot.replaceChildren(createStyleElement(), panelElement);
  }

  void loadKeyboardRuntimeState().then((runtimeState) => {
    state.capsLockActive = runtimeState.capsLockActive;
    render();
  });

  function createPanelElement(): HTMLElement {
    const panel = document.createElement('section');
    panel.className = 'panel';
    panel.setAttribute('aria-label', 'scrkeyboard');

    const phraseRow = document.createElement('div');
    phraseRow.className = 'phrase-row';
    phraseRow.hidden = state.phrases.length === 0;

    state.phrases.forEach((phrase) => {
      const button = createButton(phrase.label, 'phrase-button');
      button.addEventListener('click', () => callbacks.onPhrase(phrase));
      phraseRow.append(button);
    });

    panel.append(phraseRow);

    const keyboardGrid = document.createElement('div');
    keyboardGrid.className = 'keyboard-grid';
    const keyboardCopy = getKeyboardCopy(state.language);

    const mainKeyboard = document.createElement('div');
    mainKeyboard.className = 'main-keyboard';
    createKeyboardRows(state.shiftActive, state.capsLockActive, keyboardCopy).forEach((row) => {
      mainKeyboard.append(createKeyRow(row));
    });

    const numpad = document.createElement('div');
    numpad.className = 'numpad';
    createNumpadRows(keyboardCopy).forEach((row) => {
      numpad.append(createKeyRow(row));
    });

    keyboardGrid.append(mainKeyboard, numpad);
    panel.append(keyboardGrid);

    return panel;
  }

  function createKeyRow(row: KeyboardKey[]): HTMLElement {
    const rowElement = document.createElement('div');
    rowElement.className = 'key-row';

    row.forEach((key) => {
      rowElement.append(createKeyButton(key));
    });

    return rowElement;
  }

  function createKeyButton(key: KeyboardKey): HTMLButtonElement {
    const button = createButton(
      key.label,
      `key key-${key.width ?? 'regular'}${key.active ? ' key-active' : ''}`
    );
    if (key.ariaLabel) {
      button.setAttribute('aria-label', key.ariaLabel);
    }
    button.dataset.keyId = key.id;
    button.addEventListener('click', () => {
      if (key.action.type === 'shift') {
        state.shiftActive = !state.shiftActive;
        render();
      }

      if (key.action.type === 'capsLock') {
        state.capsLockActive = !state.capsLockActive;
        void saveKeyboardRuntimeState({
          capsLockActive: state.capsLockActive
        });
        render();
      }

      callbacks.onAction(key.action);
    });

    return button;
  }

  function createButton(label: string, className: string): HTMLButtonElement {
    const button = document.createElement('button');
    const labelElement = document.createElement('span');

    button.className = className;
    button.type = 'button';
    labelElement.className = 'button-label';
    labelElement.textContent = label;
    button.append(labelElement);
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
    });

    return button;
  }

  render();

  return {
    containsTarget(target) {
      return target === host;
    },
    getHeight() {
      return panelElement?.getBoundingClientRect().height ?? 0;
    },
    hide() {
      state.visible = false;
      host.style.display = 'none';
      host.setAttribute('aria-hidden', 'true');
    },
    show(phrases, language) {
      state.language = language;
      state.phrases = phrases;
      state.visible = true;
      host.style.display = 'block';
      host.setAttribute('aria-hidden', 'false');
      render();
    }
  };
}

function createStyleElement(): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
    }

    .panel {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2147483647;
      box-sizing: border-box;
      padding: 14px;
      border-top: 1px solid #c8ced6;
      background: #f7f8fa;
      box-shadow: 0 -6px 24px rgba(23, 32, 42, 0.16);
      color: #17202a;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .phrase-row,
    .key-row {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 0 auto 8px;
    }

    .phrase-row[hidden] {
      display: none;
    }

    .keyboard-grid {
      display: flex;
      align-items: stretch;
      justify-content: center;
      gap: 14px;
      max-width: 1220px;
      margin: 0 auto;
    }

    .main-keyboard {
      flex: 1 1 860px;
      max-width: 920px;
    }

    .numpad {
      flex: 0 0 auto;
      padding-left: 14px;
      border-left: 1px solid #d5dbe3;
    }

    .numpad .key-row {
      justify-content: flex-start;
    }

    .numpad .key-regular {
      box-sizing: border-box;
      width: 58px;
      min-width: 58px;
      height: 58px;
      min-height: 58px;
      padding: 0;
    }

    .key,
    .phrase-button {
      position: relative;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 58px;
      min-height: 56px;
      padding: 0 12px;
      border: 1px solid #b8c0cc;
      border-radius: 6px;
      appearance: none;
      background: #ffffff;
      color: #17202a;
      cursor: pointer;
      font: inherit;
      font-size: 17px;
      font-weight: 650;
      touch-action: manipulation;
      user-select: none;
    }

    .button-label {
      position: relative;
      z-index: 1;
      pointer-events: none;
    }

    .key:hover,
    .phrase-button:hover {
      background: #edf2ff;
      border-color: #276ef1;
    }

    .key:active,
    .phrase-button:active {
      background: #dbe7ff;
    }

    .key-active {
      border-color: #276ef1;
      background: #dbe7ff;
      color: #123f8c;
    }

    .key:focus-visible,
    .phrase-button:focus-visible {
      outline: 3px solid rgba(39, 110, 241, 0.28);
      outline-offset: 2px;
    }

    .key[data-key-id='numpad-backspace'],
    .key[data-key-id='caps-lock'],
    .key[data-key-id='enter'] {
      font-size: 24px;
      line-height: 1;
    }

    .key-wide {
      min-width: 122px;
    }

    .key-extraWide {
      flex: 1;
      max-width: 520px;
    }

    .phrase-button {
      max-width: 220px;
      overflow: hidden;
      padding: 0 14px;
    }

    .phrase-button .button-label {
      display: block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 860px) {
      .keyboard-grid {
        align-items: center;
        flex-direction: column;
      }

      .numpad {
        padding-left: 0;
        border-left: 0;
      }
    }
  `;

  return style;
}
