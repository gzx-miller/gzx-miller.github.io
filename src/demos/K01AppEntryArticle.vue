<script setup lang="ts">
import K01AppEntry from './K01AppEntry.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>页面里只留了一个空的挂载点 <code>&lt;div id="app"&gt;&lt;/div&gt;</code>，为什么一次 <code>mount('#app')</code> 就能让整页动起来，而 <code>app.use(router)</code> 又必须先于它执行？
    </div>

    <h2>应用装配职责</h2>
    <p>
      你从零开始一个新项目：浏览器打开的是一个几乎空白的 HTML 文件，你手里有一个挂载点容器，以及一堆写在 <code>.vue</code> 文件里的组件。你希望最终得到一个带路由、带状态、能交互的应用。这时立刻会撞上三个问题：页面上的那块 DOM 到底由谁来接管？Router、Pinia 这类跨页面的能力应该在哪一层接入？组件的结构、逻辑和样式又该怎么组织，才不至于像传统网页那样散落一地？
    </p>
    <p>
      这三个问题看着分散，其实是同一件事：<strong>一个 Vue 应用需要一个明确的「起点」</strong>，由它把所有零件装配成一台能跑的机器。想清楚这个起点该承担什么、不该承担什么，后面的所有代码组织都有据可依。
    </p>

    <h2>脚本直改节点</h2>
    <p>
      最朴素的做法：入口写在 HTML 里，用 <code>&lt;script&gt;</code> 引一段脚本，脚本里用原生 DOM API 找到节点、写入内容、绑定事件。页面要什么就往里塞什么。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它承认「页面需要一个统一的装配点」</strong>。初始化逻辑集中在一处，而不是散落在每个元素的 <code>onclick</code> 上。只要页面足够小，这样写完全能跑起来。
    </p>

    <h2>巨型入口维护成本</h2>
    <ul>
      <li>装配逻辑一旦变多，这个入口会退化成一段什么都往里塞的巨型脚本，出问题后很难定位。</li>
      <li>结构、逻辑、样式全混在 DOM 操作里，没有边界，改样式和改逻辑会互相牵连。</li>
      <li>想复用一段「卡片」结构只能复制粘贴，改一处要动全身。</li>
      <li>全局能力没有统一的注册处，只能到处手动 import，依赖关系越来越乱。</li>
      <li>页面越来越大之后，你连「哪段代码在什么时候跑」都说不清楚。</li>
    </ul>

    <h2>实例化与插件注册</h2>
    <p>
      第一步，把「装配」从页面里搬进代码：用 <code>createApp</code> 创建一个<strong>应用实例</strong>。这一步的价值不在写法，而在于它给了你什么——每个实例都拥有自己的组件树、插件注册表、全局配置与挂载目标。因此<strong>同一个页面可以并存多个互不干扰的 Vue 应用</strong>，这正是微前端场景能各自接管独立挂载点的原因：它们之间不共享任何全局配置。
    </p>
    <p>
      第二步，解决「全局能力在哪接入」。Router、Pinia 这些能力都以<strong>插件</strong>的形式提供，通过 <code>app.use(...)</code> 注册到应用实例上，之后的组件才能读到路由与 store。这里有个顺序讲究：<strong>依赖注入类的插件必须在组件挂载之前完成注册</strong>，否则组件首次渲染时还拿不到被注入的能力。普通页面对注册顺序不敏感，但依赖关系必须先于使用方就位。
    </p>
    <p>
      第三步，把应用交给页面：调用 <code>app.mount('#app')</code>，Vue 接管那个挂载点，此后页面的更新全部交给响应式系统，你不再需要手动操作 DOM。
    </p>
    <div class="lesson-box warn">
      <strong>职责边界：</strong>入口文件只放应用装配逻辑，不放具体业务流程。项目变大之后，一个职责单一的入口是定位问题的第一道线索；一旦业务代码混进来，装配链就会变得难以追查。
    </div>
    <p>
      剩下的问题是怎么组织组件，答案是<strong>单文件组件（SFC）</strong>：把 <code>&lt;template&gt;</code>、<code>&lt;script setup&gt;</code>、<code>&lt;style&gt;</code> 三种关注点收进同一个文件。<strong>template 负责结构，script setup 负责状态和行为，样式尽量服务当前组件或全局布局</strong>。这样的划分让组件成为可维护、可复用的最小页面单元，而不是一坨拼起来的字符串。
    </p>
    <p>
      还有一个容易被忽略的细节：<strong>模板并不是运行时解析的字符串</strong>。编译器在构建期就把 template 编译成渲染函数，生产环境没有额外的解析开销，调试版本还能通过组件面板对照查看编译结果。
    </p>
    <ol class="lesson-steps">
      <li>在 main.ts 中创建应用实例，导入全局样式与根组件。</li>
      <li>通过 <code>app.use</code> 注册 Router、Pinia 等跨页面能力，让后续组件可以读取路由和 store。</li>
      <li>调用 <code>mount('#app')</code> 把 Vue 接管到 index.html 的挂载点，之后页面更新交给响应式系统处理。</li>
      <li>在浏览器控制台确认真实应用实例已挂载且插件可用。</li>
    </ol>

    <h2>启动流程与装配顺序</h2>
    <figure class="lesson-figure">
      <figcaption>点「下一步」走完启动三部曲，再对照下方完整入口与 SFC 结构，看清装配顺序。</figcaption>
      <K01AppEntry />
    </figure>

    <h2>入口职责边界划分</h2>
    <p>
      一个 Vue 项目的起点是三条清晰的边界：用 <code>createApp</code> 划出互不干扰的应用实例，用 <code>app.use</code> 在挂载前接好全局能力，用 <code>mount</code> 把控制权交给响应式系统；再用 SFC 把结构、逻辑、样式收进同一个文件。入口只做装配，组件只做自己的事，项目变大时才不会失控。
    </p>
    <div class="lesson-term">
      <span class="term-name">「应用实例」</span>由 <code>createApp</code> 创建，拥有独立的组件树、插件注册表与全局配置，因此同一页面可并存多个互不干扰的应用。装配顺序是：先 <code>app.use</code> 注册插件，再 <code>app.mount('#app')</code> 挂载；入口文件只放装配逻辑，具体业务写在 SFC 组件里。
    </div>
  </LessonArticle>
</template>
