const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

const chunkSize = ref(50)
const chunkOverlap = ref(10)

const sourceDoc = \`LangChain.js 是一个用于构建大语言模型应用的开源框架。它提供了模型调用、提示模板、链式调用、RAG 检索增强生成等核心能力。通过 LangChain，开发者可以快速搭建智能问答、文档分析、代码生成等应用。框架支持多种 LLM 提供商，包括 OpenAI、Anthropic、Google 等。\`

interface Chunk {
  index: number
  text: string
  overlapWith: string
}

const chunks = computed<Chunk[]>(() => {
  const result: Chunk[] = []
  const text = sourceDoc
  const size = Math.max(10, chunkSize.value)
  const overlap = Math.min(chunkOverlap.value, Math.floor(size / 2))
  let start = 0
  let index = 0
  while (start < text.length) {
    const end = Math.min(start + size, text.length)
    const chunkText = text.slice(start, end)
    const overlapText = start > 0 ? text.slice(Math.max(0, start - overlap), start) : ''
    result.push({ index: index + 1, text: chunkText, overlapWith: overlapText })
    start += size - overlap
    index++
  }
  return result
})
<\/script>

<template>
  <div class="demo-card">
    <h3>文档切分器</h3>
    <div class="config-row">
      <label>块大小 <input v-model.number="chunkSize" type="number" min="10" max="200" step="10" /></label>
      <label>重叠量 <input v-model.number="chunkOverlap" type="number" min="0" max="50" step="5" /></label>
      <span class="chunk-count">共 {{ chunks.length }} 块</span>
    </div>
    <div class="source-doc">
      <h4>原始文档</h4>
      <p>{{ sourceDoc }}</p>
    </div>
    <div class="chunks-list">
      <h4>切分结果</h4>
      <div v-for="chunk in chunks" :key="chunk.index" class="chunk-item">
        <span class="chunk-index">#{{ chunk.index }}</span>
        <p>
          <span v-if="chunk.overlapWith" class="overlap-text">{{ chunk.overlapWith }}</span>{{ chunk.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.config-row label { display: flex; align-items: center; gap: 6px; font-size: 14px; }
.config-row input { padding: 4px 8px; border: 1px solid #d4a574; border-radius: 4px; width: 80px; }
.chunk-count { font-size: 13px; color: #c8703c; font-weight: bold; }
.source-doc { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 10px; margin-bottom: 12px; }
.source-doc h4 { margin: 0 0 6px; color: #8b5e3c; font-size: 14px; }
.source-doc p { margin: 0; font-size: 13px; line-height: 1.6; color: #5a3e2b; }
.chunks-list h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.chunk-item { display: flex; gap: 8px; padding: 6px 10px; border-radius: 6px; margin-bottom: 4px; background: #fff; border: 1px solid #e8c9a0; }
.chunk-index { font-size: 12px; font-weight: bold; color: #c8703c; min-width: 28px; }
.chunk-item p { margin: 0; font-size: 12px; line-height: 1.5; color: #5a3e2b; }
.overlap-text { background: #fde8d0; border-radius: 2px; padding: 0 2px; }
</style>
`;export{n as default};
