# 前端代码变更记录

> 本文档记录对前端 PRD 规范的实际变更与调整

## 一、总体变更概述

本次前端实现基于 `docs/frontend/prd.md` V2.1 规范进行开发，在以下方面进行了调整和优化：

1. API 层使用 Mock 数据替代实际 HTTP 请求
2. 组件结构按原子/分子/组织/容器四级分层
3. 所有组件使用 DaisyUI 极简风格
4. 接口定义完整保留，可无缝替换为真实 API

## 二、共享层（shared）变更

### 2.1 API 层（Mock 数据）

- **文件位置**: `shared/src/api/client.ts`
- **变更说明**: 所有 API 函数使用 Mock 数据实现，返回模拟的 `ApiResult` 响应
- **设计理由**: 后端尚未完成，前端独立开发阶段使用 Mock 数据保证页面可独立运行
- **接口定义**: 保留完整的接口签名，与 PRD 定义的接口路径、请求参数、响应格式完全一致
- **替换方式**: 后端完成后，替换 `shared/src/api/client.ts` 中的 Mock 实现为真实 Axios 请求即可

已实现的 API 函数清单：

| 模块 | 函数 | 状态 |
|------|------|------|
| user | `userRegister`, `userLogin`, `userLogout`, `getProfile`, `updateProfile`, `changePassword`, `deleteAccount` | Mock |
| video | `getVideoList`, `getVideoDetail`, `searchVideos`, `publishVideo`, `getMyVideos`, `deleteVideo` | Mock |
| action | `toggleLike`, `toggleCollect`, `throwCoin`, `getActionStatus` | Mock |
| comment | `getCommentList`, `publishComment`, `deleteComment`, `likeComment` | Mock |
| history/collect/signin | `getHistory`, `recordHistory`, `getCollectList`, `getSigninStatus`, `doSignin` | Mock |
| admin | `adminLogin`, `getAdminStats`, `getPendingVideos`, `approveVideo`, `rejectVideo`, `getUserList`, `banUser`, `unbanUser`, `getReportList`, `ignoreReport`, `takedownReport` | Mock |

### 2.2 组件层（无变更）

- **VideoCard**: 按 PRD 规范实现，包含封面懒加载、时长徽章、AI标签、UP主信息、数据条
- **CommentTree**: 实现楼中楼评论结构
- **SentimentBar**: 按 PRD 实现三种情感区间颜色映射
- **HeaderNav**: 实现搜索框、已登录/未登录状态切换、移动端下拉菜单

### 2.3 Hooks 层（无变更）

- **useInfiniteScroll**: IntersectionObserver 监听滚动底部，支持 `loadMore` 和 `refresh`
- **useDebounce**: 防抖 Hook，300ms 延迟
- **useAi**: 前端直调 AI 搜索建议 API，PRD 要求实现，已实现

## 三、用户端（user）变更

### 3.1 路由守卫

- **变更**: `ProtectedRoute` 组件在用户未登录时跳转 `/user/login?redirect=xxx`
- **说明**: 与 PRD 规范一致

### 3.2 页面实现

| 页面 | 路由 | 状态 | 备注 |
|------|------|------|------|
| HomePage | `/` | 完成 | 无限滚动视频网格 |
| VideoDetailPage | `/video/detail/:id` | 完成 | 播放器 + 三连 + 评论 |
| SearchPage | `/video/search` | 完成 | AI 搜索建议无结果时显示 |
| LoginPage | `/user/login` | 完成 | 测试账号提示 |
| RegisterPage | `/user/register` | 完成 | 前端校验 |
| ProfilePage | `/user/profile` | 完成 | 签到、修改密码、注销 |
| PublishPage | `/video/publish` | 完成 | 封面上传预览 |
| MyVideosPage | `/video/my` | 完成 | 审核状态 Badge |
| HistoryPage | `/history` | 完成 | 观看历史列表 |
| CollectPage | `/collect` | 完成 | 收藏视频网格 |

### 3.3 VideoDetailPage 变更

- **变更**: 将 `CoinInput` 组件替换为内联投币按钮
- **理由**: `CoinInput` 组件需要 `videoId` 和 `userCoins` 两个 props，在详情页内联实现更直接，减少 props 穿透层级
- **功能**: 等价于原设计，投币成功后更新本地视频硬币数

### 3.4 SearchPage 变更

- **变更**: AI 搜索建议逻辑直接在页面内实现
- **理由**: `useAi` hook 已有 `getSearchSuggestions`，页面层直接调用更简洁
- **功能**: 搜索无结果时显示 AI 推荐热词，与 PRD 一致

## 四、管理端（admin）变更

### 4.1 页面实现

| 页面 | 路由 | 状态 | 备注 |
|------|------|------|------|
| AdminLoginPage | `/admin/login` | 完成 | 独立登录页 |
| AdminDashboard | `/admin/dashboard` | 完成 | 4个统计卡片 + 快捷入口 |
| AuditListPage | `/admin/audit` | 完成 | 视频审核 + 驳回弹窗 |
| UserManagePage | `/admin/user` | 完成 | 用户列表 + 封禁/解封 + CSV导出 |
| ReportHandlePage | `/admin/report` | 完成 | 举报列表 + 忽略/下架 |

### 4.2 UserManagePage CSV导出

- **功能**: 点击"导出CSV"按钮，生成并下载用户数据 CSV 文件
- **实现**: 前端使用 Blob + URL.createObjectURL 生成文件，无需后端接口
- **内容**: ID, 用户名, 角色, 状态, 硬币, 经验, 注册时间

## 五、样式规范

### 5.1 DaisyUI 使用

