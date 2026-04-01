# 《哩哔哩哔》项目任务清单

> 开发周期：2026-04-02 ~ 2026-04-13
> 每完成一项，在 `[ ]` 中填入 `[x]`
> 标注 `【PRD-x.x】` 的条目表示对应 PRD 章节，便于溯源

---

## 一、项目准备 & 基础设施

### 1.1 项目初始化

- [ ] 确定技术栈：JDK 21、MySQL 8.0+、Tomcat 10.1+、IntelliJ IDEA
- [ ] 创建 Maven 项目（`pom.xml`），配置依赖：Jakarta Servlet API、MySQL Connector、`com.beust:klaxon`（或手写 JSON）
- [ ] 创建包结构：`po/dao/service/service.impl/servlet/controller/engine/core/config/util/constant/filter/exception`
- [ ] 编写 `resources/config.properties`：数据库连接（url/username/password）、文件上传路径、`app.host`、`app.port`
- [ ] 编写 `resources/log4j.properties`（或手写日志框架配置）
- [ ] Git 初始化：`git init`，创建 Gitee 公开仓库，配置 `.gitignore`（忽略 `target/`、`*.class`、`uploads/`）
- [ ] 编写 `README.md` 框架（后续完善）

### 1.2 数据库设计 【PRD-4.2 ~ 4.3】

- [ ] 编写 `docs/schema.sql`：完整 DDL（9张表），含索引、外键、注释
  - [ ] `users` 表（含 `role ENUM`、`status`、`coins`、`login_fail_count`、`lock_until`）
  - [ ] `videos` 表（含 `ai_tags`、`ai_summary`、`ai_quality_score`、`score`、`reject_reason`、`downloads`）
  - [ ] `comments` 表（含 `root_id`、`sentiment_score`、`sentiment_label`、`reply_count`）
  - [ ] `action_logs` 表（含 `uk_user_video_action` 唯一索引）
  - [ ] `history` 表（含 `uk_user_video` 唯一索引）
  - [ ] `reports` 表（含 `reason_type`、`status`、`handler_id`、`handle_result`）
  - [ ] `signin_records` 表（含 `uk_user_date` 唯一索引）
  - [ ] `video_audits` 表
  - [ ] `sentiment_records` 表
- [ ] 编写初始化数据 SQL：管理员账号 `admin / admin123 (BCrypt加密)`
- [ ] 创建枚举类：`UserRole`、`UserStatus`、`VideoStatus`、`ActionType`、`CommentStatus`、`SentimentLabel`、`ReportType`
- [ ] 创建实体类（PO）：`User`、`Video`、`Comment`、`ActionLog`、`History`、`Report`、`SigninRecord`、`VideoAudit`、`SentimentRecord`

---

## 二、Hesper-IOC 框架 【PRD-3.1】

- [ ] 编写 `@Component` 注解：`@Target(ElementType.TYPE)`，`value()` 默认类名首字母小写
- [ ] 编写 `@Autowired` 注解：`@Target({ElementType.TYPE, ElementType.METHOD})`，`required()` 默认 true
- [ ] 实现 `BeanDefinition`：保存 Bean 名称、类型、是否单例、依赖关系
- [ ] 实现 `ApplicationContext`：
  - [ ] `start()`：包扫描 `com.project.www` 及子包，识别 @Component/@Service/@Repository/@Controller
  - [ ] 注册所有 `BeanDefinition` 到 `ConcurrentHashMap<String, BeanDefinition>`
  - [ ] 构造器注入：递归解析构造器参数依赖，按拓扑序实例化
  - [ ] 字段注入：反射赋值 `@Autowired` 字段
  - [ ] 循环依赖检测（构造器循环依赖 → 抛 `CircularDependencyException`）
  - [ ] 调用 `init()` 方法
- [ ] 实现 `getBean(String name)` / `getBean(Class<T> type)`
- [ ] 实现 `destroy()`：调用所有 Bean 的 `destroy()` 方法
- [ ] IOC 容器自测：写一个 `@Service` + `@Autowired` 依赖注入的单测

---

## 三、Hesper-MVC 框架 【PRD-3.2】

### 3.1 核心组件

