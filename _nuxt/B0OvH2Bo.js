const n=`// ═══════════════════════════════════════════
// D13 - Express 与 Fastify 路由对比
// ═══════════════════════════════════════════

// 注意：以下示例代码需要安装对应框架
// npm install express
// npm install fastify

// ───────── Express 示例 ─────────

// Express: 最流行的 Node.js Web 框架
// 特点：极简、灵活、生态丰富、中间件模式
// 性能：中等，适合大多数场景

// const express = require('express')
// const app = express()
//
// // 中间件
// app.use(express.json()) // 解析 JSON 请求体
// app.use(express.urlencoded({ extended: true })) // 解析表单数据
//
// // 路由
// app.get('/', (req, res) => {
//   res.send('Hello Express!')
// })
//
// app.get('/api/users/:id', (req, res) => {
//   const { id } = req.params
//   const { page = 1, limit = 10 } = req.query
//   res.json({ id, page, limit })
// })
//
// app.post('/api/users', (req, res) => {
//   const body = req.body
//   res.status(201).json({ id: 1, ...body })
// })
//
// // 错误处理中间件
// app.use((err, req, res, next) => {
//   console.error(err)
//   res.status(500).json({ error: 'Internal Server Error' })
// })
//
// // 404 处理
// app.use((req, res) => {
//   res.status(404).json({ error: 'Not Found' })
// })
//
// app.listen(3000, () => {
//   console.log('Express server running on port 3000')
// })

// ───────── Fastify 示例 ─────────

// Fastify: 高性能 Node.js Web 框架
// 特点：高性能、内置 JSON Schema、类型安全、插件系统
// 性能：比 Express 快 2-5 倍

// import Fastify from 'fastify'
//
// const fastify = Fastify({
//   logger: true // 内置日志
// })
//
// // 路由
// fastify.get('/', async (request, reply) => {
//   return { hello: 'Fastify!' }
// })
//
// // 带 Schema 的路由（自动验证 + 序列化加速）
// fastify.get('/api/users/:id', {
//   schema: {
//     params: {
//       type: 'object',
//       properties: {
//         id: { type: 'string' }
//       }
//     },
//     querystring: {
//       type: 'object',
//       properties: {
//         page: { type: 'integer', default: 1 },
//         limit: { type: 'integer', default: 10 }
//       }
//     },
//     response: {
//       200: {
//         type: 'object',
//         properties: {
//           id: { type: 'string' },
//           page: { type: 'integer' },
//           limit: { type: 'integer' }
//         }
//       }
//     }
//   }
// }, async (request, reply) => {
//   const { id } = request.params
//   const { page, limit } = request.query
//   return { id, page, limit }
// })
//
// // POST 路由
// fastify.post('/api/users', {
//   schema: {
//     body: {
//       type: 'object',
//       required: ['name', 'email'],
//       properties: {
//         name: { type: 'string', minLength: 2 },
//         email: { type: 'string', format: 'email' }
//       }
//     }
//   }
// }, async (request, reply) => {
//   const body = request.body
//   reply.code(201)
//   return { id: 1, ...body }
// })
//
// // 启动
// const start = async () => {
//   try {
//     await fastify.listen({ port: 3000 })
//   } catch (err) {
//     fastify.log.error(err)
//     process.exit(1)
//   }
// }
// start()

// ───────── 核心差异对比 ─────────

// 1. 性能
//    Express: 中等，约 15k req/s
//    Fastify: 高性能，约 60k+ req/s
//    Fastify 快的原因：
//    - 基于 JSON Schema 的快速序列化 (fast-json-stringify)
//    - 基于 radix tree 的路由查找 (find-my-way)
//    - 更高效的中间件机制

// 2. 中间件 vs 插件
//    Express: 中间件模式，顺序执行
//    Fastify: 插件系统，基于 hooks，更模块化

// 3. 请求验证
//    Express: 需要手动验证或用第三方库 (joi, zod)
//    Fastify: 内置 JSON Schema 验证，自动生成 OpenAPI

// 4. 类型支持
//    Express: TypeScript 支持一般，需要额外类型包
//    Fastify: 原生 TypeScript 支持，Schema 自动推导类型

// 5. 生态
//    Express: 极其丰富，几乎什么都有
//    Fastify: 生态也不错，但比 Express 少一些
//    Fastify 兼容 Express 中间件 (@fastify/middie)

// 6. 日志
//    Express: 无内置，常用 morgan / winston
//    Fastify: 内置 pino 高性能日志

// ───────── 路由语法对比 ─────────

// 语法对比表：
//
// 功能           | Express                    | Fastify
// -------------- | -------------------------- | -------------------------
// 基础路由       | app.get(path, handler)     | fastify.get(path, handler)
// URL 参数       | req.params                 | request.params
// 查询参数       | req.query                  | request.query
// 请求体         | req.body                   | request.body
// 响应 JSON      | res.json(data)             | return data
// 状态码         | res.status(201).json(...)  | reply.code(201).send(...)
// 重定向         | res.redirect('/path')      | reply.redirect('/path')
// 中间件         | app.use(middleware)        | fastify.addHook('preHandler', fn)
// 错误处理       | app.use((err, req, res))   | fastify.setErrorHandler(fn)

// ───────── 中间件/钩子对比 ─────────

// Express 中间件执行顺序：
// 1. Application 级中间件
// 2. Router 级中间件
// 3. 路由处理器
// 4. 错误处理中间件

// Fastify 生命周期钩子：
// 1. onRequest           - 请求到达时
// 2. preParsing          - 解析请求前
// 3. preValidation       - 验证前
// 4. preHandler          - 处理器前
// 5. preSerialization    - 序列化响应前
// 6. onSend              - 发送响应前
// 7. onResponse          - 响应发送后
// 8. onError             - 错误发生时

// ───────── 如何选择？ ─────────

// 选择 Express：
// - 项目简单，快速原型
// - 需要丰富的生态和中间件
// - 团队熟悉 Express
// - 维护老项目

// 选择 Fastify：
// - 对性能有要求
// - 新项目，希望有更好的类型安全
// - 喜欢 Schema 驱动开发
// - 需要内置验证、日志等功能
// - 构建 API 服务

// 性能要求极高时的选择：
// - Fastify
// - Hono (超轻量，边缘计算友好)
// - 原生 http 模块（极端情况）

// ───────── 共同的最佳实践 ─────────
// - 使用环境变量配置
// - 统一错误处理
// - 请求参数验证
// - 速率限制
// - 安全头 (helmet)
// - CORS 配置
// - 日志记录
// - 测试覆盖
`;export{n as default};
