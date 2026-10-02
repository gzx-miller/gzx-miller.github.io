import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(() => loader())
}

const llmPrinciplesCodeModules = import.meta.glob<string>('../../demos/llm-principles-code/*', { query: '?raw', import: 'default' })

function createCodeLoader(path: string) {
  const loader = llmPrinciplesCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const LLM01Vector = createDemo('LLM01Vector')
const LLM02Ops = createDemo('LLM02Ops')
const LLM03Matrix = createDemo('LLM03Matrix')
const LLM04Transform = createDemo('LLM04Transform')
const LLM05Gradient = createDemo('LLM05Gradient')
const LLM06Prob = createDemo('LLM06Prob')
const LLM07Neuron = createDemo('LLM07Neuron')
const LLM08Activation = createDemo('LLM08Activation')
const LLM09Network = createDemo('LLM09Network')
const LLM10Loss = createDemo('LLM10Loss')
const LLM11Softmax = createDemo('LLM11Softmax')
const LLM12Sgd = createDemo('LLM12Sgd')
const LLM13Backprop = createDemo('LLM13Backprop')
const LLM14Ngram = createDemo('LLM14Ngram')
const LLM15Word2Vec = createDemo('LLM15Word2Vec')
const LLM16Ffnn = createDemo('LLM16Ffnn')
const LLM17Rnn = createDemo('LLM17Rnn')
const LLM18Lstm = createDemo('LLM18Lstm')
const LLM19Attention = createDemo('LLM19Attention')
const LLM20Multihead = createDemo('LLM20Multihead')
const LLM21Transformer = createDemo('LLM21Transformer')
const LLM22Tokenizer = createDemo('LLM22Tokenizer')
const LLM23Arch = createDemo('LLM23Arch')
const LLM24Residual = createDemo('LLM24Residual')
const LLM25Training = createDemo('LLM25Training')
const LLM26Sparse = createDemo('LLM26Sparse')
const LLM27Moe = createDemo('LLM27Moe')
const LLM28Distill = createDemo('LLM28Distill')
const LLM29Recap = createDemo('LLM29Recap')
const LLM30Frontier = createDemo('LLM30Frontier')
const LLM31Transformer3D = createDemo('LLM31Transformer3D')
const LLM32AttentionPaper = createDemo('LLM32AttentionPaper')

const LLM1Code = createCodeLoader('llm-principles-code/LLM1Code.py.txt')
const LLM2Code = createCodeLoader('llm-principles-code/LLM2Code.py.txt')
const LLM3Code = createCodeLoader('llm-principles-code/LLM3Code.py.txt')
const LLM4Code = createCodeLoader('llm-principles-code/LLM4Code.py.txt')
const LLM5Code = createCodeLoader('llm-principles-code/LLM5Code.py.txt')
const LLM6Code = createCodeLoader('llm-principles-code/LLM6Code.py.txt')
const LLM7Code = createCodeLoader('llm-principles-code/LLM7Code.py.txt')
const LLM8Code = createCodeLoader('llm-principles-code/LLM8Code.py.txt')
const LLM9Code = createCodeLoader('llm-principles-code/LLM9Code.py.txt')
const LLM10Code = createCodeLoader('llm-principles-code/LLM10Code.py.txt')
const LLM11Code = createCodeLoader('llm-principles-code/LLM11Code.py.txt')
const LLM12Code = createCodeLoader('llm-principles-code/LLM12Code.py.txt')
const LLM13Code = createCodeLoader('llm-principles-code/LLM13Code.py.txt')
const LLM14Code = createCodeLoader('llm-principles-code/LLM14Code.py.txt')
const LLM15Code = createCodeLoader('llm-principles-code/LLM15Code.py.txt')
const LLM16Code = createCodeLoader('llm-principles-code/LLM16Code.py.txt')
const LLM17Code = createCodeLoader('llm-principles-code/LLM17Code.py.txt')
const LLM18Code = createCodeLoader('llm-principles-code/LLM18Code.py.txt')
const LLM19Code = createCodeLoader('llm-principles-code/LLM19Code.py.txt')
const LLM20Code = createCodeLoader('llm-principles-code/LLM20Code.py.txt')
const LLM21Code = createCodeLoader('llm-principles-code/LLM21Code.py.txt')
const LLM22Code = createCodeLoader('llm-principles-code/LLM22Code.py.txt')
const LLM23Code = createCodeLoader('llm-principles-code/LLM23Code.py.txt')
const LLM24Code = createCodeLoader('llm-principles-code/LLM24Code.py.txt')
const LLM25Code = createCodeLoader('llm-principles-code/LLM25Code.py.txt')
const LLM26Code = createCodeLoader('llm-principles-code/LLM26Code.py.txt')
const LLM27Code = createCodeLoader('llm-principles-code/LLM27Code.py.txt')
const LLM28Code = createCodeLoader('llm-principles-code/LLM28Code.py.txt')
const LLM29Code = createCodeLoader('llm-principles-code/LLM29Code.py.txt')
const LLM30Code = createCodeLoader('llm-principles-code/LLM30Code.py.txt')
const LLM31Code = createCodeLoader('llm-principles-code/LLM31Code.py.txt')
const LLM32Code = createCodeLoader('llm-principles-code/LLM32Code.py.txt')

export const lessons: Lesson[] = [
  {
    id: 'LLM_1',
    title: '什么是向量：给事物拍一张「数字照片」',
    navTitle: '向量的起点',
    category: '基础数学',
    path: '/llm-principles/llm-1/what-is-vector',
    summary: '认识向量把「像不像」变成可计算的坐标与距离，先亲历概念再理解维度的意义。',
    demo: LLM01Vector,
    code: LLM1Code,
    language: 'python',
  },
  {
    id: 'LLM_2',
    title: '向量的常见运算：加法、点积与余弦相似度',
    navTitle: '向量的运算',
    category: '基础数学',
    path: '/llm-principles/llm-2/vector-ops',
    summary: '把「相似」变成可计算的数，从末端距离的盲点一路迭代到只看方向的余弦相似度。',
    demo: LLM02Ops,
    code: LLM2Code,
    language: 'python',
  },
  {
    id: 'LLM_3',
    title: '什么是矩阵：把多组变换装进一张数字表',
    navTitle: '矩阵',
    category: '基础数学',
    path: '/llm-principles/llm-3/matrix',
    summary: '矩阵把多组权重排成一张表，矩阵乘向量本质是「每行与输入做点积」、同时算多个加权求和；维度规则「内层匹配、外层定维」决定了神经网络每层的输入输出形态。',
    demo: LLM03Matrix,
    code: LLM3Code,
    language: 'python',
  },
  {
    id: 'LLM_4',
    title: '什么是线性变换：矩阵乘法在做什么',
    navTitle: '线性变换',
    category: '基础数学',
    path: '/llm-principles/llm-4/linear-transform',
    summary: '揭穿矩阵乘法的几何真相——对整个空间做旋转、拉伸、切变与翻转的统一变换。',
    demo: LLM04Transform,
    code: LLM4Code,
    language: 'python',
  },
  {
    id: 'LLM_5',
    title: '什么是梯度：蒙着眼找到下山路',
    navTitle: '梯度',
    category: '基础数学',
    path: '/llm-principles/llm-5/gradient',
    summary: '从「蒙眼下山」出发，经导数、偏导数与方向导数，把最陡的下山方向打包成梯度向量 ∇L；沿其反方向更新参数即梯度下降，正是神经网络训练的核心引擎。',
    demo: LLM05Gradient,
    code: LLM5Code,
    language: 'python',
  },
  {
    id: 'LLM_6',
    title: '概率与信息：输出为什么叫「概率」',
    navTitle: '概率与信息',
    category: '基础数学',
    path: '/llm-principles/llm-6/probability',
    summary: '非负且加和为 1 的一组数叫概率分布（模型输出因此称「概率」）；信息量与熵层层递进，当真实答案独热时交叉熵塌缩成 −log q(正确)，成为分类与语言模型天然的损失函数。',
    demo: LLM06Prob,
    code: LLM6Code,
    language: 'python',
  },
  {
    id: 'LLM_7',
    title: '神经元结构：加权投票的小开关',
    navTitle: '神经元',
    category: '神经网络',
    path: '/llm-principles/llm-7/neuron',
    summary: '神经元 = 加权求和 w·x + 偏置 b，再经激活函数输出概率；单个神经元只能切一条（超）平面，给每种答案各配一个神经元并用 softmax 归一，就成了可训练的一层。',
    demo: LLM07Neuron,
    code: LLM7Code,
    language: 'python',
  },
  {
    id: 'LLM_8',
    title: '激活函数：给直线网络引入弯折',
    navTitle: '激活函数',
    category: '神经网络',
    path: '/llm-principles/llm-8/activation',
    summary: '纯线性网络叠多少层都等价于一层、只能画直线；激活函数插在层间引入「弯折」打破叠加魔咒，才让层数真正带来表达能力（Sigmoid 两端饱和，ReLU 正区间导数恒为 1 成为现代默认）。',
    demo: LLM08Activation,
    code: LLM8Code,
    language: 'python',
  },
  {
    id: 'LLM_9',
    title: '神经网络与训练：让电脑自己「学」',
    navTitle: '网络与训练',
    category: '神经网络',
    path: '/llm-principles/llm-9/network-training',
    summary: '把神经元叠成一张网，走通前向、算损失、求梯度、更新参数的完整训练循环。',
    demo: LLM09Network,
    code: LLM9Code,
    language: 'python',
  },
  {
    id: 'LLM_10',
    title: '损失函数：把「错得多离谱」变成可比的数',
    navTitle: '损失函数',
    category: '神经网络',
    path: '/llm-principles/llm-10/loss-function',
    summary: '损失函数把「错得多离谱」压成一个可微的数、为梯度下降提供方向标：回归用均方误差，分类用交叉熵 −log(正确类概率)，后者对越离谱的错误给出越大的梯度推力。',
    demo: LLM10Loss,
    code: LLM10Code,
    language: 'python',
  },
  {
    id: 'LLM_11',
    title: 'Softmax：把分数变成概率',
    navTitle: 'Softmax',
    category: '神经网络',
    path: '/llm-principles/llm-11/softmax',
    summary: '让任意大小的分数变成非负且加和为 1 的概率，并用温度参数控制果断与随机。',
    demo: LLM11Softmax,
    code: LLM11Code,
    language: 'python',
  },
  {
    id: 'LLM_12',
    title: '梯度下降与优化器：这一步该迈多大',
    navTitle: '梯度下降',
    category: '神经网络',
    path: '/llm-principles/llm-12/sgd-optimizer',
    summary: '学习率 α 控步长（太大震荡、太小太慢），全量太慢而单样本太抖，Mini-batch 是折中；动量给更新加惯性，配合每参数自适应学习率即成 Adam，是 Transformer 训练的事实标准。',
    demo: LLM12Sgd,
    code: LLM12Code,
    language: 'python',
  },
  {
    id: 'LLM_13',
    title: '反向传播：把错误逐层送回去',
    navTitle: '反向传播',
    category: '神经网络',
    path: '/llm-principles/llm-13/backpropagation',
    summary: '反向传播用链式法则在计算图上从输出把梯度传回每个参数，只需一次前向（保存中间值）+ 一次反向；其连乘特性引出的梯度消失，靠 ReLU、残差连接与梯度裁剪缓解。',
    demo: LLM13Backprop,
    code: LLM13Code,
    language: 'python',
  },
  {
    id: 'LLM_14',
    title: '语言的概率游戏：N-gram',
    navTitle: 'N-gram',
    category: '自然语言处理',
    path: '/llm-principles/llm-14/ngram',
    summary: 'N-gram 只看最近 N 个词、数共现频率查表来估计「下一个词」的条件概率，不懂语法语义；但记性短、把词当孤立符号，且词组合呈稀疏灾难。',
    demo: LLM14Ngram,
    code: LLM14Code,
    language: 'python',
  },
  {
    id: 'LLM_15',
    title: '词向量：词的含义变成坐标',
    navTitle: '词向量',
    category: '自然语言处理',
    path: '/llm-principles/llm-15/word2vec',
    summary: '词向量把每个词表示成一串数字，靠「上下文相似的词意思相近」这条假设用遮词猜词训练，使相似词在向量空间里挨得近，语义关系（国王−男人+女人≈女王）变成了空间方向；局限是每词一个固定向量、区分不了一词多义。',
    demo: LLM15Word2Vec,
    code: LLM15Code,
    language: 'python',
  },
  {
    id: 'LLM_16',
    title: '前馈神经网络语言模型：绕开稀疏灾难',
    navTitle: '前馈语言模型',
    category: '自然语言处理',
    path: '/llm-principles/llm-16/ffnn-lm',
    summary: '前馈语言模型把最近 N 个词的词向量拼接后送入全连接网络预测下一个词；相近的词向量带来相近的输入，从而对未见过的词组举一反三、绕开 N-gram 的稀疏灾难，但仍受固定上下文窗口限制。',
    demo: LLM16Ffnn,
    code: LLM16Code,
    language: 'python',
  },
  {
    id: 'LLM_17',
    title: 'RNN 循环神经网络：给网络装上记忆',
    navTitle: 'RNN',
    category: '自然语言处理',
    path: '/llm-principles/llm-17/rnn',
    summary: 'RNN 用随读词更新的记忆向量 h = tanh(W[词, 旧记忆]+b) 挣脱固定窗口，整条序列复用同一套参数；但旧记忆随距离逐词稀释、梯度沿时间连乘消失，学不到远距离依赖。',
    demo: LLM17Rnn,
    code: LLM17Code,
    language: 'python',
  },
  {
    id: 'LLM_18',
    title: 'LSTM 长短期记忆网络：给记忆装上阀门',
    navTitle: 'LSTM',
    category: '自然语言处理',
    path: '/llm-principles/llm-18/lstm',
    summary: 'LSTM 用长期记忆 C（高速公路）+ 短期记忆 h 两条线，以忘记/写入/读出三扇由 sigmoid 算出的门「有选择」地保留信息，使记忆可几乎无损地传几十上百步、大幅缓解梯度消失；代价是必须顺序读词、无法并行。',
    demo: LLM18Lstm,
    code: LLM18Code,
    language: 'python',
  },
  {
    id: 'LLM_19',
    title: '注意力机制：每个词自己决定看向哪里',
    navTitle: '注意力机制',
    category: '大语言模型',
    path: '/llm-principles/llm-19/attention',
    summary: '注意力让每个词用自己的 Query 查所有词的 Key 打分、softmax 归一成权重，再按权重混合各词的 Value，词义随上下文而变；缩放因子 √d_k 防止 softmax 饱和，且全句并行、任意距离一次直达。',
    demo: LLM19Attention,
    code: LLM19Code,
    language: 'python',
  },
  {
    id: 'LLM_20',
    title: '多头注意力：一个头忙不过来',
    navTitle: '多头注意力',
    category: '大语言模型',
    path: '/llm-principles/llm-20/multihead',
    summary: '多头注意力并排跑 H 套独立的 Query/Key/Value，每个头借用 d/H 维的低维工作空间各抓一种关系，拼接后经线性层融合；总成本几乎等同单头，却能同时建模多种关系（乃至涌现归纳头等上下文能力）。',
    demo: LLM20Multihead,
    code: LLM20Code,
    language: 'python',
  },
  {
    id: 'LLM_21',
    title: 'Transformer 架构：大模型的地基',
    navTitle: 'Transformer',
    category: '大语言模型',
    path: '/llm-principles/llm-21/transformer',
    summary: '一个 Transformer block = 注意力（横向通信）+ 前馈网络 FFN（纵向加工），配位置编码把顺序塞回输入，可并行、可堆叠，末尾线性层 + softmax 预测下一个词；正是 GPT、BERT 等一切大模型的地基。',
    demo: LLM21Transformer,
    code: LLM21Code,
    language: 'python',
  },
  {
    id: 'LLM_22',
    title: 'Tokenizer 分词器：模型眼里的「字」',
    navTitle: 'Token 分词',
    category: '大语言模型',
    path: '/llm-principles/llm-22/tokenizer',
    summary: 'Tokenizer 分词器把文本切成有限词表可查的子词 token 并映射成整数 ID，主流 BPE 从字符出发反复合并高频相邻对；正因模型看到的是 token 而非字符，strawberry 才数不对 r、中文也更耗 token。',
    demo: LLM22Tokenizer,
    code: LLM22Code,
    language: 'python',
  },
  {
    id: 'LLM_23',
    title: '编码器、解码器与大语言模型',
    navTitle: '编码器与解码器',
    category: '大语言模型',
    path: '/llm-principles/llm-23/encoder-decoder',
    summary: '按「当前位置能看见哪些位置」区分：双向编码器把整句读懂（BERT、适合理解），遮住未来的单向解码器自回归续写（GPT、适合生成），编码器-解码器则先读懂再生成；纯解码器因能统一改写各类任务而成为主流。',
    demo: LLM23Arch,
    code: LLM23Code,
    language: 'python',
  },
  {
    id: 'LLM_24',
    title: '残差连接与层归一化：让 96 层不再难训',
    navTitle: '残差与归一化',
    category: '大语言模型',
    path: '/llm-principles/llm-24/residual-layernorm',
    summary: '残差连接 y=f(x)+x 中那个「+1」给梯度留一条导数恒为 1、不衰减的捷径，缓解沿深度的梯度消失/爆炸；LayerNorm 把每个词向量拉回均值 0 标准差 1 并拦下数值漂移，配 Pre-LN 让残差主路畅通，共同撑起上百层深层模型。',
    demo: LLM24Residual,
    code: LLM24Code,
    language: 'python',
  },
  {
    id: 'LLM_25',
    title: '预训练 · 监督微调 · 强化学习：ChatGPT 三阶段',
    navTitle: '三阶段训练',
    category: '大语言模型',
    path: '/llm-principles/llm-25/training-stages',
    summary: '从「会接话」到「会帮忙」要跨三步：预训练在海量文本上预测下一个词获得知识，SFT 用指令-回答范例且只算回答段损失学格式，RLHF 用人类两两偏好炼出奖励模型、配合 KL 缰绳拧出价值观（PPO → DPO）。',
    demo: LLM25Training,
    code: LLM25Code,
    language: 'python',
  },
  {
    id: 'LLM_26',
    title: 'KV 缓存、稀疏注意力与 FlashAttention：驯服 O(n²)',
    navTitle: '注意力加速',
    category: '大语言模型',
    path: '/llm-principles/llm-26/attention-speedup',
    summary: '注意力的账单是 O(n²)：稀疏注意力只让部分 token 配对来「少算」，KV 缓存复用已算好的 K/V 来「不重算」，FlashAttention 用在线 softmax 分块在 SRAM 中计算、使大矩阵不落显存来「快搬」；三者可叠加支撑长上下文。',
    demo: LLM26Sparse,
    code: LLM26Code,
    language: 'python',
  },
  {
    id: 'LLM_27',
    title: 'MoE 混合专家架构：万亿参数却没全用上',
    navTitle: 'MoE 专家',
    category: '大语言模型',
    path: '/llm-principles/llm-27/moe',
    summary: 'MoE 把占 2/3 参数的 FFN 换成一群专家 + 一个路由器，每个 token 只激活 Top-K 个专家，从而知识容量按总参数走、算力按激活参数走；代价是需要负载均衡、显存常驻与跨卡通信。',
    demo: LLM27Moe,
    code: LLM27Code,
    language: 'python',
  },
  {
    id: 'LLM_28',
    title: '模型蒸馏：大模型把本领传授给小模型',
    navTitle: '模型蒸馏',
    category: '大语言模型',
    path: '/llm-principles/llm-28/distillation',
    summary: '蒸馏让学生模型学习教师模型输出的概率分布（软标签）而非只抄正确结论；软标签里藏着「暗知识」（错误项的相对高下），靠升温 T 放大，损失 = α·KL(贴近教师) + (1−α)·交叉熵(对照真答案)。',
    demo: LLM28Distill,
    code: LLM28Code,
    language: 'python',
  },
  {
    id: 'LLM_29',
    title: '串讲：从 N-gram 到 Transformer 的一条线',
    navTitle: '原理串讲',
    category: '大语言模型',
    path: '/llm-principles/llm-29/recap',
    summary: '把 30 课串成一条线——每一代技术，都是来解上一代那个死结的。',
    demo: LLM29Recap,
    code: LLM29Code,
    language: 'python',
  },
  {
    id: 'LLM_30',
    title: '前沿与未来：ChatGPT 之后的下一程',
    navTitle: '前沿与未来',
    category: '大语言模型',
    path: '/llm-principles/llm-30/frontier',
    summary: '看懂当下最活跃的方向与几道硬墙：推理与测试时计算（多想几步）、多模态、智能体、更长上下文与更省（MoE/量化/蒸馏），以及数据、对齐与安全、架构 O(n²)、评测这四道绕不开的难题。',
    demo: LLM30Frontier,
    code: LLM30Code,
    language: 'python',
  },
  {
    id: 'LLM_31',
    title: '附录 1：Transformer 3D 全景图',
    navTitle: 'Transformer 全景图',
    category: '附录',
    path: '/llm-principles/llm-31/transformer-3d',
    summary: '把 30 课零件拼回一座可旋转的 Transformer：分词 → 词向量 → 加位置 → 自注意力 → FFN → 多层 Block → Softmax；每次「生成下一个词」都让整条流水线再从头跑一遍（自回归）。',
    demo: LLM31Transformer3D,
    code: LLM31Code,
    language: 'python',
  },
  {
    id: 'LLM_32',
    title: '附录 2：《Attention Is All You Need》原文译文',
    navTitle: 'Attention 论文译文',
    category: '附录',
    path: '/llm-principles/llm-32/attention-paper',
    summary: '按原文顺序读完《Attention Is All You Need》：缩放点积注意力除以 √d_k 防饱和、多头把 Q/K/V 投影 h 次再拼接、位置编码、残差 + LayerNorm 的 N=6 层 block，以及「为何用自注意力」的动机对比。',
    demo: LLM32AttentionPaper,
    code: LLM32Code,
    language: 'python',
  },
]