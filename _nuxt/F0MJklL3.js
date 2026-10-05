const n=`<script setup lang="ts">
import TW04DarkMode from './TW04DarkMode.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我给深色模式写了「反色」，可进度卡的橙色进度条一反就成了青绿；用户点开页面时还会先白闪一下——暗色模式真的只是把颜色反过来吗？
    </div>

    <h2>明暗双套配色</h2>
    <p>
      你的学习站点上有一张「今日进度」卡：浅色背景配深色文字，进度条是品牌橙。现在要做深色模式——同一张卡，在暗色环境下要换成深色底、浅色字，而且两套配色都要看得清。
    </p>
    <p>
      需求里还藏着第二层：用户可能系统整体就是暗色的，也可能手动点了页面上的切换按钮，<strong>两种来源都要照顾到</strong>，并且手动选择过的偏好要记住、下次打开还生效。这几件事不解决，暗色模式就只是个半成品。
    </p>

    <h2>整体反色方案</h2>
    <p>
      最省事的想法：既然只是喜欢深色，那把所有颜色整体反过来不就好了？给根元素加一句 <code>filter: invert(1)</code>，或者简单地把背景和文字两个值对调。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认了暗色是另一套环境、需要另一套颜色</strong>。作为一次性的临时验证，它甚至能立刻看到「变暗」的效果，方向不算错。
    </p>

    <h2>反色破坏品牌色</h2>
    <ul>
      <li>整体反色会把品牌色也一起翻掉：进度条的橙变成青绿，与品牌识别完全对不上。</li>
      <li>图片、图标、插画被一起反色后观感变得诡异，而它们本来不该受影响。</li>
      <li>两套主题的对比度不是「一对一翻」的：浅色下够用的灰，在深色底上可能糊成一片。</li>
      <li>只做了切换、没处理首屏：脚本还没来得及打上主题标记，页面先按浅色渲染了一帧，于是「闪白」。</li>
    </ul>

    <h2>同语义另配颜色</h2>
    <p>
      换一个思路：<strong>暗色不是把颜色反过来，而是为同一套语义另设计一组值</strong>。背景、文字、边框各自有一套「明暗成对」的颜色，主题切换只是换用哪一组，而不是去动组件结构。
    </p>
    <p>
      Tailwind 用 <code>dark:</code> 变体表达这件事：<code>bg-amber-50 dark:bg-stone-900</code>、<code>text-stone-900 dark:text-amber-50</code>。每个颜色类后面跟一个暗色版本，两套值并列写在一起，一眼就能看出对应关系。
    </p>
    <p>
      关键约定在 v4 里变了：<strong><code>dark:</code> 默认绑定系统的 <code>prefers-color-scheme</code></strong>，也就是说「跟随系统」是开箱默认的。如果你想按祖先类或 <code>data-theme</code> 属性来手动切换，需要用 <code>@custom-variant</code> 把 <code>dark</code> 重新绑定到那个标记上。理解了这一条，「跟随系统 + 手动切换」才能同时成立。
    </p>
    <div class="lesson-box warn">
      <strong>两个必须单独检查的地方：</strong>不要给两套主题做简单的数值反转，<strong>文本、焦点环、禁用态都要在两套主题里分别验证对比度</strong>；另外系统偏好可以在用户不改页面的情况下变化，跟随模式下要监听 <code>matchMedia</code>，及时把主题同步过来。
    </div>
    <p>
      至于闪白，处理方式很直接：把「读取偏好、决定主题」的逻辑放进一段<strong>首屏渲染前就执行的内联脚本</strong>，在页面画出第一帧之前就把主题标记打到 <code>&lt;html&gt;</code> 上。主题状态存在 <code>localStorage</code> 里，真正参与样式的只是这个标记——<strong>CSS 只需要切换选择器，组件一个都不用重建</strong>。
    </p>
    <p>
      这里藏着一个值得体会的设计：主题状态与组件结构是<strong>解耦</strong>的。页面不需要根据「当前算深色还是浅色」去渲染两套不同的组件，只要在标记上写一个状态，剩下交给 CSS 选择器去配对。切换主题因此不会触发组件重建，也就不会有状态丢失或重新请求这类副作用。
    </p>
    <p>
      还有一点容易含糊的是优先级：手动偏好与系统偏好谁说了算。常见约定是「用户手动选过就以手动为准，没选过就跟随系统」，并且系统偏好变化时只在跟随模式下同步。把这条规则明确下来，才不会有「我明明设了浅色，系统切到暗色后页面也跟着黑了」这种困惑。
    </p>
    <ol class="lesson-steps">
      <li>为背景、文字、边框按语义成对设计明暗两套颜色。</li>
      <li>决定是跟随系统还是记住用户偏好，并用类或 data 属性标记当前主题。</li>
      <li>在首屏渲染前用内联脚本应用主题标记，避免闪白。</li>
      <li>在元素面板确认 <code>&lt;html&gt;</code> 上的主题标记与样式选择器一致。</li>
    </ol>

    <h2>主题切换配对替换</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮在明暗之间切换，看进度卡的两套配色如何成对替换。</figcaption>
      <TW04DarkMode />
    </figure>

    <h2>成对设计与首帧</h2>
    <p>
      暗色模式的两条主线是「成对设计」和「提前决定」。颜色不是反过来的，而是为同一套语义重新配的一组；主题不是在渲染之后再补的，而是在第一帧之前就写进标记。把这两件事分清，跟随系统与手动切换就能共存而不打架。
    </p>
    <div class="lesson-term">
      <span class="term-name">「暗色变体」</span>是 <code>dark:</code> 前缀，为暗色环境生成一套覆盖规则。v4 默认跟随系统 <code>prefers-color-scheme</code>；要按祖先类或 <code>data-theme</code> 手动切换，需用 <code>@custom-variant</code> 重新绑定 <code>dark</code>。两套主题都要独立验证对比度，并在首屏前打好主题标记以避免闪白。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
