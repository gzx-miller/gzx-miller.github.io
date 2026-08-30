import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const wasmCodeModules = import.meta.glob<string>('../../demos/wasm-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(async () => loader())
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('wasm-code/')
    ? wasmCodeModules
    : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return loader
}

const WB01WhatIsWasm = createDemo('WB01WhatIsWasm')
const WB01Code = createCodeLoader('wasm-code/WB01WhatIsWasm.wat')
const WB02WatBinary = createDemo('WB02WatBinary')
const WB02Code = createCodeLoader('wasm-code/WB02WatBinary.wat')
const WB03ValueTypes = createDemo('WB03ValueTypes')
const WB03Code = createCodeLoader('wasm-code/WB03ValueTypes.wat')
const WB04Operators = createDemo('WB04Operators')
const WB04Code = createCodeLoader('wasm-code/WB04Operators.wat')
const WB05LinearMemory = createDemo('WB05LinearMemory')
const WB05Code = createCodeLoader('wasm-code/WB05LinearMemory.wat')
const WB06StringsInterop = createDemo('WB06StringsInterop')
const WB06Code = createCodeLoader('wasm-code/WB06StringsInterop.wat')
const WB07FunctionsLocals = createDemo('WB07FunctionsLocals')
const WB07Code = createCodeLoader('wasm-code/WB07FunctionsLocals.wat')
const WB08ImportExportGlobals = createDemo('WB08ImportExportGlobals')
const WB08Code = createCodeLoader('wasm-code/WB08ImportExportGlobals.wat')
const WB09JsInteropNumbers = createDemo('WB09JsInteropNumbers')
const WB09Code = createCodeLoader('wasm-code/WB09JsInteropNumbers.js')
const WB10FunctionTable = createDemo('WB10FunctionTable')
const WB10Code = createCodeLoader('wasm-code/WB10FunctionTable.wat')
const WB11ControlFlow = createDemo('WB11ControlFlow')
const WB11Code = createCodeLoader('wasm-code/WB11ControlFlow.wat')
const WB12MemoryArrays = createDemo('WB12MemoryArrays')
const WB12Code = createCodeLoader('wasm-code/WB12MemoryArrays.wat')
const WB13ImportCallbacks = createDemo('WB13ImportCallbacks')
const WB13Code = createCodeLoader('wasm-code/WB13ImportCallbacks.js')
const WB14ReferenceTypes = createDemo('WB14ReferenceTypes')
const WB14Code = createCodeLoader('wasm-code/WB14ReferenceTypes.wat')
const WB15SharedMemoryAtomics = createDemo('WB15SharedMemoryAtomics')
const WB15Code = createCodeLoader('wasm-code/WB15SharedMemoryAtomics.wat')
const WB16MultiThreading = createDemo('WB16MultiThreading')
const WB16Code = createCodeLoader('wasm-code/WB16MultiThreading.js')
const WB17Simd = createDemo('WB17Simd')
const WB17Code = createCodeLoader('wasm-code/WB17Simd.wat')
const WB18ExceptionHandling = createDemo('WB18ExceptionHandling')
const WB18Code = createCodeLoader('wasm-code/WB18ExceptionHandling.wat')
const WB19Performance = createDemo('WB19Performance')
const WB19Code = createCodeLoader('wasm-code/WB19Performance.js')
const WB20ToolchainDeploy = createDemo('WB20ToolchainDeploy')
const WB20Code = createCodeLoader('wasm-code/WB20ToolchainDeploy.js')

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
    language: 'wat',
    principle:
      'WebAssembly 是一种面向浏览器与通用宿主环境的可移植字节码格式。一个 .wasm 文件由按二进制语法排列的若干"段（section）"构成：开头是魔数 \\0asm（即 00 61 73 6d）与 32 位版本号，随后是类型段、导入段、导出段、代码段等。JS 调用 WebAssembly.instantiate，让引擎先校验再编译并实例化，返回可调用对象。',
    flow: [
      '字节流以魔数 00 61 73 6d 和版本号 01 00 00 00 开头。',
      '类型段（id=1）声明函数签名，代码段（id=10）存放函数体指令。',
      '导出段（id=7）把内部函数 add 暴露给宿主 JS。',
      'instantiate 校验、编译并实例化，得到可调用的 exports.add。',
    ],
    notes: [
      '魔数 0x00 0x61 0x73 0x6d 即 ASCII 的 NUL 加 "asm"，写作 "\\0asm"。',
      '段的 id 决定其用途，且多个段在二进制中按规范顺序出现。',
      'Wasm 指令运行在虚拟 ISA 上，不绑定具体 CPU，因此跨平台可移植。',
      'instantiate 前引擎会先做类型校验，非法模块抛出 CompileError 被拒绝。',
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
    language: 'wat',
    principle:
      'WAT（WebAssembly Text format）是 WebAssembly 的可读文本表示，与二进制一一对应，可视为"源码图纸"。wat2wasm 把它编译成 .wasm，wasm2wat 则反向还原。WAT 遵循操作数栈模型书写：local.get 把值压栈、i32.add 弹出两个操作数并压回一个结果，理解这条指令栈是读懂 WAT 的关键。',
    flow: [
      '(module ...) 是模块根节点，(func ...) 定义函数。',
      'param 声明参数、result 声明返回类型，共同构成函数签名。',
      '指令按栈式书写：local.get 压栈、运算符消费并产出、end 结束函数体。',
      'export 把内部函数以指定名称暴露给宿主。',
    ],
    notes: [
      'WAT 用 ;; 书写行注释。',
      '二进制中每条指令都有固定操作码，如 local.get=0x20、i32.add=0x6a、end=0x0b。',
      'wabt 工具包提供 wat2wasm（文本→二进制）与 wasm2wat（二进制→文本）。',
      '调试时可用 wasm2wat 反编译任意 .wasm 文件。',
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
    language: 'wat',
    principle:
      'WebAssembly 的标量数值类型只有 i32、i64、f32、f64 四种；所有函数签名、局部变量、内存读写都必须显式声明类型。i64 与 JS 互操作必须用 BigInt，f32 是单精度、存在舍入误差。类型信息集中在类型段，函数按索引引用，这既让验证器能快速做安全检查，也让编译器可以高效地下生成代码。',
    flow: [
      '类型段集中声明函数签名（参数与返回值的类型）。',
      '函数体内局部变量按类型声明，用 local.get/set 访问。',
      '内存按字节存放，load/store 按所给类型解释字节宽度。',
      'JS 按导出函数签名对入参做数值类型换算（如 number→i32）后传入。',
    ],
    notes: [
      'i64 作为参数或返回值时，JS 必须用 BigInt 传递。',
      'f32 是 32 位单精度，累加易累积误差，金额类优先用 f64 或 i64。',
      'Wasm 没有字符串、对象、null 等高层类型，需经内存或引用类型表达。',
      '类型系统是验证器安全检查与高效编译的基础。',
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
    language: 'wat',
    principle:
      'Wasm 的指令作用在一个显式操作数栈上：i32.const 把常量压栈，local.get 把函数局部值压栈；运算符从栈顶弹出所需操作数、把结果压回。整数指令（i32.add/mul/div_s/xor/shl 等）与浮点指令（f32.add 等）分属不同操作码、互不共用。',
    flow: [
      '把两个操作数依次压入操作数栈。',
      '运算符按栈顶顺序弹出两个操作数。',
      '计算结果重新压回栈顶。',
      '函数返回时以栈顶值作为签名声明的结果。',
    ],
    notes: [
      '整数除法 div_s 结果向零取整；除数为 0 触发运行时陷阱（RuntimeError）。',
      'i32.shl 等位移指令会屏蔽移位数的高位（等价于对 32 取模），不会抛异常。',
      '浮点指令有独立命名空间，如 0x92 是 f32.add。',
      '指令不直接访问内存，须用显式的 load / store 指令。',
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
    language: 'wat',
    principle:
      '线性内存（linear memory）是一块从地址 0 连续编号的字节数组，是 Wasm 存放可变数据的唯一存储区。JS 与 Wasm 通过同一个 memory.buffer 共享这块存储：JS 写入后 Wasm 可读，Wasm 写入后 JS 也能读到。store8 写一个字节、load8 读一个字节，越界访问会触发 RuntimeError。',
    flow: [
      '用 (memory ...) 声明内存，默认以页为单位分配（1 页 = 64KiB）。',
      'store8(addr, val) 把一个字节写入指定地址。',
      'load8(addr) 从指定地址读出一个字节。',
      'JS 直接用 new Uint8Array(memory.buffer) 查看或修改同一块存储。',
    ],
    notes: [
      '线性内存最小单位是字节，地址从 0 连续编号。',
      'Wasm 侧只能经 load/store 指令访问内存，JS 侧则经 memory.buffer 取得同一块 ArrayBuffer。',
      '越界读写不会破坏宿主进程，引擎会抛出 RuntimeError。',
      '内存按页增长，1 页 = 64KiB = 65536 字节。',
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
    language: 'wat',
    principle:
      'Wasm 没有字符串类型，跨边界传字符串通常用"C 风格字符串"表达：把 UTF-8 字节写入线性内存，用起始地址作为指针，并以结束符 \\0 标记结尾。JS 用 TextEncoder 编码写入、TextDecoder 解码读回；strlen 从指针数到 \\0 得到长度，toupper 遍历并原地替换字节。',
    flow: [
      'JS 用 TextEncoder 把字符串编码后写入线性内存，并在末尾补 \\0。',
      'strlen(ptr) 从指针开始数到 \\0，返回字节长度。',
      'toupper(ptr) 遍历字节，把小写字母原地改为大写。',
      'JS 用 TextDecoder 从内存解码出结果字符串。',
    ],
    notes: [
      'C 风格字符串以 \\0 结尾，长度需由调用方自行维护。',
      'Wasm 端通过指针（内存偏移量）引用字符串，不解析 UTF-8。',
      'toupper 原地修改内存字节，不产生新的字符串对象。',
      'wasm-bindgen 等工具可自动生成字符串编解码胶水代码。',
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
    language: 'wat',
    principle:
      'Wasm 函数由签名、（可选）参数、局部变量与指令体组成。参数与局部变量同处"函数局部索引空间"，用 local.get/set 按索引访问。sum(ptr, n) 对内存中按 4 字节对齐的 i32 数组求累积和：用局部变量 end 记录结束地址、acc 作累加器，循环内累加当前元素并推进指针。',
    flow: [
      '声明签名 (ptr, n) -> i32，含两个参数。',
      '声明局部变量 end（结束地址）与 acc（累加器）并初始化。',
      '循环内累加当前元素，并把指针向后推进 4 字节。',
      '循环结束后把 acc 压栈作为返回值。',
    ],
    notes: [
      '局部变量在函数调用时分配于栈帧，调用返回后随即回收。',
      '参数与局部变量共享同一索引空间，取数类型必须匹配。',
      '函数体以 0x0b（end）收尾。',
      '返回值类型必须与签名声明的 result 类型一致。',
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
    language: 'wat',
    principle:
      'Wasm 通过导入段声明对宿主（JS）能力的依赖，实例化时由 JS 按 importObject 注入实现；通过导出段把内部函数、内存、表格、全局变量暴露给宿主。全局变量的可变性需显式声明：默认不可变，要写入必须在类型前加 mut。',
    flow: [
      'counter 用 (import "env" "log" ...) 声明依赖 env.log : (i32) -> ()。',
      '内部维护一个可变全局变量 count（(mut i32)，初始为 0）。',
      '导出 get / inc / dec / emit 四个函数，并导出全局变量 count。',
      'JS 实例化时注入 log 实现；调用 emit 触发对宿主函数的同步回调。',
    ],
    notes: [
      '导入函数的签名必须与模块声明一致，否则实例化失败。',
      '全局变量默认不可变，需要写入时务必加 mut。',
      '导出项的 kind 编码：函数=0、表格=1、内存=2、全局=3。',
      'Wasm 调用宿主导入的函数是同步的。',
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
    language: 'javascript',
    principle:
      'JS 的 number 传给 Wasm 时按导出函数签名做类型换算：进入 i32 参数会经 ToInt32 截断（丢弃小数、只保留低 32 位）；f32 参数做精度降级；i64 参数则必须用 BigInt 一对一传输。理解这些换算规则，可避免跨边界时出现隐蔽的精度与溢出问题。',
    flow: [
      'JS 把 number 传给 add(a, b) 的两个 i32 参数。',
      '引擎按 i32 签名对入参做 ToInt32 截断。',
      'Wasm 完成相加并返回 i32 结果。',
      'JS 收到普通 number 直接展示。',
    ],
    notes: [
      '小数直接被丢弃（截断），如 3.9 → 3，并非四舍五入。',
      'f32 入参发生精度降级，0.1 存成 f32 后不再是精确的 0.1。',
      'i64 ↔ BigInt 一一对应，不丢失任何位。',
      '对象等引用类型不能直接传入，需走内存指针或 externref。',
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
    language: 'wat',
    principle:
      '函数表（table）按索引存放函数引用，成员用 (elem ...) 段填充。Wasm 通过 call_indirect 在运行时按索引调用表内函数，并校验其签名是否匹配。dispatch(op, a, b) 取出 op 作为索引完成动态分发；JS 还能经 table.get/set 读取或改写表项，实现热替换与插件机制。',
    flow: [
      '声明一张可容纳 4 个 funcref 的表，并用 (elem ...) 填入 add/sub/mul/div。',
      'dispatch 取 op 作索引，经 call_indirect 调用对应函数。',
      'JS 调用 dispatch(op, a, b) 得到对应运算结果。',
      'JS 用 table.set 改写表项后再次调用，行为随之改变。',
    ],
    notes: [
      'call_indirect 在调用前校验目标函数签名，不匹配会抛异常。',
      'JS 用 table.get / table.set 读写表项。',
      '函数表是实现多态、回调与运行时插件化的关键机制。',
      '表格元素类型统一为 funcref（引用类型）。',
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
    language: 'wat',
    principle:
      'Wasm 不使用 goto，只有 block、loop、if/else 三种结构化控制结构，配合 br / br_if 按标签深度跳转来实现分支与循环。递归函数通过 call 调用自身，每次调用占用独立栈帧。fib 用 i32.lt_u 判断基线条件，else 分支递归调用 fib(n-1) 与 fib(n-2) 后求和。',
    flow: [
      '用 i32.lt_u 比较 n 与 2，作为递归基线条件的判断。',
      'if 的 then 分支在 n < 2 时直接返回 n。',
      'else 分支递归调用 fib(n-1) 与 fib(n-2)。',
      '两个递归结果经 i32.add 相加后返回。',
    ],
    notes: [
      '跳转被限定在结构化块内，便于验证与控制流分析。',
      'if 需以 end 收尾，需要返回值时可带 result 类型。',
      'loop 中的 br 0 表示跳回循环体开头，实现迭代。',
      '深递归会占用大量栈帧，过大的 n 可能触发栈溢出异常。',
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
    language: 'wat',
    principle:
      'Wasm 没有数组类型，复合数据用"起始地址 + 元素个数"表示的连续内存来表达：元素按固定步长连续排列，i32 按 4 字节对齐、步长为 4。JS 用 DataView 按小端读写 int32，Wasm 用 sum(ptr, n) 循环累加这一整段 i32 数组。',
    flow: [
      'JS 把价格列表按 4 字节对齐连续写入内存。',
      'Wasm 的 sum(ptr, n) 从 ptr 顺序读取 n 个 i32。',
      '循环累加所有元素得到合计。',
      '返回合计，JS 同时可视化数组分布并展示总数。',
    ],
    notes: [
      '第 i 个元素地址 = ptr + i * 4。',
      '数组无元数据开销，但长度需由调用方自行管理。',
      'JS 用 DataView 的 setInt32 / getInt32 按小端读写。',
      '越界访问会触发 RuntimeError，天然防缓冲区溢出。',
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
    language: 'javascript',
    principle:
      'Wasm 模块只声明其对宿主函数与签名的依赖，不关心具体实现。同一份二进制可分别注入不同的 JS 实现实例化多次，得到完全不同的行为——这是依赖注入思想在 Wasm 中的体现，让业务逻辑与宿主能力解耦并具备可测性。',
    flow: [
      'counter 声明需要导入 env.log : (i32) -> ()。',
      '实例 A 注入"明细日志"实现并实例化。',
      '实例 B 注入"价格累计"实现并实例化。',
      '两个实例相互独立，各自在 emit() 时触发回调。',
    ],
    notes: [
      '导入函数的签名必须与模块声明一致，否则实例化失败。',
      '回调是同步调用，可用于日志、状态更新等场景。',
      '同一二进制 + 不同导入 = 可复用、可测试的模块设计。',
      '高频回调有跨边界开销，性能敏感时应批量传递数据。',
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
    language: 'wat',
    principle:
      'externref 允许 Wasm 持有并原样传回某个 JS 对象的引用而不复制，适合把 DOM 节点、缓存句柄、回调上下文等"不透明"对象交给模块保管。funcref 只能引用函数，是函数表元素（funcref）的类型。引用类型补足了 Wasm 与宿主对象间的高效互操作。',
    flow: [
      'JS 把会员对象作为 externref 传给 identity。',
      'Wasm 在栈上持有该引用并原样返回。',
      'JS 收到同一个引用，可通过 === 判定两者相等。',
      'Wasm 无法直接读写对象内部，若要操作需回调 JS。',
    ],
    notes: [
      'externref 只传递句柄而不复制数据，避免大对象跨边界拷贝。',
      'funcref 只用于函数引用，是函数表的元素类型。',
      'WasmGC 提案进一步让 Wasm 直接操作结构体 / 数组对象。',
      '引用类型让 Wasm 安全地保管宿主对象而无需拷贝。',
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
    language: 'wat',
    principle:
      '共享内存（SharedArrayBuffer）可被多个线程 / Worker 同时读写，但普通 load/store 的"读-改-写"可能被打断而丢失更新。原子指令（本 demo 用 i32.atomic.rmw.add 实现 atomicAdd）保证该操作一气呵成。内存需在模块声明为 shared，页面还须启用跨源隔离（COOP/COEP）。',
    flow: [
      '模块以 (memory 1 1 shared) 声明共享内存，其 buffer 为 SharedArrayBuffer。',
      'atomicAdd(addr) 原子地把该 i32 位置加一。',
      '多次并发调用不会丢失更新。',
      'JS 通过 Int32Array 视图读取最终值展示。',
    ],
    notes: [
      '原子指令保证并发下计数不丢失。',
      '常用操作：atomic.load / store / add / sub / wait / notify。',
      'SharedArrayBuffer 需 COOP/COEP 跨源隔离才能启用。',
      'atomicAdd（rmw.add）返回操作前的旧值。',
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
    language: 'javascript',
    principle:
      'Wasm 本身是单线程的，但可配合 Web Worker 与共享内存真正利用多核。每个 Worker 用同一份模块实例化，对共享内存执行原子自增。若换成普通读写，结果会因竞态而小于预期；用原子指令则能保证最终值精确等于 N × K。',
    flow: [
      '主线程创建共享内存并把计数清零。',
      '启动 N 个 Worker，各自实例化同一份 atomic 模块。',
      '每个 Worker 循环调用 atomicAdd 共 K 次。',
      '收集各 Worker 的完成信号，读取最终值并对比预期 N×K。',
    ],
    notes: [
      'Web Worker 并行执行，不阻塞主线程。',
      '计算密集任务放入 Worker 可避免卡顿 UI。',
      '需跨源隔离才能使用 SharedArrayBuffer 进行共享。',
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
    language: 'wat',
    principle:
      'SIMD 用 128 位的 v128 类型一次性打包多个标量（4 个 i32、8 个 i16、16 个 i8 或 4 个 f32），一条指令同时操作所有"通道（lane）"。vadd 先用 v128.load 把内存中的两组向量载入，经 i32x4.add 完成 4 路加法，再 v128.store 写回。这类数据并行适合图像、音频、矩阵等批量运算。',
    flow: [
      '把两组各 4 个 i32 的元素分别写入内存。',
      'v128.load 从 a、b 地址各加载一个 128 位向量。',
      'i32x4.add 一条指令完成 4 路加法。',
      'v128.store 把结果向量写回 dest 地址。',
    ],
    notes: [
      '常用指令：i32x4.add、f32x4.mul、v128.load / v128.store。',
      '数据越规整、规模越大，SIMD 收益越明显。',
      '不支持的浏览器会抛 CompileError，需先做能力检测。',
      'SIMD 是数据并行，可与多线程组合叠加加速。',
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
    language: 'wat',
    principle:
      '异常处理（exception handling）提案让 Wasm 用 (tag ...) 声明异常类型、用 throw 抛出携带 payload 的异常。JS 侧捕获到的是 WebAssembly.Exception，可调用 e.is(tag) 判断是否来自某个 tag，用 e.getArg(tag, i) 取出负载。异常可跨 Wasm/JS 边界传递而不破坏调用栈。',
    flow: [
      '模块声明 (tag $e (param i32)) 定义一个携带 i32 负载的异常类型，并定义 div 函数。',
      'div 检测到除数为 0 时 throw $e 并携带负载 100。',
      'JS 侧捕获到 WebAssembly.Exception。',
      '用 e.is(tag) 判定来源、getArg(tag, 0) 取出负载并展示。',
    ],
    notes: [
      'tag 定义异常类型，throw 时可携带若干 payload 参数。',
      'JS 用 e.is(tag) 判断来源、getArg(tag, i) 取负载。',
      'Wasm 内部也可用 try/catch 就地处理异常，无需回到 JS。',
      '异常可跨 Wasm/JS 边界传递，不破坏调用栈。',
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
    language: 'javascript',
    principle:
      'Wasm 是预编译的字节码，执行路径接近机器码、更可预测；JS 依赖 JIT 对热点做内联与优化、需要预热。本 demo 对同一递归 fib 分别用 Wasm 与 JS 实现，取多次运行的最小值来剔除 JIT 波动后再做对比。跨边界的每次调用都有固定开销，小函数高频跨界反而更慢，应尽量把计算留在模块内。',
    flow: [
      '同一递归 fib 算法分别用 Wasm 与 JS 各实现一份。',
      '先预热，再多次测量并取最小值。',
      '对比两者耗时并绘制柱状图。',
      '最后校验两版计算结果一致。',
    ],
    notes: [
      'Wasm 执行更可预测；JS 预热后也能很快。',
      '跨边界调用有固定开销，避免小函数频繁跨界。',
      '计算密集、可复用、需稳定性能时才优先选 Wasm。',
      '测量要预热并多次取样，取最小值以减小抖动。',
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
    language: 'javascript',
    principle:
      '一个 Wasm 应用遵循"源码 → 编译器 → 二进制 → 编译/实例化 → 部署"的链路：C/Rust/AssemblyScript 或手写 WAT 经 clang / rustc / asc / wat2wasm 产出 .wasm；WebAssembly.compile 得到不可变的 Module，instantiate 注入导入并生成实例；instantiateStreaming 可在下载的同时编译，是生产环境推荐的加载方式。',
    flow: [
      '编写源码（C/Rust/AssemblyScript，或手写 WAT）。',
      '用 clang / rustc / asc / wat2wasm 编译成 .wasm。',
      '用 WebAssembly.instantiateStreaming 边下载边编译并实例化。',
      '调用 exports.add 等函数，随后随静态资源部署上线。',
    ],
    notes: [
      '常用工具链：wabt、emscripten、rustc（wasm32 目标）、AssemblyScript。',
      'instantiateStreaming 并行下载与编译，比 instantiate 更快。',
      'Module 可缓存复用（如配 IndexedDB），多次实例化免去重复编译。',
      '部署需正确 MIME（application/wasm），线程特性还需 COOP/COEP。',
    ],
    problem: '解决"如何把业务代码编译成 Wasm 并部署到生产环境"的工程问题。',
  },
]
