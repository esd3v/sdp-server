const createMessage = (params: {
  type: 'status' | 'progress' | 'misc';
  message: string;
}) => JSON.stringify(params);

export const createStatusMessage = (message: string) =>
  createMessage({
    type: 'status',
    message,
  });

export const createProgressMessage = (message: string) =>
  createMessage({
    type: 'progress',
    message,
  });

  export const createMiscMessage = (message: string) =>
  createMessage({
    type: 'misc',
    message,
  });

export const wsOpened =
  createStatusMessage('opened');

export const preparingToScrape = (url: string) =>
  createProgressMessage(`Preparing to scrape ${url}`);

export const scrapingPage = (page: number, total: number) =>
  createProgressMessage(`Scraping page ${page} / ${total}`);

export const parsing =
  createProgressMessage('Parsing scraped topics...');

export const done =
  createProgressMessage('Done.');
