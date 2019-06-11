import Koa from 'koa';
import logger from 'koa-morgan';
import Router from 'koa-router';
import bodyParser from 'koa-better-body';
import * as config from '../config';
import * as routes from './routes';

const server = new Koa();
const router = new Router();

const headers = async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
  });
  await next();
};

export const start = () => {
  router.get('/', routes.root);

  return server
    .use(logger('tiny'))
    .use(bodyParser())
    .use(headers)
    .use(router.routes())
    .listen(process.env.PORT || config.PORT, config.HOST);
};
