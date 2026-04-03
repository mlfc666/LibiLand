# 《哩哔哩哔》前端任务清单

> 开发周期：2026-04-02 ~ 2026-04-13
> 技术栈：React 19 + TypeScript + Tailwind CSS + DaisyUI + Zustand + React Router v6 + pnpm workspace
> 每完成一项，在 `[ ]` 中填入 `[x]`
> 标注 `【PRD-章节】` 的条目表示对应前端 PRD 章节，便于溯源

---

## 一、项目初始化 【PRD-1】

### 1.1 Monorepo 基础搭建

- [x] `frontend/pnpm-workspace.yaml` 已配置 shared、user、admin 三个包
- [x] 三个目录均已存在且结构正确

### 1.2 shared 包初始化 【PRD-2】

- [x] `shared/src/` 目录结构已创建：
  ```
  shared/src/
  ├── api/
  ├── components/
  │   ├── base/
  │   ├── business/
  │   └── domain/
  ├── hooks/
  ├── store/
  ├── styles/
  ├── types/
  └── utils/
  ```
- [x] `shared/package.json` 已配置 `@libiland/shared`，type 为 module
- [x] `shared/tsconfig.json` 已创建

### 1.3 user 和 admin 项目配置 【PRD-1.1】

- [x] `user/package.json` 已配置 `@libiland/shared` workspace 依赖
- [x] `admin/package.json` 已配置 `@libiland/shared` workspace 依赖
- [x] `user/vite.config.ts`：端口 14001，路径别名 `@/` 指向 `src/`，代理 `/api` 到后端
- [x] `admin/vite.config.ts`：端口 14002，路径别名 `@/` 指向 `src/`，代理 `/api` 到后端
- [x] `user/tsconfig.app.json` 已配置 `@/` 路径别名
- [x] `admin/tsconfig.app.json` 已配置 `@/` 路径别名

### 1.4 Tailwind + DaisyUI 配置

- [x] user 和 admin 均已安装 tailwindcss、postcss、autoprefixer、daisyui
- [x] user 和 admin 的 `tailwind.config.js` 均已配置 DaisyUI 插件
- [x] `tailwind.config.js` 的 `content` 已配置 `['./index.html', './src/**/*.{ts,tsx}']`

### 1.5 环境变量配置

- [x] 创建 `user/.env.development`：
  ```
  VITE_API_BASE_URL=http://localhost:8080
  ```
- [x] 创建 `user/.env.production`：
  ```
  VITE_API_BASE_URL=你的后端地址
  ```
- [x] 创建 `admin/.env.development`：
  ```
  VITE_API_BASE_URL=http://localhost:8080
  ```
- [x] 创建 `user/.env`（AI 配置，仅本地开发使用）：
  ```
  VITE_AI_API_KEY=sk-xxxxxxxxxxxx
  VITE_AI_BASE_URL=https://api.deepseek.com
  VITE_AI_MODEL=deepseek-chat
  ```

---

## 二、类型定义（shared/src/types/）【PRD-2.6】

### 2.1 用户类型（`types/user.ts`）

- [x] 编写 `UserInfo` 接口：`id`, `username`, `avatar`, `role`, `status`, `coins`, `experience`, `gender`, `birthday`, `bio`, `createdAt`
- [x] 编写 `LoginForm` / `RegisterForm` 类型
- [x] 编写 `UpdateProfileForm` 类型
- [x] 导出到 `shared/src/types/index.ts`

### 2.2 视频类型（`types/video.ts`）

- [x] 编写 `Video` 接口：`id`, `title`, `description`, `coverUrl`, `filePath`, `duration`, `authorId`, `authorName`, `authorAvatar`, `category`, `tags`, `aiTags`, `aiSummary`, `status`, `rejectReason`, `clicks`, `likes`, `coins`, `collects`, `comments`, `score`, `downloads`, `publishedAt`, `createdAt`
- [x] 编写 `VideoListQuery` / `VideoPublishForm` 类型
- [x] 导出到 `shared/src/types/index.ts`

### 2.3 评论类型（`types/comment.ts`）

