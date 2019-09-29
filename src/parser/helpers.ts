import {JSDOM} from 'jsdom';
import * as errors from './errors';

export class ElementError extends Error {
  constructor(message: string, public selector?: string) {
    super(message);
    this.name = this.constructor.name;
    this.selector = selector;
  }
}

export const getDocument = (html: string) =>
  (new JSDOM(html)).window.document;

export const getElementFromParent = (parent: Document | Element, selector: string) => {
  const element = parent.querySelector(selector);

  if (element) {
    return element;
  } else {
    throw errors.elementDoesntExist(selector);
  }
};

export const getElementsFromParent = (parent: Document | Element, selector: string) => {
  const elements = parent.querySelectorAll(selector);
  const converted = [...elements];

  if (elements.length) {
    return converted;
  } else {
    throw errors.elementsDontExist(selector);
  }
};

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

export const getAttributeContentFromParent = (parent: Element, attribute: string) => {
  const content = parent.getAttribute(attribute);

  if (content) {
    return content;
  } else {
    throw errors.attributeDoesntExist(attribute);
  }
};
