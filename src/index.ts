import Koa from 'koa';
import logger from 'koa-morgan';
import Router from 'koa-router';
import bodyParser from 'koa-better-body';
import {compileTopics} from './compiler';
import {getTopicList} from './scraper';
import * as httpErrors from './httpErrors';
import {
  PORT,
  PERPAGE,
} from './config';
import {
  getPageCount,
  getPageData,
} from './misc';

let cache: TopicsCache = {
  url: '',
  topics: [],
};

const server = new Koa();
const router = new Router();

const headers = async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
  });
  await next();
};

router.get('/', async ctx => {
  const url = ctx.query.url;
  const page =  parseInt(ctx.query.page, 10);
  const perPage =  parseInt(ctx.query.perPage, 10);

  const getCache = (params: TopicsCache) => ({
    ...cache,
    ...params,
  });

  const getPageTotal = () => getPageCount({
    perPage,
    itemsTotal: cache.topics.length,
  });

  // Validation
  if (!Number.isInteger(page)) {
    return httpErrors.pageIsNaN(ctx);
  } else if (!PERPAGE.includes(perPage)) {
    return httpErrors.incorrectPerPage(ctx);
  }

  if (url !== cache.url) {
    try {
      const topicList = await getTopicList({
        testing: false,
        url,
      });
      cache = getCache({
        url,
        topics: compileTopics(topicList),
      });
    } catch ({message}) {
      console.error(message);
      return httpErrors.invalidPage(ctx);
    }
  }

  // Validation
  if (!((page > 0) && (page <= getPageTotal()))) {
    return httpErrors.noSuchPage(ctx);
  }

  const content = {
    pageTotal: getPageTotal(),
    topics: getPageData({
      topics: cache.topics,
      page,
      perPage,
    }),
  };

  return ctx.body = content;
});

server
  .use(logger('tiny'))
  .use(bodyParser())
  .use(headers)
  .use(router.routes())
  .listen(PORT);
