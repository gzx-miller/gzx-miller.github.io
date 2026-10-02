const n=`<script setup lang="ts">
import J09Modules from './J09Modules.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>首页只用到一个小图标，打包体积却多出 300KB——一个只在点「设置」时才用到的图表库，凭什么躺在首屏的代码里？
    </div>

    <h2>模块拆分与首屏体积</h2>
    <p>
      项目越写越大，代码被拆成几十个文件：工具函数、图表库、富文本编辑器、各种页面。如果所有文件在入口处被无差别地引用，打包器就会把它们全部塞进一个包。用户打开首页，只为看一张列表，却要下载图表库和编辑器——首屏白屏时间被这些「暂时用不到」的代码拖长。
    </p>
    <p>
      于是模块化要回答两个问题：<strong>一是怎么把代码切成边界清晰的模块，二是怎么控制「什么时候加载哪个模块」</strong>。前者决定项目好不好维护，后者直接决定首屏快不快。这两件事，ES Module 用两套机制分别解决。
    </p>

    <h2>静态import依赖</h2>
    <p>
      最直接的做法：用一个静态 <code>import</code> 把需要的东西都引进来，用 <code>export</code> 把模块的公共接口暴露出去。谁需要什么就引什么，写起来像拼积木。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它给了每个文件独立的作用域</strong>，模块里的变量不会污染全局，也不会互相撞名；而且依赖关系写在文件顶部，一眼看清谁用了谁。静态 <code>import</code> 在编译期就能确定整张依赖图，打包器据此做 Tree Shaking——把没有真正被用到的导出从最终产物里删掉。
    </p>

    <h2>首屏体积膨胀</h2>
    <ul>
      <li>所有被静态 <code>import</code> 的模块都会进入首屏包，哪怕这份代码要等用户点了某个按钮才用得上。</li>
      <li>低频功能（图表、编辑器、导出模块）常驻主包，让首屏体积无谓膨胀，白屏时间变长。</li>
      <li>静态 <code>import</code> 是「编译期就要确定」的：你没法根据运行时条件，只在需要时才决定加载哪一个模块。</li>
      <li>模块一多，环形依赖在初始化阶段互相读取，可能读到还没赋值的变量，报错还很难定位。</li>
    </ul>

    <h2>动态import拆分</h2>
    <p>
      先厘清静态 <code>import</code> 的定位：它适合<strong>首屏必需的依赖</strong>。因为依赖在编译期就确定，打包器才能分析出哪些导出真的被用到，从而安全地剔除多余代码。所以策略是——把首屏必须的留成静态导入，其余的想办法挪走。
    </p>
    <p>
      挪走的工具是<strong>动态 <code>import()</code></strong>。注意它写在表达式位置、返回一个 <strong>Promise</strong>，而不是语句。这就带来了本质区别：<code>import()</code> 的模块地址可以等运行时再算，加载时机也由你决定。打包器看到它，会把目标模块拆成一个独立的 chunk，只有代码真的执行到这里，浏览器才去下载。这正是路由懒加载、组件按需加载、首屏优化的标准手段。
    </p>
    <div class="lesson-box hint">
      <strong>用法：</strong><code>import()</code> 是函数调用，返回 Promise，因此可以 <code>await</code>，也可以配合 <code>then</code> 处理加载状态。加载失败（网络错误、路径写错）会以 Promise 拒绝的形式冒出来，记得用 <code>try ... catch</code> 兜住。
    </div>
    <p>
      换好之后，还要能验证「有没有真的拆出去」。用打包分析工具看一眼产物的 chunk 划分：如果目标模块出现在独立 chunk 里、而不是躺在主包里，说明拆分生效了。这一步很关键——只有当拆分被验证过，优化才算落地，而不是停留在「我写了 <code>import()</code>」的自我感觉上。
    </p>
    <p>
      最后有四个关于模块本身的坑，务必记住：
    </p>
    <ul>
      <li><strong>ES Module 默认运行在严格模式</strong>，无论你有没有写 <code>'use strict'</code>，一些宽松写法在这里直接报错。</li>
      <li><strong>顶层 <code>await</code> 只能在模块顶层使用</strong>，在 Node 端还要求运行环境本身是 ES Module。</li>
      <li><strong>小心环形依赖</strong>：两个模块互相导入，在初始化阶段就可能读到对方尚未赋值的绑定，值会是 <code>undefined</code>。</li>
      <li><strong><code>import</code> 是只读绑定</strong>：不能给导入的名字重新赋值；同时它是「实时绑定」，模块内部导出变量更新后，导入方看到的是最新值，而不是导入那一刻的拷贝。</li>
    </ul>

    <h2>点击触发懒加载</h2>
    <figure class="lesson-figure">
      <figcaption>点一下按钮，模拟 <code>import()</code> 在点击后才把图表模块拉进来。</figcaption>
      <J09Modules />
    </figure>

    <h2>两种导入职责分工</h2>
    <p>
      模块化解决的是「代码边界」和「加载时机」两件事：静态 <code>import</code> 划定依赖、让打包器能做 Tree Shaking，动态 <code>import()</code> 把低频功能拆成独立 chunk、按需拉取，从而把首屏不该背的代码请出去。
    </p>
    <div class="lesson-term">
      <span class="term-name">「ES Module」</span>是 JavaScript 的官方模块系统，拥有独立作用域与静态依赖结构：<code>import</code> / <code>export</code> 在编译期确定依赖图，导出是实时且只读的绑定，打包器据此做 Tree Shaking。动态 <code>import()</code> 是函数调用、返回 Promise，可把低频模块拆成独立 chunk 按需加载，是路由懒加载与首屏优化的标准手段。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
