const n=`<script setup lang="ts">
import N10ClientOnly from './N10ClientOnly.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你要在页面里放一个图表，这个库内部会拿 <code>document</code> 去量容器尺寸。本地 dev 跑得好好的，SSR 一开，服务端渲染到图表那一步直接抛出 <code>document is not defined</code>，整个页面变成 500。你只是想「让服务端跳过画图这一小块」，为什么会闹出这么大动静？
    </div>

    <h2>浏览器专属依赖</h2>
    <p>
      接上一课：SSR 里两端的执行环境不同，有些内容天生只能在浏览器里跑——直接操作 DOM 的图表库、依赖 <code>window</code> 与 <code>navigator</code> 的浏览器 API、以及「当前时间」这类动态值。把它们硬塞进 SSR，要么报错，要么 mismatch。旧办法各有代价。
    </p>
    <p>
      直接<strong>整页关掉 SSR</strong>（<code>ssr: false</code>），等于把首屏和 SEO 的收益一起赔了进去；在每个用到的地方写 <code>typeof(window) !== 'undefined'</code> 兜底，逻辑散落各处，而且模板结构两端仍可能对不上；干脆不用这个库，则需求根本做不了。
    </p>
    <p>
      于是问题落到：<strong>能不能只把「确实只能在浏览器跑的那一小块」摘出来、延后到客户端，其余部分照常 SSR？</strong>
    </p>

    <h2>客户端环境判定</h2>
    <p>
      最直接的判断是 <code>import.meta<span>.client</span></code>：在 setup 里写 <code>if (import.meta<span>.client</span>) { ... }</code>，把只该在浏览器执行的逻辑包起来。
    </p>
    <p>
      它做对了一件事：<strong>这是一个编译期常量</strong>。Nuxt 构建时会把它直接替换成 <code>true</code> 或 <code>false</code>，服务端那份产物里的分支会被静态消除，不留下运行时判断的开销。
    </p>
    <p>
      但它只管得住「逻辑」，管不住「模板里那块要渲染的 DOM」。
    </p>

    <h2>模板结构注水失配</h2>
    <ul>
      <li><code>import.meta<span>.client</span></code> 只切 JS 分支。模板里基于它渲染出的结构，在服务端仍会生成一份<strong>不同</strong>的 DOM，照样可能 mismatch。</li>
      <li>在 setup 顶层用 <code>typeof(window) !== 'undefined'</code> 兜底，能防报错，但服务端与客户端首次渲染结构不同，mismatch 依然会发生。</li>
      <li>直接给整个页面加上 <code>ssr: false</code>，就是放弃了前面几课讲的所有 SSR 好处——首屏更快、SEO 可抓。</li>
      <li>当第三方库需要的是「在应用启动时初始化一次」，而你把它塞进某个组件里判断，就会变成每个组件实例都要重复初始化。</li>
    </ul>

    <h2>延迟渲染工具选择</h2>
    <p>
      正确的做法是<strong>按「要推迟的是什么」来选工具</strong>，而不是一把梭。
    </p>
    <ol class="lesson-steps">
      <li>要推迟的是一整块<strong>渲染</strong>（比如图表组件），用 <code>&lt;ClientOnly&gt;</code> 把它包起来，并用 <code>&lt;template #fallback&gt;</code> 给出服务端期间的占位：服务端不执行这块子树，自然不会碰到 <code>document</code>；首屏有占位，客户端接管后再替换成真正的内容。</li>
      <li>占位<strong>要长得像</strong>最终内容。fallback 的结构和尺寸尽量与真实组件相仿，否则内容突然出现时会把周围布局撑开，产生 CLS（累计布局偏移）这种「页面抖一下」的体验。</li>
      <li>只是想<strong>避开某一次浏览器 API 的调用</strong>、而不涉及整块 DOM，用 <code>import.meta<span>.client</span></code> 就够；只是想在挂载之后写一个客户端专属的值（如当前时间、<code>navigator.userAgent</code>），用 <code>onMounted</code> 最轻。</li>
      <li>需要让第三方库<strong>在整个客户端初始化一次</strong>，就把插件命名为 <code>*.client.ts</code>，Nuxt 只在客户端加载它，比在每个组件里判断干净得多。</li>
    </ol>
    <p>
      最后要克制：这些手段本质上都是「绕过 SSR」，用得越多，SSR 的首屏与 SEO 收益就被削得越薄。只对<strong>确有必要</strong>的那部分使用——一个图表可以 ClientOnly，但整页数据没必要跟着一起跳过服务端。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误用：</strong>fallback 占位如果和最终内容差太多，会让页面在渲染完成的一刻<strong>跳一下</strong>（CLS）；为了省事直接给整页 <code>ssr: false</code>，则把首屏体验和 SEO 一起关掉了——客户端专属渲染应该只覆盖那一小块不兼容 SSR 的内容。
    </div>

    <h2>加载前后内容差异</h2>
    <figure class="lesson-figure">
      <figcaption>看左侧「SSR + CSR」与「仅客户端」两行内容在页面加载前后的变化——标着「[服务端跳过]」的那行，就是只有浏览器才会出现的内容；再对照右侧四种客户端专属方案的写法和它们的适用场景表。</figcaption>
      <N10ClientOnly />
    </figure>

    <h2>局部浏览器接管</h2>
    <p>
      客户端专属渲染不是「把 SSR 关掉」，而是「只把不兼容 SSR 的那一小块留给浏览器」：整块内容用 <code>&lt;ClientOnly&gt;</code> 加 fallback 占位，单次 API 调用用 <code>import.meta<span>.client</span></code> 分支，挂载后再写入的值交给 <code>onMounted</code>，需要全端初始化的库用 <code>*.client.ts</code>。用得越少，SSR 的首屏与 SEO 就保留得越完整。
    </p>
    <div class="lesson-term">
      <span class="term-name">「CLS（Cumulative Layout Shift，累计布局偏移）」</span>衡量页面加载过程中<strong>可见元素发生意外位移</strong>的 Web Vitals 指标：某个元素在渲染中途「跳」了位置，分数就会累加。在不兼容 SSR 的部分使用 <code>&lt;ClientOnly&gt;</code> 时，<code>&lt;template #fallback&gt;</code> 的占位必须与客户端最终内容的结构、尺寸相仿，否则占位被替换的那一刻会把周围内容顶开，产生明显的 CLS。边界：占位「矮了」或「空了」都会在替换时引发跳动，可用最小高度等预留空间来避免。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
