import * as scraper from '../scraper';
import * as config from '../config';
import * as parser from '../parser';
import {compileTopic} from '../compiler';

let topics: Element[];
let topic: Element;
let appTitle: string;

beforeAll(async () => {
  const data = await scraper.scrapeDiscussion({
    testing: true,
    appID: config.TEST_APPID,
  });
  topics = data.topics;
  topic = topics[0];
  appTitle = data.appTitle;
}, config.navigationTimeout);

test(`Title of AppID ${config.TEST_APPID} has been retrieved`, () => {
  const expected = appTitle !== "";
  expect(expected).toBeTruthy();
});

describe('Scrape, parse and compile topic element', () => {
  test(`Topic list of AppID ${config.TEST_APPID} has been retrieved`, () => {
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
