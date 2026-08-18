import './options.css';
import { getContentScriptMatchPatterns } from '../shared/hostPermissions';
import { PHRASE_BUTTON_COLOUR_PRESETS, getReadableTextColour, normaliseButtonColour } from '../shared/phraseColours';
import { SYNC_CONTENT_SCRIPTS_MESSAGE } from '../shared/runtimeMessages';
import { loadSettings, saveSettings } from '../shared/settingsStorage';
import type {
  BlockRule,
  ConfirmKeyMode,
  LocaleCode,
  Phrase,
  ScrKeyboardSettings,
  UrlRule
} from '../shared/settingsTypes';
import {
  cloneSettings,
  createEmptyBlacklistRule,
  createEmptyPhrase,
  createEmptyWhitelistRule,
  createSettingsFromControls,
  mergePhrasePatch,
  settingsToCsv
} from './optionsModel';

interface OptionsCopy {
  addBlockedSite: string;
  addGlobalPhrase: string;
  addPhrase: string;
  addSite: string;
  allowPasswordFields: string;
  approvedSitesDescription: string;
  approvedSitesTitle: string;
  blockedSitesDescription: string;
  blockedSitesTitle: string;
  buttonColour: string;
  confirmKeyMode: string;
  ctrlEnterMode: string;
  emptyBlockedSites: string;
  emptyGlobalPhrases: string;
  emptySitePhrases: string;
  emptyWhitelist: string;
  enabled: string;
  enterMode: string;
  exportCsv: string;
  footerProjectLabel: string;
  footerReviewRequest: string;
  grantAccess: string;
  grantAccessReady: string;
  grantAccessUnavailable: string;
  globalPhrasesDescription: string;
  globalPhrasesTitle: string;
  label: string;
  language: string;
  loading: string;
  pattern: string;
  remove: string;
  rowEnabled: string;
  save: string;
  saved: string;
  setupDescription: string;
  setupTitle: string;
  sitePhrases: string;
  statusCsvExported: string;
  statusGrantDenied: string;
  statusGrantSaved: string;
  statusSaveFailed: string;
  statusUnsaved: string;
  value: string;
}

