import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })
const nodejsCodeModules = import.meta.glob<string>('../../demos/nodejs-code/*.js', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('react-jsx/')
    ? jsxCodeModules
    : path.startsWith('state-react/')
      ? stateCodeModules
      : path.startsWith('js-code/')
        ? jsCodeModules
        : path.startsWith('ts-code/')
          ? tsCodeModules
          : path.startsWith('style-code/')
            ? styleCodeModules
            : path.startsWith('nodejs-code/')
              ? nodejsCodeModules
              : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return loader
}

const D01ModuleSystem = createDemo('D01ModuleSystem')
const D01Code = createCodeLoader('nodejs-code/D01ModuleSystem.js')
const D02PathUrl = createDemo('D02PathUrl')
const D02Code = createCodeLoader('nodejs-code/D02PathUrl.js')
const D03FileSystem = createDemo('D03FileSystem')
const D03Code = createCodeLoader('nodejs-code/D03FileSystem.js')
const D04EventEmitter = createDemo('D04EventEmitter')
const D04Code = createCodeLoader('nodejs-code/D04EventEmitter.js')
const D05Streams = createDemo('D05Streams')
const D05Code = createCodeLoader('nodejs-code/D05Streams.js')
const D06HttpServer = createDemo('D06HttpServer')
const D06Code = createCodeLoader('nodejs-code/D06HttpServer.js')
const D07ProcessEnv = createDemo('D07ProcessEnv')
const D07Code = createCodeLoader('nodejs-code/D07ProcessEnv.js')
const D08Concurrency = createDemo('D08Concurrency')
const D08Code = createCodeLoader('nodejs-code/D08Concurrency.js')
const D09ErrorLogging = createDemo('D09ErrorLogging')
const D09Code = createCodeLoader('nodejs-code/D09ErrorLogging.js')
const D10NodeTest = createDemo('D10NodeTest')
const D10Code = createCodeLoader('nodejs-code/D10NodeTest.js')
const D11Security = createDemo('D11Security')
const D11Code = createCodeLoader('nodejs-code/D11Security.js')
const D12PackageManagement = createDemo('D12PackageManagement')
const D12Code = createCodeLoader('nodejs-code/D12PackageManagement.js')
const D13ExpressFastify = createDemo('D13ExpressFastify')
const D13Code = createCodeLoader('nodejs-code/D13ExpressFastify.js')
const D14WebSocket = createDemo('D14WebSocket')
const D14Code = createCodeLoader('nodejs-code/D14WebSocket.js')
const D15Database = createDemo('D15Database')
const D15Code = createCodeLoader('nodejs-code/D15Database.js')
const D16WorkerThreads = createDemo('D16WorkerThreads')
const D16Code = createCodeLoader('nodejs-code/D16WorkerThreads.js')
const D17EventLoop = createDemo('D17EventLoop')
const D17Code = createCodeLoader('nodejs-code/D17EventLoop.js')
const D18Buffer = createDemo('D18Buffer')
const D18Code = createCodeLoader('nodejs-code/D18Buffer.js')
const D19ChildProcess = createDemo('D19ChildProcess')
const D19Code = createCodeLoader('nodejs-code/D19ChildProcess.js')
const D20Cluster = createDemo('D20Cluster')
const D20Code = createCodeLoader('nodejs-code/D20Cluster.js')
const D21Crypto = createDemo('D21Crypto')
const D21Code = createCodeLoader('nodejs-code/D21Crypto.js')
const D22PerfHooks = createDemo('D22PerfHooks')
const D22Code = createCodeLoader('nodejs-code/D22PerfHooks.js')
const D23Https = createDemo('D23Https')
const D23Code = createCodeLoader('nodejs-code/D23Https.js')
const D24Cli = createDemo('D24Cli')
const D24Code = createCodeLoader('nodejs-code/D24Cli.js')
const D25Timers = createDemo('D25Timers')
const D25Code = createCodeLoader('nodejs-code/D25Timers.js')
const D26NetTcp = createDemo('D26NetTcp')
const D26Code = createCodeLoader('nodejs-code/D26NetTcp.js')
const D27Zlib = createDemo('D27Zlib')
const D27Code = createCodeLoader('nodejs-code/D27Zlib.js')
const D28Os = createDemo('D28Os')
const D28Code = createCodeLoader('nodejs-code/D28Os.js')
const D29Dns = createDemo('D29Dns')
const D29Code = createCodeLoader('nodejs-code/D29Dns.js')
const D30Readline = createDemo('D30Readline')
const D30Code = createCodeLoader('nodejs-code/D30Readline.js')


