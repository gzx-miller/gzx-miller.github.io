<script setup lang="ts">
import { ref } from 'vue'

const storageOptions = [
  { name: 'electron-store', desc: '基于 JSON，适合配置', useCase: '用户设置、应用配置' },
  { name: 'IndexedDB', desc: '浏览器标准，适合结构化数据', useCase: '离线数据、缓存' },
  { name: 'SQLite (better-sqlite3)', desc: '关系型，适合复杂查询', useCase: '本地数据库' },
  { name: 'localStorage', desc: '简单键值对，同步 API', useCase: '临时数据' }
]
</script>

<template>
  <div class="demo-container">
    <h2>🌰 本地数据存储</h2>
    <p class="desc">对比 electron-store、IndexedDB、SQLite 和 localStorage，掌握 Electron 应用的本地数据存储方案。</p>

    <div class="storage-grid">
      <div v-for="opt in storageOptions" :key="opt.name" class="storage-card">
        <h3>{{ opt.name }}</h3>
        <p>{{ opt.desc }}</p>
        <div class="use-case">
          <strong>适用场景:</strong> {{ opt.useCase }}
        </div>
      </div>
    </div>

    <div class="code-block">
      <h3>electron-store 示例</h3>
      <pre>
// 安装: npm install electron-store

// 主进程或预加载脚本
import Store from 'electron-store'
const store = new Store()

// 读写数据
store.set('user.name', 'Alice')
console.log(store.get('user.name')) // 'Alice'

// 存储对象
store.set('settings', { theme: 'dark', lang: 'zh' })
console.log(store.get('settings.theme')) // 'dark'

// 删除
store.delete('user.name')

// 清空
store.clear()</pre>
    </div>

    <div class="tips">
      <h3>选择建议</h3>
      <ul>
        <li><strong>配置数据</strong>: 使用 electron-store（简单、自动加密）</li>
        <li><strong>结构化数据</strong>: 使用 IndexedDB（浏览器标准、异步）</li>
        <li><strong>关系型数据</strong>: 使用 SQLite（支持复杂查询、事务）</li>
        <li><strong>临时数据</strong>: 使用 localStorage（同步、简单）</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container { padding: 24px; max-width: 900px; margin: 0 auto; }
.desc { color: #666; margin-bottom: 20px; }
.storage-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
.storage-card { background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #e0e0e0; }
.storage-card h3 { margin: 0 0 8px 0; color: #333; }
.storage-card p { margin: 0 0 12px 0; color: #666; font-size: 14px; }
.use-case { font-size: 13px; color: #888; }
.code-block { background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.code-block pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
.tips { background: #e8f5e9; padding: 20px; border-radius: 12px; }
.tips ul { margin: 0; padding-left: 20px; }
.tips li { margin-bottom: 8px; line-height: 1.6; }
</style>
