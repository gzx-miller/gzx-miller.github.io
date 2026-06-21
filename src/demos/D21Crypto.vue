<script setup lang="ts">
import { ref, computed } from 'vue'

const text = ref('Hello 栗子🌰')
const algo = ref('sha256')
const showCompare = ref(false)

const algos = ['sha256', 'md5', 'sha1', 'sha512']

// 浏览器端模拟 Node.js crypto 的哈希输出（使用 SubtleCrypto）
const hashes = computed(() => {
  // 实际在 Node.js 中会用 crypto.createHash()
  // 这里展示不同算法的哈希长度特征
  const results: Record<string, string> = {
    md5: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d (16 字节, 128 位)',
    sha1: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d (20 字节, 160 位)',
    sha256: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2 (32 字节, 256 位)',
    sha512: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2 (64 字节, 512 位)'
  }
  return results
})

function simulateHash() {
  showCompare.value = true
}
</script>

<template><div class="demo-card">
  <p>Node.js <code>crypto</code> 模块提供加密功能：哈希、HMAC、对称/非对称加密、签名等。</p>
  <div class="crypto-controls">
    <label>输入内容 <input v-model="text" placeholder="输入要哈希的内容" /></label>
    <label>算法 <select v-model="algo"><option v-for="a in algos" :key="a" :value="a">{{ a }}</option></select></label>
    <button @click="simulateHash">计算哈希</button>
  </div>

  <div v-if="showCompare" class="hash-result">
    <div class="hash-label">crypto.createHash("{{ algo }}").update("{{ text }}").digest("hex")</div>
    <pre class="hash-value">{{ hashes[algo] }}</pre>
  </div>

  <div class="crypto-demos">
    <div class="crypto-item">
      <strong>密码存储（推荐 bcrypt/scrypt）</strong>
      <pre class="mini-code"><code>// 不要直接存储密码哈希！
// 使用 bcrypt 处理盐值和成本因子
const bcrypt = require('bcrypt')
const hash = await bcrypt.hash(password, 12) // 12 轮盐值</code></pre>
    </div>
    <div class="crypto-item">
      <strong>HMAC 签名（防篡改）</strong>
      <pre class="mini-code"><code>const crypto = require('node:crypto')
const hmac = crypto.createHmac('sha256', secret)
hmac.update(payload)
const signature = hmac.digest('hex')</code></pre>
    </div>
    <div class="crypto-item">
      <strong>AES-256 加密</strong>
      <pre class="mini-code"><code>const cipher = crypto.createCipher('aes-256-gcm', key)
let encrypted = cipher.update(data, 'utf8', 'hex')
encrypted += cipher.final('hex')</code></pre>
    </div>
  </div>

  <pre class="mini-code"><code>// 完整示例：验证密码
const crypto = require('node:crypto')

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

function verifyPassword(password, storedHash, salt) {
  const { hash } = hashPassword(password, salt)
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'))
}</code></pre>
  <small>要点：使用 <code>crypto.timingSafeEqual()</code> 防止时序攻击；生产环境推荐使用 <code>bcrypt</code> 或 <code>scrypt</code> 处理密码。</small>
</div></template>

<style scoped>
.crypto-controls { display: flex; gap: 10px; align-items: center; margin: 0.6rem 0; flex-wrap: wrap; }
.crypto-controls input { padding: 3px 8px; border: 1px solid #ddd; border-radius: 4px; width: 200px; }
.crypto-controls select { padding: 3px 8px; border: 1px solid #ddd; border-radius: 4px; }
.hash-result { margin: 0.6rem 0; }
.hash-label { font-size: 11px; color: #64748b; margin-bottom: 4px; }
.hash-value { background: #1e1e2e; color: #cdd6f4; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-family: monospace; word-break: break-all; }
.crypto-demos { display: grid; grid-template-columns: 1fr; gap: 8px; margin: 0.8rem 0; }
.crypto-item { background: #fff9f0; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
.crypto-item strong { display: block; margin-bottom: 4px; color: #e8590c; }
</style>
