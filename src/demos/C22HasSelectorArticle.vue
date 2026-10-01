<script setup lang="ts">
import C22HasSelector from './C22HasSelector.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>表单里第二个输入框填错了，你希望外层整块变成红框——可 CSS 只能顺着 DOM 往下选，父元素要怎么写，才能知道「我的孩子出错了」？
    </div>

    <h2>提出问题</h2>
    <p>
      设想你在做一个注册表单。需求有几条：只要有任意一个输入框报错，整个表单容器就标红、加浅红底；输入框的包装层在获得焦点时要亮起一圈描边；卡片列表里，带封面图的卡片走「左图右文」布局，不带图的只留文字；另外，「后面紧跟一个副标题」的主标题要收窄下边距。
    </p>
    <p>
      这些需求的共同点是：<strong>要改变的样式挂在外层元素上，判断依据却在内部或相邻元素身上</strong>——父容器得知道孩子出错了、孩子被聚焦了、以及自己身后有没有兄弟。而传统 CSS 选择器只能从父往子、从前向后选，<strong>根本没有「选中所有包含犯错孩子的父元素」这种写法</strong>。于是每加一条规则，就要在脚本和样式之间再加一次同步，成本会随着表单字段一起增长。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法是回到 JavaScript：用校验逻辑判断有没有错误，再给表单容器 <code>toggle</code> 一个 <code>form--error</code> 类，CSS 只负责给这个类上色。
    </p>
    <p>
      它做对了一件实事：<strong>这条路真的能跑通，而且至今仍是处理复杂状态时最直接的方案</strong>。当状态本来就是你自己的数据（比如接口返回的字段错误），用脚本显式表达出来反而更清晰，调试时也能一眼看到类名是什么时候加上的。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>每个「外层随内层变化」的需求都要单独写一遍监听与类切换，逻辑越堆越多。</li>
      <li>状态来自 <code>:checked</code>、<code>:focus</code>、<code>:hover</code> 这类纯 CSS 伪类时，脚本也得把它们全部模拟一遍，否则样式跟不上。</li>
      <li>判断逻辑散落在脚本里，新增一个表单字段就可能漏掉一处同步。</li>
      <li>服务端渲染时脚本还没执行，首屏会先出现「没有错误态」的默认外观，然后闪一下。</li>
      <li>组件库通常不给「按子元素反选父级」的能力，最终还是得自己加类。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      换一个角度：如果选择器本身就能表达「包含某个孩子」这个条件，上面那些同步逻辑就都不需要了。这正是 <code>:has()</code> 提供的<strong>父元素选择</strong>能力——它写在条件位置，描述当前元素「里面有什么」。
    </p>
    <p>
      回到表单：<code>.form:has(.error)</code> 的意思是「内部含有 <code>.error</code> 元素的表单」，它直接命中外层容器，一行 CSS 就能把标红这件事交还给样式表：
    </p>
    <p>
      <code>.form:has(.error) { border-color: #fa5252; background: #fff5f5; }</code>
    </p>
    <p>
      <strong>脚本里那套「判断 + toggle 类名」的代码，整段可以删掉</strong>，并且服务端渲染出来的首屏就是正确的外观，不会再有切换时的闪烁。
    </p>
    <p>
      状态类的需求同样如此。复选框的选中态不必再由脚本同步到父元素上，直接让标签去观察它内部的输入框：<code>.label:has(input:checked) { background: #e8590c; color: #fff; }</code>。同理，输入框获得焦点时高亮整个包装层，只写 <code>.input-wrapper:has(input:focus)</code>；要给必填字段加星号，可以写 <code>.form-group:has([required]) label::after { content: ' *'; }</code>——注意这里用的是属性选择器 <code>[required]</code>，判断的是子元素有没有这个属性，与它的值是空、是 <code>true</code> 还是别的都没有关系。
    </p>
    <p>
      布局分支也可以交给选择器：<code>.article-card:has(img)</code> 只给带图的卡片套上「左图右文」的网格，不带图的卡片自然保持默认排版。想反过来——只处理没有图片的卡片——把 <code>:has()</code> 放进 <code>:not()</code> 里即可：<code>.card:not(:has(img)) { padding: 16px; }</code>。
    </p>
    <p>
      还有一个反直觉但很好用的用法：<code>:has()</code> 能选中<strong>后面紧跟着某个兄弟</strong>的元素，也就是「往前选」。比如让有副标题的主标题收窄下边距：<code>.title:has(+ .subtitle) { margin-bottom: 4px; }</code>。它的含义是「后面紧跟一个 <code>.subtitle</code> 的 <code>.title</code>」。过去这类需求要么给标题额外加类，要么用 <code>:last-of-type</code> 绕，现在一条选择器就说清了。
    </p>
    <div class="lesson-box warn">
      使用时记住三点。<strong>第一，<code>:has()</code> 已在主流浏览器获得基线支持</strong>（2023 年起），可以放心用在现代项目里。<strong>第二，它支持与 <code>:not()</code> 以及相邻兄弟组合器搭配</strong>，但这类选择器相对昂贵，别大面积嵌套叠加，尤其不要用在长列表的每一个子项上。<strong>第三，样式一旦依赖 DOM 结构，结构变化时就要同步检查 <code>:has()</code> 的条件</strong>——把图片删掉、把副标题改名，都可能让匹配悄悄失效，而且不会报任何错误。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点「启用 :has() 高亮」，看含错误徽章的卡片如何被自动挑出来。</figcaption>
      <C22HasSelector />
    </figure>

    <h2>总结</h2>
    <p>
      <code>:has()</code> 补上了 CSS 一直缺的那半截能力：让选择器从「往下、往后选」变成「能看见自己内部与身后」。它把「父级随子级状态变化」这件事从脚本手里交还给样式表——表单错误态、选中态、聚焦态、有无图片的布局分支、以及向前选兄弟，都可以用一条选择器加一个条件写完，页面与样式之间那层同步代码随之消失。
    </p>
    <div class="lesson-term">
      <span class="term-name">「:has() 选择器」</span>是一个<strong>父元素 / 关系选择器</strong>：它把「当前元素内部是否含有符合条件的元素」写成匹配条件，例如 <code>.form:has(.error)</code> 命中所有含错误提示的表单容器，<code>.label:has(input:checked)</code> 命中含有被选中复选框的标签。它还能与 <code>:not()</code> 组合成 <code>.card:not(:has(img))</code>，以及用 <code>.title:has(+ .subtitle)</code> 选中后面紧跟副标题的标题。
    </div>
  </LessonArticle>
</template>
