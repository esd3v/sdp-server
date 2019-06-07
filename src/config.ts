import puppeteer from 'puppeteer';

export const PORT = 8080;
export const TIMEOUT = 1.5 * 60 * 1000;
export const TESTURL = 'https://steamcommunity.com/app/323190/discussions/1/';
export const PERPAGE = [15, 30, 50];

export const navigationTimeout = 35 * 1000;
export const browserConfig: puppeteer.LaunchOptions = {
  headless: true,
  slowMo: 0,
};
