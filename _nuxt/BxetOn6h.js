const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type LockMode = 'none' | 'pessimistic' | 'optimistic'

interface LogLine {
  text: string
  tone: 'success' | 'error' | 'warning' | ''
}

const capacity = 1
const mode = ref<LockMode>('none')
const concurrency = ref(3)
const successCount = ref(0)
const storedEnrolled = ref(0)
const logs = ref<LogLine[]>([])

const modeOptions = [
  { value: 'none' as const, label: '无锁' },
  { value: 'pessimistic' as const, label: '悲观锁 FOR UPDATE' },
  { value: 'optimistic' as const, label: '乐观锁 @Version' },
]

const modeIntro: Record<LockMode, string> = {
  none: '事务只保证「全做或全不做」，不会让「先查后写」串行，两个请求可能读到同一个剩余名额。',
  pessimistic: 'SELECT ... FOR UPDATE 锁住这一行，后到的事务必须等前一个提交，检查与写入因此串行。',
  optimistic: '读取时记下 version，写入时用 WHERE version = ? 做条件更新；版本变了就冲突重试或拒绝。',
}

const oversold = computed(() => Math.max(0, successCount.value - storedEnrolled.value))

function push(text: string, tone: LogLine['tone'] = '') {
  logs.value.push({ text, tone })
}

function run() {
  logs.value = []
  successCount.value = 0
  storedEnrolled.value = 0
  const total = concurrency.value

  if (mode.value === 'none') {
    push(\`\${total} 个请求同时进入，各自执行 BEGIN，事务之间互不阻塞\`)
    for (let i = 1; i <= total; i++) {
      push(\`请求 #\${i} 执行普通 SELECT，读到 enrolled = 0（快照读，不加锁）\`)
    }
    for (let i = 1; i <= total; i++) {
      push(\`请求 #\${i} 判断 0 < \${capacity} 通过 → UPDATE enrolled = 1 → COMMIT\`, 'success')
    }
    successCount.value = total
    storedEnrolled.value = 1
    push(
      total > capacity
        ? \`结果：\${total} 个请求都返回成功，落库只有 \${capacity} 个名额 → 超卖 \${total - capacity}\`
        : \`结果：\${total} 个请求成功，恰好占满 \${capacity} 个名额\`,
      total > capacity ? 'error' : 'success',
    )
    return
  }

  if (mode.value === 'pessimistic') {
    push('所有事务对同一行执行 SELECT ... FOR UPDATE，拿不到行锁就等待')
    let enrolled = 0
    for (let i = 1; i <= total; i++) {
      if (enrolled < capacity) {
        push(\`请求 #\${i} 获得行锁，读到 enrolled = \${enrolled} → 通过 → UPDATE enrolled = \${enrolled + 1} → COMMIT\`, 'success')
        enrolled += 1
        successCount.value += 1
      } else {
        push(\`请求 #\${i} 等到锁，读到 enrolled = \${enrolled} → 名额已满 → ROLLBACK\`, 'error')
      }
    }
    storedEnrolled.value = enrolled
    push(\`结果：成功 \${successCount.value} 笔，落库 enrolled = \${enrolled}，没有超卖\`, 'success')
    return
  }

  push('并发开始：所有请求都读到 enrolled = 0、version = 0')
  for (let i = 1; i <= total; i++) {
    push(\`请求 #\${i} 读取课程快照：enrolled = 0，version = 0\`)
  }
  push('请求 #1 UPDATE ... SET enrolled = 1, version = 1 WHERE id = 1 AND version = 0 → affected 1', 'success')
  successCount.value = 1
  storedEnrolled.value = 1
  for (let i = 2; i <= total; i++) {
    push(\`请求 #\${i} 同条件更新 → affected 0，版本冲突；重读后 enrolled = 1 → 拒绝或返回 409\`, 'warning')
  }
  push(\`结果：成功 \${successCount.value} 笔，冲突的 \${Math.max(0, total - 1)} 笔没有写入，没有超卖\`, 'success')
}

function selectMode(next: LockMode) {
  mode.value = next
  run()
}

run()

const sampleCode = \`// 悲观锁：锁住这一行，直到事务提交
const course = await manager.findOne(Course, {
  where: { id: courseId },
  lock: { mode: 'pessimistic_write' }, // SELECT ... FOR UPDATE
})

// 乐观锁：版本不匹配就更新失败，再决定重试或拒绝
const result = await repo
  .createQueryBuilder()
  .update(Course)
  .set({ enrolled: () => 'enrolled + 1', version: () => 'version + 1' })
  .where('id = :id AND version = :version', { id: courseId, version: course.version })
  .execute()

if (result.affected === 0) throw new ConflictException('并发冲突，请重试')\`
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3>🌰 并发报名 · 锁与超卖</h3>
      <p class="hint" style="margin-bottom: 12px">
        课程只有 <strong>1</strong> 个名额，当前已报 <strong>0</strong> 人。切换锁策略后运行模拟，
        观察多个并发请求是否会把名额卖超。
      </p>

      <div class="tab-bar">
        <button
          v-for="option in modeOptions"
          :key="option.value"
          class="tab-btn"
          :class="{ active: mode === option.value }"
          @click="selectMode(option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <p class="status-panel">{{ modeIntro[mode] }}</p>

      <div class="controls" style="margin-top: 12px">
        <label>
          并发请求数
          <select v-model.number="concurrency" @change="run">
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <button class="mini-btn" @click="run">运行并发报名</button>
      </div>

      <div class="grid-3" style="margin-bottom: 12px">
        <div class="demo-panel">
          成功响应
          <strong style="display: block; font-size: 20px">{{ successCount }} 笔</strong>
        </div>
        <div class="demo-panel">
          落库已报人数
          <strong style="display: block; font-size: 20px">{{ storedEnrolled }} / {{ capacity }}</strong>
        </div>
        <div class="demo-panel">
          超卖
          <span class="badge" :class="oversold > 0 ? 'error' : 'success'" style="margin-top: 4px">
            {{ oversold > 0 ? \`\${oversold} 个名额\` : '没有超卖' }}
          </span>
        </div>
      </div>

      <div class="log-panel" style="margin-bottom: 12px">
        <p v-for="(line, index) in logs" :key="index" class="log-line" :class="line.tone">
          {{ line.text }}
        </p>
      </div>

      <h4 style="margin: 0 0 8px">🔧 两种锁的写法</h4>
      <pre class="mini-code"><code>{{ sampleCode }}</code></pre>

      <div class="tips-box">
        <strong>事务不等于锁：</strong>把「查名额 → 判断 → 写入」包进事务，只保证这组语句全成或全退，
        并不会阻止两个事务读到同一份旧快照。要消除竞态，必须让读也参与并发控制：悲观锁锁行，
        乐观锁锁版本。锁只在事务提交或回滚时释放，所以事务要尽量短。
      </div>
    </div>
  </div>
</template>
`;export{n as default};
