# 《哩哔哩哔》前端任务清单

> 开发周期：2026-04-02 ~ 2026-04-13
> 技术栈：React 18 + TypeScript + TSX + Tailwind CSS + DaisyUI + Zustand + React Router v6
> 每完成一项，在 `[ ]` 中填入 `[x]`
> 标注 `【PRD-章节】` 表示对应前端 PRD 章节，便于溯源

---

## 一、项目初始化（4.2）

### 1.1 脚手架搭建

- [ ] 创建 Vite + React + TypeScript 项目：`npm create vite@latest frontend -- --template react-ts`
- [ ] 安装依赖：
  - [ ] `npm install react-router-dom`（React Router v6）
  - [ ] `npm install zustand`（状态管理）
  - [ ] `npm install axios`（HTTP 客户端）
  - [ ] `npm install -D tailwindcss postcss autoprefixer`
  - [ ] `npm install daisyui`（DaisyUI 组件库）
  - [ ] `npm install lucide-react`（图标库）
  - [ ] `npm install recharts`（图表，可选）
- [ ] 初始化 Tailwind CSS：`npx tailwindcss init -p`
- [ ] 配置 `tailwind.config.ts`：
  - [ ] 添加 DaisyUI 插件：`plugins: [require('daisyui')]`
  - [ ] 配置 `content: ['./index.html', './src/**/*.{ts,tsx}']`
- [ ] 配置 `tsconfig.json`（路径别名 `@/` 指向 `src/`）

### 1.2 目录结构创建

- [ ] 创建 `src/api/`（Axios 封装 + 各模块接口）
- [ ] 创建 `src/components/`（公共组件）
- [ ] 创建 `src/hooks/`（自定义 Hooks）
- [ ] 创建 `src/pages/`（页面组件）
- [ ] 创建 `src/pages/admin/`（管理端页面）
- [ ] 创建 `src/store/`（Zustand Store）
- [ ] 创建 `src/types/`（TypeScript 类型定义）
- [ ] 创建 `src/utils/`（工具函数）
- [ ] 创建 `public/` 静态资源目录

### 1.3 环境变量配置

- [ ] 创建 `.env.development`：`VITE_API_BASE_URL=http://localhost:8080`
- [ ] 创建 `.env.production`：`VITE_API_BASE_URL=你的后端地址`
- [ ] 创建 `.env`（包含 AI API Key）：`VITE_AI_API_KEY`、`VITE_AI_BASE_URL`、`VITE_AI_MODEL`

---

## 二、类型定义（types）

### 2.1 用户类型（`src/types/user.ts`）

- [ ] 编写 `UserInfo` 接口：`id`, `username`, `avatar`, `role`, `status`, `coins`, `experience`, `gender`, `birthday`, `bio`, `createdAt`
- [ ] 编写 `LoginForm` / `RegisterForm` 类型
- [ ] 编写 `UpdateProfileForm` 类型

### 2.2 视频类型（`src/types/video.ts`）

- [ ] 编写 `Video` 接口：`id`, `title`, `description`, `coverUrl`, `filePath`, `duration`, `authorId`, `authorName`, `authorAvatar`, `category`, `tags`, `aiTags`, `aiSummary`, `status`, `rejectReason`, `clicks`, `likes`, `coins`, `collects`, `comments`, `score`, `downloads`, `publishedAt`, `createdAt`
- [ ] 编写 `VideoListQuery` / `VideoPublishForm` 类型

### 2.3 评论类型（`src/types/comment.ts`）

- [ ] 编写 `Comment` 接口：`id`, `videoId`, `userId`, `username`, `userAvatar`, `parentId`, `rootId`, `content`, `likeCount`, `replyCount`, `sentimentScore`, `sentimentLabel`, `status`, `createdAt`, `replies?: Comment[]`
- [ ] 编写 `PublishCommentForm` 类型

### 2.4 API 统一类型（`src/types/api.ts`）

- [ ] 编写 `ApiResult<T>` 接口：`code`, `msg`, `data`
- [ ] 编写 `PageResult<T>` 接口：`list`, `total`, `page`, `size`
- [ ] 编写 `ActionStatus` 接口：`liked`, `collected`, `coined`

---

## 三、API 请求层（api/）

### 3.1 Axios 实例封装（`src/api/client.ts`）

