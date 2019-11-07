import {PERPAGE} from '../config';

const sendError = (res: any, status: number, {code, message}: {
  code: number;
  message: string;
}) => {
  res.status(status);
  return res.send({
    code,
    message,
  });
};

export const appIDIsNotInteger = (res: any) =>
  sendError(res, 500, {
    code: 1,
    message: `'appID' must be an integer`,
  });

export const pageIsNotInteger = (res: any) =>
  sendError(res, 500, {
    code: 2,
    message: `'page' must be an integer`,
  });

export const perPageIsNotInteger = (res: any) =>
  sendError(res, 500, {
    code: 3,
    message: `'perPage' must be an integer`,
  });

export const noSuchPage = (res: any) =>
  sendError(res, 500, {
    code: 4,
    message: 'No such page',
  });

export const invalidPage = (res: any) =>
  sendError(res, 500, {
    code: 5,
    message: `Couldn't parse the page`,
  });

export const incorrectPerPage = (res: any) =>
  sendError(res, 500, {
    code: 6,
    message: `Incorrect 'perPage' number. Correct values: ${PERPAGE.toString()}`,
  });

export const missingParameters = (res: any, params: string[]) =>
  sendError(res, 500, {
    code: 7,
    message: `Missing required parameters: ${params.join(', ')}`,
  });

export const parseError = (res: any, message: string) =>
  sendError(res, 500, {
    code: 8,
    message,
  });
