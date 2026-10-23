const e=`<script setup lang="ts">
import N13ProviderScopes from './N13ProviderScopes.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给审计日志加了一个 <code>requestId</code>，想在每条日志里标记它来自哪次请求。可这个服务是单例的，构造函数里根本没有请求对象，只能把第一次请求的 ID 存下来——之后所有请求的日志都带着同一个旧 ID，并发时甚至互相覆盖。为什么「每个请求一份」这么自然的需求，在默认的 Provider 里却做不到？
    </div>

    <h2>Provider 默认单例</h2>
    <p>
      在 NestJS 里，写进 <code>providers</code> 的类默认是<strong>单例作用域（Singleton）</strong>：容器在应用启动时创建一次，此后该模块内所有控制器、所有请求、所有注入方共享同一个实例。这是成本最低的选择——对象只造一次，数据库连接池、配置快照、共享缓存这类昂贵资源不会被反复创建，状态也天然一致。
    </p>
    <p>
      代价是<strong>实例上不能保存请求级状态</strong>。你在单例服务里写 <code>this.currentUser = user</code>，下一个请求进来就会覆盖它；两个请求并发时，后者还可能读到前者的用户。单例适合<em>无状态的计算</em>与<em>跨请求共享的资源</em>，不适合「这次请求是谁、来自哪个租户」这类上下文。要判断一个 Provider 该用什么作用域，先问自己：<strong>这份状态属于应用，还是属于某一次请求？</strong>
    </p>
    <p>
      默认单例还有一个容易被忽略的细节：同一个类如果在两个模块的 <code>providers</code> 里各登记一次，得到的是两个互不相干的实例。想真正共享，必须通过 <code>exports</code> / <code>imports</code> 复用同一份注册，或者声明为全局模块。作用域管的是「实例怎么创建」，模块管的是「实例对谁可见」，两者不能混为一谈。
    </p>

    <h2>请求作用域与 REQUEST 注入</h2>
    <p>
      把声明改成 <code>@Injectable({ scope: Scope.REQUEST })</code>，容器就会为<strong>每次请求创建一个新实例</strong>。同一请求内，多个消费者注入到的是同一个实例；请求结束、响应发出后，实例随之释放。
    </p>
    <ul>
      <li>需要在 Provider 里访问请求对象时，用 <code>@Inject(REQUEST)</code> 注入，可以读到 <code>headers</code>、<code>user</code>、租户标识等。</li>
      <li><code>REQUEST</code> 本身就是一个请求作用域的 Provider，所以注入它的类会自然继承请求作用域。</li>
      <li>实例按「请求上下文（ContextId）」缓存，而不是按注入点缓存——这正是同一请求内多处注入能拿到同一份实例的原因。</li>
      <li>它解决的是「请求隔离」，不解决「并发安全」：实例不再共享，但数据库、Redis 这些外部资源仍然共享。</li>
    </ul>
    <p>
      因此请求作用域最适合承载<strong>请求级上下文</strong>：请求 ID、当前用户、租户、语言、本次请求的追踪信息，以及只在本请求内复用的轻量计算结果。
    </p>

    <h2>瞬态作用域</h2>
    <p>
      <code>Scope.TRANSIENT</code> 是另一种极端：<strong>每次被注入都创建一个新实例</strong>。如果 <code>OrderService</code> 和 <code>ReportService</code> 都注入了瞬态 Provider，它们各自拿到一份，互不影响；同一请求里也不会共享。
    </p>
    <p>
      它适合「每个使用者都需要独立状态」的对象：带缓冲区的日志器、有内部游标的解析器、按消费者定制的策略对象。共享反而会出错时，瞬态是最直接的选择。
    </p>
    <p>
      代价也要算清楚：实例数量会随注入点增长，容器不再替你复用；瞬态实例通常由注入方持有，不要把它当成跨请求缓存，也不要指望它承担全局计数之类的职责。换句话说，<strong>单例是「大家共用一份」，瞬态是「人人各自一份」，请求作用域则是「一次请求共用一份」</strong>。
    </p>

    <h2>作用域沿注入链冒泡</h2>
    <p>
      作用域的影响不止于自己。假设单例的 <code>EnrollmentService</code> 注入了请求作用域的 <code>RequestContextService</code>：容器要让 Service 拿到「本次请求」的上下文，就只能把 Service 也按请求创建。这就是<strong>作用域冒泡</strong>——依赖是请求作用域，消费者也会被推成请求作用域，并继续向上传递。
    </p>
    <p>
      冒泡的后果是链路放大：只要链上有一个请求作用域 Provider，依赖它的控制器、服务乃至更上层的消费者都会变成每请求实例化。NestJS 为此提供了<strong>持久化 Provider（durable providers）</strong>：声明 <code>durable: true</code> 后，同一请求内无论被解析多少次，都只创建一份实例，而不是每条注入链各造一份。它只对请求作用域有意义，也不能突破「每个请求仍有一份」这个前提。
    </p>

    <h2>性能成本与使用边界</h2>
    <p>
      请求作用域不是免费的。每个请求都要实例化整条链，链路越长，CPU 与内存开销越大；控制器与服务不再常驻，垃圾回收压力上升；如果链上还包含请求级数据库连接或 Repository，连接池可能被迅速占满。并发量高时，这些成本会直接体现在延迟与吞吐上。
    </p>
    <ul>
      <li>把重依赖留在单例：连接池、HTTP 客户端、配置对象不应因为「需要请求信息」而变成每请求一份。</li>
      <li>只让轻量上下文进请求作用域，并用 <code>durable: true</code> 收敛同一请求内的重复创建。</li>
      <li>只是想把参数从控制器传到服务，优先显式传参，或用请求上下文存储方案，不必为一个字段改动整条链的作用域。</li>
      <li>请求作用域 Provider 内不要保存跨请求可变状态，也不要依赖「请求结束后还会被复用」。</li>
    </ul>
    <p>
      一句话总结边界：<strong>需要请求隔离的上下文才用 REQUEST，需要消费者隔离的状态才用 TRANSIENT，其余默认保持 Singleton</strong>。作用域是生命周期声明，不是「更安全」的开关；选错方向，代价往往落在并发与性能上。
    </p>

    <h2>三种作用域的实例对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 Singleton / Request / Transient，模拟两次请求，观察 <code>AuditLogger</code> 的实例 ID 是否被复用；再点一次「模拟两次请求」，看新轮次里哪些实例会重新创建。</figcaption>
      <N13ProviderScopes />
    </figure>

    <div class="lesson-box warn">
      <strong>两个反直觉点：</strong>其一，给一个底层工具类加上 <code>Scope.REQUEST</code>，可能把整条调用链都拖成请求作用域，性能影响远大于「只改了一行装饰器」；其二，<code>durable: true</code> 不是「变成单例」，它仍然每请求一份，只是避免同一请求内重复创建。
    </div>

    <div class="lesson-term">
      <span class="term-name">「Provider 作用域」</span>决定 DI 容器何时创建、何时复用 Provider 实例。Singleton（默认）在模块内只创建一次，跨请求共享；<code>Scope.REQUEST</code> 每请求一份，同一请求内经 ContextId 共享，可用 <code>@Inject(REQUEST)</code> 读取请求对象，<code>durable: true</code> 让同一请求内只实例化一次；<code>Scope.TRANSIENT</code> 每个注入方各得一份。作用域会沿注入链向上冒泡：单例依赖请求作用域 Provider 时，自身也会变成请求作用域，因此要把重资源留在单例、把请求上下文限制在轻量 Provider 内。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
