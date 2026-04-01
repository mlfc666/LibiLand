# 《哩哔哩哔》前端产品需求文档（PRD）

| 属性 | 内容 |
|---|---|
| **文档版本** | V1.0 |
| **文档状态** | 正式版 |
| **所属项目** | 哩哔哩哔（LiBiliBi） |
| **技术定位** | 前端工程化实践，React + Tailwind CSS + DaisyUI，接入 AI 能力 |
| **开发周期** | 2026-04-02 ~ 2026-04-13 |

---

## 一、整体概述

### 1.1 产品定位

本前端工程是《哩哔哩哔》视频平台的重要组成部分，负责将后端 Hesper-MVC 框架提供的 RESTful API 通过友好的用户界面呈现给用户。项目采用**前后端分离**架构，前端独立构建部署。

**技术栈：React + Tailwind CSS + DaisyUI**

- **React 18**：组件化、Hooks、虚拟 DOM
- **Tailwind CSS**：原子化 Utility-First CSS，快速样式开发
- **DaisyUI**：基于 Tailwind 的组件库，提供美观的基础组件（卡片、按钮、输入框、对话框等）

本项目**以 AI 为核心驱动**，在开发阶段和运行阶段均深度融合 AI 能力：

- **开发阶段**：使用 AI 辅助学习 React/Tailwind/DaisyUI 语法和组件用法
- **运行阶段**：前端直接调用大模型 API（搜索建议、内容摘要、情感可视化），增强用户体验

### 1.2 技术栈选型

| 类别 | 技术选型 | 说明 |
|---|---|---|
| **核心框架** | React 18（TypeScript + TSX） | 函数组件 + Hooks + 类型安全 |
| **构建工具** | Vite | 极速开发服务器，热更新 |
| **CSS 框架** | Tailwind CSS | Utility-First 原子化样式 |
| **UI 组件库** | DaisyUI | 基于 Tailwind 的组件（卡片/按钮/弹窗等） |
| **状态管理** | Zustand | 轻量级、TypeScript 友好的状态管理 |
| **路由管理** | React Router v6 | SPA 路由控制 |
| **HTTP 客户端** | Axios | 统一请求/响应拦截、错误处理 |
| **AI 调用** | 直接调用 DeepSeek/OpenAI API | 搜索建议、情感可视化 |
| **图表可视化** | Recharts | 播放趋势图、数据统计展示 |
| **图标库** | Lucide React | 统一风格图标 |
| **类型定义** | TypeScript | 全程类型注解，接口类型 `src/types/` |

> **注**：可以使用 AI 辅助学习 React/Tailwind/DaisyUI 语法和组件用法，但**严禁直接使用 AI 生成完整业务代码**。

