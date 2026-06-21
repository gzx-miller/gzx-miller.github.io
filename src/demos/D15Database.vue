<script setup>
import { ref, computed } from 'vue'

const mode = ref('orm')
const migrated = ref(false)

const modes = {
  raw: { label: '原生 SQL', code: "SELECT u.name, c.title\n  FROM users u\n  JOIN courses c ON c.user_id = u.id\n WHERE c.status = 'active'" },
  query: { label: '查询构建器', code: "db.table('users')\n  .join('courses', 'users.id', 'courses.user_id')\n  .where('courses.status', 'active')\n  .select('users.name', 'courses.title')" },
  orm: { label: 'ORM', code: "const users = await User.query()\n  .withGraphFetched('courses')\n  .where('courses.status', 'active')" }
}

const migration = ref(`// migrations/20240101_create_courses.js
exports.up = (knex) =>
  knex.schema.createTable('courses', (t) => {
    t.increments('id').primary()
    t.string('title').notNullable()
    t.integer('user_id').references('users.id')
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })
exports.down = (knex) =>
  knex.schema.dropTable('courses')`)
</script>

<template><div class="demo-card">
  <p>数据库访问有三种模式：原生 SQL 灵活高效、查询构建器可链式组合、ORM 提供模型抽象。</p>
  <div class="toggle-row">
    <button v-for="(v, k) in modes" :key="k" :class="{ active: mode === k }" @click="mode = k">{{ v.label }}</button>
  </div>
  <pre class="mini-code"><code>{{ modes[mode].code }}</code></pre>
  <hr />
  <strong>迁移工作流</strong>
  <pre class="mini-code"><code>{{ migration }}</code></pre>
  <button @click="migrated = !migrated">{{ migrated ? '回滚 (down)' : '执行迁移 (up)' }}</button>
  <p :class="migrated ? 'test-pass' : 'test-fail'">{{ migrated ? '✓ courses 表已创建，包含 id / title / user_id / created_at 字段' : '○ courses 表尚未创建' }}</p>
  <small>迁移文件按时间戳排序，<code>up</code> 应用变更、<code>down</code> 回滚变更，确保数据库版本可控。</small>
</div></template>
