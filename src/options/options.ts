import './options.css';
import { translate } from '../shared/i18n';

document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
  const messageName = element.dataset.i18n;

  if (messageName) {
    element.textContent = translate(messageName);
  }
});

