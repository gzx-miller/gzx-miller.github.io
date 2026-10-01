<script setup lang="ts">
import R21ImperativeHandle from './R21ImperativeHandle.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>搜索页上有个「清空并聚焦」按钮，点它，输入框里的字被清掉、光标同时跳进去——可这个按钮长在父组件里，输入框却是子组件 <code>&lt;SearchInput /&gt;</code> 渲染的。父组件要按自己的时机命令子组件「聚焦、清空、把当前值报回来」，这份控制权是怎么跨过组件边界的？
    </div>

    <h2>提出问题</h2>
    <p>
      父组件常常需要对外层包着的子组件做几件很具体的事：让里面的输入框获得焦点、把内容清空、把当前输入读出来。这些动作有一个共同点——它们都是<strong>命令式</strong>的：不是「输入框此刻应该显示什么」，而是「现在去执行某个动作」。声明式的 props 擅长描述前者，描述后者就很别扭。
    </p>
    <p>
      如果放任不管，几乎一定会滑向三个做法，每个都要人兜底。第一种是<strong>把 ref 直接透传到底层元素</strong>：父组件拿到整个 <code>&lt;input&gt;</code> 节点，看似什么都能干；第二种是<strong>用 props 传「请求标志」</strong>，比如父组件塞一个 <code>shouldFocus</code> 布尔值，子组件再用一个 Effect 监听它去聚焦，用一次就得配一个标志加一段 Effect；第三种是<strong>干脆让父组件自己渲染输入框</strong>，子组件的封装和复用就此作废。
    </p>
    <p>
      三种做法都得由人小心维护：透传会让子组件的内部结构变成父组件的依赖，标志位方案要维护一堆「一次性请求」的清理逻辑。所以要回答的是：<strong>能不能给父组件一个只暴露必要动作的「遥控器」，而不是把整间屋子都交出去？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的一步：让子组件把外部传进来的 ref 直接交给内部那个输入框——<code>&lt;input ref={inputRef} /&gt;</code>。父组件于是可以写 <code>searchRef.current.focus()</code>，光标应声落进搜索框。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认「聚焦、清空、读取」这些动作确实需要一条跨组件的引用通道</strong>。声明式写法里没有 <code>focus</code> 这种 prop，只有先把底层元素交出去，父组件才够得着。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>父组件拿到的是整个 <code>HTMLInputElement</code>：它可以随手写 <code>searchRef.current.value = 'x'</code>，绕过受控组件的 <code>onChange</code>，于是 DOM 上的值和组件里的 state 当场对不上。</li>
      <li>子组件的结构只要动一下——把 <code>&lt;input&gt;</code> 换成 <code>&lt;textarea&gt;</code>、或多包一层容器——父组件的 <code>searchRef.current.focus()</code> 就可能在运行时报错，父组件被迫盯着子组件的实现细节。</li>
      <li>子组件内部有受控状态（这里的 <code>query</code>），父组件读到的却只是 DOM 节点上的值，读不到组件逻辑里真正的那一份状态。</li>
      <li>「暴露整个节点」等于让封装失效：子组件不再是黑盒，谁都能改它的任何属性，复用与重构都被绑住。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「用 ref 建一条通道」，而是换掉<strong>交给父组件的东西</strong>：不再给整个 DOM 节点，而是一个只含几个方法的<strong>自定义对象</strong>。<code>useImperativeHandle</code> 干的就是这件事——它把 ref 的指向从「内部元素」重定向成「你定义的对象」。
    </p>
    <ol class="lesson-steps">
      <li>子组件照常接收外部 ref（<code>forwardRef</code> 的第二个参数；React 19 里也可以直接当普通 prop 收）。</li>
      <li>组件内部另开一个 <code>inputRef</code> 指向真正的 <code>&lt;input&gt;</code>，外部那个 ref 不再直接挂到 DOM 上。</li>
      <li>用 <code>useImperativeHandle(ref, () =&gt; ({ focus, clear, getValue }))</code> 返回一个对象，里面只放三个方法。</li>
      <li>三个方法各自封装内部细节：<code>focus</code> 调 <code>inputRef.current?.focus()</code>，<code>clear</code> 先执行 <code>setQuery('')</code> 再聚焦，<code>getValue</code> 返回组件里的 <code>query</code>。</li>
      <li>父组件只能写 <code>searchRef.current.focus()</code> 这类调用；去读 <code>searchRef.current.value</code> 只会得到 <code>undefined</code>——因为根本没暴露它。</li>
    </ol>
    <p>
      这一步的收益是<strong>把「能做什么」和「怎么实现」分开</strong>：父组件看到的是 focus / clear / getValue 三个人话方法，子组件内部怎么用一个 ref 去够到 input、怎么同步状态，全是它自己的事。内部结构换了，只要这三个方法还在，父组件一行都不用改。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong><code>useImperativeHandle</code> 的工厂函数每次渲染都会执行，但它返回的对象应当是稳定的——不要在里面临时塞进随渲染变化的值，否则会给父组件造成无谓的引用变化。另外，命令式接口是<strong>最后手段</strong>：能用 props 和 state 声明式表达的需求（比如「显示当前值」），优先用声明式，别为了图方便什么都往 ref 上挂。
    </div>
    <div class="lesson-box hint">
      <strong>别忘了 React 19 的变化：</strong>ref 现在可以像普通 prop 一样被函数组件直接接收，写 <code>function SearchInput({ ref })</code> 也成立，不再是 <code>forwardRef</code> 的专属能力；但无论哪种写法，「限定暴露哪些方法」这件事始终由 <code>useImperativeHandle</code> 负责。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在搜索框里随便输点字，然后只用三个按钮驱动它：「聚焦搜索框」让光标跳进去，「清空并聚焦」清掉内容再聚焦，「读取当前值」把子组件里的 <code>query</code> 取出来显示——父组件全程碰不到那个 input 节点。</figcaption>
      <R21ImperativeHandle />
    </figure>

    <h2>总结</h2>
    <p>
      当父组件要「命令」子组件做某件事时，别把整个内部元素交出去，交给它一个只含必要动作的句柄。<code>useImperativeHandle</code> 把 ref 从 DOM 节点重定向成自定义对象，父组件能调的方法就是子组件愿意暴露的那几个——通道里流的是能力，不是实现。
    </p>
    <div class="lesson-term">
      <span class="term-name">「命令式句柄（imperative handle）」</span>指用 <code>useImperativeHandle(ref, factory)</code> 挂到 ref 上的自定义对象，它替代了默认指向的 DOM 节点，只暴露 <code>focus</code>、<code>clear</code> 这类按意图命名的方法。边界：工厂函数返回的应是稳定对象，方法名以使用意图为准、不要泄露内部结构；它只用于声明式表达不了的命令式操作，是最后手段；React 19 中 ref 可作函数组件普通 prop 直接接收，但限定暴露内容仍靠它。
    </div>
  </LessonArticle>
</template>
