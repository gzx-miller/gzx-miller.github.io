const o=`<script setup lang="ts"><\/script>

<template>
  <LlmArticle>
    <div class="llm-question"><strong>开场问题：</strong>输出层错了，第一层的某个权重该负多大责任？</div>

    <h2>提出问题</h2>
    <p>上一课训练台每点一步都用到了梯度 <code>∂L/∂w</code>——可梯度本身是怎么算出来的？最笨的办法是<strong>数值微分</strong>：对每个参数 <code>wᵢ</code> 微微增大 ε，看损失怎么变，<code>∂L/∂wᵢ ≈ (L(w+εeᵢ) − L(w))/ε</code>。算一个参数的梯度需要一次额外前向传播，<code>n</code> 个参数就需要 <code>n</code> 次额外前向传播。GPT-3 有 1750 亿个参数——算一次完整梯度要 <strong>1750 亿次额外前向传播</strong>，时间和能源都是天文数字。有没有办法，只用<strong>一次</strong>前向传播就把所有参数的梯度全部算出来？</p>

    <h2>最小方案</h2>
    <p>反向传播的精神可以用一个词概括：<strong>追责</strong>。输出层算错了，这份「错」该怎么摊派给前面每一层、每个权重——谁影响越大，谁就多背一点责任。而<strong>链式法则</strong>正是这套追责的精确账本：如果 <code>L = f(g(x))</code>，则 <code>dL/dx = (dL/dg)·(dg/dx)</code>。只要知道「损失对这层输出的梯度」，就能算出「损失对这层输入的梯度」，进而继续往前一层传。</p>
    <h3>计算图：跟着数字走一遍</h3>
    <p>最简单的网络：输入 <code>x = 2</code>，一个权重 <code>w = 1.5</code>，网络为 <code>z = wx</code>、<code>a = z²</code>、<code>L = (a−6)²</code>。前向算出 <code>z = 3</code>、<code>a = 9</code>、<code>L = 9</code>；反向用链式法则：<code>∂L/∂a = 2(a−6) = 6</code>、<code>∂a/∂z = 2z = 6</code>、<code>∂z/∂w = x = 2</code>，得 <code>∂L/∂w = 6×6×2 = 72</code>。更新 <code>w ← 1.5 − 0.001×72 ≈ 1.43</code>，再算损失只有 4.65——比原来的 9 小了。关键：反向传播<strong>复用了前向保存的中间值</strong>计算本地导数，整个过程只需一次前向 + 一次反向，代价只是两倍前向传播，<strong>不管有多少参数</strong>都在一次反向扫描里算完。</p>

    <h2>发现不足 / 迭代</h2>
    <p>单神经元只穿过一层就到了权重；真实网络的梯度要<strong>穿过隐藏层</strong>一层层往回传。在「2 输入 → 1 隐藏(Sigmoid) → 2 输出(Softmax)」的认西瓜网络上，会冒出一个漂亮结果：中间一串局部导数<strong>神奇地约成 <code>∂L/∂z = p − y</code></strong>（预测 − 真值）——这正是第 12 课训练台每一步用的梯度，闭环了。隐藏层同时连着多个输出，它的梯度要把每一条来路<strong>相加</strong>。每一环都只是「上一环传来的梯度 × 本环的局部导数」，一路相乘传回去，这就是反向传播的全部秘密。</p>
    <p>但这里还藏着一个<strong>副作用——梯度消失</strong>：梯度是一串相乘 <code>∂L/∂w₁ = ∂L/∂aₙ × ∂aₙ/∂aₙ₋₁ × … × ∂a₁/∂w₁</code>，如果每层本地导数都小于 1（比如 Sigmoid 最大导数只有 0.25），100 层相乘后 <code>0.25¹⁰⁰ ≈ 10⁻⁶⁰</code>，靠近输入的层几乎收不到梯度信号、完全学不到。解法：<strong>ReLU</strong>（正区间导数恒为 1）、<strong>残差连接</strong>（给梯度开直通车）、<strong>梯度裁剪</strong>（防止梯度爆炸）。</p>

    <h2>总结</h2>
    <p>反向传播 = 链式法则在计算图上的系统化应用。前向传播保存中间值，反向传播复用它们计算本地导数，梯度从输出一路流到所有参数，代价仅是两倍的前向传播——这让训练亿级参数成为可能。好消息：框架已内置<strong>自动微分（autograd）</strong>，用 <code>loss.backward()</code> 就能自动填好所有参数的 <code>.grad</code>，反向传播对用户完全透明。</p>
    <div class="llm-term"><span class="term-name">「反向传播（backpropagation）」</span>是指利用链式法则，从输出层把损失的梯度逐层传回到每一个权重和偏置、为每个参数算出「该负多大责任」的高效方法，代价仅需一次前向（保存中间值）加一次反向，且天然的连乘特性引出了梯度消失问题（用 ReLU 与残差连接解决）。</div>
  </LlmArticle>
</template>`;export{o as default};
