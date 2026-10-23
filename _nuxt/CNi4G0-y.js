const n=`<script setup lang="ts">
import { ref } from 'vue'

interface SearchResult {
  id: number
  title: string
  site: string
  date: string
  snippet: string
  duplicateOf?: number
}

const question = ref('LangGraph 1.0 是什么时候发布的？有哪些新特性？')
const running = ref(false)
const phase = ref<'idle' | 'searched' | 'deduped' | 'done'>('idle')
const steps = ref<string[]>([])
const answer = ref('')

const rawResults: SearchResult[] = [
  { id: 1, title: 'LangGraph 1.0 正式发布：官方承诺的稳定版', site: 'langchain.dev', date: '2025-10-18', snippet: '团队宣布 LangGraph 1.0 于 2025 年 10 月 18 日发布，接口趋于稳定……' },
  { id: 2, title: 'LangGraph 1.0 正式发布：官方承诺的稳定版', site: 'technews.cn', date: '2025-10-19', snippet: '（转载）LANGChain 团队发布 LangGraph 1.0……', duplicateOf: 1 },
  { id: 3, title: 'LangGraph 1.0 新特性解析：中间件与 HITL', site: 'blog.example.com', date: '2025-10-20', snippet: '1.0 引入中间件（Middleware）机制，用钩子扩展工作流；人机交互与记忆能力系统化……' },
  { id: 4, title: 'LangGraph 1.0 迁移指南：从 0.6 升级', site: 'docs.langchain.com', date: '2025-10-25', snippet: '官方迁移文档：中间件、人机交互与记忆 API 的变化对照与升级步骤……' },
  { id: 5, title: 'LangGraph 1.0 新特性解析：中间件与 HITL', site: 'copy.example.net', date: '2025-10-21', snippet: '（转载）中间件机制摘要……', duplicateOf: 3 },
]

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  if (running.value) return
  running.value = true
  phase.value = 'idle'
  steps.value = []
  answer.value = ''

  steps.value.push(\`规划搜索词：「\${question.value.includes('发布') ? 'LangGraph 1.0 发布时间 新特性' : question.value}」\`)
  await sleep(620)
  steps.value.push('调用 web_search：返回 5 条结果（含 2 条转载）')
  phase.value = 'searched'
  await sleep(720)

  steps.value.push('去重：按标题指纹合并 2 组转载 → 保留 3 条')
  phase.value = 'deduped'
  await sleep(680)

  steps.value.push('生成带引用回答：只依据检索内容，关键结论标注 [编号]')
  answer.value =
    'LangGraph 1.0 于 2025 年 10 月 18 日发布，是官方承诺接口稳定的版本 [1]。主要新特性包括：引入中间件（Middleware）机制，用钩子函数扩展与定制工作流 [3]；系统化了人机交互（HITL）、记忆与上下文工程能力 [3][4]。'
  phase.value = 'done'
  running.value = false
}
<\/script>

<template>
  <div class="demo-card demo-container">
    <h3>联网搜索、去重与引用回答</h3>
    <p class="demo-desc">
      实时信息不在模型的知识里——它必须「出去查」：规划搜索词、调搜索、去重挑源、再带引用作答。点运行看一次完整流程。
    </p>

    <div class="controls">
      <input v-model="question" type="text" :disabled="running" />
      <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '检索中…' : '运行资讯助手' }}</button>
    </div>

    <div class="grid-2">
      <div class="demo-panel">
        <h4>搜索结果</h4>
        <p v-if="phase === 'idle'" class="hint">尚未检索。</p>
        <div
          v-for="item in rawResults.slice(0, phase === 'idle' ? 0 : 5)"
          :key="item.id"
          class="log-line"
          :class="{ dimmed: item.duplicateOf && phase !== 'searched' }"
        >
          <code>[{{ item.id }}]</code>
          <span>
            <strong>{{ item.title }}</strong>
            <small> · {{ item.site }} · {{ item.date }}</small>
            <br />
            {{ item.snippet }}
          </span>
          <span v-if="item.duplicateOf && phase === 'searched'" class="badge warning">疑似转载 [{{ item.duplicateOf }}]</span>
          <span v-if="item.duplicateOf && phase !== 'searched'" class="badge error">已去重</span>
        </div>
      </div>

      <div class="demo-panel">
        <h4>执行步骤</h4>
        <p v-if="!steps.length" class="hint">尚未运行。</p>
        <p v-for="(step, i) in steps" :key="i" class="log-line">{{ step }}</p>
        <div v-if="answer" class="tips-box">
          <strong>带引用回答：</strong>{{ answer }}
          <p class="hint" style="margin-top: 6px">来源：[1] langchain.dev · [3] blog.example.com · [4] docs.langchain.com</p>
        </div>
      </div>
    </div>
  </div>
</template>
`;export{n as default};
