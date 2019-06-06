import * as classes from '../selectors/classes';
import * as attributes from '../selectors/attributes';
import {
  getElementsFromHTML,
  getElementFromParent,
} from './helpers';

export const getTopicElements = (html: string) =>
  getElementsFromHTML(html, classes.topic);

export const getTitleElement = (topic: Element) =>
  getElementFromParent(topic, classes.title);

export const getAuthorElement = (topic: Element) =>
  getElementFromParent(topic, classes.author);

export const getTimestampElement = (topic: Element) =>
  getElementFromParent(topic, `[${attributes.timestamp}]`);

export const getReplyCountElement = (topic: Element) =>
  getElementFromParent(topic, classes.replycount);

export const getLinkElement = (topic: Element) =>
  getElementFromParent(topic, classes.topicLink);
