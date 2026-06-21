<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import scss from 'highlight.js/lib/languages/scss'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import { computed } from 'vue'

hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('jsx', javascript)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('vue', xml)
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
</script>

<template>
  <pre class="code-block"><code v-html="highlightedCode" /></pre>
</template>
