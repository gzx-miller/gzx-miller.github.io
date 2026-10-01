<script setup lang="ts">
import K18Teleport from './K18Teleport.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>弹窗明明写了 <code>position: fixed</code>、<code>z-index: 9999</code>，却还是被父容器裁掉半边、被别的元素压住——问题到底出在哪？
    </div>

    <h2>卡片内嵌弹窗</h2>
    <p>
      你在课程卡片里做一个「确认开始练习？」的弹窗。按直觉，它属于这张卡片所在的那个组件，于是你把弹窗的 DOM 直接写在卡片模板里，用一层半透明遮罩铺满屏幕，再定好超高的 <code>z-index</code>，想着这样总能盖住一切。
    </p>
    <p>
      结果却事与愿违：遮罩只覆盖了卡片那一小块，超出的部分被裁掉了；或者虽然铺满了，却被页头、侧边栏压住了半截。你调大 <code>z-index</code> 也没用——它像是被关在某个看不见的盒子里，出不来。根子在于：<strong>弹窗的视觉需求（覆盖全屏、永远在最上层）和它的代码位置（写在卡片里）出现了矛盾</strong>。
    </p>

    <h2>定位层级硬挤</h2>
    <p>
      最省事的做法：继续把弹窗留在原组件里，靠绝对定位把它挪出组件边界，再靠不断调大 <code>z-index</code> 往上挤，试图压过所有邻居。
    </p>
    <p>
      这个方案做对了一件事：<strong>从逻辑上看，弹窗确实该归这张卡片管</strong>。它是「这张卡片触发的确认框」，它要读取卡片里的数据、响应用户的选择，把它就地写在组件里符合人对归属的直觉，数据和事件也都天然通畅。
    </p>

    <h2>溢出裁剪困境</h2>
    <ul>
      <li>父容器只要设了 <code>overflow: hidden</code>，弹窗超出的部分就会被<strong>直接裁掉</strong>，遮罩再也铺不满屏幕。</li>
      <li>父级一旦有 <code>transform</code>（比如某些动画或居中技巧），就会为它创建新的包含块，<strong><code>position: fixed</code> 会相对这个父级而非视口定位</strong>，弹窗位置立刻错乱。</li>
      <li>父级本身处在某个层叠上下文里，<code>z-index</code> 就被<strong>封在这个上下文内部比较</strong>，无论如何都压不过上下文外面的元素。</li>
      <li>就算勉强解决，也得顺着祖先链一路去改 <code>overflow</code>、去拆 <code>transform</code>，把一个弹窗的样式问题扩散到整条组件链，牵一发而动全身。</li>
    </ul>

    <h2>逻辑位置拆分</h2>
    <p>
      不推翻「弹窗归卡片管」这个直觉，而是把两件被强行绑在一起的事<strong>拆开</strong>：逻辑归属留在原组件体系里，实际渲染的 DOM 位置挪到别处。这正是 <code>Teleport</code> 做的事——它把组件的 DOM <strong>传送</strong>到指定的目标节点，通常就是 <code>body</code>。
    </p>
    <ol class="lesson-steps">
      <li>组件内部照旧用一个 <code>open</code> 变量控制弹窗是否显示，逻辑没变。</li>
      <li>用 <code>Teleport</code> 的 <code>to</code> 属性指定 <code>body</code>，把弹窗的 DOM 传送到那里。</li>
      <li>点击关闭按钮修改 <code>open</code>，弹窗从 <code>body</code> 中移除。</li>
      <li>在元素面板里确认：弹窗节点真的挂在 <code>body</code> 下，而不是卡片所在的容器里。</li>
    </ol>
    <p>
      挪到 <code>body</code> 之后，前面三条缺陷一次性消失：<code>body</code> 没有被裁剪，遮罩自然铺满全屏；<code>body</code> 没有 <code>transform</code>，<code>fixed</code> 老老实实相对视口定位；它也不困在卡片那个层叠上下文里，<code>z-index</code> 终于能和全页元素同场竞技。
    </p>
    <div class="lesson-box warn">
      <strong>最容易误解的一点：</strong>Teleport 只改变 DOM 的<strong>渲染位置</strong>，不改变组件的<strong>响应式作用域</strong>。弹窗虽然挂到了 <code>body</code> 下，它仍然处在原来的组件逻辑树中——<code>props</code> 照常接收、<code>emit</code> 照常往上抛、父级的响应式数据照常访问、组件间的层级关系照常生效。传的是节点，不是逻辑。
    </div>
    <p>
      正因为它只是「换了个地方渲染」，需要把已经挂载好的节点从一处移到另一处时，还可以用 <code>disabled</code> 属性<strong>动态开关 Teleport</strong>：开关为真时留在原地，为假时传送到目标节点。这给「是否脱离当前容器」留了运行时决定的余地。
    </p>
    <p>
      不过要提醒的是，Teleport 只解决了<strong>渲染位置</strong>这一层难题，真实产品里的弹窗还有一堆事情要做：键盘焦点要锁在弹窗内部、按 Esc 能关闭、打开时锁定背景滚动、给读屏软件加上正确的无障碍标签。这些是弹窗这个「组件形态」自身的责任，和 Teleport 各管一段——别指望传送一下 DOM 就把它们一并解决了。
    </p>
    <p>
      弹窗之外，通知条、下拉浮层、全局抽屉这些需要「脱离父容器、覆盖全局」的浮层，也都在用 Teleport。只要某个元素明明属于某处逻辑、渲染上却必须逃出父容器，它就是 Teleport 的用武之地。
    </p>

    <h2>节点挂载位置</h2>
    <figure class="lesson-figure">
      <figcaption>点「打开弹窗」，在元素面板里看看它是不是挂在了 <code>body</code> 下，而非卡片容器里。</figcaption>
      <K18Teleport />
    </figure>

    <h2>归属位置解耦</h2>
    <p>
      Teleport 化解的是「逻辑归属」与「渲染位置」之间的矛盾：组件的响应式作用域、<code>props</code>、事件都留在原组件体系，实际 DOM 却渲染到 <code>body</code> 这样的目标节点。于是弹窗不再被父级的 <code>overflow: hidden</code> 裁剪、不被 <code>transform</code> 创建的包含块改变定位、也不困在父级层叠上下文里被 <code>z-index</code> 压住。弹窗、通知、下拉浮层、全局抽屉都常用它，而焦点陷阱、Esc 关闭、滚动锁定这些仍要另行处理。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Teleport」</span>把组件的 DOM 渲染到指定目标节点（如 <code>body</code>），但<strong>逻辑仍留在原组件体系</strong>——响应式作用域、<code>props</code>、事件都不变。它让浮层不被父级 <code>overflow: hidden</code> 裁剪、不被 <code>transform</code> 创建的新包含块改变定位、不困在父级层叠上下文中被 <code>z-index</code> 压住；需要移动已挂载的节点时可用 <code>disabled</code> 动态开关。弹窗、通知、下拉浮层、全局抽屉都常用它。
    </div>
  </LessonArticle>
</template>
