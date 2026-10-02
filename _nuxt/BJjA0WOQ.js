const n=`<script setup lang="ts">
import { ref } from 'vue'

interface Course {
  id: number
  title: string
  capacity: number
  enrolled: number
}

const courses = ref<Course[]>([
  { id: 1, title: 'NestJS 模块化实战', capacity: 2, enrolled: 1 },
  { id: 2, title: 'TypeORM 事务进阶', capacity: 30, enrolled: 8 },
  { id: 3, title: 'WebSocket 实时课堂', capacity: 50, enrolled: 49 },
])

const logs = ref<string[]>([])
const statusMsg = ref('')

async function enroll(courseId: number) {
  const course = courses.value.find((c) => c.id === courseId)
  if (!course) return
  logs.value = []
  statusMsg.value = ''

  logs.value.push(\`📦 BEGIN TRANSACTION（事务开启）\`)
  logs.value.push(\`→ SELECT * FROM courses WHERE id = \${courseId}\`)
  await delay()
  logs.value.push(\`→ 检查名额：enrolled(\${course.enrolled}) < capacity(\${course.capacity}) ?\`)

  if (course.enrolled >= course.capacity) {
    logs.value.push(\`❌ 名额已满 → throw BadRequestException('课程名额已满')\`)
    logs.value.push(\`↩️ ROLLBACK（整笔回滚，数据库无改动）\`)
    statusMsg.value = \`❌ 报名失败：课程「\${course.title}」名额已满，事务已回滚\`
    return
  }

  logs.value.push(\`→ UPDATE courses SET enrolled = enrolled + 1 WHERE id = \${courseId}\`)
  await delay()
  course.enrolled += 1
  logs.value.push(\`✔️ COMMIT（事务提交）\`)
  statusMsg.value = \`✅ 报名成功：课程「\${course.title}」剩余名额 \${course.capacity - course.enrolled}\`
}

function delay() {
  return new Promise((r) => setTimeout(r, 350))
}
<\/script>

<template>
  <div class="demo-card">
    <h3>🌰 课程报名 · TypeORM 实体 + 事务</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      点击"报名"，观察 <code>manager.transaction</code> 中"检查名额 → 扣减 → 提交/回滚"的原子过程：
    </p>

    <div class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-item">
        <div class="course-info">
          <strong>{{ course.title }}</strong>
          <span class="course-meta">ID {{ course.id }} · 名额 {{ course.enrolled }}/{{ course.capacity }}</span>
          <div class="progress">
            <span class="progress-bar" :style="{ width: \`\${(course.enrolled / course.capacity) * 100}%\` }"></span>
          </div>
        </div>
        <button
          class="tab-btn"
          :class="{ active: course.enrolled < course.capacity }"
          @click="enroll(course.id)"
        >
          报名
        </button>
      </div>
    </div>

    <p v-if="statusMsg" class="status-msg" :class="{ fail: statusMsg.startsWith('❌') }">{{ statusMsg }}</p>

    <div v-if="logs.length" class="tx-log">
      <p v-for="(log, i) in logs" :key="i" class="tx-line">{{ log }}</p>
    </div>

    <p class="note">
      <strong>事务语义：</strong>回调内所有 SQL 在同一事务中执行，任一步抛错 → 整体 ROLLBACK；
      全部成功 → COMMIT。名额检查与扣减因此是原子的，避免超额报名。
    </p>
  </div>
</template>

<style scoped>
.course-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.course-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.course-meta {
  font-size: 12px;
  color: var(--muted);
}

.progress {
  height: 6px;
  border-radius: 999px;
  background: var(--surface-soft);
  overflow: hidden;
}

.progress-bar {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--leaf-red), var(--leaf-orange));
}

.status-msg {
  margin: 10px 0;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  background: color-mix(in srgb, var(--forest) 10%, var(--bg));
  color: var(--forest);
}

.status-msg.fail {
  background: color-mix(in srgb, var(--leaf-red) 10%, var(--bg));
  color: var(--leaf-red);
}

.tx-log {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed var(--border);
  background: var(--surface);
  margin-bottom: 10px;
}

.tx-line {
  margin: 4px 0;
  font-size: 12px;
  color: var(--text);
  font-family: Consolas, Menlo, monospace;
}

.note {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
`;export{n as default};
