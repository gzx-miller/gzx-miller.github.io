const n=`<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { instantiateWasm } from '../composables/useWasm'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const count = ref(0)
const clicks = ref(0)
const isSab = ref(false)
const isolated = ref(false)
const status = ref('')

let atomicExports: any = null
let sab: SharedArrayBuffer | null = null

onMounted(async () => {
  isolated.value = typeof window !== 'undefined' && window.crossOriginIsolated === true
  try {
    const instance = await instantiateWasm('atomic')
    atomicExports = instance.exports
    sab = instance.exports.memory.buffer as SharedArrayBuffer
    isSab.value = sab instanceof SharedArrayBuffer
    count.value = 0
    status.value = 'atomic 模块已加载：共享内存 + atomicAdd 原子自增'
  } catch (e) {
    status.value = \`加载失败：\${(e as Error).message}（共享内存需要跨源隔离环境）\`
  }
})

// 模拟两个"顾客"同时点赞：用原子指令累加不会丢更新
function like(times: number) {
  if (!atomicExports || !sab) return
  for (let i = 0; i < times; i++) atomicExports.atomicAdd(0)
  // 通过 Int32Array 视图读取当前值（atomicAdd 会自增，不能用来读）
  count.value = new Int32Array(sab)[0]
  clicks.value += times
  status.value = \`atomicAdd 自增 \${times} 次，当前点赞 \${count.value}\`
}

const themeLabel = computed(() => (theme.value === 'light' ? '浅色 🍂' : '深色 🌙'))
<\/script>

<template>
  <div class="demo-card">
    <h3>共享内存与原子操作：并发点赞</h3>
    <p class="desc">
      Wasm 的共享内存（<code>SharedArrayBuffer</code>）可被多个线程同时读写，配合
      <code>atomicAdd</code> 等原子指令保证并发下计数不丢失。下面的点赞数存储在共享内存里。
    </p>

    <div class="toolbar">
      <button @click="toggleTheme">切换主题：{{ themeLabel }}</button>
    </div>

    <div class="like-box">
      <div class="like-count">
        <span>👍 点赞数（存于共享内存）</span>
        <code>{{ count }}</code>
      </div>
      <div class="actions">
        <button @click="like(1)">赞一次</button>
        <button @click="like(100)">连点 100 次</button>
      </div>
    </div>

    <div class="flags">
      <div class="flag" :class="{ ok: isSab }">
        memory.buffer 是 SharedArrayBuffer：{{ isSab ? '是' : '否' }}
      </div>
      <div class="flag" :class="{ ok: isolated }">
        跨源隔离 crossOriginIsolated：{{ isolated ? '已启用' : '未启用' }}
      </div>
    </div>

    <p class="status">{{ status }}</p>

    <div class="tips-box">
      <p><strong>🌰 核心概念：</strong></p>
      <ul>
        <li>普通读写在多线程下会"丢更新"，原子指令保证读-改-写一气呵成</li>
        <li>常用原子操作：<code>atomic.load/store/add/sub</code> 等，还有 <code>wait/notify</code></li>
        <li>共享内存必须在模块声明 <code>shared</code>，否则 buffer 是普通 ArrayBuffer</li>
        <li>SharedArrayBuffer 需要跨源隔离（COOP/COEP 响应头）才能启用</li>
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

.like-box {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 18px;
  display: grid;
  gap: 14px;
  justify-items: center;
}

.like-count {
  text-align: center;
  display: grid;
  gap: 6px;
}

.like-count span {
  color: var(--muted);
  font-size: 13px;
}

.like-count code {
  color: var(--accent-strong);
  font-size: 48px;
  font-weight: 800;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.flags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.flag {
  border-radius: 999px;
  background: var(--surface-soft);
  color: var(--muted);
  padding: 6px 12px;
  font-size: 12px;
}

.flag.ok {
  color: var(--forest);
  background: rgba(107, 176, 70, 0.14);
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
</style>
`;export{n as default};
