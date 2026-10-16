const e=`<script setup lang="ts">
import K28ComponentExpose from './K28ComponentExpose.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>父组件想点一个工具栏按钮，让子组件里的搜索框获得焦点，可拿到的那个子组件引用上一片空白——那些方法为什么访问不到？
    </div>

    <h2>父组件命令式调用</h2>
    <p>
      你在做课程检索控制台。搜索面板被封成了一个子组件，里面有输入框、有搜索关键词、有「正在搜索…」的提示。父组件这一层则提供两个外部按钮：「聚焦子组件输入框」和「清空并重新聚焦」，方便用户快速操作。
    </p>
    <p>
      于是问题来了：输入框在子组件里，父组件要让它聚焦，就得调用子组件的某个方法。可是当父组件拿到子组件实例、准备写 <code>searchPanel.value.focusSearch()</code> 时，发现这个实例上什么都没有。<code>script setup</code> 组件在这一点上是刻意设计的——它默认是<strong>封闭</strong>的，父组件无法随意触碰内部变量。真正要回答的是：既要让父组件能发起这类操作，又要守住封装边界，接口该开在哪里、开多大？
    </p>

    <h2>绕过封装直连</h2>
    <p>
      最省事的做法：把输入框的 <code>ref</code> 直接放在父组件里，或者干脆不用子组件封装，把输入框和它的逻辑原样摊在父模板中，父组件想怎么操作就怎么操作。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认了「命令式操作确实存在需求」</strong>。聚焦、滚动、播放、清空这类动作天生就是「调用一下」的形状，硬要用数据流表达反而别扭。
    </p>

    <h2>封装破坏代价</h2>
    <ul>
      <li>封装被破坏了：输入框的 DOM 结构、内部状态全部暴露在父组件面前，子组件再也不能自由重构。</li>
      <li>清空后重新聚焦的这段逻辑要在使用它的每个父组件里各写一遍，子组件的能力没有被真正沉淀下来。</li>
      <li>父组件直接操作 DOM，绕过了组件的职责边界，出错时很难判断责任在谁身上。</li>
      <li>子组件内部稍作改名或结构调整，所有直接伸手的父组件一起坏掉，耦合悄悄长成了硬连接。</li>
    </ul>

    <h2>显式公开接口</h2>
    <p>
      正确的姿势是承认两层：子组件仍然保持封闭，但<strong>由子组件自己决定对外公开哪些能力</strong>。在子组件里用 <code>defineExpose</code> 明确列出要公开的内容，父组件拿到的实例上就只有这些。
    </p>
    <ol class="lesson-steps">
      <li>子组件维护自己的输入值和内部 DOM 引用，这些仍然只属于它自己。</li>
      <li>用 <code>defineExpose({ focusSearch, clearSearch })</code> 只公开两个方法，其余一概不给。</li>
      <li>父组件用 <code>useTemplateRef('searchPanel')</code> 获取模板中的子组件实例，得到类型安全的引用。</li>
      <li>用户在外部工具栏点击按钮时，父组件通过引用调用公开方法，完成聚焦或清空。</li>
    </ol>
    <p>
      <code>useTemplateRef</code> 是获取模板引用的写法，它在组件挂载之前值为 <code>null</code>，所以调用时要写成可选链：<code>searchPanel.value?.focusSearch()</code>。使用它的一个好处是类型推导更直接，父组件调用公开方法时能得到编辑器提示，方法名写错、参数传错当场暴露。
    </p>
    <p>
      真正决定接口好坏的，是「公开多少」。<strong>暴露面越小，组件内部重构的余地就越大</strong>：只要把方法签名固定住，里面换成什么实现、拆成几个文件、换成别的 DOM 结构，父组件都不需要知道。反过来，把内部状态整片暴露出去，等于把内部结构变成了一份不得不维护的对外契约。还有一条优先级要记牢——<strong>能用 <code>props</code> 和 <code>emits</code> 做声明式沟通的，就不要动用组件引用</strong>；受控的数据同步永远走数据流，命令式调用只留给那些一次性动作。
    </p>

    <h2>公开方法可及范围</h2>
    <figure class="lesson-figure">
      <figcaption>先随便输入几个字，再点「聚焦子组件输入框」和「清空并重新聚焦」，观察公开方法能做什么、又碰不到什么。</figcaption>
      <K28ComponentExpose />
    </figure>

    <h2>模板引用与事件分工</h2>
    <p>
      组件公开接口要解决的是「父组件确实需要下令」这个现实需求，同时不把封装拆掉。做法是把命令式能力集中到 <code>defineExpose</code> 的一小份清单里，由父组件通过模板引用调用，其余一切都留在内部。它的判断标准也很简单：如果这件事是一次性的动作，用引用；如果需要持续同步数据，回到 <code>props</code> 与事件。
    </p>
    <div class="lesson-term">
      <span class="term-name">「组件公开接口」</span><code>script setup</code> 组件默认封闭，父组件不能访问其内部变量；子组件用 <code>defineExpose</code> 明确公开少量命令式能力，父组件再用 <code>useTemplateRef</code> 拿到类型安全的引用。接口应保持最小，优先使用 <code>props</code> / <code>emits</code> 声明式通信，只在聚焦、滚动、播放等命令式场景使用组件引用（挂载前引用值为 <code>null</code>）。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
