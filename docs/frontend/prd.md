# 《哩哔哩哔》前端产品需求文档（PRD）

| 属性 | 内容 |
|---|---|
| **文档版本** | V2.1 |
| **文档状态** | 正式版 |
| **所属项目** | 哩哔哩哔（LiBiliBi） |
| **技术定位** | React 19 + TypeScript + Tailwind CSS + DaisyUI + Zustand，monorepo 架构 |
| **开发周期** | 2026-04-02 ~ 2026-04-13 |

---

## 一、整体架构

### 1.1 Monorepo 结构

```
frontend/                          # pnpm workspace 根目录
├── pnpm-workspace.yaml            # 工作空间配置
├── shared/                        # 共享包（被 user 和 admin 共用）
│   ├── package.json
│   └── src/
│       ├── api/                  # 统一 HTTP 封装
│       ├── components/           # 通用 UI 组件
│       ├── hooks/                # 通用 Hooks
│       ├── utils/                # 工具函数
│       └── styles/               # 全局样式变量
├── user/                       # 用户端（面向普通用户）
│   ├── package.json              # 依赖声明，引用 @libiland/shared
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx               # 路由 + 布局
│       ├── main.tsx
│       └── pages/                # 用户端页面组件
└── admin/                         # 管理端（面向管理员）
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        └── pages/                # 管理端页面组件
```

### 1.2 分层架构

前端工程按职责分为四层，从底向上依赖：

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer（用户端/管理端）               │
│    user/src/pages/        admin/src/pages/            │
│    页面组件：HomePage         AdminDashboard             │
│              VideoDetail      AuditListPage              │
│              SearchPage       UserManagePage             │
├─────────────────────────────────────────────────────────┤
│                 Business Layer（shared/components）      │
│    VideoCard    CommentTree    HeaderNav    CoinInput   │
│    AiTagBadge   SentimentBar   ConfirmDialog           │
├─────────────────────────────────────────────────────────┤
│                    API Layer（shared/api）               │
│    client.ts    user.ts    video.ts    comment.ts      │
│    action.ts    admin.ts    ai.ts                       │
├─────────────────────────────────────────────────────────┤
│               Infrastructure Layer（shared/utils）        │
│    format.ts    storage.ts    sentiment.ts   result.ts │
│    styles/variables.css                              │
└─────────────────────────────────────────────────────────┘
```

| 层级 | 所在位置 | 说明 |
|---|---|---|
| **UI Layer** | `user/src/` / `admin/src/` | 各端独有的页面组件，按路由组织 |
| **Business Layer** | `shared/src/components/` | 可复用的 UI 组件，两端通用 |
| **API Layer** | `shared/src/api/` | Axios 封装 + 所有接口定义 |
| **Infrastructure Layer** | `shared/src/utils/` + `shared/src/styles/` | 纯函数工具、CSS 变量 |

### 1.3 技术栈

| 类别 | 技术选型 | 说明 |
|---|---|---|
| **包管理器** | pnpm + workspace | Monorepo 管理，shared 作为本地依赖 |
| **核心框架** | React 19 + TypeScript | 函数组件 + Hooks + 类型安全 |
| **构建工具** | Vite | 极速开发服务器，热更新 |
| **CSS 框架** | Tailwind CSS | Utility-First 原子化样式 |
| **UI 组件库** | DaisyUI | 基于 Tailwind 的组件库 |
| **状态管理** | Zustand | 轻量级、TypeScript 友好 |
| **路由管理** | React Router v6 | SPA 路由控制 |
| **HTTP 客户端** | Axios | 统一请求/响应拦截 |
| **图标库** | Lucide React | 统一风格图标 |
| **图表** | Recharts | 数据统计展示（可选） |

### 1.4 技术约束

> **注**：可以使用 AI 辅助学习 React/Tailwind/DaisyUI 语法和组件用法，但**严禁直接使用 AI 生成完整业务代码**。

---

## 二、共享层详解（shared）

### 2.1 shared/src/api/ — HTTP 请求层

#### 2.1.1 client.ts（Axios 实例）

**职责：** 所有 HTTP 请求的根实例，统一拦截器配置。

**功能特点：**
- `baseURL`：读取环境变量 `VITE_API_BASE_URL`
- **请求拦截器**：自动从 `sessionStorage` 读取 `SESSION_ID`，附加到 `X-Session-Id` header
- **响应拦截器**：
  - 成功（`code === 200`）：直接返回 `data` 部分
  - `code === 401`：清除登录态 → 跳转 `/user/login`
  - `code !== 200`：reject，带业务错误消息

```typescript
// shared/src/api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
});

