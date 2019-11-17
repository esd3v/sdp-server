import {URL_DISCUSSION} from './config';

export const trimWhitespace = (str: string) => str.replace(/\s+/g, ' ').trim();

export const calculatePageCount = ({perPage, total}: {
  perPage: number;
  total: number;
}) => Math.trunc((total + (perPage - 1)) / perPage);

export const getItemsFromPage = ({arr, page, perPage}: {
    arr: any[];
    page: number;
    perPage: number;
  }) => {
  const offset = (page - 1) * perPage;
  return arr.slice(offset, offset + perPage);
};

export const getMissingParameters = (retrieved: string[], required: string[]) => {
  const arr: string[] = [];

  for (const param of required) {
    if (!Object.keys(retrieved).includes(param)) {
      arr.push(param);
    }
  }
  return arr;
};

export const getDiscussionURL = (appID: number) =>
  `${URL_DISCUSSION}/app/${appID}/discussions/`;
