<script setup lang="ts">
import S13TanStackQuery from './S13TanStackQuery.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个课程页上，顶部导航和主列表都要显示课程。两个组件各自 <code>useEffect</code> + <code>fetch</code> 拉一遍，页面一打开控制台里就出现两条一模一样的请求；你把列表切走再切回来，它又请求一次。更窘的是你点「乐观报名」给某人 +1，界面立刻变了，可一刷新人数又跳回原样。
    </div>

    <h2>提出问题</h2>
    <p>
      这些数据有个共同点：<strong>它们的「事实来源」在服务器上，本地这份只是抄来的副本</strong>。可你一直用管理本地状态的那套工具在管它——<code>useState</code> 存 <code>data</code>、<code>useEffect</code> 去取。于是几个必须由人承担的成本冒了出来。
    </p>
    <p>
      <strong>两份组件各存一份副本</strong>：谁都不新鲜，也都没法通知对方，一处更新另一处还是旧的。<strong>没有「过期」这个概念</strong>：拿到数据后就一直用，服务端早改了界面还是老的；或者反过来每次挂载都无脑重取，白白费流量。<strong>写操作后要手动找副本</strong>：改完得挨个去更新缓存过这份数据的组件，漏一个就前后不一致。<strong>相同请求没有去重</strong>：页面一复杂，同时发起的重复请求糊满网络面板。
    </p>
    <p>
      所以要回答的是：<strong>服务端数据既然天生是「放在远端、可能过期、别人也会改」的缓存，能不能用一套专门管缓存的机制来管它——按 key 自动去重、按新鲜度决定要不要重取、写入后统一失效对齐？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：还是 <code>useEffect</code> 里 <code>fetch</code>，把结果 <code>set</code> 进 <code>useState</code>，再自己维护 <code>loading</code> / <code>error</code> 两个标志。这个方案做对了一件事：<strong>它明确区分了「加载中、出错、拿到数据」三种界面状态</strong>——这恰恰是本地状态和远程数据混在一起时最容易搞乱的地方。
    </p>
    <p>
      错的地方在于，它把一份远程数据的副本当成了组件的私有财产。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>两个组件各挂一次，就发两次同样的请求；组件一卸载缓存也没了，切回来只能重新请求。</li>
      <li>没有「新鲜度」概念：服务端已经改了数据，本地这份仍旧当新数据用；或者每次挂载都无条件重取，请求频率失控。</li>
      <li>乐观报名点一下界面加了人，一旦请求失败却没有任何回滚，界面和服务端对不上，只能靠刷新「恢复」。</li>
      <li>想手动刷新只能把整页重新挂载，没法只让这一份数据失效——失效的粒度太粗。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「fetch + 三种状态」，而是把远程数据当成<strong>按 key 索引的缓存</strong>，再给它补上过期时间与去重。一层层补下来：
    </p>
    <ol class="lesson-steps">
      <li>先集中策略：用 <code>QueryClient</code> 统一配置 <code>staleTime</code>、<code>gcTime</code> 以及窗口重新聚焦时是否重取，把缓存规则从组件里抽出来，一处可调。</li>
      <li>再给每份数据一个 <code>queryKey</code>：<code>useQuery({ queryKey: ['courses'], queryFn })</code>。key 就是这份缓存在全局的身份证——两个组件写同一个 key 就读同一份缓存，同一时刻只发一次请求，第二个自动复用，去重就此完成。</li>
      <li>再用 <code>staleTime</code> 定义「多久之内算新鲜」：新鲜期内直接命中缓存、不重复请求，过期后才在后台重取。它在请求频率和新鲜度之间给了一个可调的旋钮；<code>gcTime</code> 则决定「没人再订阅这份缓存后多久回收」，免得缓存无限占内存。</li>
      <li>再把写操作改走 <code>useMutation</code>：<code>onMutate</code> 里先把乐观值写进缓存，界面立即响应；<code>onError</code> 回滚到快照；<code>onSettled</code> 让相关 <code>queryKey</code> 失效、重新对齐服务端。这套写入后的标准动作，替代了你手动去挨个找副本。</li>
      <li>最后守住边界：<code>queryKey</code> 必须稳定且能标识查询语义（含筛选参数），否则命中和失效的粒度都会错；失效策略要按数据变化频率设计，太频繁等于缓存白做。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>最容易踩的一脚：</strong>服务端状态和本地 UI 状态要分开管。把远程数据再复制一份进 <code>useState</code> 当「第二事实来源」，就又回到两份副本互相打架的老路——缓存已有的事实来源，界面直接读它。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>盯住顶部的「缓存状态」标签在新鲜 / 过期 / 请求中之间切换，注意「请求次数」计数：点「重新获取」它 +1 并短暂进入请求中；点「标记过期」把它变黄，表示这份缓存不再新鲜；点某一行的「乐观报名」，人数会立刻 +1——代表请求还没回来、界面已经先动了。</figcaption>
      <S13TanStackQuery />
    </figure>

    <h2>总结</h2>
    <p>
      管理服务端数据的难点不在「怎么发请求」，而在「这份远程副本该算新还是旧、谁在读它、写完怎么对齐」。把远程数据当缓存，用 <code>queryKey</code> 给它一个身份，用 <code>staleTime</code> / <code>gcTime</code> 控制新鲜与回收，用 <code>useMutation</code> 的乐观更新与失效收尾写入——组件只管声明「我要读哪个 key」，去重、重取、回滚都由缓存层自动完成。
    </p>
    <div class="lesson-term">
      <span class="term-name">「服务端状态（server state）」</span>指事实来源在远端、本地只持有一份缓存的异步数据。它与本地 UI 状态本质不同：天生异步、可能过期、可能被其他人改动，因此需要「按 key 缓存 + 新鲜度 + 失效重取」的机制，而不是 <code>useState</code>。边界：<code>queryKey</code> 必须稳定且能标识查询语义，否则命中与失效都会错；不要把服务端状态复制成第二条本地 <code>state</code>；<code>staleTime</code> 管请求频率、<code>gcTime</code> 管缓存保留时长，取值要按数据特性定。
    </div>
  </LessonArticle>
</template>
