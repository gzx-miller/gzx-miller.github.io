const n=`<script setup lang="ts">
import { ref } from 'vue'

const loaded = ref<string[]>([])

const subPackages = [
  { root: 'pages-mine', pages: ['mine'], preload: true, size: '128KB' },
  { root: 'pages-order', pages: ['order-list', 'order-detail'], preload: false, size: '256KB' },
]

function enter(root: string) {
  if (!loaded.value.includes(root)) loaded.value.push(root)
}
<\/script>

<template>
  <div class="demo-card">
    <div class="main">
      <div class="pkg-head">主包（启动即加载）</div>
      <div class="pages">
        <span>首页</span>
        <span>课程详情</span>
      </div>
    </div>

    <div class="subs">
      <div
        v-for="p in subPackages"
        :key="p.root"
        class="sub"
      >
        <div class="sub-head">
          <code>{{ p.root }}</code>
          <span v-if="p.preload" class="preload">已预下载</span>
          <span v-else-if="loaded.includes(p.root)" class="done">按需已加载</span>
          <span v-else class="pending">未加载</span>
        </div>
        <div class="pages">
          <span v-for="pg in p.pages" :key="pg">{{ pg }}</span>
        </div>
        <div class="foot">
          <span class="size">{{ p.size }}</span>
          <button type="button" :disabled="loaded.includes(p.root)" @click="enter(p.root)">进入分包</button>
        </div>
      </div>
    </div>

    <p class="hint">低频页面下沉到分包，主包更小、首屏更快；preloadRule 可在空闲时预下载常用分包。</p>
  </div>
</template>

<style scoped>
.main,
.sub {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  padding: 12px;
}
.main {
  border-color: var(--accent);
}
.pkg-head {
  color: var(--accent-strong);
  font-weight: 700;
  font-size: 14px;
}
.pages {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.pages span {
  border-radius: 6px;
  background: var(--surface-soft);
  color: var(--text);
  padding: 5px 10px;
  font-size: 13px;
}
.subs {
  display: grid;
  gap: 10px;
}
.sub-head {
  display: flex;
  gap: 10px;
  align-items: center;
}
.sub-head code {
  color: var(--text);
  font-weight: 600;
}
.preload,
.done,
.pending {
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
}
.preload {
  background: rgba(123, 181, 86, 0.16);
  color: var(--forest);
}
.done {
  background: rgba(246, 193, 90, 0.2);
  color: var(--chestnut);
}
.pending {
  background: var(--surface-soft);
  color: var(--muted);
}
.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.size {
  color: var(--muted);
  font-size: 13px;
}
.foot button {
  padding: 5px 10px;
}
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
</style>`;export{n as default};
