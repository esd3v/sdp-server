import * as misc from './misc';
import * as selectors from './selectors';
import {JSDOM} from 'jsdom';

export const getDocument = (html: string) => {
  const {window} = new JSDOM(html);
  const {document} = window;
  return document;
};

export const getTopicNodes = (html: string) => {
  const document = getDocument(html);
  return misc.nodeListToArray(document.querySelectorAll(selectors.topic));
};

export const parseIsPinned = (topic: Element) =>
  topic.classList.contains(selectors.sticky);

export const parseIsLocked = (topic: Element) =>
  topic.classList.contains(selectors.locked);

export const parseIsAnswered = (topic: Element) =>
  topic.querySelector(selectors.answered) !== null;

export const parseTitle = (topic: Element) => {
  const container = topic.querySelector(selectors.title);
  if (container) {
    const childNodes = container.childNodes;
    const textNode = childNodes[childNodes.length - 1] as Text;
    return misc.trimWhiteSpace(textNode.data);
  } else {
    throw new Error(`Element with selector '${selectors.title}' doesn't exist`);
  }
};

export const parseAuthor = (topic: Element) => {
  const container = topic.querySelector(selectors.author);
  if (container) {
    return misc.trimWhiteSpace(container.innerHTML);
  } else {
    throw new Error(`Element with selector '${selectors.author}' doesn't exist`);
  }
};

export const parseTimestamp = (topic: Element) => {
  const container = topic.querySelector(selectors.timestampContainer);
  if (container) {
    const content = container.getAttribute(selectors.timestampAttribute);
    if (content) {
      return parseInt(misc.trimWhiteSpace(content), 10);
    } else {
      throw new Error(`Attribute with name '${selectors.timestampAttribute}' doesn't exist`);
    }
  } else {
    throw new Error(`Element with selector '${selectors.timestampContainer}' doesn't exist`);
  }
};

export const parseReplyCount = (topic: Element) => {
  const container = topic.querySelector(selectors.replycount);
  if (container) {
    const textNode = container.childNodes[2] as Text;
    const text = textNode.data;
    return parseInt(misc.trimWhiteSpace(text), 10);
  } else {
    throw new Error(`Element with selector '${selectors.replycount}' doesn't exist`);
  }
};

export const parseTooltip = (topic: Element) => {
  const text = topic.getAttribute(selectors.tooltip);
  if (text) {
    const regex = new RegExp(`(?<=<div class="${selectors.tooltipRegex}">).*?(?=<\/div)`, 'gs');
    const match = text.match(regex);
    if (match) {
      return misc.trimWhiteSpace(match[0]);
    } else {
      throw new Error(`Attribute with regexp '${selectors.tooltipRegex}' has not been parsed`);
    }
  } else {
    throw new Error(`Attribute with name '${selectors.tooltip}' doesn't exist`);
  }
};

export const parseTopicLink = (topic: Element) => {
  const container = topic.querySelector(selectors.topicLink);
  if (container) {
    const content = container.getAttribute('href');
    if (content) {
      return misc.trimWhiteSpace(content);
    } else {
      throw new Error(`Attribute with name 'href' doesn't exist`);
    }
  } else {
    throw new Error(`Element with selector '${selectors.author}' doesn't exist`);
  }
};
