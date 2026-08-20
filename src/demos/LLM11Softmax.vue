<script setup lang="ts"></script>

<template>
  <LlmArticle>
    <div class="llm-question"><strong>开场问题：</strong>一组任意大小的分数，怎么变成一组加起来等于 1 的概率？</div>

    <h2>提出问题</h2>
    <p>回到猜水果的机器，它最后一层给每种水果配一个神经元。经过若干层「Wx + b + ReLU」之后，三个神经元的输出是 <code>[苹果 2.1，香蕉 −0.5，西瓜 1.8]</code>。这几个数叫 <strong>logits</strong>（原始分数），大小可以比较——说明网络认为「苹果」最像。但有两个问题：</p>
    <ul>
      <li>「苹果」的概率是多少？2.1 这个数字本身没有概率意义。</li>
      <li>三个数加起来等于 3.4，不等于 1——但概率必须加起来等于 1。</li>
    </ul>
    <p>而交叉熵损失需要的输入恰恰是概率。因此要做一个转换：<strong>把三个任意实数变成三个加起来等于 1 的非负数</strong>。</p>

    <h2>最小方案</h2>
    <p>最直接的想法是把三个数都除以总和——可负数项仍会是负数，得到「负概率」。直觉的修补是：把所有数加上最小值的绝对值平移到非负区间。把「−0.5」平移到 0，得到 <code>[2.6, 0, 2.3]</code>，除以总和 4.9 得约 <code>[0.53, 0, 0.47]</code>。</p>
    <h3>发现不足：平移量是任意的</h3>
    <p>为什么必须平移到 0？如果平移到 1，结果变成约 <code>[0.45, 0.14, 0.41]</code>——<strong>概率分布随着任意选择的平移量而改变，这不合理。</strong> 我们需要一个函数：能把任意实数（含负数）都变成正数，而且<strong>不依赖其他数的大小，只保留相对排序</strong>。</p>

    <h2>迭代</h2>
    <p>有一个函数对所有实数输出都是正数，而且不需要知道其他项是多少——就是<strong>指数函数</strong> <code>eˣ</code>。把三个 logit 代进去：<code>e^2.1 ≈ 8.17</code>、<code>e^−0.5 ≈ 0.61</code>、<code>e^1.8 ≈ 6.05</code>，总和 ≈ 14.83，全部除以总和得：苹果 ≈ 0.551、香蕉 ≈ 0.041、西瓜 ≈ 0.408，三者之和恰好为 1。这就是 <strong>Softmax</strong>：对每个 logit 取 <code>e</code> 的指数，再整体归一化：<code>Softmax(zᵢ) = e^zᵢ / Σⱼ e^zⱼ</code>。</p>
    <h3>一个意外的发现：温度参数</h3>
    <p>指数函数会<em>放大</em> logits 之间的差距——2.1 比 1.8 大 17%，但 <code>e^2.1/e^1.8 ≈ 1.35</code>，差距被扩大 35%。差距越大，最大值的概率越接近 1、其他值越接近 0。这个放大程度可以调节：引入<strong>温度参数 T</strong>，把 logits 先除以 T 再做 Softmax：<code>Softmax(z/T)</code>。低温（如 0.5）分布尖锐果断、几乎全押一个答案；高温（如 2）分布平缓随机。这正是 ChatGPT 里 <code>temperature</code> 旋钮的数学来源：低温适合写代码、做数学，高温（0.8~1.0）适合写故事、头脑风暴。</p>
    <div class="llm-box warn">⚠ 数值不稳定性：当某个 logit 是 1000 时，<code>e^1000</code> 会超出浮点数上限（上溢）。解法是先减去最大值再取指数——数学上等价（分子分母同乘 e^−max 抵消），但数值稳定，这就是 log-sum-exp 技巧，PyTorch 的 <code>F.cross_entropy</code> 已内置。</div>

    <h2>总结</h2>
    <p>Softmax 解决了「分数 → 概率」的两个问题（负数 + 不加和为 1）：对每个 logit 取 <code>eˣ</code>（天然非负），再整体归一化。指数放大了差距，温度参数可以反向调节这个放大——这就是 ChatGPT temperature 的数学来源。</p>
    <div class="llm-term"><span class="term-name">「Softmax」</span>是指把一组任意实数（logits）转换为一组非负、且和为 1 的概率的函数，做法是先对每个数取 <code>eˣ</code> 再整体归一化；温度参数 <code>Softmax(z/T)</code> 通过控制放大程度来调节输出的果断或随机。</div>
  </LlmArticle>
</template>