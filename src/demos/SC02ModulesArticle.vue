<script setup lang="ts">
import SC02Modules from './SC02Modules.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我在令牌文件和卡片文件里各写了一遍同名的 <code>$radius</code>，编译一路顺利通过，可线上圆角时而大时而小——到底是哪一个赢了，凭什么由它赢？
    </div>

    <h2>跨文件成员可见性</h2>
    <p>
      样式规模一涨，拆文件几乎是本能反应：令牌一份、按钮一份、卡片一份、页面入口一份。可拆开之后，一个问题立刻浮上来——<strong>文件之间怎么互相看见对方的变量和 Mixin？</strong>
    </p>
    <p>
      如果答案是「谁都能看见谁」，那么每个文件的内部实现就全变成了公共财产。改一个内部辅助变量的名字，会悄无声息地打断另一个文件；两处不小心用了同名变量，谁都察觉不到，最终的取值取决于编译时的加载顺序。这套问题在小项目里不会痛，因为文件少、心智清楚；一旦超过十几个文件，<strong>「这个变量到底从哪来」就变成了要靠全文搜索来回答的问题</strong>，而这正是依赖关系没有被显式表达出来的代价。
    </p>

    <h2>全局作用域引入</h2>
    <p>
      最朴素的做法是用 <code>@import</code>：在入口里把各个文件依次引入，被引入文件的成员就全都流进同一个全局作用域，此后任何地方都能直接用 <code>$brand</code>，连前缀都不用写。
    </p>
    <p>
      它做对的地方值得承认：<strong>顺序即语义，写法极短</strong>。在只有两三个文件的阶段，这套「平铺」模型足够用，也最符合直觉——毕竟它模拟的就是「把几段文本拼到一起」这件事。
    </p>

    <h2>静默覆盖与私有性</h2>
    <ul>
      <li>它没有命名空间。所有成员都挤在一个大池子里，重名即静默覆盖，而谁覆盖谁由加载顺序决定，读代码根本看不出来。</li>
      <li>它没有私有性。一个文件里临时用的辅助变量，外部可以随手引用，于是「内部实现」被无意中变成了「对外契约」，改名就成了一次破坏性变更。</li>
      <li>重复引入会导致<strong>重复输出</strong>：同一个文件被多处 <code>@import</code>，它里面的 CSS 规则就会被老老实实编译多份，产物白白变大。</li>
      <li>依赖方向不可查。看一行 <code>$brand</code> 的用法，无法知道它来自哪个文件，也无法判断改动它会波及谁。</li>
      <li>更关键的是，<code>@import</code> 已经被官方弃用——继续沿着它组织代码，等于把技术债预支给了未来。</li>
    </ul>

    <h2>模块边界与契约</h2>
    <p>
      不推翻「拆文件」，而是给文件之间加上<strong>边界与契约</strong>。现代 Sass 的答案就是模块系统：<code>@use</code> 负责引入，<code>@forward</code> 负责重新导出。
    </p>
    <p>
      <code>@use 'tokens'</code> 引入一个模块后，它的成员必须通过<strong>命名空间</strong>访问，写成 <code>tokens.$brand</code>。这一条约束换来的东西很多：来源一目了然，重名不再互相干扰，读代码的人一眼就知道这个值属于哪个模块。同时，<strong>每个模块只会被加载一次</strong>，无论有多少文件 <code>@use</code> 它，都不会重复输出。需要换一个更顺手的名字时用 <code>as</code> 指定别名；而 <code>as *</code> 会移除命名空间，让成员回到裸名字——只有在成员明确、且确认没有冲突时才考虑，否则等于把刚关上的门又打开了。
    </p>
    <p>
      边界还体现在可见性上：以 <code>-</code> 或 <code>_</code> 开头的成员被视为<strong>私有</strong>，外部不可引用。于是你可以放心把内部辅助变量命名成 <code>$-internal-gap</code>，它只有在模块内部可见，对外不会成为契约，改名也不再是破坏性变更。这正是「内部实现」与「公共 API」第一次被语言层面区分开。
    </p>
    <p>
      剩下的问题是：一个样式库有几十个模块，使用方难道要逐个 <code>@use</code> 吗？不需要。用 <code>@forward</code> 在其他模块的成员之上做一次<strong>筛选后重新导出</strong>，把这些模块聚合成一个入口文件：
    </p>
    <ol class="lesson-steps">
      <li>把令牌与组件拆成独立 partial，各自只关心自己的职责。</li>
      <li>在需要复用别人的地方用 <code>@use</code> 加命名空间引用其成员。</li>
      <li>把内部辅助成员以 <code>$-</code> 前缀隐藏起来，不让它们流到外部。</li>
      <li>用 <code>@forward</code> 在 <code>_index.scss</code> 汇总公共 API，配合 <code>show</code> 或 <code>hide</code> 只转发该暴露的那部分。</li>
      <li>应用侧只 <code>@use</code> 这一个入口文件，从此不再关心内部结构。</li>
    </ol>
    <p>
      注意 <code>@use</code> 必须写在其它规则之前，配置与引入都发生在文件顶部。除了聚合成入口，现代 Sass 推荐用 <code>show</code> / <code>hide</code> 收窄导出面——只把真正打算公开的成员暴露出去，减少命名空间污染和误用机会。旧项目迁移时不必手工改，官方提供了 Sass Migrator 完成这套机械替换。
    </p>
    <div class="lesson-box hint">
      <strong>一句话判断：</strong>如果一处引用看不出它来自哪个文件、改它会影响谁，那就是模块边界没画清。<code>@use</code> 用命名空间回答「从哪来」，<code>@forward</code> 用筛选导出回答「对外承诺什么」。
    </div>

    <h2>命名空间前缀对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换命名空间写法，对比 <code>tokens.$brand</code> 与裸名字 <code>$brand</code> 的区别。</figcaption>
      <SC02Modules />
    </figure>

    <h2>依赖图与公共接口</h2>
    <p>
      模块系统把「一堆互相偷看内部变量的文件」变成了「一张有方向、有边界的依赖图」。命名空间让来源显式，私有成员让实现自由，<code>@forward</code> 让公共 API 收窄且稳定——过去靠约定维持的隐式全局依赖，如今由语言本身保证。
    </p>
    <div class="lesson-term">
      <span class="term-name">「模块系统」</span>指 <code>@use</code> 与 <code>@forward</code> 组成的依赖机制。<code>@use</code> 让每个模块只加载一次，成员经「命名空间.成员」访问，不污染全局，并可用 <code>as</code> 指定别名（<code>as *</code> 会移除命名空间，仅在成员明确且无冲突时使用）；以 <code>-</code> 或 <code>_</code> 开头的成员视为私有，外部不可引用；<code>@forward</code> 把其他模块的成员筛选后重新导出，可配合 <code>show</code> / <code>hide</code> 与配置项，用来搭建样式库稳定的公共 API。<code>@use</code> 必须写在其它规则之前，旧的 <code>@import</code> 已弃用。
    </div>
  </LessonArticle>
</template>
