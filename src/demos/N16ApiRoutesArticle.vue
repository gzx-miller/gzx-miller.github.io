<script setup lang="ts">
import N16ApiRoutes from './N16ApiRoutes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想给页面加一个后端接口，于是新建了 <code>server/api/hello.ts</code>，里面只写了一个返回对象的函数。你没有装 Express、没有写 <code>app.get('/api/hello', handler)</code>，也没有在任何一个地方「注册」过这个路由，可浏览器里请求 <code>/api/hello</code> 竟然直接通了——这个接口到底是被谁登记进去的？
    </div>

    <h2>框架路由的显式登记</h2>
    <p>
      在传统的 Node 后端里，「一个 URL 对应一段代码」这件事必须显式登记。你用 Express 写接口，路由表就是那个中枢：<code>app.get('/api/hello', handler)</code>、<code>app.post('/api/users', handler)</code>，每加一个接口都要在这里多写一行。路由表和处理函数分居两处，接口一多，它就成了一份需要维护的清单。
    </p>
    <p>
      这份清单的成本有三样。第一是<strong>路径写两遍</strong>：文件里定义了一次，路由表里又声明一次，改了目录或文件名，两处得同时对齐，漏改一个就是线上 404。第二是<strong>中枢会膨胀</strong>：所有接口都往同一个文件里堆，它随接口数量线性变长，启动时要一次性加载完。第三是<strong>没有结构约束</strong>：路径怎么写、允许哪些方法、参数从哪儿取，全靠每个 handler 自己记约定，谁都没法保证一致。
    </p>
    <p>
      于是问题落到：<strong>能不能让「文件本身」就是端点，路径由文件在目录里的位置推导出来，连允许的 HTTP 方法也由文件名写清楚？</strong>
    </p>

    <h2>文件即端点的约定</h2>
    <p>
      在项目根目录建一个 <code>server/api/</code> 目录，按想要的路径在里面放文件。文件内容只做一件事：默认导出一个 <code>defineEventHandler</code> 处理函数，返回什么，接口就响应什么。
    </p>
    <p>
      具体到开场那个例子：<code>server/api/hello.ts</code> 里导出 <code>defineEventHandler(() =&gt; ({ message: '你好，小松鼠！' }))</code>，它就自动成为 <code>/api/hello</code>；返回值会被自动序列化成 JSON。
    </p>
    <p>
      这个方案做对了一件事：<strong>路径不再写第二遍</strong>。文件在哪儿，接口就在哪儿，路由表被文件系统取代了。这条约定和 Nuxt 的 <code>pages/</code> 路由是同一套心智模型——目录结构即路径结构，你只是把「页面」换成了「接口」。
    </p>

    <h2>默认响应所有方法</h2>
    <ul>
      <li>只按文件推导路径，默认<strong>对所有 HTTP 方法都响应</strong>：<code>GET</code>、<code>POST</code>、<code>DELETE</code> 打进来都命中同一个 handler，一个删除接口被 GET 也能触发。</li>
      <li>参数还没着落：查询串和请求体是两种形态，不区分来源就会把请求体当查询串去取，拿到的是 <code>undefined</code>。</li>
      <li>动态段 <code>[id].ts</code> 里的那个 <code>id</code> 不会自己冒出来，自己拿 <code>event.path</code> 切字符串既易错又没法类型化。</li>
      <li>想返回一个 404 却只能 <code>throw new Error()</code>，它一律变成 500「服务器内部错误」，前端拿不到你想表达的状态码。</li>
    </ul>

    <h2>后缀对方法的限定</h2>
    <p>
      不推翻「文件即端点」，而是在文件名与处理函数上<strong>一层层补约定</strong>。
    </p>
    <p>
      先补方法。给文件名加后缀限定它能响应的方法：<code>users/index.get.ts</code> 只接 GET，<code>users/index.post.ts</code> 只接 POST，<code>users/[id].delete.ts</code> 只接 DELETE。<strong>不带后缀的文件会对各种方法都做出响应</strong>——这正是上面那个坑，所以写写操作接口时，后缀不是可选项，而是必须显式做的决定。
    </p>
    <p>
      再补参数。取值一律走 h3 提供的工具，而不是自己去翻原始请求对象：<code>readBody(event)</code> 读请求体（是异步的），<code>getQuery(event)</code> 读查询串，<code>getRouterParam(event, 'id')</code> 读动态段。<strong>这些函数是自动导入的，不用手写 import</strong>，而且返回的值会按同一套规则序列化回 JSON。
    </p>
    <p>
      接着补响应的表达力。要改状态码用 <code>setResponseStatus(event, 201)</code>，要加响应头用 <code>setResponseHeader(event, 'Cache-Control', 'max-age=3600')</code>；要报错就用 <code>createError({ statusCode: 404, statusMessage: 'Not Found' })</code> 抛出，它会被转换成带状态码的错误响应，前端拿到的就是 404 而不是裸 500。
    </p>
    <p>
      最后把这一层和周边划清边界。<code>server/api</code> 的路由空间与 <code>pages</code> 完全独立，接口文件与页面文件同名互不冲突；<code>server/middleware/</code> 下的文件会自动注册为服务端中间件，对每个服务端请求生效，适合做鉴权；<code>server/utils/</code> 里导出的函数同样自动导入，可在 API 处理器与中间件中复用。
    </p>
    <div class="lesson-box warn">
      <strong>一个容易踩的坑：</strong>不带方法后缀的处理文件会对各种 HTTP 方法都做出响应。写删除、修改这类有副作用的接口时一定要加 <code>.delete.ts</code> / <code>.put.ts</code> 后缀，否则一个普通的 GET 请求就能触发写操作——这类问题在本地测试里几乎不会暴露，上线后却可能被爬虫误触发。
    </div>

    <h2>三种接口写法的并置</h2>
    <figure class="lesson-figure">
      <figcaption>三个页签分别是「GET 接口 / RESTful 方法 / 参数与工具」：先看最朴素的单文件接口，再看同一资源用 <code>.get.ts</code> / <code>.post.ts</code> / <code>.delete.ts</code> 拆开的样子，最后看参数与响应工具清单。右边的「模拟 API 调用」有三个按钮，点 <code>GET /api/hello</code>、<code>GET /api/users</code> 看返回的 JSON，点「模拟 404」看 <code>createError</code> 抛出的错误结构长什么样。</figcaption>
      <N16ApiRoutes />
    </figure>

    <h2>端点推导的约定收益</h2>
    <p>
      <code>server/api/</code> 把后端接口变成了文件系统约定的产物：目录位置决定路径，文件后缀决定方法，导出 <code>defineEventHandler</code> 决定行为。你因此少维护一张路由表，也少了一次「路径写两遍」的机会；参数与错误则统一从 h3 的工具进出，接口的进出形态在文件层面就写清楚了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「事件处理器（event handler）」</span>指 <code>defineEventHandler</code> 默认导出的那个函数，它接收一个封装了请求与响应的 <code>event</code> 对象，<strong>返回值即响应体</strong>并自动序列化为 JSON。<strong>边界</strong>：它是自动导入的（来自 h3），不要手写 <code>import</code>；请求数据一律通过 <code>readBody</code> / <code>getQuery</code> / <code>getRouterParam</code> 这类工具读取，而不是直接操作 <code>event.node.req</code>，否则会绕过 h3 的解析与类型，拿到未经处理的内容。
    </div>
  </LessonArticle>
</template>
