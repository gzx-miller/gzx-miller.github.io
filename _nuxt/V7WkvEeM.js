const n=`<script setup lang="ts">
import N09SSR from './N09SSR.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在页脚放了一句「当前时间」，服务端渲染出来的 HTML 里写着 <code>10:00:00</code>，可浏览器把 JS 跑起来之后，页面「跳」成了 <code>10:00:03</code>，控制台还冒出一句 Hydration mismatch 的警告。同一行 <code>new Date()</code>，为什么两台机器算出了两个答案？
    </div>

    <h2>SPA首屏空壳</h2>
    <p>
      先回到 SSR 要解决的老问题：传统 SPA 给浏览器的是一个几乎空白的 HTML，得等 JS 下载、执行、再请求数据，内容才出现——首屏白屏，搜索引擎也抓不到正文。想让内容<strong>在服务器上先生成好</strong>，就必然带出一串新问题。
    </p>
    <p>
      组件代码本来是写给浏览器看的，怎么在服务器上也能跑？服务器上已经取到的数据，怎么让浏览器复用而不是再取一遍？浏览器拿到的那段静态 HTML，又怎么从「死的」变回「可交互的」？每一个都得回答，否则 SSR 只是把问题从客户端挪到了服务端。
    </p>
    <p>
      于是问题落到：<strong>SSR 到底在服务端和客户端<em>各自</em>做了什么？</strong>
    </p>

    <h2>服务端直出HTML</h2>
    <p>
      最朴素的做法：服务端把组件渲染成一段 HTML 字符串直接返回，浏览器先把这段 HTML 显示出来，再加载 JS。
    </p>
    <p>
      这一步做对了一件事：<strong>首屏立刻有内容，SEO 也能抓到真实文字</strong>。但它只回答了「怎么快」，没回答「数据从哪来、页面怎么活过来」。
    </p>

    <h2>两端环境对象缺失</h2>
    <ul>
      <li>组件代码里一旦访问 <code>window</code>、<code>document</code>、<code>localStorage</code>，服务端根本没有这些对象，渲染到那一句就崩。</li>
      <li>服务器明明已经取好了数据，如果客户端不知情，Hydration 之后还会<strong>再请求一遍</strong>，白白多一次往返。</li>
      <li>服务器返回的只是一段「死的」HTML：没有事件监听、没有响应式，按钮点了没反应。</li>
      <li>两端各自渲染的结果只要有一点不同，Vue 就会报 Hydration mismatch，严重时 DOM 还会错乱。</li>
    </ul>

    <h2>双端同构与注水</h2>
    <p>
      真正的机制，是把「同一套组件代码在两端各跑一次」讲清楚，也就是 <strong>同构执行</strong>，再加上一趟把数据带过去的 <strong>状态注水（payload）</strong>。
    </p>
    <ol class="lesson-steps">
      <li>服务端为每个请求创建<strong>独立</strong>的 Vue 实例，执行组件的 setup 与 <code>useFetch</code> 等数据获取——这就是为什么 setup 里不能写模块级全局副作用，否则会被下一个请求读到、请求之间互相污染。</li>
      <li>服务端把组件树渲染成 HTML 字符串，连同这次取到的数据（payload）一并发送给浏览器。</li>
      <li>浏览器<strong>先展示</strong>这段 HTML，用户立刻看到内容，不必等 JS。</li>
      <li>JS 加载完成后，Vue 执行 <strong>Hydration</strong>：它拿着虚拟 DOM 去「复用」已有的真实 DOM，把事件监听与响应式状态绑上去，让静态页面活过来。</li>
    </ol>
    <p>
      这里要特别记住：Hydration <strong>不是重新渲染</strong>，而是复用已有 DOM。也正因为是「复用」，它要求<strong>两端首次渲染的结构完全一致</strong>。
    </p>
    <p>
      回到开场那个时间跳变就通了：<code>new Date()</code> 在服务端和客户端是两个不同的时刻，两端渲染出的文本不同，Hydration 对不上，于是报出 mismatch。凡是<strong>环境相关</strong>的值——<code>Date.now()</code>、<code>Math.random()</code>、<code>window</code> 判断——都会造成这种两端不一致。
    </p>
    <p>
      治理办法是让这类值<strong>避开服务端渲染那一刻</strong>：把它放到 <code>onMounted</code> 里，等客户端挂载后再写入；或者在模板层面用 <code>&lt;ClientOnly&gt;</code> 把这块子树整个留到客户端渲染（这是下一课的内容）。
    </p>
    <div class="lesson-box warn">
      <strong>两条会污染 SSR 的禁忌：</strong>其一，不要在组件 setup 里写<strong>模块级全局副作用</strong>（比如给模块顶部的变量赋值），服务端多个请求会互相看到对方的状态；其二，不要在渲染期间直接读<strong>环境相关的值</strong>（时间、随机数、<code>window</code>），它们是 mismatch 最常见的来源。
    </div>

    <h2>请求渲染链路演示</h2>
    <figure class="lesson-figure">
      <figcaption>依次切到「请求生命周期 / Hydration 过程 / 常见问题」三个页签：先在时间线上看服务端到客户端的一整条链路，再看 Hydration 如何把「HTML + Payload」变成响应式应用，最后对照常见不兼容 SSR 的写法与对应的解决办法。</figcaption>
      <N09SSR />
    </figure>

    <h2>首屏一致性保证</h2>
    <p>
      SSR 的本质是<strong>同构执行加状态注水</strong>：同一套组件代码，服务端跑一遍生成 HTML、顺便把数据（payload）带下去，客户端再跑一遍、用 Hydration 把静态 DOM 激活。只要记住两端首次渲染必须一致，你就同时理解了「为什么首屏快」和「为什么会有 mismatch」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Hydration（注水 / 水合）」</span>SSR 返回静态 HTML 之后，客户端 Vue 携带虚拟 DOM 遍历已有的真实 DOM，把事件监听与响应式状态绑定上去、将静态页面<strong>激活</strong>为可交互应用的过程。要点：它<strong>不是重新渲染</strong>，而是复用已有 DOM；因此要求服务端与客户端<strong>首次渲染结构一致</strong>，否则产生 mismatch 警告。例外：<code>Date.now()</code>、<code>Math.random()</code>、<code>window</code> 等环境相关值会让两端输出不同，需放到 <code>onMounted</code> 或用 <code>&lt;ClientOnly&gt;</code> 处理。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
