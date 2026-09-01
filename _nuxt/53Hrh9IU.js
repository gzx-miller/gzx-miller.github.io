const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

// 同一个 counter 二进制，用不同 env.log 实现实例化两次
// 实例 A：收银台明细；实例 B：价格累计
const logsA = ref<string[]>([])
const logsB = ref<string[]>([])
const countA = ref(0)
const countB = ref(0)
const status = ref('')

let a: any = null
let b: any = null

onMounted(async () => {
  try {
    a = (
      await instantiateWasm('counter', {
        env: { log: (v: number) => logsA.value.unshift(\`明细：库存量 \${v}\`) },
      })
    ).exports
    b = (
      await instantiateWasm('counter', {
        env: { log: (v: number) => logsB.value.unshift(\`累计：第 \${v} 件已入账\`) },
      })
    ).exports
    countA.value = a.get()
    countB.value = b.get()
    status.value = '同一份二进制实例化两次：导入的 env.log 实现不同，行为随之不同'
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}\`
  }
})

function tick(target: 'a' | 'b', delta: number) {
  const mod = target === 'a' ? a : b
  const refCount = target === 'a' ? countA : countB
  if (!mod) return
  if (delta > 0) mod.inc()
  else mod.dec()
  refCount.value = mod.get()
  mod.emit() // 触发导入回调
  if (logsA.value.length > 5) logsA.value.pop()
  if (logsB.value.length > 5) logsB.value.pop()
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
<\/script>

<template>
  <div class="demo-card">
    <h3>导入回调：同一模块，两种收银逻辑</h3>
    <p class="desc">
      Wasm 只声明"我需要 <code>env.log</code>"，并不关心实现。把同一个 counter 二进制
      分别注入两种 JS 回调（明细日志、累计入账），就能得到两套完全不同的业务行为——
      这就是导入的威力：宿主决定能力，模块决定流程。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="register">
        <h4>🏪 收银台 A：明细日志</h4>
        <div class="count">{{ countA }}</div>
        <div class="actions">
          <button @click="tick('a', 1)">➕ 入库</button>
          <button @click="tick('a', -1)">➖ 出库</button>
        </div>
        <ul class="log">
          <li v-for="(line, i) in logsA" :key="i">{{ line }}</li>
          <li v-if="logsA.length === 0" class="empty">等待 emit() 触发回调…</li>
        </ul>
      </div>

      <div class="register">
        <h4>🛒 收银台 B：价格累计</h4>
        <div class="count">{{ countB }}</div>
        <div class="actions">
          <button @click="tick('b', 1)">➕ 加购</button>
          <button @click="tick('b', -1)">➖ 取消</button>
        </div>
        <ul class="log">
          <li v-for="(line, i) in logsB" :key="i">{{ line }}</li>
          <li v-if="logsB.length === 0" class="empty">等待 emit() 触发回调…</li>
        </ul>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>导入函数的签名必须与模块声明一致，否则实例化会失败</li>
        <li>回调是同步调用，可在其中做日志、状态更新、发送消息</li>
        <li>同一二进制 + 不同导入 = 可复用、可测试的模块设计</li>
        <li>大量高频回调会带来 JS↔Wasm 边界开销，性能敏感处应批量传递</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.desc {
  color: var(--muted);
  line-height: 1.7;
}

.toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.register {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 14px;
  display: grid;
  gap: 12px;
  align-content: start;
}

.count {
  font-size: 42px;
  font-weight: 800;
  color: var(--accent-strong);
  text-align: center;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.log {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
  min-height: 96px;
}

.log li {
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 6px 10px;
  color: var(--text);
  font-size: 12px;
}

.log .empty {
  color: var(--muted);
  background: none;
  font-size: 13px;
}

.status {
  color: var(--muted);
  font-size: 13px;
}

.tips-box {
  border-radius: 8px;
  background: rgba(255, 218, 159, 0.24);
  padding: 12px 16px;
}

.tips-box ul {
  margin: 6px 0 0;
  padding-left: 20px;
  color: var(--muted);
  line-height: 1.8;
}

@media (max-width: 720px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
`;export{n as default};
