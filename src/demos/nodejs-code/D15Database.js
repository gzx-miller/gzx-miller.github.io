// ═══════════════════════════════════════════
// D15 - 数据库连接与迁移
// ═══════════════════════════════════════════

// ───────── 原生 SQLite (better-sqlite3) ─────────
// 轻量级，嵌入式数据库，适合小型应用

// import Database from 'better-sqlite3'
//
// // 连接数据库（文件不存在会自动创建）
// const db = new Database('app.db')
//
// // 启用 WAL 模式，提高并发性能
// db.pragma('journal_mode = WAL')
//
// // 创建表
// db.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   )
// `)
//
// // 插入数据（预处理语句，防 SQL 注入）
// const insertUser = db.prepare(`
//   INSERT INTO users (name, email) VALUES (?, ?)
// `)
//
// const result = insertUser.run('张三', 'zhangsan@example.com')
// console.log('新用户 ID:', result.lastInsertRowid)
//
// // 查询单条
// const getUserById = db.prepare('SELECT * FROM users WHERE id = ?')
// const user = getUserById.get(1)
// console.log('用户:', user)
//
// // 查询多条
// const getUsers = db.prepare('SELECT * FROM users LIMIT ? OFFSET ?')
// const users = getUsers.all(10, 0)
// console.log('用户列表:', users)
//
// // 更新
// const updateUser = db.prepare('UPDATE users SET name = ? WHERE id = ?')
// const updateResult = updateUser.run('李四', 1)
// console.log('影响行数:', updateResult.changes)
//
// // 删除
// const deleteUser = db.prepare('DELETE FROM users WHERE id = ?')
// deleteUser.run(1)
//
// // 事务
// const createMany = db.transaction((users) => {
//   const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
//   for (const user of users) {
//     insert.run(user.name, user.email)
//   }
// })
//
// createMany([
//   { name: '用户A', email: 'a@example.com' },
//   { name: '用户B', email: 'b@example.com' }
// ])

// ───────── PostgreSQL (pg 库) ─────────
// 功能强大的关系型数据库，适合生产环境

// import pg from 'pg'
// const { Pool } = pg
//
// // 连接池（推荐使用连接池，而不是单个连接）
// const pool = new Pool({
//   host: 'localhost',
//   port: 5432,
//   database: 'mydb',
//   user: 'postgres',
//   password: 'password',
//   max: 20,              // 最大连接数
//   idleTimeoutMillis: 30000,  // 空闲连接超时
//   connectionTimeoutMillis: 2000 // 连接超时
// })
//
// // 查询（参数化查询，防 SQL 注入）
// async function getUsers(page = 1, limit = 10) {
//   const offset = (page - 1) * limit
//   const result = await pool.query(
//     'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
//     [limit, offset]
//   )
//   return result.rows
// }
//
// // 插入并返回
// async function createUser(name, email) {
//   const result = await pool.query(
//     'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
//     [name, email]
//   )
//   return result.rows[0]
// }
//
// // 事务
// async function transferMoney(fromId, toId, amount) {
//   const client = await pool.connect()
//   try {
//     await client.query('BEGIN')
//
//     // 扣钱
//     await client.query(
//       'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
//       [amount, fromId]
//     )
//
//     // 加钱
//     await client.query(
//       'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
//       [amount, toId]
//     )
//
//     await client.query('COMMIT')
//   } catch (err) {
//     await client.query('ROLLBACK')
//     throw err
//   } finally {
//     client.release() // 释放连接回连接池
//   }
// }
//
// // 关闭连接池
// // await pool.end()

// ───────── ORM: Prisma 示例 ─────────
// 类型安全的 ORM，支持多种数据库

// schema.prisma 文件:
// generator client {
//   provider = "prisma-client-js"
// }
//
// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }
//
// model User {
//   id    Int     @id @default(autoincrement())
//   name  String
//   email String  @unique
//   posts Post[]
//   createdAt DateTime @default(now())
// }
//
// model Post {
//   id      Int     @id @default(autoincrement())
//   title   String
//   content String?
//   author  User    @relation(fields: [authorId], references: [id])
//   authorId Int
// }

// 代码中使用:
// import { PrismaClient } from '@prisma/client'
//
// const prisma = new PrismaClient()
//
// // 创建用户
// const user = await prisma.user.create({
//   data: {
//     name: '张三',
//     email: 'zhangsan@example.com',
//     posts: {
//       create: { title: '第一篇文章' }
//     }
//   },
//   include: { posts: true }
// })
//
// // 查询
// const users = await prisma.user.findMany({
//   where: { name: { contains: '张' } },
//   include: { posts: true },
//   orderBy: { createdAt: 'desc' },
//   take: 10,
//   skip: 0
// })
//
// // 更新
// const updated = await prisma.user.update({
//   where: { id: 1 },
//   data: { name: '李四' }
// })
//
// // 删除
// await prisma.user.delete({ where: { id: 1 } })
//
// // 事务
// await prisma.$transaction([
//   prisma.user.create({ data: { name: 'A', email: 'a@test.com' } }),
//   prisma.user.create({ data: { name: 'B', email: 'b@test.com' } })
// ])

// ───────── 数据库迁移 ─────────

// 为什么需要迁移？
// - 追踪数据库结构变更
// - 团队协作同步
// - 部署时自动升级
// - 可回滚

// 迁移工具：
// - Prisma Migrate (Prisma 自带)
// - Knex.js (查询构建器 + 迁移)
// - Flyway / Liquibase (多语言)
// - db-migrate

// Knex 迁移示例：
// 迁移文件: migrations/20240101000000_create_users.js
//
// exports.up = function(knex) {
//   return knex.schema.createTable('users', (table) => {
//     table.increments('id').primary()
//     table.string('name').notNullable()
//     table.string('email').unique().notNullable()
//     table.timestamps(true, true)
//   })
// }
//
// exports.down = function(knex) {
//   return knex.schema.dropTable('users')
// }
//
// 运行迁移: knex migrate:latest
// 回滚: knex migrate:rollback

// ───────── 连接池最佳实践 ─────────

// 1. 始终使用连接池，不要每次查询新建连接
// 2. 根据数据库最大连接数设置 pool size
//    PostgreSQL 默认 100，一般设置 20-50
// 3. 正确释放连接（finally 块）
// 4. 设置连接超时和空闲超时
// 5. 监控连接池状态（活跃数、空闲数、等待数）

// ───────── 数据库最佳实践 ─────────
// 使用参数化查询，永远不要拼接 SQL
// 合理设计索引，不要过度索引
// 使用连接池管理连接
// 重要操作使用事务保证原子性
// 大表查询加 LIMIT，避免全表扫描
// 定期备份数据库
// 读写分离（主从复制）提升读性能
// 生产环境不要用 ORM 的原始查询方法
// 慢查询日志分析，优化性能瓶颈
