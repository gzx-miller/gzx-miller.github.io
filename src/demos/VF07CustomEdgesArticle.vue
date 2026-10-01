<script setup lang="ts">
import VF07CustomEdges from './VF07CustomEdges.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>请假审批流里「主管 → 老板」这条是驳回、「主管 → 休假成功」这条是通过，可两条线都灰扑扑一根，读图的人根本分不出哪条被驳回了。
    </div>

    <h2>提出问题</h2>
    <p>
      你画的是一张请假审批流程图：员工提交、主管审批，之后分两路——通过就走「休假成功」，驳回就送「老板特批」。三条线都老老实实连好了，可它们在画面上完全一样。麻烦在于：<strong>「通过」和「驳回」是两种截然不同的业务结果，理应在图上就看得出来</strong>，现在却只能靠节点名字去脑补。
    </p>
    <p>
      代价很实在。审批人一眼扫过去，分不清哪条是正常出口、哪条是异常出口，这张图等于白画。上一课给边加了颜色和箭头能解决一部分，但一旦标签要显示「通过 ✓」「驳回 ✗」这种带状态、要换色、以后还可能点一下展开详情的结构，默认的 SVG 文本标签就彻底不够用了。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法，还是把状态塞进默认边的 <code>label</code>：给它写死一串「通过」或「驳回」。
    </p>
    <p>
      这个方案对在：<strong>状态只要不变，这样确实能看</strong>，而且完全不用碰渲染逻辑，改一个字段名就行。它把「状态」和「展示」做了最直接的绑定。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>默认 <code>label</code> 是 SVG 文本，只能渲染文字，做不出圆角胶囊、背景色、图标这类结构。</li>
      <li>通过和驳回的线色本应不同，但改文案并不改线色，两个维度是割裂的。</li>
      <li>想给标签加点按交互时，SVG 里根本承载不了。</li>
      <li>状态更新往往要手动重建整条边，背离了「改数据即改图」的范式。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「用状态驱动连线」，而是把连线的渲染权也收回来。做法和自定义节点同构：给 <code>edge.type</code> 起一个自定义名，比如 <code>approval</code>，再用同名插槽 <code>#edge-approval</code> 接管它的画法。
    </p>
    <p>
      关键点一：插槽参数给的是几何信息——来自起点的 <code>sourceX</code> / <code>sourceY</code>、落在终点的 <code>targetX</code> / <code>targetY</code>，以及两端各自的方位。你要自己算出一条 SVG 路径：调用 <code>getBezierPath</code>，它会返回 <code>[path, labelX, labelY]</code>，本课只取第一项当作 <code>&lt;path&gt;</code> 的 <code>d</code> 属性。
    </p>
    <div class="lesson-box warn">
      <strong>必须保留的官方特征：</strong>这个 <code>&lt;path&gt;</code> 要带上 <code>fill="none"</code> 与 <code>vue-flow__edge-path</code> 类，一个都不能少。缺了它们，选中高亮、拖拽改线这些内置特性会直接失效——线虽然是你画的，但仍要伪装成官方连线，才能继续享受整套交互。
    </div>
    <p>
      关键点二：线色与文案由 <code>edge.data</code> 里的业务状态驱动。在 <code>data</code> 上放一个 <code>status</code>，取 <code>'pass'</code> 或 <code>'reject'</code>，path 的 class 与颜色都跟着它切换，绿色表示通过、红色表示驳回。
    </p>
    <p>
      关键点三：要叠 HTML 标签，就用 <code>&lt;EdgeLabelRenderer&gt;</code>。它悬在画布上层，是一个独立的渲染层，普通 HTML 标签放进去即可；<strong>标签的位置用起终点坐标的中点（两者相加再除以二）做绝对定位</strong>，胶囊的 class 同样由 <code>data.status</code> 决定。
    </p>
    <div class="lesson-box hint">
      <strong>为什么一定要这个悬层：</strong>画布本体是 SVG，里面塞不进交互型的 HTML。所以复杂标签一律走 <code>EdgeLabelRenderer</code>。只是它的标签默认<strong>不接收指针事件</strong>（<code>pointer-events: none</code>），需要可点击时要手动开启。
    </div>
    <p>
      收口时再看一眼数据流：只改 <code>edge.data</code>，线的颜色与标签文案就会响应式更新，不需要手动重绘。这正是自定义连线的价值——<strong>渲染形态由你定，驱动方式仍然是数据</strong>。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点两个按钮切换「主管 → 老板」「主管 → 休假」的状态，看线色与标签一起变。</figcaption>
      <VF07CustomEdges />
    </figure>

    <h2>总结</h2>
    <p>
      自定义连线把「线的画法」交还给你：类型名对上 <code>#edge-类型名</code> 插槽，坐标由插槽给出，路径交给 <code>getBezierPath</code> 计算，HTML 标签挂到 <code>EdgeLabelRenderer</code> 这个悬层上。别忘了保留官方 class 与内联属性，剩下的就交给 <code>edge.data</code>——业务状态一变，线的颜色和文案自动跟上。
    </p>
    <div class="lesson-term">
      <span class="term-name">「自定义连线」</span>指给 <code>edge.type</code> 起自定义名，用同名插槽 <code>#edge-类型名</code> 接管渲染。插槽给出 <code>sourceX/Y</code>、<code>targetX/Y</code> 与两端方位，用 <code>getBezierPath</code> 生成 path 的 <code>d</code>；HTML 标签交给 <code>EdgeLabelRenderer</code> 悬层渲染（默认不接收指针事件）。自定义连线需保留官方 class 与内联属性，否则选中、拖拽等特性会失效。
    </div>
  </LessonArticle>
</template>