### 1.3 项目结构

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/                    # API 调用层（统一封装 Axios）
│   │   ├── client.ts           # Axios 实例 + 拦截器
│   │   ├── user.ts             # 用户相关接口
│   │   ├── video.ts            # 视频相关接口
│   │   ├── comment.ts           # 评论相关接口
│   │   ├── action.ts           # 互动接口（点赞/收藏/投币）
│   │   ├── admin.ts            # 管理端接口
│   │   └── ai.ts               # AI 能力（前端直接调用）
│   ├── components/             # 公共组件
│   │   ├── VideoCard.tsx          # 视频卡片
│   │   ├── CommentItem.tsx         # 评论项
│   │   ├── CommentTree.tsx         # 评论树（楼中楼）
│   │   ├── UserAvatar.tsx          # 用户头像
│   │   ├── CoinInput.tsx           # 投币组件
│   │   ├── AiTagBadge.tsx          # AI标签徽章
│   │   ├── SentimentBar.tsx        # 情感指数进度条
│   │   ├── HeaderNav.tsx           # 顶部导航
│   │   ├── StatusBadge.tsx         # 审核状态徽章
│   │   └── ConfirmDialog.tsx       # 确认对话框
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useUser.ts             # 用户状态（Zustand 封装）
│   │   ├── useVideo.ts             # 视频播放状态
│   │   ├── useAi.ts                # AI 能力封装
│   │   └── useInfiniteScroll.ts    # 无限滚动
│   ├── pages/                  # 页面组件
│   │   ├── HomePage.jsx            # 首页（推荐视频列表）
│   │   ├── VideoDetailPage.jsx     # 视频详情页
│   │   ├── SearchPage.jsx          # 搜索结果页
│   │   ├── LoginPage.jsx           # 登录页
│   │   ├── RegisterPage.jsx        # 注册页
│   │   ├── ProfilePage.jsx         # 个人中心
│   │   ├── HistoryPage.jsx         # 历史记录
│   │   ├── CollectPage.jsx         # 我的收藏
│   │   ├── PublishPage.jsx         # 发布视频页
│   │   ├── MyVideosPage.jsx        # 我的视频管理
│   │   └── admin/                   # 管理端页面
│   │       ├── AdminLoginPage.jsx  # 管理员登录
│   │       ├── AdminDashboard.tsx  # 管理后台首页
│   │       ├── AuditListPage.tsx   # 视频审核列表
│   │       ├── UserManagePage.tsx  # 用户管理（封禁）
│   │       └── ReportHandlePage.tsx # 举报处理
│   ├── store/                  # Zustand 状态管理
│   │   ├── userStore.ts           # 用户状态
│   │   ├── playerStore.ts         # 播放器状态
│   │   └── cacheStore.ts          # 前端缓存
│   ├── types/                  # TypeScript 类型定义
│   │   ├── user.ts             # 用户类型
│   │   ├── video.ts            # 视频类型
│   │   ├── comment.ts          # 评论类型
│   │   └── api.ts              # API 统一响应类型
│   ├── utils/                  # 工具函数
│   │   ├── result.ts           # 统一响应处理（code/msg/data）
│   │   ├── format.ts           # 格式化（时间/文件大小/数字）
│   │   └── sentiment.ts         # 情感指数颜色映射
│   ├── App.tsx                 # 根组件
│   ├── main.tsx                # 入口文件
│   └── index.css               # Tailwind 入口
├── index.html
├── vite.config.ts
├── tailwind.config.ts          # Tailwind 配置 + DaisyUI 插件
├── postcss.config.js
├── tsconfig.json               # TypeScript 配置
├── package.json
└── .env.production             # 生产环境变量
```

---

## 二、AI 能力在前端的深度融合

### 2.1 AI 能力矩阵

| AI 功能 | 生成位置 | 获取方式 | 用户可见形式 |
|---|---|---|---|
| **AI 标签展示** | 后端 Hesper-AI | 后端 API → `video.aiTags` | 视频卡片/详情页彩色标签 |
| **AI 摘要展示** | 后端 Hesper-AI | 后端 API → `video.aiSummary` | 详情页 AI 摘要区块 |
| **AI 情感分析可视化** | 后端 Hesper-AI | 后端 API → `comment.sentimentScore` | 评论旁情感进度条 |
| **AI 搜索建议** | **前端直接调用 AI** | 前端 → DeepSeek/OpenAI API | 搜索无结果时显示推荐热词 |
| **AI 评论情感标签** | 后端 Hesper-AI | 后端 API → `comment.sentimentLabel` | 评论标签（积极/一般/消极） |

### 2.2 前端 AI 调用设计

**为什么前端直接调用 AI（搜索建议）？**

- 搜索建议是轻量级场景，不应占用后端 AI 调用队列资源
- 减少后端压力，前端可做本地缓存避免重复调用
- 用户体验更实时

**环境变量配置（`.env.production`）：**

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_AI_API_KEY=sk-xxxxxxxxxxxx
VITE_AI_BASE_URL=https://api.deepseek.com
VITE_AI_MODEL=deepseek-chat
```

**AI Hook 封装（`src/hooks/useAi.ts`）：**

```javascript
// AI 搜索建议
export async function getSearchSuggestions(keyword) {
  const response = await fetch(`${import.meta.env.VITE_AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_AI_API_KEY}`
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_AI_MODEL,
      messages: [{
        role: "user",
        content: `用户搜索关键词：${keyword}，这是一个视频平台。请推荐5个相关热词，用逗号分隔，只返回关键词，不要其他文字。`
      }],
      temperature: 0.7,
      max_tokens: 100
    })
  });
  const data = await response.json();
  return data.choices[0].message.content.split('、');
}
```

