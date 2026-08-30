---
name: 补全 Node.js 知识分类至 30+ 条
overview: 为 Node.js 分类新增 14 个内容（D_17 ~ D_30），覆盖事件循环、Buffer、child_process、crypto、perf_hooks、https、CLI、cluster、timers、net、zlib、os 等重要知识点，使总内容数达到 30+ 条。
design:
  architecture:
    framework: vue
  styleKeywords:
    - 秋日森林
    - 暖光
    - 卡片式
    - 交互式
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 16px
      weight: 600
    subheading:
      size: 14px
      weight: 500
    body:
      size: 13px
      weight: 400
  colorSystem:
    primary:
      - "#e8590c"
      - "#d9480f"
    background:
      - "#fff9f0"
      - "#ffffff"
    text:
      - "#334155"
      - "#64748b"
    functional:
      - "#16a34a"
      - "#dc2626"
      - "#f59e0b"
todos:
  - id: create-d17-d20
    content: 创建 D17 事件循环、D18 Buffer、D19 子进程、D20 cluster 四个 demo 组件
    status: completed
  - id: create-d21-d24
    content: 创建 D21 crypto、D22 perf_hooks、D23 HTTPS、D24 CLI 四个 demo 组件
    status: completed
    dependencies:
      - create-d17-d20
  - id: create-d25-d28
    content: 创建 D25 timers、D26 TCP、D27 zlib、D28 os 四个 demo 组件
    status: completed
    dependencies:
      - create-d21-d24
  - id: create-d29-d30
    content: 创建 D29 dns、D30 readline 两个 demo 组件
    status: completed
    dependencies:
      - create-d25-d28
  - id: register-lessons
    content: 在 lessons.ts 中添加 14 个内容的加载器声明和内容数据
    status: completed
    dependencies:
      - create-d29-d30
  - id: type-check-and-build
    content: 运行 pnpm type-check 和 pnpm build 验证类型正确性和构建成功
    status: completed
    dependencies:
      - register-lessons
  - id: commit
    content: 提交补全的 Node.js 分类内容
    status: completed
    dependencies:
      - type-check-and-build
---

## 产品概述

为 Node.js 知识分类补全内容，从现有 16 条（D_01 ~ D_16）扩充至 30+ 条，覆盖事件循环、Buffer、子进程、加密、性能分析等重要但未覆盖的知识点。

## 核心功能

- 新增 14 个 Node.js 内容 demo 组件（D17 ~ D30）
- 在每个 demo 中通过浏览器端交互模拟 Node.js 核心概念
- 在 `lessons.ts` 中注册所有新内容（加载器声明 + lessons 数组条目）
- 每个内容包含：交互演示、原理说明、学习流程、注意事项、问题场景

## 技术栈

- 前端框架：Vue 3 + TypeScript（`<script setup lang="ts">`）
- UI 风格：沿用现有 `.demo-card` 卡片风格，中文文案、英文变量名
- 注册方式：`createDemo('D17EventLoop')` + `createCodeLoader('D17EventLoop.vue')`
- 路由规则：`/nodejs/d-17/event-loop`（保留 `/nodejs/` 分类层级）

## 实现方案

### 新增内容清单（D17 ~ D30，共 14 个）

| 编号 | 标题 | 子分类 | 核心交互 |
| --- | --- | --- | --- |
| D17 | 事件循环与宏微任务 | 事件循环 | 可视化事件循环执行顺序（nextTick/setTimeout/setImmediate） |
| D18 | Buffer 与二进制数据 | 二进制 | 模拟 Buffer 拼接、编码转换、溢出处理 |
| D19 | child_process 子进程 | 多进程 | 对比 spawn/fork/exec，模拟并行执行 |
| D20 | cluster 多核利用 | 多进程 | 模拟主进程 + 工作进程架构，展示负载分发 |
| D21 | crypto 加密实践 | 安全 | 模拟密码哈希（bcrypt 风格）、HMAC、AES 加密 |
| D22 | perf_hooks 性能分析 | 性能 | 模拟性能打点、measure 测量、火焰图概念 |
| D23 | HTTPS 与 TLS 配置 | 网络 | 展示 HTTPS 服务器配置、证书、TLS 版本选择 |
| D24 | CLI 参数与命令行工具 | CLI | 模拟 commander/yargs 风格的参数解析 |
| D25 | timers 定时器详解 | 事件循环 | 对比 setTimeout/setInterval/setImmediate/nextTick |
| D26 | net TCP 网络编程 | 网络 | 模拟 TCP 服务器与客户端通信 |
| D27 | zlib 压缩与解压 | 性能 | 模拟 gzip/deflate 压缩比和速度对比 |
| D28 | os 系统信息与资源监控 | 系统 | 展示 CPU/内存/平台信息获取 |
| D29 | dns 域名解析 | 网络 | 模拟 DNS 查询（A/AAAA/MX 记录） |
| D30 | readline 交互式输入 | CLI | 模拟命令行交互式问答 |


### 关键实现细节

- 所有 demo 在浏览器端运行，通过定时器模拟异步行为，不涉及真正的 Node.js API
- 代码展示使用 `<pre class="mini-code">` 展示 Node.js 实际代码示例
- 遵循现有 demo 的简洁风格：单个交互操作 + 代码展示 + 说明文字
- 每个 demo 文件控制在 50 行以内（含模板和样式）

### 文件修改清单

```
src/demos/D17EventLoop.vue      [NEW] 事件循环可视化演示
src/demos/D18Buffer.vue         [NEW] Buffer 二进制数据处理
src/demos/D19ChildProcess.vue   [NEW] 子进程 spawn/fork/exec
src/demos/D20Cluster.vue        [NEW] cluster 多核利用
src/demos/D21Crypto.vue         [NEW] crypto 加密实践
src/demos/D22PerfHooks.vue      [NEW] perf_hooks 性能分析
src/demos/D23Https.vue          [NEW] HTTPS/TLS 配置
src/demos/D24Cli.vue            [NEW] CLI 参数处理
src/demos/D25Timers.vue         [NEW] timers 定时器详解
src/demos/D26NetTcp.vue         [NEW] TCP 网络编程
src/demos/D27Zlib.vue           [NEW] zlib 压缩
src/demos/D28Os.vue             [NEW] os 系统信息
src/demos/D29Dns.vue            [NEW] dns 域名解析
src/demos/D30Readline.vue       [NEW] readline 交互式输入
src/data/lessons.ts             [MODIFY] 添加加载器声明和 14 条内容数据
```

## 设计风格

沿用项目现有的秋日森林、暖光风格，demo 组件使用统一的 `.demo-card` 卡片样式。

每个 demo 组件布局：

- 顶部：知识点说明（中文，1-2 句话）
- 中部：交互操作区（按钮/选择器/输入框）
- 下部：代码示例（`<pre class="mini-code">`）和补充说明（`<small>`）

## 交互设计原则

- 每个 demo 只展示一个核心概念，交互操作不超过 2 个
- 使用按钮触发模拟，结果区域展示执行效果
- 代码展示区使用暗色背景（`#1e1e2e`）、浅色文字的 mini-code 风格
- 对比类 demo（如 D19 子进程）使用双栏布局展示差异

## 页面结构（单个 demo）

1. **说明区**：知识点一句话描述
2. **交互区**：触发按钮或选择控件
3. **结果区**：执行结果或状态展示
4. **代码区**：Node.js 实际代码示例
5. **补充区**：适用场景或注意事项