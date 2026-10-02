const e=`<script setup lang="ts">
import VF12ReadonlyTheme from './VF12ReadonlyTheme.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把组织架构图放进深色主题的介绍页，浅色的节点卡片白得刺眼；更糟的是访客随手一拖，整张图就被拖得七零八落——一张纯展示的图，为什么还背着一整套编辑交互？
    </div>

    <h2>编辑器与展示态</h2>
    <p>
      画布写了两类需求，它们的诉求几乎是相反的。一类是编辑器：用户要能拖节点、拉连线、改结构，交互越全越好。另一类是展示：组织架构、业务全景、数据流向，读者只想<strong>看清楚</strong>，一个多余的操作都是干扰。
    </p>
    <p>
      麻烦的是这两类需求共用同一套渲染。你用一个组件写好了编辑画布，展示页直接复用它，于是三种代价同时出现：访客误拖误连线，把只读内容改得面目全非；站点切到深色主题，画布仍按自己的浅色配色渲染，一块白光贴在页面上；画布内的缩放控件还带着硬编码的颜色，在深色背景里看不清。展示场景要的安静与一致，一个都没拿到。
    </p>

    <h2>截图贴图方案</h2>
    <p>
      最省事的做法是<strong>截图</strong>：把画布截成一张图片贴上去。这一招确实彻底——图片不能被拖动，不会有任何误操作，也绝对忠实于当时的样子。
    </p>
    <p>
      它也承认了一个正确的判断：<strong>展示型内容不需要编辑能力</strong>。这个方向是对的，只是手段太粗暴。
    </p>

    <h2>静态图片缺陷</h2>
    <ul>
      <li>图片不响应主题，站点切到深色，那张浅色截图依然是刺眼的白。</li>
      <li>图片不能缩放平移，节点一多，字小到看不清，也没法用缩略图导航。</li>
      <li>组织架构每变一次就得重新截图、重新替换资源，维护成本全压在人工上。</li>
      <li>标题、说明这类文字变成了像素，无法被搜索、无法被无障碍工具朗读。</li>
      <li>切屏或高倍缩放下图片发虚，和周围的原生文字不在一个画质档次。</li>
    </ul>

    <h2>交互能力开关化</h2>
    <p>
      不推翻「展示不需要编辑」，而是把它做成一排<strong>可以关掉的开关</strong>，同时把配色的决定权交给站点主题。整件事分成三层下手，从交互到配色逐层收敛。
    </p>
    <p>
      <strong>第一层是交互收敛。</strong>Vue Flow 把编辑能力拆成了若干独立的布尔属性，按需关即可：<code>nodes-draggable</code> 关掉节点拖拽，<code>nodes-connectable</code> 关掉新建连线，<code>edges-updatable</code> 关掉改线，<code>pane-movable</code> 关掉画布平移。它们都按 <code>!readonly</code> 绑定，一个开关就能在两个模式之间切换。注意<strong>只读不等于失去一切</strong>：<code>MiniMap</code> 导航与缩放仍应保留，展示场景同样需要「在缩略图上找到某个节点」的能力，只关掉编辑类交互，体验才完整。
    </p>
    <p>
      <strong>第二层是变量映射。</strong>这是双主题适配的主干。Vue Flow 的节点、连线、连接桩都走自己的 CSS 变量，如 <code>--vf-node-bg</code>、<code>--vf-handle</code>、<code>--vf-edge</code>。我们不去逐条覆盖组件样式，而是把这些变量映射到站点的主题变量上——浅色主题下它们自动取到站点的一套色值，画布于是天然融进页面，不需要为每个主题写一份样式。
    </p>
    <p>
      映射覆盖不到的地方，靠选择器补。控件按钮这类颜色是硬编码的，就得在深色分支里用 <code>[data-theme="dark"]</code> 显式覆盖。<strong>关键收益是切换成本</strong>：主题只改根元素上的 <code>&lt;html data-theme&gt;</code>，整张画布随之响应，不必重建画布，也不必重新挂载组件。
    </p>
    <p>
      <strong>第三层是属性级配色。</strong>有些颜色不走 CSS，而是作为属性传给组件，比如背景网格的 <code>pattern-color</code>。这类值绑到主题计算属性上即可：<code>isDark</code> 为真时用一个深色，为假时用浅色，主题一换，网格颜色跟着变。
    </p>
    <div class="lesson-box warn">
      <strong>两个工程细节：</strong>画布组件依赖浏览器环境，在服务端渲染或静态预渲染下要包一层 <code>ClientOnly</code>，否则会在构建阶段报错；画布内的浮层用官方 core 包自带的 <code>Panel</code> 组件，配合 <code>PanelPosition</code> 定位到四角，适合放模式徽标、图例或操作区，不必自己拿绝对定位去怼。
    </div>
    <p>
      最后要做的是一次完整走查：把只读开关来回切一遍，再切一次主题，逐一确认节点底色、连线颜色、连接桩、控件按钮与背景网格都跟着变对了。双主题最容易漏的就是这种「某一处硬编码忘了覆盖」，而它偏偏在深色下最显眼。
    </p>

    <h2>只读主题联动</h2>
    <figure class="lesson-figure">
      <figcaption>点两个按钮分别切换只读模式与站点主题，观察节点、连线、控件与网格如何联动。</figcaption>
      <VF12ReadonlyTheme />
    </figure>

    <h2>能力外观可配置</h2>
    <p>
      只读与双主题是同一件事的两面：把「能力」和「外观」都变成可配置项。交互开关决定画布能做什么，变量映射与 <code>data-theme</code> 选择器决定它长什么样。想清楚展示场景真正需要什么，就不会把编辑器整套能力原样端给读者。
    </p>
    <div class="lesson-term">
      <span class="term-name">「只读与主题适配」</span>只读靠四个属性收敛能力：<code>nodes-draggable</code>、<code>nodes-connectable</code>、<code>edges-updatable</code>、<code>pane-movable</code>，按 <code>!readonly</code> 绑定即可一键切换（<code>MiniMap</code> 与缩放建议保留）。主题适配分两层：把 <code>--vf-node-bg</code>、<code>--vf-handle</code>、<code>--vf-edge</code> 等官方变量映射到站点变量，再用 <code>[data-theme="dark"]</code> 覆盖控件等硬编码颜色；属性级配色（如 <code>pattern-color</code>）绑定主题计算属性。只改根元素的 <code>&lt;html data-theme&gt;</code> 即可全画布生效。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
