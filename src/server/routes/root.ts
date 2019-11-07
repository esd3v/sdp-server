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

export const root = async (req, res) => {

  const ws = req.app.ws;

  const missingParameters = getMissingParameters(req.query, PARAMETERS);

  if (missingParameters.length) {
    return errors.missingParameters(res, missingParameters);
  }

  const appID = req.query[PARAMETERS[0]] * 1;
  const page = req.query[PARAMETERS[1]] * 1;
  const perPage = req.query[PARAMETERS[2]] * 1;

  const getPageTotal = () =>
    calculatePageCount({
      perPage,
      total: getCache().topics.length,
    });

  if (!validateAppID(appID)) {
    return errors.appIDIsNotInteger(res);
  } else if (!validatePageNumber(page)) {
    return errors.pageIsNotInteger(res);
  } else if (!validatePerPageNumber(perPage)) {
    return errors.perPageIsNotInteger(res);
  } else if (!validateAllowedPerPageNumber(perPage, config.PERPAGE)) {
    return errors.incorrectPerPage(res);
  }

  if (appID !== getCache().appID) {
    try {
      const topics = await scrapeTopics({
        testing: false,
        appID,
        ws,
      });

      if (ws) {
        ws.send('Parsing scraped topics...');
      }
      const compiledTopics = compileTopics(topics);

      setCache({
        appID,
        topics: compiledTopics,
      });
    } catch (err) {
      console.error(`Error: ${err.message}`);
      return (err instanceof ElementError) ?
        errors.parseError(res, err.message) :
        errors.invalidPage(res);
    }
  }

  if (!validatePageRange(page, getPageTotal())) {
    return errors.noSuchPage(res);
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

  if (ws) {
    ws.send('Done');
  }

  return res.send(content);
};
