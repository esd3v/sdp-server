import * as classes from '../selectors/classes';
import * as attributes from '../selectors/attributes';
import {
  getElementFromParent,
  getElementFromHTML,
  getElementsFromParent,
} from './helpers';

export const getContainerElement = (html: string) =>
  getElementFromHTML(html, classes.container);

export const getPageLinkElement = (container: Element) =>
  getElementFromParent(container, classes.pageLink);

export const getLastPageLinkElement = (container: Element) =>
  getElementFromParent(container, classes.pageLinkLast);

export const getCurrentPageLinkElement = (container: Element) =>
  getElementFromParent(container, classes.pageLinkCurrent);

export const getTopicElements = (container: Element) =>
  getElementsFromParent(container, classes.topic);

export const getTitleElement = (topic: Element) =>
  getElementFromParent(topic, classes.title);

export const getAuthorElement = (topic: Element) =>
  getElementFromParent(topic, classes.author);

export const getTimestampElement = (topic: Element) =>
  getElementFromParent(topic, `[${attributes.timestamp}]`);

export const getReplyCountElement = (topic: Element) =>
  getElementFromParent(topic, classes.replycount);

export const getTopicLinkElement = (topic: Element) =>
  getElementFromParent(topic, classes.topicLink);
