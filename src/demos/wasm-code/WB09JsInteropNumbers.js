// JS 与 Wasm 数值互操作：JS number 传给 Wasm 时按签名做类型转换
const { instance } = await WebAssembly.instantiate(bytes) // 签名 (i32, i32) -> i32

const av = 3.9 // JS number
const bv = 2.1

// 传入 i32 参数时引擎做 ToInt32：丢弃小数、取低 32 位（截断而非四舍五入）
const receivedA = av | 0 // 3
const receivedB = bv | 0 // 2

// Wasm 完成相加，返回 i32 结果
const sum = instance.exports.add(av, bv) // 5

// i64 ↔ BigInt 一对一传输，不丢精度
instance.exports.i64Add(BigInt(9007199254740993), BigInt(1))

// f32 会做精度降级：0.1 存成 f32 后不再是精确的 0.1
