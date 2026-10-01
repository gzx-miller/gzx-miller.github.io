<script setup lang="ts">
import K14AsyncState from './K14AsyncState.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>接口还没回来，页面到底该显示什么？为什么我加了个 <code>loading</code>，断网时用户看到的还是一片空白？
    </div>

    <h2>异步请求结果分支</h2>
    <p>
      你做一个课程列表页。用户一进来，组件挂载就去请求接口，拿回一串课程渲染成卡片。这件事听起来只有两种结局：拿到了，或者没拿到。于是你很自然地想：<strong>用一个 <code>loading</code> 布尔值就够了吧？</strong>请求期间显示「加载中」，请求结束就显示数据。
    </p>
    <p>
      但真实的页面比这复杂。网络会慢、会断，接口会返回 500；有时候请求成功了，返回的却是一个空数组；用户手快连点两下「重新加载」，两个请求同时在飞，慢的那个后回来，把快的那个刚写进去的新数据又覆盖成旧的。这些都不是「有没有数据」能表达的分支，它们是<strong>加载中、失败、空数据、成功</strong>四种截然不同的状态，每一种都该有独立的界面反馈。
    </p>

    <h2>布尔标记驱动分支</h2>
    <p>
      最省事的做法：一个 <code>loading</code> 布尔加一个 <code>error</code> 字符串，模板里用 <code>v-if</code> / <code>v-else-if</code> / <code>v-else</code> 分三支——加载中显示提示，出错显示错误，否则显示列表。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它承认了请求存在「等待期」</strong>。页面不再一上来就空着，用户能看到系统正在忙。当只有一支成功的路径、网络又很稳时，这套写法确实够用，也是绝大多数演示代码的样子。
    </p>

    <h2>错误态与空态遗漏</h2>
    <ul>
      <li>它只覆盖了「加载中」和「成功」，<strong>失败分支很容易被漏写</strong>，一断网用户就面对空白页，不知道是没数据还是出错了。</li>
      <li>请求成功但结果为空时，列表区域同样是空的，<strong>空态和错误态长得一模一样</strong>，用户无法区分。</li>
      <li>错误只写进 <code>console.error</code>，控制台里再详细，用户一个像素也看不到。</li>
      <li>失败之后没有恢复路径——没有重试按钮，用户只能刷新页面。</li>
      <li>用多个布尔描述状态时，它们可能<strong>同时为真</strong>：<code>loading</code> 还没关、<code>error</code> 又被写上，界面出现自相矛盾的提示。</li>
      <li>连点两次加载，先发的慢响应后到，会<strong>覆盖掉新请求刚写入的数据</strong>，页面显示的是过期的旧结果。</li>
    </ul>

    <h2>互斥枚举状态建模</h2>
    <p>
      不推翻「显式表达状态」，而是把状态从「一堆布尔」改成<strong>一个互斥的枚举</strong>：<code>idle</code>（未开始）、<code>loading</code>（加载中）、<code>success</code>（成功）、<code>error</code>（失败）。同一时刻只可能是其中一个，界面分支天然不会打架。空数据不是第五种状态，它属于 <code>success</code> 的一个子判断——列表长度为 0 时渲染空态提示，而不是静默留白。
    </p>
    <p>
      接着把请求流程固定成一套节奏，用 <code>try</code> / <code>catch</code> / <code>finally</code> 收口：
    </p>
    <ol class="lesson-steps">
      <li>触发加载时，立刻把状态置为 <code>loading</code>，同时<strong>清空上一次的错误和旧数据</strong>，避免新旧混在一起。</li>
      <li><code>try</code> 里 <code>await</code> 请求，成功后写入课程列表，状态转为 <code>success</code>。</li>
      <li><code>catch</code> 里捕获异常，写入<strong>面向用户、可读</strong>的错误文案，状态转为 <code>error</code>。</li>
      <li><code>finally</code> 里关闭加载——无论成功还是失败都会执行，保证加载态一定能结束，不会永远转圈。</li>
    </ol>
    <p>
      把错误写进 <code>catch</code> 而不是散落在各处之后，错误态的界面也就有了落脚点：一段文案加一个「重试」按钮，重试就是再调一次加载函数，把状态重新推回 <code>loading</code>。空态同理，用 <code>success</code> 加长度为 0 联合判断，给一句「暂无课程，去逛逛吧」，而不是留下一片白。
    </p>
    <div class="lesson-box warn">
      <strong>真实接口还要多防三件事：</strong>一是<strong>重复请求</strong>，用状态或标志位拦住连点；二是<strong>取消请求</strong>，组件卸载或发起新请求时把上一个 <code>AbortController</code> 中断掉，避免无谓等待；三是<strong>过期响应</strong>，记录请求序号，回来时若已被更新的请求取代就直接丢弃，防止旧数据覆盖新数据。
    </div>
    <p>
      回过头看：加载态、空态、错误态在视觉上必须有明确区别——转圈的骨架屏、一句友善的空提示、一段醒目的错误文案加恢复入口，三者对应的用户动作完全不同。把这些状态当成一等公民建模，页面才不会在意外时「失语」。
    </p>

    <h2>重新加载状态流转</h2>
    <figure class="lesson-figure">
      <figcaption>点「重新加载」，看 <code>loading</code> → <code>success</code> 的状态切换与 <code>finally</code> 的收尾。</figcaption>
      <K14AsyncState />
    </figure>

    <h2>状态建模与收尾处理</h2>
    <p>
      异步请求的核心不是「发出去、拿回来」，而是「等待期和失败期该给用户看什么」。把状态建模成互斥的枚举，用 <code>finally</code> 保证加载态一定收尾，让错误和空数据都有独立的界面，再补上重复请求、取消与过期响应的防线——页面才会在任何分支下都稳定可信，而不是白屏、闪烁或静默吞掉错误。
    </p>
    <div class="lesson-term">
      <span class="term-name">「异步状态」</span>指请求过程中页面所处的互斥阶段，通常建模为 <code>idle</code> / <code>loading</code> / <code>success</code> / <code>error</code> 单一枚举，<strong>避免多个布尔同时为真</strong>；空数据是 <code>success</code> 的子判断。加载态、空态、错误态要在 UI 上明确区分，错误文案面向用户，并用 <code>finally</code> 确保加载总能结束。
    </div>
  </LessonArticle>
</template>