- [x] 编写 `Comment` 接口：`id`, `videoId`, `userId`, `username`, `userAvatar`, `parentId`, `rootId`, `content`, `likeCount`, `replyCount`, `sentimentScore`, `sentimentLabel`, `status`, `createdAt`, `replies?: Comment[]`
- [x] 编写 `SentimentLabel` 类型别名：`'POSITIVE' | 'NORMAL' | 'NEGATIVE'`
- [x] 编写 `PublishCommentForm` 类型
- [x] 导出到 `shared/src/types/index.ts`

### 2.4 API 统一类型（`types/api.ts`）

- [x] 编写 `ApiResult<T>` 接口：`code`, `msg`, `data`
- [x] 编写 `PageResult<T>` 接口：`list`, `total`, `page`, `size`
- [x] 编写 `ActionStatus` 接口：`liked`, `collected`, `coined`
- [x] 导出到 `shared/src/types/index.ts`

---

## 三、工具函数（shared/src/utils/）【PRD-2.4】

### 3.1 格式化工具（`utils/format.ts`）

- [x] `formatDuration(seconds: number): string` — 秒 → `"3:45"` 或 `"1:23:45"`
- [x] `formatDate(date: string | Date): string` — 日期格式化（如 `"2026-04-02"`）
- [x] `formatRelativeTime(date: string | Date): string` — 相对时间（`"3小时前"`）
- [x] `formatNumber(n: number): string` — 大数字格式化（`"1.2万播放"`）
- [x] `formatFileSize(bytes: number): string` — 文件大小（`"123MB"`）

### 3.2 情感工具（`utils/sentiment.ts`）

- [x] `getSentimentConfig(score: number)`：根据 0.0~1.0 返回 `{ color, label, icon, bgClass }`
- [x] `getSentimentLabel(score: number): SentimentLabel`：根据评分返回枚举值

### 3.3 结果处理（`utils/result.ts`）

- [x] `handleApiError(error: unknown): string`：从 error 对象提取错误消息
- [x] `isAuthError(error: unknown): boolean`：判断是否为 401 未登录错误

### 3.4 Session 存储（`utils/storage.ts`）

- [x] `getSessionId(): string | null`：从 sessionStorage 读取 `SESSION_ID`
- [x] `setSessionId(id: string): void`：写入 sessionStorage
- [x] `removeSessionId(): void`：清除 sessionStorage

---

## 四、状态管理（shared/src/store/）【PRD-2.7】

### 4.1 userStore（`store/userStore.ts`）

- [x] Zustand Store：`userInfo`、`isLoggedIn`、`isAdmin`
- [x] `login(userInfo: UserInfo)`：写入 userInfo，设置 isAdmin = userInfo.role === 'ADMIN'，同时 `setSessionId()`
- [x] `logout()`：清除 userInfo/isAdmin，同时 `removeSessionId()`
- [x] `updateCoins(delta: number)`：更新硬币余额
- [x] `persist` 中间件：`sessionStorage` 持久化
- [x] TypeScript 类型完整注解

### 4.2 playerStore（`store/playerStore.ts`）

- [x] Zustand Store：`currentVideo`、`setCurrentVideo()`、`watchDuration`、`setWatchDuration()`

---

## 五、自定义 Hooks（shared/src/hooks/）【PRD-2.3】

### 5.1 useInfiniteScroll（`hooks/useInfiniteScroll.ts`）

- [x] 接收 `fetchFn`、`pageSize`
- [x] 返回 `{ data, loading, hasMore, loadMore, refresh }`
- [x] IntersectionObserver 监听底部，自动加载下一页

### 5.2 useDebounce（`hooks/useDebounce.ts`）/home/mlfc/Code/Idea/LibiLand/docs/PROGRESS.md

- [x] `useDebounce<T>(value: T, delay: number): T`：防抖 Hook

### 5.3 useAi（`hooks/useAi.ts`）

- [x] `getSearchSuggestions(keyword: string): Promise<string[]>`：调用 AI API 获取推荐热词，带 loading 状态
- [x] 错误处理：API 失败时返回空数组，不阻塞页面

---

## 六、共享组件（shared/src/components/）【PRD-2.2 / 4 / 6】

### 6.1 原子组件（`components/base/`）

#### UserAvatar（`components/base/UserAvatar.tsx`）

- [x] Props：`src?: string`, `size?: 'sm' | 'md' | 'lg'`, `userId?: number`
- [x] 圆形头像，`src` 为空时显示首字母占位符
- [x] 使用 DaisyUI `avatar` 组件