- [ ] 编写路由注解：`@RequestMapping(value, method)`、`@GetMapping(value)`、`@PostMapping(value)`
- [ ] 编写 `@RequestParam`：从 request 取参数绑定到方法参数
- [ ] 编写 `@RequestBody`：将 JSON body 映射到 POJO
- [ ] 编写 `@PathVariable`：从 URL 路径取参数
- [ ] 编写 `@Autowired`（复用 IOC 的）
- [ ] 编写 `HandlerMapping`：保存 `url → ControllerMethod` 映射
- [ ] 编写 `ControllerMethod`：保存执行方法、参数列表、注解信息
- [ ] 编写 `ParamBinder`：将 HttpServletRequest 参数转换为方法参数类型
- [ ] 编写 `JsonHelper`：POJO → JSON 字符串（手写或引入 `com.beust:klaxon`）
- [ ] 编写统一返回类 `Result<T>`：`{ code, msg, data }`

### 3.2 DispatcherServlet

- [ ] 实现 `DispatcherServlet`：拦截所有请求 `/*`
- [ ] `init()`：加载 IOC 容器，启动时扫描所有 `@Controller` 类，注册 `HandlerMapping`
- [ ] `service()`：根据 URL 找到 `ControllerMethod`，调用 `ParamBinder` 绑定参数，执行方法
- [ ] 自动识别返回值：若返回 `Result`/POJO → 序列化为 JSON；若返回 `String`（视图名）→ 转发到 JSP/HTML
- [ ] `setContentType("application/json;charset=UTF-8")`
- [ ] 全局异常捕获：`try/catch` → 调用 `GlobalExceptionHandler` → 返回标准错误 JSON

### 3.3 文件上传

- [ ] 编写 `MultipartResolver`：解析 `multipart/form-data`，提取 `Part`/文件字段
- [ ] 编写 `MultipartFile` 类：`getOriginalFilename()`、`getSize()`、`getInputStream()`、`transferTo(File)`
- [ ] 文件参数自动绑定：方法参数类型为 `MultipartFile` 时自动注入

### 3.4 拦截器链

- [ ] 编写 `HandlerInterceptor` 接口：`preHandle()`、`postHandle()`、`afterCompletion()`
- [ ] 编写 `InterceptorRegistry`：管理拦截器注册
- [ ] 编写 `CharacterEncodingInterceptor`：设置 `request/response` 编码 UTF-8
- [ ] 将 `DispatcherServlet` 接入拦截器链

---

## 四、Hesper-ORM 框架 【PRD-3.3】

### 4.1 底层 JDBC 封装

- [ ] 编写 `JDBCUtils`：
  - [ ] `getConnection()`：从连接池获取
  - [ ] `close(Connection/Statement/ResultSet)`：规范释放（必须在 `finally` 中）
  - [ ] `begin(Connection)`：开启手动提交
  - [ ] `commit(Connection)` / `rollback(Connection)`

### 4.2 连接池

- [ ] 编写 `HesperDataSource`（实现 `DataSource`）：
  - [ ] 基于 `BlockingQueue<Connection>` 存储空闲连接
  - [ ] 初始化连接数：5
  - [ ] 最大连接数：20（可配置）
  - [ ] 空闲超时回收：30 分钟（定期扫描 `BlockingQueue`，超时归还关闭）
  - [ ] `getConnection()`：从队列 `poll()`，队列空则等待或新建（未达上限时）
  - [ ] `returnConnection(Connection)`：归还到队列

### 4.3 事务管理

- [ ] 编写 `SqlSession`：
  - [ ] `ThreadLocal<Connection>` 保存当前线程的连接
  - [ ] `getConnection()`：从连接池获取，若 ThreadLocal 有则复用
  - [ ] `begin()`：开启事务（`setAutoCommit(false)`）
  - [ ] `commit()`：提交并归还连接到池
  - [ ] `rollback()`：回滚并归还连接到池

### 4.4 注解解析

- [ ] 编写 `@Select`、`@Insert`、`@Update`、`@Delete` 注解
- [ ] 编写 `@Param` 注解
- [ ] 编写 `@SelectKey`（支持自增主键回填）
- [ ] 编写 `SqlInfo`：保存 SQL 字符串、参数名列表

### 4.5 Mapper 动态代理

- [ ] 编写 `MapperProxy`（实现 `InvocationHandler`）：
  - [ ] `invoke()`：解析方法上的注解，获取 SQL 和参数映射
  - [ ] `ParameterMapping`：将方法参数名/@Param值映射到 SQL 占位符 `#{param}`
  - [ ] `PreparedStatementSetter`：设置 `ps.setString/setInt/setLong/setDouble/...`
  - [ ] 执行查询/更新
