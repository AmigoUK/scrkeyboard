import { translate } from '../shared/i18n';

const readyEventName = 'scrkeyboard:content-ready';

if (!document.documentElement.dataset.scrkeyboardContentReady) {
  document.documentElement.dataset.scrkeyboardContentReady = 'true';

  document.dispatchEvent(
    new CustomEvent(readyEventName, {
      detail: {
        message: translate('contentReady')
      }
    })
  );
}