### 2.3 情感可视化（SentimentBar 组件）

**重要说明：** 后端返回的 `sentimentLabel` 为英文枚举（`POSITIVE` / `NORMAL` / `NEGATIVE`），前端组件层统一使用后端枚举值，仅在 UI 层做中文标签和颜色的映射。

**类型定义（`src/types/comment.ts`）：**

```typescript
// 评论情感标签枚举（与后端 SentimentLabel 枚举保持一致）
export type SentimentLabel = 'POSITIVE' | 'NORMAL' | 'NEGATIVE';

export interface Comment {
  id: number;
  videoId: number;
  userId: number;
  content: string;
  parentId: number | null;     // null 表示根评论
  rootId: number | null;       // 顶级评论ID，楼中楼使用
  likeCount: number;
  sentimentScore: number;      // 0.0 ~ 1.0
  sentimentLabel: SentimentLabel;
  createdAt: string;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
}
```

**后端枚举值（`SentimentLabel`）：**

| 枚举值 | 评分区间 | 中文标签 | DaisyUI 颜色 | 图标 |
|---|---|---|---|---|
| `POSITIVE` | 0.8 ~ 1.0 | 优质内容 | `success`（绿色）| 😊 |
| `NORMAL` | 0.2 ~ 0.8 | 一般 | `warning`（黄色）| 😐 |
| `NEGATIVE` | 0.0 ~ 0.2 | 劣质内容 | `error`（红色）| 😠 |

**组件设计（`src/components/SentimentBar.tsx`）：**

```tsx
// 情感指数进度条，使用后端 sentimentLabel 枚举值
import type { SentimentLabel } from '../types/comment';

interface SentimentBarProps {
  sentimentLabel: SentimentLabel;  // 'POSITIVE' | 'NORMAL' | 'NEGATIVE'
  sentimentScore: number;          // 0.0 ~ 1.0，用于进度条宽度
}

const config = {
  POSITIVE: { color: 'bg-success', icon: '😊', label: '优质内容' },
  NORMAL:   { color: 'bg-warning', icon: '😐', label: '一般' },
  NEGATIVE: { color: 'bg-error',   icon: '😠', label: '劣质内容' },
};

export function SentimentBar({ sentimentLabel, sentimentScore }: SentimentBarProps) {
  const percent = Math.round(sentimentScore * 100);
  const c = config[sentimentLabel] || config.NORMAL;

  return (
    <div className="flex items-center gap-2" title={`${percent}% ${c.label}`}>
      <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
        <div className={`h-full ${c.color} transition-all`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-sm">{c.icon}</span>
    </div>
  );
}

  return (
    <div className="flex items-center gap-2" title={`${percent}% ${label}`}>
      <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-sm">{icon}</span>
    </div>
  );
}
```

---

## 三、页面详细设计

### 3.1 首页（HomePage）

**路由**：`/` 或 `/video/list`

**DaisyUI 布局**：`navbar` + `grid` + `card`

```
┌─────────────────────────────────────┐
│  HeaderNav:  LOGO  搜索框  登录/注册  │
├─────────────────────────────────────┤
│  热门推荐           [🔄 刷新]         │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ Cover  │ │ Cover  │ │ Cover  │  │
│  │ #AI标签 │ │ #标签  │ │ #标签  │  │
│  │ 标题   │ │ 标题   │ │ 标题   │  │
│  │ UP·播放│ │ UP·播放│ │ UP·播放│  │
│  └────────┘ └────────┘ └────────┘  │
│  （响应式：手机1列/平板2列/电脑4列）   │
├─────────────────────────────────────┤
│  [加载更多] / 无限滚动                │
└─────────────────────────────────────┘
```

**VideoCard 组件（`src/components/VideoCard.tsx`）关键元素：**

| 区域 | 内容 | 数据字段 |
|---|---|---|
| 封面 | 视频封面图，hover 显示播放图标 | `video.coverUrl` |
| 时长 | 右下角白色遮罩小字 | `video.duration`（秒→分:秒）|
| AI 标签 | 封面下方彩色徽章，最多 3 个 | `video.aiTags` |
| 标题 | 单行截断，hover 显示完整标题 | `video.title` |
| UP主 | 头像 + 昵称 | `video.authorName` |
| 数据条 | 播放/点赞/硬币数 | `video.clicks/likes/coins` |
| 发布时间 | 相对时间（"3小时前"）| `video.publishedAt` |

