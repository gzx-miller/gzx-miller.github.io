const o=`<script setup lang="ts">
import U11PullRefresh from './U11PullRefresh.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在课程列表页快速往下滑，<code>onReachBottom</code> 连着触发了三次，第二页那 20 条被追加了三遍——同一个「事件循环」课程在列表里出现了三行；等你回头一看，下拉刷新还没跑完，它回来的第一页又把已经加载的第三页顶掉了，列表条数从 60 条一下退回 20 条。
    </div>

    <h2>下拉刷新与触底加载</h2>
    <p>
      列表页的数据有两种典型更新：<strong>下拉刷新</strong>对应页面事件 <code>onPullDownRefresh</code>，<strong>触底加载</strong>对应 <code>onReachBottom</code>。前者是「把整份列表换成最新的」，后者是「在末尾接着追加下一页」。它们看起来只是两个回调，但踩下去就是一堆互相打架的状态。
    </p>
    <p>
      旧办法很直白：触底就 <code>page + 1</code> 再请求，拿到数组就 <code>push</code> 进列表。成本藏在三处。第一，<strong>触底事件会连续触发</strong>，你没有东西拦住第二次、第三次，于是同一页被重复请求、重复追加。第二，刷新和加载更多共用一个 <code>page</code>，刷新把它重置成 1，正在跑的加载更多回来后就接错了位置。第三，<strong>数据取完了也没有信号</strong>，触底还在发请求，页面上的「加载中…」永远转着，用户以为卡死。
    </p>
    <p>
      问题于是很清楚：<strong>一个会反复触发、又要区分「替换」和「追加」的加载流程，用什么来保证同一时刻只做一件事、并且知道什么时候该停？</strong>
    </p>

    <h2>分页页码拼接方案</h2>
    <p>
      先写最朴素的一版：在 <code>onReachBottom</code> 里把页码加一，调接口拿下一页，拼接到列表末尾。
    </p>
    <p>
      这个方案做对了一件事：<strong>它只取用户需要的那一页，而不是一次性把几万条全拉回来</strong>。这正是信息流能无限滚动的底座——每次只下载增量，首屏不用等全集，流量和等待时间都按需增长。对「就两页数据」的小列表，这样写已经够了。
    </p>

    <h2>重复触发与页码竞态</h2>
    <ul>
      <li>手指快速上滑时 <code>onReachBottom</code> 会连续触发，每次 <code>page</code> 都加一并发一次请求，同一个第二页被追加三遍，列表出现整段重复项。</li>
      <li>下拉刷新把 <code>page</code> 重置为 1，此时正在跑的加载更多回来，把第 2 页数据追加到了刚换成第一页的列表上，条数不降反增，顺序也乱了。</li>
      <li>数据早就取完了，触底依旧发请求，接口返回空数组，底部「加载中…」一直转，用户以为页面卡住。</li>
      <li>接口返回空列表（新用户没有任何数据）时，页面一片空白，既没有列表也没有任何「暂无数据」的提示。</li>
      <li>刷新请求结束了却忘了调 <code>uni.stopPullDownRefresh</code>，下拉的动画一直挂在那儿弹不回去。</li>
    </ul>

    <h2>加载状态开关引入</h2>
    <p>
      不推翻「分页取增量」，而是给它配一个能描述当前状态的小机器。第一层，先补上<strong>「正在加载」这个开关</strong>：进入加载前把 <code>loading</code> 置为 <code>true</code>，回来后置回 <code>false</code>；触底时先判断 <code>if (loading) return</code>。这就是<strong>防重入</strong>——同一时刻只允许一个加载在跑，连续触底的后几次会被直接挡回。
    </p>
    <p>
      但 <code>loading</code> 只有一个还不够：刷新和加载更多是两件事，共用一个开关会让刷新期间的触底把加载占住，反过来也一样。所以要把它们拆成 <code>refreshing</code> 与 <code>loadingMore</code>，各自独立，并约定「刷新进行中，触底不生效」。
    </p>
    <p>
      第二层，补上<strong>「没有更多了」的终止状态</strong>。用一个 <code>hasMore</code> 记录是否还能继续取：每次拿到一页后判断返回的条数是否少于 <code>pageSize</code>（或直接读后端给的 <code>hasMore</code> 字段），不够一页就把 <code>hasMore</code> 置为 <code>false</code>；触底时先判断 <code>if (!hasMore) return</code>。这样一来不再发无意义的请求，底部文案也能从「加载中…」切成「没有更多了」。
    </p>
    <p>
      第三层，让刷新和加载更多各自维护自己的页码，并把两者的动作区别固定下来：
    </p>
    <ol class="lesson-steps">
      <li><strong>下拉刷新是「重置」</strong>：把 <code>page</code> 归 1、把 <code>hasMore</code> 恢复为 <code>true</code>、拿到第一页后<strong>整体替换</strong>列表（不是拼接）。</li>
      <li><strong>触底加载是「追加」</strong>：<code>page + 1</code>、把新页<strong>拼接到末尾</strong>，不动已有数据。</li>
      <li>两者都只操作自己那份开关，互不覆盖。</li>
    </ol>
    <p>
      「替换」和「追加」是两种完全不同的写操作，这也是为什么它们必须分状态、不能共用一个页码。<span class="lesson-kv">page / hasMore / loading</span> 这三个值合起来，才是那个描述列表当前处于哪一步的<strong>分页状态机</strong>：任意时刻列表只可能是「刷新中 / 加载更多中 / 空闲」三者之一，三者互斥。
    </p>
    <p>
      第四层，补上<strong>空态与收尾</strong>。首屏返回空数组时给出「暂无数据」的空态，而不是让列表凭空消失；每次请求无论成功还是失败，都要在 <code>finally</code> 里把对应开关复位、并让刷新动画收尾（<code>uni.stopPullDownRefresh</code>），否则状态机会卡在「加载中」再也出不来。
    </p>
    <p>
      最后一步别漏：下拉刷新要先在 <code>pages.json</code> 对应页面的 <code>style</code> 里打开 <code>enablePullDownRefresh</code>，否则手势根本不会触发回调——机制写得再好，开关没打开也白搭。
    </p>
    <div class="lesson-box warn">
      <strong>一个必须知道的边界：</strong><code>onReachBottom</code> 只有在页面内容超出屏幕、真正能滚动时才会触发。所以数据很少、凑不满一屏时，触底事件永远不来，第二页也就加载不了。这类「需要凑不满一屏也能继续取」的场景，要改用 <code>&lt;scroll-view&gt;</code> 的 <code>@scrolltolower</code>，自己做局部滚动并监听到底。
    </div>

    <h2>按钮禁用防重入</h2>
    <figure class="lesson-figure">
      <figcaption>点「下拉刷新」会重置到第一页、把最新课程插到顶部；点「滚动到底」会追加两条。注意两个按钮在各自加载中都被禁用了——这就是防重入，试着连点几次，列表只会变一次。</figcaption>
      <U11PullRefresh />
    </figure>

    <h2>互斥状态管理加载</h2>
    <p>
      下拉刷新和触底加载考的不是两个 API，而是<strong>用一组互斥状态把「反复触发」的加载流程管住</strong>：拿 <code>loading</code> 挡住重入，拿 <code>hasMore</code> 判断该不该停，拿各自的页码区分「替换」与「追加」，最后用空态和收尾把状态机每一步都放回原位。
    </p>
    <div class="lesson-term">
      <span class="term-name">「分页状态机」</span>用一组互相排斥的状态（页码 <code>page</code>、是否还有更多 <code>hasMore</code>、是否加载中 <code>loading</code>）描述列表当前处于哪一步，靠状态转移决定这一次触底/刷新该不该真正发请求。边界：<code>loading</code> 用于防重入但刷新与加载更多需分开成两个开关；<code>hasMore</code> 的判定要同时覆盖「返回条数少于 pageSize」和「后端显式给出到底」两种来源；任何请求都必须在 <code>finally</code> 里复位状态，否则会永久卡在「加载中」。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