// 请求拦截：附加 Session ID
client.interceptors.request.use((config) => {
  const sessionId = sessionStorage.getItem('SESSION_ID');
  if (sessionId) config.headers['X-Session-Id'] = sessionId;
  return config;
});

// 响应拦截：统一解包 + 错误处理
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { code, msg } = error.response?.data || {};
    if (code === 401) {
      sessionStorage.removeItem('SESSION_ID');
      window.location.href = '/user/login';
    }
    return Promise.reject({ code, msg, status: error.response?.status });
  }
);

export default client;
```

#### 2.1.2 接口模块清单

| 文件 | 导出函数 | 说明 |
|---|---|---|
| `user.ts` | `userRegister`, `userLogin`, `userLogout`, `getProfile`, `updateProfile`, `changePassword`, `deleteAccount` | 用户模块接口 |
| `video.ts` | `getVideoList`, `getVideoDetail`, `searchVideos`, `publishVideo`, `getMyVideos`, `deleteVideo` | 视频模块接口 |
| `action.ts` | `toggleLike`, `toggleCollect`, `throwCoin`, `getActionStatus` | 互动接口 |
| `comment.ts` | `getCommentList`, `publishComment`, `deleteComment`, `likeComment` | 评论接口 |
| `history.ts` | `getHistory`, `recordHistory` | 历史记录接口 |
| `collect.ts` | `getCollectList` | 收藏接口 |
| `signin.ts` | `getSigninStatus`, `doSignin` | 签到接口 |
| `admin.ts` | `adminLogin`, `getPendingVideos`, `approveVideo`, `rejectVideo`, `getUserList`, `banUser`, `unbanUser`, `getReportList`, `ignoreReport`, `takedownReport` | 管理端接口 |
| `ai.ts` | `getSearchSuggestions` | AI 搜索建议（前端直调） |

#### 2.1.3 统一错误处理

| 后端 code | 前端行为 |
|---|---|
| 200 | 成功，返回 data |
| 400 | `toast.error(msg)` |
| 401 | 清除 session，跳转登录页 |
| 403 | `toast.error(msg)`（封禁/无权限）|
| 409 | `toast.warning(msg)`（重复操作）|
| 500 | `toast.error('系统异常，请稍后重试')` |

---

### 2.2 shared/src/components/ — 通用 UI 组件

| 组件 | 说明 | 关键 Props |
|---|---|---|
| `VideoCard` | 视频卡片，含封面/AI标签/数据条 | `video: Video`, `onClick?: () => void` |
| `CommentItem` | 单条评论，含情感进度条 | `comment: Comment`, `onReply?`, `onDelete?`, `canDelete?: boolean` |
| `CommentTree` | 评论树（楼中楼结构） | `comments: Comment[]`, `videoAuthorId: number`, `onReply?`, `onDelete?` |
| `UserAvatar` | 圆形头像，默认显示首字母 | `src?: string`, `size?: 'sm' \| 'md' \| 'lg'`, `userId?: number` |
| `AiTagBadge` | AI标签徽章，点击跳转标签搜索 | `tag: string`, `onClick?: (tag: string) => void` |
| `SentimentBar` | 情感指数进度条（0.0~1.0）| `score: number`, `label?: SentimentLabel` |
| `CoinInput` | 投币组件，显示余额 | `videoId: number`, `userCoins: number`, `onSuccess?: () => void` |
| `HeaderNav` | 顶部导航栏，含搜索框 | `keyword?: string`, `onSearch?: (kw: string) => void` |
| `StatusBadge` | 审核状态徽章 | `status: 0 \| 1 \| 2` |
| `ConfirmDialog` | 确认对话框（DaisyUI modal）| `open: boolean`, `title: string`, `message: string`, `onConfirm`, `onCancel` |

#### 2.2.1 VideoCard 组件

```tsx
interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

