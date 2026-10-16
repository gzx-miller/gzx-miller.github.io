const n=`// ═══════════════════════════════════════════
// 1. 哈希：完整性校验与摘要长度
// ═══════════════════════════════════════════

import {
  createHash, createHmac, createCipheriv, createDecipheriv,
  randomBytes, randomUUID, scryptSync, timingSafeEqual,
  generateKeyPairSync, sign, createVerify
} from 'node:crypto'

const fileCheck = createHash('sha256').update('订单 1024 的内容').digest('hex')  // 结果：64 位十六进制摘要
const sha256Len = createHash('sha256').update('订单 1024').digest('hex').length  // 结果：64，对应 256 位
const md5Len = createHash('md5').update('订单 1024').digest('hex').length        // 结果：32，仅遗留兼容
const sha1Len = createHash('sha1').update('订单 1024').digest('hex').length      // 结果：40，已证明碰撞

// ═══════════════════════════════════════════
// 2. HMAC：带密钥的消息认证
// ═══════════════════════════════════════════

const secret = process.env.APP_SECRET                     // 说明：密钥来自环境变量，不硬编码
function signPayload(payload) {
  return createHmac('sha256', secret).update(payload).digest('hex')   // 结果：64 位签名
}
function verifyPayload(payload, signature) {
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))  // 结果：true，常数时间比较
}

// ═══════════════════════════════════════════
// 3. 加盐慢哈希：密码存储
// ═══════════════════════════════════════════

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')            // 说明：每个用户独立随机盐
  const hash = scryptSync(password, salt, 64).toString('hex')   // 说明：刻意拖慢，压低每秒尝试次数
  return \`\${salt}:\${hash}\`                                 // 结果：盐与摘要一并存储
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')                   // 说明：取出当初的盐
  const candidate = scryptSync(password, salt, 64)         // 说明：用同一个盐重算
  return timingSafeEqual(candidate, Buffer.from(hash, 'hex'))   // 结果：true / false
}

// ═══════════════════════════════════════════
// 4. AES-256-GCM：每次随机 IV 与 authTag
// ═══════════════════════════════════════════

function encrypt(plain, key) {
  const iv = randomBytes(12)                               // 说明：IV 每次加密都随机生成，绝不复用
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  return { iv, authTag: cipher.getAuthTag(), data }        // 结果：密文、IV、认证标签都要保存
}
function decrypt({ iv, authTag, data }, key) {
  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)                             // 说明：密文被改则 final() 抛错
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}

// ═══════════════════════════════════════════
// 5. 安全随机数与签名验签
// ═══════════════════════════════════════════

const resetToken = randomBytes(32).toString('hex')         // 结果：64 位随机令牌，不可预测
const requestId = randomUUID()                             // 结果：v4 UUID
const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })
const signature = sign(null, Buffer.from('转账 100 元'), privateKey)   // 说明：私钥签名
const ok = createVerify(null).update('转账 100 元').verify(publicKey, signature)  // 结果：true

// ═══════════════════════════════════════════
// 6. 用途选择与禁区
// ═══════════════════════════════════════════

const forbiddenForSecurity = ['md5', 'sha1']               // 说明：碰撞已证明，禁用于密码与签名
const integrityAlgos = ['sha256', 'sha512', 'sha3-256']    // 结果：完整性校验可选的安全算法
const passwordSchemes = ['scrypt', 'pbkdf2', 'bcrypt', 'argon2']  // 结果：加盐慢哈希阵营
const keyRotationPlanned = true                            // 说明：预留轮换路径，旧密钥仍能解历史数据
`;export{n as default};
