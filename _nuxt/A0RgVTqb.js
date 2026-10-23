const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type LayerKey = 'unit' | 'integration' | 'e2e'
type RunState = 'idle' | 'running' | 'done'

interface TestCase {
  name: string
  status: 'pass' | 'fail'
  duration: string
  note?: string
}

interface LayerInfo {
  key: LayerKey
  name: string
  subtitle: string
  total: number
  passed: number
  duration: string
  share: string
  cases: TestCase[]
  snippet: string
  tip: string
}

const layers: Record<LayerKey, LayerInfo> = {
  unit: {
    key: 'unit',
    name: '单元测试',
    subtitle: '只实例化一个类，边界依赖全部用测试替身',
    total: 24,
    passed: 24,
    duration: '180 ms',
    share: '62%',
    cases: [
      { name: '课程不存在时抛出 NotFoundException', status: 'pass', duration: '12 ms' },
      { name: '创建课程返回持久化后的实体', status: 'pass', duration: '9 ms' },
      { name: '分页参数越界时回落到默认值', status: 'pass', duration: '7 ms' },
      { name: '空标题被 DTO 校验拒绝', status: 'pass', duration: '11 ms' },
    ],
    snippet: \`const moduleRef = await Test.createTestingModule({
  providers: [
    CourseService,
    { provide: CourseRepository, useValue: repoMock },
  ],
}).compile()

service = moduleRef.get(CourseService)\`,
    tip: '不启动 HTTP、不连数据库。只验证 CourseService 的输入与输出，执行一次通常只要几毫秒。',
  },
  integration: {
    key: 'integration',
    name: '集成测试',
    subtitle: '装配真实模块，验证依赖注入与路由映射',
    total: 9,
    passed: 8,
    duration: '1.2 s',
    share: '23%',
    cases: [
      { name: 'CourseModule 能解析 CourseService 的依赖', status: 'pass', duration: '220 ms' },
      { name: 'GET /courses/:id 返回课程详情', status: 'fail', duration: '180 ms', note: 'mock 返回结构与 DTO 不一致，测试及时拦住了契约漂移' },
      { name: 'ConfigModule 读到测试环境变量', status: 'pass', duration: '140 ms' },
    ],
    snippet: \`const moduleRef = await Test.createTestingModule({
  imports: [CourseModule],
})
  .overrideProvider(CourseRepository)
  .useValue(repoMock)
  .compile()

app = moduleRef.createNestApplication()
await app.init()\`,
    tip: 'imports 真实模块，让 DI 容器按生产配置装配；数据库、邮件等外部 IO 仍然替换掉。',
  },
  e2e: {
    key: 'e2e',
    name: 'e2e 测试',
    subtitle: '启动完整应用，用真实 HTTP 请求走完整条链路',
    total: 6,
    passed: 6,
    duration: '4.8 s',
    share: '15%',
    cases: [
      { name: 'POST /courses 创建课程返回 201', status: 'pass', duration: '860 ms' },
      { name: 'GET /courses/999 返回 404', status: 'pass', duration: '410 ms' },
      { name: '未携带凭证访问受保护接口返回 401', status: 'pass', duration: '380 ms' },
    ],
    snippet: \`const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
}).compile()

app = moduleRef.createNestApplication()
await app.init()

await request(app.getHttpServer())
  .get('/courses/42')
  .expect(200)\`,
    tip: '覆盖路由、守卫、管道、过滤器与序列化的组合行为，数量最少但最接近真实用户路径。',
  },
}

const activeLayer = ref<LayerKey>('unit')
const runState = ref<Record<LayerKey, RunState>>({
  unit: 'done',
  integration: 'done',
  e2e: 'done',
})
const runCount = ref<Record<LayerKey, number>>({ unit: 1, integration: 1, e2e: 1 })

const current = computed(() => layers[activeLayer.value])
const passRate = computed(() => Math.round((current.value.passed / current.value.total) * 100))
const layerList = computed(() => [layers.e2e, layers.integration, layers.unit])

function selectLayer(key: LayerKey) {
  activeLayer.value = key
}

function runLayer() {
  const key = activeLayer.value
  if (runState.value[key] === 'running') return
  runState.value = { ...runState.value, [key]: 'running' }
  setTimeout(() => {
    runState.value = { ...runState.value, [key]: 'done' }
    runCount.value = { ...runCount.value, [key]: runCount.value[key] + 1 }
  }, 600)
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3 class="demo-title">🌰 测试金字塔与用例运行</h3>
      <p class="demo-desc">
        切换单元、集成与 e2e 三层，查看用例构成、通过率与耗时，并重新执行当前层。
      </p>

      <div class="demo-panel">
        <h4>测试金字塔（自下而上）</h4>
        <div class="prop-table">
          <table>
            <thead>
              <tr>
                <th>层级</th>
                <th>用例数</th>
                <th>占比</th>
                <th>本层耗时</th>
                <th>关注点</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="layer in layerList" :key="layer.key">
                <td>
                  <strong>{{ layer.name }}</strong>
                  <span class="badge" :class="{ success: layer.key === activeLayer }">{{ layer.key }}</span>
                </td>
                <td>{{ layer.total }}</td>
                <td>{{ layer.share }}</td>
                <td>{{ layer.duration }}</td>
                <td class="hint">{{ layer.subtitle }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="hint" style="margin-top: 8px">
          越往下数量越多、执行越快；越往上越接近真实链路，也越慢、越难定位。
        </p>
      </div>

      <div class="tab-bar" style="margin-top: 16px">
        <button
          v-for="layer in layerList"
          :key="layer.key"
          class="tab-btn"
          :class="{ active: activeLayer === layer.key }"
          @click="selectLayer(layer.key)"
        >
          {{ layer.name }}
        </button>
        <span class="badge" :class="{ warning: runState[activeLayer] === 'running', success: runState[activeLayer] === 'done' }">
          {{ runState[activeLayer] === 'running' ? '执行中…' : \`已执行 \${runCount[activeLayer]} 次\` }}
        </span>
      </div>

      <div class="grid-2">
        <div class="demo-panel">
          <div class="controls" style="justify-content: space-between">
            <h4 style="margin: 0">{{ current.name }}用例</h4>
            <button class="mini-btn" :disabled="runState[activeLayer] === 'running'" @click="runLayer">
              重新运行本层
            </button>
          </div>

          <p class="hint">
            通过 {{ current.passed }} / {{ current.total }}，通过率 {{ passRate }}%，本层耗时 {{ current.duration }}。
          </p>
          <div style="height: 8px; margin: 8px 0 12px; border-radius: 999px; background: var(--demo-surface-soft); overflow: hidden">
            <div :style="{ width: \`\${passRate}%\`, height: '100%', background: 'var(--demo-accent)' }"></div>
          </div>

          <div class="prop-table">
            <table>
              <thead>
                <tr>
                  <th>用例</th>
                  <th>结果</th>
                  <th>耗时</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in current.cases" :key="item.name">
                  <td>
                    {{ item.name }}
                    <div v-if="item.note" class="hint">{{ item.note }}</div>
                  </td>
                  <td>
                    <span class="badge" :class="item.status === 'pass' ? 'success' : 'error'">
                      {{ item.status === 'pass' ? '通过' : '失败' }}
                    </span>
                  </td>
                  <td>{{ item.duration }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="hint" style="margin-top: 8px">仅展示代表性用例，其余 {{ current.total - current.cases.length }} 条已折叠。</p>
        </div>

        <div class="demo-panel">
          <h4>本层测试骨架</h4>
          <pre class="mini-code"><code>{{ current.snippet }}</code></pre>
          <div class="tips-box">
            {{ current.tip }}
          </div>
        </div>
      </div>

      <h4 style="margin-top: 16px">三层如何分工</h4>
      <div class="prop-table">
        <table>
          <thead>
            <tr>
              <th>层级</th>
              <th>启动什么</th>
              <th>替换什么</th>
              <th>能发现什么</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>单元</td>
              <td>单个 Provider</td>
              <td>所有边界依赖</td>
              <td>分支与边界值逻辑</td>
            </tr>
            <tr>
              <td>集成</td>
              <td>一个真实模块</td>
              <td>数据库、第三方服务</td>
              <td>装配错误、参数传递错误</td>
            </tr>
            <tr>
              <td>e2e</td>
              <td>完整应用</td>
              <td>外部系统与测试数据库</td>
              <td>路由、守卫、管道、响应契约</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tips-box">
        <strong>mock 行为而非实现细节：</strong>断言「课程不存在时返回 404」，
        而不是断言仓储方法被调用了两次。前者在重构后仍然有效，后者会让测试和内部实现绑死。
      </div>
    </div>
  </div>
</template>
`;export{n as default};
