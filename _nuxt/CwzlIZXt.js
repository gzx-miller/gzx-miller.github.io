const t=`<script setup lang="ts">
import { ref, computed } from 'vue'
import { defineStore, storeToRefs, setActivePinia, createPinia } from 'pinia'

interface Task {
  id: number
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  tag: string
}

const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([
    { id: 1, title: '收集枫叶标本', completed: true, priority: 'low', tag: '自然' },
    { id: 2, title: '准备秋季野餐', completed: false, priority: 'medium', tag: '生活' },
    { id: 3, title: '写秋日散文', completed: false, priority: 'high', tag: '创作' },
  ])

  const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
  const pendingCount = computed(() => tasks.value.filter(t => !t.completed).length)
  const highPriorityTasks = computed(() => tasks.value.filter(t => t.priority === 'high' && !t.completed))
  const completionRate = computed(() => {
    if (tasks.value.length === 0) return 0
    return Math.round((completedCount.value / tasks.value.length) * 100)
  })

  function addTask(title: string, priority: Task['priority'] = 'medium', tag: string = '其他') {
    if (!title.trim()) return
    tasks.value.push({
      id: Date.now(),
      title: title.trim(),
      completed: false,
      priority,
      tag,
    })
  }

  function toggleTask(id: number) {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.completed = !task.completed
  }

  function removeTask(id: number) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx > -1) tasks.value.splice(idx, 1)
  }

  function clearCompleted() {
    tasks.value = tasks.value.filter(t => !t.completed)
  }

  return { tasks, completedCount, pendingCount, highPriorityTasks, completionRate, addTask, toggleTask, removeTask, clearCompleted }
})

setActivePinia(createPinia())
const store = useTaskStore()
const { tasks, completedCount, pendingCount, highPriorityTasks, completionRate } = storeToRefs(store)

interface TestResult {
  name: string
  passed: boolean
  message: string
}

const testResults = ref<TestResult[]>([])
const isRunning = ref(false)
const newTaskTitle = ref('')
const newTaskPriority = ref<Task['priority']>('medium')
const newTaskTag = ref('生活')
const filterPriority = ref<'all' | 'low' | 'medium' | 'high'>('all')
const showCode = ref(false)

const filteredTasks = computed(() => {
  if (filterPriority.value === 'all') return tasks.value
  return tasks.value.filter(t => t.priority === filterPriority.value)
})

function addTask() {
  store.addTask(newTaskTitle.value, newTaskPriority.value, newTaskTag.value)
  newTaskTitle.value = ''
}

async function runTests() {
  isRunning.value = true
  testResults.value = []

  const testStore = useTaskStore()
  testStore.$reset()
  await delay(200)

  await runTest('addTask: 添加任务后数量增加', () => {
    const before = testStore.tasks.length
    testStore.addTask('测试任务', 'medium', '测试')
    if (testStore.tasks.length !== before + 1) throw new Error(\`期望 \${before + 1} 个任务，实际 \${testStore.tasks.length}\`)
  })

  await delay(150)

  await runTest('addTask: 空标题不添加任务', () => {
    const before = testStore.tasks.length
    testStore.addTask('   ', 'medium')
    if (testStore.tasks.length !== before) throw new Error('空标题不应添加任务')
  })

  await delay(150)

  await runTest('toggleTask: 切换任务完成状态', () => {
    testStore.addTask('切换测试', 'low')
    const task = testStore.tasks[testStore.tasks.length - 1]
    const before = task.completed
    testStore.toggleTask(task.id)
    if (task.completed === before) throw new Error('任务状态未切换')
  })

  await delay(150)

  await runTest('removeTask: 删除指定任务', () => {
    testStore.addTask('待删除', 'low')
    const id = testStore.tasks[testStore.tasks.length - 1].id
    const before = testStore.tasks.length
    testStore.removeTask(id)
    if (testStore.tasks.length !== before - 1) throw new Error('任务未被删除')
    if (testStore.tasks.find(t => t.id === id)) throw new Error('已删除任务仍存在')
  })

  await delay(150)

  await runTest('clearCompleted: 清除已完成任务', () => {
    testStore.$reset()
    testStore.addTask('任务1', 'low')
    testStore.addTask('任务2', 'low')
    testStore.toggleTask(testStore.tasks[0].id)
    const before = testStore.tasks.length
    testStore.clearCompleted()
    if (testStore.tasks.length !== before - 1) throw new Error('已完成任务未清除')
    if (testStore.tasks.some(t => t.completed)) throw new Error('仍有已完成任务')
  })

  await delay(150)

  await runTest('completedCount: 正确统计已完成数量', () => {
    testStore.$reset()
    testStore.addTask('A', 'low')
    testStore.addTask('B', 'low')
    testStore.addTask('C', 'low')
    testStore.toggleTask(testStore.tasks[0].id)
    testStore.toggleTask(testStore.tasks[1].id)
    if (testStore.completedCount !== 2) throw new Error(\`期望 2，实际 \${testStore.completedCount}\`)
  })

  await delay(150)

  await runTest('completionRate: 正确计算完成率', () => {
    testStore.$reset()
    testStore.addTask('X', 'low')
    testStore.addTask('Y', 'low')
    testStore.toggleTask(testStore.tasks[0].id)
    if (testStore.completionRate !== 50) throw new Error(\`期望 50%，实际 \${testStore.completionRate}%\`)
  })

  await delay(150)

  await runTest('highPriorityTasks: 正确筛选高优先级待办', () => {
    testStore.$reset()
    testStore.addTask('高优1', 'high')
    testStore.addTask('中优', 'medium')
    testStore.addTask('高优2', 'high')
    testStore.toggleTask(testStore.tasks[0].id)
    if (testStore.highPriorityTasks.length !== 1) throw new Error(\`期望 1 个高优待办，实际 \${testStore.highPriorityTasks.length}\`)
  })

  isRunning.value = false
}

async function runTest(name: string, fn: () => void) {
  try {
    fn()
    testResults.value.push({ name, passed: true, message: '通过 ✓' })
  } catch (e: any) {
    testResults.value.push({ name, passed: false, message: e.message })
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const passedCount = computed(() => testResults.value.filter(r => r.passed).length)
const failedCount = computed(() => testResults.value.filter(r => !r.passed).length)

const priorityColor = (p: string) => ({
  low: '#16a34a', medium: '#d97706', high: '#dc2626'
} as any)[p] || '#7c563f'

const priorityLabel = (p: string) => ({
  low: '低', medium: '中', high: '高'
} as any)[p] || p
<\/script>

<template>
  <div class="demo-card">
    <h4>🧪 Pinia Store 单元测试</h4>
    <p>秋日待办清单 — 演示如何为 Pinia Store 编写单元测试</p>

    <div class="task-app">
      <div class="task-stats">
        <div class="stat-item">
          <span class="stat-num">{{ tasks.length }}</span>
          <span class="stat-label">总任务</span>
        </div>
        <div class="stat-item done">
          <span class="stat-num">{{ completedCount }}</span>
          <span class="stat-label">已完成</span>
        </div>
        <div class="stat-item pending">
          <span class="stat-num">{{ pendingCount }}</span>
          <span class="stat-label">待完成</span>
        </div>
        <div class="stat-item rate">
          <span class="stat-num">{{ completionRate }}%</span>
          <span class="stat-label">完成率</span>
        </div>
      </div>

      <div class="task-input">
        <input v-model="newTaskTitle" placeholder="添加秋日待办..." @keyup.enter="addTask" />
        <select v-model="newTaskPriority">
          <option value="low">低优先级</option>
          <option value="medium">中优先级</option>
          <option value="high">高优先级</option>
        </select>
        <input v-model="newTaskTag" placeholder="标签" style="width: 80px" />
        <button @click="addTask">添加</button>
      </div>

      <div class="filter-row">
        <button
          v-for="p in ['all', 'low', 'medium', 'high']"
          :key="p"
          :class="{ active: filterPriority === p }"
          class="filter-btn"
          @click="filterPriority = p as any"
        >
          {{ p === 'all' ? '全部' : priorityLabel(p) + '优先级' }}
        </button>
        <button class="clear-btn" @click="store.clearCompleted()">清除已完成</button>
      </div>

      <div class="task-list">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed }"
        >
          <input type="checkbox" :checked="task.completed" @change="store.toggleTask(task.id)" />
          <span class="task-title">{{ task.title }}</span>
          <span class="task-tag">{{ task.tag }}</span>
          <span class="task-priority" :style="{ color: priorityColor(task.priority) }">
            {{ priorityLabel(task.priority) }}优
          </span>
          <button class="delete-btn" @click="store.removeTask(task.id)">×</button>
        </div>
      </div>
    </div>

    <div class="test-section">
      <div class="test-header">
        <h5>🧪 测试运行器</h5>
        <button @click="runTests" :disabled="isRunning">
          {{ isRunning ? '运行中...' : '运行测试' }}
        </button>
      </div>

      <div v-if="testResults.length" class="test-summary">
        <span class="pass">✓ {{ passedCount }} 通过</span>
        <span class="fail">✗ {{ failedCount }} 失败</span>
        <span class="total">共 {{ testResults.length }} 个测试</span>
      </div>

      <div v-if="testResults.length" class="test-list">
        <div
          v-for="(result, idx) in testResults"
          :key="idx"
          class="test-item"
          :class="{ pass: result.passed, fail: !result.passed }"
        >
          <span class="test-icon">{{ result.passed ? '✓' : '✗' }}</span>
          <div class="test-info">
            <span class="test-name">{{ result.name }}</span>
            <span v-if="!result.passed" class="test-msg">{{ result.message }}</span>
          </div>
        </div>
      </div>

      <p v-else class="test-empty">点击"运行测试"查看 Store 单元测试结果</p>
    </div>

    <div class="code-toggle">
      <button @click="showCode = !showCode">{{ showCode ? '收起代码' : '查看测试代码' }}</button>
    </div>

    <div v-if="showCode" class="code-block">
      <pre><code>// Vitest + Pinia 单元测试示例
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from './task'

describe('Task Store', () =&gt; {
  beforeEach(() =&gt; {
    setActivePinia(createPinia())
  })

  it('addTask: 添加任务后数量增加', () =&gt; {
    const store = useTaskStore()
    const before = store.tasks.length
    store.addTask('测试任务', 'medium', '测试')
    expect(store.tasks.length).toBe(before + 1)
  })

  it('addTask: 空标题不添加任务', () =&gt; {
    const store = useTaskStore()
    const before = store.tasks.length
    store.addTask('   ', 'medium')
    expect(store.tasks.length).toBe(before)
  })

  it('toggleTask: 切换任务完成状态', () =&gt; {
    const store = useTaskStore()
    store.addTask('切换测试', 'low')
    const task = store.tasks[0]
    const before = task.completed
    store.toggleTask(task.id)
    expect(task.completed).toBe(!before)
  })

  it('removeTask: 删除指定任务', () =&gt; {
    const store = useTaskStore()
    store.addTask('待删除', 'low')
    const id = store.tasks[0].id
    const before = store.tasks.length
    store.removeTask(id)
    expect(store.tasks.length).toBe(before - 1)
    expect(store.tasks.find(t =&gt; t.id === id)).toBeUndefined()
  })

  it('completedCount: 正确统计已完成数量', () =&gt; {
    const store = useTaskStore()
    store.addTask('A', 'low')
    store.addTask('B', 'low')
    store.toggleTask(store.tasks[0].id)
    expect(store.completedCount).toBe(1)
  })

  it('completionRate: 正确计算完成率', () =&gt; {
    const store = useTaskStore()
    store.addTask('X', 'low')
    store.addTask('Y', 'low')
    store.toggleTask(store.tasks[0].id)
    expect(store.completionRate).toBe(50)
  })
})</code></pre>
    </div>

    <div class="knowledge-points">
      <h5>💡 知识点</h5>
      <ul>
        <li><strong>setActivePinia</strong>：测试前需创建并激活独立的 Pinia 实例</li>
        <li><strong>$reset()</strong>：Setup Store 需自定义 reset 方法或手动重置状态</li>
        <li><strong>测试 Getters</strong>：直接访问 computed 属性验证计算结果</li>
        <li><strong>测试 Actions</strong>：调用 action 后断言状态变更正确</li>
        <li><strong>异步测试</strong>：异步 action 使用 async/await，确保状态更新完成再断言</li>
        <li><strong>最佳实践</strong>：每个测试用例使用独立 Store 实例，避免状态污染</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.task-app {
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff1d8, #ffe6c0);
  border: 1px solid #efc48d;
}

.task-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}
.stat-item {
  text-align: center;
  padding: 10px 6px;
  border-radius: 8px;
  background: #fffaf2;
}
.stat-item.done { background: #dcfce7; }
.stat-item.pending { background: #fef3c7; }
.stat-item.rate { background: linear-gradient(135deg, #f08a24, #d94b26); color: #fff; }
.stat-num { display: block; font-size: 20px; font-weight: 800; color: #7b351d; }
.stat-item.rate .stat-num { color: #fff; }
.stat-label { font-size: 11px; color: #9c7a5f; }
.stat-item.rate .stat-label { color: #fff0e0; }

.task-input {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}
.task-input input:first-child { flex: 1; }
.task-input select { width: auto; padding: 8px; }

.filter-row {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 5px 12px !important;
  font-size: 12px !important;
  border-radius: 999px !important;
  background: #fff !important;
  color: #7c563f !important;
  border: 1px solid #efc48d !important;
}
.filter-btn.active {
  background: linear-gradient(135deg, #f08a24, #d94b26) !important;
  color: #fff !important;
  border-color: #b7431f !important;
}
.clear-btn {
  margin-left: auto;
  padding: 5px 12px !important;
  font-size: 12px !important;
}

.task-list { display: grid; gap: 6px; }
.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  transition: all 0.2s;
}
.task-item.completed { opacity: 0.6; }
.task-item.completed .task-title { text-decoration: line-through; }
.task-title { flex: 1; font-size: 13px; color: #5a3d2b; }
.task-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fff1d8;
  color: #7b351d;
}
.task-priority { font-size: 12px; font-weight: 600; min-width: 36px; text-align: right; }
.delete-btn {
  width: 24px; height: 24px;
  padding: 0 !important;
  border-radius: 50% !important;
  font-size: 16px !important;
  background: transparent !important;
  color: #dc2626 !important;
  border: 1px solid #dc2626 !important;
  opacity: 0;
  transition: opacity 0.2s;
}
.task-item:hover .delete-btn { opacity: 1; }

.test-section {
  margin-top: 16px;
  padding: 16px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
}
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.test-header h5 { margin: 0; color: #7b351d; }

.test-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 8px;
  background: #fff8e8;
  font-size: 13px;
}
.test-summary .pass { color: #16a34a; font-weight: 700; }
.test-summary .fail { color: #dc2626; font-weight: 700; }
.test-summary .total { color: #7c563f; margin-left: auto; }

.test-list { display: grid; gap: 6px; max-height: 280px; overflow-y: auto; }
.test-item {
  display: flex;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
}
.test-item.pass { background: #f0fdf4; border: 1px solid #bbf7d0; }
.test-item.fail { background: #fef2f2; border: 1px solid #fecaca; }
.test-icon { font-weight: 700; }
.test-item.pass .test-icon { color: #16a34a; }
.test-item.fail .test-icon { color: #dc2626; }
.test-info { flex: 1; }
.test-name { color: #5a3d2b; font-weight: 500; }
.test-msg { display: block; font-size: 12px; color: #dc2626; margin-top: 2px; }

.test-empty { text-align: center; color: #9c7a5f; padding: 20px 0; margin: 0; }

.code-toggle { text-align: center; }
.code-block pre { margin: 0; }
.code-block code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #7b351d;
}

.knowledge-points {
  padding: 14px 18px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f0f8e8, #e0eec8);
  border-left: 4px solid #4b6d33;
}
.knowledge-points h5 { margin: 0 0 8px; color: #4b6d33; }
.knowledge-points ul { margin: 0; padding-left: 20px; }
.knowledge-points li { font-size: 13px; color: #5a6d40; line-height: 1.7; }
.knowledge-points code {
  background: #fffaf2;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #b7431f;
}
</style>
`;export{t as default};
