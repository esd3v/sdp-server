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

describe('Parse data from scraped topic element', () => {
  test(`Title has been parsed`, () => {
    const content = parser.getTopicTitle(topicElement);
    expect(typeof content).toBe('string');
  });

  test(`Author has been parsed`, () => {
    const content = parser.getTopicAuthor(topicElement);
    expect(typeof content).toBe('string');
  });

  test(`Timestamp has been parsed`, () => {
    const content = parser.getTopicTimestamp(topicElement);
    expect(typeof content).toBe('number');
  });

  test(`Reply count has been parsed`, () => {
    const content = parser.getTopicReplyCount(topicElement);
    expect(typeof content).toBe('number');
  });

  test(`Tooltip has been parsed`, () => {
    const content = parser.getTopicTooltip(topicElement);
    expect(typeof content).toBe('string');
  });
});

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
