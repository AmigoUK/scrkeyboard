import type { Phrase } from '../shared/settingsTypes';
import { createKeyboardRows, type KeyboardAction, type KeyboardKey } from './keyboardLayout';

export interface KeyboardView {
  containsTarget(target: EventTarget | null): boolean;
  hide(): void;
  show(phrases: Phrase[]): void;
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
    phrases: [] as Phrase[],
    shiftActive: false,
    visible: false
  };

  host.setAttribute('aria-hidden', 'true');
  host.style.display = 'none';
  document.documentElement.append(host);

  function render(): void {
    shadowRoot.replaceChildren(createStyleElement(), createPanelElement());
  }

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

    createKeyboardRows(state.shiftActive).forEach((row) => {
      const rowElement = document.createElement('div');
      rowElement.className = 'key-row';

      row.forEach((key) => {
        rowElement.append(createKeyButton(key));
      });

      panel.append(rowElement);
    });

    return panel;
  }

  function createKeyButton(key: KeyboardKey): HTMLButtonElement {
    const button = createButton(key.label, `key key-${key.width ?? 'regular'}`);
    button.dataset.keyId = key.id;
    button.addEventListener('click', () => {
      if (key.action.type === 'shift') {
        state.shiftActive = !state.shiftActive;
        render();
      }

      callbacks.onAction(key.action);
    });

    return button;
  }

  function createButton(label: string, className: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = className;
    button.textContent = label;
    button.type = 'button';
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
    hide() {
      state.visible = false;
      host.style.display = 'none';
      host.setAttribute('aria-hidden', 'true');
    },
    show(phrases) {
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
      padding: 10px;
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
      gap: 6px;
      margin: 0 auto 6px;
      max-width: 980px;
    }

    .phrase-row[hidden] {
      display: none;
    }

    .key,
    .phrase-button {
      min-width: 44px;
      min-height: 42px;
      border: 1px solid #b8c0cc;
      border-radius: 6px;
      background: #ffffff;
      color: #17202a;
      cursor: pointer;
      font: inherit;
      font-size: 15px;
      font-weight: 650;
      touch-action: manipulation;
      user-select: none;
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

    .key:focus-visible,
    .phrase-button:focus-visible {
      outline: 3px solid rgba(39, 110, 241, 0.28);
      outline-offset: 2px;
    }

    .key-wide {
      min-width: 96px;
    }

    .key-extraWide {
      flex: 1;
      max-width: 460px;
    }

    .phrase-button {
      max-width: 220px;
      overflow: hidden;
      padding: 0 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;

  return style;
}

