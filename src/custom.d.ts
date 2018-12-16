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
  url: string;
  topics: Topic[];
}

interface GetHTML {
  testing: boolean;
  url: string;
}

type HTTPError = (ctx: any, params: {
  status?: number;
  code: number;
  title: string;
}) => any;
