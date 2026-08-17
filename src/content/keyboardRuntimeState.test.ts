import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  KEYBOARD_RUNTIME_STATE_STORAGE_KEY,
  loadKeyboardRuntimeState,
  saveKeyboardRuntimeState
} from './keyboardRuntimeState';

describe('keyboardRuntimeState', () => {
  let store: Record<string, unknown>;

  beforeEach(() => {
    store = {};

    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn(async (key: string) => ({
            [key]: store[key]
          })),
          set: vi.fn(async (items: Record<string, unknown>) => {
            store = {
              ...store,
              ...items
            };
          })
        }
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads CapsLock as inactive when local runtime state is empty', async () => {
    await expect(loadKeyboardRuntimeState()).resolves.toEqual({
      capsLockActive: false
    });
  });

  it('loads persisted CapsLock state from local storage', async () => {
    store[KEYBOARD_RUNTIME_STATE_STORAGE_KEY] = {
      capsLockActive: true
    };

    await expect(loadKeyboardRuntimeState()).resolves.toEqual({
      capsLockActive: true
    });
  });

  it('falls back to inactive CapsLock for invalid local runtime state', async () => {
    store[KEYBOARD_RUNTIME_STATE_STORAGE_KEY] = {
      capsLockActive: 'yes'
    };

    await expect(loadKeyboardRuntimeState()).resolves.toEqual({
      capsLockActive: false
    });
  });

  it('saves CapsLock state to local storage', async () => {
    await saveKeyboardRuntimeState({
      capsLockActive: true
    });

    expect(store[KEYBOARD_RUNTIME_STATE_STORAGE_KEY]).toEqual({
      capsLockActive: true
    });
  });
});
