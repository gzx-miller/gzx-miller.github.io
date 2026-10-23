const e=`<script setup>
import { ref, computed } from 'vue'

const input = ref('Hello 栗子🌰')
const encoding = ref('utf8')

const encodings = ['utf8', 'ascii', 'hex', 'base64', 'latin1']

const result = computed(() => {
  const text = input.value
  const lines = []
  lines.push(\`原始字符串: "\${text}"\`)
  lines.push(\`字符串长度: \${text.length} 个字符\`)
  lines.push('')
  for (const enc of encodings) {
    try {
      // 浏览器端模拟 Buffer 行为：使用 TextEncoder/TextDecoder
      if (enc === 'utf8') {
        const encoder = new TextEncoder()
        const bytes = encoder.encode(text)
        lines.push(\`UTF-8:  \${bytes.length} 字节 | \${Array.from(bytes).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}\`)
      } else if (enc === 'ascii') {
        const bytes = []
        for (let i = 0; i < text.length; i++) {
          bytes.push(text.charCodeAt(i) > 127 ? '?' : text[i])
        }
        lines.push(\`ASCII: 非 ASCII 字符（如中文、emoji）会被截断为 ?\`)
      } else if (enc === 'hex') {
        const encoder = new TextEncoder()
        const bytes = encoder.encode(text)
        lines.push(\`Hex:   \${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}\`)
      } else if (enc === 'base64') {
        lines.push(\`Base64: \${btoa(unescape(encodeURIComponent(text)))}\`)
      } else if (enc === 'latin1') {
        lines.push(\`Latin1: 单字节编码，中文会乱码\`)
      }
    } catch (e) {
      lines.push(\`\${enc}: 编码失败 - \${e.message}\`)
    }
  }
  lines.push('')
  lines.push('// Node.js 中的实际用法：')
  lines.push(\`const buf = Buffer.from("\${text.replace(/"/g, '\\\\"')}")\`)
  lines.push('buf.toString("hex")  // 十六进制')
  lines.push('buf.toString("base64")  // Base64')
  lines.push('buf.slice(0, 5)  // 截取前 5 字节')
  return lines.join('\\n')
})
<\/script>

<template><div class="demo-card">
  <p>Buffer 是 Node.js 中处理<strong>二进制数据</strong>的核心类。文件 I/O、网络传输、加密等操作都以 Buffer 为纽带。</p>
  <div class="input-row">
    <label>输入字符串 <input v-model="input" placeholder="输入任意字符串" /></label>
  </div>
  <pre class="mini-code"><code>{{ result }}</code></pre>
  <div class="buffer-demo">
    <strong>Buffer 常用操作：</strong>
    <div class="op-grid">
      <div class="op-item"><code>Buffer.from()</code><span>从字符串/数组创建 Buffer</span></div>
      <div class="op-item"><code>Buffer.alloc()</code><span>分配指定大小的 Buffer（已初始化）</span></div>
      <div class="op-item"><code>buf.toString()</code><span>将 Buffer 转为字符串</span></div>
      <div class="op-item"><code>buf.slice()</code><span>截取 Buffer 片段（零拷贝）</span></div>
      <div class="op-item"><code>Buffer.concat()</code><span>拼接多个 Buffer</span></div>
      <div class="op-item"><code>buf.equals()</code><span>比较两个 Buffer 内容是否相同</span></div>
    </div>
  </div>
  <small>要点：Buffer 是 Uint8Array 的子类；Stream 的底层数据就是 Buffer；拼接多个 Buffer 时注意使用 <code>Buffer.concat()</code> 避免内存碎片。</small>
</div></template>

<style scoped>
.input-row { margin: 0.6rem 0; }
.input-row input { margin-left: 6px; padding: 3px 8px; border: 1px solid #ddd; border-radius: 4px; width: 260px; }
.buffer-demo { margin: 0.8rem 0; font-size: 12px; }
.op-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; margin-top: 6px; }
.op-item { display: flex; gap: 8px; align-items: baseline; }
.op-item code { background: #fff7ed; color: #e8590c; padding: 1px 5px; border-radius: 3px; white-space: nowrap; }
.op-item span { color: #64748b; font-size: 11px; }
</style>
`;export{e as default};
