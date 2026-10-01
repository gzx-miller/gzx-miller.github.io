<script setup lang="ts">
import R22ForwardRef from './R22ForwardRef.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>报名表里有姓名和邮箱两个输入框，你把它们封装成了自定义组件 <code>&lt;TextInput label="姓名" /&gt;</code>。提交时如果没填，你想让第一个输入框自动聚焦——于是给组件挂上 <code>ref={nameRef}</code>。挂了，可点下提交，<code>nameRef.current</code> 却是 <code>null</code>。ref 明明传进去了，为什么子组件里拿不到它指向的元素？
    </div>

    <h2>数据与引用之别</h2>
    <p>
      先把 ref 和 props 的区别说清楚。props 是<strong>往里灌的数据</strong>：你写 <code>label="姓名"</code>，子组件就收到这个字符串，数据一变，组件重新渲染。ref 不一样，它是一根<strong>指向实例或元素的引用通道</strong>：父组件拿着它，是为了之后<em>主动</em>去够到子组件里的某个真实对象——比如那个 DOM 输入框；它本身的变化并不会触发谁重新渲染。两者语义完全不同。
    </p>
    <p>
      问题出在：函数组件默认<strong>不接收 <code>ref</code> 这个 prop</strong>。你写成 <code>&lt;TextInput ref={nameRef} /&gt;</code>，React 会把这个 ref 当成一个特殊属性收走，不会像普通 props 那样交给你的组件函数；组件自己不声明、也不往下传，<code>nameRef.current</code> 自然一直是 <code>null</code>。
    </p>
    <p>
      于是又回到三种偷懒做法，各自都有要人盯着的成本。其一，<strong>让父组件自己渲染 <code>&lt;input&gt;</code></strong>：聚焦是能做到了，可 label、布局、样式这些重复代码全砸回父组件，封装白做了；其二，<strong>用 props 传一个 <code>onRefReady</code> 回调</strong>，让子组件在挂载后用 Effect 把 DOM 节点回传给父组件——引进了时序问题（首次渲染时回调还没跑），还得额外管理「传过一次就别重复传」；其三，<strong>用 props 传「请聚焦」标志</strong>，一样是给一次性的命令假装一个数据属性。
    </p>
    <p>
      所以要回答的是：<strong>能不能让一个自定义组件既保留自己的封装，又把这个「指向内部元素」的引用，顺顺当当地交到父组件手上？</strong>
    </p>

    <h2>包裹式引用转发</h2>
    <p>
      最朴素也真的能跑的做法：用 <code>forwardRef</code> 把这个组件包一层，然后把它收到的 ref 直接接到内部的真实元素上——<code>const TextInput = forwardRef(function TextInput(props, ref) { ... return &lt;input ref={ref} {...props} /&gt; })</code>。父组件于是能 <code>nameRef.current.focus()</code>、读 <code>nameRef.current.value</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它点明了「ref 需要被显式转发」</strong>。包裹之后，第二个参数就是外部传进来的那根引用；你把它接到哪个元素，父组件就够到哪个元素。
    </p>

    <h2>未包裹则失效</h2>
    <ul>
      <li>不包裹 <code>forwardRef</code> 就把 ref 写上去：ref 被 React 截走，组件函数收不到它，<code>nameRef.current</code> 永远是 <code>null</code>——你会误以为是自己的 <code>useRef</code> 写错了。</li>
      <li>把 ref 转发到最底层的 <code>&lt;input&gt;</code> 后，父组件拿到的是整个 DOM 元素，能随意写 <code>.value</code>、改 <code>className</code>，绕过受控逻辑，让 DOM 和组件 state 对不上。</li>
      <li>多包一层就断链：<code>TextInput</code> 里再套一个 <code>FieldWrapper</code> 时，每一层都得记得转发一次 ref，漏掉任何一层，父组件拿到的就是 <code>null</code>。</li>
      <li>把 ref 当「第二个 props」用来传自定义数据：会让「引用通道」和「输入数据」两套语义混在一起，之后谁都说不清某个值变化到底该不该触发重渲染。</li>
      <li>直接 <code>nameRef.current.value</code> 读值、写值：读的是 DOM 上的当前值，而不是组件里那份受控 state，一旦两者不同步就会出现「界面显示的和提交的不一致」。</li>
    </ul>

    <h2>独立转发链路</h2>
    <p>
      不推翻「ref 要转发」，而是把它做成一套明确的规则：<strong>ref 是引用，不是数据；它该走一条专门的转发链，而不是混进 props 里。</strong>
    </p>
    <ol class="lesson-steps">
      <li>用 <code>forwardRef</code> 包裹组件，把第二个参数命名为 <code>ref</code>——这就是父组件那根引用。</li>
      <li>在组件内部决定它接到哪：想暴露真实 DOM 节点就用 <code>&lt;input ref={ref} /&gt;</code>；想只暴露方法，就交给 <code>useImperativeHandle</code> 换成自定义对象。</li>
      <li>父组件挂载后即可 <code>nameRef.current.focus()</code>；提交时经 <code>ref.current.value</code> 读值，重置时直接清空 DOM。</li>
      <li>多层组件链时，<strong>每一层都转发一步</strong>，像接力棒一样把 ref 送到最终元素。</li>
      <li>React 19 起，ref 可以像普通 prop 一样被函数组件直接接收——写 <code>function TextInput({ label, ref })</code> 即可，不再强制 <code>forwardRef</code>；<code>forwardRef</code> 仍是兼容旧代码的稳妥写法。</li>
    </ol>
    <p>
      回过头看 props 与 ref 的分工就清楚了：<code>label</code>、<code>placeholder</code> 是数据，走 props，变一次就重渲染一次；ref 是引用，走转发链，父组件主动去够，够到了做什么、什么时候做，由父组件指挥，它本身从不惊动渲染。认清这条分界，就不会再把 ref 塞进 props 里当数据用。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的点：</strong>只转发到 DOM 节点时，父组件对子组件<strong>内部实现的依赖并没有消失</strong>——子组件把 <code>&lt;input&gt;</code> 换掉，父组件的 <code>.focus()</code> 就可能失效；想彻底隔离，就把两者配合起来，用 <code>useImperativeHandle</code> 只暴露意图明确的方法。另外，受控组件里别用 <code>ref.current.value</code> 去写值，那不会触发 <code>onChange</code>，会让 DOM 与 state 脱节。
    </div>

    <h2>焦点回送验证</h2>
    <figure class="lesson-figure">
      <figcaption>在「姓名 / 邮箱」两个自定义输入框里试试：什么都不填直接点「提交」，看父组件用 <code>nameRef</code> 把焦点送回第一个框；填好提交后点「重置」，两个框被清空并重新聚焦——全程父组件只拿着 ref，不碰子组件内部。</figcaption>
      <R22ForwardRef />
    </figure>

    <h2>显式接力通道</h2>
    <p>
      ref 默认交给宿主元素，自定义函数组件却不会自动接住它——<code>forwardRef</code> 就是那条显式的接力通道，把外层引用一步步送到你指定的内部对象上。记住 props 送的是数据、ref 送的是引用：数据变化驱动渲染，引用只供父组件主动去够。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Ref 转发（ref forwarding）」</span>指用 <code>forwardRef</code> 包裹自定义组件，把外部传入的 ref 作为第二个参数接收，再转发给它内部的 DOM 节点（或用 <code>useImperativeHandle</code> 转发成自定义句柄）。边界：ref 不会被函数组件自动接收，不转发就一直是 <code>null</code>；跨多层组件链时每一层都要转发一步；它适合聚焦、测量、与第三方库集成这类必须直接操作元素的场景，若只转发 DOM 节点，父组件对子组件实现的依赖依旧存在；React 19 中 ref 可作普通 prop 直接接收，<code>forwardRef</code> 用于兼容旧写法。
    </div>
  </LessonArticle>
</template>
