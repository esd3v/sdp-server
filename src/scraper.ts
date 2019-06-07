import puppeteer from 'puppeteer';
import * as attributes from './selectors/attributes';
import * as classes from './selectors/classes';
import {browserConfig} from './config';
import {getTopicElements, getContainerElement} from './parser/elements';
import {
  hasPagination,
  getLastPageNumber,
  getCurrentPageNumber,
} from './parser/parsers';

export const getTopicList = async ({testing, url}: GetHTML) => {
  // Browser config
  ////////////////////////////////////////////
  const browser = await puppeteer.launch(browserConfig);
  const page = await browser.newPage();

  page.setViewport({
    width: 1280,
    height: 720,
  });

  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  const clickAndWait = async (selector: string) => {
    try {
      await page.click(selector);
      return page.waitForNavigation({
        waitUntil: 'networkidle0',
      });
    } catch {
      throw new Error(`Couldn't click on '${selector}' element`);
    }
  };

  // Get initial HTML
  const getPageHTML = () =>
    page.evaluate(() =>
      document.documentElement && document.documentElement.innerHTML);

  // Start scraping
  //////////////////////////////////////
  try {
    const topicList: Element[] = [];

    // Don't do these actions if testing, just scrape opened page
    if (!testing) {
      // Go to the first page
      await clickAndWait(classes.pageLinkFirst);

      // Set max topics per page
      await clickAndWait(classes.setTopicsCount50);
    }

    const pageHTML = await getPageHTML();
    const containerElement = getContainerElement(pageHTML);

    const pageCount =
      testing ? 1 : hasPagination(containerElement) ?
      getLastPageNumber(containerElement) : 1;
    const currentPageNumber =
      testing ? 1 : hasPagination(containerElement) ?
      getCurrentPageNumber(containerElement) : 1;

    for (let i = currentPageNumber; i <= pageCount; i++) {
      topicList.push(...getTopicElements(containerElement));
      if (i !== pageCount) {
        await clickAndWait(attributes.nextButton);
      }
    }

    await browser.close();
    return topicList;
  } catch (err) {
    await browser.close();
    throw err;
  }
};
