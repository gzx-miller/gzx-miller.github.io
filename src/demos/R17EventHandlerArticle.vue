<script setup lang="ts">
import R17EventHandler from './R17EventHandler.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>搜索框里填好关键词，你按下回车「提交一下」，页面却整个闪了一下重新加载，列表被清空、刚才的筛选也没了——只是提交一个表单，浏览器凭什么把整页都重来一遍？
    </div>

    <h2>表单默认提交的意外</h2>
    <p>
      你在做一个纯前端驱动的搜索：输入关键词、点「提交」，结果区域随之更新。可真实跑起来，第一次提交就把你打回原形——页面刷新回到初始状态。<strong>这是 <code>form</code> 提交的浏览器默认行为：它本来就要导航到一个新地址，在单页应用里，等于把整个界面带走了。</strong>
    </p>
    <p>
      顺着往下想，你会发现还有几件事需要被统一。事件本身的信息（是谁触发的、触发类型是什么、目标元素是哪个）在不同浏览器里字段名和取值并不完全一致；给页面上成百上千个可交互元素逐一挂监听器、再逐一清理，是一笔持续要人看管的开销；一旦事件处理器里还要访问组件状态，绑定 <code>this</code> 的麻烦又会冒出来。这些成本原本都得由写业务的人承担。
    </p>
    <p>
      于是问题清楚了：<strong>如何可靠地拿到一份统一的事件信息、拿到后能干净地阻止默认行为，同时不必为每个元素手工挂事件？</strong>
    </p>

    <h2>默认行为的拦截</h2>
    <p>
      最直接的一步是在提交处理器里拦下默认行为：<code>function handleSubmit(e) { e.preventDefault(); /* 自己驱动界面更新 */ }</code>，把刷新这件事从浏览器手里拿走，交给业务逻辑。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它抓住了问题的核心——表单提交的默认动作是可以被「拒绝」的</strong>，一旦拦住，后续就完全由组件状态说了算。同时你也能从事件对象里读出 <code>type</code>、<code>target</code> 这些基本信息。
    </p>

    <h2>浏览器字段的差异</h2>
    <ul>
      <li>直接面向原生事件时，字段是<strong>按浏览器各异</strong>的：判断目标元素有的用 <code>target</code>、有的得退到 <code>srcElement</code>，按键信息在 <code>keyCode</code> 与 <code>key</code> 之间也不统一，你得自己写兼容分支。</li>
      <li>类组件里把方法直接当处理器用，<code>this</code> 会是 <code>undefined</code>，必须记得在构造函数里 <code>bind</code>，漏一次就在运行时炸。</li>
      <li>监听器要自己挂、自己清：组件卸载时忘掉一次，就是内存泄漏，或者对已卸载组件更新。</li>
      <li>若要给列表里每一个元素分别 <code>addEventListener</code>，元素一多，绑定与回收的开销都随规模增长。</li>
    </ul>

    <h2>合成事件的统一外壳</h2>
    <p>
      不推翻「事件处理器 + 阻止默认」，而是给事件包一层统一的外壳。<strong>React 提供合成事件对象（SyntheticEvent）</strong>，它是浏览器原生事件的跨浏览器封装：你在处理器里拿到的 <code>event</code>，<code>type</code>、<code>target</code>、<code>key</code> 等字段都按统一接口给出，不必再写兼容分支；真要触达原生对象时用 <code>event.nativeEvent</code>，但大多数场景合成事件已经够用。
    </p>
    <ol class="lesson-steps">
      <li>点击与输入：通过合成事件对象读取事件类型和触发目标，例如 <code>event.type</code>、<code>event.target.tagName</code>、<code>event.target.value</code>。</li>
      <li>表单提交：在 <code>onSubmit</code> 里调用 <code>preventDefault()</code> 阻止浏览器刷新，改由提交处理器驱动状态更新。</li>
      <li>键盘事件：用 <code>event.key === 'Enter'</code> 这类判断过滤特定按键，比如回车才记录一次搜索。</li>
      <li>核对来源：把 <code>event.type</code> 与 <code>event.target</code> 打出来，确认事件确实来自你预期的元素。</li>
    </ol>
    <p>
      分发方式也一并变了。从 React 17 起，事件不再是挂到 <code>document</code> 上，而是<strong>委托到 React 根容器统一分发</strong>：你写在 JSX 上的 <code>onClick</code>、<code>onChange</code> 只是声明「这里关心这个事件」，真正的监听器由 React 在根节点统一管理，所以不必担心为大量元素逐个绑定。<strong>又因为函数组件用闭包直接访问状态</strong>，处理器里读写 state 天然就是最新的，<code>this</code> 绑定的历史包袱也不用再背。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误会：</strong>早期 React 会对事件对象做「池化」复用，读取前要调用 <code>persist()</code>——<strong>这一点早已取消</strong>，如今在异步回调里读 <code>event</code> 字段是安全的，不必再 persist；另外，把表单包进 <code>form</code>、按钮设成 <code>type="submit"</code>，默认提交行为依然存在，想不刷新就必须自己 <code>preventDefault()</code>。
    </div>

    <h2>阻止默认后的表现</h2>
    <figure class="lesson-figure">
      <figcaption>切到「阻止默认」页签提交表单，看页面不再刷新、就地出现提交成功的提示；再切回「基础事件」，点按钮或在输入框里敲字、按回车，观察日志里的 <code>event.type</code> 与 <code>event.target</code>。</figcaption>
      <R17EventHandler />
    </figure>

    <h2>事件差异的统一处理</h2>
    <p>
      事件处理的要害有两处：一是别让表单的默认提交把页面带走，<code>preventDefault()</code> 把主动权交回组件；二是别自己跟浏览器差异和监听器生命周期较劲，<strong>用 React 的合成事件统一读取、交给根容器统一分发</strong>。处理器越短越好，复杂的逻辑拆成独立函数。
    </p>
    <div class="lesson-term">
      <span class="term-name">「合成事件（SyntheticEvent）」</span>是 React 对浏览器原生事件的跨浏览器封装对象，统一了 <code>type</code>、<code>target</code>、<code>key</code> 等字段，并负责事件委托（React 17 起挂载到根容器而非 <code>document</code>）。边界与例外：出于性能的「事件池」机制已废除，无需再调用 <code>persist()</code>，异步读取字段也安全；需要原生对象时用 <code>event.nativeEvent</code>，但多数场景用不到。
    </div>
  </LessonArticle>
</template>