// 布局结构：
// ┌──────────────┐
// │    Cover     │ ← 16:9 封面，hover scale-105，显示播放图标
// │   3:45       │ ← 时长徽章，右下角
// │ [#AI][#游戏] │ ← AI 标签，最多显示3个
// ├──────────────┤
// │ 视频标题...  │ ← 单行截断，hover 显示完整 title
// │ UP主 · 播放  │ ← 头像 + 昵称 + 播放数
// └──────────────┘
```

#### 2.2.2 SentimentBar 组件（AI 情感可视化）

**重要说明：** 后端返回 `sentimentLabel` 为英文枚举，前端组件层统一使用后端枚举值，仅在 UI 层做中文标签和颜色映射。

```tsx
// shared/src/components/SentimentBar.tsx
import type { SentimentLabel } from '../types/comment';

interface SentimentBarProps {
  score: number;                        // 0.0 ~ 1.0
  label?: SentimentLabel;               // 'POSITIVE' | 'NORMAL' | 'NEGATIVE'
}

// 颜色映射规则（与后端枚举一致）
// POSITIVE (0.8~1.0) → 绿色 progress + 😊 标签"优质内容"
// NORMAL   (0.2~0.8) → 黄色 progress + 😐 标签"一般"
// NEGATIVE (0.0~0.2) → 红色 progress + 😠 标签"劣质内容"
```

---

### 2.3 shared/src/hooks/ — 通用 Hooks

| Hook | 说明 | 返回值 |
|---|---|---|
| `useInfiniteScroll` | 无限滚动加载 | `{ data, loading, hasMore, loadMore, refresh }` |
| `useDebounce` | 防抖 Hook | `T`（延迟更新后的值）|
| `useAi` | AI 能力封装 | `{ getSearchSuggestions, loading }` |
| `useAuth` | 鉴权状态管理（复用 Zustand store）| `useUserStore` 的所有状态和方法 |

---

### 2.4 shared/src/utils/ — 工具函数

| 文件 | 导出函数 | 说明 |
|---|---|---|
| `format.ts` | `formatDuration`, `formatDate`, `formatRelativeTime`, `formatNumber`, `formatFileSize` | 格式化工具 |
| `sentiment.ts` | `getSentimentConfig` | 情感评分 → 颜色/标签/图标映射 |
| `result.ts` | `handleApiError`, `isAuthError` | 统一错误处理 |
| `storage.ts` | `getSessionId`, `setSessionId`, `removeSessionId` | Session 存储管理 |

---

### 2.5 shared/src/styles/ — 全局样式

```css
/* shared/src/styles/variables.css */
:root {
  /* 主色调 */
  --color-primary: #00a1d6;
  --color-secondary: #f45b69;

  /* 响应式断点 */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

---

### 2.6 shared/src/types/ — 类型定义

| 文件 | 类型 | 说明 |
|---|---|---|
| `user.ts` | `UserInfo`, `LoginForm`, `RegisterForm`, `UpdateProfileForm` | 用户类型 |
| `video.ts` | `Video`, `VideoListQuery`, `VideoPublishForm` | 视频类型 |
| `comment.ts` | `Comment`, `PublishCommentForm`, `SentimentLabel` | 评论类型 |
| `api.ts` | `ApiResult<T>`, `PageResult<T>`, `ActionStatus` | API 通用类型 |

```typescript
// shared/src/types/api.ts
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
```

---

### 2.7 Zustand Store（shared/src/store/）

#### 2.7.1 userStore

```typescript
// shared/src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../types/user';

interface UserStore {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  updateCoins: (delta: number) => void;
}

// 两端均可从 shared 导入同一个 store 实例
export const useUserStore = create(
  persist<UserStore>((set) => ({
    userInfo: null,
    isLoggedIn: false,
    isAdmin: false,

    login: (userInfo) => set({
      userInfo,
      isLoggedIn: true,
      isAdmin: userInfo.role === 'ADMIN',
      // 写入 sessionStorage，供 client.ts 拦截器读取
    }),

    logout: () => set({ userInfo: null, isLoggedIn: false, isAdmin: false }),

    updateCoins: (delta) => set(state => ({
      userInfo: state.userInfo
        ? { ...state.userInfo, coins: state.userInfo.coins + delta }
        : null,
    })),
  }), { name: 'user-storage' })
);
```

#### 2.7.2 playerStore

```typescript
// shared/src/store/playerStore.ts
export const usePlayerStore = create((set) => ({
  currentVideo: null,
  isPlaying: false,
  watchDuration: 0,
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setWatchDuration: (d) => set({ watchDuration: d }),
}));
```

---

## 三、用户端详解（user）

### 3.1 页面清单

| 页面 | 路由 | 所需权限 | 说明 |
|---|---|---|---|
| `HomePage` | `/` | 公开 | 首页推荐视频列表 |
| `VideoDetailPage` | `/video/detail/:id` | 公开 | 视频播放 + 评论 |
| `SearchPage` | `/video/search?keyword=` | 公开 | 搜索结果 + AI 建议 |
| `LoginPage` | `/user/login` | 公开 | 用户登录 |
| `RegisterPage` | `/user/register` | 公开 | 用户注册 |
| `ProfilePage` | `/user/profile` | 登录 | 个人信息 + 修改 |
| `PublishPage` | `/video/publish` | 登录 | 发布视频 |
| `MyVideosPage` | `/video/my` | 登录 | 我的视频管理 |
| `HistoryPage` | `/history` | 登录 | 历史记录 |
| `CollectPage` | `/collect` | 登录 | 我的收藏 |

### 3.2 路由守卫

```tsx
// user/src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from '@libiland/shared';

// 公开路由
<Route path="/" element={<HomePage />} />
<Route path="/video/detail/:id" element={<VideoDetailPage />} />
<Route path="/video/search" element={<SearchPage />} />
<Route path="/user/login" element={<LoginPage />} />
<Route path="/user/register" element={<RegisterPage />} />

// 需登录
<Route path="/video/publish" element={
  <ProtectedRoute><PublishPage /></ProtectedRoute>
} />
<Route path="/user/profile" element={
  <ProtectedRoute><ProfilePage /></ProtectedRoute>
} />

// ProtectedRoute 实现
function ProtectedRoute({ children }) {
  const isLoggedIn = useUserStore(s => s.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/user/login" replace />;
  return children;
}
```

### 3.3 页面详细设计

#### 3.3.1 首页（HomePage）

**路由：** `/` 或 `/video/list`

**布局：**
```
┌────────────────────────────────────────────┐
│  HeaderNav: LOGO  [搜索框]  [登录/注册]     │
├────────────────────────────────────────────┤
│  热门推荐              [🔄 刷新]            │
│  ┌────────┐ ┌────────┐ ┌────────┐        │
│  │ Video  │ │ Video  │ │ Video  │        │
│  │ Card   │ │ Card   │ │ Card   │        │
│  └────────┘ └────────┘ └────────┘        │
│  （grid-cols-1 md:grid-cols-2 xl:grid-cols-4）│
├────────────────────────────────────────────┤
│  [加载更多] / 无限滚动（IntersectionObserver）│
└────────────────────────────────────────────┘
```

**交互：**
- 点击 VideoCard → 跳转 `/video/detail/:id`
- 点击刷新 → `refresh=true` 重新请求（随机 OFFSET）
- 滚动到底部 → 自动加载下一页（`useInfiniteScroll` hook）

#### 3.3.2 视频详情页（VideoDetailPage）

**路由：** `/video/detail/:id`

**布局：**
```
┌──────────────────────────────────────────────────┐
│  HeaderNav                                            │
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐  │
│  │            <video> 播放器                     │  │
│  └────────────────────────────────────────────┘  │
│                                                    │
│  {video.title}                                      │
│  ┌────┐  UP主昵称  [点赞] [投币] [收藏]            │
│  │头像│  发布于xxx  |  播放x次                     │
│  └────┘                                            │
│  ──────────────────────────────────────────────  │
│  🤖 AI摘要：{video.aiSummary}（紫色边框卡片）         │
│  #游戏 #攻略 ...（AiTagBadge，点击跳转搜索）          │
│  ──────────────────────────────────────────────  │
│  评论区 ({video.comments}条)                         │
│  ┌────────────────────────────────────────────┐  │
│  │ 😊 用户A · 3分钟前   👍 128  [SentimentBar]  │  │
│  │ 这期内容太精彩了！                             │  │
│  │   ↳ 🙁 用户B（回复） · 2分钟前               │  │
│  └────────────────────────────────────────────┘  │
│  [发表评论...]  [发布评论]                          │
└──────────────────────────────────────────────────┘
```

**核心交互：**
- 页面加载时：调用 `getVideoDetail(id)` + `recordHistory(id)`
- 三连按钮：调用 API，UI 实时切换高亮
- AI 摘要：`video.aiSummary` 非空时显示 `border-l-4 border-primary` 紫色边框卡片
- 楼中楼评论：`CommentTree` 组件渲染
- UP主删评：`video.authorId === userInfo.id` 时显示删除按钮

#### 3.3.3 搜索页（SearchPage）

**路由：** `/video/search?keyword=xxx`

**无结果时 AI 流程：**
```
无结果 → 显示"未找到相关内容"
      → 调用 ai.getSearchSuggestions(keyword)
      → 显示"🤖 您是否在找：[游戏] [热门游戏] ..."
      → 点击热词 → navigate(/video/search?keyword=游戏)
      → 提供 [🤖 AI智能推荐] 按钮（用户主动触发）
```

---

## 四、管理端详解（admin）

### 4.1 页面清单

| 页面 | 路由 | 所需权限 | 说明 |
|---|---|---|---|
| `AdminLoginPage` | `/admin/login` | 公开 | 管理员登录 |
| `AdminDashboard` | `/admin/dashboard` | ADMIN | 统计概览 |
| `AuditListPage` | `/admin/audit` | ADMIN | 视频审核 |
| `UserManagePage` | `/admin/user` | ADMIN | 用户管理 + 封禁 |
| `ReportHandlePage` | `/admin/report` | ADMIN | 举报处理 |

### 4.2 AdminRoute 守卫

```tsx
// admin/src/App.tsx
function AdminRoute({ children }) {
  const isAdmin = useUserStore(s => s.isAdmin);
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

<Route path="/admin/login" element={<AdminLoginPage />} />
<Route path="/admin/dashboard" element={
  <AdminRoute><AdminDashboard /></AdminRoute>
} />
<Route path="/admin/audit" element={
  <AdminRoute><AuditListPage /></AdminRoute>
} />
```

### 4.3 管理后台首页（AdminDashboard）

**布局：** DaisyUI `stats` 组件
```
┌──────────┬──────────┬──────────┬──────────┐
│ 用户总数 │ 视频总数 │ 待审核   │ 待处理举报│
│  1,234   │   567    │    23    │    8     │
└──────────┴──────────┴──────────┴──────────┘
```

---

## 五、AI 能力融合

### 5.1 AI 能力矩阵

| AI 功能 | 实现位置 | 调用方 | 用户可见形式 |
|---|---|---|---|
| **AI 标签展示** | 后端 Hesper-AI | 后端 API → `video.aiTags` | VideoCard 封面下方彩色徽章 |
| **AI 摘要展示** | 后端 Hesper-AI | 后端 API → `video.aiSummary` | 详情页紫色边框 AI 摘要卡片 |
| **AI 情感可视化** | 后端 Hesper-AI | 后端 API → `comment.sentimentScore` | 评论旁 SentimentBar 进度条 |
| **AI 搜索建议** | **前端直调 AI** | `shared/src/hooks/useAi.ts` | 搜索无结果时显示推荐热词 |

### 5.2 前端直调 AI（搜索建议）

**为什么前端直接调用？**
- 搜索建议是轻量级场景，不应占用后端 AI 调用队列资源
- 减少后端压力，前端可做本地缓存避免重复调用

```typescript
// shared/src/api/ai.ts
export async function getSearchSuggestions(keyword: string): Promise<string[]> {
  const response = await fetch(
    `${import.meta.env.VITE_AI_BASE_URL}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_AI_API_KEY}`
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_AI_MODEL,
        messages: [{
          role: "user",
          content: `用户搜索关键词：${keyword}，这是一个视频平台。请推荐5个相关热词，用逗号分隔，只返回关键词。`
        }],
        temperature: 0.7,
        max_tokens: 100
      })
    }
  );
  const data = await response.json();
  return data.choices[0].message.content.split('、');
}
```

