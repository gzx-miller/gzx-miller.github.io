const o=`<script setup lang="ts">
import R13Portal from './R13Portal.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>确认弹窗明明写好了，点「发布课程」却只从卡片底部露出一条边——它被卡片自己的 <code>overflow: hidden</code> 裁掉了，怎么调 <code>z-index</code> 都盖不上去。
    </div>

    <h2>祖先容器裁切限制</h2>
    <p>
      弹窗的诉求很朴素：它想浮在整个页面之上，居中、带遮罩、盖住一切。可它偏偏被渲染在触发它的那个组件内部，于是继承了祖先容器的所有布局约束：<code>overflow: hidden</code> 把它切掉，父级的定位与 <code>z-index</code> 把它困在一个<strong>层叠上下文</strong>里，任你把弹窗的 <code>z-index</code> 调到几千也逃不出去。
    </p>
    <p>
      既然 DOM 层级是病根，最自然的想法就是把弹窗节点挪到 <code>document.body</code> 下。可一旦手动挪动，代价就来了：这颗节点脱离了 React 树，父组件的 <code>Context</code> 读不到了，父级绑定的 <code>onClick</code> 也收不到里面的事件，弹窗的开合状态、卸载清理全得你自己盯着。抽象出来就是：<strong>弹窗如何才能逃离 <code>overflow</code>、层叠上下文这些 DOM 布局限制？</strong>
    </p>

    <h2>手动创建挂载节点</h2>
    <p>
      最直接的做法：在打开弹窗时，用原生 DOM 手写一个挂载点——<code>document.createElement('div')</code>、<code>document.body.appendChild(node)</code>，再用原生方式往里写内容、加事件监听。
    </p>
    <p>
      这个方案做对了一件事：<strong>它让弹窗的节点真正挂到了 <code>body</code> 下，摆脱了祖先容器的裁切与层叠限制</strong>，视觉上确实能浮在最上层了。当弹窗内容只是几行静态文字、不需要和父组件通信时，它能跑通。
    </p>

    <h2>游离节点上下文丢失</h2>
    <ul>
      <li>节点脱离 React 树后，<strong>父组件的 <code>Context</code> 读不到</strong>：弹窗里那句 <code>useContext(ThemeContext)</code> 会拿到默认值，主题、多语言全部失效。</li>
      <li>事件不再沿 React 树冒泡，父级那个「点任意处记录埋点」的 <code>onClick</code> 收不到弹窗里的点击。</li>
      <li>弹窗的开合、内容更新、卸载清理都要手工同步，父组件一重渲染就和原生 DOM 对不上。</li>
      <li>原生节点上的键盘与焦点行为要自己重写，<code>Escape</code> 关闭、Tab 循环、关闭后焦点归位全成了额外工作。</li>
    </ul>

    <h2>传送门接管节点搬移</h2>
    <p>
      不推翻「把节点挪走」，而是让 React 自己来做这件事：<code>createPortal(children, container)</code>。它把一棵 React 子节点渲染到你指定的 DOM 容器里（例如 <code>document.body</code>），于是节点真的落到了页面顶层，<strong>但又没有被逐出 React 树</strong>。
    </p>
    <ol class="lesson-steps">
      <li>触发按钮位于一个受 <code>overflow: hidden</code> 限制的容器中，点击后更新 <code>open</code> 状态。</li>
      <li><code>ConfirmDialog</code> 用 <code>createPortal</code> 把遮罩与弹窗渲染到 <code>document.body</code>，因此不会被裁切。</li>
      <li>点击遮罩或「确认 / 取消」关闭弹窗；弹窗内部点击用 <code>stopPropagation</code> 阻止冒泡，避免误关。</li>
      <li>打开浏览器元素面板，可以确认弹窗节点挂在 <code>body</code> 下，而 React 组件树的结构完全没变。</li>
    </ol>
    <p>
      关键要记牢的是：<strong>Portal 只改变 DOM 的放置位置，不改变 React 树里的父子关系</strong>。所以弹窗依然是那个组件的子节点——<code>Context</code> 照常可读，事件也依然<strong>沿着 React 树而非 DOM 树冒泡</strong>：弹窗在 DOM 里已经挂到 <code>body</code> 了，可它的 <code>onClick</code> 冒泡路径仍然经过它在 React 里的祖先组件。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的点：</strong>正因为事件按 React 树冒泡，外层祖先的处理器<strong>仍会收到</strong>弹窗里的事件，小心重复触发；另外 Portal 的目标 DOM 节点必须<strong>已经存在</strong>，而且一旦更换目标节点，React 会把整棵 Portal 内容重新创建一遍。
    </div>
    <p>
      离一个「能用」的弹窗还差最后一段：DOM 位置解决了裁切，但可访问性还没跟上。生产级弹窗要补上 <code>dialog</code> 语义、<strong>焦点陷阱</strong>（<code>Tab</code> 只在弹窗内循环）、<code>Escape</code> 关闭，以及关闭之后把焦点还给触发它的按钮。这些键盘与焦点行为要单独测试，不能因为节点换了位置就默认它是对的。
    </p>

    <h2>遮罩点击关闭差异</h2>
    <figure class="lesson-figure">
      <figcaption>点「发布课程」弹出确认框，注意它不受外层容器裁切；再点遮罩和框内内容，感受关闭与否的区别。</figcaption>
      <R13Portal />
    </figure>

    <h2>层叠规则与视觉层级</h2>
    <p>
      弹窗之所以弹不出来，是 DOM 的布局与层叠规则在作祟，而不是 React 的问题。<code>createPortal</code> 把节点搬到 <code>body</code> 解决视觉层级，同时把它留在 React 树里，<code>Context</code> 和事件冒泡照旧——这正是它优于裸操作 DOM 的地方。剩下的焦点管理，才是弹窗真正「完整」的门槛。
    </p>
    <div class="lesson-term">
      <span class="term-name">「层叠上下文」</span>是页面里的一块独立堆叠区域，由定位元素配合 <code>z-index</code>、<code>transform</code>、<code>opacity</code> 等条件创建；<strong>区域内的元素无论 <code>z-index</code> 调多大，都无法盖到区域外更低层级的元素之上</strong>。Portal 之所以必要，就是把弹窗节点移出这个上下文，而不是在内部继续加 <code>z-index</code>。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
