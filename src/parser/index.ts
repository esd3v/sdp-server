import * as classes from '../selectors/classes';
import * as attributes from '../selectors/attributes';
import * as errors from './errors';
import * as helpers from './helpers';
import {trimWhitespace} from '../misc';

export const getContainerElement = (html: string) => {
  const element = helpers.getElementFromHTML(html, classes.container);

  if (element) {
    return element;
  } else {
    throw errors.elementDoesntExist(classes.container);
  }
};

export const getTopicElements = (container: Element) => {
  const elements = [...container.querySelectorAll(classes.topic)];

  if (elements.length) {
    return elements;
  } else {
    throw errors.elementDoesntExist(classes.topic);
  }
};

export const getLastPageNumber = (container: Element) => {
  const element = container.querySelector(classes.pageLinkLast);

  if (element) {
    return parseInt(element.innerHTML, 10);
  } else {
    throw errors.elementDoesntExist(classes.pageLinkLast);
  }
};

export const getCurrentPageNumber = (container: Element) => {
  const element = container.querySelector(classes.pageLinkCurrent);

  if (element) {
    return parseInt(element.innerHTML, 10);
  } else {
    throw errors.elementDoesntExist(classes.pageLinkCurrent);
  }
};

export const hasPagination = (container: Element) => {
  const element = container.querySelector(classes.pageLink);

  if (element) {
    return true;
  } else {
    throw errors.elementDoesntExist(classes.pageLink);
  }
};

export const isTopicPinned = (topic: Element) =>
  topic.classList.contains(classes.sticky);

export const isTopicLocked = (topic: Element) =>
  topic.classList.contains(classes.locked);

export const isTopicAnswered = (topic: Element) =>
  topic.querySelector(classes.answered) !== null;

export const getTopicTitle = (topic: Element): string => {
  const element = topic.querySelector(classes.title);

  if (element) {
    const childNodes = element.childNodes;
    const textNode = childNodes[childNodes.length - 1] as Text;
    const text = textNode.data;
    const trimmed = trimWhitespace(text);
    return trimmed;
  } else {
    throw errors.elementDoesntExist(classes.title);
  }
};

export const getTopicAuthor = (topic: Element) => {
  const element = topic.querySelector(classes.author);

  if (element) {
    const text = element.innerHTML;
    const trimmed = trimWhitespace(text);
    return trimmed;
  } else {
    throw errors.elementDoesntExist(classes.author);
  }
};

export const getTopicTimestamp = (topic: Element) => {
  const element = topic.querySelector(`[${attributes.timestamp}]`);

  if (element) {
    const content = element.getAttribute(attributes.timestamp);

    if (content) {
      return parseInt(trimWhitespace(content), 10);
    } else {
      throw errors.attributeDoesntExist(attributes.timestamp);
    }
  } else {
    throw errors.elementDoesntExist(`[${attributes.timestamp}]`);
  }
};

export const getTopicReplyCount = (topic: Element) => {
  const element = topic.querySelector(classes.replycount);

  if (element) {
    const textNode = element.childNodes[2] as Text;
    const text = textNode.data;
    const trimmed = parseInt(trimWhitespace(text), 10);
    return trimmed;
  } else {
    throw errors.elementDoesntExist(classes.replycount);
  }
};

export const getTopicTooltip = (topic: Element) => {
  const content = topic.getAttribute(attributes.tooltip);

  if (content) {
    const regex = new RegExp(`(?<=<div class="topic_hover_text">).*?(?=<\/div)`, 'gs');
    const match = content.match(regex);

    if (match) {
      return trimWhitespace(match[0]);
    } else {
      throw errors.attributeContentHasNotBeenParsed(attributes.tooltip);
    }
  } else {
    throw errors.attributeDoesntExist(attributes.tooltip);
  }
};

export const getTopicLink = (topic: Element) => {
  const element = topic.querySelector(classes.topicLink);

  if (element) {
    const text = element.getAttribute('href');

    if (text) {
      return trimWhitespace(text);
    } else {
      throw errors.attributeDoesntExist('href');
    }
  } else {
    throw errors.elementDoesntExist(classes.topicLink);
  }
};
