import * as errors from '../errors';
import * as config from '../../config';
import {compileTopics} from '../../compiler';
import {ElementError} from '../../parser/helpers';
import {scrapeDiscussion} from '../../scraper/index';
import * as webSocket from '../../webSocket';
import * as wsMessages from '../../wsMessages';
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

  let ws;
  const sessionID = req.headers['x-session-id'];
  const missingParameters = getMissingParameters(req.query, PARAMETERS);

  if (sessionID) {
    ws = webSocket.getSocket(sessionID);
  }

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
      const {topics, appTitle} = await scrapeDiscussion({
        testing: false,
        appID,
        ws,
      });

      if (ws) {
        ws.send(wsMessages.parsing);
      }

      const compiledTopics = compileTopics(topics);

      setCache({
        appID,
        appTitle,
        topics: compiledTopics,
      });

      if (ws) {
        ws.send(wsMessages.done);
      }
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
    appTitle: getCache().appTitle,
    pageTotal: getPageTotal(),
    topicTotal: getCache().topics.length,
    topics: getItemsFromPage({
      arr: getCache().topics,
      page,
      perPage,
    }),
  };

  return res.send(content);
};
