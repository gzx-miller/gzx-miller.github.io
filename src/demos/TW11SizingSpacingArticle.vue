<script setup lang="ts">
import TW11SizingSpacing from './TW11SizingSpacing.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程卡片之间的间距，我一会儿写 <code>mt-3</code>、一会儿写 <code>mb-4</code>，页面上下翻一遍，总觉得哪一处比别处「紧一点」——这些数字到底该怎么统一？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个后台的课程列表页。每行一张课程卡片，里面要放下封面图、标题、标签和价格。你打开设计稿一看，标注密密麻麻：图片宽度 320、上下留白 18px、标题和标签之间 10px、卡片之间 24px。于是你一边写一边猜，<code>p-4</code>、<code>mt-3</code>、<code>gap-2</code> 混着用，凭手感补齐。
    </p>
    <p>
      单看某张卡片都没问题，可把十几张放在一起对比时，问题就暴露了：有的内部很松、有的很挤，卡片间距也忽大忽小。<strong>它们不是「不好看」，而是没有节奏。</strong>要理解这件事，得先分清两类工具：<strong>尺寸</strong>回答「盒子多大」，<strong>间距</strong>回答「留多少空」；而间距又分盒模型层面（内外边距）与布局层面（Flex/Grid 轨道间隙）。把两者混为一谈，就是间距失控的根源。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法，是看着设计稿逐个「翻译」成类名：留白 18px 就写 <code>p-[18px]</code>，间距 10px 就写 <code>mt-[10px]</code>。这样确实能<strong>像素级还原设计稿</strong>，单页面下甚至非常精准。
    </p>
    <p>
      问题是它把每个数值当成孤立特例。当设计稿微调、或另一个页面也要用同一套卡片时，你无法回答「到底哪个才是标准」——因为压根没有标准，只有一堆从稿子上抄来的数字。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>视觉上「一模一样」的间距，在不同卡片里被写成不同的魔法数字，缺少统一节奏。</li>
      <li>用相邻元素的 <code>margin</code> 堆间距，容易出现边距叠加，实际间距比预想的大。</li>
      <li>只关心宽高、忽略边界约束，长内容一来就把布局撑破（尤其忘记 <code>min-w-0</code>）。</li>
      <li>固定宽度到处写死，屏幕一变窄就溢出或留一大片空白。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「按设计稿还原」，而是把所有数值<strong>收敛到一套设计尺度上</strong>。默认刻度以 4 为基数：<code>1</code> 是 4px、<code>2</code> 是 8px、<code>3</code> 是 12px、<code>4</code> 是 16px、<code>6</code> 是 24px。不必记住每个值，只需一个习惯：<strong>先想「这该是几个档位」，再从刻度里取值，而不是直接抄像素。</strong>18px 在刻度上最接近 <code>4</code> 或 <code>5</code>，选哪个取决于整体节奏。
    </p>
    <p>
      尺寸工具按语义分三类：
    </p>
    <table>
      <thead>
        <tr><th>语义</th><th>典型类名</th><th>适用场景</th></tr>
      </thead>
      <tbody>
        <tr><td>固定尺寸</td><td><code>w-32</code>、<code>size-10</code></td><td>头像、图标等恒定尺寸</td></tr>
        <tr><td>流体尺寸</td><td><code>w-full</code>、<code>w-1/2</code></td><td>随容器伸缩的布局块</td></tr>
        <tr><td>边界约束</td><td><code>max-w-screen-md</code>、<code>min-h-10</code></td><td>限制最大宽度、保证最小高度</td></tr>
      </tbody>
    </table>
    <p>
      先问一句：这个容器是<strong>固定、流体，还是受最大宽度约束</strong>？答案决定用 <code>w-*</code> 还是 <code>max-w-*</code>。<code>size-*</code> 是 <code>w-*</code> 与 <code>h-*</code> 的合体，方形元素用它最简洁；<code>max-w-screen-md</code> 这类约束让内容在宽屏上不会无限拉伸。
    </p>
    <p>
      然后是间距的两个层面。盒子<strong>内部</strong>的留白用 <code>p-*</code>、盒子<strong>对外</strong>的留白用 <code>m-*</code>，两者都作用于盒模型。而<strong>同级元素之间</strong>的间距优先用布局层面的间隙 <code>gap-*</code>——它在轨道之间一次性插入等距间隔，不会像相邻 <code>margin</code> 那样叠加，也不会给首尾元素多出边距。<code>space-x-*</code> / <code>space-y-*</code> 则是在相邻子元素之间用选择器插边距，遇到换行或反序会露出破绽，只适合已知顺序的单行排列。
    </p>
    <div class="lesson-box warn">
      <strong>最容易忽略的坑：<code>min-w-0</code>。</strong>Flex 和 Grid 子项默认 <code>min-width: auto</code>，会按内容宽度撑开——子项里塞进一长串不换行文本时，它拒绝收缩，最终把布局顶破、产生横向溢出。给需要收缩的子项加上 <code>min-w-0</code>，允许它缩到比内容更窄即可。超过一半的「Flex 布局莫名溢出」，答案都在这里。
    </div>
    <p>
      最后补两条：一是主动用好边界约束，<code>max-w-*</code> 限制整体最大宽度、<code>min-h-*</code> 保证最小可点击高度；二是负数与范围类也别乱写，像 <code>inset-x-0</code>、<code>-mt-2</code>、<code>top-1/2</code>，同样应从内置尺度取值，而不是随手拼 <code>top-[47px]</code>。
    </p>
    <p>
      串成一条顺序：<strong>先决定容器的尺寸语义（固定 / 流体 / 受约束）→ 用统一尺度建立间距节奏 → 在长内容与窄屏下验证 <code>min-w-0</code> 与溢出 → 用标尺核对两处间距是否来自同一尺度。</strong>「用标尺核对」这个动作很关键：它逼你真正量一量，而不是凭感觉认为「差不多」。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑块切换间距等级，观察同一组内容块如何在固定刻度上产生一致的视觉节奏。</figcaption>
      <TW11SizingSpacing />
    </figure>

    <h2>总结</h2>
    <p>
      尺寸与间距的本质，是把页面里所有「多大、留多少空」的决策，从随手填的像素，收敛到一套有语义、有刻度的系统上。容器先分清固定、流体与边界约束，同级间距优先交给 <code>gap</code>，并且永远别忘记 <code>min-w-0</code>——节奏统一了，页面自然就稳了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「设计尺度」</span>指一套有限、成倍数的数值刻度（默认以 4 为基数）。尺寸工具区分固定（<code>w-32</code>、<code>size-10</code>）、流体（<code>w-full</code>）与边界约束（<code>max-w-screen-md</code>、<code>min-h-10</code>）；间距工具区分盒模型内外的 <code>p-*</code>/<code>m-*</code>、Flex/Grid 轨道的 <code>gap-*</code> 与相邻子元素的 <code>space-*</code>。同级间距优先用 <code>gap</code>，并为可能溢出的子项补上 <code>min-w-0</code>。
    </div>
  </LessonArticle>
</template>
