<script setup lang="ts">
import N06Middleware from './N06Middleware.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把鉴权逻辑写进了中间件，运行时却发现反射不到 <code>@Roles()</code> 的元数据；还有一次忘了调用 <code>next()</code>，请求就一直卡在那里没有响应——中间件究竟站在请求链路的哪一层，它到底能拿到什么、拿不到什么？
    </div>

    <h2>跨路由公共逻辑</h2>
    <p>
      你在维护一个课程平台，每个请求进来都想记一行访问日志，另外还要处理跨域（CORS）、Cookie 解析这些「跟具体路由无关」的事。这些活儿有个共同点：<strong>它们发生在业务之前，而且对所有路由都成立</strong>，跟某个具体接口是查课程还是报名的逻辑没有半点关系。
    </p>
    <p>
      如果不在请求链路的最前面统一处理，这些代码要么塞进每个处理器，要么散落各处重复一遍。更糟的是，日志需要在「匹配到具体路由之前」就记下来，CORS 需要在响应头里提前写入——这些时机是处理器方法内部根本够不着的。不解决它，你要付的代价是：<strong>横切逻辑与业务逻辑搅在一起，时机又对不上</strong>。
    </p>

    <h2>控制器内日志</h2>
    <p>
      最省事的做法，是直接在需要的那几个控制器方法里动手：方法开头写一行 <code>console.log(req.method, req.url)</code>，需要跨域就手动往响应头里塞 <code>Access-Control-Allow-Origin</code>。
    </p>
    <p>
      它做对了一件实在事：<strong>日志和跨域确实被处理了，而且就写在你最熟悉的地方</strong>。接口少、需求临时时，这样最快，改动范围也最小。
    </p>

    <h2>重复日志与时机偏差</h2>
    <ul>
      <li>与路由无关的逻辑却按路由复制，几十个接口就是几十份相同的日志代码。</li>
      <li>时机不对：日志要求「请求刚进来」就记，而处理器执行时路由、参数都已经处理过一轮了。</li>
      <li>CORS、Cookie 解析这类需要直接操作原始 <code>req</code> / <code>res</code> 的活，写进处理器里很别扭。</li>
      <li>没有统一入口按路径批量限定范围，比如「只对 <code>/courses</code> 开头的请求生效」。</li>
      <li>想给整体加一个访问审计时，只能一个个接口补，漏掉一个就是一条盲区。</li>
    </ul>

    <h2>中间件的独立位置</h2>
    <p>
      不推翻「在业务前处理请求」，而是给它一个<strong>独立于路由、又站在最前面的位置</strong>——这就是中间件（Middleware）。它是请求生命周期的最外层，直接操作原始的 <code>req</code> / <code>res</code>，并且<strong>在守卫之前执行</strong>。只写一个 <code>use(req, res, next)</code> 方法，所有匹配到的请求都会经过它。
    </p>
    <p>
      中间件里有一条约定的铁律：处理完必须调用 <code>next()</code> 放行。它相当于把请求交给链路的下一站；<strong>不调用 <code>next()</code>，请求就会一直悬在中间件里，永远不会到达业务</strong>。所以异步逻辑（比如读取 Cookie、写日志）要 <code>await</code> 完成之后再放行。
    </p>
    <p>
      「对哪些路由生效」由 <code>MiddlewareConsumer</code> 声明：<code>consumer.apply(LoggerMiddleware).forRoutes('courses')</code> 让日志中间件只作用于 <code>/courses</code> 开头的请求；想排除某些路由，用 <code>exclude()</code>；而作用到全部路由的全局中间件，直接在启动时用 <code>app.use()</code> 注册。CORS、helmet 这类安全中间件，通常就走全局这条路。
    </p>
    <p>
      真正理解中间件，要把它放回整条请求链路里看。NestJS 把一次请求的处理拆成了环环相扣的几层，像一个洋葱：越靠外的层越「通用」，越靠内的层越「业务」。请求由外向内穿，响应再由内向外返回：
    </p>
    <ol class="lesson-steps">
      <li><strong>中间件</strong>：链路最外层，拿到原始 <code>req</code> / <code>res</code>，记录日志、解析 Cookie，调用 <code>next()</code> 放行。</li>
      <li><strong>守卫</strong>：决定请求是否放行——鉴权与授权在这里做，它能读到完整的 <code>ExecutionContext</code> 和反射元数据。</li>
      <li><strong>拦截器前置</strong>：进入处理器之前的一段逻辑，比如记录开始时间。</li>
      <li><strong>管道</strong>：校验并转换参数，不合法就直接拒绝。</li>
      <li><strong>处理器</strong>：控制器调用服务，执行真正的业务。</li>
      <li><strong>拦截器后置</strong>：用 <code>map</code> / <code>tap</code> 包装响应、统计耗时。</li>
      <li><strong>异常过滤器</strong>：上面任一环节抛出异常，都在这里被捕获并转成统一的错误响应。</li>
    </ol>
    <p>
      看清楚这条链路，「中间件拿不到 <code>@Roles()</code> 元数据」就好解释了：<strong>中间件太靠外，它只有原始的请求对象，没有完整的执行上下文</strong>。而 <code>@Roles()</code> 这类元数据要靠 <code>ExecutionContext</code> 反射出来，这属于守卫的能力范围。所以「涉及角色授权就交给守卫」，不是随口的建议，而是由层次位置决定的职责边界。
    </p>
    <div class="lesson-box warn">
      两个必须记住的点：其一，<code>next()</code> <strong>务必调用</strong>，异步逻辑完成后放行，否则请求会一直悬挂；其二，中间件适合日志、CORS、请求体解析、Cookie 解析这类与路由无关的横切逻辑，<strong>涉及鉴权与授权的判断应写进守卫</strong>，那里才有完整的上下文。
    </div>

    <h2>链路穿透的回合</h2>
    <figure class="lesson-figure">
      <figcaption>点「发送请求」，看请求如何从中间件出发，层层穿过守卫、拦截器、管道与处理器，再沿原路返回。</figcaption>
      <N06Middleware />
    </figure>

    <h2>最外层通用性</h2>
    <p>
      中间件站在请求链路的最外层，用最少的约定（一个 <code>use</code> 方法加一次 <code>next()</code>）把日志、CORS、Cookie 解析这类与路由无关的横切逻辑集中起来。而「洋葱」的真正含义在于分工：每一层只管自己该管的事，越靠外越通用，越靠内越贴近业务。搞清层次，就知道某段逻辑到底该写在哪一层。
    </p>
    <div class="lesson-term">
      <span class="term-name">「中间件与洋葱模型」</span>中间件实现 <code>NestMiddleware</code>，在守卫之前执行、直接操作 <code>req</code> / <code>res</code>，用 <code>apply().forRoutes()</code> 限定生效范围、<code>exclude()</code> 排除路由，全局中间件用 <code>app.use()</code> 注册；<code>next()</code> 不调用会导致请求悬挂。执行顺序为<strong>中间件 → 守卫 → 拦截器前置 → 管道 → 处理器 → 拦截器后置 → 异常过滤器</strong>，请求由外向内穿、响应由内向外返回，越外越通用、越内越业务。中间件拿不到完整的 <code>ExecutionContext</code>，鉴权授权应交给守卫。
    </div>
  </LessonArticle>
</template>
