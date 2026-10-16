const n=`// ═══════════════════════════════════════════
// 1. 原生 SQL：参数化防注入
// ═══════════════════════════════════════════

async function listCoursesByRaw(pool, status) {
  const sql = 'SELECT u.name, c.title FROM users u JOIN courses c ON c.user_id = u.id WHERE c.status = $1'
  const { rows } = await pool.query(sql, [status])       // 说明：变量走占位符，不拼接字符串
  return rows                                            // 结果：只取需要的列，最贴近数据库
}

// ═══════════════════════════════════════════
// 2. 查询构建器：链式且安全
// ═══════════════════════════════════════════

function buildCourseQuery(db, status) {
  return db('users')
    .join('courses', 'users.id', 'courses.user_id')      // 说明：链式拼装，参数仍走占位
    .where('courses.status', status)
    .select('users.name', 'courses.title')               // 结果：生成与原生 SQL 等价的语句
}
const builtSql = buildCourseQuery({}, 'active')          // 说明：可组合、可复用，兼顾灵活与安全

// ═══════════════════════════════════════════
// 3. ORM：便利与 N+1 隐患
// ═══════════════════════════════════════════

async function listUsersWithGraph(User, status) {
  const users = await User.query()
    .withGraphFetched('courses')                         // 说明：一次预加载，避免循环里逐行查询
    .where('courses.status', status)
  return users.map((user) => ({ name: user.name, title: user.courses[0]?.title }))  // 结果：显式挑选字段
}
const nPlusOneTrap = '循环里访问 user.courses 会每行发一条查询'   // 说明：隐式 N+1，复杂查询应回退原生 SQL

// ═══════════════════════════════════════════
// 4. 连接池：借出、使用、归还
// ═══════════════════════════════════════════

const instances = 4                                      // 说明：服务的实例数
const perPoolMax = 10                                    // 结果：实例数 × 每池连接数 = 40
const dbMaxConnections = 100                             // 说明：不超过数据库上限才有意义
const poolConfig = {
  max: perPoolMax,                                       // 说明：池子并非越大越好，过大反而争抢资源
  acquireTimeoutMillis: 5_000                            // 说明：池耗尽时不要无限等待
}

// ═══════════════════════════════════════════
// 5. 迁移：up 与 down 必须成对
// ═══════════════════════════════════════════

const migration = {
  up: (knex) => knex.schema.createTable('courses', (t) => {   // 结果：应用变更
    t.increments('id').primary()
    t.string('title').notNullable()
    t.integer('user_id').references('users.id')
  }),
  down: (knex) => knex.schema.dropTable('courses')            // 说明：回滚能撤销上面那次变更
}
const appliedMigrations = ['20240101_create_courses']         // 说明：按版本顺序执行，可重复执行
`;export{n as default};