**交互**：
- 点击卡片 → 跳转 `/video/detail?id={videoId}`
- 点击刷新 → 重新加载（随机内容）
- 滚动到底部 → 加载下一页（InfiniteScroll hook）
- 悬浮卡片 → 封面微微放大，显示播放图标（`hover:scale-105`）

### 3.2 视频详情页（VideoDetailPage）

**路由**：`/video/detail?id=:id`（query 参数，与后端 `GET /video/detail?id={id}` 对应）

**布局**：

```
┌────────────────────────────────────────────────────────────┐
│  HeaderNav                                                   │
├────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐   │
│  │                    <video> 播放器                    │   │
│  │                    controls autoplay                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  <h1> {video.title} </h1>                                   │
│                                                              │
│  ┌──────┐  UP主昵称  [关注]  [👍 点赞] [🪙 投币] [⭐ 收藏]   │
│  │头像   │  发布于xxx  | 播放x次 | 硬币x枚                   │
│  └──────┘                                                    │
│  ─────────────────────────────────────────────────────────  │
│  🤖 AI摘要（紫色边框卡片）：{video.aiSummary}                  │
│  #游戏 #攻略 #热门 ...（AiTagBadge，点击跳转标签搜索）          │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  评论区 ({video.comments}条)                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 😊 用户A · 3分钟前  👍 128  [SentimentBar 86%]        │   │
│  │ 这期内容太精彩了！                                     │   │
│  │ ↳ 🙁 用户B（回复） · 2分钟前                         │   │
│  │   确实不错~                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  [发表评论输入框...] [发布评论]                               │
└────────────────────────────────────────────────────────────┘
```

**核心功能点**：

- **播放器**：`<video controls autoplay src={video.filePath} />`
- 进入页面时：AJAX 调用 `/video/detail`（增加播放量）
- **三连按钮**：点赞/收藏/投币，点击调用 `/action/like|collect|coin`，UI 实时切换高亮状态
- **AI 摘要高亮**：紫色 `border-l-4 border-primary` 边框，左上角 🤖 标识
- **AI 情感进度条**：每条评论右侧 `<SentimentBar score={comment.sentimentScore} />`
- **楼中楼评论**：`CommentTree` 组件，`parentId` 关联，`rootId` 聚合
- **UP主删评**：UP主在自己的视频详情页，每条评论旁显示"删除"按钮（`video.authorId === currentUser.id` 时渲染）

### 3.3 搜索结果页（SearchPage）

**路由**：`/video/search?keyword={keyword}`

```
┌────────────────────────────────────────┐
│  🔍 搜索：{keyword}       找到 {total} 条 │
├────────────────────────────────────────┤
│  [VideoCard Grid]                       │
└────────────────────────────────────────┘

# 无结果时 #
┌────────────────────────────────────────┐
│  未找到"xxx"相关内容                      │
│  🤖 您是否在找：                          │
│  [游戏] [热门游戏] [游戏攻略] ...          │ ← AI搜索建议，点击跳转
│                                          │
│  [🤖 AI智能推荐] 按钮（无结果时点击调用AI）│
└────────────────────────────────────────┘
```

### 3.4 发布视频页（PublishPage）

**路由**：`/video/publish`（需登录）

```
┌────────────────────────────────────────┐
│  发布视频                                 │
├────────────────────────────────────────┤
│  封面图：                                 │
│  ┌──────────┐  [上传封面]（支持拖拽）     │
│  │ 预览图   │  支持 jpg/png，最大 5MB     │
│  └──────────┘                           │
│                                          │
│  视频文件：                               │
│  ┌──────────┐  [选择文件]（支持拖拽）     │
│  │ 文件名    │  支持 mp4/avi/mov/mkv      │
│  └──────────┘  最大 500MB                 │
│                                          │
│  标题：_________________（必填，最多100字）│
│  简介：________________（选填，最多500字） │
│  分区：[选择 ▼]                           │
│  标签：________（逗号分隔，最多5个）       │
│                                          │
│  ✅ 提示：AI将自动生成标签和摘要            │
│              [立即发布]                   │
└────────────────────────────────────────┘
```

