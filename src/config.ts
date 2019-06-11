import puppeteer from 'puppeteer';

export const HOST = '0.0.0.0';
export const PORT = 8080;
export const TESTURL = 'https://steamcommunity.com/app/323190/discussions/1/';
export const PERPAGE = [15, 30, 50];

export const navigationTimeout = 35 * 1000;
export const browserConfig: puppeteer.LaunchOptions = {
  headless: true,
  slowMo: 0,
  args: [
    '--no-sandbox',
  ],
};
