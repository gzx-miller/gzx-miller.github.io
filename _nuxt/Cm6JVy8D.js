const o=`<script setup lang="ts">
import J25FetchApi from './J25FetchApi.vue'
import J28AbortController from './J28AbortController.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程搜索框每敲一个字就发一次请求，网速一慢，先发出去的「苹」反而后返回，把刚发出的「苹果」结果覆盖掉了——列表里显示的是上一个关键词的内容，用户只好反复删字重打。
    </div>

    <h2>一个请求的往返</h2>
    <p>
      你想做的是一件小事：向服务器要一份课程列表。最省事的做法是 <code>await fetch(url)</code>——把地址丢进去，等它兑现，拿到的就是结果。它确实做对了一件事：<strong>把「发请求」变成了一个可以直接 <code>await</code> 的动作</strong>，不用再包裹回调，也不用记 <code>XMLHttpRequest</code> 的一串状态码。
    </p>
    <p>
      但要理解它到底返回了什么，得先看清两个对象。你传给 <code>fetch</code> 的是 URL，或一个装着 URL 与配置的 <code>Request</code> 对象；拿回来的是 <code>Response</code> 对象。<code>await fetch(url)</code> 兑现的时机是<strong>响应头到达时</strong>，不是响应体下载完时——所以此刻 <code>Response.status</code> 已经有了，<code>res.ok</code> 也已经确定，正文却还要等下一步去读。
    </p>

    <h2>把配置放进第二参</h2>
    <p>
      只给 URL，等于用最朴素的 GET 去拿资源。一旦要提交表单、带鉴权头或跨域带上 Cookie，这个做法就不够了——它没地方放这些信息。
    </p>
    <p>
      于是 <code>fetch</code> 的第二个参数派上用场：一个配置对象，用 <code>method</code> 声明动词，用 <code>headers</code> 补上元信息，用 <code>body</code> 装请求体。<code>body</code> 必须是字符串或二进制，直接传对象会被悄悄转成 <code>[object Object]</code>，所以要先用 <code>JSON.stringify()</code> 转好，并在 <code>headers</code> 里写明 <code>Content-Type</code>。
    </p>
    <p>
      还有一个常被忽略的开关是 <code>credentials</code>。它默认是 <code>'same-origin'</code>，同源请求自动带 Cookie；跨域时要显式写成 <code>'include'</code>，否则登录态根本传不过去，接口一律回 401。反过来，若接口不需要凭证，用 <code>'omit'</code> 更安全，能减少不必要的凭证暴露。
    </p>

    <h2>状态码不是异常</h2>
    <p>
      朴素做法是：把请求整个包进 <code>try/catch</code>，出问题就交给 <code>catch</code>。在别的地方这也许成立，但在 <code>fetch</code> 这里会失效——<strong>只要服务器回了一个响应，哪怕状态码是 404 或 500，这个 Promise 也是「兑现」，不是「拒绝」</strong>。
    </p>
    <p>
      这其实是个合理的设计：4xx、5xx 只说明这次请求的业务结果，不代表网络层出了问题。可代价是，业务代码必须自己看一眼 <code>res.ok</code>。它的含义很单纯——<code>status</code> 落在 200 到 299 之间就是 <code>true</code>。真正的 <code>catch</code> 只用来接住断网、DNS 失败这类网络错误，以及主动取消。
    </p>
    <p>
      所以稳妥的写法是：先 <code>if (!res.ok)</code> 抛出带状态码的错误，再往下解析正文。这样 404 与断网会走同一个错误出口，但错误信息里带着 <code>res.status</code>，排查时能分清到底属于哪一类。
    </p>

    <h2>响应体只能读一次</h2>
    <p>
      拿到 <code>Response</code> 后，正文要自己读。多数人直接 <code>await res.json()</code>，拿到解析好的对象。这里有个陷阱：<strong>响应体是一段一次性的流，只能被消费一次</strong>。
    </p>
    <p>
      比如你想先打日志再解析，写了两次读取，第二次就会抛出 <code>TypeError: body stream already read</code>。解决办法是<strong>在第一次读取之前调用 <code>res.clone()</code></strong>，保留一份副本，两份各自去读。
    </p>
    <p>
      至于 <code>json()</code> 与 <code>text()</code> 的区别，前者把正文按 JSON 解析成对象，后者原样返回字符串；两者<strong>都返回 Promise</strong>，因为正文此刻可能还在传输，必须异步等待。内容不是合法 JSON 时用 <code>json()</code> 会直接抛错，所以按内容类型选对方法，或先用 <code>text()</code> 拿到原文再决定怎么解析。
    </p>

    <h2>让请求可被中断</h2>
    <p>
      回到开场那个问题：旧结果覆盖新结果，根子在于「请求一旦发出就收不回来」。之前的做法是等它自己回来，再靠一层判断忽略过时的结果——这留住了正确结果，却白白浪费带宽，用户还得等旧请求跑完。更合理的做法，是<strong>让请求本身可以被中断</strong>。
    </p>
    <p>
      <code>AbortController</code> 就是干这个的。它身上有一个 <code>signal</code> 属性，把 <code>{ signal }</code> 放进 <code>fetch</code> 的配置，就等于给这次请求插了一根「取消杆」。之后任何时候调用 <code>controller.abort()</code>，进行中的请求会立刻以拒绝结束，拒绝原因是一个名称为 <code>AbortError</code> 的异常。
    </p>
    <p>
      超时中断就是它的一个现成用法：设一个定时器，到点调用 <code>controller.abort()</code>，请求就会被中断；请求成功返回后记得 <code>clearTimeout()</code> 把定时器撤掉。若不想用定时器，也可以用 <code>Promise.race()</code>，让请求与一个「定时拒绝」的 Promise 赛跑，谁先完成就以谁为准。
    </p>

    <h2>亲手请求与取消</h2>
    <figure class="lesson-figure">
      <figcaption>先改 URL、换成 POST 发一次请求，观察 <code>res.ok</code> 的判断与响应体解析；再发起带超时的请求看被中断的样子。</figcaption>
      <J25FetchApi />
    </figure>
    <figure class="lesson-figure">
      <figcaption>点「超时取消」，观察 <code>AbortError</code> 与其他错误如何被分开处理。</figcaption>
      <J28AbortController />
    </figure>

    <h2>区分取消与失败</h2>
    <p>
      中断带来一个新问题：<code>catch</code> 里怎么分清这次是「主动取消」还是「真的网络失败」？办法是看错误的 <code>name</code>——<code>AbortError</code> 表示主动取消，此时不该弹「网络异常」的提示，静默处理即可；其余错误才按真正的失败对待。
    </p>
    <p>
      回到搜索联想，完整做法是：每次发请求前，先把上一次的 <code>controller</code> 调 <code>abort()</code> 取消，再为本次请求新建一个 <code>AbortController</code>。被取消的旧请求会走进 <code>catch</code> 的 <code>AbortError</code> 分支被安静丢掉，不会再有机会把旧结果写进列表。
    </p>
    <p>
      不过要留意一点：<code>abort()</code> 不是瞬时生效的，已经返回、只差写入的那次旧结果仍可能到达。所以除了取消旧请求，通常还要用一个「请求序号」或「当前 controller 是否仍是最新」的判断兜底，双保险才能彻底避免旧的覆盖新的。
    </p>
    <div class="lesson-term">
      <span class="term-name">「AbortSignal」</span>是 <code>AbortController</code> 派生的信号对象，把它通过 <code>signal</code> 传给 <code>fetch</code> 等 API，调用 <code>controller.abort()</code> 后关联操作会以 <code>AbortError</code> 拒绝。它把「取消」从一个善后判断，变成了请求自身的一种可中断能力。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