- 文件上传使用 `multipart/form-data`，通过 React `onChange` 事件获取文件
- 发布成功后提示"视频已提交，进入审核队列"，跳转首页

### 3.5 个人中心（ProfilePage）

**路由**：`/user/profile`

```
┌──────────────────────────────────────────┐
│  个人中心                                   │
├──────────────────────────────────────────┤
│  ┌────┐                                   │
│  │头像 │  用户名（只读）                     │
│  │[改] │  🪙 硬币余额：{coins}  ⭐ 经验值    │
│  └────┘                                   │
│                                          │
│  性别：<select>                           │
│  生日：<input type="date">                │
│  个人简介：<textarea>（最多200字）          │
│                             [保存修改]     │
│  ──────────────────────────────────────   │
│  [修改密码]  [注销账号]  [退出登录]          │
└──────────────────────────────────────────┘
```

- 注销账号需二次确认（弹窗输入密码）
- 硬币余额实时显示（用户 Store 中更新）

### 3.6 管理后台

#### 3.6.1 管理员登录（AdminLoginPage）

**路由**：`/admin/login`

- 独立路径，独立页面样式
- 表单：用户名 + 密码
- 登录成功 → 跳转 `/admin/dashboard`

#### 3.6.2 管理后台首页（AdminDashboard）

**路由**：`/admin/dashboard`

- 4 个统计卡片：DaisyUI `stats` 组件
  - 用户总数 / 视频总数 / 待审核视频 / 待处理举报
- 快捷操作入口

#### 3.6.3 视频审核页（AuditListPage）

**路由**：`/admin/audit`

```
┌──────────────────────────────────────────────────────────┐
│  待审核视频（{total}）                                       │
├──────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐  │
│  │ [封面]  标题：xxx  UP主：xxx  提交时间：xxx          │  │
│  │        简介：xxx                                   │  │
│  │        [▶ 预览]    [✅ 通过]    [❌ 驳回]           │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- 驳回操作：点击后弹出 DaisyUI `modal`，输入驳回原因（必填）

#### 3.6.4 用户管理页（UserManagePage）

**路由**：`/admin/user`

- DaisyUI `table` 展示用户列表
- 搜索框按用户名筛选
- 操作列：封禁 / 解除封禁（`badge` 显示状态）

#### 3.6.5 举报处理页（ReportHandlePage）

**路由**：`/admin/report`

- 举报列表（`table`）
- 举报原因类型（`badge`）
- 操作：忽略 / 下架视频（弹窗填写备注）

---

## 四、组件库设计

### 4.1 公共组件清单

| 组件名 | 说明 | 关键 Props |
|---|---|---|
| `VideoCard` | 视频卡片 | `video`, `onClick` |
| `CommentItem` | 单条评论 | `comment`, `onReply`, `onDelete`, `canDelete` |
| `CommentTree` | 评论树（楼中楼） | `comments`, `videoAuthorId`, `onReply`, `onDelete` |
| `UserAvatar` | 用户头像 | `src`, `size`, `userId` |
| `AiTagBadge` | AI标签徽章，点击跳转标签搜索 | `tag`, `onClick` |
| `SentimentBar` | 情感指数进度条 | `score`（0.0~1.0）|
| `CoinInput` | 投币组件 | `videoId`, `userCoins`, `onSuccess` |
| `HeaderNav` | 顶部导航栏 | `keyword`, `onSearch` |
| `StatusBadge` | 审核状态徽章 | `status`（0待审核/1通过/2驳回）|
| `ConfirmDialog` | 确认对话框（DaisyUI modal）| `title`, `message`, `onConfirm` |

### 4.2 AiTagBadge 组件

```tsx
// AI 标签徽章，点击跳转到标签搜索页
interface AiTagBadgeProps {
  tag: string;
  onClick?: (tag: string) => void;
}

