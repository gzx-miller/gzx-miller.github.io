// 临时脚本：手工组装并验证 WebAssembly 模块，输出 base64 供内容组件使用
// 运行后自检所有导出函数，全部通过才打印 base64。验证完即可删除本文件。

function leb128(n) {
  const out = []
  let value = n
  do {
    let byte = value & 0x7f
    value >>>= 7
    if (value !== 0) byte |= 0x80
    out.push(byte)
  } while (value !== 0)
  return out
}

function u(name) {
  const bytes = []
  const buf = Buffer.from(name, 'utf8')
  for (const byte of buf) bytes.push(byte)
  return bytes
}

function section(id, content) {
  return [id, ...leb128(content.length), ...content]
}

function vec(items) {
  return [...leb128(items.length), ...items.flat()]
}

function nameBytes(s) {
  const raw = u(s)
  return [...leb128(raw.length), ...raw]
}

// 值类型
const i32 = 0x7f
const f32 = 0x7d
const v128 = 0x7b
const extRef = 0x6f
const funcRef = 0x70

function functype(params, results) {
  return [0x60, ...leb128(params.length), ...params, ...leb128(results.length), ...results]
}

function encodeLocals(groups) {
  if (!groups || groups.length === 0) return [0x00]
  const out = [...leb128(groups.length)]
  for (const [count, type] of groups) out.push(...leb128(count), type)
  return out
}

function buildModule({ types, imports = [], memory = null, globals = [], tables = [], elems = [], tags = [], funcs = [], exports: exps = [] }) {
  const bytes = [0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]

  // 类型段
  const typeContent = vec(types.map((t) => functype(t.params, t.results)))
  bytes.push(...section(1, typeContent))

  // 导入段
  if (imports.length) {
    const content = vec(
      imports.map((imp) => [
        ...nameBytes(imp.module),
        ...nameBytes(imp.name),
        imp.kind, // 0=func
        ...leb128(imp.typeIndex),
      ]),
    )
    bytes.push(...section(2, content))
  }

  // 函数段
  if (funcs.length) {
    const content = vec(funcs.map((fn) => leb128(fn.typeIndex)))
    bytes.push(...section(3, content))
  }

  // 表格段
  if (tables.length) {
    const content = vec(
      tables.map((t) => {
        const shared = t.shared ? 0x01 : 0x00
        return [funcRef, shared, ...leb128(t.min), ...(t.max != null ? leb128(t.max) : [])]
      }),
    )
    bytes.push(...section(4, content))
  }

  // 内存段（flags: 位0=有最大值 0x01，位1=共享 0x02）
  if (memory) {
    const flags = (memory.max != null ? 0x01 : 0x00) | (memory.shared ? 0x02 : 0x00)
    const content = vec([
      [flags, ...leb128(memory.min), ...(memory.max != null ? leb128(memory.max) : [])],
    ])
    bytes.push(...section(5, content))
  }

  // 标签段（id=13，但按模块字段顺序须排在 memory 与 global 之间）
  if (tags.length) {
    const content = vec(tags.map((t) => [0x00, ...leb128(t.typeIndex)]))
    bytes.push(...section(13, content))
  }

  // 全局段
  if (globals.length) {
    const content = vec(
      globals.map((g) => {
        const mut = g.mut ? 0x01 : 0x00
        return [g.type, mut, ...g.init]
      }),
    )
    bytes.push(...section(6, content))
  }

  // 导出段
  if (exps.length) {
    const content = vec(
      exps.map((e) => [...nameBytes(e.name), e.kind, ...leb128(e.index)]),
    )
    bytes.push(...section(7, content))
  }

  // 元素段
  if (elems.length) {
    const content = vec(
      elems.map((e) => [0x00, ...e.offset, ...vec(e.funcs.map(leb128))]),
    )
    bytes.push(...section(9, content))
  }

  // 代码段
  if (funcs.length) {
    const content = vec(funcs.map((fn) => {
      const body = [...encodeLocals(fn.locals), ...fn.body]
      return [...leb128(body.length), ...body]
    }))
    bytes.push(...section(10, content))
  }

  return new Uint8Array(bytes)
}

// ==================== 模块定义 ====================

