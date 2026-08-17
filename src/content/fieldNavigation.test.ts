// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { findNextEditableField } from './fieldNavigation';

function setBody(html: string): void {
  document.body.innerHTML = html;
}

function field(id: string): HTMLElement {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Missing element: ${id}`);
  }

  return element;
}

describe('findNextEditableField', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns the next field in document order', () => {
    setBody('<input id="a"><input id="b"><textarea id="c"></textarea>');

    expect(findNextEditableField(document, field('a'), false)).toBe(field('b'));
    expect(findNextEditableField(document, field('b'), false)).toBe(field('c'));
  });

  it('returns null on the last field rather than wrapping', () => {
    setBody('<input id="a"><input id="b">');

    expect(findNextEditableField(document, field('b'), false)).toBeNull();
  });

  it('skips disabled and read-only fields', () => {
    setBody('<input id="a"><input id="b" disabled><input id="c" readonly><input id="d">');

    expect(findNextEditableField(document, field('a'), false)).toBe(field('d'));
  });

  it('skips fields hidden with the hidden attribute or display none', () => {
    setBody(
      '<input id="a">' +
        '<input id="b" hidden>' +
        '<div style="display: none"><input id="c"></div>' +
        '<input id="d" style="visibility: hidden">' +
        '<input id="e">'
    );

    expect(findNextEditableField(document, field('a'), false)).toBe(field('e'));
  });

  it('skips unsupported input types', () => {
    setBody('<input id="a"><input id="b" type="checkbox"><input id="c" type="date"><input id="d">');

    expect(findNextEditableField(document, field('a'), false)).toBe(field('d'));
  });

  it('skips password fields unless the rule allows them', () => {
    setBody('<input id="a"><input id="b" type="password"><input id="c">');

    expect(findNextEditableField(document, field('a'), false)).toBe(field('c'));
    expect(findNextEditableField(document, field('a'), true)).toBe(field('b'));
  });

  it('includes contenteditable elements', () => {
    setBody('<input id="a"><div id="b" contenteditable="true"></div>');

    expect(findNextEditableField(document, field('a'), false)).toBe(field('b'));
  });

  it('skips elements with contenteditable="false"', () => {
    setBody('<input id="a"><div id="b" contenteditable="false"></div><input id="c">');

    expect(findNextEditableField(document, field('a'), false)).toBe(field('c'));
  });

  it('skips a bare contenteditable attribute with no value', () => {
    setBody('<input id="a"><div id="b" contenteditable></div><input id="c">');

    expect(findNextEditableField(document, field('a'), false)).toBe(field('c'));
  });

  it('skips a password field carrying contenteditable="true" when the rule forbids password fields', () => {
    setBody('<input id="a"><input id="b" type="password" contenteditable="true"><input id="c">');

    expect(findNextEditableField(document, field('a'), false)).toBe(field('c'));
  });

  it('returns the first field when the active element is not a field', () => {
    setBody('<button id="btn"></button><input id="a">');

    expect(findNextEditableField(document, field('btn'), false)).toBe(field('a'));
  });
});
