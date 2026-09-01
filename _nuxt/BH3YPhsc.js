const n=`<script setup lang="ts">
import { ref } from 'vue'

const files = [
  { name: 'pages.json', depth: 0, type: 'file', note: '注册页面，配置全局窗口与 tabBar' },
  { name: 'main.js', depth: 0, type: 'file', note: 'createSSRApp 创建应用实例' },
  { name: 'App.vue', depth: 0, type: 'file', note: 'onLaunch 触发应用级初始化' },
  { name: 'pages/', depth: 0, type: 'dir', note: '页面目录，路径与文件一一对应' },
  { name: 'home/home.vue', depth: 1, type: 'file', note: '首页' },
  { name: 'course/course.vue', depth: 1, type: 'file', note: '课程详情' },
  { name: 'mine/mine.vue', depth: 1, type: 'file', note: '我的' },
  { name: 'static/', depth: 0, type: 'dir', note: '静态资源，如封面图' },
  { name: 'components/', depth: 0, type: 'dir', note: 'easycom 可自动注册的组件' },
]

const active = ref(0)
const tab = ref('首页')
const tabs = ['首页', '我的']
<\/script>

<template>
  <div class="demo-card">
    <div class="layout">
      <div class="tree">
        <p class="cap">目录骨架</p>
        <button
          v-for="(f, i) in files"
          :key="f.name"
          class="node"
          :class="{ active: i === active }"
          :style="{ paddingLeft: \`\${12 + f.depth * 18}px\` }"
          type="button"
          @click="active = i"
        >
          <span class="ico">{{ f.type === 'dir' ? '📁' : '📄' }}</span>
          <span>{{ f.name }}</span>
        </button>
      </div>

      <div class="stage">
        <div class="note">{{ files[active].note }}</div>
        <div class="phone">
          <div class="navbar">松果学习</div>
          <div class="body">
            <p class="tip">globalStyle 控制导航栏配色</p>
            <div class="chips">
              <span>navigationBarTitleText</span>
              <span>#fff5e6 背景</span>
            </div>
          </div>
          <div class="tabbar">
            <button
              v-for="t in tabs"
              :key="t"
              type="button"
              class="tab"
              :class="{ on: tab === t }"
              @click="tab = t"
            >
              {{ t }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.cap {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 13px;
}
.tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.node {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  padding: 5px 12px;
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}
.node:hover {
  background: var(--surface-soft);
}
.node.active {
  background: rgba(246, 193, 90, 0.25);
  color: var(--accent-strong);
}
.ico {
  font-size: 14px;
}
.stage {
  display: grid;
  gap: 12px;
}
.note {
  min-height: 24px;
  border: 1px dashed var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--chestnut);
  font-size: 13px;
}
.phone {
  width: 240px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: var(--shadow);
}
.navbar {
  padding: 14px;
  background: #fff5e6;
  color: var(--text);
  text-align: center;
  font-weight: 700;
}
.body {
  height: 120px;
  padding: 16px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chips span {
  border-radius: 6px;
  background: var(--surface-soft);
  padding: 4px 8px;
  font-size: 12px;
  color: var(--muted);
}
.tip {
  margin: 0 0 10px;
  color: var(--muted);
  font-size: 13px;
}
.tabbar {
  display: flex;
  border-top: 1px solid var(--border);
  background: #fff5e6;
}
.tab {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--muted);
  padding: 12px;
  font-size: 14px;
}
.tab.on {
  color: var(--accent);
  font-weight: 700;
}
@media (max-width: 560px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>`;export{n as default};
