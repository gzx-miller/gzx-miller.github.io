// ═══════════════════════════════════════════
// 1. Express：顺序执行的中间件链
// ═══════════════════════════════════════════

import express from 'express'

const app = express()
const chain = []                                        // 说明：记录请求实际流经的中间件
app.use((req, res, next) => { chain.push('日志'); next() })     // 说明：注册顺序即执行顺序
app.use((req, res, next) => { chain.push('鉴权'); next() })     // 说明：通用逻辑排在业务路由之前
app.get('/api/users', (req, res) => {
  chain.push('路由')                                    // 结果：最终 ['日志', '鉴权', '路由']
  res.json([])                                          // 结果：命中路由后返回响应
})

// ═══════════════════════════════════════════
// 2. Express：错误处理中间件与 Router 分组
// ═══════════════════════════════════════════

const findUser = async (id) => ({ id, name: '栗子' })   // 说明：示意用的数据访问
const router = express.Router()                         // 说明：把用户相关路由归到一组
router.get('/:id', (req, res, next) => {
  findUser(req.params.id)
    .then((user) => res.json(user))                     // 结果：命中后返回
    .catch(next)                                        // 说明：异常交给错误中间件
})
app.use('/api/users', router)                           // 说明：整组挂载到子路径
app.use((err, req, res, next) => {                      // 说明：四个参数才是错误处理中间件
  res.status(500).json({ error: err.message })          // 结果：统一错误响应
})

// ═══════════════════════════════════════════
// 3. Fastify：生命周期钩子与插件
// ═══════════════════════════════════════════

import fastify from 'fastify'

const fast = fastify({ logger: true })                  // 说明：内置 pino 结构化日志
const db = { users: { findMany: async () => [] } }      // 说明：示意用的数据访问
fast.addHook('onRequest', async (req) => {
  req.startedAt = Date.now()                            // 说明：请求进入即打点，供后续钩子使用
})
fast.register(async (instance) => {
  instance.decorate('db', db)                           // 说明：插件把能力装配到实例上
})

// ═══════════════════════════════════════════
// 4. Fastify：Schema 声明并在启动期编译
// ═══════════════════════════════════════════

const userSchema = {
  type: 'object',
  properties: { id: { type: 'integer' }, name: { type: 'string' } },
  required: ['name']                                    // 说明：缺 name 时直接返回 400
}
fast.post('/api/users', {
  schema: { body: userSchema, response: { 201: userSchema } },  // 结果：启动期编译为校验与序列化函数
  handler: async (req, reply) => {
    reply.code(201)
    return { id: 1, name: req.body.name }               // 结果：只输出 Schema 声明的字段
  }
})

// ═══════════════════════════════════════════
// 5. 选型与迁移
// ═══════════════════════════════════════════

const chooseBy = { contractStrength: 'fastify', teamFamiliarity: 'express' }  // 说明：按约束强度与熟悉度选型
const builtInLogger = 'pino'                            // 结果：Fastify 内置结构化日志
const migrationRule = '先保持路由与响应格式不变，行为对齐后再做内部优化'  // 说明：避免把框架变更与接口变更混在一起