- [ ] 编写 `ResultSetHandler`：
  - [ ] 下划线 → 驼峰 转换工具（`underLineToCamelCase`）
  - [ ] 单行映射：ResultSet → POJO（通过默认构造器反射设值）
  - [ ] 多行映射：ResultSet → `List<POJO>`
  - [ ] 处理 `SELECT LAST_INSERT_ID()` 自增主键回填

### 4.6 SqlSessionFactory

- [ ] 编写 `SqlSessionFactoryBuilder`：读取配置，构建 `SqlSessionFactory`
- [ ] 编写 `SqlSessionFactory`：`openSession()` → `SqlSession`
- [ ] 编写 `MapperRegistry`：`getMapper(Class)` → JDK 动态代理 `MapperProxy`

### 4.7 DAO 接口编写

- [ ] `UserDao`：findById、findByUsername、findByIds、insert、update、delete、countByRole、findByStatus
- [ ] `VideoDao`：findById、findApprovedList、findByAuthorId、findByKeyword、insert、update、delete、updateScore、updateAiInfo、incrementClicks、incrementLikes、incrementCoins、incrementCollects、incrementDownloads、countApproved、avgSentimentByVideoId、findTop50
- [ ] `CommentDao`：findById、findByVideoId、findByParentId、findRootComments、insert、updateStatus、updateLikeCount、incrementReplyCount、countByVideoId、avgSentimentByVideoId
- [ ] `ActionLogDao`：findByUserAndVideo、insert、delete、countByUserId
- [ ] `HistoryDao`：findByUserId、insertOrUpdate、delete
- [ ] `ReportDao`：findPendingList、findById、updateStatus、insert
- [ ] `SigninRecordDao`：findByUserAndDate、insert、countByUserId
- [ ] `VideoAuditDao`：insert、findByVideoId
- [ ] `SentimentRecordDao`：insert、findByCommentId

---

## 五、Hesper-Log 框架 【PRD-3.8】

- [ ] 编写 `LogLevel` 枚举：`DEBUG(0) / INFO(1) / WARN(2) / ERROR(3)`
- [ ] 编写 `LogEvent`：封装时间戳、线程名、类名、日志级别、消息、MDC上下文、键值对参数
- [ ] 编写 `Appender` 接口：`void append(LogEvent)`
- [ ] 实现 `ConsoleAppender`：输出到 System.out
- [ ] 实现 `FileAppender`：异步写文件（无界阻塞队列 + 专用写盘线程），`BufferedWriter`
- [ ] 实现 `RollingFileAppender`：文件大小滚动（单文件最大 10MB），保留 7 个历史文件
- [ ] 编写 `HesperLog`：静态方法 `debug(msg)`、`info(msg)`、`warn(msg)`、`error(msg, Throwable)`
- [ ] 日志格式：`[LEVEL] [yyyy-MM-dd HH:mm:ss.SSS] [threadName] [className] [msg] [k1=v1, k2=v2...]`
- [ ] MDC 支持：`MDC.put(key, value)` / `MDC.remove(key)`，写入日志
- [ ] 全局日志级别配置（`config.properties`：`log.level=INFO`）
- [ ] 全局日志 `Appender` 初始化：启动时启动日志写盘线程，关闭时 flush

---

## 六、Hesper-Security 框架 【PRD-3.7】

### 6.1 密码加密

- [ ] 编写 `PasswordEncoder`：BCrypt 加密（`BCrypt.hashpw(password, BCrypt.gensalt())`）
- [ ] 编写 `PasswordEncoder.check(password, hashed)`：校验密码

### 6.2 会话管理

- [ ] 编写 `Session`：简单 Session 实现（`ConcurrentHashMap<String, Object>` 存储属性，`creationTime`/`lastAccessTime`/`maxInactiveInterval`）
- [ ] 编写 `SessionManager`：
  - [ ] `createSession()`：生成 UUID 为 SessionId，`ConcurrentHashMap<sessionId, Session>` 存储
  - [ ] `getSession(sessionId)`：查找Session，超时返回null
  - [ ] `removeSession(sessionId)`：失效Session（用于封禁）
  - [ ] 定时清理超时Session（每5分钟扫描一次）
