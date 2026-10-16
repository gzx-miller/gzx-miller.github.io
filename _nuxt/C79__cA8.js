const n=`<script setup lang="ts">
import LG10Rag from './LG10Rag.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程知识库接入后，用户反馈两极分化：有人问「ref 和 reactive 的区别」，回答精准得像抄的原文；有人问「数据改了页面自己变是怎么实现的」，助手却说「知识库中没有相关内容」——明明库里就写着响应式原理。同一份知识库，命中率全凭提问者的用词。
    </div>

    <h2>单路检索的死角</h2>
    <p>
      向量相似度检索只是 RAG 的其中一路。只用一路，会遇到它天生的盲区：
    </p>
    <ul>
      <li><strong>只用向量</strong>：语义近义是强项，但术语名、编号、报错原文这类「精确字符串」容易被近义块淹没。</li>
      <li><strong>只用关键词</strong>：精确术语一抓一个准，但用户换个说法（「页面自动变」对应「响应式更新」）就直接失明。</li>
      <li><strong>任何单一路</strong>：召回结果没有交叉验证——只有一路说好，你无从判断它是真命中还是碰巧。</li>
    </ul>
    <p>
      要回答的是：<strong>怎么让检索既不漏语义、又不丢术语，还能让结论更可信？</strong>
    </p>

    <h2>三路策略与 RRF 融合</h2>
    <p>
      不推翻单路检索，而是把两路并行接上、再做一次融合排序。
    </p>
    <ol class="lesson-steps">
      <li><strong>向量检索</strong>：查询与文档都转成嵌入向量，按余弦相似度召回——语义型提问的主力。</li>
      <li><strong>关键词检索</strong>：BM25 / 词频打分按字面匹配——术语、编号、报错原文的主力。</li>
      <li><strong>混合检索 + RRF 融合</strong>：两路各自召回后，用 <strong>Reciprocal Rank Fusion</strong> 按名次计分——每篇文档的得分是 <code>1/(k + 排名)</code> 的两路之和。两路都靠前的块排最前；只有一路命中的也不至于被埋没。<strong>分数不需要校准</strong>，是它比「加权求和」更常用的原因。</li>
    </ol>
    <p>
      三路都包装成工具交给 Agent 之后，还有一个策略层次的问题：把「选哪路」交给模型按问题类型决定，还是固定用混合？实践上<strong>混合检索几乎无损</strong>，通常固定使用；只有「纯术语精确查询」这类场景才值得让 Agent 直连关键词工具。
    </p>
    <div class="lesson-box hint">
      <strong>检索之上还有一层上下文工程：</strong>召回只是原料，回答质量还取决于「检索什么」（多轮对话里先用历史改写问题，化解代词）、「召回多少」（K 值与去重）以及「怎么放进提示词」（编号 + 要求引用）。这一课把检索做对，下一课解决时效。
    </div>

    <h2>三路检索同题对比演示</h2>
    <figure class="lesson-figure">
      <figcaption>先跑「语义型提问」：向量一行行给出命中文档，关键词一路直接「未命中」，混合检索靠向量补位仍然作答；再切到「术语型提问」跑一次，看关键词如何与向量互证。</figcaption>
      <LG10Rag />
    </figure>

    <h2>多路召回弥补单路盲区</h2>
    <p>
      检索策略解决的是「找全找对」：向量管语义、关键词管字面、混合用 RRF 融合两路名次。单路总有盲区，多路互相补位；融合排序不需要分数校准，落地成本低、收益稳定。
    </p>
    <div class="lesson-term">
      <span class="term-name">「混合检索（Hybrid Search）与 RRF」</span>指同时运行向量检索（语义）与关键词检索（字面），再用 Reciprocal Rank Fusion 按名次融合：每篇文档按 <code>1/(k+rank)</code> 累加两路得分，k 通常取 60。要记住的边界：两路必须用同一份切分后的块（同一块的 id 才能对齐名次）；融合只看名次不看分数，因此无需校准两路分数量纲；召回多了要重排（rerank）和去重压成本；换嵌入模型必须重建向量索引。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
