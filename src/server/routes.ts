import * as errors from './errors';
import * as config from '../config';
import {compileTopics} from '../compiler';
import {scrapeTopics} from '../scraper/index';
import {
  calculatePageCount,
  getItemsFromPage,
} from '../misc';
import {
  validatePageNumber,
  validatePerPageNumber,
  validatePageRange,
} from './validations';
import {
  getCache,
  setCache,
} from './cache';

export const root = async (ctx: any) => {
  const url = ctx.query.url;
  const page =  parseInt(ctx.query.page, 10);
  const perPage =  parseInt(ctx.query.perPage, 10);

  const getPageTotal = () => calculatePageCount({
    perPage,
    total: getCache().topics.length,
  });

  if (!validatePageNumber(page)) {
    return errors.pageIsNaN(ctx);
  } else if (!validatePerPageNumber(perPage, config.PERPAGE)) {
    return errors.incorrectPerPage(ctx);
  }

  if (url !== getCache().url) {
    try {
      const topics = await scrapeTopics({
        testing: false,
        url,
      });
      const compiledTopics = compileTopics(topics);

      setCache({
        url,
        topics: compiledTopics,
      });
    } catch ({message}) {
      console.error(message);
      return errors.invalidPage(ctx);
    }
  }

  if (!validatePageRange(page, getPageTotal())) {
    return errors.noSuchPage(ctx);
  }

  const content = {
    pageTotal: getPageTotal(),
    topics: getItemsFromPage({
      arr: getCache().topics,
      page,
      perPage,
    }),
  };

  return ctx.body = content;
};
