<script setup lang="ts">
import N08UseAsyncData from './N08UseAsyncData.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>聊天页里，用户点开 A 会话，还没加载完又点了 B，接着又点回 A。三个请求都发出去了，最后屏幕上显示的消息却来自 B——明明你最新点的是 A。代码没错，只是手指比接口快了一点。
    </div>

    <h2>提出问题</h2>
    <p>
      你想在组件里跑一段<strong>不那么简单的异步逻辑</strong>：有时要先算出参数再请求、有时要同时拉好几个接口、有时要对返回结果换算一下再用、有时还得控制「并发时谁生谁死」。最朴素的写法仍然是 <code>onMounted</code> 里 <code>await</code>，而它的代价比想象中多。
    </p>
    <p>
      它在 SSR 阶段不执行，首屏没数据；每处都要重写 loading 与 error；多个请求串行 <code>await</code>，一个慢就拖住整页；更要命的是<strong>竞态</strong>——先发的请求不一定先回来，晚到的旧结果会覆盖新结果，正是开场里 B 顶掉 A 的原因。
    </p>
    <p>
      于是问题落到：<strong>能不能有一个比 <code>useFetch</code> 更底层的 API，让我自己掌控 key、并发策略、数据转换和请求时机？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的写法是：<code>const { data, pending, error, refresh } = await useAsyncData('users', () =&gt; $fetch('/api/users'))</code>。
    </p>
    <p>
      它做对了一件事：<strong>把「异步逻辑」和「响应式状态」拆开了</strong>。你只提供两样东西——一把 key 和一个返回 Promise 的处理函数；至于加载态、错误态、以及结果如何在服务端与客户端之间传递，全交给它。因为 key 由你自己给，你也就第一次有了「控制同一份数据怎么被缓存、怎么被复用」的抓手。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>key 得你自己保证<strong>全局唯一</strong>。两个地方写出相同的 key，后写的会覆盖前者的数据，而且不报错。</li>
      <li>默认情况下，同一个 key 的并发请求可能各跑各的；快速切换时，先发的旧请求后返回，会<strong>覆盖</strong>掉新请求的结果——就是开场的竞态。</li>
      <li>原始响应会被直接写进 <code>data</code>。像 <code>price</code> 以「分」为单位这种事，就得在模板里到处做除法换算，既啰嗦又容易漏。</li>
      <li>数据没回来时 <code>data</code> 是 <code>undefined</code>，模板里直接访问 <code>data.items</code> 会当场报错。</li>
      <li>一个不重要的统计接口若也用默认方式（阻塞导航），整个路由切换都得等它。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻这套用法，而是顺着「key → 并发 → 数据形状 → 时机与缓存」的顺序，一层层补足控制力。
    </p>
    <ol class="lesson-steps">
      <li><strong>手动 key</strong>：给每次获取指定一把<strong>全局唯一的 key</strong>。Nuxt 靠这把 key 做结果缓存与请求去重——这也是它比 <code>useFetch</code> 更底层的地方：key 不再由 URL 自动生成，而是你说了算。</li>
      <li><strong>并发与去重</strong>：要<strong>同时</strong>拉多个接口，别写成上下两句 <code>await</code>（那是串行），而是先分别调用、拿到各自的 Promise 后再统一等待。要处理同 key 的并发冲突，就用 <code>dedupe</code> 指定策略：<code>'defer'</code> 让进行中的同 key 请求<strong>共享结果</strong>，<code>'cancel'</code> 则<strong>取消前一个</strong>、只保留最新一次——开场那种「连点」造成的覆盖，用 <code>'cancel'</code> 就能治好。</li>
      <li><strong>整理数据</strong>：<code>transform</code> 会在写入 <code>data</code> 之前对原始响应做加工（比如把「分」换算成「元」），它的返回值类型就是最终 <code>data</code> 的类型；<code>default</code> 则给 <code>data</code> 一个安全的初始值，让模板在数据到达之前也不会撞上 <code>undefined</code>。</li>
      <li><strong>时机与缓存</strong>：用 <code>useLazyAsyncData</code>（等价于 <code>lazy: true</code>）让请求<strong>不阻塞导航</strong>，请求期间 <code>pending</code> 为真，配合它渲染加载态即可；注意 <code>lazy</code> 只影响「导航要不要等」，并不改变请求什么时候发出，那是 <code>immediate: false</code> 单独控制的，两者含义不同。若要更细地决定「缓存从哪来、命中就不请求」，可用 <code>getCachedData</code> 自定义取缓存的逻辑；需要手动重取时，仍调用 <code>refresh()</code>。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>三个易混点：</strong>key 必须<strong>全局唯一</strong>，撞 key 会静默覆盖数据；<code>lazy</code> 只管导航是否等待、不管请求时机，跳过首次执行要用 <code>immediate: false</code>；<code>default</code> 的返回类型要与最终数据兼容，否则模板里还是会冒出 <code>undefined</code>。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>依次切到「基本用法 / 去重策略 / 数据转换 / Lazy 模式」四个页签，看同一段 <code>useAsyncData</code> 挂上不同选项后代码与行为的差别，再对照底部的 useFetch 与 useAsyncData 对比表。</figcaption>
      <N08UseAsyncData />
    </figure>

    <h2>总结</h2>
    <p>
      <code>useAsyncData</code> 把控制权交还给你：一把手动指定的 key 决定缓存与去重，<code>dedupe</code> 决定并发时共享还是取消，<code>transform</code> 与 <code>default</code> 负责数据形状，<code>lazy</code> 决定导航要不要等。当你需要的不只是「取一个 URL」，而是「编排一段异步逻辑」时，它才是那把更合手的工具。
    </p>
    <div class="lesson-term">
      <span class="term-name">「useAsyncData」</span>比 <code>useFetch</code> 更底层的异步数据 composable：由你<strong>手动提供全局唯一的 key</strong> 和一个返回 Promise 的处理函数，Nuxt 据此完成 SSR/CSR 数据传递、缓存与请求去重。通过 <code>dedupe</code> 控制并发策略（<code>'defer'</code> 共享进行中的同 key 请求、<code>'cancel'</code> 取消旧请求保留新请求）、<code>transform</code> 加工响应、<code>default</code> 提供初始值、<code>lazy</code> 与 <code>useLazyAsyncData</code> 不阻塞导航。边界：key 必须全局唯一，重复即互相覆盖；<code>lazy</code> 只影响是否阻塞导航、不改变请求时机；<code>immediate: false</code> 与 <code>lazy: true</code> 语义不同。
    </div>
  </LessonArticle>
</template>