- [ ] 创建 `client.ts`：Axios 实例，`baseURL` 读取 `VITE_API_BASE_URL`
- [ ] 请求拦截器：自动附加 `X-Session-Id` header（从 `sessionStorage` 读取）
- [ ] 响应拦截器：统一解包 `ApiResult<T>`，`code !== 200` 时 reject，`code === 401` 时跳转登录页
- [ ] 错误拦截器：处理网络超时、500 等全局错误

### 3.2 用户接口（`src/api/user.ts`）

- [ ] `userRegister(form: RegisterForm): Promise<void>` — POST `/user/register`
- [ ] `userLogin(form: LoginForm): Promise<UserInfo>` — POST `/user/login`
- [ ] `userLogout(): Promise<void>` — POST `/user/logout`
- [ ] `getProfile(): Promise<UserInfo>` — GET `/user/profile`
- [ ] `updateProfile(form: UpdateProfileForm): Promise<void>` — PUT `/user/profile`
- [ ] `changePassword(oldPassword, newPassword): Promise<void>` — PUT `/user/password`
- [ ] `deleteAccount(password): Promise<void>` — DELETE `/user/account`
- [ ] `getUserStats(): Promise<UserStats>` — GET `/user/stats`

### 3.3 视频接口（`src/api/video.ts`）

- [ ] `getVideoList(params: { page, size, refresh? }): Promise<PageResult<Video>>` — GET `/video/list`
- [ ] `getVideoDetail(id: number): Promise<Video>` — GET `/video/detail?id={id}`
- [ ] `searchVideos(params: { keyword, page, size }): Promise<PageResult<Video>>` — GET `/video/search`
- [ ] `publishVideo(formData: FormData): Promise<void>` — POST `/video/publish`（multipart）
- [ ] `getMyVideos(params: { page, size }): Promise<PageResult<Video>>` — GET `/video/my`
- [ ] `deleteVideo(id: number): Promise<void>` — DELETE `/video/{id}`

### 3.4 互动接口（`src/api/action.ts`）

- [ ] `toggleLike(videoId: number): Promise<ActionStatus>` — POST `/action/like`
- [ ] `toggleCollect(videoId: number): Promise<ActionStatus>` — POST `/action/collect`
- [ ] `throwCoin(videoId: number): Promise<void>` — POST `/action/coin`
- [ ] `getActionStatus(videoId: number): Promise<ActionStatus>` — GET `/action/status`

### 3.5 评论接口（`src/api/comment.ts`）

- [ ] `getCommentList(videoId: number): Promise<Comment[]>` — GET `/comment/list`
- [ ] `publishComment(form: PublishCommentForm): Promise<Comment>` — POST `/comment/publish`
- [ ] `deleteComment(id: number): Promise<void>` — DELETE `/comment/{id}`
- [ ] `likeComment(id: number): Promise<void>` — POST `/comment/like`

### 3.6 历史/收藏/签到接口

- [ ] `getHistory(params: { page, size }): Promise<PageResult<HistoryItem>>` — GET `/history/list`
- [ ] `recordHistory(videoId: number): Promise<void>` — POST `/history/record`
- [ ] `getCollectList(params: { page, size }): Promise<PageResult<Video>>` — GET `/collect/list`
- [ ] `getSigninStatus(): Promise<{ signed: boolean }>` — GET `/signin/today`
- [ ] `doSignin(): Promise<{ coinsEarned: number }>` — POST `/signin/do`

### 3.7 管理端接口（`src/api/admin.ts`）

- [ ] `adminLogin(form: LoginForm): Promise<UserInfo>` — POST `/admin/login`
- [ ] `getPendingVideos(params: { page, size }): Promise<PageResult<Video>>` — GET `/admin/video/pendingList`
- [ ] `approveVideo(videoId: number): Promise<void>` — POST `/admin/video/approve`
- [ ] `rejectVideo(videoId: number, reason: string): Promise<void>` — POST `/admin/video/reject`
- [ ] `getUserList(params: { page, size, keyword?, status? }): Promise<PageResult<UserInfo>>` — GET `/admin/user/list`
- [ ] `banUser(userId: number): Promise<void>` — POST `/admin/user/ban`
- [ ] `unbanUser(userId: number): Promise<void>` — POST `/admin/user/unban`
- [ ] `getReportList(params: { page, size }): Promise<PageResult<Report>>` — GET `/admin/report/list`
- [ ] `ignoreReport(reportId: number, note: string): Promise<void>` — POST `/admin/report/ignore`
- [ ] `takedownReport(reportId: number, note: string): Promise<void>` — POST `/admin/report/takedown`

