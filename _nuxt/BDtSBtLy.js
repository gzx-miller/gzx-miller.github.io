const e=`<script setup lang="ts">
import D06HttpServer from './D06HttpServer.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把结束响应的 <code>res.end()</code> 换成了 <code>res.write('...')</code>，命令行里的 <code>curl</code> 却一直挂着直到超时——数据明明已经写出去了，连接凭什么还不结束？
    </div>

    <h2>框架替你兜住了什么</h2>
    <p>
      平时写接口总先 <code>app.get('/api/courses', handler)</code> 一把梭，路由、序列化、响应头、错误兜底都由框架包办。用着舒服，但也意味着你并不清楚：一个请求从进入进程、到客户端收到响应，中间究竟发生了哪几步。
    </p>
    <p>
      一旦去掉框架、只留 Node 自带的 <code>node:http</code>，这些原本被藏起来的步骤就会全部浮现。把它们亲手走一遍，既能在出问题时知道该查哪里，也能在选框架时明白它到底替你做了什么。
    </p>

    <h2>零框架写一个接口</h2>
    <p>
      你要在不引入框架的前提下，让 Node 直接接收 HTTP 请求、返回 JSON。最直接的想法是照抄一段示例：拿到请求就判断地址、写回数据。可一旦自己动手就会发现，框架平时替你兜住的那些事——路由、序列化、响应头——全都不见了。
    </p>
    <p>
      一上来就用框架有几笔藏起来的成本：<strong>你不知道从请求到响应中间真正发生了什么</strong>，出问题只能靠猜；框架把路由与中间件封在黑盒里，想控制超时、请求体大小这些底层细节很别扭；换框架等于把业务逻辑整个迁移走。
    </p>
    <p>
      问题落到一句话：一个 HTTP 请求从进入进程到返回响应，中间到底有哪些步骤是<strong>必须由你亲手完成</strong>的？
    </p>

    <h2>请求与响应两个对象</h2>
    <p>
      Node 内置的 <code>node:http</code> 给出了 <code>http.createServer</code>。你只需要给它一个处理函数，入参是两个对象：<code>req</code>（请求）与 <code>res</code>（响应）。用 <code>req.method</code> 和 <code>req.url</code> 做判断，命中就用 <code>res.writeHead(200, { 'Content-Type': 'application/json' })</code> 写状态码与响应头，再 <code>res.end(JSON.stringify(...))</code> 写回内容。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它把 HTTP 的请求与响应还原成两个「可读 / 可写」的对象</strong>。method、url、headers 都挂在 <code>req</code> 上，状态码、响应头、响应体都通过 <code>res</code> 发出——不用背框架 API，直接对着协议本身写。
    </p>

    <h2>连接挂起的几个成因</h2>
    <ul>
      <li>处理完成却不调用 <code>res.end()</code>：连接不会关闭，客户端一直等到超时，<code>curl</code> 永远不返回——这正是开场那个现象。</li>
      <li>不设 <code>Content-Type</code>：客户端按默认的 <code>text/plain</code> 处理，前端调 <code>response.json()</code> 会直接解析失败。</li>
      <li>在 <code>res.write()</code> 之后才调 <code>setHeader()</code>：响应头已经发出，这次设置不生效，客户端拿到的是错的类型。</li>
      <li>只判断 <code>req.url</code>、不判断 <code>req.method</code>：POST 打到只处理 GET 的地址也会命中，返回一段与操作不匹配的结果。</li>
      <li>请求体是挂在 <code>req</code> 上的 <strong>Readable 流</strong>：不设上限地累积它，攻击者发一个超大 body 就能把内存吃满。</li>
      <li>没有任何路径兜底：未匹配的请求既没命中路由、也没结束响应，同样挂在那里。</li>
    </ul>

    <h2>响应出口唯一性与请求边界</h2>
    <p>
      先补<strong>响应出口的唯一性</strong>，因为挂起连接比返回错误更致命——所有分支，包括未命中路由的 404，都必须走到某个显式结束响应的出口。一个请求的处理顺序，从头到尾是这样：
    </p>
    <ol class="lesson-steps">
      <li>从 <code>req</code> 读出 <code>method</code>、<code>url</code> 与请求头。</li>
      <li>用 <code>(method, 路径)</code> 这一对去匹配处理器——同一个路径、不同方法是两件不同的事。</li>
      <li>校验输入，不合法就直接给出对应的 4xx。</li>
      <li>在写响应体之前，把状态码与响应头设置好。</li>
      <li>写入响应体并<strong>显式结束响应</strong>；未匹配则返回 404。</li>
    </ol>
    <p>
      再补<strong>响应头与状态码</strong>。客户端靠 <code>Content-Type</code> 决定怎么解析响应体，所以返回 JSON 时要写清楚 <code>application/json; charset=utf-8</code>；靠状态码判断成败，成功用 2xx、参数错用 4xx、服务端问题用 5xx。顺序上要记住一条硬规则：<strong>头必须在 <code>write()</code> / <code>end()</code> 之前设置完</strong>，或者用 <code>writeHead()</code> 一次性把状态码和头都给出去。
    </p>
    <p>
      再补<strong>请求边界</strong>。既然请求体是流，就不能无脑往内存里堆：一边在 <code>data</code> 事件里累积分片、一边累计字节数，超过上限立即停止接收并回 413；空 body 与非法 JSON 也要用 <code>try ... catch</code> 接住，别让 <code>JSON.parse</code> 的异常把请求崩掉。这个上限不是可选项——裸的 <code>http</code> 模块不会替你设，默认就是「来多少收多少」。
    </p>
    <p>
      最后补上<strong>运行时边界</strong>：给 <code>server</code> 设一个请求超时，避免慢连接一直占着；监听 <code>error</code> 事件，处理端口占用这类启动错误；退出时用 <code>server.close()</code> 停止接收新连接、等已存在的请求处理完再关停，也就是<strong>优雅关闭</strong>。这些原生 <code>http</code> 都只给能力、不帮你想，生产环境还得自己补上——上一课讲的流，正好用在大响应体的写入上。
    </p>
    <div class="lesson-box warn">
      <strong>三条硬规则：</strong>响应一定要走到 <code>end()</code>，否则连接挂起；<code>setHeader</code> 必须在 <code>write</code> / <code>end</code> 之前调用，之后调不生效；请求体是 Readable 流，必须限制最大体积，否则会被超大请求耗尽内存。
    </div>

    <h2>方法与路径一起匹配</h2>
    <figure class="lesson-figure">
      <figcaption>切换「方法」与「路径」，看同一段判断逻辑只对 <code>GET /api/courses</code> 命中并返回 200，其它组合都落到 404——留意「路径对、方法不对」为什么也算不匹配。</figcaption>
      <D06HttpServer />
    </figure>

    <h2>框架补上的那几步</h2>
    <p>
      <code>node:http</code> 给你的是 <code>request</code> / <code>response</code> 两个流式对象和零内置路由；一个请求要真正「结束」，靠的是你自己把 <strong>method 与 URL 的匹配、状态码与响应头、以及显式结束响应</strong>补齐。框架只是替你把这几步包了一层，理解它之后，再选框架心里就有底了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Content-Type」</span>是 HTTP 响应头里声明响应体媒体类型的字段，客户端据此决定如何解析内容（例如 <code>application/json; charset=utf-8</code>）。边界与例外：它<strong>必须在 <code>write()</code> / <code>end()</code> 之前设置</strong>，一旦响应头发出，再调 <code>setHeader()</code> 就不生效；省略时客户端通常按 <code>text/plain</code> 处理；文本类型应显式带上 <code>charset</code>，否则中文可能乱码。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
