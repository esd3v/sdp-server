export const trimWhiteSpace = (str: string) => str.replace(/\s+/g, ' ').trim();

export const nodeListToArray = (list: NodeListOf<Element>) => [...list];

export const getPageCount = ({perPage, itemsTotal}: {
  perPage: number;
  itemsTotal: number;
}) => Math.trunc((itemsTotal + (perPage - 1)) / perPage);

export const getPageData = ({topics, page, perPage}: {
    topics: Topic[];
    page: number;
    perPage: number;
  }) => {
  const offset = (page - 1) * perPage;
  return topics.slice(offset, offset + perPage);
};
