import {ElementError} from './helpers';

export const elementDoesntExist = (selector: string) =>
  new ElementError(`Element with selector '${selector}' doesn't exist`);

export const elementsDontExist = (selector: string) =>
  new ElementError(`Elements with selector '${selector}' don't exist`);

export const attributeDoesntExist = (selector: string) =>
  new ElementError(`Attribute with name '${selector}' doesn't exist`);

export const attributeContentHasNotBeenParsed = (selector: string) =>
  new ElementError(`Content of '${selector}' attribute has not been parsed`);
