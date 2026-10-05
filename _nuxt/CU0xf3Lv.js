const e=`<script setup lang="ts">
import J25FetchApi from './J25FetchApi.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把请求地址故意写错，网络面板里明明红了一片 <code>404</code>，可你精心写的那段 <code>catch</code> 一行都没执行——这个错误究竟跑到哪里去了？
    </div>

    <h2>服务端通信需求</h2>
    <p>
      假设你在做一个列表页，页面一打开就要去服务器取一页用户数据，拿到之后渲染成卡片。这件事的难点从来不在「画卡片」，而在「怎么跟服务器说话」：请求要能指定方法、带上请求头、送出请求体；返回的结果要能读出 JSON；万一失败了，还要能被你的代码感知到。
    </p>
    <p>
      在老式写法里，这些全部由 <code>XMLHttpRequest</code> 承担。它也能干活，但代价是：你要手动注册 <code>onreadystatechange</code>，在回调里判断 <code>readyState === 4</code> 再判断状态码，稍微复杂一点的串行请求就会写成一层套一层的回调金字塔。更麻烦的是，它的事件模型和 Promise、<code>async/await</code> 接不上，你没法用 <code>try/catch</code> 把「请求失败」和「解析失败」放在一起处理。
    </p>

    <h2>请求Promise化</h2>
    <p>
      最省事的做法，就是调用 <code>fetch()</code>，它把一次网络请求直接变成一个 Promise：<code>const res = await fetch(url)</code>。不传任何配置时，它默认发起一个 <code>GET</code> 请求，然后你把结果 <code>await</code> 出来即可。
    </p>
    <p>
      这个方案确实做对了一件很关键的事：<strong>它把「一次网络往返」变成了一个可以被 <code>await</code> 的普通值</strong>。于是「等结果」这件事终于能写进线性的代码里，而不是散落在几十个回调中——这个方向是对的，要保留。
    </p>

    <h2>响应失败不拒绝</h2>
    <ul>
      <li>只会发 <code>GET</code>。要提交数据、要发 <code>POST</code>、要自定义请求头，光靠一个地址做不到。</li>
      <li>最反直觉的一点：<strong>服务器返回 <code>404</code> 或 <code>500</code> 时，这个 Promise 并不会被拒绝</strong>，你的 <code>catch</code> 根本不会触发，程序会以为一切正常。</li>
      <li>拿到的 <code>res</code> 只是一份「响应元信息」，真正的响应体还没读出来；而且 <strong>一份响应体只能读一次</strong>，读完再读就会报错。</li>
      <li><code>fetch</code> 没有内置超时。服务器迟迟不回应，请求就会一直挂着，页面永远停在「加载中」。</li>
      <li>跨域请求默认不会带上 Cookie，需要登录态才能拿到的接口会莫名其妙地返回未授权。</li>
    </ul>

    <h2>配置对象与响应解析</h2>
    <p>
      先解决「怎么发一个非 GET 请求」。<code>fetch()</code> 的第二个参数是一个配置对象，把 <code>method</code>、<code>headers</code>、<code>body</code> 放进去即可：想发 JSON，就把 <code>headers</code> 里的内容类型写成 <code>application/json</code>，再把对象 <code>JSON.stringify()</code> 后放进 <code>body</code>。这套配置也可以先封装成一个 <code>Request</code> 对象，再交给 <code>fetch()</code>，好处是同一份请求参数能够被复用、被传递。
    </p>
    <p>
      接着是最要命的那条：<strong>要把「HTTP 错误」和「网络失败」当成两件事</strong>。只要服务器给出了回应——哪怕它在回应里写着「查无此页」——握手就是成功的，Promise 就会兑现，因为从传输层的角度看这次通信完成了。<code>fetch</code> 只会在「压根没连上」时（断网、DNS 解析失败、跨域被拦）才拒绝 Promise。所以拿到 <code>res</code> 之后，第一件事是检查 <code>res.ok</code>：它的含义正是状态码落在成功区间内。一旦 <code>res.ok</code> 为假，就自己 <code>throw new Error()</code>，把这次失败重新变成一次异常，交给外面的 <code>catch</code>。
    </p>
    <p>
      然后才轮到读响应体。响应体不在 <code>res</code> 的属性里，而要通过 <code>res.json()</code>、<code>res.text()</code> 这些方法去读，它们同样返回 Promise，所以还要再 <code>await</code> 一次。这里有个细节：<strong>响应体是一条一次性数据流，读一次就消耗掉了</strong>。如果你确实需要读两遍，必须在第一次之前先用 <code>res.clone()</code> 克隆一份出来。与此同时，<code>res.status</code> 和 <code>res.headers</code> 随时都能读，用它们取状态码和响应头，不必读完响应体。
    </p>
    <p>
      最后补两个工程上的缺口。Cookie 那边：同源请求默认就会带上凭据，跨域请求则默认不带，需要显式地把 <code>credentials</code> 配置成 <code>include</code>。超时那边：<code>fetch</code> 本身不提供超时选项，得另找一个能「中途掐断请求」的机制来配合——这正是下一课 <code>AbortController</code> 要专门解决的问题。
    </p>

    <h2>状态校验与解析时机</h2>
    <figure class="lesson-figure">
      <figcaption>切换请求方法并故意改动地址，观察代码是怎样先判断 <code>res.ok</code>、再解析响应体的。</figcaption>
      <J25FetchApi />
    </figure>

    <h2>手动判定与超时处理</h2>
    <p>
      <code>fetch</code> 真正改变的，是把「一次网络请求」纳入 Promise 的线性世界；而你要额外做的，是替它补上它故意没做的那几件事——手动判断状态码、手动读取响应体、手动处理超时与凭据。当这三点成为本能，网络层的错误就再也不会被你悄悄吞掉。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Fetch API」</span>是浏览器提供的现代请求接口，调用 <code>fetch()</code> 返回 Promise，默认发起 <code>GET</code>，可通过 <code>method</code> / <code>headers</code> / <code>body</code> 配置，也可复用 <code>Request</code> 对象。要点：HTTP 错误状态码<strong>不会</strong>让 Promise 拒绝，必须检查 <code>res.ok</code>；响应体用 <code>res.json()</code> / <code>res.text()</code> 读取且<strong>只能读一次</strong>，需要二次读取时先用 <code>res.clone()</code>；跨域默认不带 Cookie，需配置 <code>credentials: 'include'</code>；自身无内置超时，需配合 <code>AbortController</code>。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
