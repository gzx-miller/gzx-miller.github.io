<template>
  <LlmArticle>
    <div class="llm-question">
      <strong>开场问题：</strong>前面 30 课把 Transformer <em>一块一块拆开</em>讲，这篇附录反其道而行——把所有零件 <em>拼回原位</em>，让你一眼看完「一句话」到「下一个词」的完整旅程。
    </div>
    <h2>一幅画收纳整座 Transformer</h2>
    <p>
      原站配有一个可平移、旋转、缩放的三维全景图，还有一束随着前向传播逐层流动的光点。把它拆成彩色图例来看，其实没有一种视觉元素是在前面没学过的：
    </p>
    <ul>
      <li><strong>橙色块</strong>：输入 token 与最终预测的「下一个词」（第 22 课分词）。</li>
      <li><strong>蓝色球阵</strong>：token embedding，表示词义本身（第 1 / 15 课）。</li>
      <li><strong>红色节点</strong>：token embedding 加 position embedding 之后的当前位置表示，Q/K/V 都从这里投影出来。</li>
      <li><strong>金色节点 + 矩阵</strong>：Q/K/V 投影、QKᵀ 打分、softmax 权重、A·V 加权求和（第 19 / 20 课）。</li>
      <li><strong>绿色小网络</strong>：FFN 的 W1 → GELU → W2 三步，每个位置各自加工（第 21 课）。</li>
      <li><strong>三组概率柱</strong>：logits → exp(z) → softmax 概率，最高的就是答案（第 11 课）。</li>
      <li><strong>流动光点</strong>：一次前向传播——信息正逐层向右传递。</li>
    </ul>
    <h2>顺着光点走一遍：图中六站 ↔ 对应课程</h2>
    <ol class="llm-steps">
      <li><strong>分词</strong>：句子「猫坐在垫子」被切成 4 个 token，各配一个 id（第 22 课）。</li>
      <li><strong>词向量</strong>：每个 token 查表变成一列数字，即 token embedding（蓝色球阵，第 1 / 15 课）。</li>
      <li><strong>加位置</strong>：token embedding 与 position embedding 相加，得位置表示 x（红色节点）。</li>
      <li><strong>自注意力</strong>：把 x 乘三套权重得到 Q/K/V，算 QKᵀ/√d、逐行 softmax，再用 A·V 混合上下文（第 19 / 20 课）。</li>
      <li><strong>FFN</strong>：每个位置单独走 W1 → GELU → W2，图中缩小节点数、只保留计算骨架（第 21 课）。</li>
      <li><strong>2 个 Block + Softmax</strong>：④⑤ 打包成一个 Block，图中画 2 层；最后取末位置做 logits、exp、归一化，得下一个词概率（第 11 / 24 课）。</li>
    </ol>
    <h2>把光点多放几遍，你会看懂「生成」</h2>
    <p>
      所谓「大模型生成文字」，不过是这条流水线<strong>一次又一次地跑</strong>——每吐出一个词，就把它接到句尾，再从头跑一遍，预测再下一个词（第 23 课的自回归）。ChatGPT 写一篇长文，就是这条流水线跑了成千上万次。
    </p>
    <h2>尾声</h2>
    <div class="llm-box hint">
      这张图里没有任何新东西——每一块你都亲手推导过。从一根数轴上的向量，到此刻在你眼前旋转的整座 Transformer，AI 始终是一连串可以追溯的数学与工程决策垒起来的。旅程到此，山，你已登顶。
    </div>
    <div class="llm-term">
      <span class="term-name">「Transformer 全景图」</span>是把 30 课零件拼回原位的整体视图：分词 → 词向量 → 加位置 → 自注意力 → FFN → 多层 Block → Softmax，每次「生成下一个词」都完整地流过这条流水线。
    </div>
  </LlmArticle>
</template>