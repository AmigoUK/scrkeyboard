export const SYNC_CONTENT_SCRIPTS_MESSAGE = 'scrkeyboard.syncContentScripts';

export interface SyncContentScriptsMessage {
  type: typeof SYNC_CONTENT_SCRIPTS_MESSAGE;
}

export type RuntimeMessage = SyncContentScriptsMessage;

export function isSyncContentScriptsMessage(message: unknown): message is SyncContentScriptsMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    message.type === SYNC_CONTENT_SCRIPTS_MESSAGE
  );
}

