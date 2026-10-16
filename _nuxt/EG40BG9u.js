const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

type Line = { text: string; type: string }
type Scenario = 'normal' | 'value' | 'key'

const code = \`try:
    value = data[key]            # 可能抛异常的一步
except (ValueError, TypeError) as error:
    print("已捕获:", error)
else:
    print("没有异常:", value)
finally:
    print("无论如何都执行")\`

const flowByScenario: Record<Scenario, Line[]> = {
  normal: [
    { text: "进入 try 块，执行 data[key]", type: '' },
    { text: "顺利取到 value = 42，没有异常", type: '' },
    { text: "跳过 except 块", type: '' },
    { text: "进入 else 块：print('没有异常:', value)", type: 'success' },
    { text: "进入 finally 块：print('无论如何都执行')", type: 'warning' },
    { text: "流程结束", type: '' },
  ],
  value: [
    { text: "进入 try 块，执行 data[key]", type: '' },
    { text: "data[key] 抛出 ValueError（值不合法）", type: 'error' },
    { text: "匹配到 except (ValueError, TypeError)", type: 'success' },
    { text: "执行 except 块：print('已捕获:', error)", type: 'success' },
    { text: "跳过 else 块（else 只在无异常时执行）", type: '' },
    { text: "进入 finally 块：print('无论如何都执行')", type: 'warning' },
    { text: "异常已被处理，流程正常结束", type: '' },
  ],
  key: [
    { text: "进入 try 块，执行 data[key]", type: '' },
    { text: "data[key] 抛出 KeyError", type: 'error' },
    { text: "except (ValueError, TypeError) 不匹配 KeyError，跳过", type: 'warning' },
    { text: "跳过 else 块", type: '' },
    { text: "进入 finally 块：仍然执行清理逻辑", type: 'warning' },
    { text: "异常无人处理，继续向上抛出 KeyError", type: 'error' },
  ],
}

const scenarioLabels: Record<Scenario, string> = {
  normal: '无异常',
  value: '抛 ValueError',
  key: '抛 KeyError',
}

const scenarioKeys: Scenario[] = ['normal', 'value', 'key']

const tab = ref<'flow' | 'match'>('flow')
const scenario = ref<Scenario>('normal')
const step = ref(0)

const steps = computed(() => flowByScenario[scenario.value])
const revealed = computed(() => steps.value.slice(0, step.value))
const done = computed(() => step.value >= steps.value.length)

function pickScenario(next: Scenario) {
  scenario.value = next
  step.value = 0
}

function nextStep() {
  if (step.value < steps.value.length) step.value += 1
}

function reset() {
  step.value = 0
}

const errorTypes = ['ValueError', 'TypeError', 'KeyError', 'ZeroDivisionError']
const chosenError = ref('ValueError')
const matched = computed(() => chosenError.value === 'ValueError' || chosenError.value === 'TypeError')
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>异常处理：流程与类型匹配</h4>

      <div class="tab-bar">
        <button class="tab-btn" :class="{ active: tab === 'flow' }" @click="tab = 'flow'">try/except/else/finally</button>
        <button class="tab-btn" :class="{ active: tab === 'match' }" @click="tab = 'match'">异常类型匹配</button>
      </div>

      <div v-if="tab === 'flow'">
        <pre class="mini-code">{{ code }}</pre>

        <div class="tab-bar" style="margin-top: 10px;">
          <button
            v-for="key in scenarioKeys"
            :key="key"
            class="mini-btn"
            :class="{ active: scenario === key }"
            @click="pickScenario(key)"
          >
            {{ scenarioLabels[key] }}
          </button>
        </div>

        <div class="row">
          <button class="mini-btn" @click="nextStep" :disabled="done">下一步</button>
          <button class="mini-btn" @click="reset">重置</button>
          <span class="badge" :class="done ? 'success' : ''">
            {{ done ? '流程走完' : \`第 \${step} / \${steps.length} 步\` }}
          </span>
        </div>

        <div class="log-panel" style="margin-top: 10px;">
          <p v-for="(line, index) in revealed" :key="index" class="log-line" :class="line.type">{{ line.text }}</p>
          <p v-if="!revealed.length" class="hint">选一种情形，再点「下一步」，逐步走过四个代码块。</p>
        </div>
      </div>

      <div v-else>
        <p class="hint">当前 <code>except</code> 捕获的是 <code>(ValueError, TypeError)</code>，换一种异常看它是否被接住。</p>
        <div class="row" style="margin-top: 10px;">
          <label>抛出的异常：</label>
          <select v-model="chosenError">
            <option v-for="name in errorTypes" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>

        <pre class="mini-code" style="margin-top: 12px;">except (ValueError, TypeError) as error:
    print("已捕获:", error)</pre>

        <div class="detail-box">
          <code>{{ chosenError }}</code> 会被当前 <code>except</code>
          <span class="badge" :class="matched ? 'success' : 'error'">
            {{ matched ? '接住' : '漏掉，继续抛出' }}
          </span>
        </div>
        <div class="tips-box">
          未被匹配的异常不会消失，它会沿调用栈<strong>继续向上传播</strong>，直到某层把它接住，或到达顶层让程序终止。
        </div>
      </div>
    </div>
  </div>
</template>
`;export{e as default};
