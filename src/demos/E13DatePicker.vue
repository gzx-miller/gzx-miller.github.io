<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElDatePicker, ElTag } from 'element-plus'

const dateRange = ref<[string, string] | null>(null)

const shortcuts = [
  {
    text: '最近 7 天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 6)
      return [start, end]
    },
  },
  {
    text: '最近 30 天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 29)
      return [start, end]
    },
  },
]

const reportDays = computed(() => {
  if (!dateRange.value) return 0
  const [start, end] = dateRange.value
  return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000) + 1
})

function disableFuture(date: Date) {
  return date.getTime() > Date.now()
}
</script>

<template>
  <div class="demo-card date-demo">
    <div>
      <p class="demo-kicker">运营报表筛选</p>
      <h3>选择统计周期</h3>
    </div>

    <ElDatePicker
      v-model="dateRange"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="YYYY-MM-DD"
      :shortcuts="shortcuts"
      :disabled-date="disableFuture"
      clearable
    />

    <div class="report-summary">
      <span>当前统计范围</span>
      <ElTag :type="dateRange ? 'success' : 'info'">
        {{ dateRange ? `${reportDays} 天` : '尚未选择' }}
      </ElTag>
    </div>

    <p>未来日期不可选，常用周期通过 shortcuts 一键填充。</p>
  </div>
</template>

