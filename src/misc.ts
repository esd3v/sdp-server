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
