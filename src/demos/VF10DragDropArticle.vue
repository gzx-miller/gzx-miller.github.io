<script setup lang="ts">
import VF10DragDrop from './VF10DragDrop.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把左侧「审批」物料拖进右侧画布，明明是在鼠标位置松的手，节点却出现在左上角老远的地方；画布缩得越小，偏得越离谱——<code>clientX</code>、<code>clientY</code> 拿到的坐标到底是谁的坐标？
    </div>

    <h2>提出问题</h2>
    <p>
      低代码平台最核心的那个动作，说起来只有一句：从物料区拖一个形状到画布上。用户对它的期待很朴素——<strong>我松手的地方，就是它出现的地方</strong>。可这背后有一段容易被忽略的换算，做不好就是「拖哪儿都不对」。
    </p>
    <p>
      原因在于画布不是一块静态的画板。Vue Flow 的画布内部有一层视口变换：用户滚轮缩放、拖动空白处平移之后，<strong>画布的坐标系已经和屏幕的像素坐标系错开了</strong>。节点的 <code>position</code> 活在画布坐标系里，而浏览器拖放事件给到的永远是屏幕坐标系。这两个坐标系不换算就动手，位置必然错位。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：直接用浏览器原生拖放。<code>draggable="true"</code> 让物料可拖，<code>dragstart</code> 里把物料类型写进 <code>dataTransfer</code>，画布容器监听 <code>drop</code>，在事件里读出类型，然后用 <code>event.clientX</code>、<code>event.clientY</code> 当作新节点的 <code>position</code>，调 <code>addNodes</code> 放上去。
    </p>
    <p>
      这个方案做对了两件重要的事。第一，<strong>它复用了浏览器原生的拖放能力</strong>，不用自己监听 <code>mousedown</code> 再手写 <code>mousemove</code>、画虚影、判断边界。第二，<strong>它把一次拖拽翻译成了一次数据操作</strong>：松手只是触发条件，真正建节点靠的还是 <code>addNodes</code>，符合「改数据即改图」的范式。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>画布缩放后，落点明显偏离鼠标——缩放比例越小，偏差越大。</li>
      <li>画布平移后同样偏，而且偏差方向随平移量变化，肉眼完全没法估算。</li>
      <li>把 <code>dragover</code>、<code>dragenter</code> 放任不管时，<code>drop</code> 事件根本不触发，页面像是「不接收」拖拽。</li>
      <li>物料类型若在 <code>dragstart</code> 里立刻读回，可能拿到空值，让人误判为「拖拽没生效」。</li>
      <li>每次放下都用同一个 id，后放的节点会把先放的覆盖掉，画布状态直接错乱。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻这套原生拖放，只补上缺的那一步换算。Vue Flow 在 <code>useVueFlow()</code> 上提供了 <code>screenToFlowCoordinate</code>：把屏幕坐标交给它，它按当前视口的缩放与平移换算出画布坐标，返回的正是可以喂给 <code>addNodes</code> 的 <code>position</code>。
    </p>
    <p>
      于是 <code>drop</code> 处理器的逻辑变成三步，顺序不能乱：先 <code>preventDefault</code> 并读出物料类型，再用 <code>screenToFlowCoordinate({ x: clientX, y: clientY })</code> 换算落点，最后拼出节点对象交给 <code>addNodes</code>。换算这一步是整件事的关键，<strong>少了它，拖放在缩放过的画布上永远对不准</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>其一，旧版用来做坐标换算的 <code>project()</code> 已被 <code>screenToFlowCoordinate</code> 取代，别再从旧文档里照抄；其二，<code>dataTransfer</code> 里写进去的数据在 <code>dragstart</code> 之后立刻读取可能为空，这是浏览器的安全限制，<strong>统一在 <code>drop</code> 里 <code>getData</code> 最稳妥</strong>。
    </div>
    <p>
      接着补齐拖放协议本身。画布容器要对 <code>dragover</code> 与 <code>dragenter</code> 调 <code>preventDefault()</code>，浏览器才认为这块区域接受放置，<code>drop</code> 才会派发；物料在 <code>dragstart</code> 时把 <code>effectAllowed</code> 设成 <code>'move'</code>，光标就会给出正确的暗示。这两条都不是可选的美化，而是让功能真正可用的前提。
    </p>
    <p>
      最后是身份。每一批物料可能被反复拖入，节点 id 必须每次唯一：可以用一个递增计数器拼出 <code>approval-1</code>、<code>approval-2</code>，也可以用 <code>crypto.randomUUID()</code>。<strong>重复 id 会让画布分不清谁是谁</strong>，后续的选中、更新、删除都会跟着出错。
    </p>
    <p>
      还有一点常被忽略：新节点必须带上可读的 <code>data.label</code>。少了它，画布上出现的就是一个没有文字的空块，用户会以为拖拽失败。落点坐标也值得回显——状态栏那句「在画布坐标 (x, y) 放置了节点」，在排查坐标系问题时比任何日志都直观。
    </p>
    <p>
      还差一层体验。物料面板与画布各自加一点拖拽高亮：面板里的物料在按下时变个边框色，画布容器在 <code>dragenter</code> 时亮起、<code>dragleave</code> 时复原。用户于是知道「这里能放」，而不是悬在空中猜。至此，一次拖拽从视觉反馈到数据落点才算闭合。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>把左侧物料拖进画布，再缩放画布后重拖一次，对比状态栏里报出的落点坐标。</figcaption>
      <VF10DragDrop />
    </figure>

    <h2>总结</h2>
    <p>
      拖拽添加节点这件事的本质，是<strong>一次坐标系转换</strong>：浏览器给的屏幕坐标，必须先经过 <code>screenToFlowCoordinate</code> 变成画布坐标，才能成为节点的 <code>position</code>。搞清楚「谁在哪个坐标系里」，落点偏移这个最常见的坑就不存在了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「screenToFlowCoordinate」</span>是 <code>useVueFlow()</code> 提供的方法，把屏幕坐标（如拖放事件里的 <code>clientX</code> / <code>clientY</code>）换算成画布坐标，供 <code>addNodes</code> 决定节点落点。配合它还需三条约定：<code>dragover</code> / <code>dragenter</code> 必须 <code>preventDefault()</code> 才会触发 <code>drop</code>，物料类型统一在 <code>drop</code> 里 <code>getData</code> 读取，每次放置都要生成唯一 id。
    </div>
  </LessonArticle>
</template>
