import puppeteer from 'puppeteer';
import {browserConfig} from './config';
import {getDocument} from './parser/helpers';
import * as selectors from './selectors';
import {getTopicElements} from './parser/elements';

const hasPagination = (html: string) => {
  const document = getDocument(html);
  return (document.querySelector(selectors.pageLink)) ? true : false;
};

// Get topics container, contains topic list and pagination
const getContainerHTML = (html: string) => {
  const document = getDocument(html);
  const container = document.querySelector(selectors.container);
  if (container) {
    return container.innerHTML;
  } else {
    throw new Error(`Element with selector '${selectors.container}' doesn't exist`);
  }
};

const innerHTMLToInt = (html: string, selector: string) => {
  const document = getDocument(html);
  const el = document.querySelector(selector);
  if (el) {
    return parseInt(el.innerHTML, 10);
  } else {
    throw new Error(`Element with selector '${selector}' doesn't exist`);
  }
};

const getLastPageNumber = (html: string) =>
  innerHTMLToInt(html, selectors.pageLinkLast);

const getCurrentPageNumber = (html: string) =>
  innerHTMLToInt(html, selectors.pageLinkCurrent);

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
      await clickAndWait(selectors.pageLinkFirst);

      // Set max topics per page
      await clickAndWait(selectors.setTopicsCount50);
    }

    const containerHTML = getContainerHTML(await getPageHTML());
    const pageCount =
      testing ? 1 : hasPagination(containerHTML) ?
      getLastPageNumber(containerHTML) : 1;
    const currentPageNumber =
      testing ? 1 : hasPagination(containerHTML) ?
      getCurrentPageNumber(containerHTML) : 1;

    for (let i = currentPageNumber; i <= pageCount; i++) {
      topicList.push(...getTopicElements(await getPageHTML()));
      if (i !== pageCount) {
        await clickAndWait(selectors.nextButton);
      }
    }

    await browser.close();
    return topicList;
  } catch (err) {
    await browser.close();
    throw err;
  }
};
