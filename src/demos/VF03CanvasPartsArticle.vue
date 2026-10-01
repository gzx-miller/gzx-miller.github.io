<script setup lang="ts">
import VF03CanvasParts from './VF03CanvasParts.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>画布上的节点一多，用户把视口拖到很远的地方，就再也找不回自己的图了；页面上没有边界参照，也不知道当前缩放到了哪一层——这些总得自己写吗？
    </div>

    <h2>画布定位困境</h2>
    <p>
      你画的流程图已经能用了：节点可以拖、画布可以缩放平移。但真实用户会把它拖到任意地方。这时候三个问题会接连冒出来。第一，<strong>画面没有参照物</strong>——空白区域和节点区域长得一样，用户分不清自己是在图的中央还是飘在空旷的边角。第二，<strong>缩放层级失控</strong>——滚轮一不小心缩到很小，想回到刚好铺满的样子却只能凭手感试。第三，<strong>视口外的节点找不回来</strong>——图一大，用户根本不知道该往哪个方向拖，才能重新看见自己关心的那一块。
    </p>
    <p>
      如果这三个能力都自己实现，等于又回到了手写画布引擎的老路。而它们其实是<strong>所有流程图共通的通用需求</strong>，没有理由每个人各写一遍。
    </p>

    <h2>核心数据边界</h2>
    <p>
      最朴素的做法：什么都不加。让画布保持一片干净的背景，用户自己滚、自己拖。这个方案对在哪里？<strong>它承认了「画布主体只需要节点与连线」</strong>，附加元素确实不该混进核心数据模型里——这是对的克制，只是克制过了头。
    </p>

    <h2>尺度与归位缺口</h2>
    <ul>
      <li>纯色背景没有尺度感，拖远之后用户对「图在哪、还有多大」完全失去判断。</li>
      <li>没有归位入口，缩放层级一旦乱了只能靠反复滚轮试出来。</li>
      <li>大图缺少导航手段，找节点的成本随图的规模急剧上升。</li>
      <li>想给网格配色做主题适配时，发现根本没有可以绑定的入口。</li>
    </ul>

    <h2>可插拔画布组件</h2>
    <p>
      不推翻「画布主体只有节点与连线」，而是把这些能力做成<strong>可插拔的附加组件</strong>，按需引入。它们各自是独立的小包，样式也要分别引入：<code>@vue-flow/background</code> 提供背景图案，<code>@vue-flow/controls</code> 提供缩放控制条，<code>@vue-flow/minimap</code> 提供缩略图导航。
    </p>
    <p>
      先看背景。它有两种图案变体：<code>dots</code> 圆点与 <code>lines</code> 网格线——<strong>旧版的 <code>Cross</code> 十字已经移除</strong>，别再照着老文档写。变体以外，<code>gap</code> 控制网格间距（本课 24）、<code>size</code> 控制点/线的大小、<code>pattern-color</code> 决定图案颜色。把 <code>pattern-color</code> 绑定到主题计算属性上，切换深浅主题时网格就会即时换色。
    </p>
    <p>
      再看控制条。<code>Controls</code> 自带缩放、归位与锁定缩放的按钮，用来解决「缩放层级失控」这一条，用 <code>position</code> 把它定到画布四角之一（本课右上角）。
    </p>
    <p>
      最后是小地图。<code>MiniMap</code> 是一张可拖动、可缩放的缩略图，解决「视口外节点找不回来」。它的 <code>node-color</code> 支持接收一个<strong>函数</strong>，可以按节点上的数据上色——本课就按 <code>node.data.color</code> 给节点染色，没设颜色的退回暖橙；<code>mask-color</code> 控制视口遮罩色；开启 <code>pannable</code> 与 <code>zoomable</code> 之后，直接拖小地图就能导航。
    </p>
    <div class="lesson-box warn">
      <strong>三个务必记住的细节：</strong>其一，<code>Controls</code> 与 <code>MiniMap</code> 都<strong>相对画布容器定位</strong>，所以画布容器<strong>必须设定明确高度</strong>，容器一旦塌陷，控件就会错位到意想不到的地方。其二，深色主题下控制条按钮的硬编码颜色要反色，需要在主题文件里单独覆盖。其三，三个附加包的<strong>版本要与 <code>core</code> 保持一致</strong>，混用不同小版本可能在样式上互相打架。
    </div>
    <p>
      顺带一个命名迁移的提醒：<code>pattern-color</code>、<code>bg-color</code> 属于旧 props，当前版本新增的写法是 <code>color</code>；演示里仍用旧名也能跑通，但新代码建议跟上官方的 <code>color</code>。
    </p>

    <h2>小地图网格切换</h2>
    <figure class="lesson-figure">
      <figcaption>切换圆点与网格线，拖动右下角小地图导航，再切换站点主题看网格换色。</figcaption>
      <VF03CanvasParts />
    </figure>

    <h2>导航能力外置</h2>
    <p>
      画布三件套解决的是同一类问题：<strong>把通用的人机导航能力做成插件，而不是塞进核心数据</strong>。背景网格给尺度感、控制条管缩放与归位、小地图管大图导航，三者各自成包、按需引入、各自引样式，配色通过属性绑定跟站点主题保持一致。记住容器必须有高度、版本要跟 <code>core</code> 对齐这两条，附加组件用起来就不会出岔子。
    </p>
    <div class="lesson-term">
      <span class="term-name">「画布三件套」</span>指 Vue Flow 三个独立附加包：<code>@vue-flow/background</code> 提供 <code>dots</code> / <code>lines</code> 背景图案（旧版 <code>Cross</code> 已移除），<code>@vue-flow/controls</code> 提供缩放与归位控制条，<code>@vue-flow/minimap</code> 提供可拖可缩的缩略图（<code>node-color</code> 支持函数上色）。三者各需引入自己的 <code>dist/style.css</code>，相对画布容器定位，故容器必须有明确高度，且版本应与 <code>core</code> 保持一致。
    </div>
  </LessonArticle>
</template>
