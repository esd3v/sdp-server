let cache: TopicsCache = {
  url: '',
  topics: [],
};

export const getCache = () => cache;

export const setCache = (params: TopicsCache) =>
  cache = ({
    ...getCache(),
    ...params,
  });
