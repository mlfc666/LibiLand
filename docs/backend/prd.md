# 《哩哔哩哔》产品需求文档（PRD）

| 属性       | 内容                                                  |
|----------|-----------------------------------------------------|
| **文档版本** | V7.0                                                |
| **文档状态** | 正式版                                                 |
| **产品名称** | 哩哔哩哔（LiBiliBi）                                      |
| **产品类型** | 视频内容分发平台                                            |
| **开发周期** | 2026-04-01 ~ 2026-04-13                             |
| **技术约束** | 禁止使用任何框架（Spring/MyBatis/JdbcTemplate等），全部底层组件必须手写实现 |
| **设计理念** | 高并发、高性能、工业级、可扩展、全自研框架驱动、AI深度融合                      |

---

## 一、项目概述

### 1.1 产品背景

《哩哔哩哔》是一个模拟现代视频社区的内容分发平台。系统受"规则崩塌"叙事背景驱动，开发者作为"唯一变量"需在既定规则内重建平台，使视频的上传、存储、分发与访问在新的约束下继续运行。

本项目为 **JavaWeb 实训考核**，目标是构建一个**工业级视频平台后端系统**，在不使用任何第三方框架（Spring/MyBatis/JdbcTemplate等）的前提下，全部底层组件手写实现，并接入 AI 智能引擎实现内容治理与个性化推荐。

### 1.2 核心设计理念

| 理念          | 含义                                                                 |
|-------------|--------------------------------------------------------------------|
| **高并发**     | 全面基于 Java 21 Virtual Threads（虚拟线程）处理 I/O 密集型任务；手写连接池、内存缓存层、异步非阻塞架构 |
| **高性能**     | 三级缓存（进程内 LRU + 热点数据预加载 + MySQL 索引优化）；推荐计算异步化，不阻塞主请求链路              |
| **全手写框架**   | ORM、MVC、IOC、Cache、AI引擎、推荐引擎、安全模块全部手写实现，展示对底层原理的深度掌握                |
| **AI 原生融合** | AI 不只是辅助工具，而是深度嵌入内容分发逻辑：AI 情感评分直接影响热度分和评论展示权重                      |
| **生产级规范**   | 统一的异常处理、标准错误码、全链路日志审计、幂等性设计、事务一致性保障                                |

### 1.3 核心功能矩阵

| 功能维度      | 具体功能                                                                                                |
|-----------|-----------------------------------------------------------------------------------------------------|
| **内容分发**  | 视频浏览/推荐算法/搜索/刷新/播放/下载                                                                               |
| **用户体系**  | 注册/登录/注销/个人信息管理/签到/硬币                                                                               |
| **社交互动**  | 点赞/取消点赞/收藏/取消收藏/投币/评论（多级）/评论点赞/举报                                                                   |
| **UP主权限** | 发布视频/管理自己视频下的评论/查看统计数据                                                                              |
| **管理后台**  | 视频审核/用户封禁/举报处理/数据导出                                                                                 |
| **自研框架**  | Hesper-ORM、Hesper-MVC、Hesper-IOC、Hesper-Cache、Hesper-AI、Hesper-Recommend、Hesper-Security、Hesper-Log |
| **AI 引擎** | 视频自动标注（标签+摘要）/评论情感分析（影响热度/展示）/AI 搜索建议                                                               |

### 1.4 用户角色定义

| 角色               | 定义          | 权限边界                              |
|------------------|-------------|-----------------------------------|
| **游客（Guest）**    | 未登录的匿名访问者   | 视频浏览、搜索、播放；**禁止**：下载、投稿、互动        |
| **正式用户（Client）** | 已注册并登录的正式成员 | 视频投稿、互动（点赞/投币/收藏/评论）、下载、签到、管理个人内容 |
| **管理员（Admin）**   | 平台运维与管理人员   | 视频审核、用户封禁/解封、举报处理、运营数据导出          |

### 1.5 专业术语表

| 术语                  | 定义                                          |
|---------------------|---------------------------------------------|
| **UP主**             | 视频创作者，即发布视频的正式用户                            |
| **硬币**              | 平台虚拟货币，通过每日签到获取，用于对视频投币，投币数计入视频热度           |
| **三连**              | 点赞 + 收藏 + 投币，代表用户对视频的最高认可                   |
| **热度分（Score）**      | 视频综合热度评分，由互动数据加权和 AI 情感分析共同决定，直接决定首页推荐排序    |
| **审核状态**            | 视频审核流程中的各状态：待审核/通过/驳回                       |
| **Sentiment Score** | AI 对评论/内容的情感分析评分（0.0~1.0），低于阈值自动隐藏，高于阈值加权展示 |

---

## 二、技术规范

### 2.1 技术栈约束（硬性要求）

| 类别 | 要求 | 说明 |
|---|---|---|
| **JDK版本** | JDK 21（推荐使用 LTS 版本） | 全面使用 Virtual Threads（Project Loom）实现高并发 |
| **数据库版本** | MySQL 8.0 及以上 | 字符集 `utf8mb4`；引擎 `InnoDB` |
| **开发工具** | IntelliJ IDEA | 必须使用 |
| **禁止使用框架** | Spring / SpringBoot / MyBatis / MyBatisPlus / JdbcTemplate / RedisTemplate / Hibernate 等 | **严禁使用任何第三方框架** |
| **禁止使用组件** | Redis / Elasticsearch / Kafka / RocketMQ 等消息/缓存中间件 | 所有能力必须手写实现 |
| **持久层** | 必须使用自己封装的 Hesper-ORM 处理数据库交互 | 不得使用任何 ORM 框架 |
| **Web层** | 原生 Jakarta Servlet API（Tomcat 10.1+） | 不得使用 SpringMVC |
| **前端** | 推荐 Element UI；图形化仅限 JavaFX/Swing（不推荐） | 推荐网页展示 |

### 2.2 自研框架总览

本项目共包含 **8 个手写核心框架**，每个框架均有明确的职责边界和 API 规范：

| 框架名称                 | 职责        | 核心特性                                         |
|----------------------|-----------|----------------------------------------------|
| **Hesper-IOC**       | 依赖注入容器    | 组件扫描、构造器注入/字段注入、单例管理、循环依赖检测                  |
| **Hesper-MVC**       | Web 请求调度  | 中央调度器、注解路由、参数自动绑定、JSON 序列化、拦截器链              |
| **Hesper-ORM**       | 持久层引擎     | 动态代理 DAO、注解 SQL、参数绑定、结果集映射、事务管理、连接池          |
| **Hesper-Cache**     | 进程内缓存层    | LRU 淘汰策略、TTL 过期、热点数据预加载、多级缓存命中统计             |
| **Hesper-AI**        | AI 任务异步引擎 | 虚拟线程执行、API 调用封装、重试机制、结果回调、内容分析（标签/情感）        |
| **Hesper-Recommend** | 推荐算法引擎    | 热度公式计算、标签相似度、冷启动策略、异步评分更新                    |
| **Hesper-Security**  | 安全与权限模块   | RBAC 权限模型、Banned 用户实时拦截、垂直越权防御、加密工具          |
| **Hesper-Log**       | 结构化日志系统   | 标准日志格式、日志分级（DEBUG/INFO/WARN/ERROR）、异步写盘、滚动策略 |

### 2.3 架构规范

**分层架构：**

```
Browser
  ↓ HTTP
Tomcat (Servlet Container)
  ↓
Hesper-Security.FilterChain (字符编码 → 鉴权 → Banned拦截 → RBAC校验)
  ↓
Hesper-MVC.DispatcherServlet (中央调度)
  ↓ HandlerMapping
Controller (注解路由)
  ↓
Service (Hesper-IOC 注入，业务逻辑)
  ↓
DAO Proxy (Hesper-ORM 动态代理)
  ↓
Hesper-Cache (缓存查找)
  ↓ Cache Miss
JDBCUtils → Hesper-ORM.ConnectionPool → MySQL
  ↓
Hesper-AI (异步触发：标签生成、情感分析)
  ↓
Hesper-Recommend (异步更新热度分)
  ↓
Hesper-Log (结构化日志输出)
```

**分层职责：**

| 层级 | 职责 | 规范 |
|---|---|---|
| **Controller** | 接收请求、参数绑定、调用Service、返回视图或JSON | 不得包含业务逻辑，仅做请求分发 |
| **Service** | 处理业务规则、事务控制、权限校验、调用DAO | **必须使用接口**，由 Hesper-IOC 注入实现 |
| **DAO** | 与数据库交互，由 Hesper-ORM 动态代理生成 | 无需手写实现类 |
| **Engine** | AI分析、推荐算法、缓存管理等独立能力 | 异步化设计，不阻塞主链路 |