export const lessons: Lesson[] = [
{
    id: 'D_01', title: 'Node.js 运行时与模块系统', navTitle: '模块系统', category: '运行时与模块',
    path: '/nodejs/d-1/module-system', summary: '对比 ES Modules 与 CommonJS 的加载机制、导出绑定与互操作边界。',
    demo: D01ModuleSystem, code: D01Code, language: 'javascript',
    principle: 'CommonJS 在运行时同步解析 require/module.exports，导出的是值拷贝；ESM 在编译期静态确定 import/export 关系，导出是实时绑定，支持 Tree Shaking 与顶层 await。两者由文件扩展名（.mjs/.cjs）或 package.json 的 type 字段决定，边界处需约定互操作方式。',
    flow: ['用 package.json 的 type 或 .mjs/.cjs 后缀固定模块格式。', 'ESM 侧用 import/export 组织命名导出与默认导出。', '跨格式加载用动态 import()，内置模块统一加 node: 前缀。'],
    notes: ['ESM 没有 __dirname/__filename，需用 import.meta.url 结合 fileURLToPath 换算。', 'CJS 无法同步 require 一个 ESM 模块，只能 await import()。', '不要让同一个目录里的 .js 同时以两种隐式格式被解释。'],
    problem: '解决"Node 项目该选择哪种模块格式以及两者为何报错"的问题。',
  },
{
    id: 'D_02', title: '路径、URL 与跨平台文件定位', navTitle: '路径与 URL', category: '运行时与模块',
    path: '/nodejs/d-2/path-url', summary: '用 node:path 与 node:url 做跨平台路径处理，并在 ESM 中定位当前模块。',
    demo: D02PathUrl, code: D02Code, language: 'javascript',
    principle: '路径字符串不跨平台可靠（分隔符与盘符不同），URL 又是另一种表示；path 负责解析/拼接/规范化路径，fileURLToPath 与 pathToFileURL 在 file:// URL 与文件路径之间换算，import.meta.url 是 ESM 定位自身文件的关键。',
    flow: ['用 path.resolve 得到绝对基准路径。', '用 path.join 拼装相对片段并规范化。', '在 ESM 中通过 fileURLToPath(import.meta.url) 拿到当前文件路径。'],
    notes: ['path.resolve 从右向左解析，遇到绝对路径即停止；join 只做拼接与规范化。', '跨平台应交给 path 处理，不要手写 / 或 \\ 分隔符。', 'path.win32 与 path.posix 可显式按平台指定解析规则。'],
    problem: '解决"Windows 与 Linux 路径差异及 ESM 文件定位"的问题。',
  },
{
    id: 'D_03', title: '异步文件系统操作', navTitle: '文件系统', category: '文件与事件',
    path: '/nodejs/d-3/file-system', summary: '用 fs/promises 异步读写文件、管理目录、获取文件信息并规范处理错误码。',
    demo: D03FileSystem, code: D03Code, language: 'javascript',
    principle: 'fs/promises 提供 Promise 化的异步文件 API，不阻塞事件循环；readFile/writeFile 覆盖文本与二进制读写，mkdir/readdir/stat/copyFile/rename/cp 覆盖目录与文件管理，文件操作错误以 err.code（ENOENT/EACCES 等）区分。',
    flow: ['用 fs.promises.readFile 指定编码读文本，或用无编码形式读 Buffer。', '用 writeFile/appendFile（flag: a）区分覆盖与追加。', '用 try/catch 捕获 fs 错误，按 err.code 分支处理不存在与权限问题。'],
    notes: ['同步 fs API 会阻塞事件循环，仅在启动初始化阶段少量使用。', '大文件改用流处理，不要用 readFile 一次读入内存。', '递归创建/删除目录需配合 recursive 与 force 选项。'],
    problem: '解决"如何可靠且不阻塞地读写 Node.js 文件"的问题。',
  },
{
    id: 'D_04', title: 'EventEmitter 与事件解耦', navTitle: '事件发布订阅', category: '文件与事件',
    path: '/nodejs/d-4/event-emitter', summary: '在自定义事件类上理解 on/once 监听、emit 派发与监听器生命周期管理。',
    demo: D04EventEmitter, code: D04Code, language: 'javascript',
    principle: 'EventEmitter 在同一进程内同步派发监听器（emit 触发、on/once 注册、off 移除），适合把『状态变更』与『响应逻辑』解耦；触发是同步的，监听器异常会沿 emit 调用栈向上抛，跨进程/跨服务的可靠事件需借助消息队列兜底。',
    flow: ['为业务事件定义稳定名称和载荷结构（payload）。', '订阅方通过 on 或 once 注册监听器。', '不再需要时调用 removeListener 或 off 防止内存泄漏。'],
    notes: ['监听器内部抛错会沿 emit 调用栈向上抛出，必要时包 try/catch。', 'error 事件如果没有监听器，Node.js 会把异常抛出并终止进程。', 'setMaxListeners 调大之前先排查为什么有这么多订阅。'],
    problem: '解决"同一进程内多个模块如何响应同一业务事件"的问题。',
  },
{
    id: 'D_05', title: 'Stream、管道与背压', navTitle: '流与背压', category: '流与网络',
    path: '/nodejs/d-5/streams', summary: '以大报表导出理解 Readable、Writable、pipeline 与背压。',
    demo: D05Streams, code: D05Code, language: 'javascript',
    principle: '流按块处理数据，避免一次性把完整文件加载到内存；背压机制让生产速度服从消费速度，pipeline 统一连接各阶段并自动传播错误与清理资源，是处理大文件和网络数据的关键。',
    flow: ['Readable 流分块产出数据。', 'Transform 流在管道中转换每个数据块。', '通过 pipeline 串到 Writable 目标并自动处理错误。'],
    notes: ['优先使用 stream/promises pipeline 而不是手工 pipe 链。', '对象模式与字节模式的 highWaterMark 含义不同，需按数据形态调整。', '背压信号返回 false 时暂停读取，恢复时再读。'],
    problem: '解决"大文件和网络数据如何低内存传输且不压垮消费者"的问题。',
  },
{
    id: 'D_06', title: '原生 HTTP 服务与路由', navTitle: 'HTTP 服务', category: '流与网络',
    path: '/nodejs/d-6/http-server', summary: '从 request/response 构建最小 JSON API，理解方法、状态码与响应头。',
    demo: D06HttpServer, code: D06Code, language: 'javascript',
    principle: 'node:http 提供底层流式请求与响应；服务需要显式匹配 method 和 URL、限制请求体大小、设置内容类型并统一结束响应；缺少这些约定就会留下安全漏洞和资源耗尽风险。',
    flow: ['从 req 读取 method、URL 和请求头。', '路由到对应处理器并校验输入。', '设置状态码和响应头后写入响应并结束。'],
    notes: ['请求体是 Readable 流，必须限制最大体积防止 DoS。', '生产服务还需要超时、代理转发和优雅关闭。', 'setHeader 必须在 write/end 之前调用。'],
    problem: '解决"Node.js 如何直接接收 HTTP 请求并返回规范响应"的问题。',
  },
{
    id: 'D_07', title: '进程、环境变量与优雅退出', navTitle: '进程与配置', category: '进程与并发',
    path: '/nodejs/d-7/process-env', summary: '集中校验环境配置，并在 SIGTERM 时停止接流量和释放资源。',
    demo: D07ProcessEnv, code: D07Code, language: 'javascript',
    principle: 'process 提供参数、环境、信号和退出状态；配置应在启动阶段完成校验，关闭时先停止接新请求，再等待存量任务结束，最后释放连接池等资源，让进程退出对外表现为"无请求失败、无连接泄漏"。',
    flow: ['启动时读取并验证环境变量。', '注册 SIGTERM/SIGINT 信号处理函数。', '关闭服务器和连接池后设置退出码。'],
    notes: ['不要在业务代码到处读取 process.env，集中封装便于测试。', '不要用 process.exit 强行截断异步清理，会丢失未完成的请求。', 'K8s 默认会给 30 秒优雅退出时间，业务侧应可配置。'],
    problem: '解决"服务如何管理多环境配置并在部署时安全退出"的问题。',
  },
{
    id: 'D_08', title: '异步并发控制与任务池', navTitle: '并发控制', category: '进程与并发',
    path: '/nodejs/d-8/concurrency', summary: '限制批处理并发度，避免耗尽文件句柄和下游连接。',
    demo: D08Concurrency, code: D08Code, language: 'javascript',
    principle: '异步 I/O 可以并发等待，但无限制的 Promise.all 会同时占用文件句柄、数据库连接和下游带宽；任务池以固定 worker 数限制在途任务数，把"无界并发"变成"有界并发"，既提速又保护下游。',
    flow: ['建立待处理任务队列。', '启动固定数量的并发工作函数（worker）同时拉取任务。', '每个 worker 完成后领取下一个任务，直到队列清空。'],
    notes: ['CPU 密集任务考虑 Worker Threads 或子进程，不在本池中跑。', '并发上限应结合下游容量压测，不要拍脑袋设。', '任务失败时记录错误并继续，避免毒丸任务阻塞整条流水线。'],
    problem: '解决"批量异步任务如何提速，又能控制并发不压垮系统"的问题。',
  },
{
    id: 'D_09', title: '错误边界与结构化日志', navTitle: '错误与日志', category: '可靠性',
    path: '/nodejs/d-9/error-logging', summary: '区分操作型错误与程序错误，并记录可检索的结构化上下文。',
    demo: D09ErrorLogging, code: D09Code, language: 'javascript',
    principle: '预期的操作型错误（参数缺失、权限不足）应转换为稳定错误码和合适 HTTP 响应；未知程序错误（崩溃级 Bug）应记录堆栈、请求 ID、用户上下文后由进程管理器重启，避免继续运行在不一致状态。',
    flow: ['在系统边界用 try/catch 捕获异步错误。', '把内部错误映射为公开错误码和 HTTP 状态。', '以 JSON 结构记录请求 ID 和内部原因便于检索。'],
    notes: ['日志不得包含令牌、密码和个人敏感信息，必要时做脱敏。', 'unhandledRejection 不应只打印后继续运行，要么退出要么上报。', '统一日志字段（traceId、userId）方便跨服务追踪。'],
    problem: '解决"服务端如何分类错误、返回合适响应并高效排查"的问题。',
  },
{
    id: 'D_10', title: '内置 node:test 测试运行器', navTitle: 'Node 测试', category: '可靠性',
    path: '/nodejs/d-10/node-test', summary: '使用 node:test 与 assert 编写单元测试、子测试和异步测试。',
    demo: D10NodeTest, code: D10Code, language: 'javascript',
    principle: 'Node 内置的 node:test 测试运行器支持并发、Mock、覆盖率统计和多种报告格式，无需引入 Jest/Vitest 等第三方框架即可为核心模块建立可靠测试套件，特别适合库和 CLI 工具。',
    flow: ['导入 node:test 与 node:assert/strict。', '按行为组织 test 和子测试 subtest。', '在 CI 中输出覆盖率与机器可读报告（如 TAP、JUnit）。'],
    notes: ['每个测试应可独立运行，不要依赖测试执行顺序和共享全局状态。', '使用 mock 时注意清理，避免污染后续测试。', 'node --test 默认并行运行多个测试文件；同一文件内的测试默认顺序执行，需要并发时可显式设置 concurrency。'],
    problem: '解决"如何使用 Node.js 自带能力建立可靠测试套件"的问题。',
  },
{
    id: 'D_11', title: '服务端输入与路径安全', navTitle: '输入安全', category: '安全与依赖',
    path: '/nodejs/d-11/security', summary: '防止路径穿越、注入、超大请求和敏感信息泄漏。',
    demo: D11Security, code: D11Code, language: 'javascript',
    principle: '所有外部输入都不可信；服务端需要白名单校验、规范化路径、最小权限访问、体积限制和参数化查询等多层防护，每层防御都应单独可失败，避免一次失守就全面崩溃。',
    flow: ['在系统边界解析并校验输入（类型、长度、范围）。', '规范化路径或字段后确认资源仍在允许范围。', '使用最小权限账户访问文件、数据库和外部服务。'],
    notes: ['前端校验不能替代服务端校验，绕过前端非常容易。', '错误响应不要暴露内部路径、堆栈和库版本。', 'path.join 后还要用 path.resolve 校验是否在 base 目录内。'],
    problem: '解决"Node 服务如何抵御常见输入攻击和敏感信息泄漏"的问题。',
  },
{
    id: 'D_12', title: '包管理、SemVer 与可重复安装', navTitle: '依赖管理', category: '安全与依赖',
    path: '/nodejs/d-12/package-management', summary: '理解 package.json、锁文件、版本范围、脚本和依赖审计。',
    demo: D12PackageManagement, code: D12Code, language: 'javascript',
    principle: 'package.json 声明意图，锁文件记录完整依赖图；CI 使用冻结锁文件，SemVer 范围决定允许升级的版本集合。',
    flow: ['区分运行依赖和开发依赖。', '提交并审查锁文件变更。', 'CI 冻结安装并执行依赖审计。'],
    notes: ['不要盲目自动升级主版本。', '安装脚本具有执行代码权限，需要审查来源。'],
    problem: '解决"如何让团队和 CI 安装完全一致且可审计的依赖"的问题。',
  },
{
    id: 'D_13', title: 'Express 与 Fastify 路由对比', navTitle: 'Express/Fastify', category: 'Web 框架',
    path: '/nodejs/d-13/express-fastify', summary: '对比 Express 中间件链和 Fastify Schema 验证两种路由模式。',
    demo: D13ExpressFastify, code: D13Code, language: 'javascript',
    principle: 'Express 以顺序执行的中间件链（调用 next 传递）处理请求，灵活但约束较少；Fastify 以生命周期钩子与插件组织逻辑，并用 JSON Schema 在启动阶段编译路由、验证输入输出、加速序列化，适合接口契约严格的项目。',
    flow: ['对比 Express 的 app.use 中间件链与 Fastify 的 hooks/插件体系。', '理解 Fastify 的 Schema 如何驱动输入验证与输出序列化。', '依据性能、类型与生态需求选择框架。'],
    notes: ['Express 中间件是线性 next 传递，洋葱式模型属于 Koa。', 'Fastify 的 Schema 同时做输入验证与输出序列化加速，并结合 pino 内置日志。'],
    problem: '解决"Node.js Web 框架如何选择，以及路由和验证的最佳实践"的问题。',
  },
{
    id: 'D_14', title: 'WebSocket 实时通信', navTitle: 'WebSocket', category: 'Web 框架',
    path: '/nodejs/d-14/websocket', summary: '用 WebSocket 实现实时聊天，掌握连接、心跳、广播和重连策略。',
    demo: D14WebSocket, code: D14Code, language: 'javascript',
    principle: 'WebSocket 提供双向持久连接，服务端可主动推送消息；心跳检测连接活性，断线重连保证可用性，广播将消息分发给所有连接的客户端。',
    flow: ['建立 WebSocket 连接并完成握手。', '定时发送心跳检测连接状态。', '断线后指数退避重连。'],
    notes: ['WebSocket 连接是持久资源，需要管理连接池。', '生产环境通常需要 Redis Pub/Sub 实现多实例广播。'],
    problem: '解决"如何实现服务端主动推送的双向实时通信"的问题。',
  },
{
    id: 'D_15', title: '数据库连接与迁移', navTitle: '数据库', category: '数据与存储',
    path: '/nodejs/d-15/database', summary: '比较原生 SQL、查询构建器和 ORM，掌握数据库迁移工作流。',
    demo: D15Database, code: D15Code, language: 'javascript',
    principle: '数据库访问有三种层次：原生 SQL 最灵活，查询构建器平衡灵活与安全，ORM 提供对象映射但隐藏复杂度；迁移脚本管理 Schema 变更，支持向上和向下操作。',
    flow: ['配置连接池控制并发。', '选择适合项目的数据访问层。', '用迁移脚本管理 Schema 版本。'],
    notes: ['连接池大小要根据并发和数据库限制调整。', '迁移脚本必须可重复执行且幂等。'],
    problem: '解决"Node.js 项目如何选择数据访问层并管理数据库 Schema 变更"的问题。',
  },
{
    id: 'D_16', title: 'Worker 线程与 CPU 密集任务', navTitle: 'Worker 线程', category: '进程与并发',
    path: '/nodejs/d-16/worker-threads', summary: '用 Worker 线程卸载 CPU 密集计算，保持事件循环响应。',
    demo: D16WorkerThreads, code: D16Code, language: 'javascript',
    principle: 'Node.js 的事件循环是单线程的，CPU 密集任务会阻塞其他请求；Worker Threads 在独立线程中执行计算，通过 MessageChannel 与主线程通信，保持事件循环畅通。',
    flow: ['识别 CPU 密集型瓶颈。', '将计算逻辑移到 Worker 线程。', '通过消息传递返回计算结果。'],
    notes: ['Worker 适合 CPU 密集，不适合 I/O 密集。', ' Piscina 等库提供 Worker 池管理。'],
    problem: '解决"CPU 密集任务如何避免阻塞 Node.js 事件循环"的问题。',
  },
{
    id: 'D_17', title: '事件循环与宏微任务', navTitle: '事件循环', category: '事件循环',
    path: '/nodejs/d-17/event-loop', summary: '理解 Node.js 事件循环的六个阶段，以及微任务（nextTick、Promise）和宏任务（setTimeout、setImmediate）的执行顺序。',
    demo: D17EventLoop, code: D17Code, language: 'javascript',
    principle: 'Node.js 事件循环分为六个阶段（Timers、Pending、Idle/Prepare、Poll、Check、Close），微任务（process.nextTick、Promise.then）在每个阶段结束后优先执行。',
    flow: ['理解事件循环的六个阶段。', '掌握微任务和宏任务的执行顺序。', '学会使用 nextTick 和 setImmediate。'],
    notes: ['process.nextTick 优先级高于 Promise.then。', 'setImmediate 在 Check 阶段执行，Node.js 特有。'],
    problem: '解决"异步代码执行顺序不符合预期，以及定时器回调为什么不按时执行"的问题。',
  },
{
    id: 'D_18', title: 'Buffer 与二进制数据处理', navTitle: 'Buffer', category: '二进制',
    path: '/nodejs/d-18/buffer', summary: '理解 Buffer 的创建、编码转换、拼接和截取，掌握二进制数据处理的基本操作。',
    demo: D18Buffer, code: D18Code, language: 'javascript',
    principle: 'Buffer 是 Uint8Array 的子类，用于表示固定长度的字节序列；Node.js 中文件 I/O、网络传输、加密等操作都以 Buffer 为纽带。',
    flow: ['学习 Buffer 的创建方式（from、alloc、allocUnsafe）。', '掌握不同编码（utf8、hex、base64）的转换。', '理解 Buffer 拼接和截取的最佳实践。'],
    notes: ['优先用 Buffer.from/alloc 创建，不要用已废弃的 new Buffer()。', 'buf.slice 返回共享内存的视图，修改会反映到原 Buffer。', '大量片段拼接时先估算总长再预分配，避免循环里反复 Buffer.concat。'],
    problem: '解决"如何处理二进制数据、文件内容编码转换、以及 Stream 数据拼接"的问题。',
  },
{
    id: 'D_19', title: 'child_process 子进程', navTitle: '子进程', category: '多进程',
    path: '/nodejs/d-19/child-process', summary: '对比 exec、execFile、spawn、fork 四种创建子进程方案的能力与安全性。',
    demo: D19ChildProcess, code: D19Code, language: 'javascript',
    principle: 'child_process 通过 exec（缓冲式运行 Shell 命令，有注入风险）、execFile（绕过 Shell 直接执行可执行文件）、spawn（流式返回 stdout/stderr，适合长输出）、fork（专为 Node.js 模块并自带 IPC）四种方式创建子进程。',
    flow: ['小输出、简单命令用 exec，执行可执行文件优先用 execFile。', '长输出/实时日志用 spawn 流式读取 stdout/stderr。', 'Node.js 子进程用 fork 并通过 send/on(message) 做 IPC。'],
    notes: ['exec 会创建 Shell，用户输入不可拼接进命令串，安全首选 execFile/spawn。', '子进程有独立内存与事件循环，务必监听 error 并管理生命周期。', '可用 node:child_process/promises 获得 Promise 版本 API。'],
    problem: '解决"如何在 Node.js 中执行外部命令、利用多核 CPU、以及隔离崩溃风险"的问题。',
  },
{
    id: 'D_20', title: 'cluster 多核利用', navTitle: 'cluster', category: '多进程',
    path: '/nodejs/d-20/cluster', summary: '使用 cluster 模块创建多进程架构，充分利用多核 CPU，提高应用吞吐量和可靠性。',
    demo: D20Cluster, code: D20Code, language: 'javascript',
    principle: 'cluster 模块基于 child_process.fork()，主进程负责接收连接并分发给工作进程，工作进程各自独立运行，共享服务器端口；默认负载均衡策略为轮询。',
    flow: ['理解 cluster 的主从架构。', '学习工作进程的创建和生命周期管理。', '掌握负载均衡和优雅退出策略。'],
    notes: ['工作进程数通常设置为 CPU 核心数。', '工作进程崩溃后主进程应自动 fork 新进程。'],
    problem: '解决"单线程 Node.js 无法充分利用多核 CPU，以及单点故障导致整个应用不可用"的问题。',
  },
{
    id: 'D_21', title: 'crypto 加密实践', navTitle: '加密', category: '安全',
    path: '/nodejs/d-21/crypto', summary: '使用 crypto 模块进行哈希、HMAC、对称加密等操作，掌握密码存储和数据签名的最佳实践。',
    demo: D21Crypto, code: D21Code, language: 'javascript',
    principle: 'node:crypto 用 createHash/createHmac 做完整性校验与消息认证，用 createCipheriv(aes-256-gcm) 做带认证标签的对称加解密，用 RSA 公私钥做加密与签名，并用 randomBytes/randomUUID 生成安全随机数；密文比较应使用 timingSafeEqual 防时序攻击。',
    flow: ['用 createHash 计算 sha256 完整性哈希，加密钥用 createHmac 做消息认证。', '用 createCipheriv(aes-256-gcm) 加解密，保存好随机 IV 与 authTag。', '密码存储使用 scrypt/PBKDF2 慢哈希或 bcrypt/argon2，并用 timingSafeEqual 校验。'],
    notes: ['MD5/SHA-1 仅用于非安全场景，不要用于密码哈希或签名认证。', 'AES-GCM 自带认证标签，IV 每次加密都要随机生成。', '密钥通过环境变量或密钥管理服务提供，不要硬编码进代码。'],
    problem: '解决"用户密码如何安全存储、API 请求如何防篡改、以及敏感数据如何加密传输"的问题。',
  },
{
    id: 'D_22', title: 'perf_hooks 性能分析', navTitle: '性能分析', category: '性能',
    path: '/nodejs/d-22/perf-hooks', summary: '使用 perf_hooks 模块进行性能打点和测量，定位函数级别的性能瓶颈。',
    demo: D22PerfHooks, code: D22Code, language: 'javascript',
    principle: 'perf_hooks 提供与浏览器 performance API 兼容的接口；通过 performance.mark() 打点、performance.measure() 测量区间、PerformanceObserver 监听性能条目。',
    flow: ['学习 performance.mark() 和 measure() 的使用。', '掌握 PerformanceObserver 监听性能条目。', '了解如何配合 clinic.js 做专业性能分析。'],
    notes: ['perf_hooks 是内置模块，无需安装。', '生产环境应采样性能数据，避免全量收集影响性能。'],
    problem: '解决"如何定位 Node.js 应用的性能瓶颈，以及函数执行时间是否符合预期"的问题。',
  },
{
    id: 'D_23', title: 'HTTPS 与 TLS 配置', navTitle: 'HTTPS', category: '网络',
    path: '/nodejs/d-23/https', summary: '理解 HTTPS 的原理，掌握 Node.js HTTPS 服务器的创建和 TLS 配置。',
    demo: D23Https, code: D23Code, language: 'javascript',
    principle: 'HTTPS 基于 TLS，服务端需持有私钥与证书（证书链），https 模块据此建立安全连接；应配置最低 TLS 版本（TLSv1.2/1.3）与强密码套件，客户端默认校验证书，生产环境使用 CA 签发的正式证书并自动续期。',
    flow: ['理解 HTTPS 和 TLS/SSL 的基本原理。', '学习使用 OpenSSL 创建自签名证书。', '掌握 Node.js HTTPS 服务器的配置。'],
    notes: ['生产环境务必启用 HTTPS，配合 HSTS 强制全站加密。', '禁用 SSLv3 与 TLS 1.0/1.1，最低放宽到 TLS 1.2，优先 TLS 1.3。', '私钥文件收紧权限并妥善保管，不要提交进代码仓库。'],
    problem: '解决"如何启用 HTTPS、如何选择合适的 TLS 版本和加密套件、以及证书如何申请和管理"的问题。',
  },
{
    id: 'D_24', title: 'CLI 参数与命令行工具', navTitle: 'CLI', category: 'CLI',
    path: '/nodejs/d-24/cli', summary: '解析命令行参数，使用 commander 等库构建专业的命令行工具。',
    demo: D24Cli, code: D24Code, language: 'javascript',
    principle: 'process.argv 提供原始参数（前两项分别是 node 可执行路径与脚本路径）；小型工具可用内置 util.parseArgs 结构化解析，复杂 CLI 再引入 commander/yargs/cac 实现子命令、帮助信息与类型转换。',
    flow: ['从 process.argv.slice(2) 读取用户参数。', '简单工具用 util.parseArgs，复杂工具用 commander/yargs/cac。', '实现 help/version、长短选项与有意义的退出码。'],
    notes: ['process.argv[0] 是 node 可执行路径，argv[1] 是脚本路径，参数从 argv[2] 开始。', '不要手写脆弱的字符串解析，交给 commander/yargs/cac 或内置 util.parseArgs。'],
    problem: '解决"如何解析命令行参数、如何生成帮助信息、以及如何构建交互式 CLI 工具"的问题。',
  },
{
    id: 'D_25', title: 'timers 定时器详解', navTitle: '定时器', category: '事件循环',
    path: '/nodejs/d-25/timers', summary: '深入理解 setTimeout、setInterval、setImmediate、process.nextTick 的语义差异和执行时机。',
    demo: D25Timers, code: D25Code, language: 'javascript',
    principle: 'setTimeout/setInterval 在 Timers 阶段执行；setImmediate 在 Check 阶段执行；process.nextTick 是微任务，在当前操作完成后立即执行（优先于 Promise.then）。',
    flow: ['对比四种定时器的执行时机。', '理解延迟时间的不确定性（受事件循环影响）。', '掌握定时器清除和防内存泄漏。'],
    notes: ['setTimeout(fn, 0) 会被当作至少 1ms 处理，且不保证准时。', 'setInterval 回调执行时间超过间隔会累积，长时间间隔可用递归 setTimeout 替代。', '在 I/O 回调中 setImmediate 先于 setTimeout(0) 执行。'],
    problem: '解决"定时器回调执行时间不符合预期，以及在特定场景下应该选择哪种定时器"的问题。',
  },
{
    id: 'D_26', title: 'net TCP 网络编程', navTitle: 'TCP', category: '网络',
    path: '/nodejs/d-26/net-tcp', summary: '使用 net 模块创建 TCP 服务器和客户端，理解 Node.js 网络编程的底层基础。',
    demo: D26NetTcp, code: D26Code, language: 'javascript',
    principle: 'net 提供 TCP 服务器与客户端，socket 是双向可读写的字节流端点；TCP 是面向连接、可靠但无消息边界的流协议，应用层需自行定义封包边界（换行、定长或长度前缀），否则会出现粘包/拆包。',
    flow: ['用 net.createServer 监听连接，处理 data/close/error/timeout。', '用 net.createConnection 建立客户端并发送数据。', '用换行分隔或长度前缀协议切分收到的字节流。'],
    notes: ['HTTP 是构建在 TCP 之上的应用层协议，net 是更底层的字节流。', '务必监听 socket 的 error 事件并设置超时。', 'net 是明文传输，需要加密通信应改用 tls 模块。'],
    problem: '解决"如何构建实时通信应用、如何实现自定义协议、以及 HTTP 模块的底层是如何工作的"的问题。',
  },
{
    id: 'D_27', title: 'zlib 压缩与解压', navTitle: '压缩', category: '性能',
    path: '/nodejs/d-27/zlib', summary: '使用 zlib 模块压缩和解压数据，减少网络传输大小和文件存储体积。',
    demo: D27Zlib, code: D27Code, language: 'javascript',
    principle: 'zlib 模块提供 Gzip、Deflate、Brotli 等压缩算法；支持流式压缩（pipe），内存占用小；HTTP 响应压缩是 zlib 最常见的用途。',
    flow: ['学习 gzip/deflate/brotli 的压缩率和速度对比。', '掌握流式压缩（pipe）和一次性压缩。', '了解 HTTP 响应压缩的配置。'],
    notes: ['Brotli 压缩率更高但更耗 CPU，gzip 兼容性最好。', '大文件/HTTP 传输用 createGzip 配合 pipeline 流式处理，zlib/promises 提供 Promise 版 API。', '已压缩内容（图片/视频）不要再压缩。'],
    problem: '解决"如何减少网络传输大小、如何提高页面加载速度、以及大文件如何压缩存储"的问题。',
  },
{
    id: 'D_28', title: 'os 系统信息与资源监控', navTitle: '系统信息', category: '系统',
    path: '/nodejs/d-28/os', summary: '使用 os 模块获取操作系统信息，实现资源监控、健康检查和平台适配。',
    demo: D28Os, code: D28Code, language: 'javascript',
    principle: 'os 模块提供平台、架构、CPU、内存、网络接口等系统信息；常用于资源监控（CPU/内存使用率）、健康检查（/health 接口）、平台适配（path.sep）。',
    flow: ['学习获取 CPU、内存、平台等系统信息。', '掌握资源监控和健康检查的实现。', '了解如何根据平台选择不同的命令或路径。'],
    notes: ['os.cpus().length 是设置 cluster 工作进程数的常用依据。', 'os.freemem() 可用于实现内存告警。'],
    problem: '解决"如何监控 Node.js 应用的资源使用、如何提供健康检查接口、以及如何适配不同操作系统"的问题。',
  },
{
    id: 'D_29', title: 'dns 域名解析', navTitle: 'DNS', category: '网络',
    path: '/nodejs/d-29/dns', summary: '使用 dns 模块解析域名，查询各类 DNS 记录（A、AAAA、CNAME、MX、TXT、NS）。',
    demo: D29Dns, code: D29Code, language: 'javascript',
    principle: 'dns 模块提供域名解析功能；dns.lookup() 使用系统配置（如 /etc/hosts），dns.resolve() 直接使用 DNS 服务器；支持反向解析（IP → 域名）。',
    flow: ['学习查询各类 DNS 记录（A、AAAA、MX 等）。', '理解 dns.lookup() 和 dns.resolve() 的差异。', '掌握反向解析和 DNS 缓存。'],
    notes: ['dns.lookup() 会受系统配置影响。', 'dns.resolve() 直接使用 DNS 服务器，更可靠。'],
    problem: '解决"如何根据域名获取 IP 地址、如何查询邮件服务器配置、以及如何实现自定义 DNS 解析逻辑"的问题。',
  },
{
    id: 'D_30', title: 'readline 交互式输入', navTitle: 'readline', category: 'CLI',
    path: '/nodejs/d-30/readline', summary: '使用 readline 模块实现逐行读取和交互式命令行工具。',
    demo: D30Readline, code: D30Code, language: 'javascript',
    principle: 'readline 模块提供逐行读取流数据的能力；常用于实现交互式 CLI 工具（逐行提问）、逐行处理大文件；现代 CLI 工具推荐使用 inquirer 或 prompts 库。',
    flow: ['学习逐行读取文件（createInterface + line 事件）。', '掌握交互式提问（question 方法）。', '了解 readline/promises 的现代用法。'],
    notes: ['readline 是低级 API，复杂交互推荐使用 inquirer。', '记得在完成后调用 rl.close() 释放资源。'],
    problem: '解决"如何实现交互式命令行工具、如何逐行处理大文件、以及如何优雅地读取用户输入"的问题。',
  }
]
