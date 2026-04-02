export interface Video {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  filePath: string;
  duration: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  category: string;
  tags: string;
  aiTags: string | null;
  aiSummary: string | null;
  aiQualityScore: number;
  status: 0 | 1 | 2;
  rejectReason: string | null;
  clicks: number;
  likes: number;
  coins: number;
  collects: number;
  comments: number;
  score: number;
  downloads: number;
  publishedAt: string | null;
  createdAt: string;
}

export interface VideoListQuery {
  page?: number;
  size?: number;
  refresh?: boolean;
  keyword?: string;
}

export interface VideoPublishForm {
  title: string;
  description?: string;
  category?: string;
  tags?: string;
  cover?: File;
  video?: File;
}
