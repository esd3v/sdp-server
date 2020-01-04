import WebSocket from 'ws';
import * as attributes from '../selectors/attributes';
import * as classes from '../selectors/classes';
import * as config from '../config';
import * as wsMessages from '../wsMessages';
import * as errors from './errors';
import {browserConfig} from '../config';
import {getDiscussionURL} from '../misc';
import {
  getTopicElements,
  getAppTitle,
  getContainerElement,
} from '../parser';
import {
  hasPagination,
  getLastPageNumber,
  getCurrentPageNumber,
} from '../parser/index';
import {
  createBrowser,
  createPage,
  getPageHTML,
  clickAndWaitForNavigation,
} from './helpers';

interface ScrapedData {
  appTitle: string;
  topics: Element[];
}

export const scrapeDiscussion = async (options: {
  appID: number;
  testing: boolean;
  ws?: WebSocket;
}): Promise<ScrapedData> => {
  const ws = options.ws;
  const discussionURL = getDiscussionURL(options.appID);

  if (ws) {
    ws.send(wsMessages.preparingToScrape(discussionURL));
  }

  const browser = await createBrowser(browserConfig);
  const page = await createPage(browser, {
    url: discussionURL,
    viewport: {
      width: 1280,
      height: 720,
    },
    defaultNavigationTimeout: config.navigationTimeout,
  });

  if (page.url() === `${config.URL_HOME}/`) {
    throw errors.appDoesntExist(options.appID);
  }

  try {
    const data: ScrapedData = {
      appTitle: '',
      topics: [],
    };

    // Don't do these actions if testing, just scrape opened page
    if (!options.testing) {
      // Go to the first page
      await clickAndWaitForNavigation(page, classes.pageLinkFirst);

      // Set perPage 50 for fast scraping.
      // For some reason steam page has less total topics with perPage 50, than perPage 15
      await clickAndWaitForNavigation(page, classes.setTopicsCount50);
    }

    const appTitle = getAppTitle(await getPageHTML(page));
    const containerElement = getContainerElement(await getPageHTML(page));

    const pageCount =
      options.testing ?
        1 : hasPagination(containerElement) ?
          getLastPageNumber(containerElement) : 1;

    const currentPageNumber =
      options.testing ?
        1 : hasPagination(containerElement) ?
          getCurrentPageNumber(containerElement) : 1;

    for (let i = currentPageNumber; i <= pageCount; i++) {
      if (ws) {
        ws.send(wsMessages.scrapingPage(i, pageCount));
      }
      const containerElement = getContainerElement(await getPageHTML(page));
      const elements = getTopicElements(containerElement);

      data.topics.push(...elements);
      if (i !== pageCount) {
        await clickAndWaitForNavigation(page, attributes.nextButton);
      }
    }

    data.appTitle = appTitle;

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
};