### 3.8 AI 接口（`src/api/ai.ts`）

- [ ] `searchSuggestions(keyword: string): Promise<string[]>`：前端直接调用 DeepSeek/OpenAI API，返回5个推荐热词

---

## 四、工具函数（utils/）

### 4.1 格式化工具（`src/utils/format.ts`）

- [ ] `formatDuration(seconds: number): string` — 秒 → "3:45" 或 "1:23:45"
- [ ] `formatDate(date: string | Date): string` — 日期格式化（如"2026-04-02"）
- [ ] `formatRelativeTime(date: string | Date): string` — 相对时间（"3小时前"）
- [ ] `formatNumber(n: number): string` — 大数字格式化（"1.2万播放"）
- [ ] `formatFileSize(bytes: number): string` — 文件大小（"123MB"）

### 4.2 情感工具（`src/utils/sentiment.ts`）

- [ ] `getSentimentConfig(score: number)`：根据 0.0~1.0 返回 `{ color, label, icon, bgClass }`

### 4.3 结果处理（`src/utils/result.ts`）

- [ ] `handleApiError(error: any): string`：从 error 对象提取错误消息
- [ ] `isAuthError(error: any): boolean`：判断是否为 401 未登录错误

---

## 五、状态管理（store/）

### 5.1 用户状态（`src/store/userStore.ts`）

- [ ] Zustand Store：`userInfo`、`isLoggedIn`、`isAdmin`、`login()`、`logout()`、`updateCoins()`
- [ ] `persist` 中间件：`sessionStorage` 持久化
- [ ] `refreshProfile()`：刷新个人信息
- [ ] TypeScript 类型完整注解

### 5.2 播放器状态（`src/store/playerStore.ts`）

- [ ] Zustand Store：`currentVideo`、`setCurrentVideo()`、`watchDuration`、`setWatchDuration()`

### 5.3 缓存状态（`src/store/cacheStore.ts`）

- [ ] Zustand Store：`videoListCache`、`setCache()`、`getCache()`、`clearCache()`

---

## 六、自定义 Hooks（hooks/）

### 6.1 `src/hooks/useInfiniteScroll.ts`

- [ ] 接收 `fetchFn`、`pageSize`
- [ ] 返回 `{ data, loading, hasMore, loadMore, refresh }`
- [ ] IntersectionObserver 监听底部，自动加载下一页

### 6.2 `src/hooks/useDebounce.ts`

- [ ] `useDebounce<T>(value: T, delay: number): T`：防抖 Hook

### 6.3 `src/hooks/useAi.ts`

- [ ] `getSearchSuggestions(keyword: string): Promise<string[]>`：调用 AI API 获取推荐热词，带 loading 状态

---

## 七、公共组件（components/）

### 7.1 VideoCard（`src/components/VideoCard.tsx`）

- [ ] Props：`video: Video`, `onClick?: () => void`
- [ ] 封面图（`loading="lazy"`）、时长徽章、AI标签徽章（`AiTagBadge`）
- [ ] 标题（单行截断，hover 显示完整）、UP主信息、数据条（播放/点赞/硬币）
- [ ] 点击卡片 → 调用 `onClick`

### 7.2 SentimentBar（`src/components/SentimentBar.tsx`）

- [ ] Props：`score: number`（0.0~1.0）
- [ ] DaisyUI `progress` 组件，彩色进度条
- [ ] 图标 + 悬浮提示（具体分数+标签）
- [ ] 调用 `utils/sentiment.ts` 获取颜色配置

### 7.3 AiTagBadge（`src/components/AiTagBadge.tsx`）

- [ ] Props：`tag: string`, `onClick?: (tag: string) => void`
- [ ] DaisyUI `badge badge-primary`，点击触发 `onClick`（跳转标签搜索）

### 7.4 StatusBadge（`src/components/StatusBadge.tsx`）

- [ ] Props：`status: 0 | 1 | 2`
- [ ] 根据状态返回 `badge-warning` / `badge-success` / `badge-error`

### 7.5 CommentItem（`src/components/CommentItem.tsx`）

- [ ] Props：`comment: Comment`, `onReply?`, `onDelete?`, `canDelete?: boolean`
- [ ] 头像 + 用户名 + 时间 + 情感进度条（`SentimentBar`）+ 内容 + 点赞数
- [ ] 显示"回复"按钮（触发 `onReply`）
- [ ] 显示"删除"按钮（`canDelete=true` 时渲染）

