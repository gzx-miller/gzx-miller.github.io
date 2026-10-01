<script setup lang="ts">
import N12Microservices from './N12Microservices.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>扣库存的代码放在同一个应用里时，一次方法调用就完事了；可当库存要被第二个应用复用时，它就只能被复制一遍——同一个业务逻辑，为什么非得跨进程存在两份？
    </div>

    <h2>提出问题</h2>
    <p>
      订单服务里有一个 <code>StockService</code>，下单时直接注入调用扣减库存。单应用阶段这很自然：一次方法调用、一个事务、类型全程可见。但随着业务变大，订单和库存的<strong>变化原因和节奏不再相同</strong>：库存要被秒杀、门店、后台等多个入口访问，还要独立扩容、独立发布，而订单侧只想按自己的节奏走。
    </p>
    <p>
      如果它们仍在一个进程里，任何一个模块的内存泄漏、一次发布、一个依赖升级，都会同时影响两边；两边甚至被绑死在同一套技术栈和同一次构建里。你需要的是一种「能力独立、逻辑仍在一起」的组织方式。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：把库存模块作为普通模块导出，订单模块通过 <code>imports</code> 引用它，构造器注入 <code>StockService</code> 后直接调用方法。
    </p>
    <p>
      它做对了一件事：<strong>调用边界是清晰的</strong>——谁提供能力、谁使用能力，被模块的 <code>providers</code> 与 <code>exports</code> 显式声明出来，而不是散落在代码各处。「服务提供方法、调用方只依赖它」这个结构，正是微服务要保留的东西；区别只在于这次调用最终走的是进程内，还是走网络。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>两边必须一起部署、一起扩容：库存压力大时，只能连订单服务一起多开实例，资源浪费。</li>
      <li>故障不隔离：库存侧某处内存飙升或死循环，会把整个订单应用一起拖垮。</li>
      <li>技术栈被绑死：想给库存换一门语言或运行时，等同于重写整个应用。</li>
      <li>复用靠复制：第三个应用要用库存能力时，只能把代码拷一份，逻辑很快出现多个版本。</li>
      <li>边界容易模糊：模块之间互调越来越随意，最终退回成一个「模块化没做好」的单体。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「服务提供能力、调用方只依赖它」，而是把这次调用<strong>从进程内挪到进程之间</strong>。做法是让库存服务用 <code>NestFactory.createMicroservice&lt;MicroserviceOptions&gt;(...)</code> 独立启动，指定 <code>transport: Transport.TCP</code> 与监听端口。它不再是一个 HTTP 应用，而是一个「监听消息、处理消息、回一个响应」的进程。
    </p>
    <p>
      两个进程之间需要约定消息长什么样。NestJS 的做法是把<strong>消息模式（Pattern）</strong>当成寻址方式：服务方用 <code>@MessagePattern({ cmd: 'deduct_stock' })</code> 声明「我来处理这个模式的消息」，方法参数用 <code>@Payload()</code> 取消息体，而<strong>方法的返回值就是回给调用方的响应</strong>。这里没有 HTTP 路由，也没有状态码，匹配依据就是那个模式对象。
    </p>
    <p>
      调用方的入口是 <code>ClientProxy</code>。用 <code>@Client({ transport, options })</code> 声明一个代理并注入到需要调用库存的服务里，再调用 <code>send({ cmd: 'deduct_stock' }, dto)</code> 发起<strong>请求-响应式</strong>调用：消息经 TCP 发到库存服务，服务端匹配到处理器、执行、回传结果，调用方拿到结果后继续自己的流程。这就是一次跨进程的 RPC，只是参数和返回值仍然是普通对象。
    </p>
    <div class="lesson-box warn">
      <strong>第一个必须补上的能力是超时。</strong><code>send()</code> 返回的是一个 <code>Observable</code>，而不是 Promise；进程内调用失败会立刻抛异常，跨进程调用却可能<strong>永远等不到回应</strong>——对方进程挂了、网络断了、请求丢了，调用方会一直悬着。所以要用 <code>pipe(timeout(5000))</code> 设保护，必要时再叠加 <code>retry</code>，最后才转成 Promise 使用。
    </div>
    <p>
      TCP 只是传输层的一种实现。NestJS 把传输层抽象为 <strong>Transport 策略</strong>（TCP、Redis、MQTT、gRPC、Kafka、RabbitMQ 等），业务代码里写的 <code>@MessagePattern</code> 与 <code>send</code> 完全不变，只换 <code>transport</code> 的值：
    </p>
    <table>
      <thead>
        <tr><th>传输策略</th><th>适用场景</th></tr>
      </thead>
      <tbody>
        <tr><td><code>TCP</code></td><td>默认传输，简单可靠，适合内部服务之间的 RPC</td></tr>
        <tr><td><code>Redis</code></td><td>基于发布订阅，适合事件广播与轻量任务</td></tr>
        <tr><td><code>gRPC</code></td><td>强类型契约（<code>.proto</code>），适合跨语言服务</td></tr>
        <tr><td><code>Kafka / RabbitMQ</code></td><td>消息队列，高吞吐事件流与削峰</td></tr>
      </tbody>
    </table>
    <p>
      除了请求-响应，还有第二种消息模式：<code>emit()</code>。<code>send()</code> 会等回执，<code>emit()</code> 发完即走、不等待响应，适合「下单成功后通知积分服务」这类<strong>下游可以异步消费</strong>的场景。两种模式在标识方式上也不同：消息模式用 <code>{ cmd: '...' }</code> 这样的对象描述，事件模式则用一个字符串标识（如 <code>'order_created'</code>）。把非关键路径从 <code>send</code> 改成 <code>emit</code>，主流程就不必再为下游的延迟和故障买单——这是从「同步调用」走向「事件解耦」的关键一步。
    </p>
    <p>
      最后两条经验来自运维现场。其一，TCP 传输<strong>默认端口是 3000</strong>，多个服务挤在同一台机器上必须显式分配不同端口，否则直接冲突。其二，一次下单横跨多个服务，日志分散在各处，<strong>没有统一的 traceId 就无法把一条链路的日志拼起来</strong>，而链路追踪正是排查微服务问题的前提。此外，同步调用会把延迟和故障互相传染，所以超时、重试之外，还要考虑熔断与降级，必要时用事件把强依赖改成弱依赖。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点一次「下单」，跟着日志看消息如何从订单服务经 TCP 发到库存服务、扣减后再带结果返回。</figcaption>
      <N12Microservices />
    </figure>

    <h2>总结</h2>
    <p>
      微服务的核心不是「把应用拆开」，而是<strong>把服务间的调用从进程内搬到进程间，同时保持调用边界清晰</strong>。服务方用 <code>@MessagePattern</code> 声明能处理什么消息，调用方用 <code>ClientProxy</code> 的 <code>send</code> 发起请求-响应调用、用 <code>emit</code> 发送事件，传输层由 Transport 策略决定。网络调用比进程内调用多了不确定性，所以超时、重试、熔断、链路追踪不是可选项，而是配套的基础设施。
    </p>
    <div class="lesson-term">
      <span class="term-name">「微服务」</span>把单体拆成独立进程，用 Transport 策略（<code>TCP</code> / <code>Redis</code> / <code>gRPC</code> / <code>Kafka</code> 等）通信。服务方用 <code>@MessagePattern({ cmd: '...' })</code> 声明消息处理器、<code>@Payload()</code> 取数据，返回值即响应；调用方用 <code>@Client()</code> 注入 <code>ClientProxy</code>，<code>send()</code> 是请求-响应式 RPC、<code>emit()</code> 是不等回执的事件。TCP 默认端口 3000，多服务需错开端口，并保证调用方设置 <code>timeout</code> 容错。
    </div>
  </LessonArticle>
</template>
