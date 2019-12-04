let cache: DiscussionCache = {
  appID: 0,
  appTitle: '',
  topics: [],
};

export const getCache = () => cache;

export const setCache = (params: DiscussionCache) =>
  cache = ({
    ...getCache(),
    ...params,
  });
