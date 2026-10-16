const n=`<script setup lang="ts">
import { ref } from 'vue'

const courses = [
  { id: 1, title: 'Vue3 组合式 API', tag: '入门' },
  { id: 2, title: 'Pinia 状态管理', tag: '进阶' },
  { id: 3, title: 'uni-app 跨端开发', tag: '实战' },
]

const fav = ref<Set<number>>(new Set())

function toggle(id: number) {
  const next = new Set(fav.value)
  next.has(id) ? next.delete(id) : next.add(id)
  fav.value = next
}
<\/script>

<template>
  <div class="demo-card">
    <p class="lead">
      页面模板直接写 <code>&lt;course-card&gt;</code>，无需 <code>import</code> 与
      <code>components</code> 注册，easycom 按目录约定自动加载。
    </p>

    <div class="list">
      <div
        v-for="c in courses"
        :key="c.id"
        class="card"
        @click="toggle(c.id)"
      >
        <div class="meta">
          <span class="title">{{ c.title }}</span>
          <span class="tag">{{ c.tag }}</span>
        </div>
        <span class="fav">{{ fav.has(c.id) ? '❤️' : '🤍' }}</span>
      </div>
    </div>

    <p class="hint">目录约定：components/course-card/course-card.vue —— 目录名、文件名、标签名三者一致。</p>
  </div>
</template>

<style scoped>
.lead {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}
.lead code {
  border-radius: 5px;
  background: var(--surface-soft);
  color: var(--accent-strong);
  padding: 1px 5px;
}
.list {
  display: grid;
  gap: 10px;
}
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  padding: 12px 14px;
  cursor: pointer;
}
.meta {
  display: flex;
  gap: 8px;
  align-items: center;
}
.title {
  color: var(--text);
  font-weight: 600;
}
.tag {
  border-radius: 999px;
  background: rgba(255, 218, 159, 0.68);
  color: var(--chestnut);
  padding: 2px 8px;
  font-size: 12px;
}
.fav {
  font-size: 18px;
}
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
</style>`;export{n as default};
