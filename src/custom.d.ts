interface Topic {
  pinned: boolean;
  locked: boolean;
  answered: boolean;
  title: string;
  author: string;
  timestamp: number;
  replyCount: number;
  tooltip: string;
  url: string;
}

interface TopicsCache {
  appID: number;
  topics: Topic[];
}

type HTTPError = (ctx: any, params: {
  status?: number;
  code: number;
  title: string;
}) => any;

interface Viewport {
  width: number;
  height: number;
}