### 7.6 CommentTree（`src/components/CommentTree.tsx`）

- [ ] Props：`comments: Comment[]`, `videoAuthorId: number`, `onReply?`, `onDelete?`
- [ ] 顶级评论按 `sentimentScore DESC` 排序
- [ ] 二级评论（`parentId !== null`）作为子项渲染在父评论下方（楼中楼）
- [ ] `CommentItem` 渲染每条评论

### 7.7 UserAvatar（`src/components/UserAvatar.tsx`）

- [ ] Props：`src?: string`, `size?: 'sm' | 'md' | 'lg'`, `userId?: number`
- [ ] 圆形头像，默认显示首字母占位符

### 7.8 CoinInput（`src/components/CoinInput.tsx`）

- [ ] Props：`videoId: number`, `userCoins: number`, `onSuccess?: () => void`
- [ ] 显示硬币余额，点击"投币"按钮
- [ ] 余额不足时按钮禁用 + 提示

### 7.9 HeaderNav（`src/components/HeaderNav.tsx`）

- [ ] DaisyUI `navbar` 组件
- [ ] Logo（点击跳转首页）
- [ ] 搜索框：输入 → 回车/点击搜索图标 → 跳转 `/video/search?keyword=xxx`
- [ ] 已登录：显示用户名 + [个人中心] + [投稿] + [退出]；未登录：显示 [登录] + [注册]

### 7.10 ConfirmDialog（`src/components/ConfirmDialog.tsx`）

- [ ] Props：`open: boolean`, `title: string`, `message: string`, `onConfirm`, `onCancel`
- [ ] DaisyUI `modal` 组件

---

## 八、页面组件（pages/）

### 8.1 HomePage（`src/pages/HomePage.tsx`）

- [ ] 路由：`/` 或 `/video/list`
- [ ] `useInfiniteScroll` 加载视频列表
- [ ] 视频网格：响应式（`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`）
- [ ] 刷新按钮：`refresh=true` 重新请求
- [ ] `VideoCard` 渲染每条视频
- [ ] 空状态：显示"暂无视频"

### 8.2 VideoDetailPage（`src/pages/VideoDetailPage.tsx`）

- [ ] 路由：`/video/detail/:id`，从 URL 取 `id` 参数
- [ ] 页面加载时：`api.getVideoDetail(id)` + `api.recordHistory(id)`
- [ ] `<video controls src={video.filePath} />` 播放器
- [ ] 三连按钮：点赞/收藏/投币，点击调用 API，UI 实时切换
- [ ] AI 摘要：`video.aiSummary` 非空时显示紫色边框卡片
- [ ] AI 标签：逗号分隔渲染多个 `AiTagBadge`
- [ ] 评论输入框 + 发布按钮
- [ ] `CommentTree` 渲染评论列表
- [ ] UP主（`video.authorId === userInfo.id`）时：每条评论旁显示"删除"按钮

### 8.3 SearchPage（`src/pages/SearchPage.tsx`）

- [ ] 路由：`/video/search`，从 URL 取 `keyword` 参数
- [ ] 显示搜索结果数量
- [ ] 有结果：渲染 `VideoCard` 网格
- [ ] **无结果时**：
  - [ ] 显示"未找到相关内容"
  - [ ] 调用 `ai.getSearchSuggestions(keyword)`
  - [ ] 显示 AI 推荐热词，点击跳转到 `/video/search?keyword=xxx`
  - [ ] 提供"AI 智能推荐"按钮（用户主动触发）

### 8.4 LoginPage（`src/pages/LoginPage.tsx`）

- [ ] 路由：`/user/login`
- [ ] DaisyUI `card` + `form` 布局
- [ ] 表单：用户名 + 密码 + 登录按钮
- [ ] 提交 → `api.userLogin()` → 写入 `userStore.login()` → 跳转首页或来源页

### 8.5 RegisterPage（`src/pages/RegisterPage.tsx`）

- [ ] 路由：`/user/register`
- [ ] 表单：用户名 + 密码 + 确认密码
- [ ] 前端校验：用户名3-12字符、密码6-20位、两次密码一致
- [ ] 提交 → `api.userRegister()` → 提示注册成功 → 跳转登录页

### 8.6 ProfilePage（`src/pages/ProfilePage.tsx`）

