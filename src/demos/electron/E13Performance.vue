<script setup lang="ts">
import { ref } from 'vue'

const tips = ref([
  { title: '启动优化', items: ['延迟加载非关键模块', '使用骨架屏', '避免在主进程中执行同步 I/O'] },
  { title: '内存优化', items: ['限制渲染进程数量', '及时释放引用', '使用 Web Workers 处理计算'] },
  { title: '渲染优化', items: ['虚拟滚动长列表', '节流防抖事件', '使用 CSS 硬件加速'] }
])
</script>

<template>
  <div class="demo-container">
    <h2>🌰 性能优化</h2>
    <p class="desc">优化 Electron 应用启动速度、内存占用和渲染性能。</p>

    <div class="tips-grid">
      <div v-for="tip in tips" :key="tip.title" class="tip-card">
        <h3>{{ tip.title }}</h3>
        <ul>
          <li v-for="item in tip.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="code-block">
      <h3>启动优化示例</h3>
      <pre>
// 延迟加载
app.whenReady().then(() => {
  createWindow()
  // 延迟加载耗时模块
  setTimeout(() => {
    require('heavy-module')
  }, 3000)
})

// 监控内存
setInterval(() => {
  const mem = process.memoryUsage()
  console.log('RSS:', Math.round(mem.rss / 1024 / 1024), 'MB')
}, 30000)</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 900px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.tips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 20px; }
.tip-card { background: #f9f9f9; padding: 20px; border-radius: 12px; }
.tip-card h3 { margin: 0 0 12px 0; color: #333; }
.tip-card ul { margin: 0; padding-left: 20px; }
.tip-card li { margin-bottom: 8px; line-height: 1.6; color: #666; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
</style>
