import {PERPAGE} from '../config';

const HTTPError = (ctx: any, status: number, params: {
  [key in string]: any;
}) => {
  ctx.status = status;
  ctx.body = params;
  return ctx;
};

const createError = (ctx: any, status: number, {code, message}: {
  code: number;
  message: string;
}) => HTTPError(ctx, status, {
  code,
  message,
});

export const pageIsNaN = (ctx: any) =>
  createError(ctx, 500, {
    code: 1,
    message: 'Page is not a number',
  });

export const noSuchPage = (ctx: any) =>
  createError(ctx, 500, {
    code: 2,
    message: 'No such page',
  });

export const invalidPage = (ctx: any) =>
  createError(ctx, 500, {
    code: 3,
    message: `Couldn't parse the page`,
  });

export const incorrectPerPage = (ctx: any) =>
  createError(ctx, 500, {
    code: 4,
    message: `Incorrect 'perPage' number. Correct values: ${PERPAGE.toString()}`,
  });

export const missingParameters = (ctx: any, params: string[]) =>
  createError(ctx, 500, {
    code: 5,
    message: `Missing required parameters: ${params.join(', ')}`,
  });

export const parseError = (ctx: any, message: string) =>
  createError(ctx, 500, {
    code: 7,
    message,
  });