- [ ] 路由：`/user/profile`（需登录）
- [ ] 头像上传：`input type="file"` + `api.updateProfile(avatar)`
- [ ] 表单：性别（下拉选择）、生日（date input）、简介（textarea）
- [ ] 保存修改按钮：`api.updateProfile(form)`
- [ ] 修改密码：弹窗 ConfirmDialog，输入旧密码+新密码，调用 `api.changePassword()`
- [ ] 硬币余额展示：`userInfo.coins`
- [ ] 数据统计卡片：播放总数/点赞总数/投币总数（`api.getUserStats()`）
- [ ] 注销账号：ConfirmDialog，输入密码，调用 `api.deleteAccount()` → logout → 跳转首页

### 8.7 PublishPage（`src/pages/PublishPage.tsx`）

- [ ] 路由：`/video/publish`（需登录）
- [ ] 封面图上传：`input type="file" accept="image/*"` + 本地预览
- [ ] 视频文件上传：`input type="file" accept="video/*"` + 文件名+大小显示
- [ ] 表单：标题（必填）、简介（选填）、分区（下拉）、标签（逗号分隔）
- [ ] 提交：FormData 封装所有字段，`api.publishVideo(formData)`
- [ ] 成功后提示"视频已提交，进入审核队列"，跳转首页

### 8.8 MyVideosPage（`src/pages/MyVideosPage.tsx`）

- [ ] 路由：`/video/my`（需登录）
- [ ] 视频列表：调用 `api.getMyVideos()`
- [ ] 每条视频显示：封面 + 标题 + `StatusBadge`（审核状态）+ 发布时间 + 播放量
- [ ] 删除按钮（仅自己的视频）：ConfirmDialog 确认后 `api.deleteVideo(id)`

### 8.9 HistoryPage（`src/pages/HistoryPage.tsx`）

- [ ] 路由：`/history`（需登录）
- [ ] 列表：调用 `api.getHistory()`
- [ ] 每条：封面 + 标题 + UP主 + 观看时间
- [ ] 删除单条历史：`api.deleteHistory(id)`

### 8.10 CollectPage（`src/pages/CollectPage.tsx`）

- [ ] 路由：`/collect`（需登录）
- [ ] 列表：调用 `api.getCollectList()`
- [ ] 渲染 `VideoCard` 网格

---

## 九、管理端页面（pages/admin/）

### 9.1 AdminLoginPage（`src/pages/admin/AdminLoginPage.tsx`）

- [ ] 路由：`/admin/login`
- [ ] 独立页面样式（DaisyUI card）
- [ ] 表单：用户名 + 密码
- [ ] 提交 → `api.adminLogin()` → 写入 `userStore.login()` → 跳转 `/admin/dashboard`

### 9.2 AdminDashboard（`src/pages/admin/AdminDashboard.tsx`）

- [ ] 路由：`/admin/dashboard`（需管理员权限）
- [ ] DaisyUI `stats` 组件展示：用户总数 / 视频总数 / 待审核视频数 / 待处理举报数
- [ ] 快捷入口卡片：审核视频 / 用户管理 / 举报处理

### 9.3 AuditListPage（`src/pages/admin/AuditListPage.tsx`）

- [ ] 路由：`/admin/audit`（需管理员权限）
- [ ] 列表：调用 `api.getPendingVideos()`
- [ ] 每条视频：封面 + 标题 + UP主 + 简介 + 提交时间 + 操作按钮
- [ ] 预览按钮：`<a href={video.filePath} target="_blank">` 新窗口打开
- [ ] 通过按钮：调用 `api.approveVideo(id)`
- [ ] 驳回按钮：弹出 ConfirmDialog，输入驳回原因，调用 `api.rejectVideo(id, reason)`

### 9.4 UserManagePage（`src/pages/admin/UserManagePage.tsx`）

- [ ] 路由：`/admin/user`（需管理员权限）
- [ ] DaisyUI `table` 展示用户列表
- [ ] 搜索框：按用户名筛选，调用 `api.getUserList({ keyword })`
- [ ] 状态筛选：全部 / 正常 / 已封禁
- [ ] 操作列：封禁按钮 / 解封按钮（`badge badge-error` / `badge badge-success`）
- [ ] 导出按钮：调用 `api.exportUsers()`，触发文件下载

### 9.5 ReportHandlePage（`src/pages/admin/ReportHandlePage.tsx`）

