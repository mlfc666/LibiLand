# 《哩哔哩哔》前端任务清单

> 开发周期：2026-04-02 ~ 2026-04-13
> 技术栈：React 18 + TypeScript + Tailwind CSS + DaisyUI + Zustand + React Router v6 + pnpm workspace
> 每完成一项，在 `[ ]` 中填入 `[x]`
> 标注 `【PRD-章节】` 的条目表示对应前端 PRD 章节，便于溯源

---

## 一、项目初始化 【PRD-1】

### 1.1 Monorepo 基础搭建

- [ ] 确认 `frontend/pnpm-workspace.yaml` 内容正确：
  ```yaml
  packages:
    - 'shared'
    - 'user'
    - 'admin'
  ```
- [ ] 确认三个目录均已存在且结构正确

### 1.2 shared 包初始化 【PRD-2】

- [ ] 创建 `shared/src/` 目录结构：
  ```
  shared/src/
  ├── api/
  ├── components/
  │   ├── base/          # 原子组件
  │   ├── business/      # 业务组件
  │   └── domain/        # 领域组件
  ├── hooks/
  ├── store/
  ├── styles/
  ├── types/
  └── utils/
  ```
- [ ] 编写 `shared/package.json`：
  ```json
  {
    "name": "@libiland/shared",
    "version": "1.0.0",
    "type": "module",
    "main": "./src/index.js",
    "exports": {
      ".": "./src/index.js",
      "./api": "./src/api/index.js",
      "./components": "./src/components/index.js",
      "./hooks": "./src/hooks/index.js",
      "./store": "./src/store/index.js",
      "./types": "./src/types/index.js",
      "./utils": "./src/utils/index.js"
    }
  }
  ```
- [ ] 创建 `shared/src/index.js` 统一导出入口

### 1.3 user 和 admin 项目配置 【PRD-1.1】

- [ ] 确认 `user/package.json` 中依赖配置正确（包含 `@libiland/shared` workspace 依赖）
- [ ] 确认 `admin/package.json` 中依赖配置正确（包含 `@libiland/shared` workspace 依赖）
- [ ] 安装依赖：`pnpm install`（在 `frontend/` 根目录执行）
- [ ] 配置 `user/vite.config.ts`：路径别名 `@/` 指向 `src/`，代理 `/api` 到后端
- [ ] 配置 `admin/vite.config.ts`：路径别名 `@/` 指向 `src/`，代理 `/api` 到后端

### 1.4 环境变量配置

- [ ] 创建 `user/.env.development`：
  ```
  VITE_API_BASE_URL=http://localhost:8080
  ```
- [ ] 创建 `user/.env.production`：
  ```
  VITE_API_BASE_URL=你的后端地址
  ```
- [ ] 创建 `admin/.env.development`：
  ```
  VITE_API_BASE_URL=http://localhost:8080
  ```
- [ ] 创建 `user/.env`（AI 配置，仅本地开发使用）：
  ```
  VITE_AI_API_KEY=sk-xxxxxxxxxxxx
  VITE_AI_BASE_URL=https://api.deepseek.com
  VITE_AI_MODEL=deepseek-chat
  ```

---

## 二、类型定义（shared/src/types/）【PRD-2.6】

### 2.1 用户类型（`types/user.ts`）

- [ ] 编写 `UserInfo` 接口：`id`, `username`, `avatar`, `role`, `status`, `coins`, `experience`, `gender`, `birthday`, `bio`, `createdAt`
- [ ] 编写 `LoginForm` / `RegisterForm` 类型
- [ ] 编写 `UpdateProfileForm` 类型
- [ ] 导出到 `shared/src/types/index.js`

### 2.2 视频类型（`types/video.ts`）