### 2.4 包结构规范

| 包名 | 职责 |
|---|---|
| `moe.mlfc.libiland.models` | 实体类（User, Video, Comment...） |
| `moe.mlfc.libiland.repository` | 数据访问接口（Mapper接口） |
| `moe.mlfc.libiland.service` | 业务逻辑接口 |
| `moe.mlfc.libiland.service.impl` | 业务逻辑实现 |
| `moe.mlfc.libiland.controller` | REST 控制器 |
| `moe.mlfc.libiland.config` | 配置类 |
| `moe.mlfc.libiland.common.constant` | 常量枚举（UserRole, VideoStatus...） |
| `moe.mlfc.libiland.common.model` | 通用模型（Result, PageQuery...） |
| `moe.mlfc.libiland.common.exception` | 统一异常 |
| `moe.mlfc.libiland.common.util` | 工具类 |
| `moe.mlfc.libiland.infrastructure.orm` | 手写 ORM 框架 |
| `moe.mlfc.libiland.infrastructure.orm.annotation` | ORM 注解（@Select, @Insert...） |
| `moe.mlfc.libiland.infrastructure.mvc` | 手写 MVC 框架 |
| `moe.mlfc.libiland.infrastructure.ioc` | 手写 IOC 容器 |
| `moe.mlfc.libiland.infrastructure.cache` | 手写 Cache 框架 |
| `moe.mlfc.libiland.infrastructure.ai` | 手写 AI 引擎框架 |
| `moe.mlfc.libiland.infrastructure.security` | 手写 Security 框架 |
| `moe.mlfc.libiland.infrastructure.recommend` | 手写推荐引擎框架 |
| `moe.mlfc.libiland.infrastructure.log` | 手写日志框架 |
| `moe.mlfc.libiland.annotation` | 自定义注解（@Component, @Autowired...） |
| `moe.mlfc.libiland.filter` | 过滤器链 |

### 2.5 代码规范

1. **阿里巴巴代码规约插件**：所有代码必须通过规约扫描，消除所有 Warning。
2. **冗余代码抽离**：重复逻辑必须抽离为工具方法或公共类。
3. **使用接口连接各层**：Service 和 DAO 层必须先定义接口，再写实现类。
4. **配置文件管理**：数据库连接、AI API密钥、文件存储路径等配置必须放在 `resources/config.properties` 中，**严禁硬编码**。
5. **日志记录**：所有关键操作必须通过 Hesper-Log 记录结构化日志。
6. **异常规范**：严禁在代码中直接 `printStackTrace()`，必须抛出统一异常，由全局处理器统一响应。

### 2.6 Git 规范

- 项目必须使用 **Git** 管理代码。
- 必须在 **Gitee** 上建立**公开仓库**。
- 每次提交必须有清晰的 commit message：

```
[feat] 用户注册功能
[fix] 修复登录Session丢失问题
[refactor] 重构VideoService查询逻辑
[docs] 更新数据库建表脚本
[engine] 实现Hesper-ORM动态代理模块
```

- **每日必须提交**：考核期间每天的学习进度和项目日志（标注日期）。

---

## 三、自研框架详解

### 3.1 Hesper-IOC（控制反转容器）

#### 3.1.1 核心特性

| 特性 | 实现要求 |
|---|---|
| **组件扫描** | 启动时扫描 `moe.mlfc.libiland` 包及其子包，识别 `@Component`、`@Service`、`@Repository`、`@Controller` 注解的类 |
| **依赖注入** | 支持**构造器注入**（优先）和**字段注入**（ `@Autowired`），通过反射赋值 |
| **单例管理** | 所有 Bean 默认为单例模式，存储在 `ConcurrentHashMap<String, Object>` 中 |
| **生命周期钩子** | 支持 `init()` 方法（初始化后调用）和 `destroy()` 方法（容器关闭时调用） |
| **循环依赖检测** | 启动时检测构造器循环依赖，若检测到则抛出 `CircularDependencyException` |
| **类型安全** | 支持按类型（`getBean(Class<T>)`）和按名称（`getBean(String name)`）获取 Bean |

#### 3.1.2 注解定义

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Component {
    String value() default ""; // Bean名称，默认取类名首字母小写
}

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface Autowired {
    boolean required() default true;
}
```

#### 3.1.3 核心实现架构

```
ApplicationContext
    ├── start()  → 扫描所有 @Component/@Service/@Repository/@Controller
    │             → 注册 BeanDefinition（Bean名称、类型、依赖关系）
    │             → 检测循环依赖
    │             → 实例化所有 Bean（单例）
    │             → 执行依赖注入（构造器注入 → 字段注入）
    │             → 调用 init() 方法
    │
    ├── getBean(String name)     → 根据名称获取 Bean
    ├── getBean(Class<T> type)   → 根据类型获取 Bean
    └── destroy()                → 销毁所有 Bean，调用 destroy() 方法
