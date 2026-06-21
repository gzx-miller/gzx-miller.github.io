<script setup lang="ts">
import { ref, computed } from 'vue'

type Lib = 'Pinia' | 'Vuex' | 'Zustand' | 'Redux' | 'Jotai' | 'Valtio'
type Criteria = '体积' | '学习曲线' | 'SSR 支持' | 'TypeScript' | 'DevTools'

const criteria: Criteria[] = ['体积', '学习曲线', 'SSR 支持', 'TypeScript', 'DevTools']
const libs: Lib[] = ['Pinia', 'Vuex', 'Zustand', 'Redux', 'Jotai', 'Valtio']

// 评分矩阵 (1-5)
const scores: Record<Lib, Record<Criteria, number>> = {
  Pinia:   { '体积': 5, '学习曲线': 5, 'SSR 支持': 5, 'TypeScript': 5, 'DevTools': 5 },
  Vuex:    { '体积': 3, '学习曲线': 3, 'SSR 支持': 4, 'TypeScript': 3, 'DevTools': 5 },
  Zustand: { '体积': 5, '学习曲线': 4, 'SSR 支持': 4, 'TypeScript': 4, 'DevTools': 3 },
  Redux:   { '体积': 2, '学习曲线': 2, 'SSR 支持': 5, 'TypeScript': 4, 'DevTools': 5 },
  Jotai:   { '体积': 5, '学习曲线': 4, 'SSR 支持': 3, 'TypeScript': 4, 'DevTools': 3 },
  Valtio:  { '体积': 4, '学习曲线': 4, 'SSR 支持': 3, 'TypeScript': 4, 'DevTools': 3 },
}

const selected = ref<Criteria[]>(['体积', '学习曲线', 'TypeScript'])

function toggle(c: Criteria) {
  const idx = selected.value.indexOf(c)
  if (idx >= 0) selected.value.splice(idx, 1)
  else selected.value.push(c)
}

const ranked = computed(() =>
  libs.map(lib => ({
    lib,
    total: selected.value.reduce((sum, c) => sum + scores[lib][c], 0),
  })).sort((a, b) => b.total - a.total)
)

function scoreColor(s: number) {
  return s >= 5 ? '#2d8a4e' : s >= 4 ? '#5a9e3f' : s >= 3 ? '#c8a020' : '#c0392b'
}
</script>

<template><div class="demo-card">
  <h4>🌰 状态管理方案全景对比</h4>
  <p>选择评估维度:</p>
  <div style="margin-bottom:8px">
    <button v-for="c in criteria" :key="c" @click="toggle(c)"
      :class="{ active: selected.includes(c) }" style="margin:2px">
      {{ c }} {{ selected.includes(c) ? '✓' : '' }}
    </button>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:13px">
    <thead><tr><th style="text-align:left">方案</th><th v-for="c in selected" :key="c">{{ c }}</th><th>总分</th></tr></thead>
    <tbody>
      <tr v-for="r in ranked" :key="r.lib" :style="{ background: r === ranked[0] ? '#f0f8e8' : '' }">
        <td><strong>{{ r.lib }}</strong> {{ r === ranked[0] ? '🏆' : '' }}</td>
        <td v-for="c in selected" :key="c" :style="{ color: scoreColor(scores[r.lib][c]) }">
          {{ '★'.repeat(scores[r.lib][c]) }}{{ '☆'.repeat(5 - scores[r.lib][c]) }}
        </td>
        <td><strong>{{ r.total }}</strong></td>
      </tr>
    </tbody>
  </table>
</div></template>
