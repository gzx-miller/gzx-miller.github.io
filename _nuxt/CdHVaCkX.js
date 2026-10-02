const n=`// ═══════════════════════════════════════════
// D29 - dns 域名解析
// ═══════════════════════════════════════════

import dns from 'node:dns'
import { Resolver } from 'node:dns'

// ───────── 域名解析 ─────────

// 1. 查找 A 记录（IPv4 地址）
dns.lookup('example.com', (err, address, family) => {
  if (err) {
    console.error('解析失败:', err.message)
    return
  }
  console.log('IPv4 地址:', address)
  console.log('地址族:', family) // 4 或 6
})

// 2. 查找 IPv6
dns.lookup('example.com', { family: 6 }, (err, address) => {
  if (!err) console.log('IPv6 地址:', address)
})

// 3. 获取所有地址
dns.lookup('example.com', { all: true }, (err, addresses) => {
  if (!err) {
    console.log('所有地址:', addresses)
    // [{ address: '93.184.216.34', family: 4 }]
  }
})

// Promise 版本（Node 15+）
// import { lookup } from 'node:dns/promises'
// const address = await lookup('example.com')

// ───────── dns.lookup vs dns.resolve ─────────

// dns.lookup:
// - 使用系统的 DNS 解析机制
// - 会读取 hosts 文件
// - 会走系统配置的 DNS 服务器
// - 结果会被缓存
// - 只返回 A/AAAA 记录

// dns.resolve:
// - 直接连接 DNS 服务器
// - 不读取 hosts 文件
// - 可以查询各种记录类型
// - 用的是 c-ares 库

// 重要区别：
// dns.lookup 是系统级的，可能受系统配置影响
// dns.resolve 是纯网络的，更快但可能和系统不一致

// 实际开发中，http.get 等用的是 dns.lookup

// ───────── 解析各种记录类型 ─────────

// A 记录（IPv4）
dns.resolve4('example.com', (err, addresses) => {
  if (!err) console.log('A 记录:', addresses)
})

// AAAA 记录（IPv6）
dns.resolve6('example.com', (err, addresses) => {
  if (!err) console.log('AAAA 记录:', addresses)
})

// MX 记录（邮件服务器）
dns.resolveMx('gmail.com', (err, records) => {
  if (!err) {
    console.log('MX 记录:')
    records.forEach(r => {
      console.log(\`  优先级 \${r.priority}: \${r.exchange}\`)
    })
  }
})

// TXT 记录（文本记录，常用于验证）
dns.resolveTxt('example.com', (err, records) => {
  if (!err) console.log('TXT 记录:', records)
})

// NS 记录（域名服务器）
dns.resolveNs('example.com', (err, records) => {
  if (!err) console.log('NS 记录:', records)
})

// CNAME 记录（别名）
dns.resolveCname('www.example.com', (err, records) => {
  if (!err) console.log('CNAME 记录:', records)
})

// SOA 记录（起始授权记录）
dns.resolveSoa('example.com', (err, soa) => {
  if (!err) console.log('SOA 记录:', soa)
})

// SRV 记录（服务定位）
// dns.resolveSrv('_xmpp-server._tcp.gmail.com', ...)

// PTR 记录（反向解析，IP → 域名）
dns.reverse('8.8.8.8', (err, hostnames) => {
  if (!err) console.log('反向解析 8.8.8.8:', hostnames)
})

// 任意类型
dns.resolve('example.com', 'ANY', (err, records) => {
  if (!err) console.log('ANY 记录:', records)
})

// ───────── 自定义 DNS 服务器 ─────────

// 使用指定的 DNS 服务器
const resolver = new Resolver()
resolver.setServers(['8.8.8.8', '8.8.4.4']) // Google DNS

resolver.resolve4('example.com', (err, addresses) => {
  if (!err) console.log('通过 Google DNS 解析:', addresses)
})

// 其他公共 DNS：
// Cloudflare: 1.1.1.1, 1.0.0.1
// Google: 8.8.8.8, 8.8.4.4
// 阿里: 223.5.5.5, 223.6.6.6
// 腾讯: 119.29.29.29

// 获取当前 DNS 服务器
const servers = dns.getServers()
console.log('当前 DNS 服务器:', servers)

// ───────── DNS 缓存 ─────────

// Node.js 内置的 dns.lookup 会用系统的 DNS 缓存
// dns.resolve 系列默认没有缓存

// 简单的 DNS 缓存实现
class DnsCache {
  constructor(ttl = 300000) {
    this.cache = new Map()
    this.ttl = ttl // 默认 5 分钟
  }

  resolve(hostname, type = 'A') {
    return new Promise((resolve, reject) => {
      const key = \`\${hostname}:\${type}\`
      const cached = this.cache.get(key)

      // 缓存命中且未过期
      if (cached && Date.now() < cached.expireAt) {
        resolve(cached.value)
        return
      }

      // 实际查询
      dns.resolve(hostname, type, (err, records) => {
        if (err) {
          reject(err)
          return
        }

        // 存入缓存
        this.cache.set(key, {
          value: records,
          expireAt: Date.now() + this.ttl
        })

        resolve(records)
      })
    })
  }

  clear() {
    this.cache.clear()
  }
}

// 使用：
// const dnsCache = new DnsCache(60000) // 1 分钟缓存
// const result = await dnsCache.resolve('example.com')

// 注意：生产环境建议用专业的 DNS 缓存库
// 或者直接用操作系统的 DNS 缓存

// ───────── DNS 超时和重试 ─────────

// 设置超时
dns.setDefaultResultOrder('verbatim')
// 解析顺序：
// 'verbatim' - 按 DNS 返回的顺序
// 'ipv4first' - 优先 IPv4 (默认，旧行为)
// 'ipv6first' - 优先 IPv6

// 超时设置（需要用 Resolver）
const resolverWithTimeout = new Resolver({
  timeout: 5000,      // 5 秒超时
  tries: 3            // 重试 3 次
})

// ───────── 反向 DNS 查询 ─────────

// IP → 域名
dns.reverse('127.0.0.1', (err, hostnames) => {
  if (err) {
    console.log('反向解析失败（通常正常）')
  } else {
    console.log('反向解析结果:', hostnames)
  }
})

// ───────── HTTP 请求的 DNS 解析 ─────────

// http/https 模块内部使用 dns.lookup
// 可以自定义 lookup 函数

import http from 'node:http'

// 自定义 DNS 解析（比如加缓存）
function customLookup(hostname, options, callback) {
  // 可以加缓存、限流、自定义 DNS 服务器等
  dns.lookup(hostname, options, callback)
}

// 请求时指定
// http.get({
//   hostname: 'example.com',
//   path: '/',
//   lookup: customLookup
// }, (res) => { ... })

// 或者全局设置（不推荐）

// ───────── 常见 DNS 错误码 ─────────

// dns.NODATA         没有数据
// dns.FORMERR        请求格式错误
// dns.SERVFAIL       服务器失败
// dns.NOTFOUND       域名不存在 (NXDOMAIN)
// dns.NOTIMP         未实现
// dns.REFUSED        服务器拒绝
// dns.BADQUERY       坏请求
// dns.BADNAME        坏名字
// dns.TIMEOUT        超时
// dns.CONNREFUSED    连接被拒绝
// dns.EADDRNOTAVAIL  地址不可用

// 错误处理
dns.resolve('nonexistent.example.com', (err) => {
  if (err) {
    if (err.code === 'ENOTFOUND') {
      console.log('域名不存在')
    } else if (err.code === 'ETIMEOUT') {
      console.log('DNS 查询超时')
    } else {
      console.log('DNS 错误:', err.code)
    }
  }
})

// ───────── 最佳实践 ─────────
// 大多数情况用 dns.lookup 就行（和系统行为一致）
// 需要特殊记录类型用 dns.resolve 系列
// 高并发场景加 DNS 缓存，减少 DNS 查询
// 设置合理的超时和重试
// 监控 DNS 解析延迟和失败率
// 生产环境配置多个 DNS 服务器，提高可靠性
// 注意 dns.lookup 和 dns.resolve 的区别
// 内网服务考虑用 hosts 文件或内网 DNS
// 全球服务考虑 DNS 智能解析（按地理位置）
// DNS 故障切换方案（多域名、客户端降级）
`;export{n as default};