- [ ] 编写 `Video` 接口：`id`, `title`, `description`, `coverUrl`, `filePath`, `duration`, `authorId`, `authorName`, `authorAvatar`, `category`, `tags`, `aiTags`, `aiSummary`, `status`, `rejectReason`, `clicks`, `likes`, `coins`, `collects`, `comments`, `score`, `downloads`, `publishedAt`, `createdAt`
- [ ] 编写 `VideoListQuery` / `VideoPublishForm` 类型
- [ ] 导出到 `shared/src/types/index.js`

### 2.3 评论类型（`types/comment.ts`）

- [ ] 编写 `Comment` 接口：`id`, `videoId`, `userId`, `username`, `userAvatar`, `parentId`, `rootId`, `content`, `likeCount`, `replyCount`, `sentimentScore`, `sentimentLabel`, `status`, `createdAt`, `replies?: Comment[]`
- [ ] 编写 `SentimentLabel` 类型别名：`'POSITIVE' | 'NORMAL' | 'NEGATIVE'`
- [ ] 编写 `PublishCommentForm` 类型
- [ ] 导出到 `shared/src/types/index.js`

### 2.4 API 统一类型（`types/api.ts`）

- [ ] 编写 `ApiResult<T>` 接口：`code`, `msg`, `data`
- [ ] 编写 `PageResult<T>` 接口：`list`, `total`, `page`, `size`
- [ ] 编写 `ActionStatus` 接口：`liked`, `collected`, `coined`
- [ ] 导出到 `shared/src/types/index.js`

---

## 三、API 请求层（shared/src/api/）【PRD-2.1】

### 3.1 client.ts（Axios 实例）

- [ ] 创建 Axios 实例，`baseURL` 读取 `VITE_API_BASE_URL`，`timeout: 10000`
- [ ] 请求拦截器：自动从 `sessionStorage` 读取 `SESSION_ID`，附加到 `X-Session-Id` header
- [ ] 响应拦截器：统一解包 `ApiResult<T>`，`code !== 200` 时 reject
- [ ] `code === 401`：清除 `SESSION_ID`，跳转 `/user/login`
- [ ] 错误处理：处理网络超时、500 等全局错误，返回标准化错误对象 `{ code, msg, status }`
- [ ] 导出默认实例 `client`

### 3.2 用户接口（`api/user.ts`）

- [ ] `userRegister(form: RegisterForm): Promise<ApiResult>` — POST `/user/register`
- [ ] `userLogin(form: LoginForm): Promise<ApiResult<UserInfo>>` — POST `/user/login`
- [ ] `userLogout(): Promise<ApiResult>` — POST `/user/logout`
- [ ] `getProfile(): Promise<ApiResult<UserInfo>>` — GET `/user/profile`
- [ ] `updateProfile(form: UpdateProfileForm): Promise<ApiResult>` — PUT `/user/profile`
- [ ] `changePassword(oldPassword, newPassword): Promise<ApiResult>` — PUT `/user/password`
- [ ] `deleteAccount(password): Promise<ApiResult>` — DELETE `/user/account`

### 3.3 视频接口（`api/video.ts`）

- [ ] `getVideoList(params: { page?, size?, refresh? }): Promise<ApiResult<PageResult<Video>>>` — GET `/video/list`
- [ ] `getVideoDetail(id: number): Promise<ApiResult<Video>>` — GET `/video/detail?id={id}`
- [ ] `searchVideos(params: { keyword, page?, size? }): Promise<ApiResult<PageResult<Video>>>` — GET `/video/search`
- [ ] `publishVideo(formData: FormData): Promise<ApiResult>` — POST `/video/publish`（multipart）
- [ ] `getMyVideos(params: { page?, size? }): Promise<ApiResult<PageResult<Video>>>` — GET `/video/my`
- [ ] `deleteVideo(id: number): Promise<ApiResult>` — DELETE `/video/{id}`

### 3.4 互动接口（`api/action.ts`）

