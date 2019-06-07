import * as parser from './parser/index';

export const compileTopic = (topic: Element): Topic => ({
  pinned: parser.isTopicPinned(topic),
  locked: parser.isTopicLocked(topic),
  answered: parser.isTopicAnswered(topic),
  title: parser.getTopicTitle(topic),
  author: parser.getTopicAuthor(topic),
  timestamp: parser.getTopicTimestamp(topic),
  replyCount: parser.getTopicReplyCount(topic),
  tooltip: parser.getTopicTooltip(topic),
  url: parser.getTopicLink(topic),
});

export const compileTopics = (list: Element[]): Topic[] =>
  list.map(element => compileTopic(element));
