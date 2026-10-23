const n=`<script setup lang="ts">
import N15Caching from './N15Caching.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程详情接口被首页反复调用，你在 Service 里加了缓存：第一次查库、写进缓存，之后直接返回。压测时 QPS 确实上去了，可运营改了课程标题，用户看到的还是旧内容；更奇怪的是，某些时刻请求又突然全部打回数据库，延迟瞬间翻倍。缓存到底该缓存多久、键该怎么写、过期时又该由谁来查库？
    </div>

    <h2>注册缓存模块与注入管理器</h2>
    <p>
      NestJS 的缓存能力由 <code>@nestjs/cache-manager</code> 提供。同步配置用 <code>CacheModule.register({ ttl, max })</code>；需要读配置、连 Redis 或做异步初始化时用 <code>registerAsync</code>，在 <code>useFactory</code> 里返回 store 与默认 TTL。模块注册后，任意 Provider 通过 <code>@Inject(CACHE_MANAGER)</code> 拿到缓存实例。
    </p>
    <p>
      默认 store 是<strong>进程内内存</strong>，适合单实例和本地开发；一旦多副本部署，每个进程各有一份缓存，彼此看不到对方的写入与删除，数据会随负载均衡漂移。要跨实例共享，就把 store 换成 Redis 一类的集中式缓存，让所有实例读写同一份键空间。
    </p>
    <p>
      注册时想清楚两件事：默认 TTL 是「兜底」而不是「精确控制」，具体键可以在 <code>set</code> 时覆盖；容量上限 <code>max</code> 则决定内存缓存能装多少条，超过后按淘汰策略清理，别让缓存把进程内存吃满。
    </p>

    <h2>get / set / del 与 TTL 一致性窗口</h2>
    <p>
      典型用法是 cache-aside：先 <code>cache.get(key)</code>，命中就返回；未命中则查数据库，再用 <code>cache.set(key, value, ttl)</code> 写回；数据变更时 <code>cache.del(key)</code> 主动失效。
    </p>
    <p>
      TTL 的本质是<strong>可接受的一致性窗口</strong>：在过期之前，读到的都可能是旧值。TTL 越长，命中率越高、数据库压力越小，但运营改价、改标题后用户感知的延迟也越长。写后删除能把窗口压到接近零，但它不是强一致：删缓存与数据库提交之间仍有竞态，并发读可能把旧值重新写回。
    </p>
    <ul>
      <li>对时效敏感的数据，优先「更新数据库 → 删除缓存」，并把 TTL 设短，接受短暂不一致。</li>
      <li>对结构变更或批量刷新，用带版本号的键（如 <code>course:v2:...</code>），切换版本比逐条删除更稳妥。</li>
      <li>不要缓存无法失效的外部数据；如果连「旧一点能否接受」都答不上来，就不该给它加缓存。</li>
    </ul>

    <h2>缓存键要覆盖全部维度</h2>
    <p>
      缓存键是缓存的身份证。键少一个维度，不同结果就会互相覆盖。课程详情至少受<strong>课程 ID、语言、租户/权限范围、是否预览草稿</strong>影响；列表页还要加上分页、排序、筛选条件与接口版本。少写一个 <code>tenantId</code>，A 租户就可能读到 B 租户的私有课程——这不是性能问题，而是数据泄露。
    </p>
    <p>
      实践上给键加统一前缀与版本：<code>course:v2:{id}:{locale}:{tenant}:{visibility}</code>。前缀便于按业务清理，版本号让「结构变了」可以整体切走而不必扫描删除。键还要做归一化：参数顺序、大小写、空值默认值不统一，会导致同一个结果被存成多份，命中率白白下降。
    </p>
    <p>
      另一个边界是「不要缓存不该共享的东西」：把用户个人信息塞进公共键，或让缓存键包含随机数、时间戳，都会让缓存要么泄露数据，要么永远不命中。
    </p>

    <h2>穿透、击穿与雪崩</h2>
    <p>
      缓存失效有三种典型形态，处理方式完全不同：
    </p>
    <ul>
      <li><strong>缓存穿透</strong>：请求的数据根本不存在，缓存永远不命中，每次都打到数据库。对策是把空结果也缓存起来，给一个很短的 TTL（如 30 秒），或在入口用布隆过滤器、参数合法性校验先挡掉非法 ID。</li>
      <li><strong>缓存击穿</strong>：某个热点键刚过期，大量并发请求同时未命中，一起回源。对策是 single-flight：同进程内用一张「进行中的 Promise 表」合并相同键的加载；多实例则用 Redis <code>SET NX</code> 分布式互斥，或逻辑过期 + 异步刷新，让旧值先顶上。</li>
      <li><strong>缓存雪崩</strong>：大批键在同一时刻集中过期，或 Redis 整体不可用，流量瞬间压垮数据库。对策是给 TTL 加随机抖动、做多级缓存与预热、对回源做限流与熔断，并为缓存故障准备降级路径。</li>
    </ul>
    <p>
      三者容易被混为一谈，但触发条件不同：穿透是「数据不存在」，击穿是「单个热点键失效」，雪崩是「大量键同时失效或缓存层故障」。先判断属于哪一种，再选对策。
    </p>

    <h2>多实例共享与观测边界</h2>
    <p>
      单机内存缓存的最大问题不是容量，而是<strong>不一致</strong>：实例 A 删了键，实例 B 还留着自己的副本，用户下一次请求落到 B 就继续读旧值。多副本场景应使用 Redis 作为共享缓存，让失效对所有实例同时生效。代价是每次读写多一次网络往返与序列化开销，热键还可能把 Redis 单节点打满。
    </p>
    <p>
      缓存上线后必须能观测：命中率、回源 QPS、回源耗时 P99、键数量与内存占用。命中率突然下降，通常意味着键维度变了、TTL 太短或写入量激增；回源 QPS 飙升则要检查是否出现集中过期或缓存层故障。缓存是性能优化，不是正确性保障——数据库仍要能承受「缓存全部失效」的最坏情况。
    </p>

    <h2>课程详情缓存模拟</h2>
    <figure class="lesson-figure">
      <figcaption>调整 TTL、请求间隔与每轮并发数，观察缓存命中、single-flight 合并与回源次数；把 TTL 调短或把间隔拉长，缓存更容易过期，回源次数随之上升。</figcaption>
      <N15Caching />
    </figure>

    <div class="lesson-box warn">
      <strong>三个易错点：</strong>把 <code>null</code> 与「未命中」混为一谈——空值缓存必须在读取时能区分，否则穿透防护失效；single-flight 只在一个进程内有效，多实例部署仍需分布式互斥；Redis 故障时若直接放行全部回源，缓存层的问题会立刻变成数据库雪崩，必须配合限流与降级。
    </div>

    <div class="lesson-term">
      <span class="term-name">「缓存与性能」</span>用 <code>CacheModule.register</code> / <code>registerAsync</code> 注册缓存，<code>@Inject(CACHE_MANAGER)</code> 后通过 <code>get</code> / <code>set</code> / <code>del</code> 读写，<code>set</code> 的 TTL 决定一致性窗口。缓存键必须覆盖课程 ID、语言、租户、可见性等全部结果维度；写后删除只能缩短不一致，不能保证强一致。穿透用空值短 TTL 或布隆过滤器，击穿用 single-flight 或分布式互斥，雪崩用 TTL 抖动、多级缓存与限流降级。多实例使用 Redis 共享缓存，并持续观测命中率与回源量。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
