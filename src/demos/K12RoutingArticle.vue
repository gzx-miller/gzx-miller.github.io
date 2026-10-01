<script setup lang="ts">
import K12Routing from './K12Routing.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一张成员详情页，URL 从 <code>lee</code> 换成 <code>ming</code> 就要展示另一个人，还要顺手挡住那些乱敲出来的无效地址——这些判断到底该写在哪？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个课程站的成员页：希望每个成员都有自己的地址，能直接分享、能被搜索引擎收录，刷新后还能停在同一个人身上；同时，用户手拼出一个不存在的深层地址时，页面不能白屏，而要跳回一个合理的位置。
    </p>
    <p>
      这里藏着两类完全不同的事：<strong>一类是「地址该对应哪个资源」，一类是「这次跳转该不该放行、要不要改写」</strong>。前者是页面和数据的关系，后者是所有页面共享的横切逻辑。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：所有内容都堆在一个页面里，靠查询参数区分，比如用一个 <code>?id=lee</code> 的样子传成员；而权限、非法地址之类的判断，就在每个页面组件里各写一段。
    </p>
    <p>
      这个方案做对了一件基础的事：<strong>它承认地址要能表达「看的是谁」</strong>。只要地址带上了身份，页面就知道该渲染什么，方向是对的。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>查询参数读起来不够直观，路径也不像「一份资源一个地址」。</li>
      <li>深链分享与刷新时，页面初始状态容易和地址对不上。</li>
      <li>权限、登录态、非法地址这些判断散落在每个页面里，改规则要动全身。</li>
      <li>每加一个页面都得手工维护地址与组件的对应，容易漏、容易错。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「地址要表达身份」，而是把它升级成<strong>由框架按目录结构自动生成的路由</strong>。在本项目的 Nuxt 里，<strong>目录和文件名直接映射为 URL</strong>，页面组件无需手写路由表：放一个文件，就多一条地址。
    </p>
    <p>
      地址里变化的那一段交给<strong>动态参数</strong>。像 <code>/vue/k-12/routing/lee</code> 这样的地址，让同一个页面组件承载不同的资源——组件负责布局与逻辑，参数负责说明「此刻是谁」。组件通过 <code>useRoute</code> 读取参数，拿到当前地址里的那段值。
    </p>
    <ol class="lesson-steps">
      <li>用户点击链接，地址从 <code>lee</code> 切换到 <code>ming</code>。</li>
      <li>组件用 <code>useRoute</code> 读出当前地址里的参数。</li>
      <li>参数一变，页面就在同一处组件内切换到对应的成员，无需整页刷新。</li>
      <li>直接访问一个不存在的深层地址，交给中间件按预期重定向。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个容易忽略的点：</strong>路由参数<strong>默认是字符串</strong>，地址里的 <code>2</code> 拿到的也是 <code>'2'</code>，业务使用前要做必要转换和兜底；另外 <code>useRoute</code> 的参数是<strong>响应式</strong>的，监听它的变化就能在同一个页面里处理不同参数，不必重新挂载组件。
    </div>
    <p>
      再往上一步，是<strong>路由中间件</strong>：在跳转真正发生前，集中处理标题设置、权限校验、非法地址重定向这类横切逻辑。它把这些判断从每个页面里请出来，收进一处，新增页面时也自动受到保护。本项目当前路由已经加了 <code>/vue</code> 这一层分类，后续要扩展 <code>/react</code>、<code>/typescript</code> 等知识类别，只需继续沿用这套目录结构。<strong>权限、登录态等全局跳转逻辑不要散落在每个页面组件里</strong>，应当交给中间件统一收口。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换 Lee 与 Ming，观察同一页面如何跟随地址变化；再试试访问无效地址。</figcaption>
      <K12Routing />
    </figure>

    <h2>总结</h2>
    <p>
      路由把「地址」和「页面」对应起来：文件路由让目录结构直接映射为 URL，动态参数让同一个页面承载不同资源，中间件则在跳转前集中处理标题、权限与非法地址。参数默认是字符串、且是响应式的，使用前记得转换与兜底。
    </p>
    <div class="lesson-term">
      <span class="term-name">「路由参数与中间件」</span>指 Nuxt 文件路由按目录与文件名映射 URL，页面无需手写路由表；动态参数（如 <code>slug</code>）让同一页面承载不同资源，由 <code>useRoute</code> 以响应式方式读取。路由中间件则在跳转前集中处理标题、权限、非法地址等横切逻辑，避免这些判断散落在每个页面组件里。路由参数默认是字符串，使用前需转换和兜底。
    </div>
  </LessonArticle>
</template>
