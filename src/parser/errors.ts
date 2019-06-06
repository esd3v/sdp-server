export const elementDoesntExist = (selector: string) =>
  `Element with selector '${selector}' doesn't exist`;

export const elementsDontExist = (selector: string) =>
  `Elements with selector '${selector}' don't exist`;

export const attributeDoesntExist = (selector: string) =>
  `Attribute with name '${selector}' doesn't exist`;

export const attributeContentHasNotBeenParsed = (selector: string) =>
  `Content of '${selector}' attribute has not been parsed`;