- [ ] `toggleLike(videoId: number): Promise<ApiResult<ActionStatus>>` — POST `/action/like`
- [ ] `toggleCollect(videoId: number): Promise<ApiResult<ActionStatus>>` — POST `/action/collect`
- [ ] `throwCoin(videoId: number): Promise<ApiResult>` — POST `/action/coin`
- [ ] `getActionStatus(videoId: number): Promise<ApiResult<ActionStatus>>` — GET `/action/status`

### 3.5 评论接口（`api/comment.ts`）

- [ ] `getCommentList(videoId: number): Promise<ApiResult<Comment[]>>` — GET `/comment/list`
- [ ] `publishComment(form: PublishCommentForm): Promise<ApiResult<Comment>>` — POST `/comment/publish`
- [ ] `deleteComment(id: number): Promise<ApiResult>` — DELETE `/comment/{id}`
- [ ] `likeComment(id: number): Promise<ApiResult>` — POST `/comment/like`

### 3.6 历史/收藏/签到接口（`api/history.ts`, `api/collect.ts`, `api/signin.ts`）

- [ ] `getHistory(params: { page?, size? }): Promise<ApiResult<PageResult<HistoryItem>>>` — GET `/history/list`
- [ ] `recordHistory(videoId: number): Promise<ApiResult>` — POST `/history/record`
- [ ] `getCollectList(params: { page?, size? }): Promise<ApiResult<PageResult<Video>>>` — GET `/collect/list`
- [ ] `getSigninStatus(): Promise<ApiResult<{ signed: boolean }>>` — GET `/signin/today`
- [ ] `doSignin(): Promise<ApiResult<{ coinsEarned: number }>>` — POST `/signin/do`

### 3.7 管理端接口（`api/admin.ts`）

- [ ] `adminLogin(form: LoginForm): Promise<ApiResult<UserInfo>>` — POST `/admin/login`
- [ ] `getPendingVideos(params: { page?, size? }): Promise<ApiResult<PageResult<Video>>>` — GET `/admin/video/pendingList`
- [ ] `approveVideo(videoId: number): Promise<ApiResult>` — POST `/admin/video/approve`
- [ ] `rejectVideo(videoId: number, reason: string): Promise<ApiResult>` — POST `/admin/video/reject`
- [ ] `getUserList(params: { page?, size?, keyword?, status? }): Promise<ApiResult<PageResult<UserInfo>>>` — GET `/admin/user/list`
- [ ] `banUser(userId: number): Promise<ApiResult>` — POST `/admin/user/ban`
- [ ] `unbanUser(userId: number): Promise<ApiResult>` — POST `/admin/user/unban`
- [ ] `getReportList(params: { page?, size? }): Promise<ApiResult<PageResult<Report>>>` — GET `/admin/report/list`
- [ ] `ignoreReport(reportId: number, note: string): Promise<ApiResult>` — POST `/admin/report/ignore`
- [ ] `takedownReport(reportId: number, note: string): Promise<ApiResult>` — POST `/admin/report/takedown`

### 3.8 AI 接口（`api/ai.ts`）

- [ ] `getSearchSuggestions(keyword: string): Promise<string[]>` — 前端直调 DeepSeek API，返回5个推荐热词

### 3.9 API 统一导出

- [ ] 创建 `shared/src/api/index.js`，导出所有接口模块
- [ ] 确认 user 和 admin 均可通过 `import { userLogin } from '@libiland/shared/api'` 正确引用

---

## 四、工具函数（shared/src/utils/）【PRD-2.4】

### 4.1 格式化工具（`utils/format.ts`）

- [ ] `formatDuration(seconds: number): string` — 秒 → `"3:45"` 或 `"1:23:45"`
- [ ] `formatDate(date: string | Date): string` — 日期格式化（如 `"2026-04-02"`）
- [ ] `formatRelativeTime(date: string | Date): string` — 相对时间（`"3小时前"`）
- [ ] `formatNumber(n: number): string` — 大数字格式化（`"1.2万播放"`）
- [ ] `formatFileSize(bytes: number): string` — 文件大小（`"123MB"`）

