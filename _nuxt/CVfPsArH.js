const n=`<script setup lang="ts">
import R18ConditionalRender from './R18ConditionalRender.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>折扣区一直用 <code>{count &amp;&amp; &lt;Discount /&gt;}</code> 控制，跑了大半年都好好的；直到某次活动把 <code>count</code> 设成了 <code>0</code>，页面角落凭空多出一个孤零零的「0」——条件明明是假的，这个 0 究竟是谁渲染上去的？
    </div>

    <h2>条件渲染表达式化</h2>
    <p>
      你在给课程页加一块折扣提示：有时展示、有时不展示。<strong>React 里偏偏没有 <code>v-if</code> 这类模板指令</strong>，JSX 本身只是 JavaScript 的语法糖，所以「显不显示」这件事，最后必须落成一个普通的 JS 表达式。而 JSX 又会<strong>把表达式求出来的值直接当作要渲染的内容</strong>——这一点是理解后面所有坑的钥匙。
    </p>
    <p>
      旧的写法往往带来两笔隐藏成本。其一，<code>if/else</code> 是<strong>语句</strong>而不是表达式，没法直接塞进 JSX，于是你要么把整块结构复制两份、要么把布局拆得七零八落。其二，页面上一堆「可选内容」如果各写各的开关，很快就会演变成到处是布尔 prop 和一串嵌套条件，读起来像在解谜。
    </p>
    <p>
      于是问题清楚了：<strong>没有模板指令的情况下，用什么样的表达式写条件分支，既能让写法统一，又不会让不该显示的东西漏出来？</strong>
    </p>

    <h2>逻辑与返回规则</h2>
    <p>
      最省事的一招是逻辑与：<code>{showDiscount &amp;&amp; &lt;Discount /&gt;}</code>。左边为真，就返回并渲染右边那个元素；左边为假，整个表达式就等于左边这个假值，而 React 会<strong>忽略 <code>false</code>、<code>null</code>、<code>undefined</code></strong>，于是什么都不渲染。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它证明了条件渲染根本不需要新语法</strong>，一个 <code>&amp;&amp;</code> 就能表达「满足才显示」。只要左侧真的是布尔，它既简洁又直观。
    </p>

    <h2>假值忽略与零值渲染</h2>
    <ul>
      <li>当左侧是数字 <code>0</code> 时，<code>{0 &amp;&amp; &lt;Discount /&gt;}</code> 求值为 <code>0</code>，而 <strong><code>0</code> 并不在那三个被忽略的值里</strong>，于是页面上实打实渲染出一个「0」——正是开场那一幕。</li>
      <li>同理，左侧是空字符串时会渲染出一个空文本节点，可能在布局里撑出一段看不见的间隙。</li>
      <li>多个分支用三元硬套，会写成 <code>a ? &lt;A /&gt; : b ? &lt;B /&gt; : c ? &lt;C /&gt; : null</code> 这样的嵌套链，读两遍才能对上号。</li>
      <li><code>if/else</code> 是语句，直接放进 JSX 会报错，只能被迫在外面先算好变量，或复制整段结构。</li>
    </ul>

    <h2>布尔判据显式转换</h2>
    <p>
      先给 <code>&amp;&amp;</code> 补一条判据：<strong>左侧必须是真正的布尔</strong>。「数量」这类可能为 <code>0</code> 的值，要么显式写成 <code>{count &gt; 0 &amp;&amp; ...}</code>，要么干脆改用别的写法——问题从来不是 <code>&amp;&amp;</code> 错，而是你把一个「数值」当成「真假」用了。
    </p>
    <p>
      接着补上「二选一」这一层。当两条分支都要出现、且彼此对立，用三元运算符最清楚：<code>{selected ? &lt;CourseDetail /&gt; : &lt;CourseList /&gt;}</code>，一眼能看出「有选中看详情、没选中看列表」。
    </p>
    <p>
      再补上「分支在组件内部」这一层。如果某个分支之后剩下的逻辑还很多，写在 JSX 里的三元会越缩越深，这时更合适的是<strong>提前返回</strong>：在组件函数体最前面写一句 <code>if (!course) return null</code>，把无效情况就地处理掉，后面就是一条平坦的主干，再也不用为每段 JSX 套一层条件。
    </p>
    <ol class="lesson-steps">
      <li>折扣区域用 <code>&amp;&amp;</code> 控制：<code>showDiscount</code> 为 <code>false</code> 时不渲染任何内容。</li>
      <li><code>selected</code> 用三元运算符在课程列表与详情之间二选一渲染。</li>
      <li><code>CourseDetail</code> 内部用提前返回：没传课程时直接 <code>return null</code>。</li>
      <li>把条件改成可能为 <code>0</code> 的数值，亲自验证渲染结果里冒出来的那个 0。</li>
    </ol>
    <p>
      最后收一下结构：分支一多、或多个条件彼此互斥，就把它们<strong>拆成独立的子组件</strong>，让每个组件只负责一种形态，而不是把一长串三元堆在一个函数里。用哪种写法由可读性决定，本来就没有唯一的标准答案。
    </p>

    <h2>三种条件渲染对照</h2>
    <figure class="lesson-figure">
      <figcaption>点「显示折扣」看 <code>&amp;&amp;</code> 控制的面板出现与消失；再点任意一门课程，列表与详情由三元二选一切换，进入详情后由组件内部的提前返回兜住无课程的情况。</figcaption>
      <R18ConditionalRender />
    </figure>

    <h2>显示逻辑交给表达式</h2>
    <p>
      条件渲染的本质，是把「显不显示」交给一个 JS 表达式：<code>&amp;&amp;</code> 用于「满足才显示」，三元用于「二选一」，分支留在组件内部且后面还长时就提前返回。写的时候盯紧一件事——<strong>表达式求出来的值会被真的渲染出来</strong>，所以别让 <code>0</code> 这种假值混进「不渲染」的位置。
    </p>
    <div class="lesson-term">
      <span class="term-name">「提前返回（Early Return）」</span>指在组件函数体的开头用 <code>if</code> 处理掉无效或特殊情形并直接 <code>return</code>（常配 <code>return null</code> 表示不渲染任何内容），使其后的 JSX 保持单一主干。边界与例外：它只能写在组件函数体里，无法嵌进某一段 JSX 的中间；<code>return null</code> 只是渲染为空，组件仍会挂载并执行其中的 Hook。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
