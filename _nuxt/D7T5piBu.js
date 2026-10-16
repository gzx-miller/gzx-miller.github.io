const e=`<script setup lang="ts">
import N09WebSocketGateway from './N09WebSocketGateway.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>讲师在课堂里发了一条公告，另一个学员的页面却要刷新一下才出现——接收接口明明写得没问题，为什么对方总是「慢了一拍」？
    </div>

    <h2>拉取模式推送缺口</h2>
    <p>
      你在做一个在线课堂：讲师发公告，房间里的学员要立刻看到。后端的查询接口 <code>GET /announcements</code> 完全正常，前端也确实拿到了数据。<strong>问题出在「什么时候去拿」上</strong>——HTTP 是「客户端发问、服务端回答」的模型，服务端没有通道把「有新公告了」这件事主动推给浏览器。
    </p>
    <p>
      于是只剩两条路：让学员手动刷新，体验不可用；或者让浏览器不停地问「有没有新的」。后者看起来能用，但代价藏在看不见的地方——用户不发问的那一刻，变化就永远不会自己送上门。只要业务里有「服务端状态变更需要立刻通知客户端」的成分，这个矛盾就绕不开。
    </p>

    <h2>定时轮询拉取</h2>
    <p>
      最省事的做法：前端用 <code>setInterval</code> 每 3 秒调一次公告列表接口，拿到新数据就渲染，后端一行都不用改。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它承认了「服务端必须把变化告诉客户端」这个需求</strong>。而且实现成本几乎为零——服务端不需要维持任何长连接状态，天然可以水平扩展；如果课堂只有几个人、公告一天没几条，它甚至能长期跑下去。
    </p>

    <h2>轮询间隔与空转开销</h2>
    <ul>
      <li>延迟被轮询间隔锁死：3 秒轮询就有最多 3 秒延迟，想更快只能缩短间隔，请求量成倍上涨。</li>
      <li>绝大多数请求是空跑——没有新公告时白问了，人多的时候这部分全是浪费。</li>
      <li>服务端感知不到「谁在线」，<code>onlineCount</code> 这类状态无从维护，断线也无法立刻发现。</li>
      <li>通信是单向的。学员端的动作（举手、加入房间）只能再开一个接口去表达，链路越堆越长。</li>
      <li>每次请求都要重走一遍完整的 HTTP 头与鉴权流程，长会话场景下的固定开销很明显。</li>
    </ul>

    <h2>双向长连接建立</h2>
    <p>
      不推翻「服务端主动推送」，而是把「反复发问」换成一条<strong>双向长连接</strong>：客户端连上之后连接不断开，双方随时可以往这条连接里写消息——这就是 WebSocket。NestJS 把这类服务抽象成<strong>网关</strong>，它是「长得像控制器、面向 WebSocket 的类」：同样登记在模块里、同样走依赖注入，只是入口从 HTTP 路由换成了消息事件。
    </p>
    <p>
      网关的写法与控制器一一对应：<code>@WebSocketGateway()</code> 声明网关，<code>@SubscribeMessage('joinRoom')</code> 把一个方法绑定到名为 <code>joinRoom</code> 的事件上，<code>@MessageBody()</code> 取消息内容，<code>@ConnectedSocket()</code> 取当前这条连接。客户端发来事件，Nest 找到同名方法执行，返回值再原路回给调用方——本质上仍是「标识 → 方法」的映射，只是传输层从 HTTP 换成了 socket。
    </p>
    <p>
      光有长连接还不够。一个应用里往往同时存在多个课堂，公告不能串台。<strong>房间（Room）</strong>就是用来做隔离的：连接建立后调用 <code>socket.join(roomId)</code> 加入房间，之后用 <code>client.to(roomId).emit('announcement', ...)</code> 广播——注意是 <code>to(roomId)</code> 而不是发给所有人，只有该房间内的连接会收到。讲师发公告时，广播范围被房间限定住，其它课堂互不干扰。
    </p>
    <p>
      连接是有生命周期的，网关提供两个钩子来管理它：<code>handleConnection</code> 在连接建立时触发，<code>handleDisconnect</code> 在断开时触发。前者适合在这里校验 token，无效连接直接拒绝；后者适合清理房间成员与在线人数，否则用户刷新一次页面就会让在线数虚高。
    </p>
    <div class="lesson-box hint">
      <strong>网关的两个附带好处：</strong>其一，它复用同一个 DI 容器，可以直接在网关类里注入 Service，业务逻辑照样下沉到服务里，网关只负责「消息进、消息出」，与控制器保持一致的职责边界；其二，Nest 支持双通道，HTTP 控制器与 WebSocket 网关可以共存在同一个模块中，一套容器同时服务两种入口。
    </div>
    <p>
      最后是<strong>集群</strong>。前面的房间成员与在线人数都存在网关进程的内存里，一旦部署多个实例，学员 A 连在实例一、学员 B 连在实例二，<code>to(roomId).emit()</code> 只能推到同一实例上的连接，跨实例的广播就丢了。解决办法是接入 <strong>Redis 适配器</strong>，让消息经由 Redis 在实例之间转发，把「房间」从单机内存升级为集群共享状态。这是 WebSocket 从单机走向集群必须迈过的一道坎。
    </p>

    <h2>公告广播事件流向</h2>
    <figure class="lesson-figure">
      <figcaption>填入房间与昵称后加入房间，再发一条公告，看事件如何从客户端流向网关并广播回房间。</figcaption>
      <N09WebSocketGateway />
    </figure>

    <h2>主动推送通道改造</h2>
    <p>
      WebSocket 网关解决的是一件事：<strong>把「服务端主动推送」变成一条双向长连接</strong>。事件用 <code>@SubscribeMessage</code> 映射到方法，隔离用房间完成，连接的建立与断开用生命周期钩子管理。它和控制器共享同一套 DI 体系，所以从 HTTP 迁移过去时，变的只是入口，业务代码基本不动。
    </p>
    <div class="lesson-term">
      <span class="term-name">「WebSocket 网关」</span>是 NestJS 对 WebSocket 服务的抽象：<code>@WebSocketGateway()</code> 声明网关，<code>@SubscribeMessage('事件名')</code> 把方法绑定到消息事件，<code>@MessageBody()</code> 取消息数据、<code>@ConnectedSocket()</code> 取连接。用 <code>socket.join(roomId)</code> 加入房间、<code>client.to(roomId).emit()</code> 做房间内广播实现隔离；连接生命周期由 <code>handleConnection</code> / <code>handleDisconnect</code> 管理。多实例部署时房间与在线状态只存在于内存中，需要 Redis 适配器才能跨实例广播。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
