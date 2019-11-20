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

export const getElementFromHTML = (html: string, selector: string) => {
  const document = getDocument(html);
  const element = document.querySelector(selector);

  return element;
};

export const getElementsFromHTML = (html: string, selector: string) => {
  const document = getDocument(html);
  const elements = [...document.querySelectorAll(selector)];

  return elements;
};
