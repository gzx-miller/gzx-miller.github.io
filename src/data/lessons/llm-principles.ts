import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到内容组件：${name}`)
  return defineAsyncComponent(() => loader())
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

export const lessons: Lesson[] = [
  {
    id: 'LLM_1',
    title: '什么是向量：给事物拍一张「数字照片」',
    navTitle: '向量的起点',
    category: '基础数学',
    path: '/llm-principles/llm-1/what-is-vector',
    summary: '认识向量把「像不像」变成可计算的坐标与距离，先亲历概念再理解维度的意义。',
    demo: LLM01Vector,
    code: () => Promise.resolve(`# 用一组有顺序的数字（向量）把事物变成可计算的距离
cat    = [0.25, 0.80]      # (体型, 凶猛)
tiger  = [0.90, 0.95]
goldfish = [0.02, 0.30]

def dist(a, b):            # 欧几里得距离：算两个向量差多“远”
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

print(dist(cat, tiger))    # 0.66 —— 猫与老虎“像”
print(dist(cat, goldfish)) # 0.55 —— 猫与金鱼“不像”
# 维度不足就再加一维，直到能把想区分的事物全部拉开`),
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
    code: () => Promise.resolve(`import numpy as np

a, b = np.array([1, 3]), np.array([4, 9])

# 点积：逐位相乘再加总，刻画“同向程度”
dot = float(a @ b)

# 余弦相似度：除以各自长度，去掉模的影响，只看方向
def cosine(x, y):
    return float(x @ y) / (np.linalg.norm(x) * np.linalg.norm(y))

print(dot)           # 31
print(cosine(a, b))  # 0.98 —— 值越接近 1 越相似

# 语义算术：国王 − 男人 + 女人 ≈ 女王
# vec(king) - vec(man) + vec(woman) ≈ vec(queen)`),
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
    code: () => Promise.resolve(`import numpy as np

# 矩阵就是“多组权重”排成的一张表；Wx 即每行与 x 做点积
W = np.array([[0.2, 0.8],     # 第 1 个输出神经元：0.2*[0] + 0.8*[1]
              [0.9, 0.1],     # 第 2 个输出神经元
              [0.5, 0.5]])    # 第 3 个输出神经元
x = np.array([3, 1])          # 输入向量

out = W @ x
print(out)        # [1.4 2.8 2.0]
# 维度规则：矩阵列数 = 输入维，矩阵行数 = 输出维，内层匹配外层定`),
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
    code: () => Promise.resolve(`import numpy as np

# 矩阵乘法的几何真相：把整个空间做线性变换
# 看矩阵的两列 = 两条基向量 (1,0)、(0,1) 分别落在了哪里
shear = np.array([[1, 1],
                  [0, 1]])    # 沿 x 轴的切变
rot   = np.array([[0, -1],
                  [1,  0]])    # 逆时针旋转 90°

v = np.array([2, 1])
print(shear @ v)   # 拉伸成倾斜
print(rot @ v)     # 旋转到 (-1, 2)

# 再加偏置得到 y = Wx + b；但纯线性叠多层仍等价于一层，
# 想要真正的表达能力，必须引入激活函数（见第八课）`),
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
    code: () => Promise.resolve(`import numpy as np

# 梯度：把所有偏导数装进一个向量，指向“最陡上升”方向
def f(w1, w2):                  # 损失曲面，比如一个碗
    return (w1 - 3) ** 2 + (w2 + 2) ** 2

def grad(w1, w2, h=1e-3):       # 数值求导近似
    g1 = (f(w1 + h, w2) - f(w1 - h, w2)) / (2 * h)
    g2 = (f(w1, w2 + h) - f(w1, w2 - h)) / (2 * h)
    return np.array([g1, g2])

w = np.array([0.0, 0.0])
alpha = 0.1                      # 学习率：一步迈多大
for _ in range(60):              # 沿负梯度方向迭代下山
    w = w - alpha * grad(*w)
print(w)                         # ≈ [3., -2.] 山谷最低点`),
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
    code: () => Promise.resolve(`import math

probs = [0.7, 0.2, 0.1]          # 非负且和为 1，才是合法分布

def entropy(p):                  # 熵 = 平均“意外程度”
    return -sum(pi * math.log2(pi) for pi in p)

# 交叉熵分类损失：只看正确类概率，越离谱越受罚
def cross_entropy(q_correct, y_correct=1.0):
    return -y_correct * math.log(q_correct)

print(entropy(probs))            # 信息更“散”，熵更大
print(cross_entropy(0.9))        # 0.105 —— 很有把握
print(cross_entropy(0.1))        # 2.30  —— 错得离谱`),
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
    code: () => Promise.resolve(`import math

# 神经元：加权投票 + 可调门槛 + 压扁成概率
def neuron(x, w, b, activation='sigmoid'):
    z = sum(wi * xi for wi, xi in zip(w, x)) + b   # 加权求和 + 偏置
    if activation == 'sigmoid':
        return 1 / (1 + math.exp(-z))              # 压到 0~1
    return max(0, z)                               # ReLU

x = [1, 0, 1]
w = [0.4, -0.1, 0.8]
b = -0.3
print(neuron(x, w, b))     # 0.71 —— 偏向“激活”

# 单个神经元只能切一条直线；多类就给每类配一个神经元再用 softmax`),
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
    code: () => Promise.resolve(`import math

# 线性层的线叠线还是线：两层不含激活等价于一层
import numpy as np
W2, b2 = np.array([[2.0, -1.0]]), np.array([0.0])
W1, b1 = np.array([[1.0], [1.0]]), np.array([0.0])
merged = W2 @ W1          # 0 层，等价一层
print(merged)

# 激活函数在层间断出“弯折”，层数才带来表达能力
def relu(x): return max(0, x)
def tanh(x): return math.tanh(x)

x = np.linspace(-3, 3, 100)
# 每层用 relu/tanh 再叠，就能逼近任意曲线（万能逼近）`),
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
    code: () => Promise.resolve(`import numpy as np

def relu(x): return np.maximum(0, x)

# 前向：输入 -> 隐藏层 -> 输出，网络等价于一个带参数的大函数
W1, b1 = np.random.randn(4, 2) * 0.1, np.zeros(4)   # 隐藏层 4 个神经元
W2, b2 = np.random.randn(1, 4) * 0.1, np.zeros(1)   # 输出 1 个

def forward(x):
    h = relu(W1 @ x + b1)
    return W2 @ h + b2

for epoch in range(500):          # 训练 = 前向->算损失->求梯度->更新
    y_pred = forward(x)
    loss   = 0.5 * (y_pred - y) ** 2
    # 反向传播求 dW1/dW2 后：param -= lr * grad（见 12、13 课）
    # 更新 W1, W2, b1, b2 ...
print(forward(x))                 # 逼近目标 y`),
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
    code: () => Promise.resolve(`import math

# 回归：均方误差 MSE —— 平方差越大越受罚
def mse(y_true, y_pred):
    return sum((a - b) ** 2 for a, b in zip(y_true, y_pred)) / len(y_true)

print(mse([1.0, 2.0], [1.1, 1.85]))   # 0.01375

# 分类：交叉熵 —— 只看正确类的概率，错得越离谱惩罚越大
def cross_entropy(p_correct):
    return -math.log(p_correct)

print(cross_entropy(0.9))   # 0.1053
print(cross_entropy(0.3))   # 1.204  错得多，梯度推力更猛`),
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
    code: () => Promise.resolve(`import math

def softmax(logits, T=1.0):
    # 取 e^(z/T) 消掉负数，再整体归一化
    z = [v / T for v in logits]
    ex = [math.exp(v - max(z)) for v in z]   # 减去最大值防溢出
    s  = sum(ex)
    return [v / s for v in ex]

logits = [2.0, 1.0, 0.1]
print(softmax(logits))        # 和 = 1 的三份概率
print(softmax(logits, T=0.5)) # 更低温度：更“果断”
print(softmax(logits, T=2.0)) # 更高温度：更“随机平均”`),
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
    code: () => Promise.resolve(`# 学习率 alpha 决定一步迈多大，太大震荡、太小太慢
# 三种数据量策略：
#   全量 GD : 每步用整个数据集 -> 太慢
#   在线 SGD: 每步用单个样本   -> 抖动大
#   Mini-batch: 每步用一小批   -> 折中（主流）

# Adam = 动量(速度记忆) + 自适应学习率(按梯度大小缩放) 的分量
def adam_step(m, v, g, t, lr=0.001, b1=0.9, b2=0.999, eps=1e-8):
    m = b1 * m + (1 - b1) * g          # 一阶动量
    v = b2 * v + (1 - b2) * g * g      # 二阶动量
    mh = m / (1 - b1 ** t); vh = v / (1 - b2 ** t)
    return mh, vh, lr * mh / (vh ** 0.5 + eps)  # 更新量`),
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
    code: () => Promise.resolve(`import autograd.numpy as np  # 占位，示意计算图
from autograd import grad

# 反向传播 = 链式法则在计算图上从输出传回每个参数
def forward(W1, W2, x):
    h = np.maximum(0, W1 @ x)      # 隐藏层 ReLU
    return W2 @ h                   # 输出层（线性）

x = np.array([1.0, 2.0])
loss_W1 = grad(lambda W1: ((forward(W1, np.array([1.0, -1.0]), x) - 1) ** 2), 0)
# 每层参数得到自己的梯度 dL/dW，前向存值、反向复用，代价仅约两倍的“前向”
# 弱点：长链路连乘导致梯度消失，靠 ReLU 和残差连接缓解（见 24 课）`),
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
    code: () => Promise.resolve(`from collections import Counter, defaultdict

corpus = "the dog barked the cat slept the dog slept".split()
model = defaultdict(Counter)

for i in range(len(corpus) - 1):          # 数“最近 N 个词”的共现次数
    model[corpus[i]][corpus[i + 1]] += 1

def next_word(w):                          # 纯数数，不懂语法/语义
    return model[w].most_common(1)[0][0]

print(next_word("the"))                    # 接出最多的后继词
# 缺陷：只记 N 个词(记性很短) + 词被当独立符号(组合稀疏灾难)`),
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
    code: () => Promise.resolve(`import numpy as np

# 思想：上下文相似 => 意思相近；用“遮住当前词猜词”来训练
# 语义关系被编码成向量方向，于是能做向量算术
vec = {}.fromkeys(["king", "man", "woman", "queen"], np.zeros(64))
# 真实训练后：
# vec["king"] - vec["man"] + vec["woman"] ≈ vec["queen"]

def top_cosine_rank(target, exclude):
    # 用余弦相似度列出与 target 最相近的词（此处示意）
    return sorted(exclude, key=lambda w: cosine(target, w), reverse=True)

# 相似的词在高维空间里挨得近，距离/方向即可计算的“语义”`),
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
    code: () => Promise.resolve(`import numpy as np

def relu(x): return np.maximum(0, x)

# 前馈语言模型：窗口里的词先查向量，拼接后送入全连接
emb = { "猫":[0.1, 0.9], "猎狗":[0.3, 0.7], "老虎":[0.8, 0.8] }
window = [emb["猫"], emb["猎狗"]]
x = np.concatenate(window)                # 两个词向量拼成一串
W1, W2 = np.random.randn(8, 4), np.random.randn(4, 8)
h   = relu(W1 @ x)                        # 相近输入 -> 相近输出
logits = W2 @ h

# 没见过的“猫 猎狗”因为和训练过的词向量相近，也能推对，
# 从而绕开 N-gram 的稀疏灾难 —— 这是词向量带来的泛化`),
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
    code: () => Promise.resolve(`import numpy as np

def tanh(x): return np.tanh(x)

# RNN：把线性变换+激活接成环，记忆 h 随每个词不断更新
def rnn_step(h_prev, x_t, Wh, Wx, b):
    return tanh(Wh @ h_prev + Wx @ x_t + b)   # 单步

Wh, Wx, b = np.random.randn(3, 3)*0.1, np.random.randn(3, 5)*0.1, np.zeros(3)
h = np.zeros(3)                                # 初始记忆
for x_t in words:                              # 逐词读入
    h = rnn_step(h, x_t, Wh, Wx, b)
# 优点：可以看无限长的过去(记忆)
# 缺点：记忆逐词稀释 + 沿时间的连乘让梯度消失(记不长远)`),
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
    code: () => Promise.resolve(`import numpy as np
def sig(x): return 1/(1+np.exp(-x))
def act(x): return np.tanh(x)

# LSTM：长期记忆 C + 短期记忆 h 两条线，和三扇门做加权的加法
def lstm_step(C, h, x, W, b):
    i, f, o, g = (sig(W @ np.concatenate([h, x]) + b).reshape(4,-1) for _ in range(1))
    # 忘记门f、写入门i、读出门o 控制打多开多大
    C = f * C + i * g          # 记忆近乎“无损”地按需取舍
    h = o * act(C)
    return C, h

# 关键信息可以几乎不衰减地传几十上百步 —— 克服 RNN 的记性短`),
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
    code: () => Promise.resolve(`import numpy as np
def softmax_logits(z):
    e = np.exp(z - np.max(z)); return e / e.sum()

# 注意力：每个词用自己的 Query 查所有词 Key 打分，
# softmax 归一后按权重去混合 Value
def attention(Q, K, V, dk):
    scores = Q @ K.T / np.sqrt(dk)      # (词 x 词) 相关度，除以 sqrt(dk) 防方差爆
    weights = softmax_logits(scores)
    return weights @ V                   # 加权混合，得上下文相关的表示

# “它太累了”的“它”回头看上下文里出现过的那只猫，
# 词义不再固定，而是随上下文而变 —— 这就是注意力`),
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
    code: () => Promise.resolve(`import numpy as np

# 多头注意力：把 d_model 维拆成 H 份，每个头在自己的子空间算注意力
# 一个头抓“指代”，一个头抓“句法”，一个头抓“情感”……
H = 8
d_model, d_head = 512, 64

def cut(v, head):                       # 切出第 head 头的专属维度
    sl = slice(head * d_head, (head + 1) * d_head)
    return v[:, sl]

# 每头自己算 attention(Q_h, K_h, V_h)，再把 H 个头拼回 d_model
# 成本基本不变(O(n^2) 照旧)，却能同时建模多种关系 —— 即“多头”`),
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
    code: () => Promise.resolve(`# 一个 Transformer block = 注意力(横向通信) + FFN(纵向加工) + 残差 + LayerNorm
def transformer_block(x, attn, ffn, norm):
    x = norm(x + attn(x))   # 残差 + 自注意力 + 归一化
    x = norm(x + ffn(x))    # 残差 + 前馈 + 归一化
    return x

# 位置编码注入顺序信息；多层堆叠；最上层 softmax 输出下一个词
# 与 RNN 不同：所有词的位置可并行计算(不需逐词等待)，规模易扩展
# 2017《Attention Is All You Need》把这一整套拼起来 --> 大模型地基`),
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
    code: () => Promise.resolve(`from collections import defaultdict, Counter

# BPE：从字符开始，反复合并出现最高频的相邻字符对，直到达到词表上限
def bpe(corpus, num_merges=20):
    raw = " ".join(list(w)) + " </w>"          # 先拆成字符
    for _ in range(num_merges):
        pairs = Counter(zip(raw.split(), raw.split()[1:]))
        if not pairs: break
        best = max(pairs, key=pairs.get)        # 挑最高频的字符对
        # 把这对合并成一个新 token —— 迭代则得词表
    return raw

# 文本 -> token 序列 -> 整数 ID -> 查表得向量
tokens = "strawberry"
# 细节：模型只看到 token，看不到内部字符，所以数不对 r 的个数`),
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
    code: () => Promise.resolve(`# 编码器：每个位置同时看左右 -> 双向，擅长“读懂输入”，如 BERT
# 解码器：只能看左侧已有内容 -> 单向，擅长自回归“续写”，如 GPT
# 纯解码器(decoder-only) 成为主流：任务被统一成“预测下一个 token”，
#   于是问答、翻译、总结、代码都能用同一套法子改写来实现
# - 隐式：decoder 用因果掩码(mask) 让注意力只看左边
def causal_mask(i, j):
    return 0 if i >= j else -float("inf")   # 遮住未来，保证自回归`),
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
    code: () => Promise.resolve(`import numpy as np

# 残差连接 y = f(x) + x ：那个“+ x”给梯度留了一条不衰减的捷径，
# 任你堆 96 层，梯度也能从顶层几乎原样传回第 1 层
def residual(f, x):
    return f(x) + x

# 层归一化 LayerNorm：把每条样本拉回“均值0 标准差1”
def layernorm(x, eps=1e-5):
    mu, var = x.mean(), x.var()
    return (x - mu) / np.sqrt(var + eps)

# 挡数值漂移，训练更稳；Pre-LN 把主路放在残差捷径上更利于极深网络`),
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
    code: () => Promise.resolve(`# ChatGPT 的三步训练（缺一不可）
# 1) 预训练 (Pre-train) ：海量文本预测下一个词 -> 得“知识/才华”
# 2) 监督微调 (SFT)     ：指令-回答范例，且损失只看回答段 -> 学“问答格式”
# 3) 强化学习 (RLHF)    ：人类 A/B 偏好 -> 奖励模型打分, KL 缰绳防跑偏 -> 立“价值观”

# 奖励 = r(x, y) - beta * KL(新模型 || SFT模型)   # 追高分同时也别走火入魔
# PPO 笨重，DPO 直接跳过奖励模型与 RL 循环一步拧到位`),
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
    code: () => Promise.resolve(`# 注意力代价是 O(n²)，三套工程手段分别解决“算/存/搬”：
# 1) 稀疏注意力：只让一部分 token 配对（滑动窗口/全局 token）-> 少算
# 2) KV 缓存   ：已算出的 Key/Value 缓存复用，新 token 不重算 -> 少算
# 3) FlashAttention：分块在高速 SRAM 里在线算 softmax，不把整段矩阵写回
#                    慢速 HBM，用“少搬运”换速度
# 三者可叠加，是长上下文(如 128K/1M) 的关键基础设施`),
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
    code: () => Promise.resolve(`import numpy as np

# MoE：把占 2/3 参数的 FFN 换成 N 个专家 + 一个路由器
# 每个 token 只交给得分最高的 Top-K 个专家
def route(x, router_weights, top_k=2):
    scores = router_weights @ x          # 每个专家给个分数
    experts = np.argsort(scores)[-top_k:]  # 只留 Top-K
    return experts

# 妙处：总参数多(知识容量大)，但每次推理只用其中一小部分(算力省)
# 三大坑：负载不均衡(加惩罚)、显存翻倍、专家间通信开销`),
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
    code: () => Promise.resolve(`import numpy as np

# 蒸馏：让“学生”小模型去学“教师”大模型输出的概率分布
# 温度 T 把分布“升温”，让软化标签含有更多暗知识，
# 即非正确答案之间的相对高下也被当作“软标签”传给学生
def softmax_t(logits, T):
    e = np.exp(np.array(logits) / T - np.max(np.array(logits) / T))
    return e / e.sum()

# 损失 = alpha*KL(学生(T=T) vs 教师(T=T)) + (1-alpha)*交叉熵(学生T=1 vs 硬标签)
# 局限：学生通常翻不过教师，蒸馏补的是“压缩部署”，不是超越`),
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
    code: () => Promise.resolve(`# 30 课只是一条“解死结”的线，每一代都来解上一代的难题：
# N-gram            : 只会数共现 -> 稀疏灾难
# 词向量 Word2Vec   : 稠密向量+泛化 -> 绕开稀疏
# 前馈语言模型 FFNN : 向量输入查表预测 -> 仍是固定窗口
# RNN               : 记忆向量 -> 记性短/梯度消失
# LSTM              : 三扇门 -> 记性长但顺序逐个算
# Transformer       : 注意力+并行 -> 规模跃迁，终成大模型地基
# 之后：预训练(才华) -> SFT(礼仪) -> RLHF(价值观) 才成为“能帮上忙”的 ChatGPT`),
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
    code: () => Promise.resolve(`# 当下最活跃的研究方向与几道硬墙：
# 想更深 : 推理 + 测试时计算（让模型遇难题多想几步）
# 看得更广: 多模态（文本/图像/音视频统一）
# 做得更多: 智能体（会调工具、会规划、会行动）
# 记得更牢/跑得更省: 长上下文、MoE、量化、蒸馏
# 硬墙：高质量数据见顶、对齐可控性、架构瓶颈界限、评测与安全
# 预判演变：从“会聊天”走向“能执行任务”的助手型智能体`),
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
    code: () => Promise.resolve(`# 全景图把 30 课零件拼回原位的六站流水线：
# ① 分词 -> ② 词向量(embedding) -> ③ 加位置(embedding + position)
# -> ④ 自注意力(QKV 投影、QKᵀ/√d、softmax、A·V 混合上下文)
# -> ⑤ FFN(W1 -> GELU -> W2) -> ⑥ Block x 2 + Softmax
# 所谓“生成”：每吐出一个词就接到句尾，整条流水线再从头跑一遍(自回归)`),
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
    code: () => Promise.resolve(`# 论文两大核心公式的浓缩：
# 1) Scaled Dot-Product Attention
#    Attention(Q,K,V) = softmax(QKᵀ / √d_k) V   # 除以√d_k防点积变大把softmax推入梯度极小区
# 2) Multi-Head 把 Q/K/V 各投影 h 次并行再拼接：
#    MultiHead(Q,K,V) = Concat(head₁,…,head_h)Wᴼ,  head_i = Attention(QWᵢ^Q,KWᵢ^K,VWᵢ^V)
# 配合 d_model=512、N=6 层、(残差+LayerNorm) Block、正弦位置编码`),
    language: 'python',
  },
]