export function AiTagBadge({ tag, onClick }: AiTagBadgeProps) {
  return (
    <span
      className="badge badge-primary badge-sm cursor-pointer hover:badge-secondary"
      onClick={() => onClick?.(tag)}
    >
      #{tag}
    </span>
  );
}
```

### 4.3 StatusBadge 组件

```tsx
// 审核状态徽章
interface StatusBadgeProps {
  status: 0 | 1 | 2;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<number, { className: string; text: string }> = {
    0: { className: 'badge-warning', text: '待审核' },
    1: { className: 'badge-success', text: '已通过' },
    2: { className: 'badge-error', text: '已驳回' },
  };
  const c = config[status] || config[0];
  return <span className={`badge ${c.className}`}>{c.text}</span>;
}
```

---

## 五、状态管理（Zustand）

### 5.1 userStore

```typescript
// src/store/userStore.ts
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
  refreshProfile: () => Promise<void>;
}

export const useUserStore = create(
  persist<UserStore>(
    (set, get) => ({
      userInfo: null,
      isLoggedIn: false,
      isAdmin: false,

      login: (userInfo) => set({
        userInfo,
        isLoggedIn: true,
        isAdmin: userInfo.role === 'ADMIN',
      }),

      logout: () => set({
        userInfo: null,
        isLoggedIn: false,
        isAdmin: false,
      }),

      updateCoins: (delta) => set(state => ({
        userInfo: state.userInfo
          ? { ...state.userInfo, coins: state.userInfo.coins + delta }
          : null,
      })),

      refreshProfile: async () => {
        const res = await client.get<UserInfo>('/user/profile');
        get().login(res);
      },
    }),
    { name: 'user-storage' }
  )
);
```

### 5.2 playerStore

```javascript
// src/store/playerStore.js
export const usePlayerStore = create((set) => ({
  currentVideo: null,
  isPlaying: false,
  watchDuration: 0,

  setCurrentVideo: (video) => set({ currentVideo: video }),
  setWatchDuration: (d) => set({ watchDuration: d }),
}));
```

---

## 六、API 请求层设计

### 6.1 Axios 实例封装（`src/api/client.ts`）

**功能特点：**
- 基于 Axios 封装统一的 HTTP 客户端实例
- 自动携带会话标识用于用户身份识别
- 统一处理响应结果，自动剥离外层封装
- 统一错误处理（超时、认证失败、业务异常）

**请求拦截机制：**
- 自动从 Session 存储中获取会话标识
- 附加到请求 Header 中随请求发送

**响应处理机制：**
- 成功响应：直接返回 data 部分
- 认证失败（401）：自动清除登录态并跳转登录页
- 业务异常：根据错误码显示对应提示

### 6.2 统一错误处理

| 后端 code | 前端处理 |
|---|---|
| 200 | 成功 |
| 400 | `toast.error(msg)` |
| 401 | 清除登录态，跳转 `/user/login` |
| 403 | `toast.error(msg)`（封禁/无权限）|
| 409 | `toast.warning(msg)`（重复操作）|
| 500 | `toast.error('系统异常，请稍后重试')` |

### 6.3 功能能力说明

**用户模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 用户注册 | 支持新用户注册，用户名唯一性校验 |
| 用户登录 | 支持用户名密码登录，会话管理 |
| 退出登录 | 清除当前会话 |
| 个人信息查看 | 查看个人基本信息（头像/昵称/硬币/经验等）|
| 个人信息修改 | 修改个人资料（头像/昵称/性别/生日/简介）|
| 密码修改 | 验证旧密码后修改新密码 |
| 账号注销 | 密码验证后彻底删除账号 |
| 数据统计 | 查看个人发布视频的播放/点赞/投币/收藏统计 |

**视频模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 推荐视频列表 | 首页展示推荐视频，支持分页和刷新 |
| 视频详情 | 查看视频详细信息，含AI摘要/标签/UP主信息 |
| 视频搜索 | 按关键字搜索视频，支持分页 |
| 视频下载 | 下载视频文件（仅登录用户）|
| 视频发布 | 上传视频及封面，填写标题/简介/标签 |
| 我的视频 | 查看自己发布的视频列表及审核状态 |
| 视频删除 | 删除自己发布的视频 |

**互动模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 点赞/取消 | 对视频进行点赞或取消点赞切换 |
| 收藏/取消 | 对视频进行收藏或取消收藏切换 |
| 投币 | 对视频投币，扣减用户硬币余额 |
| 互动状态查询 | 查询用户对特定视频的互动状态 |

**评论模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 评论列表 | 获取视频下的评论列表，支持树形结构展示 |
| 发表评论 | 发表顶级评论或回复已有评论 |
| 评论删除 | 删除自己发表的评论 |
| 评论点赞 | 对评论进行点赞或取消点赞 |

**历史记录模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 历史列表 | 查看浏览历史记录，支持分页 |
| 记录浏览 | 进入视频详情页时自动记录浏览历史 |
| 删除历史 | 删除单条浏览历史记录 |

**收藏模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 收藏列表 | 查看当前用户收藏的所有视频 |

**签到模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 签到状态查询 | 查询今日是否已签到 |
| 执行签到 | 每日首次登录自动触发签到领取硬币 |

**举报模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 提交举报 | 对违规视频提交举报，选择原因类型并填写详细说明 |

**管理端模块能力**

| 能力名称 | 功能描述 |
|---|---|
| 管理员登录 | 独立管理后台登录入口 |
| 待审核视频 | 查看待审核视频列表，支持预览 |
| 视频审核 | 对视频进行通过或驳回操作 |
| 用户列表 | 查看/搜索用户列表，支持按状态筛选 |
| 账号封禁 | 封禁或解除封禁用户账号 |
| 举报列表 | 查看待处理的举报列表 |
| 举报处理 | 对举报进行忽略或下架视频操作 |
| 数据统计 | 查看平台核心数据（用户/视频/待审核/待处理举报）|
| 数据导出 | 导出全量用户信息为CSV文件 |

---

## 七、路由守卫设计

### 7.1 全局守卫

```tsx
// src/App.tsx
<Routes>
  {/* 公开路由 */}
  <Route path="/" element={<HomePage />} />
  <Route path="/video/detail/:id" element={<VideoDetailPage />} />
  <Route path="/video/search" element={<SearchPage />} />
  <Route path="/user/login" element={<LoginPage />} />
  <Route path="/user/register" element={<RegisterPage />} />
  <Route path="/admin/login" element={<AdminLoginPage />} />

  {/* 需要登录 */}
  <Route path="/video/publish" element={
    <ProtectedRoute><PublishPage /></ProtectedRoute>
  } />
  <Route path="/user/profile" element={
    <ProtectedRoute><ProfilePage /></ProtectedRoute>
  } />
  <Route path="/history" element={
    <ProtectedRoute><HistoryPage /></ProtectedRoute>
  } />
  <Route path="/collect" element={
    <ProtectedRoute><CollectPage /></ProtectedRoute>
  } />
  <Route path="/video/my" element={
    <ProtectedRoute><MyVideosPage /></ProtectedRoute>
  } />

  {/* 需要管理员 */}
  <Route path="/admin/*" element={
    <AdminRoute><AdminLayout /></AdminRoute>
  } />
