const a=`<script setup lang="ts">
import { ref, computed } from 'vue'

const paramTypes = [
  { pattern: '[id]', match: '/users/42', param: 'id = "42"', desc: '单段动态参数' },
  { pattern: '[slug]', match: '/blog/hello-world', param: 'slug = "hello-world"', desc: '单段动态（语义化）' },
  { pattern: '[...slug]', match: '/docs/a/b/c', param: 'slug = ["a","b","c"]', desc: 'Catch-all 捕获多段' },
  { pattern: '[[...slug]]', match: '/shop', param: 'slug = []', desc: '可选 Catch-all，空也匹配' },
]

const inputPath = ref('/users/42')
const parsedParam = computed(() => {
  if (inputPath.value.startsWith('/users/')) return \`id = "\${inputPath.value.slice(7)}"\`
  if (inputPath.value.startsWith('/blog/')) return \`slug = "\${inputPath.value.slice(6)}"\`
  if (inputPath.value.startsWith('/docs/')) return \`slug = [\${inputPath.value.slice(6).split('/').map(s => \`"\${s}"\`).join(', ')}]\`
  return '无法匹配'
})

const codeExample = \`<span style="color:#7c7c99">// app/users/[id]/page.tsx</span>
export default function Page({
  params,        <span style="color:#8a8a3a">// { id: "42" }</span>
  searchParams,  <span style="color:#8a8a3a">// URL 查询参数</span>
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] }
}) {
  return &lt;h1&gt;用户 ID: {params.id}&lt;/h1&gt;
}

<span style="color:#7c7c99">// app/docs/[...slug]/page.tsx — Catch-all</span>
export default function Page({
  params,  <span style="color:#8a8a3a">// { slug: ["a","b","c"] }</span>
}: {
  params: { slug: string[] }
}) {
  return &lt;h1&gt;文档路径: {params.slug.join('/')}&lt;/h1&gt;
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>动态路由与参数</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>参数类型对比</h4>
        <table>
          <thead><tr><th>文件模式</th><th>匹配示例</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="p in paramTypes" :key="p.pattern">
              <td><code>{{ p.pattern }}</code></td>
              <td><code>{{ p.match }}</code></td>
              <td>{{ p.desc }}</td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-top:12px;">试一试：输入路径</h4>
        <input v-model="inputPath" class="url-input" placeholder="/users/42" />
        <div class="detail-box">
          <p><strong>解析结果：</strong><code>{{ parsedParam }}</code></p>
        </div>
      </div>

      <div style="flex:1;">
        <h4>params 与 searchParams</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box" style="margin-top:8px;">
          <p><strong>params：</strong>来自路径段，Server Component 中可直接 await</p>
          <p><strong>searchParams：</strong>来自 ?key=value 查询串</p>
          <p><strong>Next.js 15+：</strong>params 和 searchParams 为 Promise，需 await</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.url-input { width: 100%; padding: 6px 10px; border: 1px solid #e0a06a; border-radius: 4px; font-family: monospace; margin-bottom: 8px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{a as default};
