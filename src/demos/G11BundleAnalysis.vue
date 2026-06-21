<script setup lang="ts">
import { ref, computed } from 'vue'

interface Chunk {
  name: string
  size: number
  type: 'vendor' | 'app' | 'page' | 'asset'
  children?: Chunk[]
}

const chunks: Chunk[] = [
  {
    name: 'vendor', size: 420, type: 'vendor',
    children: [
      { name: 'vue', size: 130, type: 'vendor' },
      { name: 'element-plus', size: 180, type: 'vendor' },
      { name: 'pinia', size: 45, type: 'vendor' },
      { name: 'vue-router', size: 65, type: 'vendor' },
    ],
  },
  {
    name: 'app', size: 180, type: 'app',
    children: [
      { name: 'main.ts', size: 30, type: 'app' },
      { name: 'layouts', size: 50, type: 'app' },
      { name: 'composables', size: 100, type: 'app' },
    ],
  },
  {
    name: 'pages', size: 220, type: 'page',
    children: [
      { name: '首页', size: 40, type: 'page' },
      { name: '课程详情', size: 90, type: 'page' },
      { name: '搜索结果', size: 90, type: 'page' },
    ],
  },
  {
    name: 'assets', size: 180, type: 'asset',
    children: [
      { name: '图片', size: 140, type: 'asset' },
      { name: '字体', size: 40, type: 'asset' },
    ],
  },
]

const budgetKb = 500
const selectedChunk = ref<Chunk | null>(null)
const expandedGroups = ref<Set<string>>(new Set())

const totalSize = computed(() => chunks.reduce((sum, c) => sum + c.size, 0))
const overBudget = computed(() => totalSize.value > budgetKb)

function toggleGroup(name: string) {
  if (expandedGroups.value.has(name)) {
    expandedGroups.value.delete(name)
  } else {
    expandedGroups.value.add(name)
  }
}

function selectChunk(chunk: Chunk) {
  selectedChunk.value = selectedChunk.value?.name === chunk.name ? null : chunk
}

function chunkPercent(size: number) {
  return Math.round((size / totalSize.value) * 100)
}

const typeColors: Record<string, string> = {
  vendor: '#e8713a',
  app: '#4caf50',
  page: '#2196f3',
  asset: '#9c27b0',
}
</script>

<template>
  <div class="demo-card">
    <p class="demo-hint">构建产物分析帮助定位体积热点。点击分组展开子模块，选中查看详情和拆分建议。</p>

    <div class="budget-bar">
      <div
        v-for="chunk in chunks"
        :key="chunk.name"
        class="budget-segment"
        :style="{ width: chunkPercent(chunk.size) + '%', background: typeColors[chunk.type] }"
        :title="`${chunk.name}: ${chunk.size} KB`"
      ></div>
      <div class="budget-line" :style="{ left: (budgetKb / (totalSize * 1.1)) * 100 + '%' }">
        预算 {{ budgetKb }} KB
      </div>
    </div>

    <p class="total-info" :class="{ over: overBudget }">
      总计 {{ totalSize }} KB · {{ overBudget ? `超出预算 ${totalSize - budgetKb} KB` : '预算内' }}
    </p>

    <ul class="chunk-tree">
      <li v-for="chunk in chunks" :key="chunk.name" class="chunk-group">
        <button class="chunk-toggle" @click="toggleGroup(chunk.name)">
          <span class="toggle-arrow">{{ expandedGroups.has(chunk.name) ? '▾' : '▸' }}</span>
          <span class="chunk-dot" :style="{ background: typeColors[chunk.type] }"></span>
          <strong>{{ chunk.name }}</strong>
          <span class="chunk-size">{{ chunk.size }} KB（{{ chunkPercent(chunk.size) }}%）</span>
        </button>
        <ul v-if="expandedGroups.has(chunk.name) && chunk.children" class="chunk-children">
          <li
            v-for="child in chunk.children"
            :key="child.name"
            class="chunk-child"
            :class="{ selected: selectedChunk?.name === child.name }"
            @click="selectChunk(child)"
          >
            {{ child.name }}
            <span class="child-size">{{ child.size }} KB</span>
            <small v-if="child.size > 100" class="oversized">建议拆分</small>
          </li>
        </ul>
      </li>
    </ul>

    <div v-if="selectedChunk" class="chunk-detail">
      <strong>{{ selectedChunk.name }}</strong> — {{ selectedChunk.size }} KB
      <p v-if="selectedChunk.size > 100" class="split-hint">体积较大，建议通过动态导入或按需加载拆分。</p>
      <p v-else class="split-ok">体积合理，无需拆分。</p>
    </div>
  </div>
</template>

<style scoped>
.budget-bar {
  position: relative;
  display: flex;
  height: 24px;
  border-radius: 4px;
  overflow: visible;
  margin-bottom: 0.3rem;
}

.budget-segment {
  height: 100%;
  transition: opacity 0.2s;
}

.budget-segment:hover { opacity: 0.8; }

.budget-line {
  position: absolute;
  top: -4px;
  bottom: -18px;
  width: 2px;
  background: #e53935;
  font-size: 0.7rem;
  color: #e53935;
  white-space: nowrap;
  padding-top: 26px;
}

.total-info {
  margin: 0.8rem 0;
  font-size: 0.9rem;
}

.total-info.over { color: #e53935; font-weight: 600; }

.chunk-tree {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chunk-group {
  margin-bottom: 0.3rem;
}

.chunk-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem 0;
  font-size: 0.9rem;
  width: 100%;
  text-align: left;
}

.toggle-arrow {
  width: 1rem;
  color: #999;
}

.chunk-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chunk-size {
  margin-left: auto;
  color: #888;
  font-size: 0.8rem;
}

.chunk-children {
  list-style: none;
  padding: 0 0 0 2.2rem;
  margin: 0.2rem 0 0.4rem;
}

.chunk-child {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.15s;
}

.chunk-child:hover { background: rgba(0, 0, 0, 0.04); }
.chunk-child.selected { background: rgba(232, 113, 58, 0.1); }

.child-size {
  margin-left: auto;
  color: #888;
  font-size: 0.8rem;
}

.oversized {
  color: #e53935;
  font-size: 0.75rem;
}

.chunk-detail {
  margin-top: 0.8rem;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.04);
  font-size: 0.9rem;
}

.split-hint { color: #e53935; margin: 0.3rem 0 0; font-size: 0.85rem; }
.split-ok { color: #4caf50; margin: 0.3rem 0 0; font-size: 0.85rem; }
</style>