const copyByLanguage: Record<LocaleCode, OptionsCopy> = {
  en: {
    addBlockedSite: 'Add blocked site',
    addGlobalPhrase: 'Add global phrase',
    addPhrase: 'Add phrase',
    addSite: 'Add approved site',
    allowPasswordFields: 'Allow password fields',
    approvedSitesDescription:
      'ScrKeyboard runs only on approved URL patterns. Use * as a wildcard when the same application has many paths.',
    approvedSitesTitle: 'Approved sites',
    blockedSitesDescription: 'Blocked patterns always win, even when the same URL also matches an approved site.',
    blockedSitesTitle: 'Blocked sites',
    buttonColour: 'Button colour',
    confirmKeyMode: 'Confirm key',
    ctrlEnterMode: 'Ctrl+Enter',
    emptyBlockedSites: 'No blocked sites yet.',
    emptyGlobalPhrases: 'No global phrases yet.',
    emptySitePhrases: 'No site phrases yet.',
    emptyWhitelist: 'No approved sites yet. The keyboard stays inactive until a site is approved.',
    enabled: 'Enable ScrKeyboard',
    enterMode: 'Enter',
    exportCsv: 'Export CSV',
    footerProjectLabel: 'Project & Development:',
    footerReviewRequest: 'Enjoying ScrKeyboard? Leave a review',
    grantAccess: 'Grant access',
    grantAccessReady: 'Chrome access pattern',
    grantAccessUnavailable: 'Open the target site and use the popup to grant Chrome access for fragment rules.',
    globalPhrasesDescription: 'Global phrases appear on every approved site before site-specific phrases.',
    globalPhrasesTitle: 'Quick phrases',
    label: 'Button label',
    language: 'Language',
    loading: 'Loading settings...',
    pattern: 'URL pattern',
    remove: 'Remove',
    rowEnabled: 'Enabled',
    save: 'Save settings',
    saved: 'Settings saved.',
    setupDescription: 'Manage operator-friendly domain rules, keyboard behaviour, and one-tap phrases.',
    setupTitle: 'ScrKeyboard setup',
    sitePhrases: 'Site phrases',
    statusCsvExported: 'CSV export prepared.',
    statusGrantDenied: 'Chrome site access was not granted.',
    statusGrantSaved: 'Site access granted and settings saved.',
    statusSaveFailed: 'Settings could not be saved. Check the console for details.',
    statusUnsaved: 'Unsaved changes.',
    value: 'Inserted text'
  },
  pl: {
    addBlockedSite: 'Dodaj blokowaną stronę',
    addGlobalPhrase: 'Dodaj frazę globalną',
    addPhrase: 'Dodaj frazę',
    addSite: 'Dodaj zatwierdzoną stronę',
    allowPasswordFields: 'Zezwól na pola haseł',
    approvedSitesDescription:
      'ScrKeyboard działa tylko na zatwierdzonych wzorcach URL. Użyj * jako wildcard dla wielu ścieżek aplikacji.',
    approvedSitesTitle: 'Zatwierdzone strony',
    blockedSitesDescription: 'Wzorce blokowane mają pierwszeństwo, nawet gdy URL pasuje też do zatwierdzonej strony.',
    blockedSitesTitle: 'Blokowane strony',
    buttonColour: 'Kolor przycisku',
    confirmKeyMode: 'Klawisz zatwierdzania',
    ctrlEnterMode: 'Ctrl+Enter',
    emptyBlockedSites: 'Brak blokowanych stron.',
    emptyGlobalPhrases: 'Brak fraz globalnych.',
    emptySitePhrases: 'Brak fraz dla tej strony.',
    emptyWhitelist: 'Brak zatwierdzonych stron. Klawiatura pozostaje nieaktywna do czasu zatwierdzenia strony.',
    enabled: 'Włącz ScrKeyboard',
    enterMode: 'Enter',
    exportCsv: 'Eksport CSV',
    footerProjectLabel: 'Projekt i rozwój:',
    footerReviewRequest: 'Podoba Ci się ScrKeyboard? Zostaw recenzję',
    grantAccess: 'Przyznaj dostęp',
    grantAccessReady: 'Wzorzec dostępu Chrome',
    grantAccessUnavailable: 'Otwórz docelową stronę i użyj popupu, aby przyznać dostęp Chrome dla fragmentów URL.',
    globalPhrasesDescription: 'Frazy globalne pojawiają się na każdej zatwierdzonej stronie przed frazami domeny.',
    globalPhrasesTitle: 'Szybkie frazy',
    label: 'Etykieta przycisku',
    language: 'Język',
    loading: 'Ładowanie ustawień...',
    pattern: 'Wzorzec URL',
    remove: 'Usuń',
    rowEnabled: 'Włączone',
    save: 'Zapisz ustawienia',
    saved: 'Ustawienia zapisane.',
    setupDescription: 'Zarządzaj domenami, zachowaniem klawiatury i frazami dla operatora.',
    setupTitle: 'Setup ScrKeyboard',
    sitePhrases: 'Frazy strony',
    statusCsvExported: 'Eksport CSV przygotowany.',
    statusGrantDenied: 'Dostęp Chrome do strony nie został przyznany.',
    statusGrantSaved: 'Dostęp do strony przyznany, ustawienia zapisane.',
    statusSaveFailed: 'Nie udało się zapisać ustawień. Sprawdź konsolę.',
    statusUnsaved: 'Niezapisane zmiany.',
    value: 'Wpisywany tekst'
  }
};

const root = document.querySelector<HTMLElement>('#options-root');

if (!root) {
  throw new Error('Options root element is missing.');
}

const optionsRoot = root;
let settings: ScrKeyboardSettings | null = null;
let statusText = copyByLanguage.en.loading;

const footerReviewLink = document.querySelector<HTMLAnchorElement>('#footer-review-link');
const footerProjectLabel = document.querySelector<HTMLElement>('#footer-project-label');
const footerVersion = document.querySelector<HTMLElement>('#footer-version');
const footerVersionWrap = document.querySelector<HTMLElement>('#footer-version-wrap');

