import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import D01ModuleSystem from '../../demos/D01ModuleSystemArticle.vue'
import D02PathUrl from '../../demos/D02PathUrlArticle.vue'
import D03FileSystem from '../../demos/D03FileSystemArticle.vue'
import D04EventEmitter from '../../demos/D04EventEmitterArticle.vue'
import D05Streams from '../../demos/D05StreamsArticle.vue'
import D06HttpServer from '../../demos/D06HttpServerArticle.vue'
import D07ProcessEnv from '../../demos/D07ProcessEnvArticle.vue'
import D08Concurrency from '../../demos/D08ConcurrencyArticle.vue'
import D09ErrorLogging from '../../demos/D09ErrorLoggingArticle.vue'
import D10NodeTest from '../../demos/D10NodeTestArticle.vue'
import D11Security from '../../demos/D11SecurityArticle.vue'
import D12PackageManagement from '../../demos/D12PackageManagementArticle.vue'
import D13ExpressFastify from '../../demos/D13ExpressFastifyArticle.vue'
import D14WebSocket from '../../demos/D14WebSocketArticle.vue'
import D15Database from '../../demos/D15DatabaseArticle.vue'
import D16WorkerThreads from '../../demos/D16WorkerThreadsArticle.vue'
import D17EventLoop from '../../demos/D17EventLoopArticle.vue'
import D18Buffer from '../../demos/D18BufferArticle.vue'
import D19ChildProcess from '../../demos/D19ChildProcessArticle.vue'
import D20Cluster from '../../demos/D20ClusterArticle.vue'
import D21Crypto from '../../demos/D21CryptoArticle.vue'
import D22PerfHooks from '../../demos/D22PerfHooksArticle.vue'
import D23Https from '../../demos/D23HttpsArticle.vue'
import D24Cli from '../../demos/D24CliArticle.vue'
import D25Timers from '../../demos/D25TimersArticle.vue'
import D26NetTcp from '../../demos/D26NetTcpArticle.vue'
import D27Zlib from '../../demos/D27ZlibArticle.vue'
import D28Os from '../../demos/D28OsArticle.vue'
import D29Dns from '../../demos/D29DnsArticle.vue'
import D30Readline from '../../demos/D30ReadlineArticle.vue'
// 该分类专属的演示样式，随分类数据一起按需加载
import '../../styles/category-nodejs.css'

const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })
const nodejsCodeModules = import.meta.glob<string>('../../demos/nodejs-code/*.js', { query: '?raw', import: 'default' })

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
  return () => loader().then(restoreCodeSource)
}

const D01Code = createCodeLoader('nodejs-code/D01ModuleSystem.js')

const D02Code = createCodeLoader('nodejs-code/D02PathUrl.js')

const D03Code = createCodeLoader('nodejs-code/D03FileSystem.js')

const D04Code = createCodeLoader('nodejs-code/D04EventEmitter.js')

const D05Code = createCodeLoader('nodejs-code/D05Streams.js')

const D06Code = createCodeLoader('nodejs-code/D06HttpServer.js')

const D07Code = createCodeLoader('nodejs-code/D07ProcessEnv.js')

const D08Code = createCodeLoader('nodejs-code/D08Concurrency.js')

const D09Code = createCodeLoader('nodejs-code/D09ErrorLogging.js')

const D10Code = createCodeLoader('nodejs-code/D10NodeTest.js')

const D11Code = createCodeLoader('nodejs-code/D11Security.js')

const D12Code = createCodeLoader('nodejs-code/D12PackageManagement.js')

const D13Code = createCodeLoader('nodejs-code/D13ExpressFastify.js')

const D14Code = createCodeLoader('nodejs-code/D14WebSocket.js')

const D15Code = createCodeLoader('nodejs-code/D15Database.js')

const D16Code = createCodeLoader('nodejs-code/D16WorkerThreads.js')

const D17Code = createCodeLoader('nodejs-code/D17EventLoop.js')

const D18Code = createCodeLoader('nodejs-code/D18Buffer.js')

const D19Code = createCodeLoader('nodejs-code/D19ChildProcess.js')

const D20Code = createCodeLoader('nodejs-code/D20Cluster.js')

const D21Code = createCodeLoader('nodejs-code/D21Crypto.js')

const D22Code = createCodeLoader('nodejs-code/D22PerfHooks.js')

const D23Code = createCodeLoader('nodejs-code/D23Https.js')

const D24Code = createCodeLoader('nodejs-code/D24Cli.js')

const D25Code = createCodeLoader('nodejs-code/D25Timers.js')

const D26Code = createCodeLoader('nodejs-code/D26NetTcp.js')

const D27Code = createCodeLoader('nodejs-code/D27Zlib.js')

const D28Code = createCodeLoader('nodejs-code/D28Os.js')

const D29Code = createCodeLoader('nodejs-code/D29Dns.js')

const D30Code = createCodeLoader('nodejs-code/D30Readline.js')

