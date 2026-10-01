<script setup lang="ts">
import K10LifecycleRef from './K10LifecycleRef.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>弹窗一打开就想让输入框自动聚焦，可代码刚跑就报错——那个输入框那时候还不存在吗？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个弹窗表单：弹窗弹出后，光标要自动落在第一个输入框里，同时卡片上显示「已停留 N 秒」的计时。前一件事需要碰到真实的输入框元素，后一件事需要启动一个每秒执行一次的计时器。
    </p>
    <p>
      两件事都指向同一个问题：<strong>组件的「一生」分不同阶段，代码写在哪个阶段，能不能碰到 DOM、会不会留下垃圾，结果完全不同</strong>。搞不清时机，就会一边拿不到元素，一边泄漏资源。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：在脚本顶层直接写 <code>inputRef.value?.focus()</code>，紧接着 <code>setInterval</code> 启动计时器，反正逻辑都在一个文件里。
    </p>
    <p>
      这个方案做对了一件基础的事：<strong>它承认了代码需要一个执行入口</strong>。启动逻辑集中在一处，读起来也直观。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>脚本执行时组件还没渲染成真实 DOM，模板引用仍是 <code>null</code>，聚焦这一步直接落空。</li>
      <li>组件被销毁后计时器还在跑，回调继续执行，形成内存与性能的双重泄漏。</li>
      <li>同样的问题会出现在事件监听、订阅、第三方实例上——创建了却没释放。</li>
      <li>看不出「创建」与「清理」的对应关系，时间一长没人说得清哪些资源还活着。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「要有启动入口」，而是按<strong>组件进入页面、更新、离开页面</strong>的时机，把代码放到对应的<strong>生命周期钩子</strong>里。
    </p>
    <ol class="lesson-steps">
      <li>给输入框挂一个模板引用，让组件在需要时能拿到真实元素。</li>
      <li>把聚焦放到 <code>onMounted</code> 中——<strong>DOM 相关操作必须等到挂载之后</strong>，那时元素才真正存在。</li>
      <li>同样在 <code>onMounted</code> 里启动计时器，页面开始累加停留时间。</li>
      <li>在 <code>onBeforeUnmount</code> 或 <code>onUnmounted</code> 中清理计时器，避免组件离开后回调仍在执行。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个必须记住的细节：</strong>其一，组件未挂载时模板引用为 <code>null</code>，访问前要做空值守卫，例如 <code>inputRef.value?.focus()</code> 里的可选链。其二，定时器、事件监听、订阅和第三方实例都应在组件卸载前释放——<strong>把资源创建与释放写在同一处，是避免泄漏的基本纪律</strong>。
    </div>
    <p>
      还有一条更省心的原则：<strong>能通过声明式状态完成的事情，不要优先去操作 DOM</strong>。改文案、切样式、控制显隐，交给响应式数据即可；只有当浏览器能力确实无法用状态表达时（聚焦、测量尺寸、接入第三方库），再去动真实元素。
    </p>

    <p>
      再补一层理解：组件的一生不止「挂载」一个节点。数据变化会引起更新，此时 <code>onUpdated</code> 会被反复调用——<strong>它是用来做更新之后的收尾，而不是用来修改状态的</strong>，在里面对状态再赋值很容易造成循环。至于卸载前的 <code>onBeforeUnmount</code> 与完全卸载后的 <code>onUnmounted</code>，差别在于前者执行时 DOM 还在，适合做最后的数据清理与断开连接；后者则确认组件已经离开，用于核对资源确实回收。把「创建」与「释放」成对写在同一个关注点里，代码的可信度会高出很多。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>看输入框如何自动聚焦、计时器如何累加；反复挂载卸载，确认资源被正确回收。</figcaption>
      <K10LifecycleRef />
    </figure>

    <h2>总结</h2>
    <p>
      生命周期钩子描述组件进入页面、更新和离开页面的时机；模板引用让组件在必要时访问真实 DOM。需要 DOM 就等 <code>onMounted</code>，需要清理就在卸载前释放资源，创建与销毁成对出现，组件才不会留下尾巴。
    </p>
    <div class="lesson-term">
      <span class="term-name">「生命周期钩子」</span>标记组件挂载、更新、卸载等关键时刻：<code>onMounted</code> 之后才能安全访问 DOM，因此聚焦、测量要放在这里；<code>onBeforeUnmount</code> / <code>onUnmounted</code> 用来清理定时器、监听、订阅与第三方实例。模板引用在组件未挂载时为 <code>null</code>，访问前须做空值守卫。
    </div>
  </LessonArticle>
</template>
