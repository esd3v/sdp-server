import * as errors from '../errors';
import * as config from '../../config';
import {compileTopics} from '../../compiler';
import {ElementError} from '../../parser/helpers';
import {scrapeTopics} from '../../scraper/index';
import {
  calculatePageCount,
  getItemsFromPage,
  getMissingParameters,
} from '../../misc';
import {
  validateAppID,
  validatePageNumber,
  validatePerPageNumber,
  validateAllowedPerPageNumber,
  validatePageRange,
} from '../validations';
import {
  getCache,
  setCache,
} from '../cache';

const PARAMETERS = ['appID', 'page', 'perPage'];

export const root = async (ctx: any) => {

  const missingParameters = getMissingParameters(ctx.query, PARAMETERS);

  if (missingParameters.length) {
    return errors.missingParameters(ctx, missingParameters);
  }

  const appID = ctx.query[PARAMETERS[0]] * 1;
  const page = ctx.query[PARAMETERS[1]] * 1;
  const perPage = ctx.query[PARAMETERS[2]] * 1;

  const getPageTotal = () =>
    calculatePageCount({
      perPage,
      total: getCache().topics.length,
    });

  if (!validateAppID(appID)) {
    return errors.appIDIsNotInteger(ctx);
  } else if (!validatePageNumber(page)) {
    return errors.pageIsNotInteger(ctx);
  } else if (!validatePerPageNumber(perPage)) {
    return errors.perPageIsNotInteger(ctx);
  } else if (!validateAllowedPerPageNumber(perPage, config.PERPAGE)) {
    return errors.incorrectPerPage(ctx);
  }

  if (appID !== getCache().appID) {
    try {
      const topics = await scrapeTopics({
        testing: false,
        appID,
        ws: ctx.ws,
      });

      if (ctx.ws) {
        ctx.ws.send('Parsing scraped topics...');
      }
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

  if (ctx.ws) {
    ctx.ws.send('Done');
  }

  return ctx.body = content;
};
