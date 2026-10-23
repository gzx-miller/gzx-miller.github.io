const e=`<script setup lang="ts">
import { ref } from 'vue'

const cacheLayers = [
  { name: 'use cache', scope: '函数/组件的返回值', lifetime: '由 cacheLife 决定', color: '#0891b2' },
  { name: 'Data Cache', scope: 'fetch 请求结果（旧模型）', lifetime: '持久（手动失效）', color: '#e85d04' },
  { name: 'Full Route Cache', scope: '整条路由的 HTML/RSC（旧模型）', lifetime: '构建时生成，随 Data Cache', color: '#d97706' },
  { name: 'Router Cache', scope: '客户端已访问路由的 RSC', lifetime: '静态页约 5min，动态页默认不缓存', color: '#ca8a04' },
  { name: 'Request Memoization', scope: '单次渲染内的 fetch 去重', lifetime: '单次请求', color: '#65a30d' },
]

const revalidateMethods = [
  { method: 'revalidatePath("/posts")', desc: '按路径失效，刷新该路由及依赖', when: '数据更新后' },
  { method: "updateTag('posts')", desc: '立即失效，下一次请求等待新数据', when: 'Server Action 内' },
  { method: "revalidateTag('posts', 'max')", desc: '按标签后台刷新，期间继续提供旧内容', when: '批量更新' },
  { method: "fetch(url, { next: { revalidate: 60 } })", desc: '定时失效，60 秒后后台刷新', when: 'ISR' },
  { method: "fetch(url, { cache: 'no-store' })", desc: '完全跳过缓存', when: '实时数据' },
  { method: "router.refresh()", desc: '客户端清除 Router Cache 并重新请求', when: '客户端主动刷新' },
]

const codeExample = \`<span style="color:#8a8a3a">// Cache Components：显式缓存函数</span>
import { cacheLife, cacheTag } from 'next/cache'

async function getPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')
  return db.post.findMany()
}

<span style="color:#8a8a3a">// 按需失效（Server Action 内）</span>
import { revalidatePath, revalidateTag, updateTag } from 'next/cache'

export async function updatePost(formData: FormData) {
  await db.post.update(...)
  revalidatePath('/blog')      <span style="color:#7c7c99">// 刷新 /blog 路由</span>
  revalidatePath('/blog/[slug]', 'page')  <span style="color:#7c7c99">// 刷新动态路由</span>
  updateTag('posts')           <span style="color:#7c7c99">// 立即失效，下一次请求读新数据</span>
  revalidateTag('posts', 'max')  <span style="color:#7c7c99">// 后台刷新，期间继续提供旧内容</span>
}

<span style="color:#8a8a3a">// 旧模型的路由级配置</span>
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
      <p><strong>核心思路：</strong>Cache Components 下以 use cache 为缓存单位；旧模型中 Data Cache 是基础，Full Route 和 Router 依赖它，失效 Data Cache 会级联刷新上层。</p>
    </div>
  </div>
</template>

<style scoped>

table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
small { color: #8a6d42; }
</style>
`;export{e as default};
