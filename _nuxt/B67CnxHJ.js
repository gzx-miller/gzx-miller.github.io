const n=`<script setup lang="ts">
import S01StateBoundaries from './S01StateBoundaries.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把弹窗开关也放进全局 Store 之后，关掉弹窗竟然把搜索框里的关键词一起清空了——两件毫不相干的事，为什么会互相影响？
    </div>

    <h2>页面状态来源</h2>
    <p>
      你在做一个课程平台的一个页面。页面上同时存在好几段状态：点击课程卡片弹出的详情弹窗开没开、用户报名的购物车有几门课、搜索框里输入的关键词、从接口取回的课程列表、用户选的主题偏好，以及报名表单里填到一半的草稿。
    </p>
    <p>
      团队约定「状态统一交给 Store 管理」，于是这六段状态全都进了 Pinia。麻烦很快显现：调试时不知道是谁改的弹窗开关；搜索关键词在刷新后消失，链接分享出去筛选条件也没了；课程列表要自己手写缓存和加载态；表单草稿在离开页面后还赖着不走。这些症状看似各不相同，根子是同一个——<strong>在决定用什么工具之前，没人先问过这段状态本来就属于谁</strong>。
    </p>

    <h2>统一托管全局</h2>
    <p>
      最省事的做法：所有状态一律进 Store。需要就用 <code>useXxxStore()</code> 取出来，反正它是全局可访问的，哪里都能读写，不用考虑传参和跨层通信。
    </p>
    <p>
      这个方案做对了一件事：<strong>它解决了「多个组件都要读写同一份数据」的通信问题</strong>。当一份业务状态确实被好几个页面共享时，把它放进 Store 是最直接、最省事的答案，任何组件都不用来回传 props。
    </p>

    <h2>全局托管代价</h2>
    <ul>
      <li>弹窗开关只有一个组件在用，进了 Store 就变成全局可变状态，任何模块都能改它，出问题时无从追溯改动来源。</li>
      <li>搜索筛选进了 Store，刷新页面立刻丢失，分享出去的链接也带不上筛选条件，而这本来应该是可分享、可回退的状态。</li>
      <li>课程列表本质是服务端数据，塞进 Store 之后，缓存、请求去重、失效、重试、加载态全都要自己重新实现一遍。</li>
      <li>表单草稿进了 Store 会跨页面残留，用户下次进来面对的是一份脏数据，而不是干净的表单。</li>
      <li>组件不再独立：哪怕它只在一个地方用，也必须依赖全局环境才能跑起来，单独测试和复用都变难了。全局可访问，并不等于应该全局存储。</li>
    </ul>

    <h2>归属判定三问</h2>
    <p>
      换一个顺序：<strong>先判断状态归属，再选存储工具</strong>。判断的依据是三件事——这段状态的唯一事实来源在哪、它的共享范围有多大、它的生命周期由谁决定。把开篇那六段状态逐一对齐之后，答案自然分开了。
    </p>
    <table>
      <thead>
        <tr>
          <th>状态</th>
          <th>特征</th>
          <th>唯一事实来源</th>
          <th>推荐工具</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>弹窗开关</td>
          <td>只有当前组件用，是私有 UI 状态</td>
          <td>组件自身</td>
          <td><code>ref</code> / <code>reactive</code></td>
        </tr>
        <tr>
          <td>表单草稿</td>
          <td>提交前的临时数据，无需跨页</td>
          <td>组件内部</td>
          <td><code>ref</code> / <code>reactive</code></td>
        </tr>
        <tr>
          <td>搜索筛选</td>
          <td>刷新与分享都应保持，可前进后退</td>
          <td>地址栏</td>
          <td>路由 <code>query</code> / URL 参数</td>
        </tr>
        <tr>
          <td>主题偏好</td>
          <td>跨会话保持，无需服务端参与</td>
          <td>本地存储</td>
          <td><code>useStorage</code> / 自定义 composable</td>
        </tr>
        <tr>
          <td>课程列表</td>
          <td>来自接口，需要缓存失效与去重</td>
          <td>服务端</td>
          <td>TanStack Query / <code>useFetch</code></td>
        </tr>
        <tr>
          <td>购物车</td>
          <td>多页面读写同一份业务数据</td>
          <td>客户端共享</td>
          <td>Pinia / Zustand / Redux</td>
        </tr>
      </tbody>
    </table>
    <p>
      归属确定之后，决策路径其实可以固化成一条自外向内的排查链，按顺序问下去，答案会自己浮出来。
    </p>
    <ol class="lesson-steps">
      <li>这段状态只在一个组件里用吗？是，留在组件的 <code>ref</code> / <code>reactive</code>，不做全局管理。</li>
      <li>刷新或分享之后是否仍需保持？是，可分享的筛选视图放 URL <code>query</code>，跨会话偏好放本地存储。</li>
      <li>它来自服务端 API 吗？是，交给查询缓存层，让请求去重、失效和加载态由它负责。</li>
      <li>多个页面或组件都要读写同一份业务状态吗？只有到这一步，才应该动用 Pinia，并让组件保持独立。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>一条贯穿始终的原则：</strong>同一份数据只能有一个事实来源。组件、URL、Store、远程缓存各司其职，任何一段状态都要能明确回答「谁才是它的主人」。如果同一份数据同时存在于两处，就要额外编写同步逻辑，而不一致往往就是在那里发生的。
    </div>

    <h2>六场景分层对照</h2>
    <figure class="lesson-figure">
      <figcaption>依次点选六个业务场景，对照右侧的决策流程，看看每段状态最终落在哪一层。</figcaption>
      <S01StateBoundaries />
    </figure>

    <h2>状态边界原则</h2>
    <p>
      状态边界要解决的不是「怎么存」，而是「该谁存」。Store 只应承载需要跨组件共享、具有业务生命周期的客户端状态；其余的私有 UI、临时草稿、可分享筛选、跨会话偏好和远程数据，各自都有更贴合语义的归属。按自外向内的顺序排查一遍，再决定是否动用 Store，状态来源就不会混乱。
    </p>
    <div class="lesson-term">
      <span class="term-name">「状态归属」</span>指在选工具之前先判断一段状态的唯一事实来源、共享范围与生命周期：单组件私有 UI 用 <code>ref</code> / <code>reactive</code>，可分享的筛选视图放 URL <code>query</code>，跨会话偏好放本地存储，服务端数据交给 TanStack Query 一类的缓存层，只有多组件共享且具有业务生命周期的客户端状态才交给 Pinia。记住：全局可访问不等于应该全局存储。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
