<script setup lang="ts">
import J10EventDelegation from './J10EventDelegation.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>给列表里 100 个按钮各绑一个点击事件，新增第 101 个按钮时它却毫无反应——为什么新来的节点总是不听使唤？
    </div>

    <h2>列表按钮事件绑定</h2>
    <p>
      你在做一个课程列表：每一行都有按钮，点击切换选中状态。最直觉的写法是遍历所有行，给每个按钮绑定一个监听器。一开始没问题，直到列表变得很长——几百个监听器常驻内存；更糟的是列表会动态增删，每插入一行你都得记得重新绑一次，一旦漏掉，那个新按钮就成了「哑巴」。
    </p>
    <p>
      要解决它，得先回答一个问题：<strong>点击一个按钮时，这个事件到底经过了哪些元素？</strong>答案涉及 DOM 的事件传播机制。理解了它，你就能把「给每个子节点绑监听」换成「在父节点守株待兔」，一次性解决绑定数量和动态节点两个难题。
    </p>

    <h2>逐节点绑定监听</h2>
    <p>
      最直接的做法：遍历子节点，逐个 <code>addEventListener('click', ...)</code>，每个监听器只负责自己那一行。逻辑简单，谁被点谁响应，彼此独立。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「监听」和「元素」一一对应</strong>，心智负担低。当列表很短、而且是静态的，这确实是最清楚的写法。
    </p>

    <h2>监听器数量开销</h2>
    <ul>
      <li>监听器数量等于子节点数量，列表越长内存占用越高，绑定开销也越大。</li>
      <li>动态插入的新节点不会自动拥有事件，必须手动再绑一次，容易漏。</li>
      <li>删除节点时如果不解绑，还留着对已移除元素和闭包的引用，造成内存泄漏。</li>
      <li>同一套处理逻辑被重复绑定 N 次，代码里全是重复的事件注册。</li>
    </ul>

    <h2>父容器冒泡监听</h2>
    <p>
      换一个视角：既然点击子元素时，事件会经过它的祖先，那不如<strong>在稳定的父容器上监听一次</strong>，让冒泡把事件送到这里，再判断「到底点到了谁」。这就是事件委托。
    </p>
    <p>
      要理解它为什么成立，得先看 DOM 的事件传播，它分三个阶段：
    </p>
    <ol class="lesson-steps">
      <li><strong>捕获阶段</strong>：事件从 <code>window</code> 一路向下，抵达目标元素之前先经过各级祖先。</li>
      <li><strong>目标阶段</strong>：事件到达真正被点击的那个元素。</li>
      <li><strong>冒泡阶段</strong>：事件从目标元素一路向上，回传给各级祖先。</li>
    </ol>
    <p>
      平时 <code>addEventListener</code> 默认监听的是冒泡阶段，所以只要把监听器挂在父容器上，子元素被点击时事件就会冒泡上来触发它。关键在于两个属性的区别：<code>event.target</code> 是<strong>真正被点击的元素</strong>，<code>event.currentTarget</code> 是<strong>监听器所在的元素</strong>。少了这层区分，你就分不清用户点的是按钮还是按钮外面那层行。
    </p>
    <p>
      认出目标后，用 <code>event.target.closest(选择器)</code> 从实际触发元素向上寻找最近的匹配项，再通过 <code>dataset</code> 读取 <code>data-*</code> 属性，就能定位到具体是哪一行、执行对应分支。于是监听器数量从 N 降到 1，而且<strong>对动态增删的子节点天然生效</strong>——因为监听器在父容器上，新节点一插进来就自动被覆盖，无需重新绑定。
    </p>
    <p>
      还有一个容易忽略的选择：委托的容器要挑「稳定的祖先」。如果把监听器挂在本身也会被整体替换的元素上，它一旦消失，委托就跟着失效；挂在始终存在的列表外层，才扛得住子项反复增删。这才是「委托」二字真正的落点——把职责上提到一个不会轻易变动的位置。
    </p>
    <div class="lesson-box warn">
      <strong>两个坑：</strong>其一，<code>closest</code> 会一直向上查到 <code>document</code>，使用时要结合委托容器的范围判断，避免误匹配到容器外的同类元素；其二，点击容器自身的空白区域时，<code>closest</code> 可能命中容器本身或返回空，处理前要先确认目标是否落在预期的子元素范围内。
    </div>
    <p>
      还有一个前提不能忘：<strong>不是所有事件都会冒泡</strong>。<code>focus</code>、<code>blur</code>、<code>scroll</code> 这类事件不参与冒泡，委托在冒泡阶段就收不到它们。这种情况下要么改用捕获阶段监听，要么换用会冒泡的替代事件（例如用 <code>focusin</code> 代替 <code>focus</code>）。
    </p>

    <h2>单监听器响应范围</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮切换课程，注意父容器只挂了一个监听器，却能响应所有子元素。</figcaption>
      <J10EventDelegation />
    </figure>

    <h2>事件委托收益代价</h2>
    <p>
      事件委托利用冒泡，把「给 N 个子节点各绑一个监听器」变成「在父节点挂一个」。它把监听器数量从 N 降到 1，并让动态新增的节点自动拥有交互能力——代价是你要靠 <code>closest</code> 和 <code>target</code> 亲手把真实目标认出来。
    </p>
    <div class="lesson-term">
      <span class="term-name">「事件委托」</span>指利用事件的<strong>冒泡</strong>特性，在稳定的父容器上统一注册一个监听器，再通过 <code>event.target.closest(选择器)</code> 判断真实交互目标、用 <code>dataset</code> 读取 <code>data-</code> 属性执行分支。它与捕获、目标、冒泡三阶段相关，注意 <code>target</code>（实际触发元素）与 <code>currentTarget</code>（监听器所在元素）的区别，且 <code>focus</code>、<code>blur</code>、<code>scroll</code> 等事件不冒泡。
    </div>
  </LessonArticle>
</template>
