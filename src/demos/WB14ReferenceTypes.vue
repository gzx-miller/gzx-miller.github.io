<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const status = ref('')
const isSame = ref<boolean | null>(null)
const member = ref({
  name: '小松果',
  level: '金卡',
  points: 1280,
})

let externExports: any = null

onMounted(async () => {
  try {
    const instance = await instantiateWasm('extern')
    externExports = instance.exports
    status.value = 'extern 模块已加载：导出 identity 函数（externref 直通）'
    testIdentity()
  } catch (e) {
    status.value = `加载失败：${(e as Error).message}`
  }
})

// 把 JS 对象作为 externref 传入 Wasm 再原样返回
function testIdentity() {
  if (!externExports) return
  const returned = externExports.identity(member.value)
  isSame.value = returned === member.value
  status.value = isSame.value
    ? 'identity(member) 返回了同一个引用：externref 不复制对象'
    : '返回了不同对象（不符合预期）'
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
</script>

<template>
  <div class="demo-card">
    <h3>引用类型 externref：会员对象原样传递</h3>
    <p class="desc">
      值类型（i32 等）跨边界会复制，而 <code>externref</code> 允许 Wasm 持有并传回一个
      JS 对象的引用而不复制它。适合传 DOM 节点、缓存句柄、回调上下文等。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="layout">
      <div class="panel">
        <h4>🎫 会员卡对象（JS 侧）</h4>
        <div class="member-card">
          <strong>{{ member.name }}</strong>
          <span>{{ member.level }}</span>
          <p>积分 {{ member.points }}</p>
        </div>
        <button @click="testIdentity">🔄 传入 Wasm 并返回</button>
      </div>

      <div class="panel">
        <h4>✅ 结果判定</h4>
        <div class="result-badge" :class="{ ok: isSame === true, fail: isSame === false }">
          {{ isSame === null ? '尚未执行' : isSame ? '引用完全一致' : '引用不一致' }}
        </div>
        <ul class="ref-types">
          <li><strong>externref</strong>：可引用任意 JS 对象（Opaque）</li>
          <li><strong>funcref</strong>：只能引用 Wasm/JS 函数，用于函数表</li>
        </ul>
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>externref 不拷贝数据，只传递"句柄"，避免大对象跨边界复制</li>
        <li>引用类型出现后，函数表元素也被统一为 <code>funcref</code></li>
        <li>Wasm 不能直接读写 externref 指向对象的内部，需回调 JS 完成操作</li>
        <li>WasmGC 提案进一步让 Wasm 直接操作结构体/数组对象</li>
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

.panel {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 14px;
  display: grid;
  gap: 12px;
  align-content: start;
}

.member-card {
  border-radius: 8px;
  background: linear-gradient(135deg, var(--leaf-gold), var(--leaf-orange));
  padding: 14px;
  display: grid;
  gap: 4px;
  color: #5b2a0f;
}

.member-card p {
  margin: 0;
}

.result-badge {
  border-radius: 8px;
  background: var(--surface-soft);
  padding: 14px;
  text-align: center;
  font-weight: 600;
  color: var(--muted);
}

.result-badge.ok {
  background: rgba(107, 176, 70, 0.16);
  color: var(--forest);
}

.result-badge.fail {
  background: rgba(217, 75, 38, 0.16);
  color: var(--leaf-red);
}

.ref-types {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.9;
  font-size: 13px;
}

.status {
  margin: 0;
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
