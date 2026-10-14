import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import LG01QuickStart from '../../demos/LG01QuickStartArticle.vue'
import LG02StateGraph from '../../demos/LG02StateGraphArticle.vue'
import LG03Middleware from '../../demos/LG03MiddlewareArticle.vue'
import LG04HumanInLoop from '../../demos/LG04HumanInLoopArticle.vue'
import LG05Memory from '../../demos/LG05MemoryArticle.vue'
import LG06ContextEngineering from '../../demos/LG06ContextEngineeringArticle.vue'
import LG07McpServer from '../../demos/LG07McpServerArticle.vue'
import LG08Supervisor from '../../demos/LG08SupervisorArticle.vue'
import LG09Parallel from '../../demos/LG09ParallelArticle.vue'
import LG10Rag from '../../demos/LG10RagArticle.vue'
import LG11WebSearch from '../../demos/LG11WebSearchArticle.vue'
import LG12DeepAgents from '../../demos/LG12DeepAgentsArticle.vue'
import LG13StreamingUi from '../../demos/LG13StreamingUiArticle.vue'
import LG14DebugDeploy from '../../demos/LG14DebugDeployArticle.vue'
// 该分类专属的演示样式，随分类数据一起按需加载
import '../../styles/category-langgraph.css'

const langgraphCodeModules = import.meta.glob<string>('../../demos/langgraph-code/*', { query: '?raw', import: 'default' })

