<script setup lang="ts">
import { computed, ref } from 'vue'

type VersionId = 'v1' | 'v2'
type Strategy = 'uri' | 'header' | 'media'

interface Endpoint {
  method: 'GET' | 'POST'
  path: string
  summary: string
  deprecated?: boolean
}

interface DtoField {
  name: string
  type: string
  required: boolean
  example: string
  desc: string
}

interface Contract {
  label: string
  status: string
  statusClass: 'success' | 'warning'
  endpoints: Endpoint[]
  dto: DtoField[]
}

const versions: Array<{ id: VersionId; label: string }> = [
  { id: 'v1', label: 'v1 · 过渡期' },
  { id: 'v2', label: 'v2 · 当前版本' },
]

const strategies: Array<{ id: Strategy; label: string; detail: string }> = [
  { id: 'uri', label: 'URI 路径', detail: '版本号写进路径，如 /v2/courses' },
  { id: 'header', label: '请求头', detail: '路径不变，用 X-API-Version 指定版本' },
  { id: 'media', label: '媒体类型', detail: '用 Accept 的 vnd 后缀协商版本' },
]

const contracts: Record<VersionId, Contract> = {
  v1: {
    label: 'v1',
    status: '维护中 · 保留过渡期',
    statusClass: 'warning',
    endpoints: [
      { method: 'GET', path: '/courses/{id}', summary: '按 ID 查询课程详情', deprecated: true },
      { method: 'POST', path: '/courses', summary: '创建课程（v1 字段）', deprecated: true },
    ],
    dto: [
      { name: 'title', type: 'string', required: true, example: 'Vue3 组合式 API 实战', desc: '课程标题，2 到 60 个字符' },
      { name: 'capacity', type: 'integer', required: true, example: '30', desc: '名额上限，最小值为 1' },
    ],
  },
  v2: {
    label: 'v2',
    status: '当前版本',
    statusClass: 'success',
    endpoints: [
      { method: 'GET', path: '/courses/{id}', summary: '按 ID 查询课程详情' },
      { method: 'GET', path: '/courses', summary: '分页查询课程列表' },
      { method: 'POST', path: '/courses', summary: '创建课程（新增 level 与 published）' },
    ],
    dto: [
      { name: 'title', type: 'string', required: true, example: 'Vue3 组合式 API 实战', desc: '课程标题，2 到 60 个字符' },
      { name: 'capacity', type: 'integer', required: true, example: '30', desc: '名额上限，最小值为 1' },
      { name: 'level', type: 'string（枚举）', required: false, example: 'ADVANCED', desc: 'BASIC / INTERMEDIATE / ADVANCED' },
      { name: 'published', type: 'boolean', required: false, example: 'false', desc: '是否立即上架，默认 false' },
    ],
  },
}

const activeVersion = ref<VersionId>('v2')
const activeStrategy = ref<Strategy>('uri')

const current = computed(() => contracts[activeVersion.value])
const currentStrategy = computed(() => strategies.find(item => item.id === activeStrategy.value)!)

function resolvePath(path: string) {
  return activeStrategy.value === 'uri' ? `/${activeVersion.value}${path}` : path
}

const requestExample = computed(() => {
  const path = resolvePath('/courses')
  if (activeStrategy.value === 'header') {
    return `POST ${path}  ·  X-API-Version: ${activeVersion.value.slice(1)}`
  }
  if (activeStrategy.value === 'media') {
    return `POST ${path}  ·  Accept: application/vnd.course.${activeVersion.value}+json`
  }
  return `POST ${path}`
})

const jsonPreview = computed(() => {
  const paths: Record<string, Record<string, unknown>> = {}
  for (const endpoint of current.value.endpoints) {
    const key = resolvePath(endpoint.path)
    paths[key] = {
      ...(paths[key] ?? {}),
      [endpoint.method.toLowerCase()]: {
        summary: endpoint.summary,
        ...(endpoint.deprecated ? { deprecated: true } : {}),
      },
    }
  }
  return JSON.stringify(
    {
      openapi: '3.0.3',
      info: {
        title: '课程平台 API',
        version: activeVersion.value === 'v1' ? '1.0.0' : '2.0.0',
      },
      paths,
    },
    null,
    2,
  )
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3 class="demo-title">🌰 OpenAPI 契约与 API 版本</h3>
      <p class="demo-desc">
        切换 API 版本与版本化策略，查看由控制器和 DTO 装饰器生成的接口契约。
      </p>

      <div class="tab-bar">
        <button
          v-for="version in versions"
          :key="version.id"
          class="tab-btn"
          :class="{ active: activeVersion === version.id }"
          @click="activeVersion = version.id"
        >
          {{ version.label }}
        </button>
        <span class="badge" :class="current.statusClass">{{ current.status }}</span>
      </div>

      <div class="controls">
        <span class="hint">版本化策略：</span>
        <button
          v-for="strategy in strategies"
          :key="strategy.id"
          class="mini-btn"
          :class="{ active: activeStrategy === strategy.id }"
          @click="activeStrategy = strategy.id"
        >
          {{ strategy.label }}
        </button>
        <span class="hint">{{ currentStrategy.detail }}</span>
      </div>

      <div class="tips-box">
        <strong>当前请求形态：</strong><code>{{ requestExample }}</code>
      </div>

      <div class="grid-2" style="margin-top: 16px">
        <div class="demo-panel">
          <h4>接口路径（paths）</h4>
          <div class="prop-table">
            <table>
              <thead>
                <tr>
                  <th>方法</th>
                  <th>路径</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="endpoint in current.endpoints" :key="`${endpoint.method}-${endpoint.path}`">
                  <td>
                    <span class="badge" :class="endpoint.method === 'GET' ? 'success' : 'warning'">
                      {{ endpoint.method }}
                    </span>
                  </td>
                  <td>
                    <code>{{ resolvePath(endpoint.path) }}</code>
                    <span v-if="endpoint.deprecated" class="badge error" style="margin-left: 6px">deprecated</span>
                  </td>
                  <td class="hint">{{ endpoint.summary }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="hint" style="margin-top: 8px">
            {{ activeVersion === 'v1' ? 'v1 仍可用，但新字段只进入 v2，调用方需要安排迁移。' : 'v2 为当前版本，v1 在过渡期内继续提供只读兼容。' }}
          </p>
        </div>

        <div class="demo-panel">
          <h4>DTO 字段契约</h4>
          <div class="prop-table">
            <table>
              <thead>
                <tr>
                  <th>字段</th>
                  <th>类型</th>
                  <th>必填</th>
                  <th>示例</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in current.dto" :key="field.name">
                  <td>
                    <code>{{ field.name }}</code>
                    <div class="hint">{{ field.desc }}</div>
                  </td>
                  <td>{{ field.type }}</td>
                  <td>
                    <span class="badge" :class="field.required ? 'warning' : ''">
                      {{ field.required ? '必填' : '可选' }}
                    </span>
                  </td>
                  <td><code>{{ field.example }}</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h4 style="margin-top: 16px">生成的 OpenAPI 片段</h4>
      <pre class="mini-code"><code>{{ jsonPreview }}</code></pre>

      <div class="tips-box">
        <strong>文档即契约：</strong>契约由装饰器生成，字段改名、类型收窄、枚举删值都会直接反映在文档里。
        把导出的 <code>openapi.json</code> 纳入 CI 比对，破坏性变更必须先升版本再合并。
      </div>
    </div>
  </div>
</template>
