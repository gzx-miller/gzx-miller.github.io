<script setup lang="ts">
import { ref } from 'vue'

interface Applicant {
  name: string
  score: number
}

const roster: Applicant[] = [
  { name: '松松', score: 88 },
  { name: '阿栗', score: 45 },
  { name: '小枫', score: 92 },
  { name: '果果', score: 60 },
]

const result = ref('点按钮，用循环与跳转筛选报名名单。')

function runLoop() {
  const passed: string[] = []
  for (const person of roster) {
    if (person.score < 60) continue
    passed.push(person.name)
  }
  result.value = `continue 跳过低分，通过名单：${passed.join('、')}。`
}

function runBreak() {
  let firstTop: Applicant | undefined
  for (const person of roster) {
    if (person.score >= 90) {
      firstTop = person
      break
    }
  }
  result.value = firstTop
    ? `break 找到首位 90 分以上：${firstTop.name}（${firstTop.score} 分）。`
    : '没有 90 分以上的报名者。'
}

function runBranch() {
  const labels = roster.map((person) =>
    person.score >= 90 ? `${person.name} 优` : person.score >= 60 ? `${person.name} 合格` : `${person.name} 待定`,
  )
  result.value = `条件分支分档：${labels.join('，')}。`
}
</script>

<template>
  <div class="demo-card">
    <div class="button-row">
      <button @click="runLoop">循环 + continue</button>
      <button @click="runBreak">循环 + break</button>
      <button @click="runBranch">条件分支</button>
    </div>
    <p>{{ result }}</p>
    <small>if/else 决定走哪条路，for...of 负责重复，continue 与 break 控制本轮或整个循环的去留。</small>
  </div>
</template>
