<script setup lang="ts">
import { computed, ref } from 'vue'

const score = ref('86')

const rating = computed(() => {
  const raw = score.value.trim()
  const value = Number(raw)
  if (raw === '' || Number.isNaN(value)) {
    return { level: '—', note: '请输入数字', cls: 'error' }
  }
  if (value >= 90) return { level: 'A', note: '优秀', cls: 'success' }
  else if (value >= 80) return { level: 'B', note: '良好', cls: 'success' }
  else if (value >= 60) return { level: 'C', note: '及格', cls: 'warning' }
  else return { level: 'D', note: '不及格', cls: 'error' }
})

const nums = [3, 1, 4, 1, 5]
const index = ref(0)
const total = ref(0)
const log = ref<string[]>([])
const done = computed(() => index.value >= nums.length)

function stepOnce() {
  if (index.value >= nums.length) return
  const i = index.value
  total.value += nums[i]
  log.value = [...log.value, `第 ${i + 1} 轮：total += nums[${i}]（值 ${nums[i]}）→ total = ${total.value}`]
  index.value = i + 1
}

function runAll() {
  while (index.value < nums.length) stepOnce()
}

function reset() {
  index.value = 0
  total.value = 0
  log.value = []
}
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>条件判断与循环</h4>

      <div class="demo-panel">
        <div class="row">
          <label>分数：</label>
          <input type="number" v-model="score" />
        </div>
        <pre class="mini-code" style="margin-top: 10px;">if score >= 90:    grade = "A"
elif score >= 80:  grade = "B"
elif score >= 60:  grade = "C"
else:              grade = "D"</pre>
        <div class="tips-box">
          score = {{ score === '' ? '—' : score }} → grade =
          <span class="badge" :class="rating.cls">{{ rating.level }}</span>（{{ rating.note }}）
        </div>
      </div>

      <div class="demo-panel" style="margin-top: 16px;">
        <p class="hint">对列表 <code>nums = [3, 1, 4, 1, 5]</code> 做循环累加，可单步观察，也可一次跑完。</p>
        <div class="tab-bar" style="margin-top: 10px;">
          <button class="btn" :disabled="done" @click="stepOnce">单步执行</button>
          <button class="btn" :disabled="done" @click="runAll">一次跑完</button>
          <button class="btn" @click="reset">重置</button>
        </div>
        <pre class="mini-code">total = 0
for x in nums:
    total += x
# 当前 index = {{ index }}，total = {{ total }}</pre>
        <div class="log-panel" style="margin-top: 10px;">
          <p v-if="log.length === 0" class="hint">点击「单步执行」看每一轮的状态。</p>
          <p
            v-for="(line, i) in log"
            :key="i"
            class="log-line"
            :class="{ success: i === log.length - 1 }"
          >
            {{ line }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
