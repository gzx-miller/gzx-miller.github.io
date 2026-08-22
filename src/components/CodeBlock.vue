<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'
import cpp from 'highlight.js/lib/languages/cpp'
import glsl from 'highlight.js/lib/languages/glsl'
import javascript from 'highlight.js/lib/languages/javascript'
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

const highlightedCode = computed(() => {
  const language = props.language ?? 'vue'

  if (hljs.getLanguage(language)) {
    return hljs.highlight(props.code.trim(), { language }).value
  }

  return hljs.highlightAuto(props.code.trim()).value
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
