import * as attributes from '../selectors/attributes';
import * as classes from '../selectors/classes';
import * as config from '../config';
import {browserConfig} from '../config';
import {
  getTopicElements,
  getContainerElement,
} from '../parser/elements';
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

export const scrapeTopics = async (options: {
  url: string;
  testing: boolean;
  ws: WebSocket;
}): Promise<Element[]> => {
  const browser = await createBrowser(browserConfig);
  const page = await createPage(browser, {
    url: options.url,
    viewport: {
      width: 1280,
      height: 720,
    },
    defaultNavigationTimeout: config.navigationTimeout,
  });
  const ws = options.ws;

  try {
    const topics: Element[] = [];

    // Don't do these actions if testing, just scrape opened page
    if (!options.testing) {
      // Go to the first page
      await clickAndWaitForNavigation(page, classes.pageLinkFirst);

      // Set max topics per page
      await clickAndWaitForNavigation(page, classes.setTopicsCount50);
    }

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
      ws.send(`Scraping page ${i} / ${pageCount}`);
      const containerElement = getContainerElement(await getPageHTML(page));
      const elements = getTopicElements(containerElement);

      topics.push(...elements);
      if (i !== pageCount) {
        await clickAndWaitForNavigation(page, attributes.nextButton);
      }
    }

    await browser.close();
    return topics;
  } catch (err) {
    await browser.close();
    throw err;
  }
};
