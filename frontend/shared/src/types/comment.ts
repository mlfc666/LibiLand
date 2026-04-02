export type SentimentLabel = 'POSITIVE' | 'NORMAL' | 'NEGATIVE';

export interface Comment {
  id: number;
  videoId: number;
  userId: number;
  username: string;
  userAvatar: string;
  parentId: number | null;
  rootId: number | null;
  content: string;
  likeCount: number;
  replyCount: number;
  sentimentScore: number;
  sentimentLabel: SentimentLabel;
  status: 0 | 1 | 2 | 3;
  createdAt: string;
  replies?: Comment[];
}

export interface PublishCommentForm {
  videoId: number;
  content: string;
  parentId?: number | null;
}
