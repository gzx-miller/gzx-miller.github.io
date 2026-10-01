<script setup lang="ts">
import K17Directive from './K17Directive.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>五个搜索框都要「一进页面就自动聚焦」，难道每个组件里都写一遍 <code>ref</code> 加 <code>onMounted</code>？这套样板代码能不能只写一次？
    </div>

    <h2>输入框自动聚焦</h2>
    <p>
      你在做一个课程搜索页，输入框希望打开就自动获得焦点，用户不用手动点一下。类似的小需求还有很多：点击输入框外部就关闭下拉、列表项滚动到可视区时淡入、长按时弹出菜单、拖拽某个卡片。这些需求的共同点是——<strong>它们都必须作用在一个具体的真实 DOM 元素上</strong>，读它的属性、调它的方法、给它挂一个原生监听。
    </p>
    <p>
      而这个动作出现得非常频繁。搜索框、评论框、登录表单，五处都要自动聚焦；三个下拉都要「点击外部关闭」。每次都用「拿 <code>ref</code>，在 <code>onMounted</code> 里操作元素」的套路复制一遍，代码会迅速被这类底层细节淹没，而且清理逻辑经常被漏掉。
    </p>

    <h2>组件内模板引用</h2>
    <p>
      最省事的做法：在每个需要聚焦的组件里，声明一个 <code>ref</code>，绑定到输入框，然后在 <code>onMounted</code> 里调用 <code>el.focus()</code>。
    </p>
    <p>
      这个方案做对了一件必要的事：<strong>它直击真实 DOM，没有绕弯</strong>。聚焦、监听、观察尺寸这类操作本来就属于 DOM 层，绕开它反而做不成。只要场景只有一两处，这么写清清楚楚，无可厚非。
    </p>

    <h2>行为逻辑重复代价</h2>
    <ul>
      <li>同一个行为要在多个组件里<strong>重复写一遍</strong>，五处聚焦就是五份几乎一样的代码。</li>
      <li>逻辑散落在各处，规则一改（比如聚焦后还要全选文本）要同步好几处，容易漏。</li>
      <li>涉及事件监听的场景（点击外部关闭），<strong>取消监听的清理逻辑常常被忘掉</strong>，留下内存泄漏和幽灵行为。</li>
      <li>想把它抽成一个普通函数复用，可函数里拿不到那个具体的 <code>el</code>——元素在组件模板里，不在函数手里。</li>
    </ul>

    <h2>自定义指令与元素</h2>
    <p>
      不推翻「直接操作 DOM」，而是给这种行为找一个<strong>能拿到 <code>el</code> 的复用位置</strong>。这就轮到<strong>自定义指令</strong>登场：它直接把逻辑绑在真实 DOM 元素上，在元素挂载时把 <code>el</code> 交给你。
    </p>
    <ol class="lesson-steps">
      <li>定义一个指令对象，在 <code>mounted</code> 钩子里接收绑定到它的 DOM 元素。</li>
      <li>钩子里调用 <code>el.focus()</code>，完成聚焦动作。</li>
      <li>组件模板里用 <code>v-focus</code> 一个词声明这个行为，不再写 <code>ref</code> 与 <code>onMounted</code>。</li>
      <li>把 <code>v-focus</code> 从元素上移除，聚焦行为随之消失，没有残留副作用——这说明它确实和元素绑定在一起。</li>
    </ol>
    <p>
      换个角度理解：组件和组合式函数擅长表达的是<strong>业务状态与 UI 结构</strong>，而指令擅长的是<strong>低层 DOM 行为</strong>。自动聚焦、点击外部关闭、权限显隐、滚动观察、拖拽、长按，这些当业务能落到一个具体 DOM 节点上的需求，用指令比用组件更轻量也更直接。判断的分界线在于：如果你要封装的是「一段视图 + 状态」，用组件；如果只是「给某个元素加一种行为」，用指令。
    </p>
    <div class="lesson-box warn">
      <strong>两条必须守住的纪律：</strong>其一，涉及事件监听的指令，<strong>一定要在 <code>unmounted</code> 里把监听器清理掉</strong>，否则元素被移除后监听仍然挂在那里，既漏内存又可能触发意外逻辑；其二，指令应该<strong>尽量小而专注</strong>，只封装一件 DOM 级的事，别把业务规则也塞进去。
    </div>
    <p>
      指令的参数也会随绑定更新：传给它的 <code>value</code> 以及 <code>v-focus.once</code> 这样的修饰符，都可能在运行时变化，在 <code>updated</code> 钩子里能读到最新的值，于是可以做到「数值变了就重新对齐」「开关变了就启停监听」。这让指令不只是一个一次性动作，而是能响应数据变化的 DOM 行为。
    </p>

    <h2>自动落点与聚焦</h2>
    <figure class="lesson-figure">
      <figcaption>打开页面，光标是否已自动落在搜索框里——<code>v-focus</code> 替你完成了这次 DOM 操作。</figcaption>
      <K17Directive />
    </figure>

    <h2>底层行为与视图分离</h2>
    <p>
      自定义指令把「重复的底层 DOM 行为」从组件里抽出来，用一个可复用的词——比如 <code>v-focus</code>——声明在元素上。它适合落在具体 DOM 节点上的需求：自动聚焦、点击外部关闭、权限显隐、滚动观察、拖拽、长按。但业务状态和 UI 结构仍应交给组件或组合式函数，指令保持小而专注，并在 <code>unmounted</code> 里清理好自己挂上的监听。
    </p>
    <div class="lesson-term">
      <span class="term-name">「自定义指令」</span>是作用在真实 DOM 元素上的复用单元，适合封装自动聚焦、点击外部关闭、权限显隐、滚动观察、拖拽、长按等<strong>低层 DOM 行为</strong>；当需求能落到一个具体 DOM 节点时，它比组件更轻量。使用 <code>mounted</code> 拿到 <code>el</code>，在 <code>updated</code> 里读取最新的 <code>value</code> 与修饰符，并<strong>在 <code>unmounted</code> 中清理事件监听器</strong>。
    </div>
  </LessonArticle>
</template>
