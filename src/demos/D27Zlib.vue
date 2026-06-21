<script setup lang="ts">
import { ref, computed } from 'vue'

const text = ref('Hello 栗子🌰'.repeat(100))
const method = ref('gzip')

const moniZip = computed(() => {
  const originalSize = new Blob([text.value]).size
  // moniZip比
  const ratios: Record<string, number> = {
    gzip: 0.35,
    deflate: 0.33,
    brotli: 0.25,
  }
  const ratio = ratios[method.value]
  const compressedSize = Math.floor(originalSize * ratio)
  const saved = originalSize - compressedSize
  const savedPercent = ((saved / originalSize) * 100).toFixed(1)
  return {
    originalSize,
    compressedSize,
    saved,
    savedPercent,
    ratio,
  }
})

const methods = [
  { id: 'gzip', name: 'Gzip', ext: '.gz', note: '最常用，兼容性最好' },
  { id: 'deflate', name: 'Deflate', ext: '.deflate', note: '比 Gzip 稍快，压缩率略高' },
  { id: 'brotli', name: 'Brotli', ext: '.br', note: '现代算法，压缩率最高（需 HTTPS）' },
]
</script>

<template><div class="demo-card">
  <p><code>zlib</code> 模块提供压缩/解压功能，用于减少网络传输大小和文件存储体积。</p>

  <div class="zlib-controls">
    <label>压缩方法 <select v-model="method"><option v-for="m in methods" :key="m.id" :value="m.id">{{ m.name }}</option></select></label>
    <label>模拟文本 <input v-model="text" placeholder="输入要压缩的文本" /></label>
  </div>

  <div class="compress-result">
    <div class="result-row">
      <span>原始大小</span>
      <strong>{{ moniZip.originalSize }} 字节</strong>
    </div>
    <div class="result-row">
      <span>压缩后大小（{{ method }}）</span>
      <strong>{{ moniZip.compressedSize }} 字节</strong>
    </div>
    <div class="result-row">
      <span>节省空间</span>
      <strong class="saved">{{ moniZip.saved }} 字节（{{ moniZip.savedPercent }}%）</strong>
    </div>
  </div>

  <div class="method-compare">
    <div v-for="m in methods" :key="m.id" :class="'method-item ' + (method === m.id ? 'active' : '')" @click="method = m.id">
      <strong>{{ m.name }}</strong>
      <span class="ext">{{ m.ext }}</span>
      <p>{{ m.note }}</p>
    </div>
  </div>

  <pre class="mini-code"><code>const zlib = require('node:zlib')
const fs = require('node:fs')

// 压缩文件
const input = fs.createReadStream('input.txt')
const output = fs.createWriteStream('input.txt.gz')
input.pipe(zlib.createGzip()).pipe(output)

// 解压
const compressed = fs.createReadStream('input.txt.gz')
const decompressed = fs.createWriteStream('output.txt')
compressed.pipe(zlib.createGunzip()).pipe(decompressed)

// HTTP 响应压缩
const http = require('node:http')
const server = http.createServer((req, res) => {
  const acceptEncoding = req.headers['accept-encoding']
  if (acceptEncoding?.includes('gzip')) {
    res.writeHead(200, { 'Content-Encoding': 'gzip' })
    fs.createReadStream('data.txt').pipe(zlib.createGzip()).pipe(res)
  } else {
    fs.createReadStream('data.txt').pipe(res)
  }
})</code></pre>
  <small>要点：HTTP 响应压缩是 zlib 最常见的用途；Brotli 压缩率最高但压缩速度较慢；Node.js 18+ 支持流式压缩，内存占用小。</small>
</div></template>

<style scoped>
.zlib-controls { display: flex; gap: 12px; align-items: center; margin: 0.6rem 0; flex-wrap: wrap; }
.zlib-controls select, .zlib-controls input { padding: 3px 8px; border: 1px solid #ddd; border-radius: 4px; }
.zlib-controls input { width: 240px; }
.compress-result { background: #f8fafc; padding: 10px 14px; border-radius: 6px; margin: 0.6rem 0; }
.result-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
.result-row span { color: #64748b; }
.result-row strong { color: #334155; }
.result-row .saved { color: #16a34a; }
.method-compare { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 0.8rem 0; }
.method-item { background: #fff9f0; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; border: 2px solid transparent; }
.method-item.active { border-color: #e8590c; }
.method-item strong { color: #e8590c; }
.method-item .ext { font-size: 11px; color: #f59e0b; margin-left: 6px; }
.method-item p { color: #64748b; margin: 4px 0 0 0; }
</style>
