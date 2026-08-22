import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => loader())
}

function createCodeLoader(path: string) {
  const loader = vueCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到案例源码：${path}`)
  return loader
}

const WB01WhatIsWasm = createDemo('WB01WhatIsWasm')
const WB01Code = createCodeLoader('WB01WhatIsWasm.vue')
const WB02WatBinary = createDemo('WB02WatBinary')
const WB02Code = createCodeLoader('WB02WatBinary.vue')
const WB03ValueTypes = createDemo('WB03ValueTypes')
const WB03Code = createCodeLoader('WB03ValueTypes.vue')
const WB04Operators = createDemo('WB04Operators')
const WB04Code = createCodeLoader('WB04Operators.vue')
const WB05LinearMemory = createDemo('WB05LinearMemory')
const WB05Code = createCodeLoader('WB05LinearMemory.vue')
const WB06StringsInterop = createDemo('WB06StringsInterop')
const WB06Code = createCodeLoader('WB06StringsInterop.vue')
const WB07FunctionsLocals = createDemo('WB07FunctionsLocals')
const WB07Code = createCodeLoader('WB07FunctionsLocals.vue')
const WB08ImportExportGlobals = createDemo('WB08ImportExportGlobals')
const WB08Code = createCodeLoader('WB08ImportExportGlobals.vue')
const WB09JsInteropNumbers = createDemo('WB09JsInteropNumbers')
const WB09Code = createCodeLoader('WB09JsInteropNumbers.vue')
const WB10FunctionTable = createDemo('WB10FunctionTable')
const WB10Code = createCodeLoader('WB10FunctionTable.vue')
const WB11ControlFlow = createDemo('WB11ControlFlow')
const WB11Code = createCodeLoader('WB11ControlFlow.vue')
const WB12MemoryArrays = createDemo('WB12MemoryArrays')
const WB12Code = createCodeLoader('WB12MemoryArrays.vue')
const WB13ImportCallbacks = createDemo('WB13ImportCallbacks')
const WB13Code = createCodeLoader('WB13ImportCallbacks.vue')
const WB14ReferenceTypes = createDemo('WB14ReferenceTypes')
const WB14Code = createCodeLoader('WB14ReferenceTypes.vue')
const WB15SharedMemoryAtomics = createDemo('WB15SharedMemoryAtomics')
const WB15Code = createCodeLoader('WB15SharedMemoryAtomics.vue')
const WB16MultiThreading = createDemo('WB16MultiThreading')
const WB16Code = createCodeLoader('WB16MultiThreading.vue')
const WB17Simd = createDemo('WB17Simd')
const WB17Code = createCodeLoader('WB17Simd.vue')
const WB18ExceptionHandling = createDemo('WB18ExceptionHandling')
const WB18Code = createCodeLoader('WB18ExceptionHandling.vue')
const WB19Performance = createDemo('WB19Performance')
const WB19Code = createCodeLoader('WB19Performance.vue')
const WB20ToolchainDeploy = createDemo('WB20ToolchainDeploy')
const WB20Code = createCodeLoader('WB20ToolchainDeploy.vue')

export const lessons: Lesson[] = [
  {
    id: 'WB_1',
    title: '什么是 WebAssembly：二进制格式与模块结构',
    navTitle: 'Wasm 是什么',
    category: '基础入门',
    path: '/webassembly/wb-1/what-is-wasm',
    summary: '从十六进制读懂 .wasm 文件的魔数、版本与各段结构，并完成首次实例化调用。',
    demo: WB01WhatIsWasm,
    code: WB01Code,
    language: 'vue',
    principle:
      'WebAssembly 是一种可移植的字节码格式。模块由若干"段"组成（类型段、导入段、导出段、代码段等），以魔数 \\0asm 与版本号开头。浏览器通过 WebAssembly.instantiate 将字节码编译为可调用对象。',
    flow: [
      '以 00 61 73 6d 魔数和 01 00 00 00 版本号开头的二进制。',
      '类型段声明函数签名，代码段存放函数体指令。',
      '导出段把内部函数暴露给宿主 JS。',
      'instantiate 校验、编译并实例化，得到可调用的 exports。',
    ],
    notes: [
      '魔数 \\0asm 是 ASCII "\\0asm" 的十六进制表达。',
      '段的 id 决定用途，顺序在规范中有固定要求。',
      'Wasm 运行在虚拟 ISA 上，不依赖具体 CPU，天然跨平台。',
      'instantiate 会先校验类型安全，非法模块直接拒绝。',
    ],
    problem: '解决"WebAssembly 文件到底是什么、浏览器如何把它变成可调用函数"的入门问题。',
  },
  {
    id: 'WB_2',
    title: 'WAT 文本格式与二进制对照',
    navTitle: 'WAT 与二进制',
    category: '基础入门',
    path: '/webassembly/wb-2/wat-vs-binary',
    summary: '用可读的 WAT 文本对照每条指令的二进制操作码，建立"文本即图纸"的映射。',
    demo: WB02WatBinary,
    code: WB02Code,
    language: 'vue',
    principle:
      'WAT 是 WebAssembly 的可读文本格式，与二进制一一对应。wat2wasm 工具负责把文本编译成二进制。栈式指令用 local.get 压栈、i32.add 弹两数压一数，理解指令栈是读懂 WAT 的关键。',
    flow: [
      '(module ...) 声明模块，func 定义函数。',
      'param 声明参数，result 声明返回值类型。',
      '指令按栈式书写：local.get 取值、运算符消费并产出。',
      'export 把内部函数以指定名称暴露出去。',
    ],
    notes: [
      'WAT 中的注释用 ;; 开头。',
      '二进制里每条指令都有固定操作码（如 0x6a 是 i32.add）。',
      'wabt 提供 wat2wasm / wasm2wat 双向转换。',
      '调试时可用 wasm2wat 反编译任何 .wasm 文件。',
    ],
    problem: '解决"如何阅读和编写可读的 Wasm 源码，并理解其二进制对应关系"的问题。',
  },
  {
    id: 'WB_3',
    title: '值类型与类型系统',
    navTitle: '值类型',
    category: '基础入门',
    path: '/webassembly/wb-3/value-types',
    summary: '认识 i32、i64、f32、f64 四种数值类型，以及类型在签名与内存中的强制约束。',
    demo: WB03ValueTypes,
    code: WB03Code,
    language: 'vue',
    principle:
      'WebAssembly 只有四种数值类型。所有函数签名、局部变量、内存读写都必须声明类型。i64 与 JS 交互需使用 BigInt，f32 精度低于 f64。类型系统让模块可被快速验证和高效编译。',
    flow: [
      '类型段集中声明函数签名（参数与返回值类型）。',
      '函数体内局部变量按类型声明并使用。',
      '内存按字节存储，读操作按类型解释字节。',
      'JS 调用时按签名自动做数值类型转换。',
    ],
    notes: [
      'i64 作为参数/返回值时 JS 必须用 BigInt 传输。',
      'f32 是 32 位单精度，存在舍入误差，价格建议用 f64。',
      'Wasm 没有字符串、对象、null，需通过内存或引用类型表达。',
      '类型是验证器安全检查的基础。',
    ],
    problem: '解决"Wasm 有哪些数据类型、类型如何约束函数与内存"的问题。',
  },
  {
    id: 'WB_4',
    title: '运算指令集',
    navTitle: '运算指令',
    category: '基础入门',
    path: '/webassembly/wb-4/operators',
    summary: '以折扣计算场景体验整数、位运算与浮点指令，理解栈式运算。',
    demo: WB04Operators,
    code: WB04Code,
    language: 'vue',
    principle:
      'Wasm 指令操作一个显式栈：local.get 压栈，运算符从栈顶弹出操作数、压入结果。整数指令（add/mul/div/xor/shl）与浮点指令（f32.add 等）使用不同操作码。',
    flow: [
      '把两个操作数压入操作数栈。',
      '运算符从栈顶取出操作数。',
      '计算结果重新压回栈顶。',
      '函数结束时栈顶值作为返回值。',
    ],
    notes: [
      '整数除法 div_s 是整除，商向零取整。',
      '位移指令对移位数有范围限制，非法会抛异常。',
      '浮点指令命名空间独立：0x92 是 f32.add。',
      '指令不可随意读写内存，需显式 load/store。',
    ],
    problem: '解决"Wasm 的运算指令如何在栈上完成数值计算"的问题。',
  },
  {
    id: 'WB_5',
    title: '线性内存读写',
    navTitle: '线性内存',
    category: '内存管理',
    path: '/webassembly/wb-5/linear-memory',
    summary: '用货架可视化展示内存字节视图，体验 store8/load8 读写。',
    demo: WB05LinearMemory,
    code: WB05Code,
    language: 'vue',
    principle:
      '线性内存是一块连续的字节数组，地址从 0 编号。JS 与 Wasm 通过 memory.buffer 共享同一块存储：JS 写后 Wasm 能读，Wasm 写后 JS 也能读。store8 写字节、load8 读字节，越界会抛 RuntimeError。',
    flow: [
      '模块声明内存，默认按页（64KiB）增长。',
      'store8(addr, val) 把值写入指定地址。',
      'load8(addr) 从指定地址读出字节。',
      'JS 直接用 Uint8Array(memory.buffer) 查看或修改。',
    ],
    notes: [
      '线性内存最小单位是字节，地址连续。',
      'Wasm 不能直接访问 buffer，但 JS 可以，两者共享。',
      '越界读写不会破坏浏览器，引擎会抛 RuntimeError。',
      '内存按页增长，1 页 = 64KiB。',
    ],
    problem: '解决"Wasm 如何存储和访问数据，JS 又如何与它共享数据"的问题。',
  },
  {
    id: 'WB_6',
    title: '字符串互操作',
    navTitle: '字符串互操作',
    category: '内存管理',
    path: '/webassembly/wb-6/strings-interop',
    summary: '把收货地址写入内存，交给 Wasm 求长度并原地转大写。',
    demo: WB06StringsInterop,
    code: WB06Code,
    language: 'vue',
    principle:
      'Wasm 没有字符串类型，用"内存地址 + 结束符"表达 C 风格字符串。JS 用 TextEncoder 编码写入内存、TextDecoder 从内存解码读回。strlen 数到 \\0 为止，toupper 原地修改字节。',
    flow: [
      'JS 把字符串编码后写入线性内存，并在末尾补 \\0。',
      'Wasm 的 strlen(ptr) 从指针数到 \\0 返回长度。',
      'toupper(ptr) 遍历并原地把小写字母改为大写。',
      'JS 从内存解码出结果字符串。',
    ],
    notes: [
      'C 风格字符串以 \\0 结尾，需要调用方保证。',
      'Wasm 通过指针（内存偏移量）引用字符串。',
      'toupper 是原地修改，不产生新字符串。',
      'wasm-bindgen 等工具可自动生成字符串编解码胶水。',
    ],
    problem: '解决"Wasm 没有字符串，JS 和 Wasm 之间如何传递字符串"的问题。',
  },
  {
    id: 'WB_7',
    title: '函数定义与局部变量',
    navTitle: '函数与局部变量',
    category: '函数与模块',
    path: '/webassembly/wb-7/functions-locals',
    summary: '用购物车结算函数 sum 剖析参数、局部变量与循环累加。',
    demo: WB07FunctionsLocals,
    code: WB07Code,
    language: 'vue',
    principle:
      'Wasm 函数由签名、参数、局部变量与指令体组成。参数与局部变量共享"函数局部索引空间"，用 local.get/set 按索引访问。sum(ptr, n) 用两个局部变量（结束地址、累加器）完成数组求和。',
    flow: [
      '声明函数签名 (ptr, n) -> i32。',
      '声明局部变量 end 与 acc 并初始化。',
      '循环内累加当前元素并推进指针。',
      '循环结束后返回累加器 acc。',
    ],
    notes: [
      '局部变量在函数执行时分配在栈帧上，调用后回收。',
      '参数和局部变量共用索引，类型必须匹配。',
      '函数体以 end (0x0b) 收尾。',
      '返回值必须是签名声明的结果类型。',
    ],
    problem: '解决"Wasm 函数如何组织参数、局部变量与返回值"的问题。',
  },
  {
    id: 'WB_8',
    title: '导入导出与全局变量',
    navTitle: '导入导出',
    category: '互操作',
    path: '/webassembly/wb-8/import-export-globals',
    summary: '用库存计数器展示模块如何导入宿主函数、导出全局变量与函数。',
    demo: WB08ImportExportGlobals,
    code: WB08Code,
    language: 'vue',
    principle:
      'Wasm 通过导入段声明对宿主（JS）能力的依赖，实例化时由 JS 注入实现；通过导出段把函数、内存、表格、全局变量暴露出去。全局变量需声明是否可变（mut）。',
    flow: [
      'counter 模块声明导入 env.log : (i32) -> ()。',
      '内部维护一个可变全局变量 count。',
      '导出 get/inc/dec/emit 四个函数操作 count。',
      'JS 实例化时注入 log 实现，调用 emit 触发回调。',
    ],
    notes: [
      '导入函数签名必须与模块声明一致。',
      '全局变量默认不可变，可变需加 mut。',
      '导出 kind：0 函数、2 内存、3 全局、1 表格。',
      'Wasm 调用宿主函数是同步的。',
    ],
    problem: '解决"Wasm 模块如何与 JS 交换能力（导入导出与全局状态）"的问题。',
  },
  {
    id: 'WB_9',
    title: 'JS 与 Wasm 数值互操作',
    navTitle: '数值互操作',
    category: '互操作',
    path: '/webassembly/wb-9/js-interop-numbers',
    summary: '模拟下单数量取整，观察 JS 数值跨 i32 边界时的截断行为。',
    demo: WB09JsInteropNumbers,
    code: WB09Code,
    language: 'vue',
    principle:
      'JS number 传给 Wasm 时按签名做类型转换：i32 会经 ToInt32 截断（丢弃小数、取低 32 位）；f32 做精度降级；i64 必须用 BigInt 一对一传输。理解这些转换能避免隐蔽的精度 bug。',
    flow: [
      'JS 把 number 传入 add 函数。',
      '引擎按 i32 签名做 ToInt32 截断。',
      'Wasm 完成相加返回 i32 结果。',
      'JS 得到普通 number 展示。',
    ],
    notes: [
      '3.9 → 3 是截断而非四舍五入。',
      'f32 会丢失精度，0.1 存成 f32 不再是精确 0.1。',
      'i64 ↔ BigInt 一对一，不丢精度。',
      '对象等引用类型不能直接传，需指针或 externref。',
    ],
    problem: '解决"JS 数值传给 Wasm 时会发生什么转换、如何避免精度问题"的问题。',
  },
  {
    id: 'WB_10',
    title: '函数表与 call_indirect',
    navTitle: '函数表',
    category: '函数与模块',
    path: '/webassembly/wb-10/function-table',
    summary: '用促销计价切换演示函数表与动态分发，JS 还能改写表项。',
    demo: WB10FunctionTable,
    code: WB10Code,
    language: 'vue',
    principle:
      '函数表按索引存放函数引用，Wasm 用 call_indirect 在运行时按索引调用并校验签名。JS 可通过 table.get/set 直接读写表项，实现热替换与插件机制。dispatch(op, a, b) 是典型的动态分发入口。',
    flow: [
      '模块声明一张函数表并填入 4 个函数。',
      'dispatch 用 call_indirect 按 op 索引调用。',
      'JS 调用 dispatch 得到对应运算结果。',
      'JS 改写表项后再次调用，行为随之改变。',
    ],
    notes: [
      'call_indirect 会校验目标函数签名，不符则抛异常。',
      'JS 用 table.get/set 操作表项。',
      '函数表是实现多态、回调、插件的关键。',
      '表格元素现在统一为 funcref 引用类型。',
    ],
    problem: '解决"Wasm 如何在运行时动态调用不同函数，JS 又如何干预"的问题。',
  },
  {
    id: 'WB_11',
    title: '控制流：if / loop / br',
    navTitle: '控制流',
    category: '函数与模块',
    path: '/webassembly/wb-11/control-flow',
    summary: '用递归斐波那契认识 if/else 分支，并梳理 block、loop、br 跳转。',
    demo: WB11ControlFlow,
    code: WB11Code,
    language: 'vue',
    principle:
      'Wasm 只有 block、loop、if/else 三种结构化控制流，配合 br 跳转实现分支与循环。递归函数通过 call 调用自身，每次调用占用独立栈帧。fib 用 if 判断基线条件，else 分支递归求和。',
    flow: [
      'if 判断 n < 2 作为递归基线。',
      'then 分支直接返回 n。',
      'else 分支递归调用 fib(n-1) 与 fib(n-2)。',
      '两个递归结果相加后返回。',
    ],
    notes: [
      '没有 goto，跳转被限定在结构化块内。',
      'if 需要以 end 收尾，可带 result 类型。',
      'loop 的 br 0 跳回循环体开头。',
      '深递归可能触发调用栈溢出异常。',
    ],
    problem: '解决"Wasm 如何表达分支与循环等结构化控制流"的问题。',
  },
  {
    id: 'WB_12',
    title: '内存中的数据结构：数组',
    navTitle: '内存数组',
    category: '内存管理',
    path: '/webassembly/wb-12/memory-arrays',
    summary: '把购物车价格按 4 字节对齐写入内存，可视化数组并求和。',
    demo: WB12MemoryArrays,
    code: WB12Code,
    language: 'vue',
    principle:
      'Wasm 没有数组类型，用"起始地址 + 元素个数"表达：元素按固定步长连续排列，i32 对齐到 4 字节。JS 用 DataView 按小端读写 int32，Wasm 用 sum 函数循环累加。',
    flow: [
      'JS 把价格列表按 4 字节对齐写入内存。',
      'Wasm 的 sum(ptr, n) 从 ptr 开始读 n 个 i32。',
      '循环累加所有元素。',
      '返回合计，JS 同时可视化数组柱状图。',
    ],
    notes: [
      '第 i 个元素地址 = ptr + i * 4。',
      '数组无元数据开销，但需自行管理长度。',
      'JS 用 DataView.setInt32/getInt32 小端读写。',
      '越界访问会抛 RuntimeError，天然防缓冲区溢出。',
    ],
    problem: '解决"Wasm 如何用线性内存表达数组等复合数据结构"的问题。',
  },
  {
    id: 'WB_13',
    title: '导入回调：同一模块多种行为',
    navTitle: '导入回调',
    category: '互操作',
    path: '/webassembly/wb-13/import-callbacks',
    summary: '用同一份 counter 二进制注入两种回调，演示导入驱动的可复用设计。',
    demo: WB13ImportCallbacks,
    code: WB13Code,
    language: 'vue',
    principle:
      '模块只声明依赖的导入函数与签名，不关心实现。同一二进制可用不同 JS 实现实例化多次，得到不同行为。这是依赖注入思想在 Wasm 里的体现，让业务逻辑与宿主能力解耦。',
    flow: [
      'counter 声明需要 env.log。',
      '实例化 A 注入"明细日志"实现。',
      '实例化 B 注入"价格累计"实现。',
      '两套实例互不影响，各自触发回调。',
    ],
    notes: [
      '导入函数签名必须一致，否则实例化失败。',
      '回调是同步调用，可用于日志、状态更新等。',
      '同一二进制 + 不同导入 = 可复用、可测试。',
      '高频回调有边界开销，性能敏感时应批量传递。',
    ],
    problem: '解决"如何通过导入让一个 Wasm 模块适配多种宿主行为"的问题。',
  },
  {
    id: 'WB_14',
    title: '引用类型 externref / funcref',
    navTitle: '引用类型',
    category: '高级特性',
    path: '/webassembly/wb-14/reference-types',
    summary: '把会员对象作为 externref 传入 Wasm 再原样返回，理解引用不复制。',
    demo: WB14ReferenceTypes,
    code: WB14Code,
    language: 'vue',
    principle:
      'externref 允许 Wasm 持有并传回一个 JS 对象的引用而不复制，适合传 DOM 节点、缓存句柄等。funcref 只能引用函数，是函数表元素的类型。引用类型补足了 Wasm 与宿主对象互操作的能力。',
    flow: [
      'JS 把会员对象作为 externref 传入 identity。',
      'Wasm 栈上持有引用并原样返回。',
      'JS 收到同一引用，可判定 === 相等。',
      'Wasm 不能直接读写对象内部，需回调 JS。',
    ],
    notes: [
      'externref 不拷贝数据，只传递句柄。',
      'funcref 只用于函数引用（函数表）。',
      'WasmGC 提案进一步允许直接操作结构体对象。',
      '引用类型避免大对象跨边界复制。',
    ],
    problem: '解决"Wasm 如何安全地引用 JS 对象而不复制数据"的问题。',
  },
  {
    id: 'WB_15',
    title: '共享内存与原子操作',
    navTitle: '共享内存原子',
    category: '并发多线程',
    path: '/webassembly/wb-15/shared-memory-atomics',
    summary: '用点赞计数器体验 SharedArrayBuffer 与 atomicAdd 的并发安全。',
    demo: WB15SharedMemoryAtomics,
    code: WB15Code,
    language: 'vue',
    principle:
      '共享内存（SharedArrayBuffer）可被多个线程同时读写，普通读写会"丢更新"。原子指令（atomicAdd 等）保证读-改-写一气呵成。共享内存需在模块声明 shared，且页面启用跨源隔离。',
    flow: [
      '模块声明 shared 内存，buffer 是 SharedArrayBuffer。',
      'atomicAdd(addr) 原子地把该位置加一。',
      '多次并发调用不会丢失更新。',
      'JS 读取最终值展示。',
    ],
    notes: [
      '原子指令保证并发下计数不丢失。',
      '常用操作：atomic.load/store/add/sub/wait/notify。',
      'SharedArrayBuffer 需 COOP/COEP 跨源隔离。',
      'atomicAdd 返回操作前的旧值。',
    ],
    problem: '解决"多线程共享数据时如何避免竞态、保证计数正确"的问题。',
  },
  {
    id: 'WB_16',
    title: '多线程与 Web Worker',
    navTitle: '多线程 Worker',
    category: '并发多线程',
    path: '/webassembly/wb-16/multi-threading',
    summary: '启动多个 Worker 并发补货，验证共享内存 + 原子操作的正确性。',
    demo: WB16MultiThreading,
    code: WB16Code,
    language: 'vue',
    principle:
      'Wasm 本身单线程，但可配合 Web Worker 与共享内存利用多核。每个 Worker 实例化同一模块，对共享内存执行原子自增。若用普通读写，结果会因竞态小于预期；原子指令保证结果精确等于 N×K。',
    flow: [
      '主线程创建共享内存并清零。',
      '启动 N 个 Worker，各自实例化 atomic 模块。',
      '每个 Worker 循环执行 atomicAdd K 次。',
      '汇总各 Worker 完成信号，读取最终值。',
    ],
    notes: [
      'Web Worker 提供并行执行，不阻塞主线程。',
      '计算密集任务放 Worker 可避免卡 UI。',
      '需要跨源隔离才能使用 SharedArrayBuffer。',
      '真实项目可用 comlink 等库简化 Worker 通信。',
    ],
    problem: '解决"如何让 Wasm 真正多线程并行、并验证并发正确性"的问题。',
  },
  {
    id: 'WB_17',
    title: 'SIMD 向量指令',
    navTitle: 'SIMD 指令',
    category: '高性能',
    path: '/webassembly/wb-17/simd',
    summary: '用一次 i32x4.add 同时给四个元素调价，理解单指令多数据。',
    demo: WB17Simd,
    code: WB17Code,
    language: 'vue',
    principle:
      'SIMD 用 v128 类型打包 4 个 i32（或 8 个 i16、16 个 i8、4 个 f32），一条指令同时处理多个通道。适合图像处理、音频、矩阵运算等数据并行场景，通常能带来数倍加速。',
    flow: [
      '把两组 4 元素数组分别写入内存。',
      'v128.load 各加载 128 位向量。',
      'i32x4.add 一次完成 4 路加法。',
      'v128.store 把结果写回内存。',
    ],
    notes: [
      '常用指令：i32x4.add、f32x4.mul、v128.load/store。',
      '数据量越大、越规整，SIMD 收益越明显。',
      '不支持 SIMD 的浏览器会抛 CompileError。',
      'SIMD 是数据并行，配合多线程可叠加加速。',
    ],
    problem: '解决"如何用 SIMD 指令让大批量数值运算更快"的问题。',
  },
  {
    id: 'WB_18',
    title: '异常处理：tag 与 throw',
    navTitle: '异常处理',
    category: '高级特性',
    path: '/webassembly/wb-18/exception-handling',
    summary: '用除零保护演示 Wasm 抛出携带负载的异常并由 JS 捕获。',
    demo: WB18ExceptionHandling,
    code: WB18Code,
    language: 'vue',
    principle:
      '异常处理提案让 Wasm 用 tag 定义异常类型、throw 抛出携带 payload 的异常。JS 侧捕获 WebAssembly.Exception，用 e.is(tag) 判断来源、getArg 取出负载。异常可跨 Wasm/JS 边界传递。',
    flow: [
      '模块声明 tag（异常类型）与 div 函数。',
      'div 检测到除数为 0 时 throw tag0 携带 100。',
      'JS 捕获 WebAssembly.Exception。',
      'e.is(tag) 判定后取出 payload 展示。',
    ],
    notes: [
      'tag 定义异常类型，throw 携带 payload。',
      'JS 用 e.is(tag) 判断、getArg 取负载。',
      'Wasm 内部也可用 try/catch 处理异常。',
      '异常不破坏调用栈，可跨边界传递。',
    ],
    problem: '解决"Wasm 如何像高级语言一样抛出并捕获异常"的问题。',
  },
  {
    id: 'WB_19',
    title: '性能对比：Wasm 与 JS',
    navTitle: '性能对比',
    category: '高性能',
    path: '/webassembly/wb-19/performance',
    summary: '对同一递归算法实测 Wasm 与 JS 耗时，理解各自的性能特性。',
    demo: WB19Performance,
    code: WB19Code,
    language: 'vue',
    principle:
      'Wasm 是预编译字节码，执行路径接近机器码、更可预测；JS 依赖 JIT 预热。取多次运行的最小值可排除 JIT 波动。跨边界调用有开销，小函数频繁调用反而更慢，应让计算尽量留在模块内。',
    flow: [
      '同一递归 fib 算法分别用 Wasm 与 JS 实现。',
      '预热后多次测量，取最小值。',
      '对比耗时并绘制柱状图。',
      '校验两版结果一致。',
    ],
    notes: [
      'Wasm 执行更可预测，JS 预热后也能很快。',
      '跨边界调用有开销，避免小函数频繁跨界。',
      '计算密集、可复用、需稳定性能时选 Wasm。',
      '测量时注意预热与多次取样。',
    ],
    problem: '解决"Wasm 与 JS 谁更快、什么场景该选谁"的性能决策问题。',
  },
  {
    id: 'WB_20',
    title: '工具链、编译与部署',
    navTitle: '工具链部署',
    category: '工程实践',
    path: '/webassembly/wb-20/toolchain-deploy',
    summary: '走通从源码到线上的完整流程，用 instantiateStreaming 演示流式加载。',
    demo: WB20ToolchainDeploy,
    code: WB20Code,
    language: 'vue',
    principle:
      'Wasm 应用生命周期：源码（C/Rust/AssemblyScript/WAT）→ 编译器输出 .wasm → WebAssembly.compile 得到不可变 Module → instantiate 注入导入生成实例 → 随静态资源部署。instantiateStreaming 可边下载边编译。',
    flow: [
      '编写源码（C/Rust/AssemblyScript 或手写 WAT）。',
      '用 clang / rustc / asc / wat2wasm 编译成 .wasm。',
      'WebAssembly.instantiateStreaming 流式编译实例化。',
      '调用 exports.add 等函数并部署上线。',
    ],
    notes: [
      '工具链：wabt、emscripten、rustc wasm32、AssemblyScript。',
      'instantiateStreaming 比 instantiate 更快。',
      'Module 可缓存复用（IndexedDB），多次实例化零编译。',
      '部署需 MIME application/wasm，线程特性需 COOP/COEP。',
    ],
    problem: '解决"如何把业务代码编译成 Wasm 并部署到生产环境"的工程问题。',
  },
]