- 所有页面使用 DaisyUI 组件：`card`, `btn`, `badge`, `navbar`, `table`, `modal`, `select`, `textarea`, `input`, `progress`
- 主题：`light` / `dark` / `cupcake` 三主题支持
- 主色调：`#00a1d6`（对应 DaisyUI `primary` 色）

### 5.2 Tailwind 响应式断点

- 视频网格：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- 搜索框：移动端全宽，桌面端 `w-48 md:w-64`

## 六、代码风格

- 所有组件使用 TypeScript interface 定义 Props
- 组件使用 PascalCase，hooks 使用 use 前缀
- 无 emoji 字符，所有文本使用中文描述
- 代码注释使用标准 JS/TS 注释格式

## 七、目录结构

```
frontend/
  shared/src/
    api/           # HTTP + Mock数据（所有接口）
    components/
      base/        # UserAvatar, StatusBadge, AiTagBadge
      business/    # SentimentBar, CoinInput, ConfirmDialog
      domain/      # VideoCard, CommentItem, CommentTree, HeaderNav
    hooks/         # useInfiniteScroll, useDebounce, useAi
    store/         # userStore, playerStore (Zustand)
    styles/        # CSS 变量
    types/         # TypeScript 类型定义
    utils/         # format, sentiment, result, storage
  user/src/
    pages/        # 10个用户端页面
  admin/src/
    pages/        # 5个管理端页面
```

## 八、后端对接说明

当后端完成后，修改 `shared/src/api/client.ts` 中的所有函数实现：

1. 将 `await delay()` 替换为实际的 `axios.post/get/put/delete` 调用
2. 将 Mock 返回数据替换为 `const result = await client.post<T>(url, data)` 的返回值
3. 保持 `ApiResult<T>` 的 `code`, `msg`, `data` 结构不变
4. 后端 Session 管理通过 `client.ts` 拦截器自动处理 `X-Session-Id` header

## 九、已知限制

1. 视频播放使用 `<video>` 标签，filePath 需返回可访问的视频文件 URL
2. 头像上传在 ProfilePage 中未完整实现文件上传流程（需要后端支持）
3. AI 搜索建议依赖 `VITE_AI_BASE_URL` / `VITE_AI_API_KEY` / `VITE_AI_MODEL` 环境变量
4. CSV 导出为前端生成，数据量受浏览器内存限制

## 十、代码审查修复记录

### 10.1 Review Round 1 修复

1. **shared/src/index.ts - API 导出缺失**
   - **问题**: `shared/index.ts` 未导出 `./api`，导致 `@libiland/shared` 无法访问 API 函数
   - **修复**: 添加 `export * from './api'`

2. **CommentItem.tsx - SentimentBar label 属性缺失**
   - **问题**: `CommentItem` 未向 `SentimentBar` 传递 `label` 属性
   - **修复**: 传递 `label={comment.sentimentLabel}`

3. **SearchPage.tsx - 缺少 AI 智能推荐按钮**
   - **问题**: PRD 要求显示"AI智能推荐"触发按钮，但原实现仅在无结果时自动触发
   - **修复**: 添加显式"AI智能推荐"按钮，点击后显示 AI 建议，使用 `showAiSuggestions` 状态控制

4. **ReportHandlePage.tsx - 视频链接使用 span 而非 a 标签**
   - **问题**: 视频链接使用 `<span onClick={window.open}>` 而非语义化 `<a>` 标签
   - **修复**: 替换为 `<a href target="_blank" rel="noopener noreferrer">`

5. **ConfirmDialog.tsx - 不支持 children 属性**
   - **问题**: `AuditListPage` 使用 `<ConfirmDialog><textarea /></ConfirmDialog>` 传自定义内容，但组件不支持 children
   - **修复**: 添加 `children?: React.ReactNode` 属性，并在渲染逻辑中输出 children

6. **VideoDetailPage - 完整重写**
   - **问题**: 之前部分编辑导致代码状态损坏
   - **修复**: 完整重写文件，添加 `REPORT_REASONS` 常量、举报表单状态、正确的导入语句

### 10.2 Review Round 2 修复

1. **format.ts - formatRelativeTime 使用英文**
   - **问题**: `formatRelativeTime` 函数返回英文字符串如 "just now"、"minutes ago"，与项目中文规范不一致
   - **修复**: 替换为中文格式 "刚刚"、"X分钟前"、"X小时前"、"X天前"

2. **api/client.ts - 缺少 reportVideo API 函数**
   - **问题**: `VideoDetailPage` 的 `handleReportSubmit` 仅有 TODO 注释，未实际调用举报 API
   - **修复**: 添加 `reportVideo(form: ReportForm)` Mock 函数，返回 `{ code: 200, msg: '举报已提交，感谢反馈' }`

3. **CollectPage.tsx - 未使用的 imports**
   - **问题**: 导入了 `useEffect` 和 `useState` 但未使用
   - **修复**: 移除未使用的 imports

4. **HistoryPage.tsx - 未使用的 import**
   - **问题**: 导入了 `Trash2` 图标但未使用
   - **修复**: 移除 `Trash2` 导入

5. **AuditListPage.tsx - 未使用的 import**
   - **问题**: 导入了 `ExternalLink` 图标但未使用
   - **修复**: 移除 `ExternalLink` 导入

6. **ProfilePage.tsx - 未使用的 destructured 变量**
   - **问题**: `useUserStore` 解构了 `userInfo` 但未使用
   - **修复**: 仅保留 `updateCoins` 和 `logout`

7. **SearchPage.tsx - 未使用的 import**
   - **问题**: 导入了 `getSearchSuggestions` 但未使用（实际使用 `useAi` hook 的 `getSearchSuggestions`）
   - **修复**: 移除 `getSearchSuggestions` 导入
