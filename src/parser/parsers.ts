import * as selectors from '../selectors';
import {trimWhitespace} from '../misc';
import {
  getTitleElement,
  getAuthorElement,
  getTimestampElement,
  getReplyCountElement,
  getLinkElement,
} from './elements';
import {getAttributeContentFromParent} from './helpers';
import {attributeContentHasNotBeenParsed} from './errors';

export const isTopicPinned = (topic: Element) =>
  topic.classList.contains(selectors.sticky);

export const isTopicLocked = (topic: Element) =>
  topic.classList.contains(selectors.locked);

export const isTopicAnswered = (topic: Element) =>
  topic.querySelector(selectors.answered) !== null;

export const getTopicTitle = (topic: Element): string => {
  const element = getTitleElement(topic);
  const childNodes = element.childNodes;
  const textNode = childNodes[childNodes.length - 1] as Text;
  const text = textNode.data;
  const trimmed = trimWhitespace(text);

  return trimmed;
};

export const getTopicAuthor = (topic: Element) => {
  const element = getAuthorElement(topic);
  const text = element.innerHTML;
  const trimmed = trimWhitespace(text);

  return trimmed;
};

export const getTopicTimestamp = (topic: Element) => {
  const element = getTimestampElement(topic);
  const content = getAttributeContentFromParent(element, selectors.timestampAttribute);
  const trimmed = parseInt(trimWhitespace(content), 10);

  return trimmed;
};

export const getTopicReplyCount = (topic: Element) => {
  const element = getReplyCountElement(topic);
  const textNode = element.childNodes[2] as Text;
  const text = textNode.data;
  const trimmed = parseInt(trimWhitespace(text), 10);

  return trimmed;
};

export const getTopicTooltip = (topic: Element) => {
  const content = getAttributeContentFromParent(topic, selectors.tooltip);
  const regex = new RegExp(`(?<=<div class="topic_hover_text">).*?(?=<\/div)`, 'gs');
  const match = content.match(regex);

  if (match) {
    return trimWhitespace(match[0]);
  } else {
    throw new Error(attributeContentHasNotBeenParsed(selectors.tooltip));
  }
};

export const getTopicLink = (topic: Element) => {
  const element = getLinkElement(topic);
  const text = getAttributeContentFromParent(element, 'href');
  const trimmed = trimWhitespace(text);

  return trimmed;
};
