import {compileTopic} from '../compiler';
import * as scraper from '../scraper';
import * as config from '../config';
import * as parser from '../parser';

let topics: Element[];
let topic: Element;

beforeAll(async () => {
  topics = await scraper.scrapeTopics({
    testing: true,
    url: config.TESTURL,
  });
  topic = topics[0];
}, config.navigationTimeout);

describe('Scrape, parse and compile topic element', () => {
  test(`Topic list of ${config.TESTURL} has been retrieved`, () => {
    const expected = topics.length > 0;
    expect(expected).toBeTruthy();
  });

  test(`Title has been parsed`, () => {
    const content = parser.getTopicTitle(topic);
    expect(typeof content).toBe('string');
  });

  test(`Author has been parsed`, () => {
    const content = parser.getTopicAuthor(topic);
    expect(typeof content).toBe('string');
  });

  test(`Timestamp has been parsed`, () => {
    const content = parser.getTopicTimestamp(topic);
    expect(typeof content).toBe('number');
  });

  test(`Reply count has been parsed`, () => {
    const content = parser.getTopicReplyCount(topic);
    expect(typeof content).toBe('number');
  });

  test(`Tooltip has been parsed`, () => {
    const content = parser.getTopicTooltip(topic);
    expect(typeof content).toBe('string');
  });

  test(`'Topic' object has been compiled`, () => {
    const compiledTopic = compileTopic(topic);

    expect(typeof compiledTopic.pinned).toBe('boolean');
    expect(typeof compiledTopic.locked).toBe('boolean');
    expect(typeof compiledTopic.answered).toBe('boolean');
    expect(typeof compiledTopic.title).toBe('string');
    expect(typeof compiledTopic.author).toBe('string');
    expect(typeof compiledTopic.timestamp).toBe('number');
    expect(typeof compiledTopic.replyCount).toBe('number');
    expect(typeof compiledTopic.tooltip).toBe('string');
  });
});
