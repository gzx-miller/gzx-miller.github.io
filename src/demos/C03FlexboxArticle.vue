<script setup lang="ts">
import C03Flexbox from './C03Flexbox.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我想让卡片里的文字垂直居中，写了 <code>vertical-align: middle</code>，浏览器一点反应都没有——为什么这个「居中」不管用？
    </div>

    <h2>提出问题</h2>
    <p>
      你在排一份课程卡片列表：左边一张封面图、右边标题与简介，需要图撑满卡片高度、标题贴顶、底部一行「查看详情」贴右，卡片之间还要均匀留缝、放不下时自动换行。用传统写法拼了半天，卡片之间总有几像素对不齐的空白缝，怎么都消不干净。
    </p>
    <p>
      代价是<strong>布局全靠 hack 维持</strong>：每个间距都要手算百分比，一改文案长度整个排列就乱；想调整卡片顺序，只能去动 HTML。这类「一行或一列里的排列问题」几乎每个页面都会遇到，值得有一套专门的模型。
    </p>
    <p>
      更本质地说，这类需求都属于「一维排列」：元素沿着一根线依次摆开，只是在线上的对齐方式、间距、伸缩比例不同。传统方案没有为这根线提供统一的抽象，于是每种对齐都要各找各的办法，才有了拼凑感。
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：让子元素 <code>display: inline-block</code>，父级用 <code>text-align: center</code> 控制水平位置，间距靠 <code>margin</code> 一个个加。
    </p>
    <p>
      它做对了<strong>「把元素当成排列单位」这件事</strong>：子项并排了，水平对齐也有了。当只有两三个元素、位置也简单时，这套写法完全能跑。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>inline-block 之间会多出空隙：HTML 里换行产生的空白字符被当成了内容，卡片之间凭空多几像素缝。</li>
      <li>垂直居中做不到：<code>text-align</code> 只管水平方向，<code>vertical-align</code> 是给行内元素对齐基线的，管不了盒子在容器里的上下位置。</li>
      <li>剩余空间要手算：想让三个卡片均分宽度，得自己算 <code>calc</code> 百分比，内容一变又要重算。</li>
      <li>顺序调整只能挪 DOM，视觉顺序和结构顺序被绑死。</li>
      <li>换行、间距、对齐各管各的，稍微复杂一点就开始互相打架。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「并排排列」，而是换一套有明确轴向的模型：给容器写 <code>display: flex</code>，它的直接子元素立刻变成「flex 项目」。关键在于它引入了<strong>两条轴</strong>——主轴由 <code>flex-direction</code> 决定，默认 <code>row</code> 是横向排列，改成 <code>column</code> 就变纵向。
    </p>
    <p>
      有了两条轴，对齐就分成了各司其职的两件事：<strong><code>justify-content</code> 管主轴</strong>，取值 <code>flex-start</code>、<code>center</code>、<code>space-between</code>、<code>space-around</code>、<code>space-evenly</code>；<strong><code>align-items</code> 管交叉轴</strong>，取值 <code>flex-start</code>、<code>center</code>、<code>stretch</code>（默认，撑满）、<code>baseline</code>。开场那个垂直居中，在默认 row 下用的正是 <code>align-items: center</code>——它是交叉轴的事，不该指望 justify-content。
    </p>
    <div class="lesson-box warn">
      <strong>最容易踩的一坑：</strong>两轴不可混用。主轴对齐没反应时，先回头检查 <code>flex-direction</code>——方向一旦从 row 改成 column，主轴的语义和 justify-content 的作用方向就互换了，原来「水平居中」的写法会变成「垂直居中」。
    </div>
    <p>
      接着补齐换行与间距：空间不够想换行就加 <code>flex-wrap: wrap</code>；项目间距用 <code>gap</code>，一行就够，而且不会像 margin 那样在首尾留出多余的空隙。
    </p>
    <p>
      换行之后还会多出一个对齐维度。项目一旦折成多行，<code>align-content</code> 决定的是「这些行整体」在交叉轴上的分布，而 <code>align-items</code> 管的是「每一行内部」的项目对齐——不换行时前者的作用看不出来，一换行就容易把两者搞混。
    </p>
    <p>
      再往下是剩余空间的分配。<code>flex: 1</code> 是 <code>flex-grow: 1; flex-shrink: 1; flex-basis: 0%</code> 的简写，给多个子项都写上，它们就会<strong>均分剩余空间</strong>；反过来 <code>flex: 0 0 auto</code> 表示不伸也不缩，尺寸由内容决定。最后是顺序：<code>order</code> 数值越小越靠前，<strong>它只改视觉顺序，不动 DOM</strong>，这也是它相对挪 HTML 的优势。
    </p>
    <p>
      分配空间时还有个细节值得先记住：<code>flex-basis</code> 是项目在分配之前的「基准尺寸」，写成 <code>0%</code> 表示不按内容宽、一切从零开始再均分；这正是 <code>flex: 1</code> 能把宽度分得那么整齐的原因。如果写成 <code>flex: 1 1 auto</code>，基准变成了内容宽度，分出来的结果就会因文字长短而参差不齐。
    </p>
    <div class="lesson-box hint">
      <strong>一句话分工：</strong>主轴方向的事（靠哪边、怎么分）交给 <code>justify-content</code> 与 <code>flex</code>，交叉轴方向的事（多高、怎么对）交给 <code>align-items</code> 与 <code>align-content</code>，间距统一交给 <code>gap</code>。
    </div>
    <p>
      还要把分工说清楚：<strong>Flexbox 是一维布局</strong>，处理一行或一列内部的排列与分配；页面级的二维骨架（同时要管行和管列）应该交给 Grid。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换主轴方向与两轴对齐，观察 justify-content 与 align-items 各自影响哪根轴。</figcaption>
      <C03Flexbox />
    </figure>

    <h2>总结</h2>
    <p>
      Flexbox 用「一根主轴、一根交叉轴」把排列讲清楚了：主轴对齐交给 justify-content，交叉轴对齐交给 align-items，空间不足用 flex-wrap 换行、gap 留缝，剩余空间用 <code>flex: 1</code> 分配。垂直居中、等分宽度、均匀间距这些曾经要靠 hack 的事，现在各归各位。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Flexbox」</span>是一维布局模型：主轴由 <code>flex-direction</code> 决定（row/column），交叉轴垂直于主轴；<code>justify-content</code> 负责主轴对齐，<code>align-items</code> 负责交叉轴对齐，二者不可混用；<code>flex-wrap</code> 决定超宽是否换行，<code>gap</code> 设项目间距，<code>order</code> 调整显示顺序。<code>flex: 1</code> 即 <code>flex-grow:1; flex-shrink:1; flex-basis:0%</code>，用于均分剩余空间。
    </div>
  </LessonArticle>
</template>