function createCodeLoader(path: string) {
  const loader = langgraphCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const LG1Code = createCodeLoader('langgraph-code/LG1Code.ts.txt')
const LG2Code = createCodeLoader('langgraph-code/LG2Code.ts.txt')
const LG3Code = createCodeLoader('langgraph-code/LG3Code.ts.txt')
const LG4Code = createCodeLoader('langgraph-code/LG4Code.ts.txt')
const LG5Code = createCodeLoader('langgraph-code/LG5Code.ts.txt')
const LG6Code = createCodeLoader('langgraph-code/LG6Code.ts.txt')
const LG7Code = createCodeLoader('langgraph-code/LG7Code.ts.txt')
const LG8Code = createCodeLoader('langgraph-code/LG8Code.ts.txt')
const LG9Code = createCodeLoader('langgraph-code/LG9Code.ts.txt')
const LG10Code = createCodeLoader('langgraph-code/LG10Code.ts.txt')
const LG11Code = createCodeLoader('langgraph-code/LG11Code.ts.txt')
const LG12Code = createCodeLoader('langgraph-code/LG12Code.ts.txt')
const LG13Code = createCodeLoader('langgraph-code/LG13Code.ts.txt')
const LG14Code = createCodeLoader('langgraph-code/LG14Code.ts.txt')

export const lessons: Lesson[] = [
  {
    id: 'LG_1',
    title: '快速入门：用 createReactAgent 构建第一个智能体',
    navTitle: '快速入门',
    category: '快速入门',
    path: '/langgraph/lg-1/create-react-agent',
    summary: '用课程咨询助手展示 ReAct 循环：模型自己决定调用工具、读结果、再作答。',
    demo: null,
    demoComponent: LG01QuickStart,
    code: LG1Code,
    language: 'typescript',
    principle:
      'ReAct Agent 把 LLM 放进「思考 → 行动 → 观察」循环：模型判断信息不够时产出带 tool_calls 的消息，框架执行工具并把 ToolMessage 追加回消息列表，模型基于新消息继续推理，直到产出最终回答。createReactAgent 是这个循环的预置实现，传入 llm、tools 与 prompt 即得一个会自己查、自己答的智能体。',
    flow: [
      '用 tool() + Zod Schema 定义工具（名称、描述、参数）。',
      'createReactAgent({ llm, tools, prompt }) 组装智能体。',
      'invoke 跑完整循环拿最终回答，stream 逐步观察每个节点。',
      '消息序列：HumanMessage → AIMessage(tool_calls) → ToolMessage → AIMessage(最终回答)。',
    ],
    notes: [
      '工具的描述与参数 Schema 决定调用准确率，description 要写清适用场景。',
      '每轮 ReAct 循环都消耗 token，上线前设定最大迭代次数。',
      '信息足够时模型会跳过工具直接回答——循环的终止条件在模型手里。',
      '复杂调度不要手写 if-else，Agent 循环本身就是一张状态图的封装。',
    ],
    problem: '解决「模型看不到私有数据只能编造，手写工具调度代码越写越乱」的问题。',
  },
  {
    id: 'LG_2',
    title: '状态图：StateGraph 工作流建模',
    navTitle: '状态图',
    category: '核心构建',
    path: '/langgraph/lg-2/state-graph',
    summary: '用内容生产线展示 StateGraph：Annotation 状态、reducer 合并、条件边回环。',
    demo: null,
    demoComponent: LG02StateGraph,
    code: LG2Code,
    language: 'typescript',
    principle:
      'StateGraph 把工作流建模为有向状态图：状态用 Annotation 声明字段与合并规则，节点是「读状态、返回局部更新」的函数，普通边定义固定转移，条件边用路由函数按状态动态选择下一跳。列表与计数器字段必须配 reducer，否则节点返回时整段覆盖；回环必须设计终止条件。',
    flow: [
      'Annotation.Root 声明状态字段，列表/计数器配 reducer（concat、累加）。',
      'addNode 注册节点函数；节点返回局部更新而非完整状态。',
      'addEdge 连固定顺序，addConditionalEdges 挂路由函数实现分支与回环。',
      'compile 后 invoke 执行、stream 观察每个节点的状态更新。',
    ],
    notes: [
      '不配 reducer 的字段会被节点返回整段覆盖——log、messages 类字段最常见。',
      '回环是条件边的副产品，但必须有终止条件（放行或迭代触顶）。',
      '状态字段只放流程真正需要的，字段越多检查点序列化负担越大。',
      '节点保持纯函数：读状态、返回更新，不发请求不写外部存储，方便单测。',
    ],
    problem: '解决「线性链表达不了分支与回环，手写调度器状态散乱、无法复现」的问题。',
  },
  {
    id: 'LG_3',
    title: '中间件：钩子函数扩展智能体能力',
    navTitle: '中间件',
    category: '核心构建',
    path: '/langgraph/lg-3/middleware',
    summary: '用预算、截断、脱敏、敏感词四个中间件展示模型调用生命周期的钩子机制。',
    demo: null,
    demoComponent: LG03Middleware,
    code: LG3Code,
    language: 'typescript',
    principle:
      '中间件是挂在执行生命周期钩子上的可复用逻辑单元：beforeModel 在模型调用前决策（可熔断）、wrapModelCall 包裹请求与响应（可改写消息）、afterModel 在生成后检查（可过滤替换），另有 wrapToolCall、beforeAgent、afterAgent 等钩子。中间件以数组传入 createAgent，不改主干图即可叠加横切能力。',
    flow: [
      'createMiddleware({ name, ...钩子 }) 定义中间件。',
      'beforeModel 做一刀切决策：预算超限直接 jumpTo 终止。',
      'wrapModelCall 里改请求（截断历史、PII 脱敏）或改响应。',
      'afterModel 检查模型输出：命中敏感词替换成安全话术。',
    ],
    notes: [
      '多个中间件按数组顺序叠加，wrap 类「先注册的在最外层」。',
      '熔断类中间件放最外层，能挡住后面所有开销。',
      '选错钩子做错事：脱敏必须发生在请求发出前（wrapModelCall），afterModel 已经太晚。',
      '中间件可跨智能体复用——这正是它相比「往图里加节点」的最大优势。',
    ],
    problem: '解决「预算、安全、脱敏等横切需求加进图后，主干结构被污染、复用靠复制」的问题。',
  },
  {
    id: 'LG_4',
    title: '人机交互：interrupt 中断与恢复',
    navTitle: '人机交互',
    category: '核心构建',
    path: '/langgraph/lg-4/human-in-the-loop',
    summary: '用退款审批展示 interrupt 挂起、checkpointer 保存现场、Command 从断点恢复。',
    demo: null,
    demoComponent: LG04HumanInLoop,
    code: LG4Code,
    language: 'typescript',
    principle:
      'Human-in-the-Loop 把「暂停等人工」变成框架的一等能力：节点内调用 interrupt(问题) 挂起执行但不是抛异常；checkpointer 按 thread_id 保存完整状态，进程重启也不丢现场；外部做出决定后用 Command({ resume }) 再次 invoke，resume 的值作为 interrupt 的返回值注入节点，从断点继续。',
    flow: [
      '节点内按业务条件调用 interrupt({ question, options })。',
      '编译图时挂 checkpointer（MemorySaver / 持久化实现）。',
      '首次 invoke 在 interrupt 处挂起，返回 __interrupt__ 字段。',
      'new Command({ resume: "approved" }) 恢复执行，断点处接续跑完。',
    ],
    notes: [
      '没有 checkpointer 就没有中断能力——挂起时状态会直接丢失。',
      '同一 thread 上不要同时挂起多个 interrupt，恢复值会错位。',
      'interrupt 的条件留在业务逻辑里：阈值内自然直行，不中断。',
      '生产环境把 MemorySaver 换成持久化后端，跨实例、跨重启都能恢复。',
    ],
    problem: '解决「不可逆的决定机器不该自动做，流程跑到一半需要停下来等人工审批」的问题。',
  },
  {
    id: 'LG_5',
    title: '记忆：短期记忆与长期记忆',
    navTitle: '记忆',
    category: '记忆与上下文',
    path: '/langgraph/lg-5/memory',
    summary: '用学习助手展示 checkpointer 的会话内记忆与 Store 的跨会话长期档案。',
    demo: null,
    demoComponent: LG05Memory,
    code: LG5Code,
    language: 'typescript',
    principle:
      '记忆按生命周期分两层：短期记忆用 checkpointer + thread_id 保存线程内消息历史，同一 thread 每轮都能读到之前发生的事，换 thread 即清零；长期记忆用 Store + namespace 保存用户画像与偏好，与 thread 无关，任何会话都能读回。写入策略（规则或工具）决定长期记忆的质量。',
    flow: [
      '编译图时同时挂 checkpointer 与 store。',
      '短期记忆：invoke 传同一 thread_id，历史自动注入本轮状态。',
      '长期记忆：节点内 store.put / store.get / store.search 读写档案。',
      '写入克制：只把稳定、可复用的信息存进 Store，避免噪音稀释召回。',
    ],
    notes: [
      '短期记忆的 token 成本随轮数增长，长会话要配合截断或摘要。',
      '换 thread 短期清零——这正是「昨天说的今天忘」类 bug 的常见根源。',
      'Store 的 namespace 设计决定检索边界，按「实体类型 + 用户」分层更清晰。',
      '生产环境两个后端都要持久化：内存实现重启即丢。',
    ],
    problem: '解决「每轮对话从零开始，用户被迫重复交代背景，代词全部悬空」的连贯性问题。',
  },
  {
    id: 'LG_6',
    title: '上下文工程：State、Store 与 Runtime',
    navTitle: '上下文工程',
    category: '记忆与上下文',
    path: '/langgraph/lg-6/context-engineering',
    summary: '区分三层上下文：图内状态、运行时注入参数、跨会话档案的职责与读取方式。',
    demo: null,
    demoComponent: LG06ContextEngineering,
    code: LG6Code,
    language: 'typescript',
    principle:
      '上下文按生命周期分三层：State 随单次运行创建、节点间读写、随检查点保存；Runtime Context 由调用方注入、节点只读、不参与状态合并；Store 跨运行持久、按命名空间存取。节点通过 state 与 runtime（runtime.context / runtime.store）分别读取，最终在模型调用前统一「装配」成消息。',
    flow: [
      'State 放流程临时结果：问题、草稿、中间日志。',
      'Context 用 Schema 声明形状，invoke 时注入，节点只读。',
      'Store 放跨会话档案，节点按 namespace get / put。',
      '装配进模型输入：system 消息承载上下文，human 消息承载问题。',
    ],
    notes: [
      '每次请求变化的参数放进模块级变量会串数据，应走 Context 注入。',
      'State 会随检查点保存，别放密钥与超大对象。',
      '上下文装配是「装什么、不装什么」的闸门——装多了烧 token，装少了答不准。',
      '中间件同样能读到 context，适合动态注入系统提示。',
    ],
    problem: '解决「节点数据来源混杂、并发互相污染、测试难以构造」的上下文管理问题。',
  },
  {
    id: 'LG_7',
    title: 'MCP Server：工具生态标准化接入',
    navTitle: 'MCP 接入',
    category: '多智能体',
    path: '/langgraph/lg-7/mcp-server',
    summary: '用 MultiServerMCPClient 接入两个 MCP 服务，展示跨服务工具发现与调用。',
    demo: null,
    demoComponent: LG07McpServer,
    code: LG7Code,
    language: 'typescript',
    principle:
      'MCP（Model Context Protocol）是工具提供方与消费方之间的标准协议：Server 声明工具（名称、描述、参数 Schema），客户端据此发现并调用。LangGraph 侧用 MultiServerMCPClient 配置 Server 清单（stdio 与 http 可混用），getTools() 一次拉取全部工具转成标准 LangChain 工具，工具名带 Server 前缀。',
    flow: [
      '配置 MultiServerMCPClient：stdio 拉起本地进程、http 连远端服务。',
      'client.getTools() 拉取全部工具（名称带 Server 前缀）。',
      '工具数组直接传给 createReactAgent，与原生工具用法一致。',
      '用完 client.close() 释放子进程与连接。',
    ],
    notes: [
      'MCP 工具的 description 质量同样决定调用准确率。',
      '工具名前缀隔离不同 Server 的同名冲突，日志里一眼看出调用归属。',
      'stdio 子进程与 HTTP 连接要显式关闭，长驻服务尤其注意泄漏。',
      '远程 Server 的鉴权走环境变量，别把 token 硬编码进代码。',
    ],
    problem: '解决「每接一个数据源都要写一遍适配代码，工具无法跨应用复用」的问题。',
  },
  {
    id: 'LG_8',
    title: '监督者模式：子智能体当工具',
    navTitle: '监督者',
    category: '多智能体',
    path: '/langgraph/lg-8/supervisor',
    summary: '把子智能体包装成工具交给监督者，展示任务拆解、分派与汇总的全过程。',
    demo: null,
    demoComponent: LG08Supervisor,
    code: LG8Code,
    language: 'typescript',
    principle:
      'subagents-as-tools 模式：每个子智能体是独立的 ReAct Agent（自己的提示词与工具），包装成普通工具交给监督者；包装工具的 description 描述职责边界，监督者通过一轮轮工具调用完成任务拆解、分派与汇总。新增成员只加一个工具，调度代码不动。',
    flow: [
      '先造子智能体：职责单一、工具列表短、提示词聚焦。',
      '用 tool() 包装子智能体：转发任务描述、取回最终产出。',
      '工具 description 写清「派给谁、适合什么任务、返回什么」。',
      '监督者提示词声明调度规则（先调研、后写作、附素材）。',
    ],
    notes: [
      '分派准确率由工具 description 决定，含糊了成员就会被误派活。',
      '子智能体不共享状态，交接全靠工具调用参数——素材要随任务一起传。',
      'token 成本叠加：监督者一轮 + 每个子智能体数轮，复杂任务才划算。',
      '需要跨成员共享状态时再考虑共享图结构方案，多数场景「工具化」就够。',
    ],
    problem: '解决「单体 Agent 工具太多选不准、提示词互相打架、拆分后无人调度」的问题。',
  },
  {
    id: 'LG_9',
    title: '并行执行：扇出、Map-reduce 与子图',
    navTitle: '并行执行',
    category: '多智能体',
    path: '/langgraph/lg-9/parallel',
    summary: '用三维度并行批改展示扇出并发、fan-in 合流、Send 动态分支与子图复用。',
    demo: null,
    demoComponent: LG09Parallel,
    code: LG9Code,
    language: 'typescript',
    principle:
      '状态图支持并发：一条边指向多个下游即扇出，框架并发调度分支；多条边汇入同一节点即 fan-in，框架等全部分支完成再合并。分支数运行时才知时用 Send 为每项动态创建分支实例（Map-reduce）；整段流程需要复用时把编译好的图当作节点（子图）。',
    flow: [
      '固定分支：从同一节点扇出多条边，合流节点由框架等待。',
      '动态分支：路由函数返回 new Send(节点, 输入) 数组，按数据条数展开。',
      '合流靠 reducer：各分支写不同 key 或走追加型合并。',
      '子图：addNode("reviewer", compiledSubgraph) 复用整段能力。',
    ],
    notes: [
      '并行分支写同名字段必须靠 reducer 或分 key 隔离，否则并发覆盖。',
      '合并顺序不保证，reducer 要写成顺序无关的（如对象展开合并）。',
      '分支抛错会让合流失败，重要分支自己做兜底。',
      '并行不是必选项：分支有依赖或下游有限流时，串行更稳。',
    ],
    problem: '解决「互不依赖的子任务被串行排队，总耗时白白累加」的效率问题。',
  },
  {
    id: 'LG_10',
    title: 'RAG：向量、关键词与混合检索',
    navTitle: 'RAG 检索',
    category: '应用实战',
    path: '/langgraph/lg-10/rag',
    summary: '三路检索同题对比：向量的语义、关键词的字面、RRF 融合的稳定。',
    demo: null,
    demoComponent: LG10Rag,
    code: LG10Code,
    language: 'typescript',
    principle:
      '检索策略决定 RAG 的召回质量：向量检索按语义相似度召回，关键词检索按字面词频打分，混合检索把两路结果用 RRF（1/(k+rank) 按名次累加）融合排序。融合只看名次不看分数，无需校准量纲，是生产环境的稳妥默认；三路都可包装成工具交由 Agent 调用。',
    flow: [
      '向量检索：文档与查询嵌入后按余弦相似度召回（语义问题主力）。',
      '关键词检索：BM25 / 词频打分（术语、编号、报错原文主力）。',
      '混合检索：两路召回 + RRF 融合名次（默认推荐）。',
      '包成工具交给 Agent，或在图里固定「检索 → 生成」节点。',
    ],
    notes: [
      '两路必须基于同一份切分块，块 id 对齐才能融合名次。',
      '召回多了要 rerank 与去重控制 token。',
      '多轮问答先做指代消解（用历史改写查询）再进检索。',
      '换嵌入模型必须重建全部向量索引，新旧口径不可混用。',
    ],
    problem: '解决「单一检索路数有盲区：语义换说法失手、术语精确查询漏召回」的问题。',
  },
  {
    id: 'LG_11',
    title: '网络搜索：让智能体接入实时信息',
    navTitle: '网络搜索',
    category: '应用实战',
    path: '/langgraph/lg-11/web-search',
    summary: '把搜索 API 包成工具：规划搜索词、去重限长、带引用作答。',
    demo: null,
    demoComponent: LG11WebSearch,
    code: LG11Code,
    language: 'typescript',
    principle:
      '模型知识冻结在训练截止日，实时信息必须「出去查」：把搜索 API（Tavily / DDGS / Exa 等）包装成 Agent 工具，由模型自主决定何时调用、如何改写搜索词；结果截取片段注入上下文，按标题指纹去重，最终带 [编号] 引用作答，来源列表随答案展示供用户核对。',
    flow: [
      '用 tool() 包装搜索 API，只返回标题、片段与 URL。',
      '提示词要求：先规划搜索词，再调用 web_search。',
      '结果限长（每条 2-3 句）并按标题指纹去重。',
      '关键结论标注 [编号]，UI 上展示来源列表。',
    ],
    notes: [
      '整页内容塞进上下文是 token 黑洞，只保留片段。',
      '网页内容可能含提示注入，不能当系统指令执行。',
      '高风险领域要求双源交叉验证、冲突时以时间最新为准。',
      '换搜索源只替换一个工具实现，Agent 与提示词不变。',
    ],
    problem: '解决「模型知识有截止日期、答不准新闻与版本等实时信息」的时效问题。',
  },
  {
    id: 'LG_12',
    title: 'Deep Agents：开箱的深度智能体',
    navTitle: 'Deep Agents',
    category: '应用实战',
    path: '/langgraph/lg-12/deep-agents',
    summary: '规划清单、虚拟文件系统、子智能体委派、对话记忆——长任务四件套开箱即用。',
    demo: null,
    demoComponent: LG12DeepAgents,
    code: LG12Code,
    language: 'typescript',
    principle:
      'Deep Agents 是面向长任务的预置智能体组件：自带 write_todos 规划工具（任务拆清单、逐项推进）、虚拟文件系统（read_file / write_file / ls 沉淀中间产物）、subagents 子智能体委派、对话记忆。createDeepAgent({ model, subagents, systemPrompt }) 一次创建，长任务所需的「计划、分工、产物」全部就位。',
    flow: [
      '判断任务是否属于长任务：需要计划 + 多专家 + 产出文件。',
      '为子智能体各自创建 Agent，注册进 subagents 数组。',
      'createDeepAgent 创建主智能体，交给它任务目标。',
      '观察轨迹：write_todos → task 委派 → write_file 落盘。',
    ],
    notes: [
      '多轮工具调用成本显著，简单问答别用。',
      '虚拟文件系统在进程内，生产要换持久化存储。',
      '委派链越长失败面越大，上线前设步数上限并估预算。',
      '产出文件让结果可交付、可复核——这是相对单轮对话的根本升级。',
    ],
    problem: '解决「长任务缺规划、中间产物无处沉淀、单智能体扛不动多专家分工」的问题。',
  },
  {
    id: 'LG_13',
    title: '流式界面：事件流驱动的对话前端',
    navTitle: '流式界面',
    category: '应用实战',
    path: '/langgraph/lg-13/streaming-ui',
    summary: 'messages 与 updates 两类事件流经 SSE 到前端，驱动打字机与步骤条。',
    demo: null,
    demoComponent: LG13StreamingUi,
    code: LG13Code,
    language: 'typescript',
    principle:
      '用 stream 替代 invoke 消费执行过程：messages 模式逐 token 输出模型内容（带 langgraph_node 标明出处），updates 模式逐节点输出状态更新；服务端把事件写成 SSE，前端按状态机翻译成打字机文本与步骤条进度。停止、断流、错误三类边界都要有明确的 UI 处理。',
    flow: [
      '服务端 agent.stream(..., { streamMode }) 消费事件。',
      '事件经 SSE（text/event-stream）推送到浏览器。',
      '前端 EventSource / fetch 流逐条读取，翻译成 UI 状态。',
      '停止生成：AbortController 同时中断前端读取与后端执行。',
    ],
    notes: [
      '停止生成要两端同时断，只断前端 token 照样在烧。',
      '断流保留已收文本并支持重试，别让用户白等。',
      '节点事件与 token 事件可能乱序到达，状态要写成可乱序的。',
      '错误要以事件送达，UI 才能从「生成中」态退出。',
    ],
    problem: '解决「批式响应让用户干等整段生成时间、过程完全不可见」的体验问题。',
  },
  {
    id: 'LG_14',
    title: '调试与部署：langgraph dev 与生产化',
    navTitle: '调试部署',
    category: '工程保障',
    path: '/langgraph/lg-14/debug-deploy',
    summary: 'Studio 回放、updates 日志、LangSmith 追踪——图执行的可观测性三件套。',
    demo: null,
    demoComponent: LG14DebugDeploy,
    code: LG14Code,
    language: 'typescript',
    principle:
      '图的可观测性分三层：开发期用 langgraph dev + Studio 逐节点回放、编辑状态、断点重跑；本地与 CI 用 stream updates 打结构化日志（节点名 / 耗时 / 更新字段）；生产用 LangSmith（环境变量开启、零代码改动）自动上报树形 trace。上线前把 MemorySaver 换成持久化检查点，调试配置不带走。',
    flow: [
      '写 langgraph.json 声明图入口，npx @langchain/langgraph-cli dev 启动 Studio。',
      'Studio 里逐节点回放输入输出，支持编辑状态后「从这里重跑」。',
      '本地/CI 用 updates 流打印 trace 日志三件套。',
      '生产开 LangSmith 追踪；检查点、Store 换持久化实现。',
    ],
    notes: [
      'MemorySaver 只适合开发，重启即丢——生产必换持久化后端。',
      '调试数据可能含用户隐私，上报前脱敏或采样。',
      '部署产物只依赖「编译后的图 + 环境变量」，Studio 只留在本地。',
      '排障从 trace 开始：先看哪个节点慢、哪个节点写了意外字段。',
    ],
    problem: '解决「图的 bug 藏在节点之间，没有执行记录只能猜」的排障与生产化问题。',
  },
]
