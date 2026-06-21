<script setup lang="ts">
import { ref } from 'vue'

const step = ref('overview')
const steps = ['overview', 'create', 'config', 'verify']

const certTypes = [
  { name: '自签名证书', desc: '开发环境使用，浏览器会显示不安全警告', cmd: 'openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes' },
  { name: 'Let\'s Encrypt', desc: '生产环境免费证书，需验证域名所有权', cmd: 'certbot certonly --standalone -d example.com' },
  { name: '通配符证书', desc: '支持所有子域名，需 DNS 验证', cmd: 'certbot certonly --manual --preferred-challenges dns -d *.example.com' },
]

const tlsVersions = [
  { version: 'TLS 1.2', secure: true, note: '推荐最低版本' },
  { version: 'TLS 1.3', secure: true, note: '推荐，性能更好' },
  { version: 'TLS 1.1', secure: false, note: '已废弃，不安全' },
  { version: 'TLS 1.0', secure: false, note: '已废弃，不安全' },
]
</script>

<template><div class="demo-card">
  <p>HTTPS 服务器需要 <code>TLS/SSL</code> 证书。Node.js 使用 <code>https</code> 模块（基于 OpenSSL）提供安全通信。</p>

  <div class="tabs">
    <button v-for="s in steps" :key="s" :class="{active: step === s}" @click="step = s">{{ {overview:'概览',create:'创建证书',config:'服务器配置',verify:'安全验证'}[s] }}</button>
  </div>

  <div v-if="step === 'overview'" class="step-content">
    <h4>HTTP vs HTTPS</h4>
    <div class="compare">
      <div class="col bad"><strong>HTTP</strong><ul><li>明文传输</li><li>易被窃听/篡改</li><li>无服务器身份验证</li></ul></div>
      <div class="col good"><strong>HTTPS</strong><ul><li>加密传输（TLS）</li><li>防窃听/中间人攻击</li><li>证书验证服务器身份</li></ul></div>
    </div>
  </div>

  <div v-if="step === 'create'" class="step-content">
    <h4>获取证书的方式</h4>
    <div class="cert-list">
      <div v-for="(c, i) in certTypes" :key="i" class="cert-item">
        <strong>{{ c.name }}</strong>
        <p>{{ c.desc }}</p>
        <pre class="mini-code"><code>{{ c.cmd }}</code></pre>
      </div>
    </div>
  </div>

  <div v-if="step === 'config'" class="step-content">
    <h4>Node.js HTTPS 服务器配置</h4>
    <pre class="mini-code"><code>const https = require('node:https')
const fs = require('node:fs')

const options = {
  key: fs.readFileSync('key.pem'),   // 私钥
  cert: fs.readFileSync('cert.pem'),  // 证书
  minVersion: 'TLSv1.2',             // 最低 TLS 版本
  ciphers: [                          // 加密套件优先级
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256',
  ].join(':'),
}

const server = https.createServer(options, (req, res) => {
  res.writeHead(200)
  res.end('Hello HTTPS!')
})
server.listen(443)</code></pre>
  </div>

  <div v-if="step === 'verify'" class="step-content">
    <h4>TLS 版本安全性</h4>
    <div class="tls-list">
      <div v-for="t in tlsVersions" :key="t.version" :class="'tls-item ' + (t.secure ? 'secure' : 'insecure')">
        <span class="tls-version">{{ t.version }}</span>
        <span class="tls-note">{{ t.note }}</span>
        <span class="tls-badge">{{ t.secure ? '✓ 安全' : '✗ 不安全' }}</span>
      </div>
    </div>
  </div>

  <small>要点：生产环境务必使用 HTTPS；Let's Encrypt 提供免费自动续期证书；Node.js 18+ 支持自动读取证书而无需手动配置。</small>
</div></template>

<style scoped>
.tabs { display: flex; gap: 6px; margin: 0.6rem 0; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #e8590c; color: #fff; border-color: #e8590c; }
.step-content { margin: 0.6rem 0; }
.compare { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.col { padding: 10px; border-radius: 6px; }
.col.bad { background: #fef2f2; border: 1px solid #fecaca; }
.col.good { background: #f0fdf4; border: 1px solid #bbf7d0; }
.col ul { margin: 6px 0 0 0; padding-left: 18px; font-size: 12px; line-height: 1.8; }
.cert-list { display: grid; gap: 8px; }
.cert-item { background: #fff9f0; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
.cert-item strong { color: #e8590c; }
.cert-item p { margin: 4px 0; color: #64748b; }
.tls-list { display: grid; gap: 6px; }
.tls-item { display: flex; align-items: center; gap: 12px; padding: 6px 10px; border-radius: 4px; font-size: 12px; }
.tls-item.secure { background: #f0fdf4; }
.tls-item.insecure { background: #fef2f2; }
.tls-version { font-weight: 600; width: 80px; }
.tls-note { flex: 1; color: #64748b; }
.tls-badge { font-size: 11px; padding: 2px 8px; border-radius: 10px; }
.secure .tls-badge { background: #16a34a; color: #fff; }
.insecure .tls-badge { background: #dc2626; color: #fff; }
</style>
