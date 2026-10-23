const n=`<script setup lang="ts">
import D13ExpressFastify from './D13ExpressFastify.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把日志中间件写在所有业务路由后面，跑起来一条业务日志都没打；同事又从别处抄来「洋葱式」写法，以为 <code>next()</code> 之后还能在响应外面收尾——同样都调了 <code>next()</code>，为什么<strong>写在哪、由谁承载</strong>，直接决定了它到底生不生效？
    </div>

    <h2>请求进入业务之前要过几道关</h2>
    <p>
      你在写一个用户服务。每个接口在真正干活之前，其实都要先过几道<strong>和业务无关、却每次都得做</strong>的关卡：请求体先解析成对象、调用者身份先确认、最好再留一条访问日志，最后才轮到「查库、拼返回值」这些真正的业务。
    </p>
    <p>
      它们有一个共同的名字——<strong>横切关注点</strong>：不属于某一个接口，而是对<strong>每个接口都成立</strong>。也正因为如此，人们很容易把它们和业务揉在一起写，心里想的是「反正每个处理函数都得做这几步」。可这份「都得做」一旦只靠人记，漏一处就是一个真实缺口。真正该问的是：<strong>能不能把这类逻辑从处理函数里提出来，交给框架在确定的时机统一执行？</strong>
    </p>

    <h2>最省事的写法与它埋下的隐患</h2>
    <p>
      最直接的做法，是干脆不借助任何框架机制，把这几步写进处理函数：进函数先 <code>if (!req.headers.authorization) return res.status(401).end()</code>，紧接着 <code>console.log(req.method, req.url)</code>，然后才开始查库。
    </p>
    <p>
      它做对了一件实实在在的事：<strong>逻辑就摆在业务旁边，谁读这个函数都看得明明白白，没有额外的框架知识要学</strong>。接口只有三五条、维护的人只有一个时，这样写最快也最直观。
    </p>
    <ul>
      <li>同一段鉴权、日志代码在几十个处理函数里复制，改一条规则就要改几十处，漏一处就留下缺口。</li>
      <li>顺序全靠人记忆：日志本该排在鉴权之后、业务之前，谁写反了行为就悄悄变了，而代码里看不出任何异常。</li>
      <li>没有统一切面，就没法「一次声明、处处生效」，这类通用逻辑也很难被单独拿出来验证。</li>
      <li>出错的收尾各写各的，返回结构五花八门，客户端拿到的错误格式都不统一。</li>
    </ul>

    <h2>Express：按注册顺序串起来的中间件链</h2>
    <p>
      Express 给的答案是<strong>中间件（middleware）</strong>。一个中间件就是一个接收 <code>(req, res, next)</code> 的函数，负责请求处理链路中的一段：可以读改 <code>req</code> / <code>res</code>，处理完调用 <code>next()</code> 把控制权交给链条上的下一个，最终命中某个路由并返回响应。于是鉴权、日志这类通用逻辑，就能从处理函数里提出来，各站一段。
    </p>
    <p>
      规则其实只有一条：<strong>中间件按注册顺序执行</strong>。所以鉴权、日志必须用 <code>app.use()</code> 注册在业务路由<strong>之前</strong>，否则请求早被路由处理完了，根本轮不到它们——开场那条「日志一条没打」，就源于此。错误则走向另一头：<strong>错误处理中间件要写成四个参数</strong> <code>(err, req, res, next)</code>，并注册在所有路由<strong>最后</strong>，前面任何一环抛出的异常都会一路传到它这里统一收口。
    </p>
    <p>
      当路由多到一份文件放不下时，用 <code>express.Router()</code> 按前缀分组：把用户相关的接口收进一个 router，再整体挂到 <code>/api/users</code> 上，文件和职责就都清爽了。
    </p>
    <div class="lesson-box warn">
      <strong>一处很容易搞混的地方：</strong>Express 的中间件是<strong>线性 <code>next</code> 传递</strong>，请求一条道走到头；那种「请求先穿进来、响应再穿出去」的<strong>洋葱模型属于 Koa</strong>，别安到 Express 头上。另外，注册顺序就是执行顺序，写反了行为就错，没有任何中间机制会替你纠正。
    </div>

    <h2>Fastify：生命周期钩子与 Schema 驱动的路由</h2>
    <p>
      Fastify 换了组织方式，用<strong>生命周期钩子</strong>取代无限延伸的中间件链。请求进来会依次经过 <code>onRequest</code>、<code>preHandler</code> 等固定阶段，鉴权挂到 <code>preHandler</code>、日志挂到 <code>onRequest</code>，时机由框架承诺，不必再靠注册顺序去保证。往上一层是<strong>插件</strong>：一段封装好的逻辑注册进某个作用域，作用域内的路由共享它，作用域之外互不打扰，比「全局中间件」更适合按模块拆分。
    </p>
    <p>
      它最有特色的是<strong>Schema 驱动路由</strong>。你给路由声明一份 <strong>JSON Schema</strong>，写清 <code>body</code> / <code>querystring</code> 的形态和响应该带哪些字段；框架在<strong>启动阶段就把 Schema 编译成校验函数与序列化函数</strong>。请求进来先校验输入，不合法直接返回 400，业务函数根本不会被调用；返回时再按响应 Schema <strong>序列化</strong>输出，没声明的字段被丢弃——这既是它比逐字段手写更快的原因，也顺手堵住了「内部字段被一并带出去」这类泄漏。
    </p>
    <p>
      日志也内置好了：Fastify 借 <strong>pino</strong> 输出<strong>结构化 JSON 日志</strong>，每个请求带上标识，收集与检索都比到处 <code>console.log</code> 省事得多。
    </p>

    <h2>选型与迁移：先对齐接口，再换内部</h2>
    <p>
      到底选谁没有绝对答案，看两个坐标：<strong>团队熟悉度</strong>和<strong>接口约束强度</strong>。生态成熟、要求最大灵活度、团队本来就用 Express 的，Express 更顺手；接口契约要求严格、想要 Schema 带来的输入校验与序列化加速、还想开箱即得结构化日志，Fastify 更合适。
    </p>
    <p>
      真要换框架，稳妥的路径是<strong>先让行为对齐，再动内部实现</strong>：保持所有路由路径与响应格式完全不变，只把框架换掉，对外表现一模一样；确认没有回归后，再逐步用上 Schema、钩子这些新能力。否则接口行为一变，你分不清是框架的问题，还是接口本身的问题。
    </p>

    <h2>两种框架的路由对照</h2>
    <figure class="lesson-figure">
      <figcaption>在 Express 与 Fastify 之间来回切换，对照同一组路由：一边是逐个 <code>app.use</code> 串起来的中间件链，一边是挂在路由上、由框架在启动期编译的 Schema 声明。</figcaption>
      <D13ExpressFastify />
    </figure>

    <h2>分歧在「请求处理怎么组织」</h2>
    <p>
      两个框架的差别，说到底落在「请求处理如何组织」上：Express 用一条<strong>按注册顺序执行</strong>的中间件链，把鉴权、日志排在业务路由之前，把错误收在末尾的四参数中间件里，路由可用 <code>Router</code> 分组；Fastify 用<strong>生命周期钩子与插件</strong>把时机固定下来，再用 <strong>JSON Schema</strong> 把输入校验与输出序列化变成启动期编译、运行时执行的声明，日志交给内置的 pino。怎么选，看团队熟哪一套、接口约束有多严；迁移时先对齐路由与响应格式，是唯一不会把水和泥沙一起搅起来的做法。
    </p>
    <div class="lesson-term">
      <span class="term-name">「中间件（middleware）」</span>是签名形如 <code>(req, res, next)</code> 的函数，负责请求链路中的一段：读改 <code>req</code> / <code>res</code>，处理完调用 <code>next()</code> 把控制权交给下一个。边界：Express 中间件<strong>按注册顺序</strong>执行，鉴权、日志必须排在业务路由之前，错误处理中间件要用四个参数 <code>(err, req, res, next)</code> 并注册在最后，路由可用 <code>express.Router()</code> 按前缀分组；<strong>「请求穿入、响应穿出」的洋葱模型属于 Koa，不是 Express</strong>。Fastify 则以生命周期钩子与插件替代中间件链，用 JSON Schema 在启动期编译校验与序列化函数。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