// 1) add：加法，WB01/WB08 使用
const addModule = buildModule({
  types: [{ params: [i32, i32], results: [i32] }],
  funcs: [{ typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b] }],
  exports: [{ name: 'add', kind: 0, index: 0 }],
})

// 2) calc：数值类型与运算指令，WB04 使用
const calcModule = buildModule({
  types: [
    { params: [i32, i32], results: [i32] },
    { params: [f32, f32], results: [f32] },
  ],
  funcs: [
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x6c, 0x0b] }, // mul
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x6d, 0x0b] }, // div_s
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x73, 0x0b] }, // xor
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x74, 0x0b] }, // shl
    { typeIndex: 1, body: [0x20, 0x00, 0x20, 0x01, 0x92, 0x0b] }, // f32.add
  ],
  exports: [
    { name: 'mul', kind: 0, index: 0 },
    { name: 'div', kind: 0, index: 1 },
    { name: 'xor', kind: 0, index: 2 },
    { name: 'shl', kind: 0, index: 3 },
    { name: 'fadd', kind: 0, index: 4 },
  ],
})

// 3) mem：线性内存 store8/load8/sum，WB05 使用
// sum(ptr, n)：累加从 ptr 开始的 n 个 i32
const memSumBody = [
  0x20, 0x00, 0x20, 0x01, 0x41, 0x04, 0x6c, 0x6a, 0x21, 0x01, // l1 = ptr + n*4（结束地址）
  0x41, 0x00, 0x21, 0x02, // l2 = acc = 0
  0x02, 0x40, // block
  0x03, 0x40, // loop
  0x20, 0x00, 0x20, 0x01, 0x4f, // ptr >= end
  0x0d, 0x01, // br_if block（ptr>=end 则跳出）
  0x20, 0x02, 0x20, 0x00, 0x28, 0x02, 0x00, 0x6a, // acc += load32(ptr)
  0x21, 0x02, // acc 存回
  0x20, 0x00, 0x41, 0x04, 0x6a, 0x21, 0x00, // ptr += 4
  0x0c, 0x00, // br loop
  0x0b, 0x0b, // end loop / end block
  0x20, 0x02, 0x0b, // return acc
]
const memModule = buildModule({
  types: [
    { params: [i32, i32], results: [] },
    { params: [i32], results: [i32] },
    { params: [i32, i32], results: [i32] },
  ],
  memory: { min: 1 },
  funcs: [
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x3a, 0x00, 0x00, 0x0b] }, // store8(off,val)
    { typeIndex: 1, body: [0x20, 0x00, 0x2d, 0x00, 0x00, 0x0b] }, // load8(off)
    { typeIndex: 2, locals: [[2, i32]], body: memSumBody }, // sum(ptr,n)
  ],
  exports: [
    { name: 'memory', kind: 2, index: 0 },
    { name: 'store8', kind: 0, index: 0 },
    { name: 'load8', kind: 0, index: 1 },
    { name: 'sum', kind: 0, index: 2 },
  ],
})

// 4) str：字符串互操作 strlen/toupper，WB09 使用
// strlen(ptr)：内存中以 0 结尾字符串长度
const strlenBody = [
  0x02, 0x40, 0x03, 0x40, // block loop
  0x20, 0x00, 0x20, 0x01, 0x6a, 0x2d, 0x00, 0x00, // load8(ptr+len)
  0x45, 0x0d, 0x01, // 为 0 则跳出
  0x20, 0x01, 0x41, 0x01, 0x6a, 0x21, 0x01, // len++
  0x0c, 0x00, 0x0b, 0x0b, // br loop / end loop / end block
  0x20, 0x01, 0x0b, // return len
]
// toupper(ptr)：把小写字母原地转大写
const toupperBody = [
  0x02, 0x40, 0x03, 0x40, // block loop
  0x20, 0x00, 0x2d, 0x00, 0x00, // c = load8(ptr)
  0x45, 0x0d, 0x01, // c==0 跳出
  0x20, 0x00, 0x2d, 0x00, 0x00, // load8(ptr) -> c
  0x41, 0x61, 0x49, // c < 0x61
  0x20, 0x00, 0x2d, 0x00, 0x00, // load8(ptr)
  0x41, 0x7a, 0x4f, // c > 0x7a
  0x72, 0x04, 0x40, // 或运算后 if（无 blocktype）
  0x20, 0x00, 0x20, 0x00, 0x2d, 0x00, 0x00, 0x41, 0x20, 0x6b, 0x3a, 0x00, 0x00, // store8(ptr, c-0x20)
  0x0b, // end if
  0x20, 0x00, 0x41, 0x01, 0x6a, 0x21, 0x00, // ptr++
  0x0c, 0x00, 0x0b, 0x0b, // br loop / end loop / end block
  0x0b,
]
const strModule = buildModule({
  types: [
    { params: [i32], results: [i32] },
    { params: [i32], results: [] },
  ],
  memory: { min: 1 },
  funcs: [
    { typeIndex: 0, locals: [[1, i32]], body: strlenBody }, // strlen(ptr)->i32
    { typeIndex: 1, body: toupperBody }, // toupper(ptr)
  ],
  exports: [
    { name: 'memory', kind: 2, index: 0 },
    { name: 'strlen', kind: 0, index: 0 },
    { name: 'toupper', kind: 0, index: 1 },
  ],
})

