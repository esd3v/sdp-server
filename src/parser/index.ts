import * as classes from '../selectors/classes';
import * as attributes from '../selectors/attributes';
import {trimWhitespace} from '../misc';
import {
  getTitleElement,
  getAuthorElement,
  getTimestampElement,
  getReplyCountElement,
  getTopicLinkElement,
  getPageLinkElement,
  getLastPageLinkElement,
  getCurrentPageLinkElement,
} from './elements';
import {getAttributeContentFromParent} from './helpers';
import {attributeContentHasNotBeenParsed} from './errors';

export const getLastPageNumber = (container: Element) => {
  const parent = getLastPageLinkElement(container);
  const parsed = parseInt(parent.innerHTML, 10);

  return parsed;
};

export const getCurrentPageNumber = (container: Element) => {
  const parent = getCurrentPageLinkElement(container);
  const parsed = parseInt(parent.innerHTML, 10);

  return parsed;
};

export const hasPagination = (container: Element) =>
  getPageLinkElement(container) && true;

export const isTopicPinned = (topic: Element) =>
  topic.classList.contains(classes.sticky);

export const isTopicLocked = (topic: Element) =>
  topic.classList.contains(classes.locked);

export const isTopicAnswered = (topic: Element) =>
  topic.querySelector(classes.answered) !== null;

export const getTopicTitle = (topic: Element): string => {
  const parent = getTitleElement(topic);
  const childNodes = parent.childNodes;
  const textNode = childNodes[childNodes.length - 1] as Text;
  const text = textNode.data;
  const trimmed = trimWhitespace(text);

  return trimmed;
};

export const getTopicAuthor = (topic: Element) => {
  const parent = getAuthorElement(topic);
  const text = parent.innerHTML;
  const trimmed = trimWhitespace(text);

  return trimmed;
};

export const getTopicTimestamp = (topic: Element) => {
  const parent = getTimestampElement(topic);
  const content = getAttributeContentFromParent(parent, attributes.timestamp);
  const trimmed = parseInt(trimWhitespace(content), 10);

  return trimmed;
};

export const getTopicReplyCount = (topic: Element) => {
  const parent = getReplyCountElement(topic);
  const textNode = parent.childNodes[2] as Text;
  const text = textNode.data;
  const trimmed = parseInt(trimWhitespace(text), 10);

  return trimmed;
};

export const getTopicTooltip = (topic: Element) => {
  const parent = getAttributeContentFromParent(topic, attributes.tooltip);
  const regex = new RegExp(`(?<=<div class="topic_hover_text">).*?(?=<\/div)`, 'gs');
  const match = parent.match(regex);

  if (match) {
    return trimWhitespace(match[0]);
  } else {
    throw new Error(attributeContentHasNotBeenParsed(attributes.tooltip));
  }
};

export const getTopicLink = (topic: Element) => {
  const parent = getTopicLinkElement(topic);
  const text = getAttributeContentFromParent(parent, 'href');
  const trimmed = trimWhitespace(text);

  return trimmed;
};
