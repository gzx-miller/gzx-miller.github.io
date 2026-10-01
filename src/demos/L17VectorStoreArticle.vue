<script setup lang="ts">
import L17VectorStore from './L17VectorStore.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你照着教程，用内存向量库把课程检索 demo 跑得又快又顺。上线当天服务一重启，知识库全没了；等文档从几百条涨到几十万条，检索开始变慢、内存被吃满。代码一行没改，只是「向量存在哪、怎么挑」这两个当初随手做的决定，在规模面前塌了。
    </div>

    <h2>存储与检索抉择</h2>
    <p>
      「把文本变成向量、再用相似度找最近的几条」这套机制没变。可一旦要真正落地，就会冒出两个必须由人做主的决定：<strong>向量存到哪种介质里</strong>，以及<strong>检索时凭什么规则把候选挑出来</strong>。
    </p>
    <p>
      旧办法是照搬 demo：所有场景都用一个内存存储，配一句纯相似度的 <code>similaritySearch</code>。它把三笔成本留给了你：
    </p>
    <ol class="lesson-steps">
      <li><strong>数据留不住</strong>：内存存储不持久，重启即丢，多个实例之间也无法共享同一份索引。</li>
      <li><strong>结果高度同质</strong>：纯相似度只看「谁最像」，会把同一句话的不同切分一起召回，几条证据内容雷同。</li>
      <li><strong>口径会漂移</strong>：一旦换了嵌入模型，新老向量的维度与语义空间不再一致，相似度分数整体失去意义。</li>
    </ol>
    <p>
      要回答的是：<strong>怎样按规模与运维条件选对向量存储，并配出一套能控制「召回质量」的检索策略？</strong>
    </p>

    <h2>简易向量检索实现</h2>
    <p>
      先用最简单的一种：内存向量库 <code>MemoryVectorStore</code>，配合单一路径的相似度检索，调 <code>similaritySearch(query, k)</code> 拿最相关的 k 条。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「翻遍所有原文」变成了「在向量空间里找最近邻」</strong>，而且把接口收敛成同一个约定——不管后端是内存、Chroma 还是云端，调用的形状都是「给一句话、拿回几条」。这份约定要保留。
    </p>

    <h2>内存存储的短板</h2>
    <ul>
      <li>内存存储不持久：服务重启索引清零，多实例之间各存各的，规模一大内存先扛不住。</li>
      <li>纯相似度 Top-K 会召回一堆「几乎一样」的块：同一段话被切成三块，三条结果内容雷同，反而挤掉了别的角度。</li>
      <li>没有元数据过滤：用户只想在「向量数据库」这一类里找，结果把「框架介绍」也混了进来。</li>
      <li>换了嵌入模型后新旧向量不能混用：同一个库里一部分是这个模型的向量、一部分是另一个模型的，相似度分数再也对不上。</li>
      <li><code>topK</code> 和相似度阈值靠拍脑袋定：阈值太高召回为空，太低噪声满屏。</li>
    </ul>

    <h2>后端与检索分层</h2>
    <p>
      不推翻「存向量、比相似度」，而是在后端与检索策略两层上分别补齐。
    </p>
    <p>
      第一步，<strong>按规模和运维条件选后端</strong>。开发与原型验证用 <code>MemoryVectorStore</code> 就够；本地部署和中小规模上 <code>Chroma</code> 或 <code>FAISS</code>；面向生产的大规模、高并发交给托管服务 <code>Pinecone</code>；团队已经在用 PostgreSQL 的话，<code>pgvector</code> 能在关系库里直接存查向量，省一套新的运维。选型看的从来不是「谁最强」，而是「规模、性能、部署方式、成本」这四件事的组合。
    </p>
    <p>
      第二步，<strong>把「只看相似」换成兼顾多样</strong>。用 <strong>MMR（最大边际相关性）</strong>：先按相似度召回一批候选（<code>fetchK</code>），再一轮轮挑出「和问题相关、又和已选结果不重复」的文档，<code>lambda</code> 在最大多样性与最大相关性之间调权重。这样同一句话的三块碎片只会留下一条，腾出位置给别的信息。
    </p>
    <p>
      第三步，<strong>加元数据过滤，先把范围收窄再排序</strong>。给文档带上 <code>category</code>、<code>source</code> 这类字段，检索时传入过滤条件，让「只在某一类里找」变成查询的一部分；实际项目里，向量 + 关键词的<strong>混合检索</strong>通常比纯向量效果更好，尤其对专有名词、编号这类字面信号。
    </p>
    <p>
      第四步，<strong>把阈值和 topK 一起调</strong>。先用 <code>similaritySearchWithScore</code> 看真实查询的分数分布，再据此定阈值——先看分布、后定阈值，才能避免过滤之后一条都不剩。
    </p>
    <p>
      最后一条容易忘但代价最大：<strong>换嵌入模型必须重建全部索引</strong>。文档更新时也要用同一个嵌入模型增量重建，保证库里所有向量口径一致，否则检索质量会在某次「悄悄升级模型」之后整体跑偏。
    </p>

    <h2>四类后端对比</h2>
    <figure class="lesson-figure">
      <figcaption>点顶部四张卡片切换 Chroma / FAISS / Pinecone / pgvector，看各自的相似度度量差异；切「cosine / dot / l2」三个页签对比公式；再勾选「混合检索（向量 + 关键词）」，看得分低于 0.5 的文档被过滤掉、整体结果如何变干净。</figcaption>
      <L17VectorStore />
    </figure>

    <h2>规模与召回取舍</h2>
    <p>
      向量库这堂课要拿走的判断是：存储后端按「规模 + 运维」选，检索策略按「召回质量」配。纯相似度会给出同质结果，用 MMR 换多样性、用元数据过滤收范围、用分数分布定阈值；而只要换了嵌入模型，就必须整体重建索引——否则检索的地基就歪了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「MMR（最大边际相关性）」</span>是一种兼顾相关性与多样性的检索策略：先从候选集中取出最相关的一批（<code>fetchK</code>），再迭代挑选「与查询相关、但与已选文档尽量不重复」的结果，<code>lambda</code> 控制两者权重——取 0 偏向最大多样性，取 1 偏向最大相关性。边界：它解决的是「结果同质」，并不能解决「库里根本没有答案」；候选集里没有的内容，任何排序策略都变不出来。
    </div>
  </LessonArticle>
</template>
