<script setup lang="ts">
import { ref } from 'vue'

const metaTypes = [
  { type: '静态 Metadata', desc: 'layout/page 导出 metadata 对象', scope: '固定值' },
  { type: '动态 Metadata', desc: '导出 generateMetadata 函数', scope: '按参数生成' },
  { type: '文件约定', desc: 'favicon.ico / icon.png / apple-icon.png', scope: '图标' },
  { type: 'OG 图片', desc: 'opengraph-image.tsx 动态生成', scope: '社交分享' },
  { type: 'sitemap', desc: 'app/sitemap.ts', scope: 'SEO 索引' },
  { type: 'robots', desc: 'app/robots.ts', scope: '爬虫规则' },
]

const codeExample = `<span style="color:#8a8a3a">// 静态 Metadata — app/layout.tsx</span>
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '小松鼠举栗子',       <span style="color:#7c7c99">// 默认</span>
    template: '%s | 小松鼠'        <span style="color:#7c7c99">// 子页拼接</span>
  },
  description: '前端知识案例库',
}

<span style="color:#8a8a3a">// 动态 Metadata — app/blog/[slug]/page.tsx</span>
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise&lt;Metadata&gt; {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.cover],
    }
  }
}

<span style="color:#8a8a3a">// app/sitemap.ts — 动态站点地图</span>
export default async function sitemap() {
  const posts = await getAllPosts()
  return posts.map(p =&gt; ({
    url: \`https://example.com/blog/\${p.slug}\`,
    lastModified: p.updatedAt,
  }))
}

<span style="color:#8a8a3a">// app/robots.ts — 爬虫规则</span>
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}`

const ogTips = [
  'opengraph-image.tsx 用 ImageResponse 动态生成 OG 图',
  'twitter-image.tsx 同理生成 Twitter 卡片',
  'icon.tsx 可用代码动态生成 favicon',
  'metadata 自动去重，子页面覆盖父级',
]
</script>

<template>
  <div class="demo-card">
    <h3>Metadata 与 SEO</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>Metadata 类型</h4>
        <table>
          <thead><tr><th>类型</th><th>说明</th><th>范围</th></tr></thead>
          <tbody>
            <tr v-for="m in metaTypes" :key="m.type">
              <td><strong>{{ m.type }}</strong></td>
              <td><small>{{ m.desc }}</small></td>
              <td><small>{{ m.scope }}</small></td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-top:12px;">进阶技巧</h4>
        <ul>
          <li v-for="(t, i) in ogTips" :key="i"><small>{{ t }}</small></li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>替代方案：</strong>App Router 用 Metadata API 取代了 Pages Router 的 next/head。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
