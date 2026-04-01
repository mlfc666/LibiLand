# 每日进度追踪

## 2026-04-01

### 今日完成事项

- [x] 项目立项，确定技术栈：后端 Java + Servlet（手写8大框架），前端 React + TypeScript/TSX + Tailwind + DaisyUI
- [x] 初始化项目PRD文档（docs/prd.md）
- [x] 创建任务清单文档（docs/task.md）
- [x] 创建 .gitignore 文件
- [x] Git 初始化并完成首次 commit
- [x] 建立 docs/backend/ 和 docs/frontend/ 目录结构，分别存放前后端PRD和task.md
- [x] 完成前后端PRD一致性交叉检查，修复10+处不一致项
- [x] 前端PRD定稿：React + TSX + Tailwind + DaisyUI + Zustand
- [x] 后端PRD定稿：8大自研框架 + AI深度融合
- [x] PRD重构：将API接口定义移除，改为功能特点描述（功能导向）

### 代码笔记

**技术栈约束（硬性要求）：**
- 后端禁止使用任何框架（Spring/MyBatis/JdbcTemplate等），全部底层组件手写
- 8大手写框架：Hesper-IOC、Hesper-MVC、Hesper-ORM、Hesper-Cache、Hesper-AI、Hesper-Recommend、Hesper-Security、Hesper-Log
- JDK 21 Virtual Threads 实现高并发
- MySQL 8.0+ utf8mb4 字符集

**AI深度融合：**
- 视频自动标注：Hesper-AI 分析标题+简介，生成 tags 和 summary
- 评论情感分析：sentimentScore 0.0~1.0，sentimentLabel = POSITIVE/NORMAL/NEGATIVE
- 情感评分影响热度分：POSITIVE×1.2，NEGATIVE×0.3
- AI搜索建议由前端直接调用大模型API（后端不提供接口）

**热度公式：**
FinalScore = (Clicks×1 + Likes×5 + Coins×10 + Collects×8 + QualityBoost + ColdStartBoost) / (Hours+2)^1.5
QualityBoost = avgSentimentScore × 10

**前端技术选型：**
- React 18 + TypeScript + TSX
- Tailwind CSS + DaisyUI
- Zustand（persist中间件，sessionStorage存储）
- React Router v6
- Axios + 拦截器
- Lucide React 图标
- Recharts 图表

**Git Commit Hash：** bccdb0ccbb977bf685fc23306f0027405aaee39b

---

## YYYY-MM-DD

### 今日完成事项

- [ ]

### 代码笔记

---