---

## 六、组件库设计

### 6.1 组件分层

| 层级 | 组件 | 归属 |
|---|---|---|
| **原子组件** | `UserAvatar`, `StatusBadge`, `AiTagBadge` | shared/components/base/ |
| **分子组件** | `SentimentBar`, `CoinInput`, `ConfirmDialog` | shared/components/business/ |
| **组织组件** | `VideoCard`, `CommentItem` | shared/components/domain/ |
| **容器组件** | `CommentTree`, `HeaderNav` | shared/components/domain/ |

### 6.2 响应式断点

| 断点 | 宽度 | 视频网格列数 |
|---|---|---|
| `sm` | 640px+ | 1 列（手机竖屏）|
| `md` | 768px+ | 2 列（平板）|
| `lg` | 1024px+ | 3 列 |
| `xl` | 1280px+ | 4 列（桌面）|

---

## 七、API 与后端对照

| 后端功能模块 | 前端对应文件 | 路由 |
|---|---|---|
| 游客浏览（V-01~V-05）| `HomePage`, `VideoDetailPage`, `SearchPage` | `/`, `/video/detail/:id`, `/video/search` |
| 用户注册/登录（U-01~U-02）| `LoginPage`, `RegisterPage` | `/user/login`, `/user/register` |
| 个人信息（U-03~U-05）| `ProfilePage` | `/user/profile` |
| 注销账号（U-07）| `ProfilePage`（弹窗确认）| `/user/profile` |
| 每日签到（U-08）| `ProfilePage`（登录后自动触发）| — |
| 查看收藏（U-09）| `CollectPage` | `/collect` |
| 发布视频（V-06）| `PublishPage` | `/video/publish` |
| 查看已发布视频（V-07）| `MyVideosPage` | `/video/my` |
| 删除视频（V-08）| `MyVideosPage`（删除按钮）| `/video/my` |
| 首页推荐（V-09）| `HomePage` | `/` |
| 首页刷新（V-10）| `HomePage`（刷新按钮）| `/` |
| 关键字搜索（V-11）| `SearchPage` | `/video/search` |
| 历史浏览（V-12）| `HistoryPage` | `/history` |
| 点赞/收藏/投币（I-01~I-03）| `VideoDetailPage`（三连按钮）| — |
| 评论/回复（I-04~I-05）| `CommentTree` | — |
| 删除评论（I-06~I-07）| `CommentItem`（删除按钮）| — |
| 举报（I-09）| `VideoDetailPage`（举报按钮）| — |
| 管理员登录（A-01）| `AdminLoginPage` | `/admin/login` |
| 视频审核（A-02）| `AuditListPage` | `/admin/audit` |
| 封禁账号（A-03）| `UserManagePage` | `/admin/user` |
| 处理举报（A-04）| `ReportHandlePage` | `/admin/report` |
| 数据导出（A-05）| `UserManagePage`（导出按钮）| — |
| AI 情感可视化 | `SentimentBar` | 所有评论展示处 |
| AI 搜索建议 | `SearchPage`（无结果时）| `/video/search` |