```

### 3.2 Hesper-MVC（Web请求调度框架）

#### 3.2.1 核心特性

| 特性 | 实现要求 |
|---|---|
| **中央调度器** | 单一 `DispatcherServlet` 拦截所有请求（`/*` 或 `*.do`），通过 `HandlerMapping` 找到匹配的 Controller 方法 |
| **注解路由** | 支持 `@RequestMapping`、`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping` |
| **参数自动绑定** | 自动将 Request 参数（Query/Form/PathVariable/JSON Body）注入到 Controller 方法参数 |
| **JSON序列化** | 自动识别方法返回值，若为 POJO 则调用 `JsonHelper` 序列化为 JSON 并设置 `Content-Type: application/json` |
| **拦截器链** | 实现 `HandlerInterceptor` 接口，支持 `preHandle`（权限校验/日志）、`postHandle`（后置处理）、`afterCompletion`（最终处理） |
| **全局异常处理** | `ExceptionHandler` 注解 + `GlobalExceptionHandler`，统一捕获所有异常并返回标准 JSON |
| **文件上传** | 集成 `MultipartResolver`，支持 `multipart/form-data` 文件上传，自动绑定 `MultipartFile` 参数 |

#### 3.2.2 拦截器链设计

必须实现以下 3 个核心拦截器（按顺序执行）：

| 拦截器 | 执行时机 | 功能 |
|---|---|---|
| **CharacterEncodingInterceptor** | 最先 | 统一设置请求/响应字符编码为 UTF-8 |
| **AuthInterceptor** | preHandle | 校验 `/client/*`、`/admin/*` 路径下的用户登录状态 |
| **BannedInterceptor** | preHandle | 校验已登录用户的 `status` 是否为 BANNED，是则拦截所有写操作 |
| **RBACInterceptor** | preHandle | 校验用户角色是否有权访问目标路径 |

#### 3.2.3 参数绑定器设计

```java
// 伪代码：Hesper-MVC 参数绑定
@PostMapping("/video/publish")
public Result<Video> publishVideo(
    @RequestParam("title") String title,           // 普通表单参数
    @RequestParam("file") MultipartFile file,     // 文件上传
    @RequestParam(value = "desc", required = false) String desc,  // 可选参数
    HttpSession session                            // Servlet API对象，自动注入
) {
    // 参数由 Hesper-MVC 自动从 request / session 中获取并转换类型
    // 无需手动 request.getParameter()
}
```

### 3.3 Hesper-ORM（持久层引擎）

#### 3.3.1 核心特性

| 特性 | 实现要求 |
|---|---|
| **接口代理** | 定义 DAO 接口，无需手写实现类；通过 `java.lang.reflect.Proxy` 的 `MapperProxy` 实现动态代理 |
| **注解SQL** | 支持 `@Select`、`@Insert`、`@Update`、`@Delete`，SQL 中使用 `#{fieldName}` 占位符 |
| **参数绑定** | 自动将方法参数按顺序或名称映射到 SQL 占位符；支持 `@Param` 命名参数注解 |
| **结果集映射** | 自动将 `ResultSet` 列名映射到 Java 实体属性（支持**下划线→驼峰**自动转换）；支持 `List<T>` 和 `T` 两种返回值 |
| **事务管理** | 提供 `SqlSession.begin()` / `commit()` / `rollback()` 编程式事务；通过 `ThreadLocal<Connection>` 管理当前线程的连接 |
| **连接池** | 手写 `HesperDataSource`，基于 `BlockingQueue<Connection>` 实现，最大连接数可配置，空闲连接超时回收 |
| **SQL日志** | 可配置的 SQL 日志输出（DEBUG 级别），包含完整 SQL 和参数值 |

#### 3.3.2 实现架构

```
DAO接口（UserDao.findByUsername("lisi")）
    ↓
SqlSession.getMapper(UserDao.class)
    ↓ 动态代理
MapperProxy.invoke()
    ├── 解析方法上的 @Select/@Insert/@Update/@Delete 注解
    ├── 解析 #{param} 占位符 → ParameterMapping
    ├── 从数据库连接池获取 Connection
    ├── PreparedStatementSetter 设置参数
    ├── 执行 SQL
    └── ResultSetHandler 映射结果集 → User 对象
```

#### 3.3.3 注解定义

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Select {
    String value(); // "SELECT * FROM users WHERE id = #{id}"
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Insert {
    String value();
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Update {
    String value();
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Delete {
    String value();
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface Param {
    String value();
}
```

#### 3.3.4 DAO接口示例

```java
public interface VideoDao {

    @Select("SELECT * FROM videos WHERE id = #{id}")
    Video findById(Long id);

    @Select("SELECT * FROM videos WHERE author_id = #{authorId} ORDER BY created_at DESC LIMIT #{offset}, #{limit}")
    List<Video> findByAuthorId(@Param("authorId") Long authorId,
                                @Param("offset") int offset,
                                @Param("limit") int limit);

    @Insert("INSERT INTO videos (title, file_path, author_id, status) VALUES (#{title}, #{filePath}, #{authorId}, #{status})")
    @Select(key = "selectKey", resultType = Long.class, sql = "SELECT LAST_INSERT_ID()")
    Long insert(Video video);

    @Update("UPDATE videos SET likes = likes + 1 WHERE id = #{id}")
    int incrementLikes(@Param("id") Long id);

    @Delete("DELETE FROM videos WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    @Select("SELECT COUNT(*) FROM videos WHERE status = 1")
    int countApproved();
}
```

### 3.4 Hesper-Cache（进程内缓存层）

#### 3.4.1 核心特性

| 特性 | 实现要求 |
|---|---|
| **LRU 淘汰** | 基于 `LinkedHashMap` 实现 O(1) 时间复杂度的 LRU 淘汰策略 |
| **TTL 过期** | 每个缓存条目有独立的过期时间（秒），超时后自动失效并移除 |
| **容量限制** | 缓存最大条目数可配置，超过容量时淘汰最少使用的条目 |
| **多级缓存** | 支持**热点数据预加载**（启动时或定时任务将高频数据加载到缓存） |
| **缓存统计** | 记录命中率、加载次数、淘汰次数等监控指标 |
| **缓存失效** | 支持主动删除指定 Key 或清空所有缓存（用于数据变更时） |

#### 3.4.2 缓存应用场景

| 缓存 Key | 缓存内容 | TTL | 说明 |
|---|---|---|---|
| `video:score:{id}` | 视频热度分 | 60s | 频繁读取，异步更新 |
| `video:list:home:{page}` | 首页推荐列表 | 30s | 分页缓存，换页失效 |
| `user:info:{id}` | 用户基本信息 | 300s | 频繁读取，修改时主动删除 |
| `video:detail:{id}` | 视频详情（含UP主信息） | 120s | 播放页缓存 |
| `hot:videos:top50` | 全站热度前50 | 120s | 排行榜缓存 |

### 3.5 Hesper-AI（AI 任务异步引擎）

#### 3.5.1 核心特性

| 特性 | 实现要求 |
|---|---|
| **虚拟线程执行** | 所有 AI 调用基于 `Executors.newVirtualThreadPerTaskExecutor()`，不阻塞主线程 |
| **统一 API 封装** | 对 DeepSeek / OpenAI / 通义千问 等大模型 API 进行统一封装，便于切换 |
| **并发控制** | 全局 AI 任务队列，最大并发数可配置，防止 API 限流 |
| **重试机制** | AI API 调用失败时自动重试（最多 3 次），使用指数退避策略 |
| **结果回调** | AI 任务完成后通过回调机制更新数据库，不阻塞主事务 |
| **API 密钥管理** | AI API 密钥存储在 `config.properties`，不在代码中硬编码 |

#### 3.5.2 AI 任务类型

| 任务类型 | 触发时机 | 输入 | 输出 | 影响 |
|---|---|---|---|---|
| **视频自动标注** | 视频上传成功后 | 标题 + 简介 | 5个标签 + 100字摘要 | 写入 `ai_tags`、`ai_summary` 字段 |
| **评论情感分析** | 评论发布入库前 | 评论文本 | 情感评分 0.0~1.0 | 决定是否隐藏/是否加权展示 |
| **AI 搜索建议** | 搜索无结果时 | 搜索关键字 | 相关关键词推荐 | 返回给用户提示 |

#### 3.5.3 情感分析影响热度模型

> **核心设计：AI 情感评分直接参与热度计算，内容质量越高，推荐权重越大。**

```
最终Score = 基础互动分 × AI质量系数 + 新视频冷启动加成

AI质量系数计算规则：
  - Sentiment > 0.8（优质）：系数 = 1.5，评论前置展示
  - Sentiment 0.5~0.8（正常）：系数 = 1.0
  - Sentiment 0.2~0.5（低质）：系数 = 0.7
  - Sentiment < 0.2（劣质）：系数 = 0.3，**内容进入人工复审队列**
```

#### 3.5.4 AI 引擎核心实现

```java
// AI引擎任务提交伪代码
@Component
public class HesperAI {

    private final AIExecutor executor = new AIExecutor(10); // 最大10并发

    // 视频上传成功后触发
    public void submitVideoTagTask(Video video) {
        executor.submit(() -> {
            try {
                // 调用 AI API
                String prompt = "根据视频标题和简介，生成5个标签（一句话）和100字以内的摘要";
                AIResult result = callAI(prompt, video.getTitle(), video.getDescription());

                // 解析结果并更新数据库
                video.setAiTags(result.getTags());
                video.setAiSummary(result.getSummary());
                videoDao.updateAiInfo(video);
            } catch (Exception e) {
                // 失败不影响主流程，只记录日志
                HesperLog.error("AI标注失败 videoId=" + video.getId(), e);
            }
        });
    }

    // 评论情感分析（同步，但带超时）
    public double analyzeCommentSentiment(String content) {
        try {
            return executor.callWithTimeout(() -> callSentimentAPI(content), 3, TimeUnit.SECONDS);
        } catch (Exception e) {
            HesperLog.warn("AI情感分析超时，使用默认值1.0", e);
            return 1.0; // 超时时默认为正常
        }
    }
}
```

### 3.6 Hesper-Recommend（推荐算法引擎）

#### 3.6.1 核心特性

| 特性 | 实现要求 |
|---|---|
| **多维加权热度** | 播放量、点赞、投币、收藏、AI情感分析共同决定综合热度 |
| **时间衰减** | 新视频随时间流逝热度自然衰减，老视频需要更多互动维持排名 |
| **异步评分更新** | 热度计算异步化，不阻塞用户的互动操作（点赞/投币） |
| **冷启动策略** | 新视频发布后前 2 小时内赋予初始加权，保证新内容有曝光机会 |
| **多样性控制** | 首页前 N 条中同一 UP 主视频最多出现 M 条，避免内容过度集中 |
| **标签相似度** | 对登录用户，基于其历史观看标签计算内容相似度，优先推荐相似内容 |

#### 3.6.2 完整热度公式

```
BaseScore = (Clicks × 1 + Likes × 5 + Coins × 10 + Collects × 8)

QualityBoost = 视频平均AI情感评分 × 10

ColdStartBoost = 视频发布 < 2小时 ? 初始热度 × 1.5 : 0

FinalScore = (BaseScore + QualityBoost + ColdStartBoost) / (HoursSincePublished + 2)^1.5
```

**公式说明：**

| 变量 | 含义 | 权重 | 说明 |
|---|---|---|---|
| Clicks | 播放量 | ×1 | 所有访问（游客+用户）均计入 |
| Likes | 点赞数 | ×5 | 互动权重 |
| Coins | 投币数 | ×10 | 最高认可权重 |
| Collects | 收藏数 | ×8 | 高互动权重 |
| QualityBoost | AI情感分析加成 | 平均评论情感分 × 10 | 优质内容额外加权 |
| ColdStartBoost | 冷启动加成 | 前2小时 ×1.5 | 新视频曝光扶持 |
| TimeDecay | 时间衰减 | 分母 `(Hours+2)^1.5` | 控制新老更替速度 |

#### 3.6.3 异步热度更新流程

```
用户点赞/投币/评论 → 记录action表（立即）
                  → 触发异步热度更新任务
                      → 计算FinalScore
                      → 更新videos.score字段
                      → 清除首页缓存（video:list:home:*）
```

### 3.7 Hesper-Security（安全与权限模块）

#### 3.7.1 核心特性

| 特性 | 实现要求 |
|---|---|
| **RBAC权限模型** | 基于角色的访问控制，角色包含权限集合，权限定义资源+操作 |
| **Banned实时拦截** | 使用 `ConcurrentHashMap<Long, Boolean>` 记录 Banned 用户，Filter 层实时校验，拦截所有写操作 |
| **密码安全存储** | 使用 **BCrypt** 或 **MD5+Salt** 加密，严禁明文存储 |
| **垂直越权防御** | 所有写操作必须校验当前登录用户身份，禁止通过直接修改ID参数越权 |
| **下载安全** | 游客下载拦截（403），路径参数禁止用户自由指定（防止路径遍历） |
| **SQL注入防御** | Hesper-ORM 底层强制使用 `PreparedStatement`，所有参数绑定化 |
| **敏感操作日志** | 登录、注销、投币、转账、封禁等敏感操作必须记录审计日志 |
| **防暴力破解** | 登录失败计数，5次失败后锁定30分钟（可选） |

#### 3.7.2 权限拦截器链

```
请求进入
  ↓
CharacterEncodingFilter（UTF-8）
  ↓
HesperSecurityFilterChain
    ├── AuthInterceptor（登录状态）
    │     ├── 公开路径：/user/login, /user/register, /video/list, /video/detail, /video/search, /admin/login
    │     └── 拦截路径：/client/*, /admin/* → 检查Session → 无Session返回401
    │
    ├── BannedInterceptor（封禁状态）
    │     └── 已登录用户 → 检查users.status → BANNED → 拦截所有写操作（POST/PUT/DELETE）→ 返回403
    │
    └── RBACInterceptor（角色权限）
          └── 检查目标路径所需角色 → 匹配当前用户角色 → 不匹配 → 返回403
  ↓
DispatcherServlet（业务处理）
```

### 3.8 Hesper-Log（结构化日志系统）

#### 3.8.1 核心特性

| 特性 | 实现要求 |
|---|---|
| **日志分级** | DEBUG / INFO / WARN / ERROR 四级，配置全局日志级别阈值 |
| **标准格式** | `[LEVEL] [yyyy-MM-dd HH:mm:ss.SSS] [threadName] [className] [msg] [key=value...]` |
| **异步写盘** | 使用无界阻塞队列 + 专用日志写盘线程，不阻塞主业务线程 |
| **滚动策略** | 按文件大小滚动（单文件最大 10MB）；保留最近 7 个历史文件 |
| **日志输出** | 同时输出到控制台（开发环境）和文件（生产环境） |
| **MDC 支持** | 支持 `MDC.put("userId", "xxx")` 为日志打上上下文标签 |

#### 3.8.2 日志格式规范

```
[INFO] [2026-04-01 14:30:22.135] [http-nio-8080-exec-1] [UserServlet] [用户注册成功] [username=zhangsan, ip=192.168.1.100]
[ERROR] [2026-04-01 14:31:05.002] [http-nio-8080-exec-3] [VideoService] [投币事务失败] [userId=5, videoId=18, reason=余额不足]
[WARN]  [2026-04-01 14:32:11.008] [http-nio-8080-exec-7] [BannedInterceptor] [封禁用户尝试写操作] [userId=7, path=/client/comment/publish]
```

---

## 四、数据库设计

### 4.1 ER 模型总览

```
users ←(发布)→ videos
users ←(互动)→ action_logs (点赞/收藏/投币)
users ←(发布)→ comments ←(回复)→ comments
users ←(浏览)→ history
users ←(举报)→ reports
users ←(拥有)→ signin_records
videos ←(拥有)→ comments
videos ←(审核)→ video_audits
comments ←(被分析)→ sentiment_records (AI情感分析记录)
users ←(拥有)→ signin_records
```

### 4.2 核心表结构

#### 4.2.1 用户表（users）

```sql
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名（3-12字符，字母/数字/下划线）',
    `password` VARCHAR(255) NOT NULL COMMENT '密码（BCrypt加密存储）',
    `role` ENUM('CLIENT','ADMIN') DEFAULT 'CLIENT' COMMENT '角色：CLIENT-普通用户，ADMIN-管理员',
    `status` TINYINT DEFAULT 0 COMMENT '账号状态：0-正常，1-封禁',
    `coins` DECIMAL(10,2) DEFAULT 0.00 COMMENT '硬币余额',
    `experience` INT DEFAULT 0 COMMENT '经验值',
    `avatar` VARCHAR(255) DEFAULT '/static/img/default_avatar.png' COMMENT '头像路径',
    `bio` VARCHAR(200) DEFAULT '' COMMENT '个人简介',
    `gender` TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
    `birthday` DATE DEFAULT NULL COMMENT '生日',
    `last_signin` DATETIME DEFAULT NULL COMMENT '最后签到时间',
    `login_fail_count` INT DEFAULT 0 COMMENT '连续登录失败次数',
    `lock_until` DATETIME DEFAULT NULL COMMENT '账号锁定截止时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_username` (`username`),
    INDEX `idx_role` (`role`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

#### 4.2.2 视频表（videos）

```sql
CREATE TABLE `videos` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '视频ID',
    `title` VARCHAR(100) NOT NULL COMMENT '视频标题',
    `description` TEXT COMMENT '视频简介',
    `cover_url` VARCHAR(255) COMMENT '封面图路径',
    `file_path` VARCHAR(255) NOT NULL COMMENT '视频文件存储路径',
    `file_size` BIGINT DEFAULT 0 COMMENT '文件大小（字节）',
    `duration` INT DEFAULT 0 COMMENT '时长（秒）',
    `author_id` BIGINT UNSIGNED NOT NULL COMMENT 'UP主ID',
    `category` VARCHAR(50) DEFAULT 'other' COMMENT '分区',
    `tags` VARCHAR(255) DEFAULT '' COMMENT '用户填写的标签（逗号分隔）',
    `ai_tags` VARCHAR(255) DEFAULT NULL COMMENT 'AI自动生成的标签',
    `ai_summary` VARCHAR(500) DEFAULT NULL COMMENT 'AI自动生成的摘要',
    `ai_quality_score` DOUBLE DEFAULT 1.0 COMMENT 'AI内容质量评分（0.0~1.0），由评论情感分析均值计算',
    `status` TINYINT DEFAULT 0 COMMENT '审核状态：0-待审核，1-通过，2-驳回',
    `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '驳回原因',
    `clicks` INT DEFAULT 0 COMMENT '播放量',
    `likes` INT DEFAULT 0 COMMENT '点赞数',
    `coins` INT DEFAULT 0 COMMENT '投币数',
    `collects` INT DEFAULT 0 COMMENT '收藏数',
    `comments` INT DEFAULT 0 COMMENT '评论数',
    `score` DOUBLE DEFAULT 0 COMMENT '综合热度分（由推荐引擎计算）',
    `downloads` INT DEFAULT 0 COMMENT '下载次数',
    `published_at` DATETIME DEFAULT NULL COMMENT '发布时间（审核通过时间）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_author` (`author_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_score` (`score` DESC),
    INDEX `idx_published` (`published_at` DESC),
    INDEX `idx_category` (`category`),
    FULLTEXT KEY `ft_title` (`title`),
    FULLTEXT KEY `ft_tags` (`tags`, `ai_tags`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='视频表';
```

#### 4.2.3 评论表（comments）

```sql
CREATE TABLE `comments` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '评论ID',
    `video_id` BIGINT UNSIGNED NOT NULL COMMENT '视频ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '评论者ID',
    `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父评论ID（NULL=顶级评论）',
    `root_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '根评论ID（用于楼中楼展示）',
    `content` TEXT NOT NULL COMMENT '评论内容（最多500字）',
    `like_count` INT DEFAULT 0 COMMENT '评论点赞数',
    `reply_count` INT DEFAULT 0 COMMENT '回复数（直接子评论数量）',
    `sentiment_score` DOUBLE DEFAULT 1.0 COMMENT 'AI情感评分（0.0~1.0）',
    `sentiment_label` VARCHAR(20) DEFAULT 'NORMAL' COMMENT '情感标签：POSITIVE/NORMAL/NEGATIVE/HIDDEN',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0-已删除，1-正常，2-UP主隐藏，3-AI自动隐藏（待审核）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`root_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE,
    INDEX `idx_video` (`video_id`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_parent` (`parent_id`),
    INDEX `idx_root` (`root_id`),
    INDEX `idx_sentiment` (`sentiment_score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';
```

#### 4.2.4 互动记录表（action_logs）

```sql
CREATE TABLE `action_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `video_id` BIGINT UNSIGNED NOT NULL COMMENT '视频ID',
    `action_type` TINYINT NOT NULL COMMENT '动作类型：1-点赞，2-收藏，3-投币',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_user_video_action` (`user_id`, `video_id`, `action_type`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_video` (`video_id`),
    INDEX `idx_type` (`action_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='互动记录表（点赞/收藏/投币）';
```

#### 4.2.5 浏览历史表（history）

```sql
CREATE TABLE `history` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `video_id` BIGINT UNSIGNED NOT NULL COMMENT '视频ID',
    `watched_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '观看时间',
    `watch_duration` INT DEFAULT 0 COMMENT '观看时长（秒）',
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_user_video` (`user_id`, `video_id`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_watched` (`watched_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='浏览历史表';
```

#### 4.2.6 举报记录表（reports）

```sql
CREATE TABLE `reports` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `reporter_id` BIGINT UNSIGNED NOT NULL COMMENT '举报人ID',
    `video_id` BIGINT UNSIGNED NOT NULL COMMENT '被举报视频ID',
    `reason_type` TINYINT NOT NULL COMMENT '举报原因类型：1-违法违规，2-色情低俗，3-暴力血腥，4-垃圾广告，5-其他',
    `reason_detail` VARCHAR(500) DEFAULT NULL COMMENT '详细描述（可选）',
    `status` TINYINT DEFAULT 0 COMMENT '处理状态：0-待处理，1-已处理',
    `handler_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '处理人ID',
    `handle_result` VARCHAR(255) DEFAULT NULL COMMENT '处理结果说明',
    `handled_at` DATETIME DEFAULT NULL COMMENT '处理时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE CASCADE,
    INDEX `idx_status` (`status`),
    INDEX `idx_reporter` (`reporter_id`),
    INDEX `idx_video` (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报记录表';
```

#### 4.2.7 签到记录表（signin_records）

```sql
CREATE TABLE `signin_records` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `coins_earned` DECIMAL(5,2) DEFAULT 1.00 COMMENT '本次获得硬币数',
    `signin_date` DATE NOT NULL COMMENT '签到日期',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_user_date` (`user_id`, `signin_date`),
    INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到记录表';
```

#### 4.2.8 视频审核记录表（video_audits）

```sql
CREATE TABLE `video_audits` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `video_id` BIGINT UNSIGNED NOT NULL COMMENT '视频ID',
    `admin_id` BIGINT UNSIGNED NOT NULL COMMENT '审核人ID',
    `action` VARCHAR(20) NOT NULL COMMENT '审核动作：APPROVE-通过，REJECT-驳回',
    `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '驳回原因（APPROVE时为NULL）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_video` (`video_id`),
    INDEX `idx_admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='视频审核记录表';
```

#### 4.2.9 AI情感分析记录表（sentiment_records）

```sql
CREATE TABLE `sentiment_records` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `comment_id` BIGINT UNSIGNED NOT NULL COMMENT '评论ID',
    `score` DOUBLE NOT NULL COMMENT 'AI情感评分（0.0~1.0）',
    `label` VARCHAR(20) NOT NULL COMMENT '情感标签：POSITIVE/NORMAL/NEGATIVE',
    `ai_model` VARCHAR(50) DEFAULT NULL COMMENT '调用的AI模型名称',
    `cost_tokens` INT DEFAULT 0 COMMENT '消耗的Token数（用于成本统计）',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE,
    INDEX `idx_comment` (`comment_id`),
    INDEX `idx_score` (`score`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI情感分析记录表';
```

### 4.3 枚举值定义

| 枚举类 | 字段名 | 值 | 说明 |
|---|---|---|---|
| `UserRole` | CLIENT | 1 | 正式用户 |
| `UserRole` | ADMIN | 2 | 管理员 |
| `UserStatus` | NORMAL | 0 | 账号正常 |
| `UserStatus` | BANNED | 1 | 账号封禁 |
| `VideoStatus` | PENDING | 0 | 待审核 |
| `VideoStatus` | APPROVED | 1 | 审核通过 |
| `VideoStatus` | REJECTED | 2 | 审核驳回 |
| `ActionType` | LIKE | 1 | 点赞 |
| `ActionType` | COLLECT | 2 | 收藏 |
| `ActionType` | COIN | 3 | 投币 |
| `CommentStatus` | DELETED | 0 | 已删除（用户删除） |
| `CommentStatus` | NORMAL | 1 | 正常 |
| `CommentStatus` | HIDDEN_BY_UP | 2 | UP主隐藏 |
| `CommentStatus` | HIDDEN_BY_AI | 3 | AI自动隐藏（待复核） |
| `SentimentLabel` | POSITIVE | "POSITIVE" | 情感积极 |
| `SentimentLabel` | NORMAL | "NORMAL" | 情感中性 |
| `SentimentLabel` | NEGATIVE | "NEGATIVE" | 情感消极 |
| `ReportType` | ILLEGAL | 1 | 违法违规 |
| `ReportType` | PORN | 2 | 色情低俗 |
| `ReportType` | VIOLENCE | 3 | 暴力血腥 |
| `ReportType` | SPAM | 4 | 垃圾广告 |
| `ReportType` | OTHER | 5 | 其他 |

---

## 五、游客端功能（必须完成）

### 5.1 模块概述

游客端为未登录用户提供基础的内容消费能力。核心是**视频浏览**和**搜索发现**，所有交互类功能均需拦截并返回 401 统一提示。

### 5.2 功能清单

| 功能编号 | 功能名称 | 功能描述 | 优先级 |
|---|---|---|---|
| **V-01** | 首页推荐视频 | 展示审核通过的推荐视频列表（按热度分降序） | P0 |
| **V-02** | 首页刷新 | 重新加载推荐视频列表（随机 OFFSET，内容不重复） | P0 |
| **V-03** | 视频详情页 | 视频播放（必须实现）、基本信息展示 | P0 |
| **V-04** | 关键字搜索 | 按标题关键字搜索，支持分页 | P0 |
| **V-05** | 登录引导拦截 | 游客触发需登录功能时，返回 401 并提示登录 | P0 |

### 5.3 详细需求

#### V-01 首页推荐视频

**功能特点：**
- 首页展示审核状态为"通过"的视频列表
- 视频卡片信息：封面图、标题、时长、UP主昵称、播放量、点赞数、发布时间
- 按 Hesper-Recommend 引擎计算的 **FinalScore** 降序排列
- 支持分页，每页 20 条

**技术实现：**
- Hesper-Cache 缓存首页列表（Key：`video:list:home:{page}`，TTL：30s）
- 缓存失效：用户点赞/投币/新视频审核通过时，清除对应缓存
- Hesper-ORM 查询：`SELECT * FROM videos WHERE status=1 ORDER BY score DESC LIMIT ? OFFSET ?`

#### V-02 首页刷新

**功能特点：**
- 点击"刷新"按钮，使用随机 OFFSET 重新获取推荐列表
- 保证每次刷新内容不重复
- 新发布的高热度视频优先展示

**技术实现：**
- 随机 OFFSET = `new Random().nextInt(max(0, totalCount - pageSize))`

#### V-03 视频详情页

**功能特点：**
- 必须实现视频播放功能（`<video>` 标签直连视频文件路径）
- 展示：标题、简介、UP主信息、统计数据（播放/点赞/投币/收藏/评论）
- AI 生成的摘要和标签在详情页展示
- 评论区展示（情感评分高的评论前置展示）

**技术实现：**
- 加载详情页时，AJAX 异步增加 `clicks`（播放量 +1，计入热度）
- 游客访问**不记录**历史浏览（无用户身份）

#### V-04 关键字搜索

**功能特点：**
- 基于 MySQL `MATCH(title, tags, ai_tags) AGAINST(? IN NATURAL LANGUAGE MODE)` 全文检索
- 或使用 `LIKE %keyword%` 模糊匹配标题
- 结果按 FinalScore 降序
- 支持分页

#### V-05 登录引导拦截

**功能特点：**
- 游客访问 `/client/*` 或 `/admin/*` 路径的写操作时，返回统一 JSON：

```json
{
  "code": 401,
  "msg": "请先登录后再进行操作",
  "data": null
}
```

---

## 六、客户端功能（必须完成）

### 6.1 个人中心模块

| 功能编号 | 功能名称 | 功能描述 | 优先级 |
|---|---|---|---|
| **U-01** | 用户注册 | 用户注册（用户名唯一性校验） | P0 |
| **U-02** | 用户登录 | 用户登录（Session会话管理） | P0 |
| **U-03** | 查看个人信息 | 查看基本信息（头像/硬币/经验值等） | P0 |
| **U-04** | 修改个人信息 | 修改头像/昵称/性别/生日/简介 | P0 |
| **U-05** | 修改密码 | 验证旧密码后修改新密码 | P0 |
| **U-06** | 退出登录 | 清除Session | P0 |
| **U-07** | 注销账号 | 彻底删除账号（密码验证+级联清理） | P0 |
| **U-08** | 每日签到 | 每日首次登录自动领取硬币（幂等设计） | P0 |
| **U-09** | 查看收藏列表 | 查看自己收藏的所有视频 | P0 |
| **U-10** | 数据统计 | 统计自己发布视频的点赞/收藏/投币/播放数据 | P0 |

#### U-01 用户注册

**业务规则：**
- 用户名：3-12字符，支持字母/数字/下划线，**唯一性校验**（数据库唯一索引）
- 密码：6-20位，**必须使用 BCrypt 加密存储**
- 注册成功后**自动登录**（生成 Session）
- 默认角色：CLIENT，硬币余额：0
- 使用 Hesper-Security 进行密码加密，不允许明文存储

#### U-02 用户登录

**业务规则：**
- 支持用户名登录
- 登录成功后生成 Session，存储 `UserDTO`（不含密码）
- 登录成功后检查账号状态：若为 BANNED，拒绝登录并提示
- 防暴力破解：连续 5 次登录失败，锁定 30 分钟（`lock_until` 字段控制）
- 每日首次登录触发签到逻辑（U-08）

#### U-07 注销账号

**业务规则（重要）：**
- 必须验证密码（防止他人操作）
- 级联处理：
  1. 将用户名改为 `"deleted_" + UUID`（不可逆脱敏）
  2. 将用户所有视频 `status` 设为特殊状态（其他用户无法再访问）
  3. 将用户评论 `content` 替换为 `"该用户已注销"`，`status` 不变
  4. 删除 `action_logs`（互动记录）
  5. 删除 `signin_records`（签到记录）
  6. Session 立即失效
- 用户名释放，新用户可注册相同用户名

#### U-08 每日签到

**功能特点：**
- 用户每日首次登录时，自动发放硬币奖励
- 幂等设计：同一自然日重复签到返回已签到状态，不重复发放
- 签到状态可实时查询

**业务规则：**
- 用户每日首次登录时，自动发放 **1 枚硬币**
- 通过 `signin_records` 表的 `uk_user_date` 唯一索引保证同一天只能签到一次
- 签到后更新 `last_signin` 字段

#### U-09 查看收藏列表

**功能特点：**
- 展示当前用户收藏的所有视频
- 按收藏时间倒序排列
- 支持分页加载

**业务规则：**
- 查询 `action_logs WHERE user_id=? AND action_type=2（收藏）`，关联 `videos` 表返回视频详情
- 仅展示当前登录用户的收藏记录
- 关联展示视频基本信息（封面、标题、UP主、播放量等）
- 实时反映视频的最新状态（如下架后不再显示）

### 6.2 视频管理模块

| 功能编号 | 功能名称 | 功能描述 | 优先级 |
|---|---|---|---|
| **V-06** | 发布视频 | 上传视频文件+封面+标题+简介+标签 | P0 |
| **V-07** | 查看已发布视频 | 查看自己所有视频（审核状态+驳回原因） | P0 |
| **V-08** | 删除已发布视频 | 删除视频文件及该视频下所有评论 | P0 |

#### V-06 发布视频

**业务流程（重要）：**

```
1. 用户提交 multipart/form-data（视频文件 + 封面 + 标题 + 简介 + 标签）
2. Hesper-MVC 绑定参数，调用 VideoService.publish()
3. 验证用户身份（未登录拦截 → 401）
4. 视频文件保存到服务器磁盘：/uploads/videos/{userId}/{timestamp}_{filename}
5. 封面图保存：/uploads/covers/{userId}/{timestamp}_{filename}
6. 向 videos 表插入记录，status = 0（待审核）
7. 事务提交
8. 【异步触发】Hesper-AI.submitVideoTagTask()
   → AI 分析标题+简介 → 生成 5 个 ai_tags + ai_summary
   → 更新 videos 表 ai_tags / ai_summary / ai_quality_score
   → Hesper-Recommend 重新计算热度分
9. 【异步触发】首页缓存清除
10. 返回前端：发布成功，视频进入审核队列
```

**文件上传要求：**
- 允许格式：`mp4`, `avi`, `mov`, `mkv`
- 最大大小：500MB（Servlet 配置 `maxFileSize`）
- 存储路径禁止用户指定（路径遍历防护）
- 文件名重命名为 `{timestamp}_{uuid}.{ext}` 防止覆盖

### 6.3 首页功能模块

| 功能编号 | 功能名称 | 功能描述 | 优先级 |
|---|---|---|---|
| **V-09** | 首页推荐 | 展示审核通过的推荐视频列表（分页） | P0 |
| **V-10** | 首页刷新 | 随机 OFFSET 重新加载推荐视频 | P0 |
| **V-11** | 关键字搜索 | 按标题+标签搜索，支持分页 | P0 |
| **V-12** | 查看历史浏览 | 查看自己的播放历史记录 | P0 |
| **V-13** | 下载视频 | 下载视频文件（仅登录用户） | P0 |

#### V-12 查看历史浏览

**业务规则（重要）：**
- 自动记录：用户进入视频详情页时，**自动**插入/更新历史记录（`watched_at` 更新时间）
- 游客访问**不记录**历史（无用户身份）
- 同一视频重复观看：更新 `watched_at`，不去重
- 按观看时间倒序展示，支持分页

#### V-13 下载视频

**业务规则（重要）：**
- **游客禁止下载**：Filter 拦截，返回 403
- 仅正式用户可下载
- 校验：用户已登录 + 视频状态为"通过" + 用户未被封禁
- 下载成功后：`videos.downloads += 1`（计入热度）
- 使用流式传输（`BufferedInputStream` → `BufferedOutputStream`），**禁止一次性读取整个文件到内存**

### 6.4 社交互动模块

> **以下所有功能为进阶要求，全部需要实现。**

| 功能编号 | 功能名称 | 功能描述 | 技术要点 |
|---|---|---|---|
| **I-01** | 点赞/取消点赞 | 切换视频点赞状态 | 原子操作 + 更新热度分 + 清除缓存 |
| **I-02** | 收藏/取消收藏 | 切换视频收藏状态 | 唯一索引保证幂等 |
| **I-03** | 投币 | 对视频投币（含事务一致性） | 事务：扣余额+加视频投币数+记录action_logs |
| **I-04** | 发表顶级评论 | 在视频下发评论 | 触发AI情感分析 |
| **I-05** | 回复评论 | 对评论进行回复（楼中楼） | `parent_id` + `root_id` 双重关联 |
| **I-06** | 删除自己评论 | 逻辑删除（status=0） | 保留内容显示"已删除" |
| **I-07** | UP主删评 | UP主删除自己视频下任意评论 | 校验 author_id = video.author_id |
| **I-08** | 评论点赞 | 对评论点赞/取消点赞 | 更新 comments.like_count |
| **I-09** | 举报视频 | 填写举报原因提交举报单 | 生成 report 记录 |

#### I-03 投币（事务一致性保障）

```java
@Transactional  // 或手动事务
public Result coinVideo(Long userId, Long videoId) {
    // 1. 查询用户硬币余额
    User user = userDao.findById(userId);
    if (user.getCoins().compareTo(BigDecimal.ONE) < 0) {
        return Result.error("硬币余额不足，请先签到获取硬币");
    }

    // 2. 原子扣减用户余额（使用 UPDATE ... SET coins = coins - 1）
    int updated = userDao.decrementCoins(userId);
    if (updated == 0) {
        throw new BusinessException("余额不足，投币失败");
    }

    // 3. 增加视频投币数
    videoDao.incrementCoins(videoId);

    // 4. 记录 action_logs（唯一索引防止重复投币）
    actionLogDao.insert(userId, videoId, ActionType.COIN);

    // 5. 异步更新视频热度分
    recommendEngine.submitScoreUpdateTask(videoId);

    return Result.success("投币成功");
}
```

#### I-04/I-05 评论与AI情感分析流程

```
用户提交评论
  → Hesper-MVC 绑定参数
  → VideoService.addComment()
  → 评论内容入库（初始 status=1, sentiment_score=1.0）
  → 【异步】Hesper-AI.submitSentimentTask(commentId)
      → AI 分析文本 → sentiment_score (0.0~1.0)
      → 判定规则：
          score < 0.2 → status=3 (AI自动隐藏，待复核)
          score > 0.8 → sentiment_label=POSITIVE，评论前置展示
      → 更新 comment 表
      → 重新计算该视频的 ai_quality_score（所有已通过评论的平均情感分）
      → 【异步】Hesper-Recommend.submitQualityUpdateTask(videoId)
          → FinalScore += QualityBoost
          → 更新 videos.score
          → 清除首页缓存
```

#### I-07 UP主删评权限控制

```java
@PostMapping("/comment/delete")
public Result deleteComment(Long commentId, HttpSession session) {
    UserDTO user = getUser(session);
    Comment comment = commentDao.findById(commentId);

    if (comment.getUserId().equals(user.getId())) {
        // 普通用户：只能删除自己发的评论
        commentDao.updateStatus(commentId, CommentStatus.DELETED);
    } else {
        // UP主：删除自己视频下的任意评论
        Video video = videoDao.findById(comment.getVideoId());
        if (!video.getAuthorId().equals(user.getId())) {
            return Result.error(403, "无权限删除该评论");
        }
        commentDao.updateStatus(commentId, CommentStatus.HIDDEN_BY_UP);
    }
    return Result.success();
}
```

#### I-08 评论点赞

**功能特点：**
- 对评论进行点赞或取消点赞的切换操作
- 点赞后评论的点赞数 +1，取消后 -1
- 支持用户对同一评论多次切换状态

**业务规则：**
- 同一用户对同一评论的多次点赞只记录一条
- 点赞操作实时更新评论的点赞数字段
- 评论被删除时，相关的点赞记录同步清理

#### I-09 举报视频

**功能特点：**
- 用户可以对认为违规的视频提交举报
- 支持选择举报原因类型和详细说明
- 提交后生成举报记录，进入待处理队列

**业务规则：**
- 用户可对视频提交举报
- `reasonType`：1-违法违规，2-色情低俗，3-暴力血腥，4-垃圾广告，5-其他
- 举报后生成 `reports` 记录，`status=0`（待处理）

---

## 七、管理端功能（必须完成）

### 7.1 功能清单

| 功能编号 | 功能名称 | 功能描述 | 优先级 |
|---|---|---|---|
| **A-01** | 管理员登录 | 独立后台登录入口（`/admin/login`） | P0 |
| **A-02** | 视频审核 | 查看/通过/驳回待审核视频 | P0 |
| **A-03** | 封禁账号 | 封禁/解封用户（实时生效） | P0 |
| **A-04** | 处理举报 | 查看/处理用户举报（忽略/下架） | P1 |
| **A-05** | 数据导出 | 导出全量用户信息为CSV文件 | P1 |
| **A-06** | 管理后台统计 | 展示用户总数/视频总数/待审核/待处理举报数 | P1 |

### 7.2 详细需求

#### A-02 视频审核

**业务流程：**

```
1. 管理员进入审核列表页
   → 查询 videos WHERE status=0 ORDER BY created_at ASC（先到先审）
   → 支持分页

2. 管理员预览视频（播放视频，查看标题/简介）

3. 管理员执行操作：
   [通过] → status=1, published_at=NOW(), score=初始热度分
           → 记录 video_audits (admin_id, video_id, APPROVE)
           → 视频进入推荐池

   [驳回] → status=2, reject_reason=用户填写原因
           → 记录 video_audits (admin_id, video_id, REJECT, reason)
           → 通知UP主（可在数据库加 notify_flag 或发消息）
```

#### A-03 封禁账号

**业务流程（实时生效）：**

```
1. 管理员选择目标用户
2. 设置 users.status = 1（BANNED）
3. 【关键】Hesper-Security.bannedUserCache.put(userId, true)
   → BannedInterceptor 下次请求立即拦截，无需查数据库
4. 遍历 invalidate 所有该用户的活跃 Session（通过 Session 池）
   → 用户下次请求立即被拦截，返回 403
5. 管理员可随时解除封禁（status=0，缓存清除，Session 池移除该用户）
```

**补充说明（与登录流程的衔接）：**
- 用户登录时（U-02）：若发现账号已被封禁（status=1），**拒绝登录**并提示"账号已被封禁"。
- 用户在线时被封禁：当前 Session 立即失效，下次请求被 BannedInterceptor 拦截返回 403。
- 被封禁账号**可以登录管理后台查看封禁通知**，但所有写操作均被拦截。

#### A-04 处理举报

**功能特点：**
- 管理员可查看所有待处理的举报列表
- 支持对举报进行两种处理操作：忽略（标记已处理）或下架（立即下架视频）
- 处理时可填写处理备注

**业务规则：**
- 仅展示状态为"待处理"的举报记录
- 忽略操作：举报标记为已处理，视频不受影响
- 下架操作：举报标记已处理，同时将被举报视频状态设为下架
- 处理完成后记录处理人和处理时间

#### A-05 数据导出

**功能特点：**
- 支持导出全量用户信息为 CSV 格式文件
- 采用流式处理，边查边写，避免内存溢出
- 导出字段包含：ID、用户名、角色、状态、硬币余额、经验值、注册时间、最后登录时间

**业务规则：**
- 导出全量用户信息为 CSV
- 使用**流式导出**（边查边写，禁止一次性加载到内存）
- 字段：ID、用户名、角色、状态、硬币余额、经验值、注册时间、最后登录时间
- 文件名：`users_export_{yyyyMMddHHmmss}.csv`

#### A-06 管理后台统计

**功能特点：**
- 管理员可实时查看平台核心数据统计
- 数据维度包括：用户总数、视频总数、待审核视频数、待处理举报数

**业务规则：**
- 统计数据实时查询返回
- 支持管理员快速了解平台运营状态

---

## 八、RBAC 权限体系

### 8.1 权限模型

```
用户 ──属于──> 角色 ──拥有──> 权限
                  │
                  ├── CLIENT: {video:read, video:publish, comment:*, action:*, user:profile:edit}
                  └── ADMIN:  {*} (全部权限)
```

### 8.2 权限分配矩阵

| 操作 | 游客 | 客户端用户 | 管理员 |
|---|---|---|---|
| 首页浏览/搜索/播放 | √ | √ | √ |
| 下载视频 | × | √ | √ |
| 发布视频 | × | √ | √ |
| 点赞/收藏/投币 | × | √ | √ |
| 评论/回复 | × | √ | √ |
| 删除自己评论 | × | √ | √ |
| 删除视频下任意评论（UP主） | × | √（仅自己视频） | √ |
| 签到 | × | √ | √ |
| 注销账号 | × | √ | √ |
| 管理后台登录 | × | × | √ |
| 视频审核 | × | × | √ |
| 封禁/解封用户 | × | × | √ |
| 处理举报 | × | × | √ |
| 导出用户数据 | × | × | √ |

### 8.3 公开路径白名单

以下类型的操作无需登录即可访问：

| 操作类型 | 说明 |
|---|---|
| 视频浏览 | 首页推荐列表、视频详情、搜索结果 |
| 用户注册 | 新用户注册账号 |
| 用户登录 | 用户登录、管理员登录 |
| 管理后台展示 | 管理后台登录页展示 |

---

## 九、推荐算法引擎详解

### 9.1 完整热度公式

```
互动基础分 = (Clicks × 1) + (Likes × 5) + (Coins × 10) + (Collects × 8)

AI质量加成 = 视频所有评论的平均AI情感评分 × 10

冷启动加成 = IF (发布时间 < 2小时) THEN (初始热度分 × 0.5) ELSE 0

FinalScore = (互动基础分 + AI质量加成 + 冷启动加成) / (距发布小时数 + 2)^1.5
```

### 9.2 分发策略

| 场景 | 策略 |
|---|---|
| **游客首页** | 全站 FinalScore 最高的视频（冷启动对游客友好） |
| **登录用户首页** | 标签相似度优先 + FinalScore 兜底 |
| **首页刷新** | 随机 OFFSET，确保内容不重复 |
| **新视频冷启动** | 前 2 小时 +50% 初始热度加成 |
| **AI 劣质内容** | 情感评分 < 0.2 时，FinalScore × 0.3，压制展示 |
| **AI 优质内容** | 情感评分 > 0.8 时，FinalScore × 1.5，额外加权 |

### 9.3 异步评分更新

```java
// 推荐引擎任务提交
@Component
public class HesperRecommend {

    private final ExecutorService scoreUpdatePool =
        Executors.newVirtualThreadPerTaskExecutor(); // 虚拟线程池

    // 点赞/投币/收藏后触发
    public void submitScoreUpdateTask(Long videoId) {
        scoreUpdatePool.submit(() -> {
            try {
                Video video = videoDao.findById(videoId);
                double finalScore = calculateScore(video);
                videoDao.updateScore(videoId, finalScore);
                // 清除缓存
                cacheManager.evict("video:list:home:*");
            } catch (Exception e) {
                HesperLog.error("热度分更新失败 videoId=" + videoId, e);
            }
        });
    }

    // 新评论情感分析完成后触发
    public void submitQualityUpdateTask(Long videoId) {
        scoreUpdatePool.submit(() -> {
            double avgSentiment = commentDao.avgSentimentByVideoId(videoId);
            videoDao.updateAiQualityScore(videoId, avgSentiment);
            submitScoreUpdateTask(videoId); // 重新计算最终热度
        });
    }
}
```

---

## 十、AI智能引擎详解

### 10.1 Hesper-AI 核心架构

```
AI任务入队
    ↓
TaskQueue (有界阻塞队列，容量100)
    ↓
VirtualThreadWorkerPool (10个虚拟线程并发)
    ↓
AIProvider (统一接口，适配 DeepSeek / OpenAI / 通义千问)
    ↓
重试策略 (最多3次，指数退避)
    ↓
结果回调 → 更新数据库 + 触发推荐引擎 + 清除缓存
```

### 10.2 视频AI自动标注

**输入：** 视频标题 + 用户填写的简介（或默认"暂无简介"）

**Prompt 设计：**

```
你是一个视频内容分析专家。请根据以下视频信息，生成内容元数据。

视频标题：{title}
视频简介：{description}

请生成以下内容（JSON格式）：
{
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],  // 5个标签，用#前缀
  "summary": "100字以内的内容摘要"  // 一句话概括视频核心看点
}

要求：
- 标签要精准、热门、符合用户搜索习惯
- 摘要要有吸引力，能激发点击欲望
- 如果简介为空，根据标题推断内容
```

**容错处理：**
- API 超时（3s）：使用默认值（`ai_tags = title` 提取的关键词，`ai_summary = "暂无摘要"`）
- API 失败重试 3 次仍失败：跳过，保留空值，不影响主流程
- 超出 Token 限制：截断输入文本后重试

### 10.3 评论AI情感分析

**输入：** 评论文本内容

**Prompt 设计：**

```
分析以下评论的情感倾向，返回一个0.0到1.0之间的情感评分：

评论内容："{content}"

评分标准：
- 0.0~0.2：极度负面/恶意（辱骂、引战、垃圾信息）
- 0.2~0.5：负面/不友好
- 0.5~0.8：中性/一般
- 0.8~1.0：积极/友好

只返回一个数字（0.0~1.0），不需要其他文字。
```

**评分处理规则（与热度引擎联动）：**

| AI评分区间 | 情感标签 | 评论处理 | 对视频热度的间接影响 |
|---|---|---|---|
| 0.0 ~ 0.2 | NEGATIVE | `status=3`（AI自动隐藏，待UP主复核） | FinalScore × 0.3（内容质量压制） |
| 0.2 ~ 0.5 | NORMAL | 正常展示 | 无额外影响 |
| 0.5 ~ 0.8 | NORMAL | 正常展示 | 无额外影响 |
| 0.8 ~ 1.0 | POSITIVE | 正常展示 + **前置展示**（排序加权） | FinalScore × 1.2（优质互动正向激励） |

### 10.4 AI搜索建议（前端实现）

**重要说明：** 搜索建议功能由**前端直接调用大模型 API**实现（不经过后端），以减少后端 AI 调用压力。后端无需提供对应接口。

**实现位置：** 前端 `src/hooks/useAi.ts` 中 `getSearchSuggestions(keyword)` 函数

**Prompt 设计：**

```
用户搜索关键词："{keyword}"

这是一个视频平台的搜索场景。请推荐5个与该关键词相关的用户可能想要搜索的热词。
只返回关键词列表，用逗号分隔，不需要其他文字。
```

**前端展示：** 搜索无结果时显示"您是否在找：{关键词1}、{关键词2}、{关键词3}..."

---

## 十一、非功能性需求

### 11.1 高并发设计

| 策略 | 实现方式 |
|---|---|
| **虚拟线程** | 所有数据库 I/O、文件 I/O、AI API 调用全部使用 `VirtualThreadPerTaskExecutor` |
| **连接池** | Hesper-ORM 手写连接池，最大连接数 20，空闲超时 30 分钟回收 |
| **进程缓存** | Hesper-Cache 缓存热点数据，减少数据库查询 |
| **异步非阻塞** | 热度计算、AI 标注、情感分析全部异步化，不阻塞主请求链路 |
| **批量操作优化** | 点赞/播放量更新使用内存缓冲 + 定时批量写库（每100次或每10秒） |

### 11.2 异常处理规范

**全局统一异常响应格式：**

```json
{
  "code": 500,
  "msg": "系统繁忙，请稍后再试",
  "data": null,
  "traceId": "uuid-v4-xxx"  // 用于追踪问题
}
```

**标准错误码：**

| HTTP状态码 | 业务码 | 说明 |
|---|---|---|
| 200 | 200 | 操作成功 |
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 请先登录 |
| 403 | 403 | 无权限 / 账号被封禁 |
| 404 | 404 | 资源不存在 |
| 409 | 409 | 业务冲突（如重复投币、重复签到） |
| 500 | 500 | 系统内部错误 |

### 11.3 安全性要求

| 安全项 | 实现方案 |
|---|---|
| **SQL注入** | Hesper-ORM 强制使用 PreparedStatement，占位符参数绑定 |
| **密码存储** | BCrypt 加密（Hesper-Security 工具类） |
| **垂直越权** | 所有写操作校验 session 中用户身份，禁止通过参数修改他方数据 |
| **路径遍历** | 文件路径由系统生成，禁止用户自定义路径 |
| **文件上传** | 限制文件类型（白名单 mp4/avi/mov/mkv）+ 文件大小（500MB） |
| **CSRF** | POST 请求校验 session token（可选） |
| **敏感日志脱敏** | 密码、身份证等字段在日志中打码输出 |

### 11.4 性能指标

| 指标 | 目标 |
|---|---|
| **首页推荐接口 RT** | < 200ms（含缓存命中） |
| **视频详情接口 RT** | < 150ms |
| **AI 情感分析延迟** | < 3s（带超时控制） |
| **并发支持** | 500+ 并发连接（虚拟线程加持） |
| **数据库连接获取** | < 10ms（连接池命中） |
| **首页缓存命中率** | > 70%（热点数据预加载） |

---

## 十二、项目交付物

| 交付物 | 说明 | 必须性 |
|---|---|---|
| **完整源代码** | 托管于 Gitee 公开仓库，包含所有手写框架代码 | 必须 |
| **数据库脚本** | 包含完整 DDL + 初始数据（管理员账号等） | 必须 |
| **README.md** | 项目说明（运行说明、技术栈、各框架简介、接口列表） | 必须 |
| **开发日志** | 每日记录学习和项目进度（标注日期） | 必须 |
| **接口文档** | 各模块 API 入参和回参说明（推荐 Apifox 或 Markdown） | 建议 |
| **演示截图/视频** | 展示核心功能运行效果（AI标注、情感分析等） | 建议 |

---

## 十三、开发里程碑

| 阶段 | 时间 | 任务 |
|---|---|---|
| **阶段一：项目骨架 + 框架底层** | 4.2 | 项目初始化、JDBCUtils 封装、Hesper-IOC、Hesper-MVC、Hesper-ORM、Hesper-Log 骨架 |
| **阶段二：用户模块** | 4.3 | 用户注册/登录/个人信息/注销 + Hesper-Security 基础安全 |
| **阶段三：视频基础功能** | 4.4 | 视频上传/播放/发布管理 + 文件存储 |
| **阶段四：首页功能 + Hesper-Cache** | 4.5 | 首页推荐/刷新/搜索/历史浏览/下载 + 缓存接入 |
| **阶段五：互动模块** | 4.6 | 点赞/收藏/投币/评论/举报 + 历史记录 |
| **阶段六：AI引擎 + 推荐引擎** | 4.7 | Hesper-AI（标注/情感分析）+ Hesper-Recommend（热度公式/异步更新） |
| **阶段七：管理端** | 4.8 | 管理员登录/视频审核/封禁账号/举报处理/数据导出 |
| **阶段八：进阶功能完善** | 4.9 | 多级评论/UP主删评/签到/收藏/统计数据 |
| **阶段九：性能调优 + 联调** | 4.10 - 4.11 | 全链路联调、规约扫描、问题修复、AI降级/并发压测 |
| **阶段十：最终收尾** | 4.12 | README/文档整理、Git提交记录、Gitee push、自测 |
| **阶段十一：提交** | 4.13 上午 | 最终检查，截止 18:00 前 push 到 Gitee |

> **提交截止时间：2026年4月13日 18:00。超过提交时间视为无效提交。**

---

*本文档为《哩哔哩哔》完整产品需求文档 V7.0，涵盖全部功能需求、自研框架规范、AI引擎设计、推荐算法模型及非功能性要求。*
