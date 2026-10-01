<script setup lang="ts">
import R09RefDom from './R09RefDom.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>点「聚焦输入框」，光标立刻跳进搜索框、开始闪烁——可界面数据一个字都没变，组件也压根没重新渲染。再点几次「检索」，组件内部有个计数在悄悄往上走，界面同样纹丝不动；直到你把计数拼进反馈文案、用 <code>setResult</code> 更新，屏幕才跟着变一次。
    </div>

    <h2>DOM引用与可变值</h2>
    <p>
      有两类东西，State 装不下。第一类是 <strong>DOM 节点本身</strong>：<code>focus</code>、<code>scrollIntoView</code> 这些都是命令式方法，React 的声明式写法里没有对应的 prop。第二类是「<strong>跨渲染要保留、但变化不该驱动界面</strong>」的可变值——会话计数、定时器 id、上一次的某个值。
    </p>
    <p>
      旧办法的隐藏成本：用 <code>useState</code> 存 DOM 节点，会白白触发重渲染，还带来「第一次渲染时节点根本还不存在」的时序难题；用模块级变量代替组件内状态，组件多实例时会互相串台；在渲染函数体里直接读写这些值，渲染就不再纯粹，StrictMode 下会被放大。所以要回答的是：<strong>能不能拿到一个跨渲染稳定、可以随便改、但改动完全不惊动 React 的盒子？</strong>
    </p>

    <h2>状态保存引用尝试</h2>
    <p>
      最朴素的尝试：干脆用 <code>useState</code> 来存这些东西。
    </p>
    <p>
      这个方案做对了一件事：<strong>值确实跨渲染保留了下来</strong>，你下次渲染还能读到它——「跨渲染」这一半的需求被满足了。
    </p>

    <h2>初始渲染空引用</h2>
    <ul>
      <li>用 state 存 DOM 引用：节点是在提交之后才由 React 写进去的，第一次渲染时它还是 <code>null</code>，想「挂载即聚焦」就不得不再加一个 Effect 绕一圈。</li>
      <li>每改一次计数就触发一次重渲染：<code>submitCountRef</code> 只是内部记录，却让整个组件白渲染一遍，还可能连累子组件。</li>
      <li>改用模块级变量省掉重渲染：同一个组件被渲染到两处时，两个实例共用一个变量，互相串台。</li>
      <li>在渲染函数体里直接写 <code>ref.current = ...</code>：渲染必须是纯的，StrictMode 会把渲染跑两遍，这次写入被放大成两次。</li>
    </ul>

    <h2>非响应式值容器</h2>
    <p>
      用 <code>useRef</code> 提供那个「不参与 React 反应式体系」的盒子。它和 state 最大的不同是：改它的 <code>current</code> 不会惊动 React，因此只适合装不上墙的东西。
    </p>
    <ol class="lesson-steps">
      <li><code>const searchRef = useRef(null)</code>，返回一个跨渲染稳定的对象 <code>{ current: null }</code>。</li>
      <li>把它交给元素：<code>&lt;input ref={searchRef} /&gt;</code>，React 在提交后自动把 <code>current</code> 指向该节点，卸载时置回 <code>null</code>。</li>
      <li>需要时通过 <code>searchRef.current?.focus()</code> 调用原生方法，可选链避免「节点还没挂载」时直接崩掉。</li>
      <li>第二类数据单独放一个 ref：<code>const submitCountRef = useRef(0)</code>，<code>submitCountRef.current += 1</code> 不触发重渲染，正好装「会话级、不参与界面输出」的计数。</li>
      <li>但要显示的东西仍要放回 State：本课里 <code>result</code> 用 <code>useState</code> 保存反馈文案，由它驱动界面更新。判断标准就一条——这个值的变化需不需要反映到屏幕上？</li>
      <li>边界：不要在渲染过程中读写 <code>ref.current</code>（初始化除外）；DOM 命令式操作要保持小而明确，不要拿它绕过 React 去改组件已声明的节点结构。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个反向的常见错误：</strong>把「需要显示的值」放进 ref，改了界面纹丝不动，你会以为渲染坏了；把「只用于逻辑判断的值」塞进 state，则凭空多出重渲染。前者该用 <code>useState</code>，后者才该用 <code>useRef</code>。
    </div>

    <h2>引用静默与状态刷新</h2>
    <figure class="lesson-figure">
      <figcaption>点「聚焦输入框」，光标跳进搜索框却不触发重渲染；连点「检索」，内部计数在涨、反馈文案由 State 更新——Ref 静默，State 会喊人，一次看全。</figcaption>
      <R09RefDom />
    </figure>

    <h2>静默容器适用范围</h2>
    <p>
      <code>useRef</code> 给你一个跨渲染稳定、可随意改写、但完全静默的盒子，用来装 DOM 节点、定时器 id、上次的值这类「不需要上墙」的东西。要不要显示、要不要随变化更新，就是 State 和 Ref 之间那条分界线。
    </p>
    <div class="lesson-term">
      <span class="term-name">「命令式操作（imperative operation）」</span>指直接命令 DOM 去执行某个动作（<code>focus</code>、<code>scrollIntoView</code>、<code>play</code>），与 React 声明式「描述 UI 应该长什么样」相对。边界：它是逃生舱，只用于声明式表达不了的操作，且要小而明确；DOM 引用通过 ref 获得，操作时机应放在提交之后的事件处理器或 Effect 中，不要在渲染期间执行；能用 Props 与 State 表达的，优先声明式解决。
    </div>
  </LessonArticle>
</template>