export const lessons: Lesson[] = [
{
    id: 'D_01', title: 'Node.js 运行时与模块系统', navTitle: '模块系统', category: '运行时与模块',
    path: '/nodejs/d-1/module-system', summary: '对比 ES Modules 与 CommonJS 的加载机制、导出绑定与互操作边界。',
    demo: null,
    demoComponent: D01ModuleSystem, code: D01Code, language: 'javascript',
    principle: 'CommonJS 在运行时同步解析 require/module.exports，导出的是值拷贝；ESM 在编译期静态确定 import/export 关系，导出是实时绑定，支持 Tree Shaking 与顶层 await。两者由文件扩展名（.mjs/.cjs）或 package.json 的 type 字段决定，边界处需约定互操作方式。',
    flow: ['用 package.json 的 type 或 .mjs/.cjs 后缀固定模块格式。', 'ESM 侧用 import/export 组织命名导出与默认导出。', '跨格式加载用动态 import()，内置模块统一加 node: 前缀。', '用 node -p 或最小脚本验证两种格式的互相加载行为。'],
    notes: ['ESM 没有 __dirname/__filename，需用 import.meta.url 结合 fileURLToPath 换算。', 'CJS 无法同步 require 一个 ESM 模块，只能 await import()。', '不要让同一个目录里的 .js 同时以两种隐式格式被解释。', 'package.json 的 exports 字段可同时为 CJS 与 ESM 提供不同入口。'],
    problem: '解决"Node 项目该选择哪种模块格式、以及两种格式互相引用时为何报错"的问题。',
  },
{
    id: 'D_02', title: '路径、URL 与跨平台文件定位', navTitle: '路径与 URL', category: '运行时与模块',
    path: '/nodejs/d-2/path-url', summary: '用 node:path 与 node:url 做跨平台路径处理，并在 ESM 中定位当前模块。',
    demo: null,
    demoComponent: D02PathUrl, code: D02Code, language: 'javascript',
    principle: '路径字符串不跨平台可靠（分隔符与盘符不同），URL 又是另一种表示；path 负责解析/拼接/规范化路径，fileURLToPath 与 pathToFileURL 在 file:// URL 与文件路径之间换算，import.meta.url 是 ESM 定位自身文件的关键。',
    flow: ['用 path.resolve 得到绝对基准路径。', '用 path.join 拼装相对片段并规范化。', '在 ESM 中通过 fileURLToPath(import.meta.url) 拿到当前文件路径。', '在 Windows 与 POSIX 两种路径样例下核对 resolve/join 的输出。'],
    notes: ['path.resolve 从右向左解析，遇到绝对路径即停止；join 只做拼接与规范化。', '跨平台应交给 path 处理，不要手写 / 或 \\ 分隔符。', 'path.win32 与 path.posix 可显式按平台指定解析规则。', 'import.meta.dirname（Node 20.11+）可直接获取当前目录，省去手动换算。'],
    problem: '解决"Windows 与 Linux 路径差异及 ESM 文件定位"的问题。',
  },
{
    id: 'D_03', title: '异步文件系统操作', navTitle: '文件系统', category: '文件与事件',
    path: '/nodejs/d-3/file-system', summary: '用 fs/promises 异步读写文件、管理目录、获取文件信息并规范处理错误码。',
    demo: null,
    demoComponent: D03FileSystem, code: D03Code, language: 'javascript',
    principle: 'fs/promises 提供 Promise 化的异步文件 API，不阻塞事件循环；readFile/writeFile 覆盖文本与二进制读写，mkdir/readdir/stat/copyFile/rename/cp 覆盖目录与文件管理，文件操作错误以 err.code（ENOENT/EACCES 等）区分。',
    flow: ['用 fs.promises.readFile 指定编码读文本，或用无编码形式读 Buffer。', '用 writeFile/appendFile（flag: a）区分覆盖与追加。', '用 try/catch 捕获 fs 错误，按 err.code 分支处理不存在与权限问题。', '构造 ENOENT 场景，验证错误分支给出可读提示。'],
    notes: ['同步 fs API 会阻塞事件循环，仅在启动初始化阶段少量使用。', '大文件改用流处理，不要用 readFile 一次读入内存。', '递归创建/删除目录需配合 recursive 与 force 选项。', '写文件前先确认目标目录存在，或直接依赖 mkdir 的 recursive 选项。'],
    problem: '解决"如何可靠且不阻塞地读写 Node.js 文件，并妥善处理各类文件错误"的问题。',
  },
{
    id: 'D_04', title: 'EventEmitter 与事件解耦', navTitle: '事件发布订阅', category: '文件与事件',
    path: '/nodejs/d-4/event-emitter', summary: '在自定义事件类上理解 on/once 监听、emit 派发与监听器生命周期管理。',
    demo: null,
    demoComponent: D04EventEmitter, code: D04Code, language: 'javascript',
    principle: 'EventEmitter 在同一进程内同步派发监听器（emit 触发、on/once 注册、off 移除），适合把『状态变更』与『响应逻辑』解耦；触发是同步的，监听器异常会沿 emit 调用栈向上抛，跨进程/跨服务的可靠事件需借助消息队列兜底。',
    flow: ['为业务事件定义稳定名称和载荷结构（payload）。', '订阅方通过 on 或 once 注册监听器。', '不再需要时调用 removeListener 或 off 防止内存泄漏。', '注册后主动移除监听器，用 listenerCount 确认没有残留。'],
    notes: ['监听器内部抛错会沿 emit 调用栈向上抛出，必要时包 try/catch。', 'error 事件如果没有监听器，Node.js 会把异常抛出并终止进程。', 'setMaxListeners 调大之前先排查为什么有这么多订阅。', 'once 注册的监听器触发一次即自动移除，适合一次性初始化事件。'],
    problem: '解决"同一进程内多个模块如何解耦地响应同一业务事件、并避免监听器泄漏"的问题。',
  },
{
    id: 'D_05', title: 'Stream、管道与背压', navTitle: '流与背压', category: '流与网络',
    path: '/nodejs/d-5/streams', summary: '以大报表导出理解 Readable、Writable、pipeline 与背压。',
    demo: null,
    demoComponent: D05Streams, code: D05Code, language: 'javascript',
    principle: '流把数据拆成块逐段处理，避免一次性把完整文件读进内存；当消费者处理不过来时，背压机制会让上游生产速度自动放缓，防止内存堆积；pipeline 统一连接各阶段，并在任一段出错时自动销毁整条管道、释放资源，是处理大文件与网络数据的关键基础设施。',
    flow: ['Readable 流分块产出数据。', 'Transform 流在管道中转换每个数据块。', '通过 pipeline 串到 Writable 目标并自动处理错误。', '人为在管道中抛出错误，验证整条链路被销毁且资源释放。'],
    notes: ['优先使用 stream/promises pipeline 而不是手工 pipe 链。', '对象模式与字节模式的 highWaterMark 含义不同，需按数据形态调整。', '背压信号返回 false 时暂停读取，恢复时再读。', '用 write 返回值判断背压，返回 false 时等待 drain 事件再继续写。'],
    problem: '解决"大文件和网络数据如何以更低内存传输，且不会压垮慢速消费者"的问题。',
  },
{
    id: 'D_06', title: '原生 HTTP 服务与路由', navTitle: 'HTTP 服务', category: '流与网络',
    path: '/nodejs/d-6/http-server', summary: '从 request/response 构建最小 JSON API，理解方法、状态码与响应头。',
    demo: null,
    demoComponent: D06HttpServer, code: D06Code, language: 'javascript',
    principle: 'node:http 提供底层的流式请求与响应对象，不内置路由与中间件；服务必须自行匹配 method 与 URL、限制请求体大小、设置正确的 Content-Type 并在处理完毕后显式结束响应，任何一条缺失都可能留下安全漏洞（如超大请求耗尽内存）或挂起连接。',
    flow: ['从 req 读取 method、URL 和请求头。', '路由到对应处理器并校验输入。', '设置状态码和响应头后写入响应并结束。', '用 curl -v 核对状态码、响应头与连接关闭行为。'],
    notes: ['请求体是 Readable 流，必须限制最大体积防止 DoS。', '生产服务还需要超时、代理转发和优雅关闭。', 'setHeader 必须在 write/end 之前调用。', '响应体较大时应走流式写入，并先发送 Content-Length 或使用分块编码。'],
    problem: '解决"Node.js 如何直接接收 HTTP 请求并返回规范响应"的问题。',
  },
{
    id: 'D_07', title: '进程、环境变量与优雅退出', navTitle: '进程与配置', category: '进程与并发',
    path: '/nodejs/d-7/process-env', summary: '集中校验环境配置，并在 SIGTERM 时停止接流量和释放资源。',
    demo: null,
    demoComponent: D07ProcessEnv, code: D07Code, language: 'javascript',
    principle: 'process 对象提供命令行参数、环境变量、信号与退出状态；配置应在启动阶段一次性读取并校验，缺项直接拒绝启动；收到 SIGTERM 时按“先停止接收新请求、再等待存量任务完成、最后释放连接池等资源”的顺序优雅退出，让进程退出对外表现为无请求失败、无连接泄漏。',
    flow: ['启动时读取并验证环境变量。', '注册 SIGTERM/SIGINT 信号处理函数。', '关闭服务器和连接池后设置退出码。', '发送 SIGTERM 模拟部署滚动重启，确认在途请求全部完成。'],
    notes: ['不要在业务代码到处读取 process.env，集中封装便于测试。', '不要用 process.exit 强行截断异步清理，会丢失未完成的请求。', 'K8s 默认会给 30 秒优雅退出时间，业务侧应可配置。', '优雅退出要设置兜底超时：清理超时后强制退出，避免进程无限挂起。'],
    problem: '解决"服务如何集中管理多环境配置，并在部署滚动时安全优雅地退出"的问题。',
  },
{
    id: 'D_08', title: '异步并发控制与任务池', navTitle: '并发控制', category: '进程与并发',
    path: '/nodejs/d-8/concurrency', summary: '限制批处理并发度，避免耗尽文件句柄和下游连接。',
    demo: null,
    demoComponent: D08Concurrency, code: D08Code, language: 'javascript',
    principle: '异步 I/O 可以并发等待，但无限制的 Promise.all 会同时占用文件句柄、数据库连接和下游带宽；任务池以固定 worker 数限制在途任务数，把"无界并发"变成"有界并发"，既提速又保护下游。池化思想同样适用于连接、句柄等一切稀缺资源。',
    flow: ['建立待处理任务队列。', '启动固定数量的并发工作函数（worker）同时拉取任务。', '每个 worker 完成后领取下一个任务，直到队列清空。', '调整并发上限，对比总耗时与下游错误率的变化。'],
    notes: ['CPU 密集任务考虑 Worker Threads 或子进程，不在本池中跑。', '并发上限应结合下游容量压测，不要拍脑袋设。', '任务失败时记录错误并继续，避免毒丸任务阻塞整条流水线。', '用 allSettled 思路收集每个任务的结果，单个失败不中断整批处理。'],
    problem: '解决"批量异步任务如何提速，同时控制住并发数以避免压垮下游系统"的问题。',
  },
{
    id: 'D_09', title: '错误边界与结构化日志', navTitle: '错误与日志', category: '可靠性',
    path: '/nodejs/d-9/error-logging', summary: '区分操作型错误与程序错误，并记录可检索的结构化上下文。',
    demo: null,
    demoComponent: D09ErrorLogging, code: D09Code, language: 'javascript',
    principle: '错误应分两类对待：预期的操作型错误（参数缺失、权限不足、资源不存在）转换为稳定的错误码与合适的 HTTP 响应，供调用方处理；未知的程序错误（崩溃级 Bug）记录完整堆栈、请求 ID 与用户上下文后交给进程管理器重启，避免服务带着不一致状态继续运行。',
    flow: ['在系统边界用 try/catch 捕获异步错误。', '把内部错误映射为公开错误码和 HTTP 状态。', '以 JSON 结构记录请求 ID 和内部原因便于检索。', '故意触发一次错误，验证响应错误码与日志字段的对应关系。'],
    notes: ['日志不得包含令牌、密码和个人敏感信息，必要时做脱敏。', 'unhandledRejection 不应只打印后继续运行，要么退出要么上报。', '统一日志字段（traceId、userId）方便跨服务追踪。', '给进程配置 uncaughtException 与 unhandledRejection 兜底处理器。'],
    problem: '解决"服务端如何为错误分类、返回合适响应，并在事后高效排查定位"的问题。',
  },
{
    id: 'D_10', title: '内置 node:test 测试运行器', navTitle: 'Node 测试', category: '可靠性',
    path: '/nodejs/d-10/node-test', summary: '使用 node:test 与 assert 编写单元测试、子测试和异步测试。',
    demo: null,
    demoComponent: D10NodeTest, code: D10Code, language: 'javascript',
    principle: 'Node 内置的 node:test 测试运行器支持并发、Mock、覆盖率统计和多种报告格式，无需引入 Jest/Vitest 等第三方框架即可为核心模块建立可靠测试套件，特别适合库和 CLI 工具。把测试入口收敛到 node --test，还能减少工具链依赖与版本冲突。',
    flow: ['导入 node:test 与 node:assert/strict。', '按行为组织 test 和子测试 subtest。', '在 CI 中输出覆盖率与机器可读报告（如 TAP、JUnit）。', '故意破坏一处实现，确认测试套件能及时捕获回归。'],
    notes: ['每个测试应可独立运行，不要依赖测试执行顺序和共享全局状态。', '使用 mock 时注意清理，避免污染后续测试。', 'node --test 默认并行运行多个测试文件；同一文件内的测试默认顺序执行，需要并发时可显式设置 concurrency。', '用 node --test --experimental-test-coverage 查看未被覆盖的分支。'],
    problem: '解决"如何不引入第三方框架、使用 Node.js 自带能力建立可靠测试套件"的问题。',
  },
{
    id: 'D_11', title: '服务端输入与路径安全', navTitle: '输入安全', category: '安全与依赖',
    path: '/nodejs/d-11/security', summary: '防止路径穿越、注入、超大请求和敏感信息泄漏。',
    demo: null,
    demoComponent: D11Security, code: D11Code, language: 'javascript',
    principle: '所有外部输入都不可信，服务端必须在系统边界完成校验：字段用白名单而非黑名单过滤，文件路径规范化后确认仍在允许目录内，请求体限制最大体积，数据库访问一律参数化，进程以最小权限账户运行。多层防御各自独立生效，任何一层被绕过都不会导致全面失守。把校验写进请求进入的第一站，是成本最低的防线。',
    flow: ['在系统边界解析并校验输入（类型、长度、范围）。', '规范化路径或字段后确认资源仍在允许范围。', '使用最小权限账户访问文件、数据库和外部服务。', '用恶意输入样例（超长字段、路径穿越）验证边界拦截效果。'],
    notes: ['前端校验不能替代服务端校验，绕过前端非常容易。', '错误响应不要暴露内部路径、堆栈和库版本。', 'path.join 后还要用 path.resolve 校验是否在 base 目录内。', '依赖项也要纳入安全维护：定期 audit，及时升级含漏洞的版本。'],
    problem: '解决"Node 服务如何抵御常见输入攻击，并防止敏感信息意外泄漏"的问题。',
  },
{
    id: 'D_12', title: '包管理、SemVer 与可重复安装', navTitle: '依赖管理', category: '安全与依赖',
    path: '/nodejs/d-12/package-management', summary: '理解 package.json、锁文件、版本范围、脚本和依赖审计。',
    demo: null,
    demoComponent: D12PackageManagement, code: D12Code, language: 'javascript',
    principle: 'package.json 声明依赖意图（版本范围、脚本、入口），锁文件记录解析后的完整依赖图；SemVer 范围（^ 允许次版本、~ 允许补丁）决定自动升级的边界。CI 用冻结锁文件安装（如 pnpm install --frozen-lockfile），保证本地、CI 与生产解析出完全一致的依赖树。',
    flow: ['运行依赖与开发依赖分开声明：运行时用到的进 dependencies，构建与测试工具进 devDependencies。', '提交并审查锁文件变更，CI 以冻结模式安装，锁定实际解析的版本。', '用 ^/~ 控制允许升级的范围，并定期做依赖审计与升级评估。', '在干净环境执行一次冻结安装，确认锁文件可完整复现依赖树。'],
    notes: ['不要盲目自动升级主版本。', '安装脚本具有执行代码权限，需要审查来源。', '版本范围过宽（如 * 或 latest）会让不同时间安装得到不同版本，难以复现问题。', '依赖升级按小步走：升级一批、验证一批，避免一次性大版本跳跃。'],
    problem: '解决"如何让团队与 CI 环境安装出完全一致、且可审计的依赖树"的问题。',
  },
{
    id: 'D_13', title: 'Express 与 Fastify 路由对比', navTitle: 'Express/Fastify', category: 'Web 框架',
    path: '/nodejs/d-13/express-fastify', summary: '对比 Express 中间件链和 Fastify Schema 验证两种路由模式。',
    demo: null,
    demoComponent: D13ExpressFastify, code: D13Code, language: 'javascript',
    principle: 'Express 以顺序执行的中间件链（调用 next 传递）处理请求，灵活但约束较少；Fastify 以生命周期钩子与插件组织逻辑，并用 JSON Schema 在启动阶段编译路由、验证输入输出、加速序列化，适合接口契约严格的项目。选型没有绝对优劣，关键是团队熟悉度与接口约束强度。',
    flow: ['Express 侧用 app.use 依次挂载中间件，请求沿链条传递、命中路由后返回响应。', 'Fastify 侧把校验与业务拆进 Schema 和插件：启动时编译路由，声明式验证输入、加速输出序列化。', '按项目诉求选型：生态与灵活度优先 Express，性能与接口契约优先 Fastify。', '用同一份接口用例分别压测两个框架，对照吞吐与延迟数据。'],
    notes: ['Express 中间件是线性 next 传递，洋葱式模型属于 Koa。', 'Fastify 的 Schema 同时做输入验证与输出序列化加速，并结合 pino 内置日志。', '中间件按注册顺序执行，鉴权、日志等通用逻辑应排在业务路由之前。', '迁移框架时先保持路由与响应格式不变，再做内部优化。'],
    problem: '解决"Node.js Web 框架如何选择，以及路由和验证的最佳实践"的问题。',
  },
{
    id: 'D_14', title: 'WebSocket 实时通信', navTitle: 'WebSocket', category: 'Web 框架',
    path: '/nodejs/d-14/websocket', summary: '用 WebSocket 实现实时聊天，掌握连接、心跳、广播和重连策略。',
    demo: null,
    demoComponent: D14WebSocket, code: D14Code, language: 'javascript',
    principle: 'WebSocket 在 HTTP 握手后升级为双向持久连接，服务端可随时主动推送；长连接可能被中间设备静默断开，因此需要应用层心跳探测活性，断线后按指数退避重连。服务端维护连接表向目标集合广播消息，是聊天、协同与实时通知的基础设施。连接数量增长后，先把心跳与广播做成可观测指标。',
    flow: ['客户端与服务端完成 HTTP Upgrade 握手，建立双向连接。', '应用层定时互发心跳（ping/pong），超时即判定连接失效并触发重连。', '服务端向全部或指定客户端广播消息；断线后按指数退避重试。', '断开网络再恢复，验证重连与消息补发符合预期。'],
    notes: ['WebSocket 是持久资源，服务端要限制单机连接数并维护连接表。', '鉴权需在握手阶段或首条消息中完成，不能复用 HTTP 中间件那套逻辑。', '多实例部署时用 Redis Pub/Sub 适配器实现跨节点广播。', '重连要有随机抖动（jitter），避免大量客户端同一时刻重连形成惊群。'],
    problem: '解决"轮询延迟高、连接频繁建立断开时，如何用 WebSocket 持久连接实现服务端主动推送并保活"的问题。',
  },
{
    id: 'D_15', title: '数据库连接与迁移', navTitle: '数据库', category: '数据与存储',
    path: '/nodejs/d-15/database', summary: '比较原生 SQL、查询构建器和 ORM，掌握数据库迁移工作流。',
    demo: null,
    demoComponent: D15Database, code: D15Code, language: 'javascript',
    principle: '数据库访问分三个层次：原生 SQL 最贴近数据库、灵活但需自行防注入；查询构建器以代码拼 SQL，兼顾灵活与安全；ORM 提供对象映射、开发快，但会隐藏执行细节与性能成本。数据库连接必须经连接池复用；表结构变更则由迁移脚本版本化管理，保证各环境结构一致且可回滚。',
    flow: ['按场景选数据访问层：复杂查询偏原生 SQL/查询构建器，CRUD 为主可上 ORM。', '配置连接池的最大连接数与获取超时，避免每个请求新建连接拖垮数据库。', '用迁移脚本描述 Schema 变更，在部署流程中按版本顺序执行。', '在临时库上演练一次迁移与回滚，确认脚本双向可用。'],
    notes: ['连接池大小要结合数据库最大连接数与实例数核算，并非越大越好。', '迁移脚本必须可重复执行、可回滚，并纳入部署流程自动执行。', 'ORM 的 N+1 查询与隐式全表加载是常见性能隐患，复杂查询应回退原生 SQL 并显式指定字段。', '开启慢查询日志定期巡检，比等到线上报警再排查更主动。'],
    problem: '解决"Node.js 项目如何选择数据访问层并管理数据库 Schema 变更"的问题。',
  },
{
    id: 'D_16', title: 'Worker 线程与 CPU 密集任务', navTitle: 'Worker 线程', category: '进程与并发',
    path: '/nodejs/d-16/worker-threads', summary: '用 Worker 线程卸载 CPU 密集计算，保持事件循环响应。',
    demo: null,
    demoComponent: D16WorkerThreads, code: D16Code, language: 'javascript',
    principle: 'Node.js 的事件循环是单线程的，一段长时间的同步计算会让所有其他请求排队等待；Worker Threads 在独立线程中执行计算代码，通过 postMessage 与主线程交换数据，事件循环因此保持畅通。线程之间不共享普通变量与内存，数据必须经由消息传递或 SharedArrayBuffer 交换。',
    flow: ['先用性能分析确认瓶颈确为 CPU 密集，而非 I/O 等待或数据库拖慢。', '把纯计算逻辑搬进独立 worker 文件，主线程 new Worker 后 postMessage 派发任务。', 'worker 完成计算后把结果回传主线程；任务频繁时用 Piscina 等库复用线程池。', '用压测对比 Worker 化前后的事件循环延迟变化。'],
    notes: ['Worker 适合 CPU 密集，不适合 I/O 密集。', 'Piscina 等库提供 Worker 池管理，避免每次任务都新建线程的开销。', 'Worker 之间不共享普通内存与状态，数据必须通过消息传递，不能直接读写主线程变量。', '消息传递有序列化成本，大对象用 Transferable 或 SharedArrayBuffer 减少拷贝。'],
    problem: '解决"CPU 密集任务如何避免阻塞 Node.js 事件循环"的问题。',
  },
{
    id: 'D_17', title: '事件循环与宏微任务', navTitle: '事件循环', category: '事件循环',
    path: '/nodejs/d-17/event-loop', summary: '理解 Node.js 事件循环的六个阶段，以及微任务（nextTick、Promise）和宏任务（setTimeout、setImmediate）的执行顺序。',
    demo: null,
    demoComponent: D17EventLoop, code: D17Code, language: 'javascript',
    principle: 'Node.js 事件循环分为六个阶段（Timers、Pending、Idle/Prepare、Poll、Check、Close），微任务（process.nextTick、Promise.then）在每个阶段结束后优先执行。理解阶段顺序，是预判异步任务实际执行时机的关键。',
    flow: ['Timers 阶段执行到期的 setTimeout/setInterval 回调。', '每个阶段结束后先清空 process.nextTick 队列，再清空 Promise 微任务队列。', 'Poll 阶段处理 I/O 回调，Check 阶段执行 setImmediate，Close 阶段处理关闭事件。', '用日志打印各阶段回调顺序，验证与理论阶段一致。'],
    notes: ['process.nextTick 队列优先于 Promise 微任务，每个阶段结束后都会先清空两者。', 'setImmediate 在 Check 阶段执行，是 Node.js 特有 API，浏览器中不存在。', '不要在 nextTick 中递归调度自身，会饿死事件循环、让 I/O 无法推进。', '阶段顺序知识要与实测结合：写最小复现脚本，比背诵结论更可靠。'],
    problem: '解决"异步代码执行顺序不符合预期，以及定时器回调为什么不按时执行"的问题。',
  },
{
    id: 'D_18', title: 'Buffer 与二进制数据处理', navTitle: 'Buffer', category: '二进制',
    path: '/nodejs/d-18/buffer', summary: '理解 Buffer 的创建、编码转换、拼接和截取，掌握二进制数据处理的基本操作。',
    demo: null,
    demoComponent: D18Buffer, code: D18Code, language: 'javascript',
    principle: 'Buffer 是 Uint8Array 的子类，表示固定长度的字节序列，文件 I/O、网络传输、加密都围绕它进行；创建优先 Buffer.from/alloc/allocUnsafe，文本与字节之间用 toString(charset)/Buffer.from(str, charset) 按 utf8、hex、base64 等编码转换。Buffer 内存来自 V8 堆外的池，allocUnsafe 不清零可能残留旧数据，涉密场景必须用 alloc 或 fill 清零。',
    flow: ['用 Buffer.from(字符串, 编码) 按指定编码创建字节序列，避免已废弃的 new Buffer()。', '读取文件或网络数据得到 Buffer 后，用 toString(编码) 转回文本。', '拼接多个分片时先估算总长预分配 Buffer，再逐段 copy 写入，避免循环里反复 concat。', '对比逐段 concat 与预分配 copy 在大分片场景下的耗时差异。'],
    notes: ['优先用 Buffer.from/alloc 创建，不要用已废弃的 new Buffer()。', 'buf.slice 返回共享内存的视图，修改会反映到原 Buffer。', '大量片段拼接时先估算总长再预分配，避免循环里反复 Buffer.concat。', '转换大体积编码（如 base64）会短暂膨胀内存，必要时应流式转换。'],
    problem: '解决"如何处理二进制数据、文件内容编码转换、以及 Stream 数据拼接"的问题。',
  },
{
    id: 'D_19', title: 'child_process 子进程', navTitle: '子进程', category: '多进程',
    path: '/nodejs/d-19/child-process', summary: '对比 exec、execFile、spawn、fork 四种创建子进程方案的能力与安全性。',
    demo: null,
    demoComponent: D19ChildProcess, code: D19Code, language: 'javascript',
    principle: 'child_process 通过 exec（缓冲式运行 Shell 命令，有注入风险）、execFile（绕过 Shell 直接执行可执行文件）、spawn（流式返回 stdout/stderr，适合长输出）、fork（专为 Node.js 模块并自带 IPC）四种方式创建子进程。',
    flow: ['小输出、简单命令用 exec，执行可执行文件优先用 execFile。', '长输出/实时日志用 spawn 流式读取 stdout/stderr。', 'Node.js 子进程用 fork 并通过 send/on(message) 做 IPC。', '给子进程设置超时与 kill 兜底，防止僵尸进程残留。'],
    notes: ['exec 会创建 Shell，用户输入不可拼接进命令串，安全首选 execFile/spawn。', '子进程有独立内存与事件循环，务必监听 error 并管理生命周期。', '可用 node:child_process/promises 获得 Promise 版本 API。', '子进程 stdout 是流，体积大时避免 exec 缓冲满导致截断或卡死。'],
    problem: '解决"如何在 Node.js 中执行外部命令、利用多核 CPU、以及隔离崩溃风险"的问题。',
  },
{
    id: 'D_20', title: 'cluster 多核利用', navTitle: 'cluster', category: '多进程',
    path: '/nodejs/d-20/cluster', summary: '使用 cluster 模块创建多进程架构，充分利用多核 CPU，提高应用吞吐量和可靠性。',
    demo: null,
    demoComponent: D20Cluster, code: D20Code, language: 'javascript',
    principle: 'cluster 模块基于 child_process.fork() 创建多个共享同一端口的工作进程：主进程接收连接并按轮询分发给 worker，各 worker 拥有独立事件循环与内存。它让单机 Node 服务吃满多核 CPU，同时借进程隔离把崩溃影响限制在单个 worker，配合自动重启保证可用性。',
    flow: ['主进程读取 CPU 数量，fork 对应数量的工作进程并监听各自的 exit 事件。', '工作进程共享服务器端口、各自处理连接，互不共享内存状态。', 'worker 崩溃后由主进程重新 fork；收到退出信号时逐个优雅关闭。', '手动 kill 一个 worker，验证自动重启与请求不中断。'],
    notes: ['工作进程数通常设置为 CPU 核心数。', '工作进程崩溃后主进程应自动 fork 新进程。', '会话、缓存等内存态数据不跨进程共享，多核部署需外置到 Redis 等共享存储。', '配合监控统计各 worker 的请求分布，确认负载是否真正均衡。'],
    problem: '解决"单线程 Node.js 无法充分利用多核 CPU，以及单点故障导致整个应用不可用"的问题。',
  },
{
    id: 'D_21', title: 'crypto 加密实践', navTitle: '加密', category: '安全',
    path: '/nodejs/d-21/crypto', summary: '使用 crypto 模块进行哈希、HMAC、对称加密等操作，掌握密码存储和数据签名的最佳实践。',
    demo: null,
    demoComponent: D21Crypto, code: D21Code, language: 'javascript',
    principle: 'node:crypto 用 createHash/createHmac 做完整性校验与消息认证，用 createCipheriv(aes-256-gcm) 做带认证标签的对称加解密，用 RSA 公私钥做加密与签名，并用 randomBytes/randomUUID 生成安全随机数；密文比较应使用 timingSafeEqual 防时序攻击。',
    flow: ['用 createHash 计算 sha256 完整性哈希，加密钥用 createHmac 做消息认证。', '用 createCipheriv(aes-256-gcm) 加解密，保存好随机 IV 与 authTag。', '密码存储使用 scrypt/PBKDF2 慢哈希或 bcrypt/argon2，并用 timingSafeEqual 校验。', '对同一输入验证哈希加盐的随机性：两次结果不同但均可校验通过。'],
    notes: ['MD5/SHA-1 仅用于非安全场景，不要用于密码哈希或签名认证。', 'AES-GCM 自带认证标签，IV 每次加密都要随机生成。', '密钥通过环境变量或密钥管理服务提供，不要硬编码进代码。', '加密方案要预留密钥轮换路径，旧密钥需能继续解密历史数据。'],
    problem: '解决"用户密码如何安全存储、API 请求如何防篡改、以及敏感数据如何加密传输"的问题。',
  },
{
    id: 'D_22', title: 'perf_hooks 性能分析', navTitle: '性能分析', category: '性能',
    path: '/nodejs/d-22/perf-hooks', summary: '使用 perf_hooks 模块进行性能打点和测量，定位函数级别的性能瓶颈。',
    demo: null,
    demoComponent: D22PerfHooks, code: D22Code, language: 'javascript',
    principle: 'perf_hooks 提供与浏览器 performance API 兼容的接口；通过 performance.mark() 打点、performance.measure() 测量区间、PerformanceObserver 监听性能条目。先量化再优化：没有数据支撑的性能改动可能毫无收益。',
    flow: ['用 performance.mark() 在关键位置打点，performance.measure() 测量两点的区间耗时。', '用 PerformanceObserver 监听 measure 条目，把耗时汇总上报或绘制成面板。', '定位到热点后，再用 clinic.js、0x 生成火焰图做函数级深入分析。', '对同一段逻辑打点前后对比，确认优化确实带来收益。'],
    notes: ['perf_hooks 是内置模块，无需安装。', '生产环境应采样性能数据，避免全量收集影响性能。', 'mark/measure 条目会累积在缓冲区，长时间运行需周期性 clearMarks/clearMeasures，避免内存增长。', '采样比例与上报频率要评估开销，测量本身也可能成为瓶颈。'],
    problem: '解决"如何定位 Node.js 应用的性能瓶颈，以及函数执行时间是否符合预期"的问题。',
  },
{
    id: 'D_23', title: 'HTTPS 与 TLS 配置', navTitle: 'HTTPS', category: '网络',
    path: '/nodejs/d-23/https', summary: '理解 HTTPS 的原理，掌握 Node.js HTTPS 服务器的创建和 TLS 配置。',
    demo: null,
    demoComponent: D23Https, code: D23Code, language: 'javascript',
    principle: 'HTTPS 基于 TLS，服务端需持有私钥与证书（证书链），https 模块据此建立安全连接；应配置最低 TLS 版本（TLSv1.2/1.3）与强密码套件，客户端默认校验证书，生产环境使用 CA 签发的正式证书并自动续期。证书与私钥像密钥一样管理：限权、备份、记录到期时间。',
    flow: ['准备证书：本地开发用 OpenSSL/mkcert 自签名，生产用 CA 签发或 Let\'s Encrypt 自动续期。', 'https.createServer 传入 key 与 cert 启动服务，或在反向代理/负载均衡层终止 TLS。', '显式设置最低 TLS 版本（TLSv1.2/1.3）与密码套件，并开启 HSTS 强制全站加密。', '用在线 TLS 检测报告核对协议版本与套件配置。'],
    notes: ['生产环境务必启用 HTTPS，配合 HSTS 强制全站加密。', '禁用 SSLv3 与 TLS 1.0/1.1，最低放宽到 TLS 1.2，优先 TLS 1.3。', '私钥文件收紧权限并妥善保管，不要提交进代码仓库。', '证书到期监控要留出足够的续期窗口，避免续期失败导致服务中断。'],
    problem: '解决"如何启用 HTTPS、如何选择合适的 TLS 版本和加密套件、以及证书如何申请和管理"的问题。',
  },
{
    id: 'D_24', title: 'CLI 参数与命令行工具', navTitle: 'CLI', category: 'CLI',
    path: '/nodejs/d-24/cli', summary: '解析命令行参数，使用 commander 等库构建专业的命令行工具。',
    demo: null,
    demoComponent: D24Cli, code: D24Code, language: 'javascript',
    principle: 'process.argv 提供原始参数（前两项分别是 node 可执行路径与脚本路径）；小型工具可用内置 util.parseArgs 结构化解析，复杂 CLI 再引入 commander/yargs/cac 实现子命令、帮助信息与类型转换。',
    flow: ['从 process.argv.slice(2) 读取用户参数。', '简单工具用 util.parseArgs，复杂工具用 commander/yargs/cac。', '实现 help/version、长短选项与有意义的退出码。', '用 --help 与错误参数分别验证帮助输出与退出码。'],
    notes: ['process.argv[0] 是 node 可执行路径，argv[1] 是脚本路径，参数从 argv[2] 开始。', '不要手写脆弱的字符串解析，交给 commander/yargs/cac 或内置 util.parseArgs。', '参数解析失败要输出用法提示（usage）并以非零退出码结束，便于脚本与 CI 判定失败。', '复杂 CLI 拆成子命令模块，每个命令独立维护自己的选项与帮助文本。'],
    problem: '解决"如何解析命令行参数、如何生成帮助信息、以及如何构建交互式 CLI 工具"的问题。',
  },
{
    id: 'D_25', title: 'timers 定时器详解', navTitle: '定时器', category: '事件循环',
    path: '/nodejs/d-25/timers', summary: '深入理解 setTimeout、setInterval、setImmediate、process.nextTick 的语义差异和执行时机。',
    demo: null,
    demoComponent: D25Timers, code: D25Code, language: 'javascript',
    principle: 'setTimeout/setInterval 在 Timers 阶段执行；setImmediate 在 Check 阶段执行；process.nextTick 是微任务，在当前操作完成后立即执行（优先于 Promise.then）。选择定时器前先问清楚"需要什么时机执行"。',
    flow: ['用 setTimeout/setInterval 调度延时与周期任务，回调在 Timers 阶段执行。', 'I/O 回调中需要"立即"执行时用 setImmediate（Check 阶段），比 setTimeout(fn, 0) 更确定。', '需要插队当前操作时用 process.nextTick，但仅限极短的内部逻辑。', '打印三种定时器的实际触发顺序，验证与阶段理论一致。'],
    notes: ['setTimeout(fn, 0) 会被当作至少 1ms 处理，且不保证准时。', 'setInterval 回调执行时间超过间隔会累积，长时间间隔可用递归 setTimeout 替代。', '在 I/O 回调中 setImmediate 先于 setTimeout(0) 执行。', '长延时别用巨大的 ms 值单次等待，超大毫秒数会溢出为立即执行。'],
    problem: '解决"定时器回调执行时间不符合预期，以及在特定场景下应该选择哪种定时器"的问题。',
  },
{
    id: 'D_26', title: 'net TCP 网络编程', navTitle: 'TCP', category: '网络',
    path: '/nodejs/d-26/net-tcp', summary: '使用 net 模块创建 TCP 服务器和客户端，理解 Node.js 网络编程的底层基础。',
    demo: null,
    demoComponent: D26NetTcp, code: D26Code, language: 'javascript',
    principle: 'net 提供 TCP 服务器与客户端，socket 是双向可读写的字节流端点；TCP 是面向连接、可靠传输但无消息边界的流协议，应用层需自行定义封包边界（换行符、定长头或长度前缀），否则接收端会出现粘包与拆包问题。设计协议时先把"一条消息如何界定"写清楚，再动手编码。',
    flow: ['用 net.createServer 监听连接，处理 data/close/error/timeout。', '用 net.createConnection 建立客户端并发送数据。', '用换行分隔或长度前缀协议切分收到的字节流。', '构造一次大数据分片发送，验证接收端正确重组消息。'],
    notes: ['HTTP 是构建在 TCP 之上的应用层协议，net 是更底层的字节流。', '务必监听 socket 的 error 事件并设置超时。', 'net 是明文传输，需要加密通信应改用 tls 模块。', 'socket 数据攒在缓冲区里可能一次到达多块，解析器要允许残留半个包。'],
    problem: '解决"需要理解 HTTP 底下那层字节流、或自建自定义 TCP 协议时，不知如何切分消息边界、处理粘包"的问题。',
  },
{
    id: 'D_27', title: 'zlib 压缩与解压', navTitle: '压缩', category: '性能',
    path: '/nodejs/d-27/zlib', summary: '使用 zlib 模块压缩和解压数据，减少网络传输大小和文件存储体积。',
    demo: null,
    demoComponent: D27Zlib, code: D27Code, language: 'javascript',
    principle: 'zlib 模块内置 Gzip、Deflate 与 Brotli 等压缩算法，同一套 API 既可对完整数据块一次性压缩，也能以流的方式边读边压、内存占用恒定。压缩率与 CPU 开销成反比：Brotli 压缩率最高也最费 CPU。HTTP 响应压缩是它最常见的用途——服务端按 Accept-Encoding 协商编码，明显减小文本传输体积。',
    flow: ['按压缩率与 CPU 成本选算法：gzip 兼容性最好，Brotli 压缩率更高但更耗 CPU。', '流式场景用 createGzip/createBrotliCompress 配合 pipeline；小数据可用 gzipSync 等一次性 API。', 'HTTP 服务中对文本响应协商 Content-Encoding，静态资源可在构建期预压缩。', '对比开启压缩前后响应体积与传输耗时。'],
    notes: ['Brotli 压缩率更高但更耗 CPU，gzip 兼容性最好。', '大文件/HTTP 传输用 createGzip 配合 pipeline 流式处理，zlib/promises 提供 Promise 版 API。', '已压缩内容（图片/视频）不要再压缩。', '压缩级别要实测：高级别节省的带宽常常抵不上多花的 CPU。'],
    problem: '解决"文本响应与大文件传输体积过大拖慢加载与存储，需要按场景选择压缩算法与流式方案"的问题。',
  },
{
    id: 'D_28', title: 'os 系统信息与资源监控', navTitle: '系统信息', category: '系统',
    path: '/nodejs/d-28/os', summary: '使用 os 模块获取操作系统信息，实现资源监控、健康检查和平台适配。',
    demo: null,
    demoComponent: D28Os, code: D28Code, language: 'javascript',
    principle: 'os 模块暴露运行环境的系统信息：平台与架构、CPU 核心列表、总内存与空闲内存、平均负载、网络接口等。它常用于三件事：资源监控（采集内存与负载指标）、健康检查（/health 接口快速反映实例状态）与平台适配（按平台选择命令与路径分隔符）。注意容器环境中读到的是宿主视角数据，真实限额需以 cgroup 为准。',
    flow: ['用 os.cpus/arch/platform 读取 CPU、架构与平台信息，支撑多核与平台适配。', '用 os.totalmem/freemem/loadavg 计算内存与负载，暴露 /health 健康检查接口。', '按平台差异选择命令与路径分隔符（path.sep），避免硬编码。', '在容器里核对 os 指标与 cgroup 限额的差异。'],
    notes: ['os.cpus().length 是设置 cluster 工作进程数的常用依据。', 'os.freemem() 可用于实现内存告警。', '容器内 os 读到的是宿主机视角的资源，实际限额以 cgroup 为准。', '健康检查接口要足够轻量，避免检查本身给系统增加负担。'],
    problem: '解决"服务上线后需要资源监控与健康检查、代码又要兼顾多平台差异时，缺乏统一数据来源"的问题。',
  },
{
    id: 'D_29', title: 'dns 域名解析', navTitle: 'DNS', category: '网络',
    path: '/nodejs/d-29/dns', summary: '使用 dns 模块解析域名，查询各类 DNS 记录（A、AAAA、CNAME、MX、TXT、NS）。',
    demo: null,
    demoComponent: D29Dns, code: D29Code, language: 'javascript',
    principle: 'dns 模块提供域名解析：dns.lookup() 走系统解析器（读取 hosts 文件与系统缓存，与浏览器行为一致），dns.resolve() 系列则直接向 DNS 服务器查询 A、AAAA、MX、TXT 等记录，两者结果可能不同；dns.reverse() 支持 IP 反查域名，调试网络问题时很实用。',
    flow: ['用 dns.lookup() 按系统配置解析地址（含 hosts 文件与系统缓存），适合发起连接前使用。', '用 dns.resolve4/resolveMx 等直接向 DNS 服务器查询 A/MX/TXT 等记录。', '用 dns.reverse() 做 IP 反查；高频解析加应用层缓存，避免每次请求都查询。', '修改 hosts 文件验证 lookup 与 resolve 的行为差异。'],
    notes: ['dns.lookup() 走系统解析器（含 hosts 文件），dns.resolve() 直接查 DNS 服务器，两者结果可能不同。', '解析结果应做缓存与失败降级，避免 DNS 抖动拖慢所有请求。', 'dns.lookup() 默认在 libuv 线程池执行，池繁忙时解析会排队变慢。', 'DNS 故障要有降级预案：缓存上次成功结果，或切换备用解析服务。'],
    problem: '解决"建立连接前的域名解析行为与系统不一致、或需要校验邮箱域名 MX 记录时无从下手"的问题。',
  },
{
    id: 'D_30', title: 'readline 交互式输入', navTitle: 'readline', category: 'CLI',
    path: '/nodejs/d-30/readline', summary: '使用 readline 模块实现逐行读取和交互式命令行工具。',
    demo: null,
    demoComponent: D30Readline, code: D30Code, language: 'javascript',
    principle: 'readline 模块把输入流按行切分，逐行触发事件；它既能实现交互式 CLI 的逐行提问，也能流式处理大文件而不把整个文件读进内存。复杂交互（多选、校验、动态提示）可用 inquirer 或 prompts 封装，现代写法推荐 node:readline/promises 以 await 组织多步交互。',
    flow: ['用 readline.createInterface 绑定输入输出流，监听 line 事件逐行消费。', '交互式提问用 rl.question 收集输入，注意回调式 API 的嵌套层次。', '现代写法用 node:readline/promises，以 await rl.question 线性组织多步交互。', '用管道输入多行文本，验证按行消费与正常结束。'],
    notes: ['readline 是低级 API，复杂交互推荐使用 inquirer。', '记得在完成后调用 rl.close() 释放资源。', '逐行处理大文件时按需消费、配合流背压，避免一次性把内容读入内存。', '交互结束时处理 SIGINT，保证终端状态与资源被正确恢复。'],
    problem: '解决"写 CLI 工具时需要逐行提问与流式处理大文件，用原始 stdin 事件处理起来繁琐易错"的问题。',
  }
]