---

## 八、技术规范

### 8.1 开发规范

| 规范 | 说明 |
|---|---|
| **组件命名** | PascalCase（`VideoCard.tsx`），hooks 使用 `use` 前缀（`useAi.ts`） |
| **样式规范** | 全局 CSS 变量在 `shared/src/styles/variables.css`，组件优先用 Tailwind 类名 + DaisyUI |
| **API 调用** | 所有接口通过 `shared/src/api/` 封装，禁止在组件内直接 `axios.get()` |
| **环境变量** | AI API Key 仅在 `.env.production` 配置，**禁止**写入前端代码 |
| **类型定义** | 所有 Props 使用 `interface` 定义，Zustand Store 使用完整类型注解 |
| **共享策略** | 两端共用：`shared/` 下的所有内容；各端独有：`user/src/pages/` 和 `admin/src/pages/` |

### 8.2 性能优化

| 优化项 | 实现方式 |
|---|---|
| **图片懒加载** | `loading="lazy"` |
| **视频封面懒加载** | IntersectionObserver |
| **列表虚拟滚动** | `react-window`（评论列表）|
| **API 数据缓存** | Zustand `cacheStore` 缓存相同请求 5 分钟 |
| **AI 请求防抖** | 搜索输入 `500ms` 防抖，AI 搜索建议 `1s` 防抖 |
| **路由懒加载** | `React.lazy(() => import('./pages/VideoDetailPage'))` |
| **pnpm 缓存** | 依赖安装在根目录 `node_modules`，两端的 shared 依赖软链接复用 |