### 4.2 情感工具（`utils/sentiment.ts`）

- [ ] `getSentimentConfig(score: number)`：根据 0.0~1.0 返回 `{ color, label, icon, bgClass }`
- [ ] `getSentimentLabel(score: number): SentimentLabel`：根据评分返回枚举值

### 4.3 结果处理（`utils/result.ts`）

- [ ] `handleApiError(error: any): string`：从 error 对象提取错误消息
- [ ] `isAuthError(error: any): boolean`：判断是否为 401 未登录错误

### 4.4 Session 存储（`utils/storage.ts`）

- [ ] `getSessionId(): string | null`：从 sessionStorage 读取 `SESSION_ID`
- [ ] `setSessionId(id: string): void`：写入 sessionStorage
- [ ] `removeSessionId(): void`：清除 sessionStorage

---

## 五、状态管理（shared/src/store/）【PRD-2.7】

### 5.1 userStore

- [ ] Zustand Store：`userInfo`、`isLoggedIn`、`isAdmin`
- [ ] `login(userInfo: UserInfo)`：写入 userInfo，设置 isAdmin = userInfo.role === 'ADMIN'，同时 `setSessionId()`
- [ ] `logout()`：清除 userInfo/isAdmin，同时 `removeSessionId()`
- [ ] `updateCoins(delta: number)`：更新硬币余额
- [ ] `persist` 中间件：`sessionStorage` 持久化
- [ ] TypeScript 类型完整注解

### 5.2 playerStore

- [ ] Zustand Store：`currentVideo`、`setCurrentVideo()`、`watchDuration`、`setWatchDuration()`

---

## 六、自定义 Hooks（shared/src/hooks/）【PRD-2.3】

### 6.1 useInfiniteScroll

- [ ] 接收 `fetchFn`、`pageSize`
- [ ] 返回 `{ data, loading, hasMore, loadMore, refresh }`
- [ ] IntersectionObserver 监听底部，自动加载下一页

### 6.2 useDebounce

- [ ] `useDebounce<T>(value: T, delay: number): T`：防抖 Hook

### 6.3 useAi

- [ ] `getSearchSuggestions(keyword: string): Promise<string[]>`：调用 AI API 获取推荐热词，带 loading 状态
- [ ] 错误处理：API 失败时返回空数组，不阻塞页面

---

## 七、共享组件（shared/src/components/）【PRD-2.2 / 4 / 6】

### 7.1 原子组件（base/）

#### UserAvatar

- [ ] Props：`src?: string`, `size?: 'sm' | 'md' | 'lg'`, `userId?: number`
- [ ] 圆形头像，`src` 为空时显示首字母占位符
- [ ] 使用 DaisyUI `avatar` 组件

#### StatusBadge

- [ ] Props：`status: 0 | 1 | 2`
- [ ] 0 → `badge-warning` "待审核"；1 → `badge-success` "已通过"；2 → `badge-error` "已驳回"

#### AiTagBadge

- [ ] Props：`tag: string`, `onClick?: (tag: string) => void`
- [ ] DaisyUI `badge badge-primary`，点击触发 `onClick`（跳转标签搜索）

### 7.2 业务组件（business/）

#### SentimentBar

- [ ] Props：`score: number`（0.0~1.0），`label?: SentimentLabel`
- [ ] DaisyUI `progress` 组件，根据评分区间显示不同颜色进度条
- [ ] 图标 + 悬浮提示（具体分数 + 标签）
- [ ] 调用 `utils/sentiment.ts` 获取颜色配置

#### CoinInput

- [ ] Props：`videoId: number`, `userCoins: number`, `onSuccess?: () => void`
- [ ] 显示硬币余额，点击"投币"按钮
- [ ] 余额不足时按钮禁用 + 提示

#### ConfirmDialog

- [ ] Props：`open: boolean`, `title: string`, `message: string`, `onConfirm`, `onCancel`
- [ ] DaisyUI `modal` 组件

