<script setup lang="ts">
import X06ClientComponents from './X06ClientComponents.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>给一张商品卡片加「收藏」按钮，点了要变红——可页面里写 <code>useState</code> 就报错，加上一句 <code>"use client"</code> 又立刻好使。这行字符串到底做了什么，加在哪里又有讲究？
    </div>

    <h2>交互逻辑的落点</h2>
    <p>
      前面的课程已经说清：App Router 里组件默认在服务端运行，能直接取数据，却不能处理点击、输入这类交互。可实际页面从来不只是「把数据铺出来」——搜索框要随输入变化，收藏按钮要立刻变色，标签页要能切换，表单要能在提交时变得不可点。
    </p>
    <p>
      这些都依赖两样东西：<strong>状态</strong>（记住用户操作带来的变化）和<strong>事件</strong>（响应用户的动作）。而它们都需要一个持续存在、能反复响应的运行环境，也就是浏览器。于是问题变成：<strong>在一个默认跑在服务端的框架里，我该在什么位置、用什么方式，把需要交互的部分切回客户端？</strong>
    </p>

    <h2>整页客户端方案</h2>
    <p>
      最朴素的做法，是让整个页面回到「纯客户端组件」的老路：整页都标成客户端，数据也在客户端取。这套做法做对了一件事——<strong>交互能力完整恢复了</strong>，状态和事件想怎么用就怎么用，心智负担最小。
    </p>
    <p>
      但它把服务端的好处一股脑丢掉了：整页代码都得进前端 bundle，数据获取又退回「挂载后请求」那一趟往返，首屏重新变空。
    </p>

    <h2>客户端全包代价</h2>
    <ul>
      <li>整页标记为客户端，等于放弃了服务端取数据，首屏回到「先空后填」。</li>
      <li>本可留在服务端的纯展示组件（标题、列表）也被打包进 bundle，体积无谓增大。</li>
      <li>敏感逻辑一旦落进客户端文件，就等于对用户公开。</li>
      <li>没有弄清「边界画在哪」，会导致一个按钮把整个页面的服务端优势一起拖下水。</li>
    </ul>

    <h2>按需标注的边界</h2>
    <p>
      不推翻「客户端组件」这种形态，而是把它从「默认」降级为「按需」：只有当组件真的需要交互时，才在文件顶部加一行 <code>"use client"</code>，显式声明为<strong>客户端组件</strong>。没有这行声明的，仍按服务端组件处理。
    </p>
    <p>
      这句声明的位置非常关键——它必须写在<strong>文件的最顶部</strong>，在 import 之前。它的作用范围也不是「本文件」而已：一旦某个文件被标记为客户端组件，<strong>它导入的所有子组件也都会变成客户端组件</strong>。换句话说，<code>"use client"</code> 划出的是一条<strong>边界</strong>，边界内整棵子树都归客户端。这也解释了子组件文件为什么通常不必重复写这行声明——它们是被边界「带上」的。
    </p>
    <p>
      那数据怎么办？答案是<strong>组合</strong>：让外层的 Server Component 负责取数，把结果通过 <code>props</code> 传给内层的 Client Component，由后者专心处理交互。比如商品列表页在服务端取回商品数组，再逐个渲染成一张张客户端商品卡，卡片内部自己管「是否已收藏」这个状态。
    </p>
    <p>
      有一个反直觉的细节：<strong>客户端组件仍然会先在服务端渲染出 HTML</strong>，然后才在浏览器里被「接管」，这个过程叫水合（hydrate）。所以标记客户端并不意味着首屏空白——HTML 依旧由服务端直出，只是随后要再跑一遍 JavaScript 才能响应用户操作。
    </p>
    <table>
      <thead>
        <tr><th>关注点</th><th>说明</th></tr>
      </thead>
      <tbody>
        <tr><td>声明位置</td><td>文件顶部、import 之前</td></tr>
        <tr><td>作用范围</td><td>当前文件及其导入的整棵子树</td></tr>
        <tr><td>适用场景</td><td><code>useState</code>／<code>useEffect</code>、事件处理器、浏览器 API</td></tr>
        <tr><td>首屏行为</td><td>仍由服务端渲染 HTML，再在客户端水合</td></tr>
      </tbody>
    </table>
    <div class="lesson-box hint">
      <strong>边界下推：</strong>让交互组件<strong>小而独立</strong>，把 <code>"use client"</code> 尽量推到叶子节点，能显著减小客户端 bundle。像搜索框那样，只把「输入 + 按钮」这一小块标成客户端，外层列表整片留在服务端，是更划算的边界画法。
    </div>
    <div class="lesson-box warn">
      <strong>跨边界传值的硬限制：</strong>从 Server 传给 Client 的 <code>props</code> 必须<strong>可序列化</strong>，普通对象、数组、字符串、数字都没问题，但函数不能直接传。如果确实需要把函数交给客户端调用，应该把它做成 <strong>Server Action</strong> 再传，框架会为它生成可调用的引用。
    </div>

    <h2>覆盖范围对比</h2>
    <figure class="lesson-figure">
      <figcaption>对比「整页客户端」与「边界下推」两种画法，看看客户端部分究竟覆盖了多大范围。</figcaption>
      <X06ClientComponents />
    </figure>

    <h2>边界位置判定</h2>
    <p>
      客户端组件这一课，重点不是「怎么写交互」，而是「边界画在哪」：需要状态、事件或浏览器 API 的组件，在文件顶部加 <code>"use client"</code>，这行声明会向下覆盖整棵子树。默认仍用服务端组件取数，把交互部分拆成小客户端组件并通过可序列化的 <code>props</code> 接收数据，就能兼顾交互与服务端优势。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Client Component」</span>是在文件顶部声明 <code>"use client"</code> 的组件，可以使用 <code>useState</code>／<code>useEffect</code> 等 Hook、事件处理器与浏览器 API。该声明写在 import 之前，且<strong>会向下传递给它导入的所有子组件</strong>，因此它划出的是一条边界而非单个文件。客户端组件仍会先在服务端渲染 HTML、再在客户端水合（hydrate）。实践上应把边界尽量下推到叶子组件以减小 bundle；Server 传给 Client 的 <code>props</code> 必须可序列化，函数需包装成 Server Action 才能传递。
    </div>
  </LessonArticle>
</template>
