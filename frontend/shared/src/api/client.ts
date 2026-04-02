import type { ApiResult } from '../types/api';
import type { UserInfo, LoginForm, RegisterForm, UpdateProfileForm } from '../types/user';
import type { Video } from '../types/video';
import type { Comment } from '../types/comment';
import type { PageResult, ActionStatus, HistoryItem, CollectItem, SigninStatus, Report, AdminStats, ReportForm } from '../types/api';

// Mock data
const mockVideos: Video[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `精彩视频 ${i + 1} - 绝对不容错过的内容`,
  description: `这是视频 ${i + 1} 的详细介绍，包含了丰富的内容和精彩的片段。`,
  coverUrl: `https://picsum.photos/seed/v${i + 1}/320/180`,
  filePath: `/api/video/file/${i + 1}`,
  duration: 120 + (i * 37) % 600,
  authorId: (i % 5) + 1,
  authorName: ['UP主小明', '游戏达人', '科技评测', '生活博主', '学习天地'][(i % 5)],
  authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i % 5}`,
  category: ['游戏', '科技', '生活', '学习', '音乐'][(i % 5)],
  tags: '游戏,攻略,教程',
  aiTags: ['热门,推荐', '必看,精选', '教程,新手向', '实用,技巧', '精彩,不容错过'][(i % 5)],
  aiSummary: `这是由AI自动生成的视频摘要，帮助观众快速了解视频的核心内容。本视频涵盖了重要的知识点。`,
  aiQualityScore: 0.6 + (i % 4) * 0.1,
  status: 1 as const,
  rejectReason: null,
  clicks: 1000 + i * 123,
  likes: 100 + i * 23,
  coins: 50 + i * 7,
  collects: 30 + i * 11,
  comments: 20 + i * 5,
  score: 5000 - i * 100,
  downloads: 100 + i * 5,
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const mockComments: Comment[] = [
  {
    id: 1,
    videoId: 1,
    userId: 2,
    username: '热心观众A',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    parentId: null,
    rootId: null,
    content: '这个视频太棒了！讲解得非常清楚，学到了很多。',
    likeCount: 128,
    replyCount: 2,
    sentimentScore: 0.92,
    sentimentLabel: 'POSITIVE',
    status: 1,
    createdAt: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: 2,
    videoId: 1,
    userId: 3,
    username: '热心观众B',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    parentId: 1,
    rootId: 1,
    content: '同意，确实很实用！',
    likeCount: 12,
    replyCount: 0,
    sentimentScore: 0.85,
    sentimentLabel: 'POSITIVE',
    status: 1,
    createdAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 3,
    videoId: 1,
    userId: 4,
    username: '游客用户',
    userAvatar: '',
    parentId: 1,
    rootId: 1,
    content: '内容一般吧，没有说的那么神。',
    likeCount: 5,
    replyCount: 0,
    sentimentScore: 0.45,
    sentimentLabel: 'NORMAL',
    status: 1,
    createdAt: new Date(Date.now() - 60000).toISOString(),
  },
];

const mockUsers: UserInfo[] = [
  {
    id: 1,
    username: 'testuser',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    role: 'CLIENT',
    status: 0,
    coins: 10,
    experience: 100,
    gender: 1,
    birthday: '2000-01-01',
    bio: '这是一个测试用户',
    createdAt: '2026-01-01T00:00:00Z',
    lastSignin: new Date().toISOString(),
  },
  {
    id: 99,
    username: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=99',
    role: 'ADMIN',
    status: 0,
    coins: 0,
    experience: 0,
    gender: 0,
    birthday: null,
    bio: '管理员',
    createdAt: '2026-01-01T00:00:00Z',
    lastSignin: new Date().toISOString(),
  },
];

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const client = {
  get: async <T>(url: string, _params?: Record<string, unknown>): Promise<ApiResult<T>> => {
    await delay();
    return { code: 200, msg: 'success', data: null as T };
  },
  post: async <T>(url: string, _data?: unknown): Promise<ApiResult<T>> => {
    await delay();
    return { code: 200, msg: 'success', data: null as T };
  },
  put: async <T>(url: string, _data?: unknown): Promise<ApiResult<T>> => {
    await delay();
    return { code: 200, msg: 'success', data: null as T };
  },
  delete: async <T>(url: string): Promise<ApiResult<T>> => {
    await delay();
    return { code: 200, msg: 'success', data: null as T };
  },
};

// User API
export async function userRegister(form: RegisterForm): Promise<ApiResult<UserInfo>> {
  await delay();
  const newUser: UserInfo = {
    id: Math.floor(Math.random() * 10000),
    username: form.username,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    role: 'CLIENT',
    status: 0,
    coins: 0,
    experience: 0,
    gender: 0,
    birthday: null,
    bio: '',
    createdAt: new Date().toISOString(),
    lastSignin: null,
  };
  return { code: 200, msg: '注册成功', data: newUser };
}

export async function userLogin(form: LoginForm): Promise<ApiResult<UserInfo>> {
  await delay();
  if (form.username === 'admin' && form.password === 'admin123') {
    return { code: 200, msg: '登录成功', data: mockUsers[1] };
  }
  return { code: 200, msg: '登录成功', data: { ...mockUsers[0], username: form.username } };
}

export async function userLogout(): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '已退出登录', data: undefined };
}

export async function getProfile(): Promise<ApiResult<UserInfo>> {
  await delay();
  return { code: 200, msg: 'success', data: mockUsers[0] };
}

export async function updateProfile(form: UpdateProfileForm): Promise<ApiResult<UserInfo>> {
  await delay();
  return {
    code: 200,
    msg: '修改成功',
    data: { ...mockUsers[0], ...form },
  };
}

export async function changePassword(_oldPassword: string, _newPassword: string): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '密码修改成功', data: undefined };
}

export async function deleteAccount(_password: string): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '账号已注销', data: undefined };
}

// Video API
export async function getVideoList(params: { page?: number; size?: number; refresh?: boolean }): Promise<ApiResult<PageResult<Video>>> {
  await delay();
  const page = params.page || 1;
  const size = params.size || 20;
  const start = (page - 1) * size;
  const list = mockVideos.slice(start, start + size);
  return {
    code: 200,
    msg: 'success',
    data: { list, total: mockVideos.length, page, size },
  };
}

export async function getVideoDetail(id: number): Promise<ApiResult<Video>> {
  await delay();
  const video = mockVideos.find((v) => v.id === id) || mockVideos[0];
  return { code: 200, msg: 'success', data: video };
}

export async function searchVideos(keyword: string, page = 1, size = 20): Promise<ApiResult<PageResult<Video>>> {
  await delay();
  const filtered = mockVideos.filter(
    (v) =>
      v.title.includes(keyword) ||
      v.aiTags?.includes(keyword) ||
      v.tags.includes(keyword)
  );
  const start = (page - 1) * size;
  const list = filtered.slice(start, start + size);
  return {
    code: 200,
    msg: 'success',
    data: { list, total: filtered.length, page, size },
  };
}

export async function publishVideo(_form: FormData): Promise<ApiResult<{ videoId: number }>> {
  await delay(800);
  return { code: 200, msg: '视频已提交，进入审核队列', data: { videoId: Math.floor(Math.random() * 10000) } };
}

export async function getMyVideos(): Promise<ApiResult<PageResult<Video>>> {
  await delay();
  const myVideos = mockVideos.slice(0, 5);
  return { code: 200, msg: 'success', data: { list: myVideos, total: myVideos.length, page: 1, size: 20 } };
}

export async function deleteVideo(id: number): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '删除成功', data: undefined };
}

// Action API
export async function toggleLike(videoId: number): Promise<ApiResult<{ liked: boolean }>> {
  await delay();
  return { code: 200, msg: 'success', data: { liked: true } };
}

export async function toggleCollect(videoId: number): Promise<ApiResult<{ collected: boolean }>> {
  await delay();
  return { code: 200, msg: 'success', data: { collected: true } };
}

export async function throwCoin(videoId: number): Promise<ApiResult<{ coins: number }>> {
  await delay();
  return { code: 200, msg: '投币成功', data: { coins: 9 } };
}

export async function getActionStatus(videoId: number): Promise<ApiResult<ActionStatus>> {
  await delay();
  return { code: 200, msg: 'success', data: { liked: false, collected: false, coined: false } };
}

// Comment API
export async function getCommentList(videoId: number): Promise<ApiResult<PageResult<Comment>>> {
  await delay();
  const comments = mockComments.filter((c) => c.videoId === videoId);
  return { code: 200, msg: 'success', data: { list: comments, total: comments.length, page: 1, size: 20 } };
}

export async function publishComment(form: { videoId: number; content: string; parentId?: number }): Promise<ApiResult<Comment>> {
  await delay();
  const newComment: Comment = {
    id: Math.floor(Math.random() * 10000),
    videoId: form.videoId,
    userId: mockUsers[0].id,
    username: mockUsers[0].username,
    userAvatar: mockUsers[0].avatar,
    parentId: form.parentId || null,
    rootId: form.parentId || null,
    content: form.content,
    likeCount: 0,
    replyCount: 0,
    sentimentScore: 0.8,
    sentimentLabel: 'POSITIVE',
    status: 1,
    createdAt: new Date().toISOString(),
  };
  return { code: 200, msg: '评论成功', data: newComment };
}

export async function deleteComment(commentId: number): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '删除成功', data: undefined };
}

export async function likeComment(commentId: number): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: 'success', data: undefined };
}

// History / Collect / Signin
export async function getHistory(page = 1, size = 20): Promise<ApiResult<PageResult<HistoryItem>>> {
  await delay();
  const items: HistoryItem[] = mockVideos.slice(0, 5).map((v, i) => ({
    id: i + 1,
    videoId: v.id,
    video: v,
    watchedAt: new Date(Date.now() - i * 3600000).toISOString(),
    watchDuration: 120,
  }));
  return { code: 200, msg: 'success', data: { list: items, total: items.length, page, size } };
}

export async function recordHistory(videoId: number): Promise<ApiResult<void>> {
  await delay(100);
  return { code: 200, msg: 'success', data: undefined };
}

export async function getCollectList(page = 1, size = 20): Promise<ApiResult<PageResult<CollectItem>>> {
  await delay();
  const items: CollectItem[] = mockVideos.slice(3, 8).map((v, i) => ({
    id: i + 1,
    videoId: v.id,
    video: v,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
  return { code: 200, msg: 'success', data: { list: items, total: items.length, page, size } };
}

export async function getSigninStatus(): Promise<ApiResult<SigninStatus>> {
  await delay();
  return { code: 200, msg: 'success', data: { signedToday: false, totalDays: 5, coinsEarnedToday: 0 } };
}

export async function doSignin(): Promise<ApiResult<SigninStatus>> {
  await delay();
  return { code: 200, msg: '签到成功，获得1枚硬币', data: { signedToday: true, totalDays: 6, coinsEarnedToday: 1 } };
}

// Admin API
export async function adminLogin(form: LoginForm): Promise<ApiResult<UserInfo>> {
  await delay();
  if (form.username === 'admin' && form.password === 'admin123') {
    return { code: 200, msg: '登录成功', data: mockUsers[1] };
  }
  return { code: 401, msg: '用户名或密码错误', data: null as unknown as UserInfo };
}

export async function getAdminStats(): Promise<ApiResult<AdminStats>> {
  await delay();
  return {
    code: 200,
    msg: 'success',
    data: { totalUsers: 1234, totalVideos: 567, pendingVideos: 23, pendingReports: 8 },
  };
}

export async function getPendingVideos(page = 1, size = 20): Promise<ApiResult<PageResult<Video>>> {
  await delay();
  const pending = mockVideos.slice(0, 8).map((v) => ({ ...v, status: 0 as const }));
  return { code: 200, msg: 'success', data: { list: pending, total: pending.length, page, size } };
}

export async function approveVideo(id: number): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '审核通过', data: undefined };
}

export async function rejectVideo(id: number, _reason: string): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '已驳回', data: undefined };
}

export async function getUserList(params: { page?: number; keyword?: string; status?: number }): Promise<ApiResult<PageResult<UserInfo>>> {
  await delay();
  const page = params.page || 1;
  const size = 20;
  let users = [...mockUsers];
  if (params.keyword) {
    users = users.filter((u) => u.username.includes(params.keyword!));
  }
  if (params.status !== undefined && params.status !== -1) {
    users = users.filter((u) => u.status === params.status);
  }
  return { code: 200, msg: 'success', data: { list: users, total: users.length, page, size } };
}

export async function banUser(id: number): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '已封禁该用户', data: undefined };
}

export async function unbanUser(id: number): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '已解除封禁', data: undefined };
}

export async function getReportList(page = 1, size = 20): Promise<ApiResult<PageResult<Report>>> {
  await delay();
  const reports: Report[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    reporterId: i + 10,
    reporterName: `举报人${i + 1}`,
    videoId: i + 1,
    videoTitle: `被举报视频 ${i + 1}`,
    reasonType: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
    reasonDetail: '详细内容描述',
    status: i < 3 ? 0 : 1,
    handlerId: null,
    handleResult: null,
    handledAt: null,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));
  return { code: 200, msg: 'success', data: { list: reports, total: reports.length, page, size } };
}

export async function ignoreReport(id: number, _note: string): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '已忽略', data: undefined };
}

export async function takedownReport(id: number, _note: string): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '已下架视频', data: undefined };
}

export async function reportVideo(form: ReportForm): Promise<ApiResult<void>> {
  await delay();
  return { code: 200, msg: '举报已提交，感谢反馈', data: undefined };
}

// AI search suggestions
export async function getSearchSuggestions(keyword: string): Promise<string[]> {
  await delay(500);
  const suggestions: Record<string, string[]> = {
    游戏: ['原神', '塞尔达', '艾尔登法环', '黑神话悟空', '我的世界'],
    教程: ['Python入门', 'React教程', 'Java基础', '人工智能', '机器学习'],
    音乐: ['周杰伦', '最新单曲', '钢琴曲', '吉他弹唱', '电音'],
  };
  for (const [key, value] of Object.entries(suggestions)) {
    if (keyword.includes(key)) return value;
  }
  return ['热门推荐', '最新视频', '精选内容', '不容错过', '必看教程'];
}
