<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const nick = ref('小松鼠')

const items = [
  { tag: 'view', role: '块级容器（div）', desc: '划分布局' },
  { tag: 'text', role: '行内文本（span）', desc: '可嵌套、可复制' },
  { tag: 'image', role: '图片（img）', desc: '默认 320×240，需设尺寸' },
  { tag: 'button', role: '按钮', desc: 'size / type / loading' },
  { tag: 'input', role: '输入框', desc: 'type 支持 text/number' },
]
</script>

<template>
  <div class="demo-card">
    <div class="grid">
      <div v-for="it in items" :key="it.tag" class="cell">
        <code class="tag">{{ it.tag }}</code>
        <p class="role">{{ it.role }}</p>
        <p class="desc">{{ it.desc }}</p>
      </div>
    </div>

    <div class="panel">
      <div class="head">
        <div class="avatar">🐿️</div>
        <span class="name">{{ nick }}</span>
      </div>
      <input v-model="nick" placeholder="用 input 输入昵称" />
      <button type="button" @click="count += 1">报名课程 · {{ count }}</button>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}
.cell {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  padding: 12px;
}
.tag {
  border-radius: 6px;
  background: var(--surface-soft);
  color: var(--accent-strong);
  padding: 2px 6px;
  font-size: 12px;
}
.role {
  margin: 8px 0 4px;
  color: var(--text);
  font-size: 14px;
}
.desc {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}
.panel {
  display: grid;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  padding: 14px;
}
.head {
  display: flex;
  gap: 10px;
  align-items: center;
}
.avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #f6c15a, #d94b26);
  font-size: 22px;
}
.name {
  font-weight: 700;
}
.panel input {
  width: auto;
}
</style>