<script setup lang="ts">
import N05Interceptors from './N05Interceptors.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>二十个接口都要返回同一套 <code>{ code, data, timestamp }</code> 外壳，你在每个控制器方法里各写了一遍；产品突然说「再加一个 <code>duration</code> 字段」，你只能挨个接口改过去——有没有办法不改业务代码，就把响应统一包装起来？
    </div>

    <h2>统一响应契约</h2>
    <p>
      你在写一个课程 API。前端和运维都跟你有约定：所有响应必须是 <code>{ code, data, timestamp }</code> 的统一结构，方便前端一处解包；同时线上想统计每个接口的耗时，好在监控里看出哪个接口变慢了。
    </p>
    <p>
      这两件事本身都不难，难的是它们<strong>和业务无关，却要在每个接口上各发生一次</strong>。接口只有两三个时，顺手在返回值里包一层、在方法开头记一个时间戳就完了；可当接口涨到几十个，同一段包装代码就复制了几十份，契约一变就得全线回归，还总有人漏改。不解决它，你要付的代价是：<strong>契约的统一性靠自觉维护，而不是靠框架保证</strong>。
    </p>

    <h2>手动包装与计时</h2>
    <p>
      最省事的做法，是在每个处理器里手动完成：方法开头写 <code>const started = Date.now()</code>，返回前把结果包成 <code>{ code: 0, data, timestamp, duration }</code>。
    </p>
    <p>
      它做对了一件很关键的事：<strong>响应确实被统一打包了，耗时也确实被记了下来</strong>。在接口数量少、结构还稳定的时候，这个做法完全够用，逻辑还全在一处，读起来一目了然。
    </p>

    <h2>样板代码的重复</h2>
    <ul>
      <li>样板代码在每个处理器里重复，几十个接口就是几十份几乎相同的包装逻辑。</li>
      <li>契约一变（加字段、改字段名）就得全量修改，极易漏改，回归成本高。</li>
      <li>耗时统计、日志这类与业务无关的代码混进业务方法，职责边界被打破。</li>
      <li>想给<strong>所有接口</strong>统一加一层缓存、审计或限流时，找不到共同的入口，只能再复制一遍。</li>
    </ul>

    <h2>拦截器的位置</h2>
    <p>
      不推翻「包装与记时」，而是把它们从业务方法里<strong>搬到一个能同时看到「请求」与「响应」的位置</strong>——这正是拦截器（Interceptor）要解决的问题。它是一类横切关注点的织入点：在不修改业务代码的前提下，于处理器执行的前后各插一段逻辑。
    </p>
    <p>
      拦截器的关键在于它<strong>基于 RxJS 的 Observable 模型</strong>。它拿到的不是一个处理器，而是一个 <code>next</code> 句柄；调用 <code>next.handle()</code> 得到的是处理器结果的<strong>数据流</strong>（<code>Observable&lt;any&gt;</code>），而不是结果本身。于是「前置」与「后置」就有了明确的位置：
    </p>
    <p>
      <code>intercept(context: ExecutionContext, next: CallHandler): Observable&lt;any&gt; {</code><br />
      <code>&nbsp;&nbsp;const started = Date.now()</code><br />
      <code>&nbsp;&nbsp;return next.handle().pipe(</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;map((data) =&gt; ({ code: 0, data, timestamp, duration })),</code><br />
      <code>&nbsp;&nbsp;)</code><br />
      <code>}</code>
    </p>
    <p>
      <code>next.handle()</code> 之前的代码（记录开始时间）在处理器之前运行；<code>pipe</code> 里挂上的 <code>map</code> 在处理器之后运行，负责把返回值包成统一结构。前后两段写进同一个方法，中间隔着一次 <code>handle()</code> 调用——这就是「在处理器前后织入」的准确含义。
    </p>
    <table>
      <thead>
        <tr><th>操作符</th><th>作用</th><th>典型场景</th></tr>
      </thead>
      <tbody>
        <tr><td><code>map</code></td><td>转换返回值，改变流里的数据</td><td>统一响应包装</td></tr>
        <tr><td><code>tap</code></td><td>只做副作用，不修改数据</td><td>日志、耗时统计、埋点</td></tr>
      </tbody>
    </table>
    <p>
      把计时改用 <code>tap</code> 更贴切：日志不需要改变返回值，用 <code>tap</code> 记一句耗时即可，数据本身原样通过。厘清 <code>map</code> 与 <code>tap</code> 的分工，是写拦截器时最容易被忽略的一点。
    </p>
    <p>
      再往下走有两个值得记住的扩展。其一，<strong>多个拦截器按注册顺序执行</strong>，处理器返回的数据流会依次穿过每个拦截器的 <code>pipe</code>——你注册了包装拦截器与计时拦截器，它们就按顺序各包一层。其二，拦截器可以直接返回一个 <code>new Observable()</code>，在内部决定是否调用 <code>next.handle()</code>——命中缓存时干脆跳过处理器，直接把缓存数据流出去，这就是<strong>请求级缓存</strong>的实现方式。
    </p>
    <div class="lesson-box hint">
      拦截器与守卫、管道是互补的三层：<strong>守卫</strong>决定请求「能不能进」（放行决策），<strong>管道</strong>决定参数「合不合法」（校验转换），<strong>拦截器</strong>决定「进出的前后怎么处理」（包装、计时、缓存）。各管一段，职责分明。
    </div>

    <h2>请求前后执行序</h2>
    <figure class="lesson-figure">
      <figcaption>点「发起请求」，看拦截器的前置、处理器与后置 <code>map</code> 依次执行，最后收拢成统一响应。</figcaption>
      <N05Interceptors />
    </figure>

    <h2>横切逻辑收敛</h2>
    <p>
      拦截器把「响应包装、耗时统计、日志、缓存」这类横切关注点从业务方法里抽了出来，收敛到一处。它借助 Observable 数据流，在 <code>next.handle()</code> 前后分别织入前置与后置逻辑，让业务代码只关心业务。契约的稳定因此不再靠自觉，而是由框架的织入点来保证。
    </p>
    <div class="lesson-term">
      <span class="term-name">「拦截器」</span>实现 <code>NestInterceptor</code>，基于 RxJS 的 Observable 模型：<code>next.handle()</code> 返回处理器结果的数据流（<code>Observable&lt;any&gt;</code>），其<strong>之前</strong>的代码在处理器前运行，<code>pipe</code> 里的 <code>map</code>（转换返回值）与 <code>tap</code>（只做副作用）在处理器后运行。多个拦截器按注册顺序依次穿过，返回 <code>new Observable()</code> 可实现请求级缓存；它与守卫（放行）、管道（校验）关注点互补。
    </div>
  </LessonArticle>
</template>
