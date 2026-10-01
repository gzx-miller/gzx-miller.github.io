<script setup lang="ts">
import N07ExceptionFilter from './N07ExceptionFilter.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>业务代码里只写了一句 <code>throw new NotFoundException('课程 42 不存在')</code>，客户端却收到了一份字段齐全、结构规整的 JSON——这句异常究竟是被谁接住、又是怎么变成响应的？如果换成一句普通的 <code>Error</code>，返回的又会是什么？
    </div>

    <h2>错误分类与响应形态</h2>
    <p>
      你在写课程接口，出错的情形有很多：ID 查不到课程，该回 404；参数不合法，该回 400；数据库连接断了，程序里抛出的却是一句普通的 <code>Error</code>。而前端只想要一件事：<strong>无论哪种错误，都给我一套稳定的结构</strong>（比如 <code>{ code, message, path, timestamp }</code>），好统一弹提示。
    </p>
    <p>
      如果不做统一处理，这些异常会各走各的路：业务里抛的 <code>HttpException</code> 和一句裸 <code>Error</code> 返回的格式并不一致，未捕获的异常甚至会被框架用默认格式吐出去。<strong>前端要针对不同格式写多套解析分支</strong>，维护成本高；更糟的是，默认的错误响应有时会带上堆栈，等于把内部细节暴露给了调用方。不解决它，你要付的代价是：<strong>错误响应的契约不稳定，且不受你控制</strong>。
    </p>

    <h2>逐方法异常捕获</h2>
    <p>
      最省事的做法，是在每个可能出错的方法里手动 <code>try / catch</code>：捕获到异常后，自己拼一个 JSON，<code>res.status(404).json({ code: 404, message })</code> 返回出去。
    </p>
    <p>
      它做对了一件关键的事：<strong>错误结构完全由自己掌控，返回的状态码与消息都是明确的</strong>。在只有一两个会出错的接口时，这个做法直截了当，写出来也看得懂。
    </p>

    <h2>异常分支与格式分散</h2>
    <ul>
      <li><code>try / catch</code> 在每个方法里重复，异常类型一多，分支就越写越乱。</li>
      <li>总有漏网之鱼：某个没被包住的异常会抛出去，返回框架的默认格式，与其它接口不一致。</li>
      <li>状态码与响应体分散在各处，改一次结构要满项目搜，契约很难统一。</li>
      <li>管道做的参数校验也会抛异常（400），它们同样绕过你手写的 <code>catch</code>。</li>
      <li>既想区分「课程不存在」和「服务端崩溃」，又不想在每个 <code>catch</code> 里重复判断类型。</li>
    </ul>

    <h2>全局异常过滤器</h2>
    <p>
      不推翻「构造统一错误」，而是把这件事<strong>从每个方法里提到一个全局的收口点</strong>——这就是异常过滤器（Exception Filter）。它实现 <code>ExceptionFilter</code> 接口，用 <code>@Catch()</code> 声明捕获范围：<code>@Catch(HttpException)</code> 只处理 HTTP 异常，而<strong>空参数的 <code>@Catch()</code> 则捕获所有异常</strong>，正好用来兜底。
    </p>
    <p>
      过滤器通过 <code>ArgumentsHost</code> 拿到响应对象，再把异常统一翻译成 JSON。核心逻辑只有几步：先用 <code>instanceof HttpException</code> 判断异常是否携带标准状态码，是就取 <code>getStatus()</code>，不是就当成 500 兜底；再从 <code>getResponse()</code> 里取出 <code>message</code>，最后 <code>response.status(status).json(...)</code> 输出：
    </p>
    <p>
      <code>@Catch()</code><br />
      <code>export class AllExceptionsFilter implements ExceptionFilter {</code><br />
      <code>&nbsp;&nbsp;catch(exception: unknown, host: ArgumentsHost) {</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;const ctx = host.switchToHttp()</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;const status = exception instanceof HttpException ? exception.getStatus() : 500</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;const message = exception instanceof HttpException ? exception.message : 'Internal server error'</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;ctx.getResponse().status(status).json({ code: status, message, path: ctx.getRequest().url, timestamp: new Date().toISOString() })</code><br />
      <code>&nbsp;&nbsp;}</code><br />
      <code>}</code>
    </p>
    <p>
      有了它，业务代码只需要<strong>抛出带语义的异常</strong>：查不到抛 <code>NotFoundException</code>，参数不对抛 <code>BadRequestException</code>，而响应格式一律交给过滤器。不同异常经同一条管道后，返回的结构完全一致：
    </p>
    <table>
      <thead>
        <tr><th>异常类型</th><th>HTTP 状态</th><th>过滤器处理</th></tr>
      </thead>
      <tbody>
        <tr><td><code>NotFoundException</code></td><td>404</td><td>读取 <code>getStatus()</code> 与 <code>message</code></td></tr>
        <tr><td><code>BadRequestException</code></td><td>400</td><td><code>message</code> 可为错误数组（校验场景）</td></tr>
        <tr><td><code>Error</code>（未包装）</td><td>500</td><td>兜底为 <code>Internal server error</code></td></tr>
      </tbody>
    </table>
    <p>
      还有两点值得记住。其一，<code>HttpException</code> 本身携带标准 HTTP 状态码，<strong>自定义异常可以继承它</strong>，这样既能带上自己的语义，又能复用这套状态码；而且 <code>catch</code> 特定异常类型，还能为它定制响应字段。其二，过滤器是分作用域的：<strong>方法级 <code>@UseFilters</code> 优先于控制器级，控制器级优先于全局</strong>——越靠内越具体，可以在某个接口上临时覆盖全局的兜底行为。
    </p>
    <div class="lesson-box warn">
      别忘了管道：参数校验失败抛出的 400 同样是 <code>HttpException</code>，会被全局过滤器一并格式化成相同的结构。这正是统一过滤器的价值——<strong>不论错误来自业务、来自校验还是完全没预料到，API 契约在所有错误场景下都保持一致</strong>。
    </div>

    <h2>三类异常响应对照</h2>
    <figure class="lesson-figure">
      <figcaption>分别点三个按钮，看不同异常如何被同一个过滤器翻译成结构一致的 JSON 响应。</figcaption>
      <N07ExceptionFilter />
    </figure>

    <h2>响应格式单点收敛</h2>
    <p>
      异常过滤器把「错误长什么样」这件事从业务代码里抽离出来，收敛到一个全局的收口点。业务只管抛出语义化的异常，格式、状态码与兜底逻辑由过滤器统一负责。这样一来，无论错误来自校验、业务还是意外崩溃，前端看到的都是同一套结构，接口契约才真正稳定。
    </p>
    <div class="lesson-term">
      <span class="term-name">「异常过滤器」</span>实现 <code>ExceptionFilter</code>，用 <code>@Catch()</code> 声明捕获范围（空参数捕获所有异常，<code>@Catch(HttpException)</code> 只捕获 HTTP 异常），从 <code>ArgumentsHost</code> 取响应对象统一输出 JSON。用 <code>instanceof HttpException</code> 区分标准状态码与 500 兜底，<code>HttpException</code> 可被自定义异常继承。作用域为方法级 <code>@UseFilters</code> &gt; 控制器级 &gt; 全局；管道校验的 400 也会被统一格式化。
    </div>
  </LessonArticle>
</template>