#### StatusBadge（`components/base/StatusBadge.tsx`）

- [x] Props：`status: 0 | 1 | 2`
- [x] 0 → `badge-warning` "待审核"；1 → `badge-success` "已通过"；2 → `badge-error` "已驳回"

#### AiTagBadge（`components/base/AiTagBadge.tsx`）

- [x] Props：`tag: string`, `onClick?: (tag: string) => void`
- [x] DaisyUI `badge badge-primary`，点击触发 `onClick`（跳转标签搜索）

### 6.2 业务组件（`components/business/`）

#### SentimentBar（`components/business/SentimentBar.tsx`）

- [x] Props：`src?: string`, `size?: 'sm' | 'md' | 'lg'`, `userId?: number`
- [x] 圆形头像，`src` 为空时显示首字母占位符
- [x] 使用 DaisyUI `avatar` 组件

- [x] Props：`score: number`（0.0~1.0），`label?: SentimentLabel`
- [x] DaisyUI `progress` 组件，根据评分区间显示不同颜色进度条
- [x] 图标 + 悬浮提示（具体分数 + 标签）
- [x] 调用 `utils/sentiment.ts` 获取颜色配置

#### CoinInput（`components/business/CoinInput.tsx`）

- [x] Props：`videoId: number`, `userCoins: number`, `onSuccess?: () => void`
- [x] 显示硬币余额，点击"投币"按钮
- [x] 余额不足时按钮禁用 + 提示

#### ConfirmDialog（`components/business/ConfirmDialog.tsx`）

- [x] Props：`open: boolean`, `title: string`, `message: string`, `onConfirm`, `onCancel`
- [x] DaisyUI `modal` 组件

### 6.3 领域组件（`components/domain/`）

#### VideoCard（`components/domain/VideoCard.tsx`）

- [x] Props：`video: Video`, `onClick?: () => void`
- [x] 封面图（`loading="lazy"`）、时长徽章、右下角 `formatDuration(video.duration)`
- [x] AI 标签徽章：逗号分隔，最多显示3个 `AiTagBadge`
- [x] 标题（单行截断，hover 显示完整）、UP主信息（`UserAvatar` + 昵称）
- [x] 数据条：播放/点赞/硬币数（`formatNumber`）
- [x] 点击卡片 → 调用 `onClick`
- [x] hover 时封面微微放大（`hover:scale-105`）

#### CommentItem（`components/domain/CommentItem.tsx`）

- [x] Props：`comment: Comment`, `onReply?`, `onDelete?`, `canDelete?: boolean`
- [x] 头像 + 用户名 + 相对时间 + 情感进度条（`SentimentBar`）+ 内容
- [x] 显示"回复"按钮（触发 `onReply`）
- [x] `canDelete=true` 时渲染"删除"按钮

#### CommentTree（`components/domain/CommentTree.tsx`）

- [x] Props：`comments: Comment[]`, `videoAuthorId: number`, `onReply?`, `onDelete?`
- [x] 顶级评论按 `sentimentScore DESC` 排序
- [x] 二级评论（`parentId !== null`）作为子项渲染在父评论下方（楼中楼）
- [x] `CommentItem` 渲染每条评论

#### HeaderNav（`components/domain/HeaderNav.tsx`）

- [x] Props：`keyword?: string`, `onSearch?: (kw: string) => void`
- [x] DaisyUI `navbar` 组件
- [x] Logo（点击跳转首页 `/`）
- [x] 搜索框：输入 → 回车/点击搜索图标 → 调用 `onSearch(kw)` 或 `navigate('/video/search?keyword=' + kw)`
- [x] 已登录：显示用户名 + 下拉菜单（个人中心/投稿/退出）
- [x] 未登录：显示 [登录] + [注册] 按钮

### 6.4 统一导出

- [x] 创建 `shared/src/components/index.ts`，导出所有组件
- [x] user 和 admin 通过 `import { VideoCard, HeaderNav } from '@libiland/shared/components'` 使用

---

## 七、shared 统一导出（shared/src/index.ts）

- [x] 导出所有 types
- [x] 导出所有 utils
- [x] 导出所有 store
- [x] 导出所有 hooks
- [x] 导出所有 components

---

