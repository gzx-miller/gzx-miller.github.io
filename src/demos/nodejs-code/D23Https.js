// ═══════════════════════════════════════════
// 1. 证书链：从服务器证书到根 CA
// ═══════════════════════════════════════════

const chainFiles = ['server.pem', 'intermediate-ca.pem']   // 说明：缺中间证书，链会断，部分客户端直接拒绝
const trustAnchor = '系统与浏览器预置的根证书'              // 说明：根证书不随站点下发
const selfSignedWarning = '自签名提供加密，但不在信任库里'  // 结果：浏览器报「不安全」

// ═══════════════════════════════════════════
// 2. 私钥与证书加载
// ═══════════════════════════════════════════

import { readFileSync } from 'node:fs'
import { createServer } from 'node:https'

const tlsOptions = {
  key: readFileSync('./tls/key.pem'),                      // 说明：私钥权限收紧、绝不提交进仓库
  cert: readFileSync('./tls/fullchain.pem')                // 说明：含服务器证书与中间证书
}
const hasPrivateKey = Boolean(tlsOptions.key)              // 结果：true

// ═══════════════════════════════════════════
// 3. 最低版本与密码套件
// ═══════════════════════════════════════════

const hardened = {
  minVersion: 'TLSv1.2',                                   // 结果：拒绝 SSLv3 与 TLS 1.0/1.1
  maxVersion: 'TLSv1.3',
  honorCipherOrder: true,                                  // 说明：优先使用服务端套件顺序
  ciphers: [
    'TLS_AES_256_GCM_SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256'
  ].join(':')                                              // 结果：排除 CBC 与弱套件
}
function startHttps(handler) {
  const server = createServer({ ...tlsOptions, ...hardened }, handler)
  return server.listen(443)                                // 结果：对外提供 HTTPS 服务
}

// ═══════════════════════════════════════════
// 4. HSTS 与证书生命周期
// ═══════════════════════════════════════════

const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'  // 说明：强制全站走 HTTPS
}
const leValidityDays = 90                                  // 结果：Let's Encrypt 证书有效期
const renewalWindowDays = 30                               // 说明：留足续期窗口，避免过期导致全站拒绝
const keyFileMode = 0o600                                  // 说明：私钥文件仅属主可读写

// ═══════════════════════════════════════════
// 5. 检测与反向代理终止
// ═══════════════════════════════════════════

const inspectCmd = 'openssl s_client -connect example.com:443 -tls1_2'  // 说明：核对协议版本与证书链
const terminateAtProxy = true                              // 说明：TLS 可在负载均衡层终止，证书集中管理
const proxyToAppNote = '网关到应用那段的加密按安全边界评估'  // 说明：内网是否明文需单独权衡
