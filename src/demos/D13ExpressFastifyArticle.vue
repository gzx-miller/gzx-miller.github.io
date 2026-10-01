<script setup lang="ts">
import D13ExpressFastify from './D13ExpressFastify.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户列表接口上线后，响应里连密码哈希都一起返回给了前端；另一个创建接口，客户端漏传了 <code>email</code>，服务端一声不吭，往库里写了一条空记录——这两件事其实是同一类问题的两个方向。
    </div>

    <h2>提出问题</h2>
    <p>
      你在写一个 Web 服务，每个接口都要做两件「和业务无关、却绝不能出错」的事：<strong>进来的数据要校验</strong>（字段在不在、类型对不对、该拒的拒），<strong>出去的数据要按约定序列化</strong>（只给客户端该看的字段，别把内部字段顺手带出去）。
    </p>
    <p>
      这两件事有个共同点：它们对每个接口都成立，而且一旦漏掉一处就是一个真实事故——校验漏了，脏数据进库；序列化漏了，敏感字段出库。如果把判断分散到几十个处理函数里、靠人记得，出错只是时间问题。所以真正的问题是：<strong>能不能把「输入是什么、输出是什么」从命令式的代码里抽出来，写成一份框架能替你执行的契约？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法，就是在每个处理函数里手写：进来先 <code>if (!req.body.email) return res.status(400).json({ error: 'email required' })</code>，出去前手动挑字段 <code>res.json({ id: user.id, name: user.name })</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>校验和裁剪确实发生了，而且就写在逻辑旁边、改起来最直接</strong>。接口只有一两个、字段只有两三个时，它是最快能跑通的写法。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>同样的校验代码在几十个处理函数里复制，改一条规则要改几十处，漏一处就是一个洞。</li>
      <li>裁剪输出靠手写 <code>res.json({...})</code>，新增一个内部字段时没人会记得同时更新每一处白名单，<code>password</code> 就是这样漏出去的。</li>
      <li>校验规则和接口文档各写各的，两者迟早对不上：文档说必填，代码却没拦。</li>
      <li>把校验、裁剪和业务揉在一个函数里，很难单独验证「契约」这一层是否可靠。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「在请求边界做校验与序列化」，而是改变它们<strong>被表达、被执行的层次</strong>。两条主线各有各的走法。
    </p>
    <p>
      <strong>Express 的答案是中间件链。</strong>它用 <code>app.use()</code> 把横切逻辑按注册顺序串成一条链，请求沿链条被逐层处理，每个中间件改完 <code>req</code> / <code>res</code> 后调用 <code>next()</code> 把控制权交给下一个，命中路由后返回响应。于是校验可以从处理函数里提出来，变成一个通用中间件，鉴权、日志也排在业务路由之前统一起作用。
    </p>
    <p>
      <strong>Fastify 走的是另一条路：声明式 Schema 加生命周期钩子。</strong>你把每个路由的输入与输出写成 <strong>JSON Schema</strong>，框架在<strong>启动阶段就把 Schema 编译成高效的校验函数与序列化函数</strong>，运行时不再逐字段解释——这正是它比手写更快的地方。请求进来先按 <code>schema.body</code> / <code>schema.querystring</code> 验证输入，不合法直接返回 400，业务处理函数根本不会被调用；响应返回时再按 <code>schema.response</code> <strong>序列化</strong>输出，Schema 里没声明的字段会被丢掉，密码这类字段天然出不去。
    </p>
    <ol class="lesson-steps">
      <li>为路由声明 <code>schema</code>：<code>body</code> / <code>querystring</code> 约束输入，<code>response</code> 约束输出。</li>
      <li>启动时框架把 Schema 编译成校验函数与序列化函数（一次性成本，换运行时提速）。</li>
      <li>请求到达：先跑输入校验，失败即 400，不进入业务。</li>
      <li>处理函数返回数据：按 <code>response</code> Schema 序列化，多余字段被过滤掉。</li>
    </ol>
    <p>
      为什么要先补输入、再补输出？因为输入校验拦住的是「脏数据写进系统」，离源头最近；输出序列化拦住的是「内部数据流出去」，防的方向正好相反，缺一不可。而把两者都做成 Schema 的意义在于：契约从代码里的隐含约定，变成了框架启动时就会编译、每次请求都会执行的显式声明——人和机器看的是同一份定义。
    </p>
    <div class="lesson-box warn">
      <strong>一个很容易搞错的区分：</strong>Express 的中间件是<strong>线性 <code>next</code> 传递</strong>——请求一条道走到头；那种「请求先穿进去、响应再穿出来」的洋葱模型属于 Koa，别安到 Express 头上。另外，中间件是<strong>按注册顺序</strong>执行的，鉴权、日志这类通用逻辑必须排在业务路由之前才有效。
    </div>
    <p>
      那到底怎么选？没有绝对优劣，看你的诉求：生态成熟、要灵活、团队熟悉，Express 更顺；接口契约严格、想要 Schema 带来的验证与序列化加速、又需要内置结构化日志，Fastify 更合适。真要切换框架时，稳妥的路径是<strong>先保持路由与响应格式完全不变，让行为对齐，再做内部优化</strong>——否则你分不清变的是框架，还是接口本身。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在 Express 与 Fastify 之间切换，对照同一组路由：一边是逐个 <code>app.use</code> 串起来的中间件链，一边是挂在路由上的 Schema 声明。</figcaption>
      <D13ExpressFastify />
    </figure>

    <h2>总结</h2>
    <p>
      框架的差别，本质是「请求处理的组织方式」不同：Express 用顺序中间件链把通用逻辑串起来，Fastify 用生命周期钩子加 JSON Schema，把校验与序列化变成启动期编译、运行时执行的声明式契约。选型的关键不是谁更强，而是你的接口约束有多严、团队更熟哪一套。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Schema 驱动路由」</span>Fastify 允许在路由上声明 JSON Schema：<code>body</code> / <code>querystring</code> 验证输入，<code>response</code> 约束并序列化输出，并在<strong>启动阶段编译</strong>成校验函数与序列化函数，因而比逐字段手写更快，且只输出 Schema 声明的字段（多余字段被丢弃）。与之相对，Express 以 <code>app.use()</code> 的顺序中间件链组织逻辑，靠 <code>next()</code> 线性传递；需要「请求穿入、响应穿出」的洋葱模型请用 Koa。
    </div>
  </LessonArticle>
</template>
