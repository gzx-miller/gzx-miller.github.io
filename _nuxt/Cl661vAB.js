const n=`<script setup lang="ts">
import { ref } from 'vue'

const domain = ref('example.com')
const recordType = ref('A')
const running = ref(false)
const result = ref('')

const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']

// 模拟 DNS 查询结果
const mockResults: Record<string, Record<string, string>> = {
  'example.com': {
    A: '93.184.216.34 (IPv4 地址)',
    'AAAA': '2606:2800:220:1:248:1893:25c8:1946 (IPv6 地址)',
    CNAME: '无 CNAME 记录',
    MX: '0 . (邮件交换，优先级 0)',
    TXT: '"v=spf1 -all" (SPF 记录)',
    NS: 'a.iana-servers.net, b.iana-servers.net (权威名称服务器)',
  },
  'google.com': {
    A: '142.250.80.46',
    'AAAA': '2404:6800:4008:c17::65',
    CNAME: '无 CNAME 记录',
    MX: '10 smtp.google.com (邮件交换，优先级 10)',
    TXT: '"v=spf1 include:_spf.google.com ~all"',
    NS: 'ns1.google.com, ns2.google.com, ns3.google.com, ns4.google.com',
  },
}

function queryDns() {
  running.value = true
  result.value = ''
  setTimeout(() => {
    const mock = mockResults[domain.value] || mockResults['example.com']
    result.value = mock[recordType.value] || '无记录'
    running.value = false
  }, 500)
}
<\/script>

<template><div class="demo-card">
  <p><code>dns</code> 模块提供域名解析功能，可将域名转换为 IP 地址，或查询各类 DNS 记录。</p>

  <div class="dns-controls">
    <label>域名 <input v-model="domain" placeholder="example.com" /></label>
    <label>记录类型 <select v-model="recordType">
      <option v-for="rt in recordTypes" :key="rt" :value="rt">{{ rt }}</option>
    </select></label>
    <button :disabled="running" @click="queryDns">查询 DNS</button>
  </div>

  <div v-if="result" class="dns-result">
    <div class="result-header">
      <span>{{ recordType }} 记录查询结果</span>
      <span class="domain">{{ domain }}</span>
    </div>
    <pre class="mini-code"><code>{{ result }}</code></pre>
  </div>

  <div class="dns-explain">
    <h4>常见 DNS 记录类型</h4>
    <div class="record-list">
      <div class="record-item"><strong>A</strong><span>IPv4 地址记录，将域名指向 IPv4 地址</span></div>
      <div class="record-item"><strong>AAAA</strong><span>IPv6 地址记录，将域名指向 IPv6 地址</span></div>
      <div class="record-item"><strong>CNAME</strong><span>别名记录，将一个域名指向另一个域名</span></div>
      <div class="record-item"><strong>MX</strong><span>邮件交换记录，指定接收邮件的服务器</span></div>
      <div class="record-item"><strong>TXT</strong><span>文本记录，常用于 SPF、DKIM 等验证</span></div>
      <div class="record-item"><strong>NS</strong><span>名称服务器记录，指定权威 DNS 服务器</span></div>
    </div>
  </div>

  <pre class="mini-code"><code>const dns = require('node:dns')

// 查询 A 记录（IPv4）
dns.lookup('example.com', (err, address, family) => {
  console.log(\\\`地址: \\\${address}, 协议族: IPv\\\${family}\\\`)
})

// 使用系统 DNS 解析（更可靠）
dns.resolve4('example.com', (err, addresses) => {
  console.log('IPv4 地址:', addresses)
})

// 反向解析（IP → 域名）
dns.reverse('8.8.8.8', (err, hostnames) => {
  console.log('主机名:', hostnames)
})</code></pre>
  <small>要点：<code>dns.lookup()</code> 使用系统配置（如 <code>/etc/hosts</code>），<code>dns.resolve()</code> 直接使用 DNS 服务器，行为略有不同。</small>
</div></template>

<style scoped>
.dns-controls { display: flex; gap: 10px; align-items: center; margin: 0.6rem 0; flex-wrap: wrap; }
.dns-controls input { padding: 3px 8px; border: 1px solid #ddd; border-radius: 4px; width: 180px; }
.dns-controls select { padding: 3px 8px; border: 1px solid #ddd; border-radius: 4px; }
.dns-result { margin: 0.6rem 0; }
.result-header { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 4px; }
.domain { color: #e8590c; font-weight: 600; }
.dns-explain { margin: 0.8rem 0; }
.dns-explain h4 { font-size: 13px; color: #334155; margin-bottom: 6px; }
.record-list { display: grid; gap: 4px; }
.record-item { display: flex; gap: 10px; padding: 4px 8px; background: #fff9f0; border-radius: 4px; font-size: 12px; }
.record-item strong { color: #e8590c; min-width: 50px; }
.record-item span { color: #64748b; }
</style>
`;export{n as default};
