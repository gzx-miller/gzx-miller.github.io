const n=`<script setup lang="ts">
import C16ContainerQuery from './C16ContainerQuery.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个卡片组件，放进侧边栏被压得挤成一团，放进主内容区却依然很窄——媒体查询明明写了 <code>@media (min-width: 900px)</code>，组件为什么一点都不肯应变？
    </div>

    <h2>组件自身自适应</h2>
    <p>
      你在维护一个组件库，卡片会根据自身宽度决定「竖排」还是「图文左右分栏」。你用媒体查询按视口宽度写了断点：屏幕够宽就分栏。可当这个卡片被放进一个只有 300px 宽的侧边栏时，视口依旧是 1200px、断点照样命中，卡片就硬生生展开成了双栏——内容被挤成一道缝。
    </p>
    <p>
      问题的本质是：<strong>组件该关心的是「我有多宽」，而不是「屏幕有多宽」</strong>。基于视口的断点，把组件的命运绑在了窗口大小上，可组件并不知道自己会被塞进多宽的宿主。不解决这一点，组件就永远无法真正复用——每换一个摆放位置，就得回头改一次断点。
    </p>

    <h2>视口分档写法</h2>
    <p>
      最省事的做法：继续用媒体查询，按视口宽度分档。<code>@media (min-width: 900px)</code> 时卡片分栏，否则竖排。这个方案做对了一件事：<strong>它确实实现了响应式，页面整体布局随窗口变化而调整</strong>，而且写法成熟、兼容性广。
    </p>
    <p>
      当组件的宽度恰好跟视口成正比时，这套写法看不出毛病——比如整页就一个通栏卡片。问题出在「组件的宽度由谁决定」上。
    </p>

    <h2>窄容器断点误判</h2>
    <ul>
      <li>断点基于视口，与组件实际可用的宽度毫无关系，窄容器里照样触发「宽屏」样式。</li>
      <li>同一个组件放在不同宽度的容器中时，样式完全相同，无法做真正的组件级自适应。</li>
      <li>组件库对外发布时，宿主的布局未知，断点该取多少完全无从下手。</li>
      <li>「卡片里再嵌一张卡片」这种嵌套场景，媒体查询更是彻底失效。</li>
    </ul>

    <h2>查询基准换容器</h2>
    <p>
      不推翻「按宽度分档」，而是把基准从<strong>视口</strong>换成<strong>祖先容器</strong>。做法分两步：先在「生产者」上声明自己可以被查询——<code>container-type: inline-size</code>，意思是按<strong>行内尺寸</strong>（也就是宽度）追踪；再用 <code>@container (min-width: 400px)</code> 让「消费者」依据最近那个容器的尺寸应用样式。此时那 400px 量的是<strong>容器的宽度</strong>，视口再宽也不影响它。
    </p>
    <p>
      如果页面上有多个容器、需要精确指向某一个，可以给它命名：生产者写 <code>container-name: card</code>，消费者写 <code>@container card (min-width: 400px)</code>。有了命名，嵌套容器也不会互相干扰。于是同一张卡片，放进 300px 的侧栏就自动切回竖排，放进 600px 的主区就自动分栏——<strong>样式跟着容器走，而不是跟着屏幕走</strong>。
    </p>
    <p>
      还有一个顺手的好处：容器查询单位。<code>cqw</code> / <code>cqh</code> 分别以最近容器的宽 / 高为基准（各占 1%），不随视口变化。把标题写成 <code>font-size: 4cqw</code>，字号就会随卡片自身宽度平滑缩放；此外还有 <code>cqi</code> / <code>cqb</code> 对应容器的行内 / 块向尺寸，<code>cqmin</code> / <code>cqmax</code> 取较小 / 较大边。
    </p>
    <div class="lesson-box warn">
      <strong>一个容易踩的坑：</strong><code>container-type: inline-size</code> 只追踪宽度，容器高度是由内容撑开的、不可用作查询基准。若确实要查询高度，得改用 <code>container-type: size</code>，并<strong>给容器一个确定的高度</strong>，否则查询不会按预期生效。
    </div>
    <p>
      别再把这当成「媒体查询的替代品」——它们是互补的：<code>@media</code> 负责<strong>页面级</strong>的整体断点，<code>@container</code> 负责<strong>组件级</strong>的自适应。把常被混用的几个概念并排记一遍：
    </p>
    <table>
      <thead>
        <tr><th>概念</th><th>作用</th></tr>
      </thead>
      <tbody>
        <tr><td><code>container-type: inline-size</code></td><td>在容器上声明「按宽度可被查询」</td></tr>
        <tr><td><code>container-name</code></td><td>给容器命名，供 <code>@container</code> 精确匹配</td></tr>
        <tr><td><code>@container (min-width: …)</code></td><td>依据祖先容器尺寸应用样式</td></tr>
        <tr><td><code>cqw</code> / <code>cqh</code></td><td>以容器宽 / 高为基准的百分比长度</td></tr>
      </tbody>
    </table>
    <p>
      落到工程上，一条值得写进组件规范的原则是：<strong>组件库应默认自带容器查询适配</strong>。这样宿主侧无论把它放进多宽的坑位，组件都能自己调整，无需外部额外干预。
    </p>

    <h2>断点随容器宽度</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑块改变容器宽度，注意断点发生在容器宽度 400px，而不是视口宽度。</figcaption>
      <C16ContainerQuery />
    </figure>

    <h2>页面与组件分工</h2>
    <p>
      容器查询把「响应式」的判断基准从视口搬到了容器。先用 <code>container-type: inline-size</code>（必要时配 <code>container-name</code>）声明容器，再用 <code>@container (min-width: …)</code> 依据祖先容器尺寸应用样式，配合 <code>cqw</code> / <code>cqh</code> 让尺寸随容器缩放。它与以视口为基准的 <code>@media</code> 互补，让同一组件在任意宽度的宿主里都能自适应。
    </p>
    <div class="lesson-term">
      <span class="term-name">「容器查询」</span>先在生产容器上用 <code>container-type: inline-size</code> 声明可查询（必要时用 <code>container-name</code> 命名），再用 <code>@container (min-width: …)</code> 依据<strong>最近的祖先容器</strong>尺寸应用样式；它与以视口为基准的 <code>@media</code> 互补——<code>@media</code> 负责页面级布局，<code>@container</code> 负责组件级响应式。<code>cqw</code> / <code>cqh</code> 是以命名容器宽 / 高为基准的容器查询单位。注意 <code>inline-size</code> 只追踪宽度，查询高度需改用 <code>size</code> 并为容器定高。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
