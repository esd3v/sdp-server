import * as selectors from '../selectors';
import {compileTopic} from '../compiler';
import * as scraper from '../scraper';
import * as config from '../config';
import * as parser from '../parser';

let topicList: Element[];
let topicElement: Element;

beforeAll(async () => {
  topicList = await scraper.getTopicList({
    testing: true,
    url: config.TESTURL,
  });
  topicElement = topicList[0];
}, config.TIMEOUT);

test(`Topic list of ${config.TESTURL} has been retrieved`, async () => {
  const expected = topicList.length > 0;
  expect(expected).toBeTruthy();
}, config.TIMEOUT);

test(`'Topic' object has been compiled`, () => {
  const topic = compileTopic(topicElement);
  expect(typeof topic.pinned).toBe('boolean');
  expect(typeof topic.locked).toBe('boolean');
  expect(typeof topic.answered).toBe('boolean');
  expect(typeof topic.title).toBe('string');
  expect(typeof topic.author).toBe('string');
  expect(typeof topic.timestamp).toBe('number');
  expect(typeof topic.replyCount).toBe('number');
  expect(typeof topic.tooltip).toBe('string');
});

describe('Parse data from scraped topic element', () => {
  test(`'Title' of '${selectors.title}' has been parsed`, () => {
    const content = parser.parseTitle(topicElement);
    expect(typeof content).toBe('string');
  });

  test(`'Author' of '${selectors.author}' has been parsed`, () => {
    const content = parser.parseAuthor(topicElement);
    expect(typeof content).toBe('string');
  });

  test(`'Timestamp' of '${selectors.timestampContainer}' has been parsed`, () => {
    const content = parser.parseTimestamp(topicElement);
    expect(typeof content).toBe('number');
  });

  test(`'Reply Count' of '${selectors.replycount}' has been parsed`, () => {
    const content = parser.parseReplyCount(topicElement);
    expect(typeof content).toBe('number');
  });

  test(`'Tooltip' of '${selectors.tooltipRegex}' has been parsed`, () => {
    const content = parser.parseTooltip(topicElement);
    expect(typeof content).toBe('string');
  });
});
