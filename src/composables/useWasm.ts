// useWasm.ts
// WebAssembly 内容共享工具：内置 11 个已构建并验证的二进制模块（来自 scripts/build-wasm-modules.mjs），
// 提供 base64 解码、实例化、内存字符串读取与十六进制查看等能力，供各 WB 系列演示组件复用。

export type WasmModuleName =
  | 'add'
  | 'calc'
  | 'mem'
  | 'str'
  | 'table'
  | 'counter'
  | 'fib'
  | 'simd'
  | 'eh'
  | 'extern'
  | 'atomic'

// 模块名 -> 模块二进制（base64，脚本验证全部导出函数通过后固化）
const MODULES: Record<WasmModuleName, string> = {
  add: 'AGFzbQEAAAABBwFgAn9/AX8DAgEABwcBA2FkZAAACgkBBwAgACABags=',
  calc:
    'AGFzbQEAAAABDQJgAn9/AX9gAn19AX0DBgUAAAAAAQcgBQNtdWwAAANkaXYAAQN4b3IAAgNzaGwAAwRmYWRkAAQKKQUHACAAIAFsCwcAIAAgAW0LBwAgACABcwsHACAAIAF0CwcAIAAgAZIL',
  mem: 'AGFzbQEAAAABEQNgAn9/AGABfwF/YAJ/fwF/AwQDAAECBQMBAAEHIQQGbWVtb3J5AgAGc3RvcmU4AAAFbG9hZDgAAQNzdW0AAgpIAwkAIAAgAToAAAsHACAALQAACzQBAn8gACABQQRsaiEBQQAhAgJAA0AgACABTw0BIAIgACgCAGohAiAAQQRqIQAMAAsLIAIL',
  str: 'AGFzbQEAAAABCgJgAX8Bf2ABfwADAwIAAQUDAQABBx0DBm1lbW9yeQIABnN0cmxlbgAAB3RvdXBwZXIAAQpdAiABAX8CQANAIAAgAWotAABFDQEgAUEBaiEBDAALCyABCzoAAkADQCAALQAARQ0BIAAtAABBYUkgAC0AAEF6T3IEQCAAIAAtAABBIGs6AAALIABBAWohAAwACwsL',
  table:
    'AGFzbQEAAAABDgJgAn9/AX9gA39/fwF/BgYFAAAAAAEEBAFwAAQHLAYFdGFibGUBAAhkaXNwYXRjaAAEA2FkZAAAA3N1YgABA211bAACA2RpdgADCQoBAEEACwQAAQIDCi0FBwAgACABagsHACAAIAFrCwcAIAAgAWwLBwAgACABbQsLACABIAIgABEAAAs=',
  counter:
    'AGFzbQEAAAABDANgAX8AYAABf2AAAAILAQNlbnYDbG9nAAADBQQBAQECBgYBfwFBAAsHIgUFY291bnQDAANnZXQAAQNpbmMAAgNkZWMAAwRlbWl0AAQKJQQEACMACwsAIwBBAWokACMACwsAIwBBAWskACMACwYAIwAQAAs=',
  fib: 'AGFzbQEAAAABBgFgAX8BfwMCAQAHBwEDZmliAAAKHgEcACAAQQJIBH8gAAUgAEEBaxAAIABBAmsQAGoLCw==',
  simd: 'AGFzbQEAAAABBwFgA39/fwADAgEABQMBAAEHEQIGbWVtb3J5AgAEdmFkZAAAChkBFwAgACAB/QAEACAC/QAEAP2uAf0LBAAL',
  eh: 'AGFzbQEAAAABCwJgAX8AYAJ/fwF/AwIBAQ0DAQAABwsCA2RpdgAAAWUEAAoTAREAIAFFBEBBZAgACyAAIAFtCw==',
  extern: 'AGFzbQEAAAABBgFgAW8BbwMCAQAHDAEIaWRlbnRpdHkAAAoGAQQAIAAL',
  atomic:
    'AGFzbQEAAAABBgFgAX8BfwMCAQAFBAEDAQEHFgIGbWVtb3J5AgAJYXRvbWljQWRkAAAKDAEKACAAQQH+HgIACw==',
}

// base64 -> Uint8Array（不依赖 atob/Buffer，SSR 与浏览器均可安全运行）
const B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/=+$/, '')
  const out: number[] = []
  let buffer = 0
  let bits = 0
  for (const ch of clean) {
    const val = B64_ALPHABET.indexOf(ch)
    if (val < 0) continue
    buffer = (buffer << 6) | val
    bits += 6
    if (bits >= 8) {
      bits -= 8
      out.push((buffer >> bits) & 0xff)
    }
  }
  return new Uint8Array(out)
}

// 取出指定模块的二进制字节（可直接用于 WebAssembly.compile / instantiate）
export function getWasmBytes(name: WasmModuleName): Uint8Array {
  const b64 = MODULES[name]
  if (!b64) throw new Error(`未找到 Wasm 模块：${name}`)
  return base64ToBytes(b64)
}

// 归一化后的实例类型：exports 统一为宽松对象，便于演示组件直接调用导出函数/内存
export interface WasmInstance {
  exports: Record<string, any>
}

// 实例化模块，返回 instance（importObject 用于注入宿主函数等导入）
// 不同 TS lib 对 WebAssembly.instantiate 的返回类型定义不同（可能直接返回 Instance，
// 也可能返回 { module, instance }），这里做一次归一化并放宽 exports 类型。
export async function instantiateWasm(
  name: WasmModuleName,
  importObject: WebAssembly.Imports = {},
): Promise<WasmInstance> {
  const result = (await WebAssembly.instantiate(getWasmBytes(name), importObject)) as
    | WebAssembly.Instance
    | { instance: WebAssembly.Instance }
  const instance = 'instance' in result ? result.instance : result
  return { exports: instance.exports as Record<string, any> }
}

// 十六进制查看器：按 16 字节一行输出，便于观察模块二进制结构
export function hexDump(bytes: Uint8Array, start = 0, max = 64): string {
  const lines: string[] = []
  const end = Math.min(bytes.length, start + max)
  for (let i = start; i < end; i += 16) {
    const chunk = Array.from(bytes.slice(i, i + 16))
    lines.push(chunk.map((b) => b.toString(16).padStart(2, '0')).join(' '))
  }
  return lines.join('\n')
}

// 从线性内存读取以 \0 结尾的 C 风格字符串
export function readCString(bytes: Uint8Array, offset: number): string {
  let end = offset
  while (end < bytes.length && bytes[end] !== 0) end++
  return new TextDecoder().decode(bytes.slice(offset, end))
}

// 返回所有模块名（供演示组件生成下拉/选择列表）
export function getWasmModuleNames(): WasmModuleName[] {
  return Object.keys(MODULES) as WasmModuleName[]
}

// 获取模块字节长度（用于展示模块体积）
export function getWasmSize(name: WasmModuleName): number {
  return getWasmBytes(name).byteLength
}
