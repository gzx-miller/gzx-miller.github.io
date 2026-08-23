<script setup lang="ts">
import { computed, ref } from 'vue'

const keyword = ref('')
const courses = ['Vue3 组合式 API', 'Pinia 状态管理', 'Nuxt 文件路由', 'uni-app 跨端开发']
const joined = ref<Set<number>>(new Set())
const bubbleMsg = ref('')

const filtered = computed(() =>
  courses.filter((c) => c.toLowerCase().includes(keyword.value.toLowerCase())),
)

function join(id: number) {
  joined.value = new Set(joined.value).add(id)
  bubbleMsg.value = ''
}

function openCourse(c: string) {
  bubbleMsg.value = `冒泡到父级：准备打开「${c}」`
}
</script>

<template>
  <div class="demo-card">
    <div class="bar">
      <input v-model="keyword" placeholder="搜索课程" />
      <span class="count">已报名 {{ joined.size }} 门</span>
    </div>

    <div class="list">
      <div
        v-for="(c, i) in filtered"
        :key="c"
        class="item"
        @click="openCourse(c)"
      >
        <span>{{ c }}</span>
        <button type="button" class="join" @click.stop="join(i)">
          {{ joined.has(i) ? '已报名' : '报名' }}
        </button>
      </div>
      <p v-if="!filtered.length" class="empty">没有匹配的课程。</p>
    </div>

    <p class="bubble">{{ bubbleMsg || '点击「报名」用 @click.stop 阻止冒泡，不触发父级打开详情。' }}</p>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  gap: 10px;
  align-items: center;
}
.bar input {
  flex: 1;
  width: auto;
}
.count {
  color: var(--accent);
  font-size: 13px;
  white-space: nowrap;
}
.list {
  display: grid;
  gap: 8px;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  padding: 10px 12px;
  cursor: pointer;
}
.join {
  background: var(--accent);
  color: #fff;
  padding: 6px 10px;
}
.empty {
  margin: 0;
  color: var(--muted);
}
.bubble {
  margin: 0;
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--muted);
  font-size: 13px;
}
</style>