### 7.3 领域组件（domain/）

#### VideoCard

- [ ] Props：`video: Video`, `onClick?: () => void`
- [ ] 封面图（`loading="lazy"`）、时长徽章、右下角 `formatDuration(video.duration)`
- [ ] AI 标签徽章：逗号分隔，最多显示3个 `AiTagBadge`
- [ ] 标题（单行截断，hover 显示完整）、UP主信息（`UserAvatar` + 昵称）
- [ ] 数据条：播放/点赞/硬币数（`formatNumber`）
- [ ] 点击卡片 → 调用 `onClick`
- [ ] hover 时封面微微放大（`hover:scale-105`）

#### CommentItem

- [ ] Props：`comment: Comment`, `onReply?`, `onDelete?`, `canDelete?: boolean`
- [ ] 头像 + 用户名 + 相对时间 + 情感进度条（`SentimentBar`）+ 内容
- [ ] 显示"回复"按钮（触发 `onReply`）
- [ ] `canDelete=true` 时渲染"删除"按钮

#### CommentTree

- [ ] Props：`comments: Comment[]`, `videoAuthorId: number`, `onReply?`, `onDelete?`
- [ ] 顶级评论按 `sentimentScore DESC` 排序
- [ ] 二级评论（`parentId !== null`）作为子项渲染在父评论下方（楼中楼）
- [ ] `CommentItem` 渲染每条评论

#### HeaderNav

- [ ] Props：`keyword?: string`, `onSearch?: (kw: string) => void`
- [ ] DaisyUI `navbar` 组件
- [ ] Logo（点击跳转首页 `/`）
- [ ] 搜索框：输入 → 回车/点击搜索图标 → 调用 `onSearch(kw)` 或 `navigate('/video/search?keyword=' + kw)`
- [ ] 已登录：显示用户名 + 下拉菜单（个人中心/投稿/退出）
- [ ] 未登录：显示 [登录] + [注册] 按钮

### 7.4 统一导出

- [ ] 创建 `shared/src/components/index.js`，导出所有组件
- [ ] user 和 admin 通过 `import { VideoCard, HeaderNav } from '@libiland/shared/components'` 使用

---

## 八、用户端页面（user/src/pages/）【PRD-3】

### 8.1 路由配置（user/src/App.tsx）

- [ ] 安装 React Router v6：`pnpm add react-router-dom`（user 和 admin 各自安装）
- [ ] 公开路由：`/`、`/video/detail/:id`、`/video/search`、`/user/login`、`/user/register`
- [ ] 需登录路由：`/video/publish`、`/user/profile`、`/history`、`/collect`、`/video/my`
- [ ] 实现 `ProtectedRoute` 组件：未登录 → 跳转 `/user/login?redirect=xxx`
- [ ] 使用 `React.lazy` + `Suspense` 实现路由懒加载

### 8.2 HomePage

- [ ] 路由：`/` 或 `/video/list`
- [ ] `useInfiniteScroll` 加载视频列表
- [ ] 响应式视频网格：`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`
- [ ] 刷新按钮：`refresh=true` 重新请求
- [ ] `VideoCard` 渲染每条视频
- [ ] 空状态：显示"暂无视频"

### 8.3 VideoDetailPage

- [ ] 路由：`/video/detail/:id`，从 URL 取 `id` 参数
- [ ] 页面加载时：`api.getVideoDetail(id)` + `api.recordHistory(id)`
- [ ] `<video controls autoplay src={video.filePath} />` 播放器
- [ ] 三连按钮：点赞/收藏/投币，点击调用 API，UI 实时切换
- [ ] AI 摘要：`video.aiSummary` 非空时显示 `border-l-4 border-primary` 紫色边框卡片
- [ ] AI 标签：逗号分隔渲染多个 `AiTagBadge`，点击跳转搜索
- [ ] 评论输入框 + 发布按钮
- [ ] `CommentTree` 渲染评论列表
- [ ] `video.authorId === userInfo.id` 时：每条评论旁显示"删除"按钮

