export interface KeyboardRuntimeState {
  capsLockActive: boolean;
}

export const KEYBOARD_RUNTIME_STATE_STORAGE_KEY = 'scrkeyboard.keyboardRuntimeState.v1';

const DEFAULT_KEYBOARD_RUNTIME_STATE: KeyboardRuntimeState = {
  capsLockActive: false
};

export async function loadKeyboardRuntimeState(): Promise<KeyboardRuntimeState> {
  if (!isLocalStorageAvailable()) {
    return DEFAULT_KEYBOARD_RUNTIME_STATE;
  }

  const stored = await chrome.storage.local.get(KEYBOARD_RUNTIME_STATE_STORAGE_KEY);
  const value = stored[KEYBOARD_RUNTIME_STATE_STORAGE_KEY];

  if (!isKeyboardRuntimeState(value)) {
    return DEFAULT_KEYBOARD_RUNTIME_STATE;
  }

  return value;
}

export async function saveKeyboardRuntimeState(state: KeyboardRuntimeState): Promise<void> {
  if (!isLocalStorageAvailable()) {
    return;
  }

  await chrome.storage.local.set({
    [KEYBOARD_RUNTIME_STATE_STORAGE_KEY]: state
  });
}

function isKeyboardRuntimeState(value: unknown): value is KeyboardRuntimeState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'capsLockActive' in value &&
    typeof value.capsLockActive === 'boolean'
  );
}

function isLocalStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local);
}

