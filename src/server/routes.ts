import * as errors from './errors';
import * as config from '../config';
import {compileTopics} from '../compiler';
import {scrapeTopics} from '../scraper/index';
import {
  calculatePageCount,
  getItemsFromPage,
  getMissingParameters,
  getDiscussionURL,
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

const PARAMETERS = ['appID', 'page', 'perPage'];

export const root = async (ctx: any) => {

  const missingParameters = getMissingParameters(ctx.query, PARAMETERS);

  if (missingParameters.length) {
    return errors.missingParameters(ctx, missingParameters);
  }

  const appID: number = parseInt(ctx.query[PARAMETERS[0]], 10);
  const page: number =  parseInt(ctx.query[PARAMETERS[1]], 10);
  const perPage: number =  parseInt(ctx.query[PARAMETERS[2]], 10);

  const discussionURL = getDiscussionURL(appID);

  const getPageTotal = () =>
    calculatePageCount({
      perPage,
      total: getCache().topics.length,
    });

  if (!validatePageNumber(page)) {
    return errors.pageIsNaN(ctx);
  } else if (!validatePerPageNumber(perPage, config.PERPAGE)) {
    return errors.incorrectPerPage(ctx);
  }

  if (appID !== getCache().appID) {
    try {
      const topics = await scrapeTopics({
        testing: false,
        url: discussionURL,
      });
      const compiledTopics = compileTopics(topics);

      setCache({
        appID,
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
