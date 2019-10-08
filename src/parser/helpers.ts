import {JSDOM} from 'jsdom';

export class ElementError extends Error {
  constructor(message: string, public selector?: string) {
    super(message);
    this.name = this.constructor.name;
    this.selector = selector;
  }
}

export const getDocument = (html: string) =>
  (new JSDOM(html)).window.document;

export const getElementFromParent = (parent: Document | Element, selector: string) =>
  parent.querySelector(selector);

export const getElementsFromParent = (parent: Document | Element, selector: string) =>
  [...parent.querySelectorAll(selector)];

export const getElementFromHTML = (html: string, selector: string) => {
  const document = getDocument(html);
  const element = getElementFromParent(document, selector);

  return element;
};

export const getElementsFromHTML = (html: string, selector: string) => {
  const document = getDocument(html);
  const elements = getElementsFromParent(document, selector);

  return elements;
};

export const getAttributeContentFromParent = (parent: Element, attribute: string) =>
  parent.getAttribute(attribute);