// 5) table：函数表与 call_indirect，WB06 使用
const tableModule = buildModule({
  types: [
    { params: [i32, i32], results: [i32] },
    { params: [i32, i32, i32], results: [i32] },
  ],
  tables: [{ min: 4 }],
  elems: [{ offset: [0x41, 0x00, 0x0b], funcs: [0, 1, 2, 3] }],
  funcs: [
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b] }, // add
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x6b, 0x0b] }, // sub
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x6c, 0x0b] }, // mul
    { typeIndex: 0, body: [0x20, 0x00, 0x20, 0x01, 0x6d, 0x0b] }, // div_s
    { typeIndex: 1, body: [0x20, 0x01, 0x20, 0x02, 0x20, 0x00, 0x11, 0x00, 0x00, 0x0b] }, // dispatch(op,a,b)
  ],
  exports: [
    { name: 'table', kind: 1, index: 0 },
    { name: 'dispatch', kind: 0, index: 4 },
    { name: 'add', kind: 0, index: 0 },
    { name: 'sub', kind: 0, index: 1 },
    { name: 'mul', kind: 0, index: 2 },
    { name: 'div', kind: 0, index: 3 },
  ],
})

// 6) counter：导入导出与全局变量，WB07 使用（依赖 env.log 导入）
const counterModule = buildModule({
  types: [
    { params: [i32], results: [] }, // log
    { params: [], results: [i32] }, // get/inc/dec
    { params: [], results: [] }, // emit
  ],
  imports: [{ module: 'env', name: 'log', kind: 0, typeIndex: 0 }],
  globals: [{ type: i32, mut: true, init: [0x41, 0x00, 0x0b] }],
  funcs: [
    { typeIndex: 1, body: [0x23, 0x00, 0x0b] }, // get
    { typeIndex: 1, body: [0x23, 0x00, 0x41, 0x01, 0x6a, 0x24, 0x00, 0x23, 0x00, 0x0b] }, // inc
    { typeIndex: 1, body: [0x23, 0x00, 0x41, 0x01, 0x6b, 0x24, 0x00, 0x23, 0x00, 0x0b] }, // dec
    { typeIndex: 2, body: [0x23, 0x00, 0x10, 0x00, 0x0b] }, // emit
  ],
  exports: [
    { name: 'count', kind: 3, index: 0 },
    { name: 'get', kind: 0, index: 1 },
    { name: 'inc', kind: 0, index: 2 },
    { name: 'dec', kind: 0, index: 3 },
    { name: 'emit', kind: 0, index: 4 },
  ],
})

// 7) fib：递归斐波那契，WB18 性能对比使用
const fibBody = [
  0x20, 0x00, 0x41, 0x02, 0x48, // n < 2
  0x04, 0x7f, // if (result i32)
  0x20, 0x00, // then n
  0x05, // else
  0x20, 0x00, 0x41, 0x01, 0x6b, 0x10, 0x00, // fib(n-1)
  0x20, 0x00, 0x41, 0x02, 0x6b, 0x10, 0x00, // fib(n-2)
  0x6a, // add
  0x0b, // end if
  0x0b, // end func
]
const fibModule = buildModule({
  types: [{ params: [i32], results: [i32] }],
  funcs: [{ typeIndex: 0, body: fibBody }],
  exports: [{ name: 'fib', kind: 0, index: 0 }],
})

