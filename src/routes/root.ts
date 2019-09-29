import * as errors from '../server/errors';
import * as config from '../config';
import {compileTopics} from '../compiler';
import {ElementError} from '../parser/helpers';
import {scrapeTopics} from '../scraper/index';
import {
  calculatePageCount,
  getItemsFromPage,
  getMissingParameters,
} from '../misc';
import {
  validatePageNumber,
  validatePerPageNumber,
  validatePageRange,
} from '../server/validations';
import {
  getCache,
  setCache,
} from '../server/cache';

const PARAMETERS = ['appID', 'page', 'perPage'];

export const root = async (ctx: any) => {

  const missingParameters = getMissingParameters(ctx.query, PARAMETERS);

  if (missingParameters.length) {
    return errors.missingParameters(ctx, missingParameters);
  }

  const appID: number = parseInt(ctx.query[PARAMETERS[0]], 10);
  const page: number =  parseInt(ctx.query[PARAMETERS[1]], 10);
  const perPage: number =  parseInt(ctx.query[PARAMETERS[2]], 10);

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
        appID,
        ws: ctx.ws,
      });

      ctx.ws.send('Parsing scraped topics...');
      const compiledTopics = compileTopics(topics);

      setCache({
        appID,
        topics: compiledTopics,
      });
    } catch (err) {
      console.error(`Error: ${err.message}`);
      return (err instanceof ElementError) ?
        errors.parseError(ctx, err.message) :
        errors.invalidPage(ctx);
    }
  }

  if (!validatePageRange(page, getPageTotal())) {
    return errors.noSuchPage(ctx);
  }

  const content = {
    pageTotal: getPageTotal(),
    topicTotal: getCache().topics.length,
    topics: getItemsFromPage({
      arr: getCache().topics,
      page,
      perPage,
    }),
  };

  ctx.ws.send('Done');
  return ctx.body = content;
};
