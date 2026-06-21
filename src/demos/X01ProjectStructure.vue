<script setup lang="ts">
import { ref } from 'vue'

const dirs = [
  { path: 'app/', desc: 'App Router 根目录，存放路由、布局、页面', tag: '核心' },
  { path: 'app/layout.tsx', desc: '根布局，所有页面共享', tag: '布局' },
  { path: 'app/page.tsx', desc: '首页，对应 / 路由', tag: '页面' },
  { path: 'app/globals.css', desc: '全局样式', tag: '样式' },
  { path: 'public/', desc: '静态资源，直接通过 / 访问', tag: '静态' },
  { path: 'next.config.js', desc: 'Next.js 配置文件', tag: '配置' },
  { path: 'middleware.ts', desc: '中间件，放在 src 或项目根', tag: '中间件' },
  { path: 'package.json', desc: '依赖与脚本', tag: '配置' },
]

const selected = ref('app/layout.tsx')
const selectedDir = ref(dirs.find(d => d.path === selected.value))

const appRouterTree = `app/
├── layout.tsx        # 根布局（必需）
├── page.tsx          # 首页 → /
├── globals.css       # 全局样式
├── loading.tsx       # 全局加载 UI
├── error.tsx         # 全局错误 UI
├── not-found.tsx     # 404 页面
├── about/
│   └── page.tsx      # → /about
├── blog/
│   ├── layout.tsx    # 博客专属布局
│   ├── page.tsx      # → /blog
│   └── [slug]/
│       └── page.tsx  # → /blog/:slug（动态）
└── api/
    └── route.ts      # → /api（Route Handler）`
</script>

<template>
  <div class="demo-card">
    <h3>项目结构：App Router 目录约定</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>App Router 目录树</h4>
        <pre class="mini-code">{{ appRouterTree }}</pre>
      </div>

      <div style="flex:1;">
        <h4>核心目录说明</h4>
        <ul>
          <li v-for="d in dirs" :key="d.path"
              :style="{ cursor:'pointer', fontWeight: selected===d.path?'bold':'normal', color: selected===d.path?'#e85d04':'inherit' }"
              @click="selected=d.path; selectedDir=d">
            <code>{{ d.path }}</code>
            <span class="tag">{{ d.tag }}</span>
          </li>
        </ul>

        <div v-if="selectedDir" class="detail-box">
          <p><strong>路径：</strong><code>{{ selectedDir.path }}</code></p>
          <p><strong>作用：</strong>{{ selectedDir.desc }}</p>
        </div>
      </div>
    </div>

    <small>Next.js 13+ 使用 App Router（app/ 目录），Pages Router（pages/ 目录）为旧方案仍兼容但推荐迁移。</small>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 8px; }
.tag { background: #fff3e0; color: #e85d04; padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; display: block; margin-top: 8px; }
</style>