// 8) simd：i32x4 向量加法（基于内存），WB15 使用
const simdModule = buildModule({
  types: [{ params: [i32, i32, i32], results: [] }],
  memory: { min: 1 },
  funcs: [
    {
      typeIndex: 0,
      body: [
        0x20, 0x00, 0x20, 0x01, 0xfd, 0x00, 0x04, 0x00, // dest, a; v128.load a
        0x20, 0x02, 0xfd, 0x00, 0x04, 0x00, // b; v128.load b
        0xfd, 0xae, 0x01, // i32x4.add（栈上只剩 dest 地址与和）
        0xfd, 0x0b, 0x04, 0x00, // v128.store（弹值再弹地址）
        0x0b,
      ],
    },
  ],
  exports: [
    { name: 'memory', kind: 2, index: 0 },
    { name: 'vadd', kind: 0, index: 0 },
  ],
})

// 9) eh：异常处理 tag + throw，WB16 使用
const ehModule = buildModule({
  types: [
    { params: [i32], results: [] }, // tag payload
    { params: [i32, i32], results: [i32] },
  ],
  tags: [{ typeIndex: 0 }],
  funcs: [
    {
      typeIndex: 1,
      body: [
        0x20, 0x01, 0x45, // b == 0
        0x04, 0x40, // if
        0x41, 0x64, 0x08, 0x00, // i32.const 100; throw tag0
        0x0b, // end if
        0x20, 0x00, 0x20, 0x01, 0x6d, 0x0b, // a/b
      ],
    },
  ],
  exports: [
    { name: 'div', kind: 0, index: 0 },
    { name: 'e', kind: 4, index: 0 },
  ],
})

// 10) extern：externref 引用类型，WB17 使用
const externModule = buildModule({
  types: [{ params: [extRef], results: [extRef] }],
  funcs: [{ typeIndex: 0, body: [0x20, 0x00, 0x0b] }],
  exports: [{ name: 'identity', kind: 0, index: 0 }],
})

// 11) atomic：共享内存原子加法，WB10 使用
const atomicModule = buildModule({
  types: [{ params: [i32], results: [i32] }],
  memory: { min: 1, max: 1, shared: true },
  funcs: [
    { typeIndex: 0, body: [0x20, 0x00, 0x41, 0x01, 0xfe, 0x1e, 0x02, 0x00, 0x0b] },
  ],
  exports: [
    { name: 'memory', kind: 2, index: 0 },
    { name: 'atomicAdd', kind: 0, index: 0 },
  ],
})

const modules = {
  add: addModule,
  calc: calcModule,
  mem: memModule,
  str: strModule,
  table: tableModule,
  counter: counterModule,
  fib: fibModule,
  simd: simdModule,
  eh: ehModule,
  extern: externModule,
  atomic: atomicModule,
}