- [ ] 使用 Cookie 回传 SessionId：`sessionIdCookie = "SESSION_ID"`
- [ ] 或使用 HttpSession 适配器：直接用 Tomcat HttpSession（简单方案）

### 6.3 封禁用户缓存

- [ ] `BannedUserCache`：`ConcurrentHashMap<Long, Boolean> bannedUsers`
- [ ] `ban(userId)`：写入 `true`
- [ ] `unban(userId)`：移除
- [ ] `isBanned(userId)`：查询

### 6.4 拦截器

- [ ] 编写 `AuthInterceptor`（实现 `HandlerInterceptor`）：
  - [ ] `preHandle()`：公开路径放行（`/user/login`、`/user/register`、`/video/list`、`/video/detail`、`/video/search`、`/admin/login`）
  - [ ] 其他路径检查 Session（从Cookie/Header获取sessionId）→ 无效Session返回 `{"code":401,"msg":"请先登录"}`
- [ ] 编写 `BannedInterceptor`：
  - [ ] `preHandle()`：检查已登录用户的 `userId` 是否在 `BannedUserCache` 中 → 是则返回 `{"code":403,"msg":"账号已被封禁"}`
- [ ] 编写 `RBACInterceptor`：
  - [ ] `preHandle()`：检查 `/admin/*` 路径需要 `ADMIN` 角色，否则返回 403

### 6.5 垂直越权防御

- [ ] 所有写操作接口：必须从 Session 中获取当前用户ID，禁止通过请求参数传入用户ID（如删除评论时，userId 必须取自 Session）

---

## 七、Hesper-Cache 框架 【PRD-3.4】

- [ ] 编写 `CacheEntry<K, V>`：存储 value + 过期时间（`expireTime`）
- [ ] 编写 `LRUCache<K, V>`：继承 `LinkedHashMap<K, CacheEntry<V>>`，重写 `removeEldestEntry()` 实现 O(1) LRU 淘汰
- [ ] 编写 `CacheManager`：
  - [ ] `ConcurrentHashMap<String, LRUCache>` 存储多个命名空间缓存
  - [ ] `get(String ns, String key)`：查找，若过期则删除并返回null
  - [ ] `put(String ns, String key, Object value, long ttlSeconds)`：存入
  - [ ] `evict(String ns, String key)`：主动删除
  - [ ] `clear(String ns)`：清空命名空间
  - [ ] `evictPattern(String regex)`：按正则删除（如 `video:list:home:*`）
  - [ ] 统计：`hitCount`、`missCount`、`loadCount`、`evictCount`
- [ ] 缓存 Key 设计并应用到各场景：
  - [ ] `video:score:{id}`，TTL 60s
  - [ ] `video:list:home:{page}`，TTL 30s
  - [ ] `user:info:{id}`，TTL 300s
  - [ ] `video:detail:{id}`，TTL 120s
  - [ ] `hot:videos:top50`，TTL 120s
- [ ] 热点数据预加载：启动时查询全站 Top50 视频，写入 `hot:videos:top50`

---

## 八、Hesper-AI 框架 【PRD-3.5 / 10】

### 8.1 核心引擎

- [ ] 编写 `AIConfig`：`apiKey`、`baseUrl`、`model`、`maxTokens`、`timeout`
- [ ] 编写 `AIRequest`：`model`、`messages`、`temperature`
- [ ] 编写 `AIResponse`：`content`、`usage`、`model`
- [ ] 编写 `AIProvider` 接口：`chat(AIRequest) : AIResponse`
- [ ] 实现 `DeepSeekProvider`：`HttpURLConnection` 发送 POST JSON，解析响应
- [ ] 实现 `OpenAIProvider`（备用）
- [ ] 编写 `AIExecutor`：
  - [ ] `ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()`
  - [ ] `submitAITask(Callable<T>, callback)`：异步提交AI任务
  - [ ] `callWithTimeout(Callable<T>, timeout, TimeUnit)`：带超时调用
  - [ ] 最大并发数控制：`Semaphore permits = new Semaphore(maxConcurrency)`

### 8.2 重试机制

- [ ] `retry(Callable, maxAttempts)`：失败自动重试，指数退避 `sleep = 2^attempt * 100ms`
- [ ] 超时：`callWithTimeout`，超时则返回默认值或抛异常

### 8.3 回调机制