### 8.4 SearchPage

- [ ] 路由：`/video/search`，从 URL 取 `keyword` 参数
- [ ] 显示搜索结果数量
- [ ] 有结果：渲染 `VideoCard` 网格
- [ ] **无结果时**：
  - [ ] 显示"未找到相关内容"
  - [ ] 调用 `ai.getSearchSuggestions(keyword)`
  - [ ] 显示 AI 推荐热词，点击跳转到 `/video/search?keyword=xxx`
  - [ ] 提供"🤖 AI智能推荐"按钮（用户主动触发）

### 8.5 LoginPage

- [ ] 路由：`/user/login`
- [ ] DaisyUI `card` + `form` 布局
- [ ] 表单：用户名 + 密码 + 登录按钮
- [ ] 提交 → `api.userLogin()` → 写入 `userStore.login()` → 跳转首页或来源页

### 8.6 RegisterPage

- [ ] 路由：`/user/register`
- [ ] 表单：用户名 + 密码 + 确认密码
- [ ] 前端校验：用户名3-12字符、密码6-20位、两次密码一致
- [ ] 提交 → `api.userRegister()` → 提示注册成功 → 跳转登录页

### 8.7 ProfilePage

- [ ] 路由：`/user/profile`（需登录）
- [ ] 头像上传：`input type="file"` + `api.updateProfile(avatar)`
- [ ] 表单：性别（下拉选择）、生日（date input）、简介（textarea）
- [ ] 保存修改：`api.updateProfile(form)`
- [ ] 修改密码：弹窗 `ConfirmDialog`，输入旧密码+新密码，调用 `api.changePassword()`
- [ ] 硬币余额展示：`userInfo.coins`
- [ ] 注销账号：`ConfirmDialog`，输入密码，`api.deleteAccount()` → logout → 跳转首页

### 8.8 PublishPage

- [ ] 路由：`/video/publish`（需登录）
- [ ] 封面图上传：`input type="file" accept="image/*"` + 本地预览
- [ ] 视频文件上传：`input type="file" accept="video/*"` + 文件名+大小显示
- [ ] 表单：标题（必填，最多100字）、简介（选填，最多500字）、分区（下拉）、标签（逗号分隔，最多5个）
- [ ] 提交：FormData 封装，`api.publishVideo(formData)`
- [ ] 成功后提示"视频已提交，进入审核队列"，跳转首页

### 8.9 MyVideosPage

- [ ] 路由：`/video/my`（需登录）
- [ ] 列表：调用 `api.getMyVideos()`
- [ ] 每条视频：封面 + 标题 + `StatusBadge`（审核状态）+ 发布时间 + 播放量
- [ ] 删除按钮：`ConfirmDialog` 确认后 `api.deleteVideo(id)`

### 8.10 HistoryPage

- [ ] 路由：`/history`（需登录）
- [ ] 列表：调用 `api.getHistory()`
- [ ] 每条：封面 + 标题 + UP主 + 观看时间
- [ ] 删除单条历史：`api.deleteHistory(id)`

### 8.11 CollectPage

- [ ] 路由：`/collect`（需登录）
- [ ] 列表：调用 `api.getCollectList()`
- [ ] 渲染 `VideoCard` 网格

---

## 九、管理端页面（admin/src/pages/）【PRD-4】

### 9.1 路由配置（admin/src/App.tsx）

- [ ] 安装 React Router v6（admin 项目内）
- [ ] `/admin/login` 公开路由
- [ ] `/admin/*` 其他路由需 ADMIN 角色
- [ ] 实现 `AdminRoute` 守卫组件：非管理员 → 跳转 `/admin/login`
- [ ] 管理端布局：侧边栏 + 主内容区（使用 DaisyUI `drawer` 或 `navbar`）

### 9.2 AdminLoginPage