initialiseFooterStatic();
void initialiseOptions();

function initialiseFooterStatic(): void {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    return;
  }

  if (footerReviewLink) {
    footerReviewLink.href = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}/reviews`;
  }

  const manifestVersion = chrome.runtime.getManifest?.().version;

  if (manifestVersion && footerVersion && footerVersionWrap) {
    footerVersion.textContent = `v${manifestVersion}`;
    footerVersionWrap.hidden = false;
  }
}

function applyFooterCopy(copy: OptionsCopy): void {
  if (footerProjectLabel) {
    footerProjectLabel.textContent = copy.footerProjectLabel;
  }

  if (footerReviewLink) {
    footerReviewLink.textContent = copy.footerReviewRequest;
  }
}

async function initialiseOptions(): Promise<void> {
  try {
    settings = cloneSettings(await loadSettings());
    statusText = getCopy().saved;
    render();
  } catch (error) {
    console.error('Failed to initialise options.', error);
    optionsRoot.textContent = copyByLanguage.en.statusSaveFailed;
  }
}

function render(): void {
  if (!settings) {
    optionsRoot.textContent = copyByLanguage.en.loading;
    return;
  }

  const copy = getCopy();
  document.documentElement.lang = settings.language;
  document.title = copy.setupTitle;
  applyFooterCopy(copy);
  optionsRoot.replaceChildren(
    createHeader(copy),
    createToolbar(copy),
    createGeneralSection(copy),
    createGlobalPhrasesSection(copy),
    createWhitelistSection(copy),
    createBlacklistSection(copy)
  );
}

function createHeader(copy: OptionsCopy): HTMLElement {
  const header = createElement('header', 'page-header');
  const title = createElement('h1', undefined, copy.setupTitle);
  const description = createElement('p', undefined, copy.setupDescription);
  header.append(title, description);
  return header;
}

function createToolbar(copy: OptionsCopy): HTMLElement {
  const toolbar = createElement('div', 'toolbar');
  const status = createElement('p', 'status-message', statusText);

  const actions = createElement('div', 'toolbar-actions');
  const exportButton = createButton(copy.exportCsv, 'secondary-button', exportSettingsCsv);
  const saveButton = createButton(copy.save, 'primary-button', () => {
    void persistSettings(copy.saved);
  });

  actions.append(exportButton, saveButton);
  toolbar.append(status, actions);
  return toolbar;
}

function createGeneralSection(copy: OptionsCopy): HTMLElement {
  const section = createSection(copy.setupTitle, '');
  section.classList.add('compact-section');

  const enabledInput = createCheckbox(settingsOrThrow().enabled, (checked) => {
    updateControls({
      enabled: checked
    });
  });
  const languageSelect = createSelect<LocaleCode>(
    settingsOrThrow().language,
    [
      ['en', 'English'],
      ['pl', 'Polski']
    ],
    (language) => {
      updateControls({
        language
      });
      statusText = getCopy().statusUnsaved;
      render();
    }
  );
  const confirmKeyModeSelect = createSelect<ConfirmKeyMode>(
    settingsOrThrow().confirmKeyMode,
    [
      ['enter', copy.enterMode],
      ['ctrlEnter', copy.ctrlEnterMode]
    ],
    (confirmKeyMode) => {
      updateControls({
        confirmKeyMode
      });
    }
  );

  section.append(
    createField(copy.enabled, enabledInput),
    createField(copy.language, languageSelect),
    createField(copy.confirmKeyMode, confirmKeyModeSelect)
  );
  return section;
}

function createGlobalPhrasesSection(copy: OptionsCopy): HTMLElement {
  const section = createSection(copy.globalPhrasesTitle, copy.globalPhrasesDescription);
  const phrases = settingsOrThrow().globalPhrases;
  const list = createElement('div', 'list');

  if (phrases.length === 0) {
    list.append(createEmptyMessage(copy.emptyGlobalPhrases));
  }

  phrases.forEach((phrase, index) => {
    list.append(
      createPhraseRow(copy, phrase, {
        onChange: (nextPhrase) => {
          settingsOrThrow().globalPhrases[index] = nextPhrase;
          markDirty();
        },
        onRemove: () => {
          settingsOrThrow().globalPhrases.splice(index, 1);
          markDirty();
          render();
        }
      })
    );
  });

  section.append(
    list,
    createButton(copy.addGlobalPhrase, 'secondary-button', () => {
      settingsOrThrow().globalPhrases.push(createEmptyPhrase('global'));
      markDirty();
      render();
    })
  );

  return section;
}

function createWhitelistSection(copy: OptionsCopy): HTMLElement {
  const section = createSection(copy.approvedSitesTitle, copy.approvedSitesDescription);
  const whitelist = settingsOrThrow().whitelist;
  const list = createElement('div', 'list');

  if (whitelist.length === 0) {
    list.append(createEmptyMessage(copy.emptyWhitelist));
  }

  whitelist.forEach((rule, index) => {
    list.append(createWhitelistRuleCard(copy, rule, index));
  });

  section.append(
    list,
    createButton(copy.addSite, 'secondary-button', () => {
      settingsOrThrow().whitelist.push(createEmptyWhitelistRule());
      markDirty();
      render();
    })
  );

  return section;
}

function createWhitelistRuleCard(copy: OptionsCopy, rule: UrlRule, index: number): HTMLElement {
  const card = createElement('article', 'rule-card');
  const header = createElement('div', 'rule-grid');

  const enabledInput = createCheckbox(rule.enabled, (checked) => {
    rule.enabled = checked;
    markDirty();
  });
  const patternInput = createTextInput(rule.pattern, copy.pattern, (value) => {
    rule.pattern = value;
    markDirty();
    renderAccessHint(accessHint, copy, rule);
  });
  const allowPasswordInput = createCheckbox(rule.allowPasswordFields, (checked) => {
    rule.allowPasswordFields = checked;
    markDirty();
  });
  const removeButton = createButton(copy.remove, 'danger-button', () => {
    settingsOrThrow().whitelist.splice(index, 1);
    markDirty();
    render();
  });

  header.append(
    createField(copy.rowEnabled, enabledInput),
    createField(copy.pattern, patternInput),
    createField(copy.allowPasswordFields, allowPasswordInput),
    removeButton
  );

  const accessHint = createElement('div', 'access-hint');
  renderAccessHint(accessHint, copy, rule);

  const phraseTitle = createElement('h3', undefined, copy.sitePhrases);
  const phrases = createElement('div', 'nested-list');

  if (rule.phrases.length === 0) {
    phrases.append(createEmptyMessage(copy.emptySitePhrases));
  }

  rule.phrases.forEach((phrase, phraseIndex) => {
    phrases.append(
      createPhraseRow(copy, phrase, {
        onChange: (nextPhrase) => {
          rule.phrases[phraseIndex] = nextPhrase;
          markDirty();
        },
        onRemove: () => {
          rule.phrases.splice(phraseIndex, 1);
          markDirty();
          render();
        }
      })
    );
  });

  const addPhraseButton = createButton(copy.addPhrase, 'secondary-button small-button', () => {
    rule.phrases.push(createEmptyPhrase('site'));
    markDirty();
    render();
  });

  card.append(header, accessHint, phraseTitle, phrases, addPhraseButton);
  return card;
}

function renderAccessHint(container: HTMLElement, copy: OptionsCopy, rule: UrlRule): void {
  container.replaceChildren();
  const patterns = getContentScriptMatchPatterns(rule.pattern);

  if (!rule.pattern.trim()) {
    container.textContent = copy.pattern;
    return;
  }

  if (patterns.length === 0) {
    container.textContent = copy.grantAccessUnavailable;
    return;
  }

  const text = createElement('span', undefined, `${copy.grantAccessReady}: ${patterns.join(', ')}`);
  const grantButton = createButton(copy.grantAccess, 'secondary-button small-button', () => {
    void grantAccessForRule(rule);
  });

  container.append(text, grantButton);
}

function createBlacklistSection(copy: OptionsCopy): HTMLElement {
  const section = createSection(copy.blockedSitesTitle, copy.blockedSitesDescription);
  const blacklist = settingsOrThrow().blacklist;
  const list = createElement('div', 'list');

  if (blacklist.length === 0) {
    list.append(createEmptyMessage(copy.emptyBlockedSites));
  }

  blacklist.forEach((rule, index) => {
    list.append(createBlacklistRuleRow(copy, rule, index));
  });

  section.append(
    list,
    createButton(copy.addBlockedSite, 'secondary-button', () => {
      settingsOrThrow().blacklist.push(createEmptyBlacklistRule());
      markDirty();
      render();
    })
  );

  return section;
}

function createBlacklistRuleRow(copy: OptionsCopy, rule: BlockRule, index: number): HTMLElement {
  const row = createElement('div', 'rule-grid');
  const enabledInput = createCheckbox(rule.enabled, (checked) => {
    rule.enabled = checked;
    markDirty();
  });
  const patternInput = createTextInput(rule.pattern, copy.pattern, (value) => {
    rule.pattern = value;
    markDirty();
  });
  const removeButton = createButton(copy.remove, 'danger-button', () => {
    settingsOrThrow().blacklist.splice(index, 1);
    markDirty();
    render();
  });

  row.append(createField(copy.rowEnabled, enabledInput), createField(copy.pattern, patternInput), removeButton);
  return row;
}

function createPhraseRow(
  copy: OptionsCopy,
  phrase: Phrase,
  callbacks: {
    onChange: (phrase: Phrase) => void;
    onRemove: () => void;
  }
): HTMLElement {
  let draftPhrase = phrase;
  const updatePhrase = (patch: Partial<Phrase>): void => {
    draftPhrase = mergePhrasePatch(draftPhrase, patch);
    callbacks.onChange(draftPhrase);
    markDirty();
  };

  const row = createElement('div', 'phrase-row');
  const enabledInput = createCheckbox(phrase.enabled, (checked) => {
    updatePhrase({
      enabled: checked
    });
  });
  const labelInput = createTextInput(phrase.label, copy.label, (label) => {
    updatePhrase({
      label
    });
  });
  const valueInput = createTextInput(phrase.value, copy.value, (value) => {
    updatePhrase({
      value
    });
  });
  const colourInput = createColourInput(phrase.buttonColour, copy.buttonColour, (buttonColour) => {
    updatePhrase({
      buttonColour
    });
  });
  const removeButton = createButton(copy.remove, 'danger-button', callbacks.onRemove);

  row.append(
    createField(copy.rowEnabled, enabledInput),
    createField(copy.label, labelInput),
    createField(copy.value, valueInput),
    createField(copy.buttonColour, colourInput),
    removeButton
  );
  return row;
}

function createSection(title: string, description: string): HTMLElement {
  const section = createElement('section', 'options-section');
  const heading = createElement('h2', undefined, title);
  section.append(heading);

  if (description) {
    section.append(createElement('p', 'section-description', description));
  }

  return section;
}

function createField(labelText: string, control: HTMLElement): HTMLElement {
  const label = createElement('label', 'field');
  const span = createElement('span', undefined, labelText);
  label.append(span, control);
  return label;
}

function createEmptyMessage(message: string): HTMLElement {
  return createElement('p', 'empty-message', message);
}

function createButton(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = className;
  button.textContent = label;
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

function createCheckbox(checked: boolean, onChange: (checked: boolean) => void): HTMLInputElement {
  const input = document.createElement('input');
  input.checked = checked;
  input.type = 'checkbox';
  input.addEventListener('change', () => {
    onChange(input.checked);
  });
  return input;
}

function createSelect<T extends string>(
  value: T,
  options: Array<[T, string]>,
  onChange: (value: T) => void
): HTMLSelectElement {
  const select = document.createElement('select');

  options.forEach(([optionValue, label]) => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = label;
    option.selected = optionValue === value;
    select.append(option);
  });

  select.addEventListener('change', () => {
    onChange(select.value as T);
  });

  return select;
}

function createTextInput(
  value: string,
  placeholder: string,
  onInput: (value: string) => void
): HTMLInputElement {
  const input = document.createElement('input');
  input.placeholder = placeholder;
  input.type = 'text';
  input.value = value;
  input.addEventListener('input', () => {
    onInput(input.value);
  });
  return input;
}

function createColourInput(
  value: string,
  label: string,
  onInput: (value: string) => void
): HTMLElement {
  let selectedColour = normaliseButtonColour(value);
  const wrapper = createElement('div', 'colour-control');
  const input = document.createElement('input');
  const presetList = createElement('div', 'colour-presets');

  const updatePresetSelection = (): void => {
    presetList.querySelectorAll<HTMLButtonElement>('.colour-preset').forEach((button) => {
      button.classList.toggle('selected', button.dataset.colour === selectedColour);
    });
  };

  input.type = 'color';
  input.value = selectedColour;
  input.setAttribute('aria-label', label);
  input.addEventListener('input', () => {
    selectedColour = normaliseButtonColour(input.value);
    onInput(selectedColour);
    updatePresetSelection();
  });

  PHRASE_BUTTON_COLOUR_PRESETS.forEach((colour) => {
    const preset = document.createElement('button');
    preset.className = 'colour-preset';
    preset.dataset.colour = colour;
    preset.style.backgroundColor = colour;
    preset.style.color = getReadableTextColour(colour);
    preset.type = 'button';
    preset.setAttribute('aria-label', `${label}: ${colour}`);
    preset.addEventListener('click', () => {
      selectedColour = colour;
      input.value = selectedColour;
      onInput(selectedColour);
      updatePresetSelection();
    });
    presetList.append(preset);
  });

  wrapper.append(input, presetList);
  updatePresetSelection();
  return wrapper;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  textContent?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
}

function updateControls(
  controls: Partial<{
    enabled: boolean;
    language: LocaleCode;
    confirmKeyMode: ConfirmKeyMode;
  }>
): void {
  const current = settingsOrThrow();
  settings = createSettingsFromControls(current, {
    enabled: controls.enabled ?? current.enabled,
    language: controls.language ?? current.language,
    confirmKeyMode: controls.confirmKeyMode ?? current.confirmKeyMode
  });
  markDirty();
}

async function persistSettings(successMessage: string): Promise<void> {
  try {
    settings = await saveSettings(settingsOrThrow());
    await syncContentScripts();
    statusText = successMessage;
    render();
  } catch (error) {
    console.error('Failed to save options settings.', error);
    statusText = getCopy().statusSaveFailed;
    render();
  }
}

async function grantAccessForRule(rule: UrlRule): Promise<void> {
  const copy = getCopy();
  const origins = getContentScriptMatchPatterns(rule.pattern);

  if (origins.length === 0) {
    statusText = copy.grantAccessUnavailable;
    render();
    return;
  }

  try {
    settings = await saveSettings(settingsOrThrow());
    const granted = await chrome.permissions.request({
      origins
    });

    if (!granted) {
      statusText = copy.statusGrantDenied;
      render();
      return;
    }

    await syncContentScripts();
    statusText = copy.statusGrantSaved;
    render();
  } catch (error) {
    console.error('Failed to grant site access.', error);
    statusText = copy.statusSaveFailed;
    render();
  }
}

function exportSettingsCsv(): void {
  const copy = getCopy();
  const csv = settingsToCsv(settingsOrThrow());
  const url = URL.createObjectURL(
    new Blob([csv], {
      type: 'text/csv;charset=utf-8'
    })
  );
  const anchor = document.createElement('a');
  anchor.download = 'ScrKeyboard-settings.csv';
  anchor.href = url;
  anchor.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);

  statusText = copy.statusCsvExported;
  render();
}

async function syncContentScripts(): Promise<void> {
  await chrome.runtime.sendMessage({
    type: SYNC_CONTENT_SCRIPTS_MESSAGE
  });
}

function markDirty(): void {
  statusText = getCopy().statusUnsaved;
  const status = document.querySelector<HTMLElement>('.status-message');

  if (status) {
    status.textContent = statusText;
  }
}

function settingsOrThrow(): ScrKeyboardSettings {
  if (!settings) {
    throw new Error('Settings are not loaded.');
  }

  return settings;
}

function getCopy(): OptionsCopy {
  return copyByLanguage[settings?.language ?? 'en'];
}