</Routes>
```

```jsx
// ProtectedRoute 组件
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useUserStore();
  if (!isLoggedIn) return <Navigate to="/user/login" replace />;
  return children;
}

// AdminRoute 组件
function AdminRoute({ children }) {
  const { isAdmin } = useUserStore();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
```

---

## 八、响应式设计

| 断点 | 宽度 | 视频网格列数 |
|---|---|---|
| `sm` | 640px ~ | 1 列（手机竖屏）|
| `md` | 768px ~ | 2 列（平板）|
| `lg` | 1024px ~ | 3 列 |
| `xl` | 1280px ~ | 4 列（桌面）|

```jsx
// 响应式视频网格
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
  {videos.map(video => <VideoCard key={video.id} video={video} />)}
</div>
```

---

## 九、前端目录与后端功能对照

| 后端功能模块 | 前端对应页面/组件 | 路由 |
|---|---|---|
| 游客浏览（V-01~V-05） | `HomePage`, `VideoDetailPage`, `SearchPage` | `/`, `/video/detail/:id`, `/video/search` |
| 用户注册/登录（U-01~U-06）| `LoginPage`, `RegisterPage` | `/user/login`, `/user/register` |
| 个人信息（U-03~U-05）| `ProfilePage` | `/user/profile` |
| 注销账号（U-07）| `ProfilePage`（弹窗确认）| `/user/profile` |
| 每日签到（U-08）| `ProfilePage`（登录后自动触发）| — |
| 查看收藏（U-09）| `CollectPage` | `/collect` |
| 数据统计（U-10）| `ProfilePage`（展示统计卡片）| `/user/profile` |
| 发布视频（V-06）| `PublishPage` | `/video/publish` |
| 查看已发布视频（V-07）| `MyVideosPage` | `/video/my` |
| 删除视频（V-08）| `MyVideosPage`（删除按钮）| `/video/my` |
| 首页推荐（V-09）| `HomePage` | `/` |
| 首页刷新（V-10）| `HomePage`（刷新按钮）| `/` |
| 关键字搜索（V-11）| `SearchPage` | `/video/search` |
| 历史浏览（V-12）| `HistoryPage` | `/history` |
| 下载视频（V-13）| `VideoDetailPage`（下载按钮）| — |
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

## 十、技术规范

### 10.1 代码规范

1. **组件命名**：使用 PascalCase（如 `VideoCard.tsx`），hooks 使用 `use` 前缀（如 `useAi.ts`）
2. **样式规范**：全局样式在 `src/index.css`（Tailwind 入口），组件样式使用 Tailwind 类名，尽量使用 DaisyUI 组件类
3. **API 调用**：所有接口通过 `src/api/` 封装，禁止在组件内直接 `axios.get()`
4. **环境变量**：AI API Key 仅在 `.env.production` 配置，**禁止**写入前端代码
5. **类型定义**：推荐使用 JSDoc 注释为函数和组件添加类型说明

### 10.2 性能优化

| 优化项 | 实现方式 |
|---|---|
| **图片懒加载** | `loading="lazy"` 或 `react-lazy-load-image-component` |
| **视频封面懒加载** | IntersectionObserver，滚动到视口再加载 |
| **列表虚拟滚动** | `react-window` 处理长列表（评论列表）|
| **API 数据缓存** | Zustand `cacheStore` 缓存相同请求 5 分钟 |
| **AI 请求防抖** | 搜索输入 `500ms` 防抖，AI 搜索建议 `1s` 防抖 |
| **路由懒加载** | `React.lazy(() => import('./pages/VideoDetailPage'))` |
| **Axios 并发控制** | 使用 `axios.all()` 并发请求无依赖接口 |

---

## 十一、开发里程碑（与后端同步）

| 阶段 | 时间 | 前端任务 |
|---|---|---|
| **阶段一** | 4.2 | 项目初始化（Vite + React18 + Tailwind + DaisyUI + TypeScript），路由配置，`client.ts` Axios 封装，环境变量配置，`userStore.ts` |
| **阶段二** | 4.3 | 用户模块页面（登录/注册/个人中心），路由守卫（ProtectedRoute/AdminRoute） |
| **阶段三** | 4.4 | 视频上传页（PublishPage），视频详情页（VideoDetailPage，`<video>` 播放器） |
| **阶段四** | 4.5 | 首页（VideoCard + Grid 响应式布局），搜索页，HeaderNav 组件，`SentimentBar`/`AiTagBadge`/`StatusBadge` 组件 |
| **阶段五** | 4.6 | 点赞/收藏/投币组件（CoinInput），评论组件（CommentItem + CommentTree），历史记录页，收藏页 |
| **阶段六** | 4.7 | AI 能力接入（`useAi` hook + 搜索建议），情感可视化，数据统计页（Recharts） |
| **阶段七** | 4.8 | 管理后台全部页面（AdminLogin + Dashboard + AuditList + UserManage + ReportHandle）|
| **阶段八** | 4.9 ~ 4.10 | 完善楼中楼评论、收藏页、个人数据统计，响应式适配，细节打磨 |
| **阶段九** | 4.10 ~ 4.11 | 全链路联调（前后端接口对接），401/403/409 等异常场景处理 |
| **阶段十** | 4.12 | 代码规范扫描，README 完善，最终自测 |
| **阶段十一** | 4.13 | 最终提交（截止 18:00） |

---

*本文档为《哩哔哩哔》前端产品需求文档 V1.0，涵盖前端架构设计（React + Tailwind + DaisyUI）、AI能力融合、页面组件设计、状态管理及开发规范。接口文档待后端代码完成后补充。*
