import * as parser from './parser';

export const compileTopic = (topic: Element): Topic => ({
  pinned: parser.parseIsPinned(topic),
  locked: parser.parseIsLocked(topic),
  answered: parser.parseIsAnswered(topic),
  title: parser.parseTitle(topic),
  author: parser.parseAuthor(topic),
  timestamp: parser.parseTimestamp(topic),
  replyCount: parser.parseReplyCount(topic),
  tooltip: parser.parseTooltip(topic),
  url: parser.parseTopicLink(topic),
});

export const compileTopics = (list: Element[]): Topic[] =>
  list.map(element => compileTopic(element));
