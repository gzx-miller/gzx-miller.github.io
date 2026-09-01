const e=`<script setup lang="ts">
import { ref, computed } from 'vue'

const routes = [
  { file: 'pages/index.vue', path: '/', desc: '首页' },
  { file: 'pages/about.vue', path: '/about', desc: '关于页' },
  { file: 'pages/users/index.vue', path: '/users', desc: '用户列表' },
  { file: 'pages/users/[id].vue', path: '/users/:id', desc: '用户详情（动态）' },
  { file: 'pages/blog/[...slug].vue', path: '/blog/:slug(.*)*', desc: '博客 Catch-all' },
  { file: 'pages/parent/child.vue', path: '/parent/child', desc: '嵌套子路由' },
]

const selectedFile = ref('pages/index.vue')

const selectedRoute = computed(() => routes.find(r => r.file === selectedFile.value))

const routeTypes = [
  { type: '静态路由', pattern: 'about.vue', result: '/about', note: '文件名即路径' },
  { type: '动态路由', pattern: '[id].vue', result: '/:id', note: '方括号包裹参数' },
  { type: 'Catch-all', pattern: '[...slug].vue', result: '/:slug(.*)*', note: '匹配所有子路径' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>文件路由：目录结构即路由表</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>路由映射表</h4>
        <ul>
          <li v-for="r in routes" :key="r.file"
              :style="{ cursor:'pointer', fontWeight: selectedFile===r.file?'bold':'normal', color: selectedFile===r.file?'#e85d04':'inherit' }"
              @click="selectedFile=r.file">
            <code>{{ r.file }}</code> → <code>{{ r.path }}</code>
          </li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>选中路由详情</h4>
        <div v-if="selectedRoute" class="detail-box">
          <p><strong>文件：</strong><code>{{ selectedRoute.file }}</code></p>
          <p><strong>路径：</strong><code>{{ selectedRoute.path }}</code></p>
          <p><strong>说明：</strong>{{ selectedRoute.desc }}</p>
        </div>

        <h4 style="margin-top:12px;">路由类型速查</h4>
        <table>
          <thead><tr><th>类型</th><th>文件名</th><th>路径</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="rt in routeTypes" :key="rt.type">
              <td>{{ rt.type }}</td>
              <td><code>{{ rt.pattern }}</code></td>
              <td><code>{{ rt.result }}</code></td>
              <td>{{ rt.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
