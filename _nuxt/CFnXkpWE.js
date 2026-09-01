const n=`// ═══════════════════════════════════════════
// D18 - Buffer 二进制数据处理
// ═══════════════════════════════════════════

// Buffer 是 Node.js 中处理二进制数据的核心类
// 类似于 Uint8Array，但有更多实用方法

// ───────── 创建 Buffer ─────────

// 1. 从字符串创建
const bufFromStr = Buffer.from('Hello, Node.js!', 'utf-8')
console.log(bufFromStr.toString('utf-8')) // 'Hello, Node.js!'

// 2. 指定编码
const bufUtf8 = Buffer.from('你好', 'utf-8')
const bufBase64 = Buffer.from('5L2g5aW9', 'base64')
console.log(bufUtf8.toString('base64')) // '5L2g5aW9'
console.log(bufBase64.toString('utf-8')) // '你好'

// 3. 从数组创建
const bufFromArr = Buffer.from([0x48, 0x65, 0x6C, 0x6C, 0x6F])
console.log(bufFromArr.toString()) // 'Hello'

// 4. 分配指定大小的 Buffer
const bufAlloc = Buffer.alloc(10)       // 全部填 0
const bufAllocUnsafe = Buffer.allocUnsafe(10) // 未初始化，可能有旧数据（快但不安全）

// 5. 用指定值填充
const bufFilled = Buffer.alloc(5, 'A')
console.log(bufFilled.toString()) // 'AAAAA'

// ───────── 支持的编码 ─────────

// 'utf8'    - UTF-8 字符串（默认）
// 'utf16le' - UTF-16 小端序
// 'latin1'  - 单字节编码
// 'base64'  - Base64 编码
// 'hex'     - 十六进制编码
// 'ascii'   - ASCII 编码
// 'binary'  - 别名: latin1
// 'ucs2'    - 别名: utf16le

// ───────── 读取 Buffer ─────────

const buf = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])

// 按索引访问（像数组一样）
console.log(buf[0]) // 1
console.log(buf[1]) // 2

// 读取不同类型的数据（小端序 LE，大端序 BE）
buf.readUInt8(0)       // 读取第 0 字节的 8 位无符号整数
buf.readUInt16BE(0)    // 读取 16 位无符号整数（大端）
buf.readUInt16LE(0)    // 读取 16 位无符号整数（小端）
buf.readUInt32BE(0)    // 读取 32 位无符号整数（大端）
buf.readInt32LE(0)     // 读取 32 位有符号整数（小端）
buf.readFloatBE(0)     // 读取 32 位浮点数（大端）
buf.readDoubleBE(0)    // 读取 64 位浮点数（大端）

// 大端序 vs 小端序：
// 大端序 (BE): 高位在前（网络字节序）
// 小端序 (LE): 低位在前（x86 架构常用）

// 比如数字 0x12345678:
// 大端: 12 34 56 78
// 小端: 78 56 34 12

// ───────── 写入 Buffer ─────────

const writeBuf = Buffer.alloc(8)

writeBuf.writeUInt8(0xFF, 0)       // 在位置 0 写入 255
writeBuf.writeUInt16BE(1000, 1)    // 在位置 1 写入 1000（大端）
writeBuf.writeFloatLE(3.14, 3)     // 在位置 3 写入 3.14（小端）

console.log(writeBuf.readUInt8(0)) // 255
console.log(writeBuf.readUInt16BE(1)) // 1000

// ───────── Buffer 常用方法 ─────────

// 1. 长度
const buf1 = Buffer.from('Hello')
buf1.length // 5

// 2. 复制
const buf2 = Buffer.alloc(5)
buf1.copy(buf2)
console.log(buf2.toString()) // 'Hello'

// 3. 拼接
const buf3 = Buffer.from('Hello, ')
const buf4 = Buffer.from('World!')
const combined = Buffer.concat([buf3, buf4])
console.log(combined.toString()) // 'Hello, World!'

// 4. 比较
const buf5 = Buffer.from('ABC')
const buf6 = Buffer.from('ABD')
buf5.compare(buf6) // -1 (buf5 小于 buf6)
buf5.equals(buf6)  // false

// 5. 切片（返回新的 Buffer，共享内存！）
const buf7 = Buffer.from('Hello World')
const slice = buf7.slice(0, 5)
console.log(slice.toString()) // 'Hello'
slice[0] = 0x68 // 'h'
console.log(buf7.toString()) // 'hello World' —— 原 Buffer 也变了！

// 6. 查找
const buf8 = Buffer.from('Hello World Hello')
buf8.indexOf('World')      // 6
buf8.lastIndexOf('Hello')  // 12
buf8.includes('World')     // true

// 7. 填充
const buf9 = Buffer.alloc(10)
buf9.fill('A')
buf9.fill('B', 5)          // 从位置 5 开始填 B

// 8. 遍历
for (const byte of Buffer.from('ABC')) {
  console.log(byte) // 65, 66, 67
}

// 9. 转数组
const arr = [...Buffer.from('ABC')]
// [65, 66, 67]

// ───────── Buffer vs Uint8Array ─────────

// Buffer 继承自 Uint8Array，所以 Uint8Array 的方法都能用
// Buffer 是 Node.js 特有的，有更多实用方法

const uint8arr = new Uint8Array([65, 66, 67])
const converted = Buffer.from(uint8arr)
console.log(converted.toString()) // 'ABC'

// Buffer 也是 Uint8Array
console.log(Buffer.from('A') instanceof Uint8Array) // true

// ───────── 性能注意事项 ─────────

// 1. Buffer.alloc vs Buffer.allocUnsafe
//    alloc: 初始化为 0，安全但稍慢
//    allocUnsafe: 不初始化，快但可能有旧数据
//    如果你马上要填满整个 Buffer，用 allocUnsafe 更快

// 2. 拼接大量 Buffer 时，避免多次 concat
//    先计算总长度，再分配一个大 Buffer 往里写

// 低效：
// let result = Buffer.alloc(0)
// for (const chunk of chunks) {
//   result = Buffer.concat([result, chunk])
// }

// 高效：
// const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
// const result = Buffer.alloc(totalLength)
// let offset = 0
// for (const chunk of chunks) {
//   chunk.copy(result, offset)
//   offset += chunk.length
// }

// ───────── 实际应用场景 ─────────

// 1. 处理二进制文件
// 2. 网络通信数据解析
// 3. 图片处理
// 4. 加密解密
// 5. 协议实现（自定义二进制协议）

// 示例：解析一个简单的二进制协议
// 格式：[4字节消息长度][2字节消息类型][消息体]

function parseMessage(buffer) {
  if (buffer.length < 6) return null // 数据不足

  const length = buffer.readUInt32BE(0)   // 消息长度（大端）
  const type = buffer.readUInt16BE(4)     // 消息类型
  const totalLength = 6 + length

  if (buffer.length < totalLength) return null // 数据不足

  const body = buffer.slice(6, totalLength)

  return {
    length,
    type,
    body,
    bodyStr: body.toString('utf-8')
  }
}

// 编码消息
function encodeMessage(type, bodyStr) {
  const body = Buffer.from(bodyStr, 'utf-8')
  const buffer = Buffer.alloc(6 + body.length)

  buffer.writeUInt32BE(body.length, 0)
  buffer.writeUInt16BE(type, 4)
  body.copy(buffer, 6)

  return buffer
}

// ───────── 最佳实践 ─────────
// 明确处理二进制数据时用 Buffer
// 注意大端序和小端序的区别
// Buffer.slice 是共享内存的，注意副作用
// 大量拼接用预分配，不要循环 concat
// 处理网络协议时，注意处理分包情况
// 敏感数据用完后用 fill(0) 清空
// 默认编码是 utf-8，但最好明确指定
// Node.js 18+ 也可以用 Blob，但 Buffer 更底层
`;export{n as default};
