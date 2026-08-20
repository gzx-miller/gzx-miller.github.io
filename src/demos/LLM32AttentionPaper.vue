<template>
  <LlmArticle>
    <div class="llm-question">
      <strong>开场引子：</strong>看完全景图，再回到那篇让这一切出发的起点——按论文原文顺序，把《Attention Is All You Need》完整地读过一遍。这里是其浓缩译文，顺序、关键词与公式均忠实于原文。
    </div>
    <div class="llm-term">
      <span class="term-name">论文信息</span>《Attention Is All You Need》（注意力就是你所需要的一切），作者 Vaswani、Shazeer、Parmar、Uszkoreit、Jones、Gomez、Kaiser、Polosukhin，来自 Google Brain / Research、University of Toronto 等；发表于 NIPS 2017（长滩）。
    </div>
    <h2>摘要</h2>
    <p>
      占主导地位的序列转导模型以复杂 RNN 或 CNN 为基础，包含编码器和解码器；表现最好的还通过注意力机制把两者连起来。本文提出新架构 <strong>Transformer</strong>，<strong>完全基于注意力、彻底舍弃循环与卷积</strong>。在两个机器翻译任务上，它质量更优、更易并行化、训练时间显著更少：WMT 2014 英→德 28.4 BLEU，比既有最佳（含集成）高 2+ BLEU；英→法在 8 块 GPU 上训 3.5 天即达单模型 41.0 BLEU，成本只是文献最佳的一小部分。
    </p>
    <h2>引言</h2>
    <p>
      RNN（尤其 LSTM、GRU）曾是序列建模与转导的最先进方法。循环模型沿符号位置顺序分解计算，生成隐藏状态序列 <code>h_t</code>，其中每个 <code>h_t</code> 是前一个隐藏态与当前输入的函数。这种<strong>内在顺序性</strong>阻碍了样本内并行，序列变长时愈发致命。注意力机制已在多种任务卓有成效，能无视距离建模依赖，但此前大多<strong>与循环结合</strong>。我们提出避开循环、完全靠注意力抽取全局依赖的 Transformer：仅需 8 块 P100 上训 12 小时就达到翻译新最先进水平。
    </p>
    <h2>背景</h2>
    <p>
      Extended Neural GPU、ByteNet、ConvS2S 都用 CNN 并行算所有位置，但关联任意两位置的所需操作数随距离增长（ConvS2S 线性、ByteNet 对数），学习长距离依赖更难。Transformer 将此降为<strong>常数操作数</strong>，代价是注意力加权平均带来有效分辨率下降——用多头注意力抵消。
    </p>
    <p>
      自注意力（内部注意力）把单序列中不同位置彼此关联来计算表示，已被用于阅读理解、摘要、蕴含与句子表示等。Transformer 是第一个<strong>完全依赖自注意力、不使用与序列对齐的 RNN/卷积</strong>的转导模型。
    </p>
    <h2>模型架构</h2>
    <p>
      与主流一致，采用编码器-解码器：编码器把 <code>(x_1,…,x_n)</code> 映射为连续表示 <code>z</code>；解码器据此<strong>自回归</strong>地一次生成一个符号。编码器和解码器都由 <strong>N = 6</strong> 个相同层堆叠。
    </p>
    <ul>
      <li><strong>编码器层</strong>：两个子层——多头自注意力 + 逐位置全连接 FFN。每个子层都做「残差 + 后置层归一化」：<code>LayerNorm(x + Sublayer(x))</code>。所有子层与嵌入层输出维度 <code>d_model = 512</code>。</li>
      <li><strong>解码器层</strong>：除编码器那两个子层外，另插入第三子层，对编码器输出做多头注意力；并把自注意力的 softmax 输入中对未来位置的关系<strong>遮蔽为负无穷</strong>，加上输出右移一位，保证位置 i 的预测只看得到位置 i 之前的信息。</li>
    </ul>
    <h2>注意力</h2>
    <h3>缩放点积注意力</h3>
    <p>
      注意力把「一个查询 + 一组键-值对」映射为输出，输出是值的加权和；权重由查询与对应键的相容性（点积）算出。把查询、键、值分别打包进矩阵 <code>Q</code>、<code>K</code>、<code>V</code>：
    </p>
    <div class="llm-term">Attention(Q, K, V) = softmax(QKᵀ / √d_k) V</div>
    <p>
      除以 <code>√d_k</code> 是本期正文关键：d_k 较大时点积幅度会变大（当 q、k 各分量独立同分布、均值为 0 方差为 1 时，点积 <code>q·k</code> 方差即 <code>d_k</code>），会把 softmax 推入梯度极小的区域；缩放能抵消这一点。点积注意力实践上比加性注意力更快、更省空间，因为可用高度优化的矩阵乘法。
    </p>
    <h3>多头注意力</h3>
    <p>
      与其用一个 d_model 维注意头，不如把 Q/K/V 分别做 h 次线性投影（降到 <code>d_k</code>、<code>d_k</code>、<code>d_v</code> 维），并行执行注意力后拼接、再投影一次：
    </p>
    <div class="llm-term">MultiHead(Q,K,V) = Concat(head₁,…,head_h) Wᴼ　其中 head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)</div>
    <p>
      多头让模型能在不同位置<strong>共同关注不同表示子空间</strong>的信息。本文用 <code>h = 8</code>，每头 <code>d_k = d_v = d_model/h = 64</code>，总成本与单头、全维度近似。三种用法：
    </p>
    <ul>
      <li><strong>编码器-解码器注意力</strong>：Query 来自解码器前一层，Key/Value 来自编码器输出——让解码器每个位置都能看到输入全部位置。</li>
      <li><strong>编码器自注意力</strong>：Q/K/V 同取自编码器前一层输出，实现位置间互相参考。</li>
      <li><strong>解码器自注意力</strong>：每个位置只能看它之前的全部位置，靠掩码保住自回归性质。</li>
    </ul>
    <h2>逐位置前馈、嵌入与位置编码</h2>
    <p>
      每层除注意力外还有逐位置全连接：两个线性变换夹一个 ReLU——<code>FFN(x) = max(0, xW₁ + b₁)W₂ + b₂</code>，内层维度 <code>d_ff = 2048</code>。嵌入把 token 变为 d_model 维，softmax 前线性层与两个嵌入层<strong>共享权重</strong>（嵌入后再乘 <code>√d_model</code>）。
    </p>
    <p>
      既然没有循环也没有卷积，就必须人为注入顺序信息——在嵌入层底部加上<strong>位置编码</strong>（与嵌入同维，直接相加），用不同频率的正弦余弦：
    </p>
    <div class="llm-term">PE(pos, 2i) = sin(pos / 10000^(2i/d_model))　　PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))</div>
    <p>
      位置编码每维对应一条正弦，波长从 2π 到 10000·2π 呈几何级数；这样对任意固定偏移 <code>k</code>，<code>PE_(pos+k)</code> 都能表示成 <code>PE_pos</code> 的线性函数，便于模型按相对位置学习关注。正弦版与学习版结果几乎一致，选正弦是为了能外推到更长的训练未见序列。
    </p>
    <h2>为什么使用自注意力</h2>
    <p>从三个需求比较自注意力、循环层与卷积层：每层计算复杂度、可并行化（最少顺序操作数）、长程依赖的学习难度（最大路径长度）。路径越短越好学。</p>
    <table>
      <thead><tr><th>层类型</th><th>每层复杂度</th><th>顺序操作数</th><th>最大路径长度</th></tr></thead>
      <tbody>
        <tr><td>自注意力</td><td><code>O(n²·d)</code></td><td><code>O(1)</code></td><td><code>O(1)</code></td></tr>
        <tr><td>循环</td><td><code>O(n·d²)</code></td><td><code>O(n)</code></td><td><code>O(n)</code></td></tr>
        <tr><td>卷积</td><td><code>O(k·n·d²)</code></td><td><code>O(1)</code></td><td><code>O(log_k n)</code></td></tr>
        <tr><td>受限自注意力</td><td><code>O(r·n·d)</code></td><td><code>O(1)</code></td><td><code>O(n/r)</code></td></tr>
      </tbody>
    </table>
    <p>
      自注意力用<strong>常数个顺序操作</strong>就能连接所有位置，而循环层要 O(n) 个。当序列长 n 小于表示维 d（最先进翻译模型常用词表示的情况），自注意力更快。附加好处是<strong>可解释性</strong>好——不同注意力头往往学会执行不同任务，并表现出与句法、语义结构相关的行为。
    </p>
    <h2>训练</h2>
    <p>
      原文后续章节依次给出训练数据与批处理、硬件与调度、优化器（Adam + 学习率预热）、正则化（残差 Dropout、标签平滑）等细节，随后是机器翻译结果、并行化与硬件资源评估、单模型与集成比较、注意力可视化，最后结论与参考文献——正是因为本文在翻译基准上以更少训练成本达到更优效果，Transformer 才登上了大模型的起点。
    </p>
    <div class="llm-term">
      <span class="term-name">「Attention Is All You Need」</span>提出完全摒弃循环与卷积、纯注意力堆叠的 Transformer：缩放点积注意力 + 多头 + (残差/层归一化) Block + 位置编码。从此序列建模获得并行化与短路径，成为之后所有大语言模型的地基。
    </div>
  </LlmArticle>
</template>