<script setup lang="ts">
import { ref } from 'vue'

const features = [
  { feat: '自动优化', desc: 'WebP/AVIF 格式转换，按设备生成合适尺寸' },
  { feat: '懒加载', desc: '默认 loading="lazy"，进入视口才加载' },
  { feat: '防抖动', desc: '需指定 width/height 或 fill，避免 CLS' },
  { feat: '响应式', desc: 'sizes 属性配合 srcset 生成多档' },
  { feat: '优先级', desc: 'priority 属性用于首屏 LCP 图片预加载' },
  { feat: '占位符', desc: 'blurDataURL 生成低质量模糊预览' },
]

const codeExample = `<span style="color:#8a8a3a">// 本地图片 — 需 import</span>
import Image from 'next/image'
import hero from '@/public/hero.jpg'

export default function Hero() {
  return (
    &lt;Image
      src={hero}            <span style="color:#7c7c99">// 导入对象，自带尺寸</span>
      alt="封面图"
      priority              <span style="color:#7c7c99">// 首屏预加载</span>
      placeholder="blur"    <span style="color:#7c7c99">// 模糊占位</span>
    /&gt;
  )
}

<span style="color:#8a8a3a">// 远程图片 — 需配置 next.config.js 域名白名单</span>
&lt;Image
  src="https://cdn.example.com/photo.jpg"
  alt="远程图"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/&gt;

<span style="color:#8a8a3a">// next.config.js</span>
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' }
    ],
    formats: ['image/avif', 'image/webp'],
  }
}`

const vsImg = [
  { aspect: '优化', nextImage: '✅ 自动', plainImg: '❌ 手动' },
  { aspect: '懒加载', nextImage: '✅ 默认', plainImg: '❌ 需手写' },
  { aspect: '格式', nextImage: '✅ AVIF/WebP', plainImg: '❌ 原图' },
  { aspect: '尺寸', nextImage: '✅ 响应式', plainImg: '❌ 固定' },
  { aspect: 'CLS', nextImage: '✅ 防抖动', plainImg: '❌ 易抖动' },
]
</script>

<template>
  <div class="demo-card">
    <h3>next/image 图片优化</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>核心能力</h4>
        <div v-for="f in features" :key="f.feat" class="feat-card">
          <strong>{{ f.feat }}</strong>
          <p><small>{{ f.desc }}</small></p>
        </div>

        <h4 style="margin-top:12px;">vs 原生 &lt;img&gt;</h4>
        <table>
          <thead><tr><th>维度</th><th>next/image</th><th>&lt;img&gt;</th></tr></thead>
          <tbody>
            <tr v-for="v in vsImg" :key="v.aspect">
              <td>{{ v.aspect }}</td>
              <td>{{ v.nextImage }}</td>
              <td>{{ v.plainImg }}</td>
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