## 八、用户端页面（user/src/pages/）【PRD-3】

### 8.1 路由配置（user/src/App.tsx）

- [x] React Router v6 已安装
- [x] 公开路由：`/`、`/video/detail/:id`、`/video/search`、`/user/login`、`/user/register`
- [x] 需登录路由：`/video/publish`、`/user/profile`、`/history`、`/collect`、`/video/my
- [x] Props：`src?: string`, `size?: 'sm' | 'md' | 'lg'`, `userId?: number`
- [x] 圆形头像，`src` 为空时显示首字母占位符
- [x] 使用 DaisyUI `avatar` 组件

- [x] 实现 `ProtectedRoute` 组件：未登录 → 跳转 `/user/login?redirect=xxx`
- [x] 使用 `React.lazy` + `Suspense` 实现路由懒加载

### 8.2 HomePage（`pages/HomePage.tsx`）

- [x] 路由：`/` 或 `/video/list`
- [x] `useInfiniteScroll` 加载视频列表
- [x] 响应式视频网格：`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`
- [x] 刷新按钮：`refresh=true` 重新请求
- [x] `VideoCard` 渲染每条视频
- [x] Props：`src?: string`, `size?: 'sm' | 'md' | 'lg'`, `userId?: number`
- [x] 圆形头像，`src` 为空时显示首字母占位符
- [x] 使用 DaisyUI `avatar` 组件

- [x] 空状态：显示"暂无视频"

### 8.3 VideoDetailPage（`pages/VideoDetailPage.tsx`）

- [x] 路由：`/video/detail/:id`，从 URL 取 `id` 参数
- [x] 页面加载时：`api.getVideoDetail(id)` + `api.recordHistory(id)`
- [x] `<video controls autoplay src={video.filePath} />` 播放器
- [x] 三连按钮：点赞/收藏/投币，点击调用 API，UI 实时切换
- [x] AI 摘要：`video.aiSummary` 非空时显示 `border-l-4 border-primary` 紫色边框卡片
- [x] AI 标签：逗号分隔渲染多个 `AiTagBadge`，点击跳转搜索
- [x] 评论输入框 + 发布按钮
- [x] `CommentTree` 渲染评论列表
- [x] `video.authorId === userInfo.id` 时：每条评论旁显示"删除"按钮

### 8.4 SearchPage（`pages/SearchPage.tsx`）

- [x] 路由：`/video/search`，从 URL 取 `keyword` 参数
- [x] 显示搜索结果数量
- [x] 有结果：渲染 `VideoCard` 网格
- [x] **无结果时**：
  - [x] 显示"未找到相关内容"
  - [x] 调用 `ai.getSearchSuggestions(keyword)`
  - [x] 显示 AI 推荐热词，点击跳转到 `/video/search?keyword=xxx`
  - [x] 提供"🤖 AI智能推荐"按钮（用户主动触发）

### 8.5 LoginPage（`pages/LoginPage.tsx`）

- [x] 路由：`/user/login`
- [x] DaisyUI `card` + `form` 布局
- [x] 表单：用户名 + 密码 + 登录按钮
- [x] 提交 → `api.userLogin()` → 写入 `userStore.login()` → 跳转首页或来源页

### 8.6 RegisterPage（`pages/RegisterPage.tsx`）

- [x] 路由：`/user/register`
- [x] 表单：用户名 + 密码 + 确认密码
- [x] 前端校验：用户名3-12字符、密码6-20位、两次密码一致
- [x] 提交 → `api.userRegister()` → 提示注册成功 → 跳转登录页

### 8.7 ProfilePage（`pages/ProfilePage.tsx`）

- [x] 路由：`/user/profile`（需登录）
- [x] 头像上传：`input type="file"` + `api.updateProfile(avatar)`
- [x] 表单：性别（下拉选择）、生日（date input）、简介（textarea）
- [x] 保存修改：`api.updateProfile(form)`
- [x] 修改密码：弹窗 `ConfirmDialog`，输入旧密码+新密码，调用 `api.changePassword()`
- [x] 硬币余额展示：`userInfo.coins`
- [x] 注销账号：`ConfirmDialog`，输入密码，`api.deleteAccount()` → logout → 跳转首页

### 8.8 PublishPage（`pages/PublishPage.tsx`）

- [x] 路由：`/video/publish`（需登录）
- [x] 封面图上传：`input type="file" accept="image/*"` + 本地预览
- [x] 视频文件上传：`input type="file" accept="video/*"` + 文件名+大小显示
- [x] 表单：标题（必填，最多100字）、简介（选填，最多500字）、分区（下拉）、标签（逗号分隔，最多5个）
- [x] 提交：FormData 封装，`api.publishVideo(formData)`
- [x] 成功后提示"视频已提交，进入审核队列"，跳转首页

### 8.9 MyVideosPage（`pages/MyVideosPage.tsx`）

- [x] 路由：`/video/my`（需登录）
- [x] 列表：调用 `api.getMyVideos()`
- [x] 每条视频：封面 + 标题 + `StatusBadge`（审核状态）+ 发布时间 + 播放量
- [x] 删除按钮：`ConfirmDialog` 确认后 `api.deleteVideo(id)`

### 8.10 HistoryPage（`pages/HistoryPage.tsx`）

- [x] 路由：`/history`（需登录）
- [x] 列表：调用 `api.getHistory()`
- [x] 每条：封面 + 标题 + UP主 + 观看时间
- [x] 删除单条历史：`api.deleteHistory(id)`

### 8.11 CollectPage（`pages/CollectPage.tsx`）

- [x] 路由：`/collect`（需登录）
- [x] 列表：调用 `api.getCollectList()`
- [x] 渲染 `VideoCard` 网格

---

## 九、管理端页面（admin/src/pages/）【PRD-4】

### 9.1 路由配置（admin/src/App.tsx）

- [x] React Router v6 已安装
- [x] `/admin/login` 公开路由
- [x] `/admin/*` 其他路由需 ADMIN 角色
- [x] 实现 `AdminRoute` 守卫组件：非管理员 → 跳转 `/admin/login`
- [x] 管理端布局：侧边栏 + 主内容区（使用 DaisyUI `drawer` 或 `navbar`）

### 9.2 AdminLoginPage（`pages/AdminLoginPage.tsx`）

- [x] 路由：`/admin/login`
- [x] 独立页面样式（DaisyUI `card`）
- [x] 表单：用户名 + 密码
- [x] 提交 → `api.adminLogin()` → 写入 `userStore.login()` → 跳转 `/admin/dashboard`

### 9.3 AdminDashboard（`pages/AdminDashboard.tsx`）

- [x] 路由：`/admin/dashboard`
- [x] DaisyUI `stats` 组件展示：用户总数 / 视频总数 / 待审核视频 / 待处理举报
- [x] 快捷入口卡片：审核视频 / 用户管理 / 举报处理

### 9.4 AuditListPage（`pages/AuditListPage.tsx`）

- [x] 路由：`/admin/audit`
- [x] 列表：调用 `api.getPendingVideos()`
- [x] 每条视频：封面 + 标题 + UP主 + 简介 + 提交时间 + 操作按钮
- [x] 预览按钮：新窗口打开视频
- [x] 通过按钮：调用 `api.approveVideo(id)`
- [x] 驳回按钮：`ConfirmDialog` 输入驳回原因，`api.rejectVideo(id, reason)`

### 9.5 UserManagePage（`pages/UserManagePage.tsx`）

- [x] 路由：`/admin/user`
- [x] DaisyUI `table` 展示用户列表
- [x] 搜索框：按用户名筛选
- [x] 状态筛选：全部 / 正常 / 已封禁
- [x] 操作列：封禁按钮 / 解封按钮（`badge badge-error` / `badge badge-success`）
- [x] 导出按钮：调用 `api.exportUsers()`（或 `window.open` 下载链接），触发文件下载

### 9.6 ReportHandlePage（`pages/ReportHandlePage.tsx`）

- [x] 路由：`/admin/report`
- [x] 列表：调用 `api.getReportList()`
- [x] 每条：举报人 + 被举报视频（可跳转查看）+ 举报原因类型（`badge`）+ 时间
- [x] 忽略按钮：`ConfirmDialog` 填写备注，`api.ignoreReport(id, note)`
- [x] 下架按钮：`ConfirmDialog` 填写备注，`api.takedownReport(id, note)`

---

## 十、API 接口层（后端完成后再创建）

> **注意**：API 接口层依赖后端接口定义，后端完成后统一创建。

### 10.1 client（`api/client.ts`）

- [x] Axios 实例，`baseURL` 读取 `VITE_API_BASE_URL`，`timeout: 10000`
- [x] 请求拦截器：自动从 `sessionStorage` 读取 `SESSION_ID`，附加到 `X-Session-Id` header
- [x] 响应拦截器：统一解包 `ApiResult<T>`，`code !== 200` 时 reject
- [x] `code === 401`：清除 `SESSION_ID`，跳转 `/user/login`

### 10.2 user 接口（`api/user.ts`）

- [x] `userRegister`, `userLogin`, `userLogout`, `getProfile`, `updateProfile`, `changePassword`, `deleteAccount`

### 10.3 video 接口（`api/video.ts`）

- [x] `getVideoList`, `getVideoDetail`, `searchVideos`, `publishVideo`, `getMyVideos`, `deleteVideo`

### 10.4 action 接口（`api/action.ts`）

- [x] `toggleLike`, `toggleCollect`, `throwCoin`, `getActionStatus`

### 10.5 comment 接口（`api/comment.ts`）

- [x] `getCommentList`, `publishComment`, `deleteComment`, `likeComment`

### 10.6 history/collect/signin 接口

- [x] `getHistory`, `recordHistory`, `getCollectList`, `getSigninStatus`, `doSignin`

### 10.7 admin 接口（`api/admin.ts`）

- [x] `adminLogin`, `getPendingVideos`, `approveVideo`, `rejectVideo`, `getUserList`, `banUser`, `unbanUser`, `getReportList`, `ignoreReport`, `takedownReport`

### 10.8 AI 接口（`api/ai.ts`）

- [x] `getSearchSuggestions`：前端直调 DeepSeek API

---

## 十一、联调与测试 【PRD-8】

### 11.1 前后端接口对接

- [ ] 确认所有接口路径、请求方法、请求体与后端一致
- [ ] 处理 `ApiResult<T>` 统一响应结构
- [ ] 处理 401：跳转登录页
- [ ] 处理 403：显示"账号已被封禁"或"无权限"
- [ ] 处理 409：显示业务错误消息（如"硬币余额不足"、"今日已签到"）

### 11.2 场景联调

- [ ] 注册 → 登录 → 进入首页 → 播放视频 → 点赞 → 评论
- [ ] 发布视频 → 管理后台审核通过 → 首页展示
- [ ] 发布低分评论 → AI自动隐藏（后端返回 status=3）
- [ ] 管理员封禁用户 → 用户所有写操作返回403
- [ ] 投币（余额充足 / 余额不足）
- [ ] 签到（首次 / 重复签到幂等）
- [ ] 搜索无结果 → AI搜索建议展示
- [ ] 注销账号 → 确认流程 → 跳转首页
- [ ] 管理端登录 → 审核视频 → 封禁用户 → 处理举报 → 数据导出

---

## 十二、代码质量

### 12.1 TypeScript

- [ ] 所有组件 Props 使用 `interface` 定义
- [ ] 所有 Hook 返回值类型明确
- [ ] `any` 类型使用数量降至最低

### 12.2 样式规范

- [ ] CSS 变量在 `shared/src/styles/variables.css` 中定义，两端共用
- [ ] DaisyUI `card`/`btn`/`badge`/`modal` 等组件优先使用
- [ ] 响应式：`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`

### 12.3 ESLint

- [ ] user 和 admin 各自配置 ESLint（React Hooks 规则）
- [ ] 提交前格式化所有代码

---

## 十三、文档与交付

### 13.1 README

- [ ] `user/README.md`：项目介绍、技术栈、本地运行步骤、目录结构
- [ ] `admin/README.md`：同上
- [ ] 说明 pnpm workspace 下的依赖安装和启动方式

### 13.2 最终检查

- [ ] `pnpm -r build`（根目录执行）两项目均无报错，生成 `dist/` 产物
- [ ] Git commit 并 push 到 Gitee
- [ ] `docs/frontend/task.md` 所有已完成任务已打 `[x]`

---

*任务清单 V2.1 | 基于前端 PRD V2.0 | 技术栈：React 19 + TypeScript + Tailwind + DaisyUI + Zustand + pnpm workspace*
