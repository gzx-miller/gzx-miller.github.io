const n=`// ═══════════════════════════════════════════
// 1. Buffer 是固定长度的字节序列
// ═══════════════════════════════════════════

import { Buffer } from 'node:buffer'

const name = Buffer.from('栗子')                        // 说明：UTF-8 编码交给 Buffer
console.log(name.length)                               // 结果：6，一个汉字占 3 字节
console.log(Buffer.isBuffer(name))                     // 结果：true
console.log(name instanceof Uint8Array)                // 结果：true，它是 Uint8Array 子类
console.log(name[0])                                   // 结果：第 0 个字节的值

// ═══════════════════════════════════════════
// 2. 三种创建方式，allocUnsafe 不清零
// ═══════════════════════════════════════════

const safe = Buffer.alloc(4)                           // 结果：4 个 0 字节，已清零
const fast = Buffer.allocUnsafe(4)                     // 说明：可能残留旧数据（池内切片）
fast.fill(0)                                           // 说明：涉密数据务必清零
const fromText = Buffer.from('Hello', 'utf8')          // 说明：从字符串构造

// ═══════════════════════════════════════════
// 3. 编码转换：字节长度与字符长度不同
// ═══════════════════════════════════════════

const text = '栗子🌰'
console.log(Buffer.byteLength(text))                   // 结果：10，emoji 占 4 字节
console.log(text.length)                               // 结果：4，按 UTF-16 码元数
console.log(fromText.toString('hex'))                  // 结果：48656c6c6f
console.log(fromText.toString('base64'))               // 结果：SGVsbG8=
// ascii / latin1 处理中文会丢信息，得到 '?' 或乱码

// ═══════════════════════════════════════════
// 4. subarray / slice 是共享内存的视图
// ═══════════════════════════════════════════

const view = fromText.subarray(0, 2)                   // 说明：零拷贝，不是副本
view[0] = 0x68                                         // 说明：改视图会改到原 Buffer
const copy = Buffer.from(fromText.subarray(0, 2))      // 说明：显式复制才独立

// ═══════════════════════════════════════════
// 5. 大片段先预分配再逐段 copy
// ═══════════════════════════════════════════

const chunks = [Buffer.from('Hello, '), Buffer.from('World')]
const total = chunks.reduce((sum, c) => sum + c.length, 0)  // 说明：先估总长
const merged = Buffer.allocUnsafe(total)                    // 说明：只分配一次
let offset = 0
for (const chunk of chunks) {
  chunk.copy(merged, offset)                                // 说明：逐段写入
  offset += chunk.length
}
console.log(merged.toString())                              // 结果：Hello, World
// 大体积编码转换会短暂膨胀，应改用流式分段处理
`;export{n as default};
