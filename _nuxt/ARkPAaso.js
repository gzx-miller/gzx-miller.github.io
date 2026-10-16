const n=`<script setup lang="ts">
import { computed, ref } from 'vue'

type Mode = 'finite' | 'infinite'

const codeByMode: Record<Mode, string> = {
  finite: \`def countdown(n):
    while n > 0:
        yield n         # 每次 next() 在此暂停并吐出一个值
        n -= 1

gen = countdown(5)\`,
  infinite: \`def count():
    n = 1
    while True:
        yield n         # 不占内存：只保留当前状态
        n += 1

gen = count()\`,
}

const finiteSeq = [5, 4, 3, 2, 1]

const mode = ref<Mode>('finite')
const finiteProduced = ref<number[]>([])
const infiniteProduced = ref<number[]>([])
const message = ref('点击「next(gen)」让生成器吐出下一个值。')

const produced = computed(() =>
  mode.value === 'finite' ? finiteProduced.value : infiniteProduced.value,
)
const exhausted = computed(() => mode.value === 'finite' && finiteProduced.value.length >= finiteSeq.length)

function nextValue() {
  if (mode.value === 'finite') {
    const index = finiteProduced.value.length
    if (index >= finiteSeq.length) {
      message.value = '再次调用 next() 会抛出 StopIteration：生成器已耗尽。'
      return
    }
    finiteProduced.value = [...finiteProduced.value, finiteSeq[index]]
    message.value = \`产出：\${finiteSeq[index]}\`
  } else {
    const next = infiniteProduced.value.length + 1
    infiniteProduced.value = [...infiniteProduced.value, next]
    message.value = \`产出：\${next}（序列无限，永远不会有 StopIteration）\`
  }
}

function switchMode(next: Mode) {
  mode.value = next
  message.value = '点击「next(gen)」让生成器吐出下一个值。'
}

function reset() {
  if (mode.value === 'finite') finiteProduced.value = []
  else infiniteProduced.value = []
  message.value = '已重置，生成器回到起点。'
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>生成器：惰性产出与耗尽</h4>
      <p class="hint">生成器不会一次算出所有值，而是每次 <code>next()</code> 才算一个。</p>

      <div class="tab-bar" style="margin-top: 10px;">
        <button class="tab-btn" :class="{ active: mode === 'finite' }" @click="switchMode('finite')">有限生成器</button>
        <button class="tab-btn" :class="{ active: mode === 'infinite' }" @click="switchMode('infinite')">无限生成器</button>
      </div>

      <pre class="mini-code">{{ codeByMode[mode] }}</pre>

      <div class="row" style="margin-top: 10px;">
        <button class="mini-btn active" @click="nextValue">next(gen)</button>
        <button class="mini-btn" @click="reset">重置</button>
        <span class="badge" :class="exhausted ? 'warning' : (produced.length ? 'success' : '')">
          {{ exhausted ? '已耗尽' : \`已产出 \${produced.length} 个\` }}
        </span>
      </div>

      <div class="detail-box">
        已产出序列：<code>[{{ produced.join(', ') }}]</code>
      </div>
      <div class="tips-box">{{ message }}</div>

      <p class="hint" style="margin-top: 10px;">
        无限生成器 <code>count()</code> 之所以可行，是因为它只保存「当前到几」这一个状态，
        用到第几个才算第几个，内存占用几乎不随产出数量增长。
      </p>
    </div>
  </div>
</template>
`;export{n as default};
