const e=`<script setup lang="ts">
import J27WebSocket from './J27WebSocket.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>聊天窗口里对方发来的消息，你没点任何按钮、也没刷新页面，它就自己冒出来了——浏览器是怎么「知道」服务端有话说？
    </div>

    <h2>服务端主动推送</h2>
    <p>
      假设你在做一个多人协作的看板，或者一个聊天室。这里有一条硬性要求：<strong>服务端产生的新数据，要能主动送到客户端</strong>。别人新增了一张卡片，你的界面就应该立刻多出一张，而不是等你手点刷新才看见。
    </p>
    <p>
      可 <code>fetch</code> 的模型天生是反过来的——它由客户端发起，问一次、答一次，然后连接就结束了。服务端想找你，没有门路，因为它在这次「一问一答」里没有任何主动权。于是你只能让浏览器每隔几秒去问一次「有新消息吗」。这种轮询的代价很实在：大部分请求都在问「没有」，白白消耗流量和服务器资源；而真正的消息，最快也要等到下一次轮询才被看到，始终慢半拍。
    </p>

    <h2>定时轮询实现</h2>
    <p>
      最省事的做法就是轮询：写一个 <code>setInterval</code>，每隔两秒调一次接口，把最新的消息列表拿回来渲染。它不需要服务端配合任何新协议，用现成的接口就能跑起来。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它证明了「客户端持续获取更新」这条路是可行的</strong>，只要不断去问，就总能问到。这个「保持数据同步」的目标要保留，问题出在实现方式上。
    </p>

    <h2>轮询延迟与开销</h2>
    <ul>
      <li>绝大部分请求的答案都是「没有新消息」，流量和服务器的算力被大量浪费。</li>
      <li>延迟固定等于轮询间隔。想更快只能缩短间隔，代价是请求量进一步翻倍。</li>
      <li>每一次轮询都要重新建连接、走一遍 HTTP 头，开销远大于真正传输的那点数据。</li>
      <li>它本质上是单向的「我来问、你来答」，服务端永远无法主动开口，实时性被结构性地限制住了。</li>
    </ul>

    <h2>长连接建立与握手</h2>
    <p>
      问题的根子在于「一问一答、答完就断」。那能不能让这条连接<strong>一直开着</strong>？可以——这就是 <code>WebSocket</code>。它先用一次普通的 HTTP 请求做「升级握手」，服务器同意之后，这条连接就从「一次性」变成了<strong>持久</strong>的双向通道：此后客户端和服务端随时都能往对面推数据，不必谁先问谁才答，这就是所谓<strong>全双工</strong>。延迟从「一个轮询周期」降到了「一次网络往返」。
    </p>
    <p>
      用起来也很直接。先 <code>new WebSocket(url)</code> 创建实例，然后给它挂上几个回调：<code>onopen</code> 在连接建立时触发，<code>onmessage</code> 在有数据到达时触发，<code>onclose</code> 在连接关闭时触发，<code>onerror</code> 处理连接层面的异常。连接一旦 open，就能随时用 <code>ws.send()</code> 发消息。有两个细节必须记住：协议前缀是 <code>ws://</code> 与 <code>wss://</code>（带 <code>TLS</code> 的加密版本，生产环境用它）；<code>onmessage</code> 里拿到的 <code>event.data</code> <strong>是字符串</strong>，如果对面发的是 JSON，你得自己 <code>JSON.parse()</code>。另外，在这些回调里想用外层的 <code>this</code>，记得写成箭头函数，否则 <code>this</code> 会指向别处。
    </p>
    <p>
      不过，双向通道并不是所有场景都需要。如果业务只是「服务端单向播报」——比如股价推送、日志流、运营公告——那么另一套更轻的方案更合适：<code>SSE</code>（Server-Sent Events，服务端推送事件）。它走的就是一条<strong>普通的 HTTP 长连接</strong>，响应类型是 <code>text/event-stream</code>，服务端沿着这条连接不停地把事件推下来，客户端用一个 <code>EventSource</code> 对象接收即可。它的好处是简单，而且 <code>EventSource</code> <strong>自带断线重连</strong>，你几乎不用管网络抖动；缺点也明确——只能服务端到客户端<strong>单向</strong>推送，客户端要上传数据还得另开普通请求。
    </p>
    <p>
      所以选型其实是一句话：需要真正双向、低延迟的交互（聊天、协作、对战）用 <code>WebSocket</code>；只需要服务端单向播报、又想要省心的重连用 <code>SSE</code>。而且要注意，<code>WebSocket</code> 不像 <code>EventSource</code> 那样自动重连，一旦连接断开就得自己处理——生产环境里通常还要补上<strong>重连、心跳和消息队列</strong>这几件事：重连负责在断开后按退避策略重新连上，心跳负责及时发现「假死」的连接，消息队列负责把断线期间没发出去的消息暂存下来，等连上再补发。
    </p>

    <h2>连接事件次序</h2>
    <figure class="lesson-figure">
      <figcaption>连接一个回显服务，发一条消息再关闭连接，观察 open / message / close 三个事件的先后顺序。</figcaption>
      <J27WebSocket />
    </figure>

    <h2>双向通道与单向推送</h2>
    <p>
      <code>WebSocket</code> 要解决的，是「服务端主动开口」这件事：用一次 HTTP 握手换一条一直开着的双向通道，把实时性从轮询的固定延迟里解放出来。当需求只是单向推送时，别忘了还有更轻的 <code>SSE</code>；而当选择了双向通道，也就意味着你要自己补齐重连、心跳和队列这些工程细节。
    </p>
    <div class="lesson-term">
      <span class="term-name">「WebSocket」</span>是一种在 HTTP 升级握手后建立的<strong>持久、双向</strong>通信协议，使用 <code>ws://</code> 与 <code>wss://</code> 前缀，客户端与服务端可随时互发数据。用法是 <code>new WebSocket(url)</code> 并监听 <code>open</code> / <code>message</code> / <code>close</code> 事件，<code>event.data</code> 为字符串、JSON 需自行解析，回调中的 <code>this</code> 需用箭头函数捕获。与之相对的 <code>SSE</code> 是普通 HTTP 长连接（<code>text/event-stream</code>），仅由服务端单向推送但 <code>EventSource</code> 自带断线重连；<code>WebSocket</code> 则需自行实现重连、心跳与消息队列。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
