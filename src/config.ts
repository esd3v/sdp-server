import puppeteer from 'puppeteer';

export const HOST = '0.0.0.0';
export const PORT = 8080;
export const WSPORT = 8081;
export const TEST_APPID = 323190;
export const PERPAGE = [15, 30, 50];
export const URL_HOME = 'https://store.steampowered.com';
export const URL_DISCUSSION = 'https://steamcommunity.com';

export const navigationTimeout = 60 * 1000;
export const browserConfig: puppeteer.LaunchOptions = {
  headless: true,
  slowMo: 0,
  args: [
    '--no-sandbox',
  ],
};
