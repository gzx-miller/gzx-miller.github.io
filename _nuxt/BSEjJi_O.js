const e=`<script setup lang="ts">
import K03Reactivity from './K03Reactivity.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我明明把变量改掉了，页面却纹丝不动——数据变化到底是怎么被「听见」，又是在什么时候变成新界面的？
    </div>

    <h2>数据界面同步需求</h2>
    <p>
      做一个学习进度页：显示用户名字、已经完成的章节数量，以及当前所处阶段。点一下「完成一章」，章节数加一，当数字超过某个门槛时，阶段文案从「初级前端」变成「Vue3 熟练者」。
    </p>
    <p>
      这件事的数据侧其实很朴素：一个数字，一个字符串。真正的问题是<strong>数据变了以后，屏幕怎么知道</strong>。在过去的写法里，这两者之间没有连线，你得亲手去搭。
    </p>

    <h2>手动同步与更新</h2>
    <p>
      最直接的做法：把数据存进普通变量，每次修改之后，紧接着手动去更新页面上的对应元素——先写 <code>count += 1</code>，再找到页面里那个数字节点把它改掉；阶段变了，就再找文案节点改一遍。
    </p>
    <p>
      这个方案做对了一件重要的事：<strong>它承认「界面是数据的投影」</strong>，数据是唯一要维护的源头，界面只是它的显示结果。只要「数据一改就立刻刷新界面」这条规则能被严格执行，页面就永远是对的。问题在于，人很难严格执行这条规则。
    </p>

    <h2>遗漏同步与过期视图</h2>
    <ul>
      <li>每改一个字段就要记得补一次 DOM 更新，漏掉一处，界面上就留一个过期的数字。</li>
      <li>阶段文案是由数量推导出来的，写在更新逻辑里等于把「派生关系」藏进了一堆命令式代码。</li>
      <li>数据结构一旦变成嵌套对象，手动「找到对应节点再改」的路径会越来越长。</li>
      <li>同一个数据被多个地方引用时，你得在两个地方同时改，稍不留神就出现两份不一致的真相。</li>
    </ul>

    <h2>响应式容器包裹</h2>
    <p>
      不推翻「数据是源头」，只是把「改完记得刷新」这条纪律，交给框架来执行。做法是：不再用普通变量，而是用一个<strong>能被追踪的容器</strong>包住数据。Vue 提供了两种容器，对应两种数据形态。
    </p>
    <p>
      第一种是 <code>ref</code>：它把<strong>单个值</strong>包装成一个响应式引用。第二种是 <code>reactive</code>：它把<strong>一个对象</strong>转换成响应式代理，对象的每个属性都会被追踪。放进容器之后，事情就反转了——你只管改数据，界面会自动跟上。
    </p>
    <p>
      原理并不复杂：模板在读取这些状态时，Vue 会<strong>自动追踪依赖</strong>，记下「这块视图用到了哪些数据」；状态一变，依赖它的视图就重新渲染。你改的是数据，更新的是视图，中间那条线由框架负责维护。
    </p>
    <p>
      接着要记住两者各自的规矩。<strong>在 script 里读写 <code>ref</code> 必须使用 <code>.value</code>，而在模板中会自动解包</strong>——因为模板里那句表达式是由编译器处理的，它知道这是引用。这条差异是初学者最容易踩的坑：同一个值，在代码里要加后缀，在模板里不用。
    </p>
    <p>
      然后是 <code>reactive</code> 的三个局限，它们决定了你该怎么选：
    </p>
    <ul>
      <li><strong>不能整体替换</strong>：直接给变量赋一个新对象会切断响应式连接，视图不再更新；应逐个属性修改，或使用 <code>Object.assign</code> 合并。</li>
      <li><strong>不能用于原始类型</strong>：数字、字符串这类单值只能用 <code>ref</code>。</li>
      <li><strong>解构会丢失响应式</strong>：普通解构拿到的只是一次性的值，需要解构又想保留响应式时，用 <code>toRefs</code> 把属性转成 ref。</li>
    </ul>
    <p>
      有了这些边界，选择口径就很清楚了：<strong>单个原始值优先用 <code>ref</code>，结构化对象优先用 <code>reactive</code>，或者拆成多个 <code>ref</code></strong>——最终按可读性决定。表单类对象适合整体用 <code>reactive</code> 组织；零散的状态用一个个 <code>ref</code> 更直观。
    </p>
    <div class="lesson-box warn">
      <strong>验证一次这个坑：</strong>把 <code>reactive</code> 对象整体重新赋值（比如 <code>profile = newProfile</code>），你会发现视图不再跟着变——响应式连接断在了赋值那一刻。正确做法是<strong>改属性而不是换对象</strong>，或直接用 <code>Object.assign</code> 把新值合并进去。
    </div>
    <ol class="lesson-steps">
      <li>用 <code>ref</code> 保存章节数量，用 <code>reactive</code> 保存用户资料这类对象状态。</li>
      <li>点击按钮时修改 <code>count.value</code> 和 <code>profile.level</code>。</li>
      <li>模板读取这两个状态，Vue 自动把最新状态同步到页面。</li>
      <li>给 reactive 对象整体重新赋值，观察响应式丢失导致视图不再更新。</li>
    </ol>

    <h2>数字与文案联动</h2>
    <figure class="lesson-figure">
      <figcaption>连点「完成一章」，看数字与阶段文案如何随状态自动更新。</figcaption>
      <K03Reactivity />
    </figure>

    <h2>依赖追踪与重渲染</h2>
    <p>
      响应式的本质，是把「数据变 → 界面变」这条纪律从人手里交给框架：用 <code>ref</code> 包住单值、用 <code>reactive</code> 包住对象，模板读取时自动追踪依赖，变化时精确重渲染。你要记住的只是几条边界——script 里 <code>ref</code> 要写 <code>.value</code>，<code>reactive</code> 不能整体替换、不能装原始值、不能随意解构。
    </p>
    <div class="lesson-term">
      <span class="term-name">「响应式引用」</span>指 <code>ref</code>，它把单个值包装成可被追踪的引用，script 中读写要用 <code>.value</code>，模板中自动解包；<code>reactive</code> 则把对象转换成响应式代理。模板读取状态时自动追踪依赖，状态变化后依赖它的视图重新渲染。<code>reactive</code> 不能整体替换、不能用于原始类型，解构需用 <code>toRefs</code> 才能保住响应式。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
