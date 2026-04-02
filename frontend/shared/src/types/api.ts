export interface ApiResult<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface ActionStatus {
  liked: boolean;
  collected: boolean;
  coined: boolean;
}

export interface HistoryItem {
  id: number;
  videoId: number;
  video: import('./video').Video;
  watchedAt: string;
  watchDuration: number;
}

export interface CollectItem {
  id: number;
  videoId: number;
  video: import('./video').Video;
  createdAt: string;
}

export interface SigninStatus {
  signedToday: boolean;
  totalDays: number;
  coinsEarnedToday: number;
}

export interface ReportForm {
  videoId: number;
  reasonType: 1 | 2 | 3 | 4 | 5;
  reasonDetail?: string;
}

export interface Report {
  id: number;
  reporterId: number;
  reporterName: string;
  videoId: number;
  videoTitle: string;
  reasonType: 1 | 2 | 3 | 4 | 5;
  reasonDetail: string | null;
  status: 0 | 1;
  handlerId: number | null;
  handleResult: string | null;
  handledAt: string | null;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  pendingVideos: number;
  pendingReports: number;
}

export interface UserExportItem {
  id: number;
  username: string;
  role: 'CLIENT' | 'ADMIN';
  status: 0 | 1;
  coins: number;
  experience: number;
  createdAt: string;
  lastSignin: string | null;
}