// ==================== 验证 ====================
async function verify() {
  // add
  let { instance } = await WebAssembly.instantiate(modules.add)
  assert(instance.exports.add(2, 3) === 5, 'add')

  // calc
  ;({ instance } = await WebAssembly.instantiate(modules.calc))
  assert(instance.exports.mul(6, 7) === 42, 'calc.mul')
  assert(instance.exports.div(20, 4) === 5, 'calc.div')
  assert(instance.exports.xor(12, 10) === 6, 'calc.xor')
  assert(instance.exports.shl(1, 4) === 16, 'calc.shl')
  assert(Math.abs(instance.exports.fadd(1.5, 2.25) - 3.75) < 1e-6, 'calc.fadd')

  // mem
  ;({ instance } = await WebAssembly.instantiate(modules.mem))
  const memBytes = new Uint8Array(instance.exports.memory.buffer)
  instance.exports.store8(0, 42)
  assert(instance.exports.load8(0) === 42, 'mem.store/load')
  const view = new DataView(instance.exports.memory.buffer)
  view.setInt32(8, 10, true)
  view.setInt32(12, 20, true)
  view.setInt32(16, 30, true)
  assert(instance.exports.sum(8, 3) === 60, 'mem.sum')
  memBytes[0] = 0

  // str
  ;({ instance } = await WebAssembly.instantiate(modules.str))
  const strBytes = new Uint8Array(instance.exports.memory.buffer)
  const text = 'hello'
  for (let i = 0; i < text.length; i++) strBytes[i] = text.charCodeAt(i)
  strBytes[text.length] = 0
  assert(instance.exports.strlen(0) === 5, 'str.strlen')
  instance.exports.toupper(0)
  let out = ''
  for (let i = 0; i < 5; i++) out += String.fromCharCode(strBytes[i])
  assert(out === 'HELLO', 'str.toupper: ' + out)
  for (let i = 0; i < 5; i++) strBytes[i] = 0

  // table
  ;({ instance } = await WebAssembly.instantiate(modules.table))
  assert(instance.exports.dispatch(0, 10, 3) === 13, 'table.dispatch add')
  assert(instance.exports.dispatch(1, 10, 3) === 7, 'table.dispatch sub')
  assert(instance.exports.dispatch(2, 10, 3) === 30, 'table.dispatch mul')
  assert(instance.exports.dispatch(3, 10, 2) === 5, 'table.dispatch div')
  const tbl = instance.exports.table
  tbl.set(0, instance.exports.sub) // JS 改写表格第 0 项
  assert(instance.exports.dispatch(0, 10, 3) === 7, 'table.set')

  // counter
  const logs = []
  ;({ instance } = await WebAssembly.instantiate(modules.counter, {
    env: { log: (v) => logs.push(v) },
  }))
  assert(instance.exports.get() === 0, 'counter.get')
  instance.exports.inc()
  instance.exports.inc()
  instance.exports.dec()
  assert(instance.exports.get() === 1, 'counter.inc/dec')
  instance.exports.emit()
  assert(logs[0] === 1, 'counter.emit log')

  // fib
  ;({ instance } = await WebAssembly.instantiate(modules.fib))
  assert(instance.exports.fib(10) === 55, 'fib(10)=55')
  assert(instance.exports.fib(20) === 6765, 'fib(20)')

  // simd
  ;({ instance } = await WebAssembly.instantiate(modules.simd))
  const simdBytes = new Uint8Array(instance.exports.memory.buffer)
  const a = new Int32Array(simdBytes.buffer)
  a[0] = 1; a[1] = 2; a[2] = 3; a[3] = 4
  a[4] = 10; a[5] = 20; a[6] = 30; a[7] = 40
  instance.exports.vadd(0, 0, 16) // dest=0, a=0, b=16
  assert(a[0] === 11 && a[1] === 22 && a[2] === 33 && a[3] === 44, 'simd.vadd')
  for (let i = 0; i < 32; i++) simdBytes[i] = 0

  // eh
  ;({ instance } = await WebAssembly.instantiate(modules.eh))
  assert(instance.exports.div(10, 2) === 5, 'eh.div ok')
  let threw = false
  try {
    instance.exports.div(10, 0)
  } catch (e) {
    threw = e.is(instance.exports.e)
  }
  assert(threw, 'eh.throw')

  // extern
  ;({ instance } = await WebAssembly.instantiate(modules.extern))
  const obj = { name: 'wasm' }
  assert(instance.exports.identity(obj) === obj, 'extern.identity')

  // atomic
  ;({ instance } = await WebAssembly.instantiate(modules.atomic))
  const sab = instance.exports.memory.buffer
  assert(sab instanceof SharedArrayBuffer, 'atomic.sab')
  assert(instance.exports.atomicAdd(0) === 0, 'atomic first')
  assert(instance.exports.atomicAdd(0) === 1, 'atomic second')

  console.log('ALL MODULES VERIFIED\n')
  for (const [name, mod] of Object.entries(modules)) {
    console.log(`${name}: ${Buffer.from(mod).toString('base64')}`)
  }
}

function assert(cond, label) {
  if (!cond) {
    console.error('VERIFY FAILED: ' + label)
    process.exit(1)
  }
  console.log('  ok - ' + label)
}

verify().catch((e) => {
  console.error('VERIFY ERROR:', e.message)
  process.exit(1)
})
