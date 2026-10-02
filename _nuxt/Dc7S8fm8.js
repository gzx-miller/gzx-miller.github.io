const e=`<script setup lang="ts">
import { ref, computed } from 'vue'

const routes = [
  { file: 'app/page.tsx', path: '/', desc: '首页', type: '静态' },
  { file: 'app/about/page.tsx', path: '/about', desc: '关于页', type: '静态' },
  { file: 'app/blog/[slug]/page.tsx', path: '/blog/:slug', desc: '动态参数', type: '动态' },
  { file: 'app/shop/[...slug]/page.tsx', path: '/shop/:slug*', desc: 'Catch-all', type: 'Catch-all' },
  { file: 'app/shop/[[...slug]]/page.tsx', path: '/shop(/*)?', desc: '可选 Catch-all', type: '可选' },
  { file: 'app/(marketing)/page.tsx', path: '/', desc: '路由组不影响路径', type: '路由组' },
  { file: 'app/@analytics/page.tsx', path: '/', desc: '并行路由插槽', type: '并行' },
]

const selectedFile = ref('app/blog/[slug]/page.tsx')
const selectedRoute = computed(() => routes.find(r => r.file === selectedFile.value))

const routeRules = [
  { pattern: 'page.tsx', rule: '文件名固定为 page，定义路由 UI', color: '#e85d04' },
  { pattern: '[param]', rule: '方括号 = 动态参数，如 [id] [slug]', color: '#d97706' },
  { pattern: '[...slug]', rule: 'Catch-all，匹配多级路径', color: '#ca8a04' },
  { pattern: '[[...slug]]', rule: '可选 Catch-all，零级也匹配', color: '#65a30d' },
  { pattern: '(folder)', rule: '路由组，不影响 URL 路径', color: '#0891b2' },
  { pattern: '@folder', rule: '并行路由，用于布局插槽', color: '#7c3aed' },
  { pattern: '_folder', rule: '私有文件夹，不参与路由', color: '#6b7280' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>文件路由：目录即路由表</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>路由映射表</h4>
        <ul>
          <li v-for="r in routes" :key="r.file"
              :style="{ cursor:'pointer', fontWeight: selectedFile===r.file?'bold':'normal', color: selectedFile===r.file?'#e85d04':'inherit' }"
              @click="selectedFile=r.file">
            <code>{{ r.file }}</code><br/>
            <small>→ <code>{{ r.path }}</code> · {{ r.desc }}</small>
          </li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>选中路由详情</h4>
        <div v-if="selectedRoute" class="detail-box">
          <p><strong>文件：</strong><code>{{ selectedRoute.file }}</code></p>
          <p><strong>路径：</strong><code>{{ selectedRoute.path }}</code></p>
          <p><strong>类型：</strong>{{ selectedRoute.type }}</p>
          <p><strong>说明：</strong>{{ selectedRoute.desc }}</p>
        </div>

        <h4 style="margin-top:12px;">命名规则速查</h4>
        <table>
          <thead><tr><th>模式</th><th>规则</th></tr></thead>
          <tbody>
            <tr v-for="rr in routeRules" :key="rr.pattern">
              <td><code :style="{ color: rr.color }">{{ rr.pattern }}</code></td>
              <td>{{ rr.rule }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
</style>
`;export{e as default};
