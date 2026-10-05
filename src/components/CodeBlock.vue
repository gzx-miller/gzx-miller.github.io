<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'
import cpp from 'highlight.js/lib/languages/cpp'
import glsl from 'highlight.js/lib/languages/glsl'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import scss from 'highlight.js/lib/languages/scss'
import typescript from 'highlight.js/lib/languages/typescript'
import wasm from 'highlight.js/lib/languages/wasm'
import xml from 'highlight.js/lib/languages/xml'
import { computed, ref } from 'vue'

hljs.registerLanguage('css', css)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c++', cpp)
hljs.registerLanguage('glsl', glsl)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('jsx', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('wat', wasm)
hljs.registerLanguage('wasm', wasm)
hljs.registerLanguage('xml', xml)

const props = defineProps<{
  code: string
  language?: string
}>()

// 「关键代码」区展示的是演示组件的**源码原文**（`?raw`）。标记类源码里，作者
// 为了让页面显示字面量的尖括号，必须把源码写成实体，例如：
//
//     <p>给 <code>&lt;Handle&gt;</code> 设置 id 后…</p>
//
// 这是 Vue 模板里唯一正确的写法（直接写 <Handle> 会被解析成组件标签）。
// 但源码被原样搬进代码块后，读者看到的是 `&lt;Handle&gt;`，很像渲染出错。
//
// 这里做一次「一级实体还原」：把 hljs 转义出来的 &amp;lt; 还原成 &lt;，
// 屏幕上就显示成 <Handle> —— 即源码的本意。两点保证它不会歪曲源码：
//   1. 只还原「成对的实体写法」，且 **不产生裸的 < > " &**（还原目标仍是实体），
//      因此不可能被浏览器当成标签解析，也不存在注入风险；
//   2. 还原后字符仍包在 hljs 原生的 <span> 里 —— 实体 token 是 .hljs-symbol
//      （紫），真标签是 .hljs-tag（红），读者依旧能分清「字面文本」与「真标签」。
// 「复制」按钮始终给 props.code 原文，不受影响。
const MARKUP_LANGUAGES = new Set(['vue', 'xml', 'html'])

/** 把一层双重转义收回来：`&amp;lt;` → `&lt;`（显示为 `<`）。单次扫描，不递归。 */
function restoreEntitiesOnce(html: string): string {
  return html.replace(/&amp;(lt|gt|quot|nbsp|amp|#39|#x27);/g, '&$1;')
}

const highlightedCode = computed(() => {
  const language = props.language ?? 'vue'

  const raw = hljs.getLanguage(language)
    ? hljs.highlight(props.code.trim(), { language }).value
    : hljs.highlightAuto(props.code.trim()).value

  // JS/TS 等非标记语言不做还原：那里出现 `'&lt;'` 往往本身就是教学内容
  // （如「HTML 转义」一课），还原反而会把课程示例改错。
  return MARKUP_LANGUAGES.has(language) ? restoreEntitiesOnce(raw) : raw
})

const languageLabel = computed(() => {
  const aliases: Record<string, string> = {
    vue: 'Vue',
    xml: 'HTML',
    javascript: 'JavaScript',
    jsx: 'JSX',
    typescript: 'TypeScript',
    ts: 'TypeScript',
    scss: 'SCSS',
    glsl: 'GLSL',
    wat: 'WAT',
    wasm: 'WAT',
    cpp: 'C++',
    'c++': 'C++',
  }
  const language = props.language ?? 'vue'
  return aliases[language] ?? language.toUpperCase()
})

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code.trim())
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    // 剪贴板不可用时静默失败，不打断阅读
  }
}
</script>

<template>
  <div class="code-block-wrapper">
    <div class="code-block-toolbar">
      <span class="code-block-lang">{{ languageLabel }}</span>
      <button
        class="code-copy-btn"
        type="button"
        :aria-label="copied ? '已复制' : '复制代码'"
        @click="copyCode"
      >
        <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    <pre class="code-block"><code v-html="highlightedCode" /></pre>
  </div>
</template>