- [ ] 编写 `AICallback<T>` 接口：`onSuccess(T result)`、`onFailure(Exception e)`
- [ ] `submitVideoTagTask(Long videoId)`：虚拟线程执行 → 调用 AIProvider → 解析 tags+summary → 回调更新数据库
- [ ] `submitSentimentTask(Long commentId)`：虚拟线程执行 → 调用 AIProvider → 解析评分 → 回调更新数据库

### 8.4 Prompt 工程

- [ ] 编写视频标注 Prompt：结构化输出 `{"tags":[],"summary":"..."}`
- [ ] 编写情感分析 Prompt：只返回一个 0.0~1.0 的数字
- [ ] 编写搜索建议 Prompt：返回5个逗号分隔的关键词

### 8.5 容错降级

- [ ] AI 服务不可用时：基础功能（上传/播放/评论等）继续正常运行，不阻塞主流程
- [ ] 标注失败：保留原始数据（`ai_tags`/`ai_summary` 为空），记录 ERROR 日志

---

## 九、Hesper-Recommend 框架 【PRD-3.6 / 9】

- [ ] 编写 `RecommendEngine`：
  - [ ] `calculateScore(Video video)`：完整热度公式实现
  - [ ] `QualityBoost = avgSentimentScore * 10`
  - [ ] `ColdStartBoost = publishedAt < 2h ? baseScore * 0.5 : 0`
  - [ ] `FinalScore = (BaseScore + QualityBoost + ColdStartBoost) / pow(HoursSincePublished + 2, 1.5)`
- [ ] `submitScoreUpdateTask(Long videoId)`：虚拟线程异步执行 → 查询video → 计算 → 更新 `videos.score` → `cache.evict("video:list:home:*")`
- [ ] `submitQualityUpdateTask(Long videoId)`：虚拟线程异步执行 → 查询该视频所有已通过评论的平均 sentiment_score → 更新 `videos.ai_quality_score` → 触发 `submitScoreUpdateTask`
- [ ] `diversityControl(List<Video> videos, int limit, int sameAuthorMax)`：首页列表中同一UP主视频不超过M条

---

## 十、用户模块 【PRD-6.1】

### 10.1 Service 层

- [ ] `UserService` 接口 + `UserServiceImpl`：
  - [ ] `register(username, password)`：校验唯一性 → BCrypt加密 → 插入users表 → Session自动登录
  - [ ] `login(username, password)`：查users → BCrypt校验 → 检查status → 检查lock_until → 记录last_login → 创建Session → 每日首次登录触发签到
  - [ ] `getProfile(userId)`：返回用户基本信息（含硬币余额）
  - [ ] `updateProfile(userId, avatar, gender, birthday, bio)`：更新字段
  - [ ] `changePassword(userId, oldPassword, newPassword)`：校验旧密码 → BCrypt加密新密码 → 更新
  - [ ] `logout(sessionId)`：调用 SessionManager.removeSession
  - [ ] `deleteAccount(userId, password)`：校验密码 → 脱敏用户名 → 视频下架 → 评论替换 → 删除 action_logs/signin_records → invalidate Session
  - [ ] `banUser(userId)`：设置status=1 → BannedUserCache.ban → invalidate Sessions
  - [ ] `unbanUser(userId)`：设置status=0 → BannedUserCache.unban

### 10.2 Servlet/Controller 层

- [ ] `UserServlet` 或 `UserController`：
  - [ ] `POST /user/register`：注册
  - [ ] `POST /user/login`：登录
  - [ ] `POST /user/logout`：登出
  - [ ] `GET /user/profile`：获取个人信息
  - [ ] `PUT /user/profile`：修改个人信息
  - [ ] `PUT /user/password`：修改密码
  - [ ] `DELETE /user/account`：注销账号

---

## 十一、签到 & 硬币模块 【PRD-6.1 U-08】

- [ ] `SigninService`：
  - [ ] `dailySignin(Long userId)`：查询 `signin_records WHERE user_id=? AND signin_date=CURDATE()`
  - [ ] 若已有记录 → 返回"今日已签到"
  - [ ] 若无 → `INSERT signin_records` + `UPDATE users SET coins = coins + 1`
  - [ ] `uk_user_date` 唯一索引保证幂等
- [ ] `UserService.login()` 末尾调用 `SigninService.dailySignin(userId)`

---

## 十二、视频模块 【PRD-6.2 / 6.3】

### 12.1 视频上传

