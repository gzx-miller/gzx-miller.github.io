<script setup lang="ts">
import X12Caching from './X12Caching.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>后台里把一篇文章的标题改好了，回到前台刷新，看到的还是旧标题——数据库里明明是新的，页面却像被冻住了，究竟是哪一层缓存把改动挡住了？
    </div>

    <h2>页面缓存层排查</h2>
    <p>
      课程站的文章在后台被编辑：改标题、改正文、点保存，数据已经写进数据库。可回到前台一看，页面纹丝不动。你开始怀疑是不是没保存成功，反复刷新、换浏览器，直到某一次它真的变了——这中间一定有什么东西，在悄悄把旧内容又端了上来。
    </p>
    <p>
      这类问题很难靠猜解决，因为「缓存」在 Next.js 里并不是一层，而是<strong>好几层各管一段</strong>。只有知道一次请求要经过哪几道缓存，才能判断该在哪一层下手去清除它。
    </p>

    <h2>全量禁用缓存</h2>
    <p>
      最直接的想法是：既然怕旧，那就干脆不缓存。每次请求都重新取数据，写成 <code>fetch(url, { cache: 'no-store' })</code>，永远拿最新的。
    </p>
    <p>
      这个方案对的地方很明确——<strong>它牺牲性能换来了确定性</strong>。在「绝对不能看到旧数据」的场景里，这个取舍是合理的，也是排查问题时最值钱的一把尺子：先关掉缓存，确认问题确实来自缓存、而不是别的环节。
    </p>

    <h2>禁用缓存代价</h2>
    <ul>
      <li>全部不缓存，等于把所有压力都丢给后端，页面更慢、成本更高。</li>
      <li>本来几乎不变的内容（如首页文案）也被迫每次重取，纯属浪费。</li>
      <li>「不缓存」只能一刀切，做不到「这一类数据变了才失效」的精细控制。</li>
      <li>它管不到客户端：用户点过的路由在会话内仍可能拿着旧的 RSC 结果。</li>
    </ul>

    <h2>多层缓存分工</h2>
    <p>
      正确的思路不是「全不缓存」，而是<strong>认出有几层缓存、各自负责什么、失效时怎么级联</strong>。Next.js 的缓存从快到慢有四层：
    </p>
    <table>
      <thead>
        <tr><th>缓存层</th><th>范围</th><th>生命周期</th></tr>
      </thead>
      <tbody>
        <tr><td>Request Memoization</td><td>单次渲染内的 fetch 去重</td><td>单次请求</td></tr>
        <tr><td>Data Cache</td><td>fetch 结果的持久缓存</td><td>直到失效或被重新验证</td></tr>
        <tr><td>Full Route Cache</td><td>整条路由的 HTML 与 RSC payload</td><td>构建时生成，随 Data Cache 变化</td></tr>
        <tr><td>Router Cache</td><td>客户端已访问路由的 RSC</td><td>会话内，约 30 秒到 5 分钟</td></tr>
      </tbody>
    </table>
    <p>
      它们不是并列关系，而是有先后与依赖的。<strong>Data Cache 是基础</strong>：它存的是每个 <code>fetch</code> 的结果，跨请求共享。一旦失效 Data Cache，依赖它的 Full Route Cache 会重新生成，Router Cache 也随之失效——这就是级联刷新。理解这条链，开场的困惑就有了答案：改完数据只更新了数据库，缓存层全都没动，页面自然还是旧的。
    </p>
    <p>
      那么怎么主动失效？按用途分成几种：
    </p>
    <ol class="lesson-steps">
      <li>按路径失效：<code>revalidatePath('/blog')</code>，刷新某条路由及其依赖；动态路由可写 <code>revalidatePath('/blog/[slug]', 'page')</code>。</li>
      <li>按标签失效（更推荐）：给 <code>fetch</code> 打上 <code>next: { tags: ['posts'] }</code>，变更后用 <code>revalidateTag('posts')</code> 精确清掉所有带该标签的请求。</li>
      <li>定时失效：用 <code>next: { revalidate: 60 }</code> 或路由级 <code>export const revalidate = 60</code>，适合半静态内容。</li>
      <li>客户端主动刷新：在客户端组件里调用 <code>router.refresh()</code>，清掉 Router Cache 并重新请求服务端。</li>
    </ol>
    <p>
      为什么更推荐按标签而不是按路径？因为<strong>标签描述的是「数据是什么」，路径描述的是「页面在哪」</strong>。一篇文章的正文可能同时出现在列表页、详情页、推荐位上，按标签失效一次就能全部覆盖，按路径则要一处一处列。
    </p>
    <div class="lesson-box warn">
      <strong>排查缓存问题的正确顺序：</strong>不要凭直觉猜，而是逐层关闭对照：先确认 Data Cache 的行为（同一个 <code>fetch</code> 的结果是不是被复用了），再看 Full Route Cache 是否重新生成，最后用 <code>router.refresh()</code> 排除客户端 Router Cache 的干扰。哪一层不动，问题就在哪一层。
    </div>
    <p>
      实践里还要给标签起一套能长期用的名字：像 <code>post-1</code>、<code>post-list</code> 这样「谁变了清谁」的粒度，比笼统地都用 <code>data</code> 有用得多，因为失效的精确度直接决定了你会不会误伤无关的缓存、被迫把本可复用的结果也一起作废。
    </p>
    <p>
      另外，较新的 Next.js 16 引入了 Cache Components（<code>use cache</code>），把缓存从「隐式推断」推向「显式声明」，让「哪段结果被缓存」在代码里一眼可见。它的方向是让缓存更可控而不是更隐蔽，这与上面「逐层认账」的思路是一致的。
    </p>

    <h2>缓存失效级联</h2>
    <figure class="lesson-figure">
      <figcaption>对照四层缓存与几种失效方式，看数据更新后缓存是怎样一层层被击穿的。</figcaption>
      <X12Caching />
    </figure>

    <h2>四层缓存体系</h2>
    <p>
      缓存不是「开或关」一个开关，而是四层各司其职的体系：Request Memoization 管单次渲染去重、Data Cache 管持久结果、Full Route Cache 管整条路由、Router Cache 管客户端会话。失效 Data Cache 会级联刷新上层，所以数据更新后正确的动作是主动 <code>revalidateTag</code> 或 <code>revalidatePath</code>，而不是盲目全关缓存。
    </p>
    <div class="lesson-term">
      <span class="term-name">「四层缓存」</span>指 Request Memoization（单次渲染内相同 URL 的 fetch 去重）、Data Cache（fetch 结果的服务端持久缓存）、Full Route Cache（静态渲染产出的 HTML 与 RSC payload）、Router Cache（客户端会话内已访问路由的缓存，约 30 秒到 5 分钟）。Data Cache 是基础，失效它会级联刷新 Full Route 与 Router 层；可用 <code>revalidatePath</code> 或 <code>revalidateTag</code> 主动失效，客户端用 <code>router.refresh()</code> 清除。
    </div>
  </LessonArticle>
</template>
