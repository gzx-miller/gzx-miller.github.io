const e=`<script setup lang="ts">
import { ref } from 'vue'

const cacheLayers = [
  { name: 'Data Cache', scope: 'fetch 请求结果', lifetime: '持久（手动失效）', color: '#e85d04' },
  { name: 'Full Route Cache', scope: '整条路由的 HTML/RSC', lifetime: '构建时生成，随 Data Cache', color: '#d97706' },
  { name: 'Router Cache', scope: '客户端已访问路由的 RSC', lifetime: '会话内（30s~5min）', color: '#ca8a04' },
  { name: 'Request Memoization', scope: '单次渲染内的 fetch 去重', lifetime: '单次请求', color: '#65a30d' },
]

const revalidateMethods = [
  { method: 'revalidatePath("/posts")', desc: '按路径失效，刷新该路由及依赖', when: '数据更新后' },
  { method: "revalidateTag('posts')", desc: '按标签失效，刷新所有该标签的 fetch', when: '批量更新' },
  { method: "fetch(url, { next: { revalidate: 60 } })", desc: '定时失效，60 秒后后台刷新', when: 'ISR' },
  { method: "fetch(url, { cache: 'no-store' })", desc: '完全跳过缓存', when: '实时数据' },
  { method: "router.refresh()", desc: '客户端清除 Router Cache 并重新请求', when: '客户端主动刷新' },
]

const codeExample = \`<span style="color:#8a8a3a">// 按需失效（Server Action 内）</span>
import { revalidatePath, revalidateTag } from 'next/cache'

export async function updatePost(formData: FormData) {
  await db.post.update(...)
  revalidatePath('/blog')      <span style="color:#7c7c99">// 刷新 /blog 路由</span>
  revalidatePath('/blog/[slug]', 'page')  <span style="color:#7c7c99">// 刷新动态路由</span>
  revalidateTag('posts')       <span style="color:#7c7c99">// 刷新所有 posts 标签缓存</span>
}

<span style="color:#8a8a3a">// 路由级配置</span>
export const revalidate = 60     <span style="color:#7c7c99">// ISR</span>
export const dynamic = 'force-dynamic'  <span style="color:#7c7c99">// 强制动态</span>\`
<\/script>

<template>
  <div class="demo-card">
    <h3>缓存与重新验证</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>四层缓存体系</h4>
        <div v-for="c in cacheLayers" :key="c.name" class="cache-card" :style="{ borderLeftColor: c.color }">
          <strong>{{ c.name }}</strong>
          <p><small>范围：{{ c.scope }}</small></p>
          <p><small>生命周期：{{ c.lifetime }}</small></p>
        </div>
      </div>

      <div style="flex:1;">
        <h4>重新验证方式</h4>
        <table>
          <thead><tr><th>方法</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="r in revalidateMethods" :key="r.method">
              <td><code>{{ r.method }}</code></td>
              <td><small>{{ r.desc }}</small></td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-top:12px;">代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
      </div>
    </div>

    <div class="detail-box">
      <p><strong>核心思路：</strong>Data Cache 是基础，Full Route 和 Router 依赖它；失效 Data Cache 会级联刷新上层。</p>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.cache-card { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 6px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
small { color: #8a6d42; }
</style>
`;export{e as default};