- [ ] `VideoService`：
  - [ ] `publish(video, cover, title, desc, tags, userId)`：
    - [ ] 文件类型白名单校验（mp4/avi/mov/mkv）
    - [ ] 文件大小校验（≤500MB）
    - [ ] 保存视频文件到 `/uploads/videos/{userId}/{timestamp}_{uuid}.{ext}`
    - [ ] 保存封面图到 `/uploads/covers/{userId}/{timestamp}_{uuid}.{ext}`
    - [ ] 插入 `videos` 表（status=0，`created_at=NOW()`）
    - [ ] **异步** `AIService.submitVideoTagTask(videoId)`
    - [ ] 返回成功响应
- [ ] `VideoServlet`/`VideoController`：
  - [ ] `POST /video/publish`：发布视频
  - [ ] `GET /video/list`：首页推荐列表（分页，按 score DESC）
  - [ ] `GET /video/detail`：视频详情（增加 clicks，AJAX）
  - [ ] `GET /video/search`：关键字搜索
  - [ ] `GET /video/download`：下载视频（仅登录用户）
  - [ ] `GET /video/my`：查看自己发布的视频
  - [ ] `DELETE /video/{id}`：删除已发布视频

### 12.2 视频详情页

- [ ] 加载时 AJAX 异步：`videoDao.incrementClicks(videoId)`
- [ ] 详情页展示：AI摘要（`ai_summary`）、AI标签（`ai_tags`）
- [ ] 评论区：按 `sentiment_score DESC` 排序（优质前置），楼中楼结构

### 12.3 首页刷新

- [ ] `GET /video/list?refresh=true`：随机 OFFSET，`new Random().nextInt(total - pageSize)`

### 12.4 历史浏览

- [ ] `HistoryService`：
  - [ ] `recordView(userId, videoId)`：`INSERT ON DUPLICATE KEY UPDATE watched_at=NOW()`
  - [ ] `getHistory(userId, page, size)`：分页查询，按 watched_at DESC
- [ ] 进入视频详情页时：若用户已登录，自动调用 `HistoryService.recordView(userId, videoId)`

---

## 十三、互动模块 【PRD-6.4】

### 13.1 点赞 / 收藏

- [ ] `ActionService`：
  - [ ] `toggleLike(userId, videoId)`：
    - [ ] 查询 `action_logs WHERE user_id=? AND video_id=? AND type=1`
    - [ ] 若存在 → 删除记录 + `videos.likes -= 1`
    - [ ] 若不存在 → 插入记录 + `videos.likes += 1`（原子 `likes = likes + 1`）
    - [ ] 更新 `videos.score`（异步 `RecommendEngine.submitScoreUpdateTask`）
    - [ ] 清除缓存 `video:detail:{id}`
    - [ ] 返回当前点赞状态
  - [ ] `toggleCollect(userId, videoId)`：同上逻辑，type=2，`collects` 字段

### 13.2 投币

- [ ] `CoinService.throwCoin(userId, videoId)`：
  - [ ] `begin()` 开启事务
  - [ ] 检查余额 `user.coins >= 1`
  - [ ] `UPDATE users SET coins = coins - 1 WHERE id = ?`
  - [ ] `UPDATE videos SET coins = coins + 1 WHERE id = ?`
  - [ ] `INSERT action_logs (user_id, video_id, type=3)`
  - [ ] `commit()`
  - [ ] 失败则 `rollback()` → 抛 `BusinessException`
  - [ ] 异步 `RecommendEngine.submitScoreUpdateTask(videoId)`
  - [ ] 检查余额不足返回明确错误提示

### 13.3 评论

- [ ] `CommentService`：
  - [ ] `addComment(videoId, userId, content, parentId)`：
    - [ ] `parentId=null`：顶级评论，`root_id=null`
    - [ ] `parentId!=null`：回复，查找父评论的 `root_id`（若父是顶级则 `root_id=parentId`，否则 `root_id=父的root_id`）
    - [ ] 插入 `comments` 表（`sentiment_score=1.0` 初始）
    - [ ] 若 `parentId!=null`：`UPDATE comments SET reply_count = reply_count + 1 WHERE id = ?`
    - [ ] `UPDATE videos SET comments = comments + 1 WHERE id = ?`
    - [ ] **异步** `AIService.submitSentimentTask(commentId)`
  - [ ] `deleteComment(commentId, userId)`：
    - [ ] 查评论 → 校验 `comment.userId == userId`
    - [ ] `UPDATE comments SET status=0 WHERE id=?`
    - [ ] 评论数不减
  - [ ] `upDeleteComment(commentId, userId)`（UP主删评）：
    - [ ] 查评论 → 查视频 → 校验 `video.authorId == userId`
    - [ ] `UPDATE comments SET status=2(HIDDEN_BY_UP) WHERE id=?`
  - [ ] `likeComment(commentId)`：`comments.like_count += 1`（原子）
  - [ ] `unlikeComment(commentId)`：`comments.like_count -= 1`（原子，最小为0）

