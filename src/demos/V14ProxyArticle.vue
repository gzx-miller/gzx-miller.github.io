<script setup lang="ts">
import V14Proxy from './V14Proxy.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>本地前端跑在 <code>5173</code>、后端跑在 <code>3000</code>，浏览器控制台一条红色报错——<code>No 'Access-Control-Allow-Origin' header</code>；可你把同一个接口地址粘进浏览器地址栏敲回车，数据却好好地返回了。同样的请求，为什么地址栏行、页面里的 JS 却不行？
    </div>

    <h2>同源策略与预检</h2>
    <p>
      这背后的规则叫<strong>同源策略</strong>：浏览器只允许页面读取「协议 + 域名 + 端口」完全一致的资源，只要有一项不同就算跨源。跨源的请求会被浏览器拦下——简单请求拦截响应，复杂请求还要先发一次 <code>OPTIONS</code> 预检。所以地址栏能打开（它不执行脚本、不受这条策略约束），页面里的 JS 却拿不到数据。
    </p>
    <p>
      要绕开它，无非两条路：让后端同意你跨源，或者让请求「看起来是同源的」。第一条路每次联调都要后端配合改 CORS 配置，沟通成本高；允许来源写宽了还会把线上暴露给任意站点；带上 Cookie 的凭证请求更要多处理一个头，极易踩坑。第二条路得在开发服务器上做文章——问题是，<strong>怎么让浏览器以为它在请求自己？</strong>
    </p>

    <h2>前缀代理规则</h2>
    <p>
      最直接的做法：在 Vite 开发服务器的 <code>server.proxy</code> 里，把以 <code>/api</code> 开头的请求转发到后端 <code>http://localhost:3000</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>浏览器眼里，请求始终是发给 <code>5173</code> 的同源地址</strong>，跨源从源头上就不成立。转发发生在开发服务器与后端这两台服务器之间，而<strong>服务器之间的请求不受浏览器同源策略约束</strong>——这正是代理能绕开跨域的根本原因。
    </p>

    <h2>虚拟主机匹配</h2>
    <ul>
      <li>后端用虚拟主机识别站点，收到 <code>Host: localhost:5173</code> 会匹配不到站点，返回 404 或错误页。</li>
      <li>后端真实路径可能就是 <code>/users</code>，不带 <code>/api</code> 前缀，原样转发过去直接 404。</li>
      <li>WebSocket 连接不会被这个 HTTP 代理顺带转发，<code>ws://</code> 请求直接失败。</li>
      <li>代理只在 <code>vite dev</code> 生效：打包上线后它消失了，前端请求 <code>/api</code> 会打到静态服务器上 404。</li>
      <li>要在几个后端环境之间切换，只能每次回来手改 <code>target</code>。</li>
    </ul>

    <h2>请求头与路径改写</h2>
    <p>
      先补「Host」。加上 <code>changeOrigin: true</code>，代理会把请求头的 <code>Host</code> 改成 <code>target</code> 的域名，虚拟主机后端才认得出该返回哪个站点。
    </p>
    <p>
      再补「路径」。用 <code>rewrite</code> 改写转发路径，例如 <code>rewrite: (path) =&gt; path.replace(/^\/api/, '')</code> 把前缀去掉。注意正则作用于<strong>带前缀的完整路径</strong>，要用 <code>^</code> 锚定，否则路径中间出现的 <code>/api</code> 也会被误改。
    </p>
    <p>
      接着补「WebSocket」。给那条规则加上 <code>ws: true</code>，代理才会转发 <code>ws://</code> 连接。
    </p>
    <p>
      再补「多环境切换」。把配置改成函数式，用 <code>loadEnv</code> 读取环境变量，让 <code>target</code> 指向 <code>env.VITE_API_TARGET</code>。这样切换后端只改环境变量，前端代码始终统一写相对路径 <code>/api/user</code>，一行都不用动。
    </p>
    <p>
      最后补「可观察」。在 <code>configure(proxy, options)</code> 回调里挂上 <code>proxy.on('proxyReq', ...)</code>，把每次实际转发的请求打到日志，联调时能直接看出请求到底发去了哪里。
    </p>
    <div class="lesson-box warn">
      <strong>一条必须记住的边界：</strong>代理<strong>只解决开发环境</strong>。生产环境没有 vite dev server，跨域要么由后端配置 CORS，要么用 Nginx 反向代理，要么把前后端部署在同一域名下。所以前端代码要统一写相对路径，把「后端是谁」这件事完全交给环境配置。
    </div>

    <h2>三种跨域方案</h2>
    <figure class="lesson-figure">
      <figcaption>切 basic / ws / cors 三个页签：先看最常用的前缀代理与 <code>rewrite</code> 写法，再看 WebSocket 怎么转发，最后对比代理、后端 CORS 与自定义中间件三种跨域方案。</figcaption>
      <V14Proxy />
    </figure>

    <h2>跨源转同源转发</h2>
    <p>
      开发代理的本质，是把「浏览器发出的跨源请求」改成「开发服务器替你发出的同源请求」：浏览器只看到 <code>5173</code>，转发由服务器完成，于是同源策略天然不触发。要记住的判断只有两条——<strong>代理只在开发环境生效，生产要靠服务端方案</strong>；以及 <code>changeOrigin</code> 改的是 Host 头、<code>rewrite</code> 改的是路径，别把两者混为一谈。
    </p>
    <div class="lesson-term">
      <span class="term-name">「同源策略（Same-Origin Policy）」</span>是浏览器的一项安全机制：只有「协议 + 域名 + 端口」三者完全一致才视为同源，脚本才能读取该资源；跨源请求会被拦截响应或先触发 <code>OPTIONS</code> 预检。关键边界有两条：它约束的是<strong>浏览器发起的读取</strong>，服务器之间的转发不受其限制，所以开发代理能绕开跨域；它也只存在于浏览器环境，<strong>生产环境没有代理可依赖</strong>，仍要由后端 CORS 或反向代理来解决。
    </div>
  </LessonArticle>
</template>
