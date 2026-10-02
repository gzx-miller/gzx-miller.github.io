const n=`<script setup lang="ts">
import { ref } from 'vue'

const conventions = [
  { pattern: '(folder)', name: '路由组', effect: '不影响 URL，用于组织代码 / 切换布局', example: 'app/(marketing)/about → /about', color: '#0891b2' },
  { pattern: '_folder', name: '私有文件夹', effect: '不参与路由，可放工具函数 / 组件', example: 'app/_components/Button', color: '#6b7280' },
  { pattern: '@folder', name: '并行路由插槽', effect: '布局插槽，不影响 URL', example: 'app/@sidebar/page', color: '#7c3aed' },
  { pattern: '[folder]', name: '动态路由', effect: '生成 URL 参数', example: 'app/blog/[slug] → /blog/:slug', color: '#e85d04' },
]

const codeExample = \`<span style="color:#8a8a3a">// 路由组：同一 URL 不同布局</span>
app/
├── (marketing)/
│   ├── layout.tsx     <span style="color:#7c7c99">// 营销页布局</span>
│   ├── page.tsx       → /
│   └── about/
│       └── page.tsx   → /about
├── (dashboard)/
│   ├── layout.tsx     <span style="color:#7c7c99">// 后台布局</span>
│   └── settings/
│       └── page.tsx   → /settings

<span style="color:#8a8a3a">// 私有文件夹：不参与路由</span>
app/
├── _components/        <span style="color:#7c7c99">// 工具组件</span>
│   └── Button.tsx
├── _lib/               <span style="color:#7c7c99">// 工具函数</span>
│   └── utils.ts
└── page.tsx            <span style="color:#7c7c99">// 只导出 page.tsx 参与路由</span>\`

const useCases = [
  { group: '路由组', cases: ['同一 URL 不同布局', '组织代码不影响路径', '多套主题切换'] },
  { group: '私有文件夹', cases: ['存放内部组件库', '工具函数 / 常量', '避免误生成路由'] },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>Route Groups 与私有文件夹</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>目录约定对比</h4>
        <div v-for="c in conventions" :key="c.pattern" class="conv-card" :style="{ borderLeftColor: c.color }">
          <code :style="{ color: c.color }">{{ c.pattern }}</code>
          <strong>{{ c.name }}</strong>
          <p><small>{{ c.effect }}</small></p>
          <p><small><code>{{ c.example }}</code></small></p>
        </div>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>

        <h4 style="margin-top:12px;">使用场景</h4>
        <div v-for="u in useCases" :key="u.group" class="detail-box">
          <strong>{{ u.group }}：</strong>
          <ul>
            <li v-for="c in u.cases" :key="c"><small>{{ c }}</small></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 8px; }
.conv-card { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 6px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ul { padding-left: 16px; }
</style>
`;export{n as default};