- [ ] 路由：`/admin/report`（需管理员权限）
- [ ] 列表：调用 `api.getReportList()`
- [ ] 每条：举报人 + 被举报视频（可跳转查看）+ 举报原因类型（`badge`）+ 时间
- [ ] 忽略按钮：弹出 ConfirmDialog，填写备注，调用 `api.ignoreReport(id, note)`
- [ ] 下架按钮：弹出 ConfirmDialog，填写备注，调用 `api.takedownReport(id, note)`

---

## 十、路由配置（App.tsx + router/）

### 10.1 路由定义

- [ ] 公开路由：`/`（HomePage）、`/video/detail/:id`、`/video/search`、`/user/login`、`/user/register`、`/admin/login`
- [ ] 需登录路由：`/video/publish`、`/user/profile`、`/history`、`/collect`、`/video/my`
- [ ] 需管理员路由：`/admin/*`（除了 `/admin/login`）

### 10.2 路由守卫组件

- [ ] `ProtectedRoute`：未登录 → 跳转 `/user/login?redirect=xxx`
- [ ] `AdminRoute`：非管理员 → 跳转 `/admin/login`

---

## 十一、AI 能力接入

### 11.1 useAi Hook（`src/hooks/useAi.ts`）

- [ ] `getSearchSuggestions(keyword: string): Promise<string[]>`：POST DeepSeek API，`messages` 传入 Prompt，返回5个热词
- [ ] loading 状态：`const [loading, setLoading] = useState(false)`
- [ ] 错误处理：API 失败时返回空数组，不阻塞页面

### 11.2 搜索建议UI（SearchPage）

- [ ] 无结果时显示 "🤖 您是否在找：" + 热词列表
- [ ] 每个热词 `<span>` 可点击，点击后 `navigate(`/video/search?keyword=${s}`)`
- [ ] 主动触发：提供"🤖 AI智能推荐"按钮，用户点击后调用 AI

---

## 十二、联调与测试

### 12.1 前后端接口对接

- [ ] 确认所有接口路径、请求方法、请求体与后端一致
- [ ] 处理 `ApiResult<T>` 统一响应结构
- [ ] 处理 401：跳转登录页
- [ ] 处理 403：显示"账号已被封禁"或"无权限"
- [ ] 处理 409：显示业务错误消息（如"硬币余额不足"、"今日已签到"）

### 12.2 场景联调

- [ ] 注册 → 登录 → 进入首页 → 播放视频 → 点赞 → 评论
- [ ] 发布视频 → 管理后台审核通过 → 首页展示
- [ ] 发布低分评论 → AI自动隐藏（后端返回 status=3）
- [ ] 管理员封禁用户 → 用户所有写操作返回403
- [ ] 投币（余额充足 / 余额不足）
- [ ] 签到（首次 / 重复签到幂等）
- [ ] 搜索无结果 → AI搜索建议展示
- [ ] 注销账号 → 确认流程 → 跳转首页

---

## 十三、代码质量

### 13.1 TypeScript

- [ ] 所有组件 Props 使用 `interface` 或 `type` 定义
- [ ] 所有 Hook 返回值类型明确
- [ ] `any` 类型使用数量降至最低

### 13.2 样式规范

- [ ] 全局样式在 `src/index.css`（Tailwind `@tailwind` 指令）
- [ ] DaisyUI `card`/`btn`/`badge`/`modal` 等组件优先使用
- [ ] 响应式：`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`

### 13.3 ESLint + Prettier

- [ ] 配置 ESLint（React Hooks 规则）
- [ ] 配置 Prettier（单引号、分号、打印宽度）
- [ ] 提交前格式化所有代码

---

## 十四、文档与交付

### 14.1 README（`frontend/README.md`）

- [ ] 项目介绍
- [ ] 技术栈说明
- [ ] 本地运行步骤（`npm install` → `npm run dev`）
- [ ] 目录结构说明
- [ ] 接口列表（可引用 docs/frontend/prd.md）

### 14.2 最终检查

- [ ] `npm run build` 无报错，生成 `dist/` 产物
- [ ] Git commit 并 push 到 Gitee
- [ ] `docs/frontend/task.md` 所有已完成任务已打 `[x]`

---

*任务清单 V1.0 | 基于前端 PRD V1.0 | 技术栈：React 18 + TS/TSX + Tailwind + DaisyUI + Zustand*
