const n=`<script setup lang="ts">
import { ref } from 'vue'

const benefits = [
  { benefit: '自动自托管', desc: '字体文件下载并自托管，无第三方请求' },
  { benefit: '零布局抖动', desc: 'size-adjust 自动调整，消除 FOUT/FOIT' },
  { benefit: 'FOUT 优化', desc: '先用 fallback 显示，加载后平滑切换' },
  { benefit: 'subset', desc: '自动按需子集化，减小体积' },
]

const codeExample = \`<span style="color:#8a8a3a">// app/layout.tsx — 使用 Google 字体</span>
import { Inter, Roboto } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',          <span style="color:#7c7c99">// 先 fallback 再切换</span>
  variable: '--font-inter', <span style="color:#7c7c99">// 生成 CSS 变量</span>
})

export default function RootLayout({ children }) {
  return (
    &lt;html className={inter.variable}&gt;
      &lt;body&gt;{children}&lt;/body&gt;
    &lt;/html&gt;
  )
}

<span style="color:#8a8a3a">// 本地字体</span>
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/MyFont.woff2',
  display: 'swap',
  variable: '--font-my',
})

<span style="color:#8a8a3a">// CSS 中使用变量</span>
<span style="color:#7c7c99">/* globals.css */</span>
body {
  font-family: var(--font-inter), system-ui, sans-serif;
}
.title {
  font-family: var(--font-my), serif;
}\`

const vsTraditional = [
  { aspect: '加载方式', nextFont: '构建时下载自托管', trad: '运行时请求 Google CDN' },
  { aspect: '隐私', nextFont: '✅ 无第三方请求', trad: '❌ 泄露用户信息给 Google' },
  { aspect: 'CLS', nextFont: '✅ 零抖动', trad: '❌ 字体切换抖动' },
  { aspect: '性能', nextFont: '✅ 预连接 + 预加载', trad: '⚠️ 需手动优化' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>next/font 字体优化</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>核心优势</h4>
        <div v-for="b in benefits" :key="b.benefit" class="feat-card">
          <strong>{{ b.benefit }}</strong>
          <p><small>{{ b.desc }}</small></p>
        </div>

        <h4 style="margin-top:12px;">对比传统 @import</h4>
        <table>
          <thead><tr><th>维度</th><th>next/font</th><th>@import CDN</th></tr></thead>
          <tbody>
            <tr v-for="v in vsTraditional" :key="v.aspect">
              <td>{{ v.aspect }}</td>
              <td>{{ v.nextFont }}</td>
              <td>{{ v.trad }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.feat-card { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 6px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
small { color: #8a6d42; }
</style>
`;export{n as default};