- [ ] 路由：`/admin/login`
- [ ] 独立页面样式（DaisyUI `card`）
- [ ] 表单：用户名 + 密码
- [ ] 提交 → `api.adminLogin()` → 写入 `userStore.login()` → 跳转 `/admin/dashboard`

### 9.3 AdminDashboard

- [ ] 路由：`/admin/dashboard`
- [ ] DaisyUI `stats` 组件展示：用户总数 / 视频总数 / 待审核视频 / 待处理举报
- [ ] 快捷入口卡片：审核视频 / 用户管理 / 举报处理

### 9.4 AuditListPage

- [ ] 路由：`/admin/audit`
- [ ] 列表：调用 `api.getPendingVideos()`
- [ ] 每条视频：封面 + 标题 + UP主 + 简介 + 提交时间 + 操作按钮
- [ ] 预览按钮：新窗口打开视频
- [ ] 通过按钮：调用 `api.approveVideo(id)`
- [ ] 驳回按钮：`ConfirmDialog` 输入驳回原因，`api.rejectVideo(id, reason)`

### 9.5 UserManagePage

- [ ] 路由：`/admin/user`
- [ ] DaisyUI `table` 展示用户列表
- [ ] 搜索框：按用户名筛选
- [ ] 状态筛选：全部 / 正常 / 已封禁
- [ ] 操作列：封禁按钮 / 解封按钮（`badge badge-error` / `badge badge-success`）
- [ ] 导出按钮：调用 `api.exportUsers()`（或 `window.open` 下载链接），触发文件下载

### 9.6 ReportHandlePage

- [ ] 路由：`/admin/report`
- [ ] 列表：调用 `api.getReportList()`
- [ ] 每条：举报人 + 被举报视频（可跳转查看）+ 举报原因类型（`badge`）+ 时间
- [ ] 忽略按钮：`ConfirmDialog` 填写备注，`api.ignoreReport(id, note)`
- [ ] 下架按钮：`ConfirmDialog` 填写备注，`api.takedownReport(id, note)`

---

## 十、AI 能力接入 【PRD-5】

### 10.1 useAi Hook

- [ ] `getSearchSuggestions(keyword: string): Promise<string[]>`：POST DeepSeek API，`messages` 传入 Prompt，返回5个热词
- [ ] loading 状态
- [ ] 错误处理：API 失败时返回空数组

### 10.2 搜索建议UI（SearchPage）

- [ ] 无结果时显示 "🤖 您是否在找：" + 热词列表
- [ ] 每个热词可点击，点击后 `navigate('/video/search?keyword=' + s)`
- [ ] 提供"🤖 AI智能推荐"按钮，用户点击后调用 AI

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

### 12.3 ESLint + Prettier

- [ ] 在 user 和 admin 各自配置 ESLint（React Hooks 规则）
- [ ] 在 user 和 admin 各自配置 Prettier（单引号、分号、打印宽度）
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

## 十四、Tailwind + DaisyUI 配置

### 14.1 user 配置

- [ ] 安装 Tailwind + DaisyUI：`pnpm add -D tailwindcss postcss autoprefixer && pnpm add daisyui`（user）
- [ ] 初始化：`npx tailwindcss init -p`（在 user 目录）
- [ ] 配置 `tailwind.config.ts`：
  ```ts
  import daisyui from 'daisyui';
  export default {
    plugins: [daisyui],
    content: ['./index.html', './src/**/*.{ts,tsx}'],
  };
  ```
- [ ] 配置 `tsconfig.json`：路径别名 `@/` 指向 `src/`

### 14.2 admin 配置

- [ ] 安装 Tailwind + DaisyUI：`pnpm add -D tailwindcss postcss autoprefixer && pnpm add daisyui`（admin）
- [ ] 初始化和配置同上

---

*任务清单 V2.0 | 基于前端 PRD V2.0 | 技术栈：React 18 + TS/TSX + Tailwind + DaisyUI + Zustand + pnpm workspace*
