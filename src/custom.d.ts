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

interface Viewport {
  width: number;
  height: number;
}
