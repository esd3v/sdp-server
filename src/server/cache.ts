let cache: TopicsCache = {
  appID: 0,
  topics: [],
};

export const getCache = () => cache;

export const setCache = (params: TopicsCache) =>
  cache = ({
    ...getCache(),
    ...params,
  });
