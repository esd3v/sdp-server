import * as selectors from '../selectors';
import {
  getElementsFromHTML,
  getElementFromParent,
} from './helpers';

export const getTopicElements = (html: string) =>
  getElementsFromHTML(html, selectors.topic);

export const getTitleElement = (topic: Element) =>
  getElementFromParent(topic, selectors.title);

export const getAuthorElement = (topic: Element) =>
  getElementFromParent(topic, selectors.author);

export const getTimestampElement = (topic: Element) =>
  getElementFromParent(topic, selectors.timestampContainer);

export const getReplyCountElement = (topic: Element) =>
  getElementFromParent(topic, selectors.replycount);

export const getTooltipElement = (topic: Element) =>
  getElementFromParent(topic, selectors.tooltip);

export const getLinkElement = (topic: Element) =>
  getElementFromParent(topic, selectors.topicLink);
