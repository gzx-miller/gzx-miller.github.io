<script setup lang="ts">
import TW22SVGIcons from './TW22SVGIcons.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>按钮里放了个图标，代码写死成橙色，可文字一改成灰色，图标还是橙的；等到要做暗色主题，难道要一个个把图标颜色再改一遍？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个课程报名按钮，需要「图标 + 文字」的组合。你把设计师给的 SVG 直接内联进模板，颜色照着设计稿写死在 <code>fill</code> 上。单看这个按钮没问题，可接下来事情开始变多：收藏按钮要在「已收藏 / 未收藏」两种状态间变色，暗色主题上线后图标要跟着文字一起变，同一套图标在导航、卡片、按钮里还要用不同尺寸。
    </p>
    <p>
      问题在于你没把图标当成「会随上下文变化的图形」，而是当成了「一张固定颜色的小图片」。图标真正的身份是<strong>矢量图形</strong>，它应该像文字一样，能继承颜色、能随字号缩放、能被状态变体统一驱动。
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的做法，是每个图标写死自己的颜色：<code>fill="#ea580c"</code>，需要什么色就填什么色。这样做在只有一两个图标、只有一种状态的场景里，直观且不用思考。
    </p>
    <p>
      它做对的是<strong>把颜色确定下来</strong>——设计师给的色值直接落地，不会跑偏。可一旦颜色需要随上下文改变，「写死」就变成了负担：同一个图形在两处要用两种颜色，就得维护两份 SVG；主题一换，改色点成倍增加。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>颜色写死后，状态切换（悬停、选中）与主题切换都得逐个改，改漏一处就不一致。</li>
      <li>图标尺寸靠固定像素写死，和相邻文字的字号对不齐，视觉基线总是偏一点。</li>
      <li>为了要几个图标而整包引入一个图标库，产物体积被没用到的那几百个图标拖大。</li>
      <li>把 <code>fill</code> 型与 <code>stroke</code> 型图标混着用，线宽粗细不一，放在一起观感很乱。</li>
      <li>图标与文字的间距、垂直对齐没有统一约定，每个按钮各写一套，按钮之间高矮不齐。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      关键在于换掉颜色来源：把 SVG 内部的 <code>fill</code> 或 <code>stroke</code> 设成 <code>currentColor</code>。<code>currentColor</code> 是 CSS 里的关键字，含义是「取当前元素的文字颜色」，于是图标不再是固定色块的图片，而是<strong>一块会跟随上下文变色的图形</strong>。此时用 <code>text-*</code> 工具类控制颜色，文字和图标会一起变——主题切换、状态变色全部零成本。
    </p>
    <p>
      颜色解决后，尺寸也跟着用同一套思路：因为矢量图形会随字号缩放，用 <code>w-*</code> / <code>h-*</code> 指定大小，或者干脆让父级用 <code>text-*</code> 控制字号，图标就会和周围文字比例协调。再配上 <code>flex items-center gap-2</code> 让图标与文字居中对齐、间距统一，按钮之间自然就齐了。
    </p>
    <div class="lesson-box hint">
      <strong>推荐用线性图标：</strong>以 <code>stroke</code> 描边绘制的线性图标比填充式更容易借助 <code>currentColor</code> 变色，文件通常也更小，风格更统一。Heroicons、Lucide 等库都提供了现成的 <code>currentColor</code> 变体，直接可用，不必自己把每个图形的颜色都改成 <code>currentColor</code>。
    </div>
    <p>
      图标数量多起来之后，把「路径 + 默认尺寸」封装成一个小图标组件是值得的：组件内部仍是 <code>currentColor</code>，对外只透传 <code>class</code>，颜色与大小依旧由使用处的 <code>text-*</code> 与 <code>w-*</code> 决定。这样既复用了图形结构，又保留了「跟随上下文变色」的能力——如果反过来把颜色和尺寸也写进组件的默认值里，就等于把写死的老问题搬进了组件内部。
    </p>
    <p>
      还有两个细节值得固定成规矩。其一，<strong>同一套图标要保持一致的 <code>stroke-width</code></strong>，混用不同线宽（有的 1.5、有的 2）放在一排里会明显不齐，观感变脏。其二，内联 SVG 时尽量只引入用到的那几个图形，而不是把整个图标库打进来，避免产物体积无谓膨胀。
    </p>
    <ol class="lesson-steps">
      <li>在 SVG 内部把 <code>fill</code> / <code>stroke</code> 改为 <code>currentColor</code>。</li>
      <li>用 <code>text-*</code> 工具类同时控制文字与图标颜色。</li>
      <li>用 <code>w-*</code> / <code>h-*</code> 或父级 <code>text-*</code> 大小控制图标尺寸。</li>
      <li>切换主题色后确认图标与文字颜色同步变化。</li>
    </ol>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换颜色与尺寸滑块，再点开「stroke 线性图标」页签，看图标如何跟着文字一起变。</figcaption>
      <TW22SVGIcons />
    </figure>

    <h2>总结</h2>
    <p>
      图标的颜色不该写死在图形里，而应继承上下文。把 <code>fill</code> / <code>stroke</code> 换成 <code>currentColor</code>，颜色交给 <code>text-*</code>，尺寸交给 <code>w-*</code> / <code>h-*</code>，图标就能和文字同步变色、同步缩放，主题切换与状态联动都不用额外写一遍。再养成用线性图标、统一线宽、按需引入的习惯，观感和体积都可控。
    </p>
    <div class="lesson-term">
      <span class="term-name">「currentColor」</span>是 CSS 关键字，取值为当前元素的文字颜色（<code>color</code>）。把 SVG 的 <code>fill</code> 或 <code>stroke</code> 设为 <code>currentColor</code> 后，图标便会继承父元素的文字色，于是用 <code>text-*</code> 工具类即可同时控制文字与图标颜色，主题切换和状态变体都能零成本跟随。
    </div>
  </LessonArticle>
</template>