### 13.4 举报

- [ ] `ReportService`：
  - [ ] `reportVideo(reporterId, videoId, reasonType, reasonDetail)`：插入 `reports` 表，status=0
  - [ ] 查看举报列表（A-04）

### 13.5 评论树查询

- [ ] `CommentService.getCommentTree(videoId)`：
  - [ ] 查询所有 `status=1/2` 的顶级评论，按 `sentiment_score DESC`
  - [ ] 查询所有子评论（`parent_id IN (...)`），按 `created_at ASC`
  - [ ] 组装成树形结构（Java 层组装或 SQL 递归）
  - [ ] `status=3（AI自动隐藏）` 的评论对UP主可见，对普通用户隐藏

---

## 十四、管理端 【PRD-7】

### 14.1 管理员登录

- [ ] `AdminServlet`/`AdminController`：
  - [ ] `POST /admin/login`：查users WHERE username=? AND role=ADMIN → BCrypt校验 → 创建Session（角色ADMIN）
  - [ ] `AuthInterceptor` 拦截所有 `/admin/*`（除了 `/admin/login`）校验ADMIN角色

### 14.2 视频审核

- [ ] `AuditService`：
  - [ ] `getPendingList(page, size)`：查询 `status=0` 视频，按 `created_at ASC`
  - [ ] `approve(videoId, adminId)`：设置 `status=1`，`published_at=NOW()`，`score=初始热度分`（如100） → 插入 `video_audits`
  - [ ] `reject(videoId, adminId, reason)`：设置 `status=2`，`reject_reason` → 插入 `video_audits`
- [ ] `AdminServlet`：
  - [ ] `GET /admin/video/pendingList`：待审核列表
  - [ ] `POST /admin/video/approve`：通过
  - [ ] `POST /admin/video/reject`：驳回

### 14.3 封禁账号

- [ ] `AdminServlet`：
  - [ ] `GET /admin/user/list`：用户列表（分页，可按状态/角色筛选）
  - [ ] `POST /admin/user/ban`：封禁 → `UserService.banUser(userId)`
  - [ ] `POST /admin/user/unban`：解除封禁

### 14.4 处理举报

- [ ] `AdminServlet`：
  - [ ] `GET /admin/report/list`：待处理举报列表
  - [ ] `POST /admin/report/ignore`：标记已处理，`handle_result=忽略`
  - [ ] `POST /admin/report/takedown`：下架视频（`status=2`）+ 记录 `handle_result`

### 14.5 数据导出

- [ ] `ExportService.exportUsers()`：
  - [ ] 流式导出：查询 `SELECT * FROM users`，每取一批写一行到 CSV
  - [ ] `BufferedWriter` 逐行写出，`response.setHeader("Content-Disposition", "attachment; filename=...")`
  - [ ] 字段：id, username, role, status, coins, experience, created_at, last_signin

---

## 十五、AI 与推荐引擎接入 【PRD-10】

### 15.1 视频发布后 AI 标注流程

- [ ] `VideoService.publish()` 末尾：`AIService.submitVideoTagTask(video.getId())`
- [ ] `VideoTagTask` 执行：调用 AI → 解析 JSON → `videoDao.updateAiInfo(videoId, tags, summary, qualityScore)`
- [ ] 质量评分默认值：1.0（后续评论情感分析更新）

### 15.2 评论发布后情感分析流程

- [ ] `CommentService.addComment()` 末尾：`AIService.submitSentimentTask(comment.getId())`
- [ ] `SentimentTask` 执行：
  - [ ] 调用 AI → 获取 0.0~1.0 评分
  - [ ] 更新 `comments.sentiment_score` + `sentiment_label`
  - [ ] 若 score < 0.2：`status=3`（AI自动隐藏）
  - [ ] 更新 `videos.ai_quality_score` = 该视频已通过评论的平均 sentiment_score
  - [ ] `RecommendEngine.submitQualityUpdateTask(videoId)` → 重新计算 FinalScore
  - [ ] `sentiment_records` 表记录