---

## 九、开发里程碑

| 阶段 | 时间 | 前端任务 |
|---|---|---|
| **阶段一** | 4.2 | Monorepo 初始化（pnpm workspace），shared 包基础结构，user/admin 项目初始化 |
| **阶段二** | 4.3 | shared/types 定义，shared/utils，shared/store，shared/hooks |
| **阶段三** | 4.4 | shared/components 基础组件（VideoCard, HeaderNav, StatusBadge, UserAvatar）|
| **阶段四** | 4.5 | user 用户端页面（HomePage, LoginPage, RegisterPage），路由守卫 |
| **阶段五** | 4.6 | user 视频详情页（VideoDetailPage + 三连 + 评论），PublishPage |
| **阶段六** | 4.7 | user 搜索页 + AI 搜索建议，历史/收藏/我的视频页 |
| **阶段七** | 4.8 | admin 管理端全部页面（Login + Dashboard + AuditList + UserManage + ReportHandle）|
| **阶段八** | 后端完成后 | shared/api 接口层开发，前后端接口对接 |
| **阶段九** | 4.9~4.10 | 全链路联调，401/403/409 等异常场景处理 |
| **阶段十** | 4.12 | 代码规范扫描，README 完善，最终自测 |
| **阶段十一** | 4.13 | 最终提交（截止 18:00） |
| **阶段十** | 4.12 | 代码规范扫描，README 完善，最终自测 |
| **阶段十一** | 4.13 | 最终提交（截止 18:00） |

---

*本文档为《哩哔哩哔》前端产品需求文档 V2.1，基于 monorepo 架构（shared + user + admin），涵盖分层设计、AI能力融合、组件规范及开发里程碑。*
