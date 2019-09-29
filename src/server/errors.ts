import {PERPAGE} from '../config';

const HTTPError: HTTPError = (ctx, params) => {
  ctx.status = params.status;
  ctx.body = {
    code: params.code,
    title: params.title,
  };
  return ctx;
};

const HTTPError500: HTTPError = (ctx, params) =>
  HTTPError(ctx, {
    ...params,
    status: 500,
  });

export const pageIsNaN = (ctx: any) =>
  HTTPError500(ctx, {
    code: 1,
    title: 'Page is not a number',
  });

export const noSuchPage = (ctx: any) =>
  HTTPError500(ctx, {
    code: 2,
    title: 'No such page',
  });

export const invalidPage = (ctx: any) =>
  HTTPError500(ctx, {
    code: 3,
    title: `Couldn't parse the page`,
  });

export const incorrectPerPage = (ctx: any) =>
  HTTPError500(ctx, {
    code: 4,
    title: `Incorrect 'perPage' number. Correct values: ${PERPAGE.toString()}`,
  });

export const missingParameters = (ctx: any, params: string[]) =>
  HTTPError500(ctx, {
    code: 5,
    title: `Missing required parameters: ${params.join(', ')}`,
  });

export const parseError = (ctx: any, title: string) =>
  HTTPError500(ctx, {
    code: 7,
    title,
  });