### 15.3 搜索无结果时 AI 建议

- [ ] `VideoService.search(keyword)` 若结果为空：`AIService.submitSearchSuggestTask(keyword)`
- [ ] `SearchSuggestTask` 执行：调用 AI → 返回5个关键词 → 前端展示"您是否在找：xxx"

---

## 十六、性能调优 【PRD-11.1】

- [ ] 点赞/播放量批量缓冲：内存 `ConcurrentHashMap<Long, AtomicInteger>` → 每100次或每10秒批量 `UPDATE`
- [ ] Hesper-Cache 缓存命中率 > 70%：热点视频预加载进缓存
- [ ] 首页接口 RT < 200ms：缓存优先，未命中再查DB
- [ ] 虚拟线程：`Executors.newVirtualThreadPerTaskExecutor()` 用于 AI任务/文件IO/热度计算
- [ ] 连接池监控：空闲连接超时回收机制正常

---

## 十七、联调 & 测试 【PRD-11.2】

### 17.1 接口对接

- [ ] 所有 Servlet/Controller 返回统一 `Result<T>`：`{ code: 200/400/401/403/404/409/500, msg: string, data: object }`
- [ ] 前端页面接入：注册登录、视频列表、视频详情、视频上传、评论、个人中心、管理后台
- [ ] 前端表单校验：用户名3-12字符、密码6-20位

### 17.2 场景联调

- [ ] 注册 → 登录 → 签到 → 投币 → 点赞 → 评论（全流程）
- [ ] 游客访问 → 提示登录 → 登录 → 下载视频
- [ ] 发布视频 → 管理员审核通过 → 首页展示
- [ ] 发布评论 → AI情感分析 → 低分评论自动隐藏
- [ ] 管理员封禁用户 → 用户所有写操作返回403
- [ ] 管理员导出用户CSV → 文件下载正确
- [ ] UP主删除自己视频下的评论
- [ ] 普通用户尝试删除他人评论 → 403

### 17.3 异常测试

- [ ] 余额不足投币 → 事务回滚，数据不变
- [ ] 重复投币（唯一索引）→ 正常拒绝
- [ ] 重复签到（唯一索引）→ 正常拒绝
- [ ] AI服务超时 → 基础功能继续运行
- [ ] 文件上传类型错误 → 正确报错

---

## 十八、代码质量

- [ ] 安装阿里巴巴代码规约插件，扫描所有代码
- [ ] 消除所有 Warning（尤其 IDEA 中的黄色警告）
- [ ] 重复代码抽离为工具方法（如 `UnderlineToCamel`、`DateUtil`、`StrUtil`）
- [ ] 关键方法添加 Javadoc 注释
- [ ] 所有 DAO 方法在接口上注解 SQL

---

## 十九、文档 & 交付

- [ ] 完善 `README.md`：项目介绍、技术栈、本地运行步骤、目录结构、接口列表
- [ ] `docs/schema.sql`：完整数据库建表脚本
- [ ] `docs/prd.md`：本文档（PRD）
- [ ] `docs/task.md`：本文档（任务清单）
- [ ] 开发日志：每日 Git commit，commit message 标注日期
- [ ] Gitee 仓库：`README.md` 在根目录，代码已 push，仓库公开
- [ ] 最终自测清单（4.13 前完成）：
  - [ ] 启动项目无报错
  - [ ] 注册 → 登录 → 个人信息 → 修改密码 → 注销 全流程
  - [ ] 视频上传 → 审核通过 → 首页展示 → 播放 → 点赞 → 评论
  - [ ] 投币（余额变动正确）
  - [ ] 签到（硬币增加）
  - [ ] 管理后台登录 → 审核 → 封禁 → 导出

---

## 二十、提交（4.13 截止 18:00）

- [ ] Git 所有代码已 commit 并 push 到 Gitee
- [ ] `docs/task.md` 所有已完成任务已打 `[x]`
- [ ] `README.md` 包含运行说明
- [ ] 确保仓库公开，链接可访问
- [ ] **18:00 前完成提交，超时视为无效**

---

任务清单 V2.0 | 基于 PRD V7.0 | 开发周期：2026-04-02 ~ 2026-04-13
