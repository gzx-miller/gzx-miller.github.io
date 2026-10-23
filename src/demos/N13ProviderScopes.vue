<script setup lang="ts">
import { computed, ref } from 'vue'

type ScopeKind = 'singleton' | 'request' | 'transient'

interface InjectionRow {
  request: string
  consumer: string
  instanceId: string
  reused: boolean
}

const scope = ref<ScopeKind>('singleton')
const run = ref(1)

const scopeOptions = [
  { value: 'singleton' as const, label: 'Singleton（默认）' },
  { value: 'request' as const, label: 'Request' },
  { value: 'transient' as const, label: 'Transient' },
]

const scopeIntro: Record<ScopeKind, string> = {
  singleton: '容器在启动时创建唯一实例，之后所有请求、所有注入方都复用这一个。',
  request: '每个请求创建一份实例，同一请求内被多处注入时共享，请求结束即释放。',
  transient: '每次被注入都创建新实例，两个消费者各拿一份，彼此不共享。',
}

const rows = computed<InjectionRow[]>(() => {
  const result: InjectionRow[] = []
  const consumers = ['OrderService', 'ReportService']

  for (let requestIndex = 1; requestIndex <= 2; requestIndex++) {
    consumers.forEach((consumer, consumerIndex) => {
      let instanceId = 'audit#1'
      let reused = true

      if (scope.value === 'request') {
        instanceId = `audit#R${run.value}-${requestIndex}`
        reused = consumerIndex > 0
      } else if (scope.value === 'transient') {
        instanceId = `audit#T${run.value}-${(requestIndex - 1) * 2 + consumerIndex + 1}`
        reused = false
      }

      result.push({
        request: `第 ${requestIndex} 次请求`,
        consumer,
        instanceId,
        reused,
      })
    })
  }

  return result
})

const distinctCount = computed(() => new Set(rows.value.map((row) => row.instanceId)).size)

function selectScope(next: ScopeKind) {
  scope.value = next
  run.value = 1
}

const sampleCode = `@Injectable({ scope: Scope.REQUEST })
export class AuditLogger {
  constructor(@Inject(REQUEST) request: Request) {}

  write(action: string) {
    // 每次请求拿到自己的 request 对象
    console.log(request.headers['x-request-id'], action)
  }
}`
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3>🌰 Provider 作用域与实例复用</h3>
      <p class="hint" style="margin-bottom: 12px">
        假设 <code>OrderService</code> 与 <code>ReportService</code> 都注入了同一个 <code>AuditLogger</code>。
        切换作用域后模拟两次请求，观察四行注入结果里的实例 ID。
      </p>

      <div class="tab-bar">
        <button
          v-for="option in scopeOptions"
          :key="option.value"
          class="tab-btn"
          :class="{ active: scope === option.value }"
          @click="selectScope(option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <p class="status-panel">{{ scopeIntro[scope] }}</p>

      <div class="controls" style="margin-top: 12px">
        <button class="mini-btn" @click="run += 1">模拟两次请求（第 {{ run }} 轮）</button>
        <span class="badge">不同实例：{{ distinctCount }} 个</span>
      </div>

      <div class="prop-table">
        <table>
          <thead>
            <tr>
              <th>请求</th>
              <th>注入方</th>
              <th>AuditLogger 实例 ID</th>
              <th>是否复用</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="index">
              <td>{{ row.request }}</td>
              <td>{{ row.consumer }}</td>
              <td><code>{{ row.instanceId }}</code></td>
              <td>
                <span class="badge" :class="row.reused ? 'success' : 'warning'">
                  {{ row.reused ? '复用同一实例' : '新实例' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 style="margin: 16px 0 8px">🔧 请求作用域的声明写法</h4>
      <pre class="mini-code"><code>{{ sampleCode }}</code></pre>

      <div class="tips-box">
        <strong>作用域会冒泡：</strong>如果单例的 <code>EnrollmentService</code> 注入了请求作用域的
        <code>RequestContextService</code>，它自己也会被容器按请求创建；链上越靠近请求入口的消费者，
        越容易被一并变成请求作用域。实例 ID 不复用不是 bug，而是作用域选择的直接结果。
      </div>
    </div>
  </div>
</template>
