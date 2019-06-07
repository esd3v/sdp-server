import puppeteer from 'puppeteer';
import {
  couldntClick,
} from './errors';

export const getPageHTML = (page: puppeteer.Page) =>
  page.evaluate(() => document.documentElement.innerHTML);

export const createBrowser = (options: puppeteer.LaunchOptions) =>
  puppeteer.launch(options);

export const createPage = async (browser: puppeteer.Browser, options: {
  url: string;
  viewport: Viewport;
  defaultNavigationTimeout: number;
}) => {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(options.defaultNavigationTimeout);
  await page.goto(options.url, {
    waitUntil: 'networkidle0',
  });
  await page.setViewport(options.viewport);

  return page;
};

export const clickAndWaitForNavigation = async (page: puppeteer.Page, selector: string) => {
  try {
    return await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      page.click(selector),
    ]);
  } catch (err) {
    throw new Error(couldntClick(selector, err));
  }
};
