const n=`// ═══════════════════════════════════════════
// D21 - crypto 加密实践
// ═══════════════════════════════════════════

import crypto from 'node:crypto'

// ───────── 哈希 (Hash) ─────────
// 单向、不可逆，用于验证数据完整性

// 1. MD5（不安全，仅用于兼容旧系统）
const md5Hash = crypto.createHash('md5')
  .update('Hello, World!')
  .digest('hex')
console.log('MD5:', md5Hash)

// 2. SHA-256（推荐）
const sha256Hash = crypto.createHash('sha256')
  .update('Hello, World!')
  .digest('hex')
console.log('SHA-256:', sha256Hash)

// 3. SHA-512
const sha512Hash = crypto.createHash('sha512')
  .update('Hello, World!')
  .digest('base64')
console.log('SHA-512 (base64):', sha512Hash)

// 流式哈希（大文件）
// const fs = require('fs')
// const hash = crypto.createHash('sha256')
// const stream = fs.createReadStream('file.txt')
// stream.on('data', (chunk) => hash.update(chunk))
// stream.on('end', () => console.log(hash.digest('hex')))

// ───────── HMAC (带密钥的哈希) ─────────
// 用于验证消息的完整性和真实性

const secret = 'my-secret-key'
const message = '重要消息'

const hmac = crypto.createHmac('sha256', secret)
  .update(message)
  .digest('hex')

console.log('HMAC:', hmac)

// 验证 HMAC
function verifyHmac(message, signature, secret) {
  const expected = crypto.createHmac('sha256', secret)
    .update(message)
    .digest('hex')
  // 用 timingSafeEqual 防止时序攻击
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex')
  )
}

// ───────── 对称加密 ─────────
// 同一个密钥用于加密和解密

// AES-256-GCM（推荐，带认证）
function encrypt(text, secretKey) {
  // 密钥必须是 32 字节（256位）
  const key = crypto.scryptSync(secretKey, 'salt', 32)

  // 初始化向量 IV，每次加密都要不同
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  let encrypted = cipher.update(text, 'utf-8', 'hex')
  encrypted += cipher.final('hex')

  // 获取认证标签（用于验证数据完整性）
  const authTag = cipher.getAuthTag().toString('hex')

  // 返回 iv + authTag + 密文（都需要保存/传输）
  return {
    iv: iv.toString('hex'),
    authTag,
    encryptedData: encrypted
  }
}

function decrypt(encryptedData, iv, authTag, secretKey) {
  const key = crypto.scryptSync(secretKey, 'salt', 32)

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex')
  )

  decipher.setAuthTag(Buffer.from(authTag, 'hex'))

  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')

  return decrypted
}

// 使用示例
const secretKey = 'my-super-secret-password'
const originalText = '这是需要加密的敏感信息'

const encrypted = encrypt(originalText, secretKey)
console.log('加密结果:', encrypted)

const decrypted = decrypt(
  encrypted.encryptedData,
  encrypted.iv,
  encrypted.authTag,
  secretKey
)
console.log('解密结果:', decrypted)

// ───────── 非对称加密 (RSA) ─────────
// 公钥加密，私钥解密；私钥签名，公钥验签

// 生成密钥对
// crypto.generateKeyPair('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: { type: 'spki', format: 'pem' },
//   privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
// }, (err, publicKey, privateKey) => {
//   console.log('公钥:', publicKey)
//   console.log('私钥:', privateKey)
// })

// 公钥加密，私钥解密
function encryptWithPublicKey(publicKey, text) {
  return crypto.publicEncrypt(
    publicKey,
    Buffer.from(text, 'utf-8')
  ).toString('base64')
}

function decryptWithPrivateKey(privateKey, encryptedData) {
  return crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedData, 'base64')
  ).toString('utf-8')
}

// 私钥签名，公钥验签
function signData(privateKey, data) {
  const sign = crypto.createSign('SHA256')
  sign.update(data)
  sign.end()
  return sign.sign(privateKey, 'hex')
}

function verifySignature(publicKey, data, signature) {
  const verify = crypto.createVerify('SHA256')
  verify.update(data)
  verify.end()
  return verify.verify(publicKey, signature, 'hex')
}

// ───────── 随机数生成 ─────────

// 加密安全的随机数
const randomBytes = crypto.randomBytes(16)
console.log('随机字节 (hex):', randomBytes.toString('hex'))

// 生成随机整数
function randomInt(min, max) {
  return crypto.randomInt(min, max + 1)
}

// 生成 UUID
const uuid = crypto.randomUUID()
console.log('UUID:', uuid)

// ───────── 密码哈希 ─────────
// 注意：生产环境用 bcrypt/argon2，不要自己实现！

// 简单的 PBKDF2 示例（内置）
function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    100000,  // 迭代次数
    64,      // 密钥长度
    'sha512'
  ).toString('hex')
  return { salt, hash }
}

function verifyPassword(password, salt, hash) {
  const inputHash = crypto.pbkdf2Sync(
    password,
    salt,
    100000,
    64,
    'sha512'
  ).toString('hex')
  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(inputHash, 'hex')
  )
}

// 但更推荐：
// - bcrypt (简单，经过验证)
// - argon2 (更现代，抗 GPU 攻击)

// ───────── 常见加密算法对比 ─────────

// 哈希算法：
// MD5       - 不安全，已破解，仅兼容
// SHA-1     - 不安全，已破解
// SHA-256   - 安全，推荐
// SHA-512   - 安全，更慢
// SHA-3     - 最新标准

// 对称加密：
// AES-128-CBC - 安全，但需要自己处理认证
// AES-256-GCM - 推荐，带认证标签
// ChaCha20    - 移动设备友好

// 非对称加密：
// RSA-2048    - 常用，密钥至少 2048 位
// RSA-4096    - 更安全，更慢
// ECDSA       - 椭圆曲线，密钥更小更快

// 密码哈希：
// PBKDF2      - 内置，可用
// bcrypt      - 推荐，简单易用
// argon2      - 最强，最新标准

// ───────── 安全最佳实践 ─────────
// 永远不要自己实现加密算法
// 不要用 MD5 和 SHA-1 做安全用途
// 对称加密用 AES-GCM（带认证）
// 密码存储用 bcrypt/argon2，不要用普通哈希
// 密钥不要硬编码在代码中，用环境变量或密钥管理服务
// IV（初始化向量）每次都要随机生成
// 比较敏感数据用 timingSafeEqual 防止时序攻击
// 用 crypto.randomBytes 生成安全随机数，不要用 Math.random
// 定期轮换密钥
// 保持依赖更新，修复加密库的安全漏洞
`;export{n as default};
