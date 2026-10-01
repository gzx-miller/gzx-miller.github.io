<script setup lang="ts">
import X13ParallelRoutes from './X13ParallelRoutes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>后台仪表盘上有概览、统计卡片和通知中心三块数据，其中通知最慢——为什么它一慢，整个页面就都卡着不出来？
    </div>

    <h2>多区域数据耦合</h2>
    <p>
      你在做一个后台首页：主区显示概览，右上角是访问量统计，侧边是通知列表。三块数据来自不同接口，快慢不一。按最直觉的写法，这些内容会挤在同一个页面组件里依次取数、一起渲染。
    </p>
    <p>
      于是体验变成了：本来能秒出的概览，也必须等最慢的通知请求回来才能显示；而且只要任何一块接口报错，整页就一起崩掉。问题不在数据本身，而在<strong>这几块内容被绑成了「一个不可分割的整体」</strong>。
    </p>

    <h2>单组件串行取数</h2>
    <p>
      最省事的做法，是在一个页面组件里把三份数据顺序 <code>await</code> 出来，再一起摆到布局上：概览在上、统计在右、通知在侧。代码集中，结构一眼能看全。
    </p>
    <p>
      它做对的地方是<strong>直观</strong>：所有内容在一个文件里，谁在哪儿一目了然，页面小、数据少的时候维护成本最低。
    </p>

    <h2>长尾延迟与故障传播</h2>
    <ul>
      <li>木桶效应：几份数据一起等，最慢的那块决定了整页的可看时间。</li>
      <li>零容错：任一接口抛错就整页崩，其他本来正常的内容也被连累。</li>
      <li>无法独立骨架：想做「这块先出来、那块先占位」，一个组件里很难办到。</li>
      <li>组件膨胀：随着面板变多，单个文件越来越长，职责全糊在一起。</li>
    </ul>

    <h2>并行路由插槽</h2>
    <p>
      要点不在于把数据取快，而在于<strong>把页面拆成几块能各自独立的区域</strong>。Parallel Routes 给的就是这套机制：用 <code>@</code> 前缀的目录定义「插槽」，插槽会作为 <code>props</code> 传给同一层的 <code>layout</code>。
    </p>
    <p>
      目录长得像这样：<code>app/@analytics/page.tsx</code>、<code>app/@notifications/page.tsx</code>，再加上顶层的 <code>app/layout.tsx</code> 与 <code>app/page.tsx</code>。布局接收同名的 props——<code>analytics</code> 和 <code>notifications</code>——把它们摆到不同位置。
    </p>
    <p>
      其中 <code>children</code> 是主内容，两个插槽各自渲染在侧栏。关键点是：<strong>插槽名就是 prop 名</strong>（<code>@sidebar</code> 对应 <code>sidebar</code>），且插槽<strong>不参与 URL 路径</strong>，它们只决定布局内哪些区域并行渲染。
    </p>
    <p>
      既然拆开了，每一块就能享受各自的「状态文件」：给自己加一个 <code>loading.tsx</code>，这块就能独立流式加载——统计先卡着显示骨架，通知后一点才填上，互不阻塞，整页也不再有木桶效应。
    </p>
    <p>
      容错同理：每块可以有自己的 <code>error.tsx</code>，通知接口挂了，只影响通知那一格，其余照常显示。还有一个专门的文件 <code>default.tsx</code>，负责插槽没被匹配时的兜底内容，比如 <code>@notifications/default.tsx</code> 里返回一句「暂无通知」。
    </p>
    <p>
      插槽还能按条件渲染。比如弹窗类插槽，可以在布局里判断条件后才挂载：当 <code>isModalOpen</code> 为真时才渲染 <code>modal</code> 插槽。这正是拦截路由实现弹窗叠加的基础，也是下一节的主题。
    </p>
    <p>
      可以这样记：<code>children</code> 其实也是一个隐式的插槽，只不过由页面文件直接提供；而 <code>@</code> 目录定义的插槽，是我们额外开出来的并行区域。它们最终都作为 props 汇入同一层布局——布局负责的是「摆位」，各块内容负责的是「自己怎么加载、怎么出错」。
    </p>
    <p>
      <code>default.tsx</code> 的存在感往往在「硬导航」时才显现：当页面被整页刷新，或直接从地址栏访问时，插槽来不及命中任何子路由，若没有兜底内容，Next.js 会因缺少可渲染结果而报错。因此只要用了插槽，通常都要在插槽那一层放一个 <code>default.tsx</code>，让它至少在「没匹配」时也能安静地什么都不显示。
    </p>
    <div class="lesson-box warn">
      <strong>两个易忘的坑：</strong>插槽目录名即 prop 名，<strong>重命名目录必须同步改 layout 的解构</strong>，否则插槽接不到就没内容；另外插槽不进入 URL，所以别指望用地址栏去访问某个插槽——它是布局内部的渲染区，不是独立路由。
    </div>

    <h2>插槽独立加载兜底</h2>
    <figure class="lesson-figure">
      <figcaption>观察主内容与两个插槽如何各自加载、各自兜底，互不拖累。</figcaption>
      <X13ParallelRoutes />
    </figure>

    <h2>布局内独立插槽</h2>
    <p>
      Parallel Routes 解决的是「一个布局里要同时放几块独立内容」的问题：用 <code>@</code> 目录定义插槽，插槽以 props 形式进入 layout，各自拥有 loading、error、default 状态，于是加载、出错、兜底都能按块隔离。它不改变 URL，改变的只是布局内区域的<strong>独立性</strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「并行路由」</span>指用 <code>@</code> 前缀目录定义的插槽，作为同名 props 传入同一层 <code>layout</code>，在同一布局中并行渲染多个独立子路由。插槽不参与 URL，可各自拥有 <code>loading.tsx</code>、<code>error.tsx</code> 与 <code>default.tsx</code>，适合仪表盘等需要独立加载与容错的多面板布局，也常与拦截路由配合实现弹窗。
    </div>
  </LessonArticle>
</template>
