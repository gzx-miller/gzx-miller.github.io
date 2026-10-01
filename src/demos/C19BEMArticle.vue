<script setup lang="ts">
import C19BEM from './C19BEM.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只想把课程卡片里标题的字重调一下，改了一条 <code>.title</code>，结果列表页、详情页、侧边栏的标题全跟着变了——同一个类名，凭什么到处都在用？
    </div>

    <h2>相似卡片冲突</h2>
    <p>
      设想你在维护一套课程站的卡片组件：课程卡片、讲师卡片、文章卡片长得差不多，都是「标题 + 描述 + 角标」的结构。第一版很好写，你随手写下 <code>.card .title</code>、<code>.card .desc</code>，页面立刻有了样子。
    </p>
    <p>
      麻烦在三个月后出现。产品要加一种「专栏卡片」，它复用了 <code>.title</code> 这个类名；你为了让专栏标题变粗，写了 <code>.column .title</code>；隔壁同事要评论标题变灰，又写了 <code>.comment .title</code>。从此每次调整「标题」，你都得先把全站所有叫 <code>title</code> 的地方数一遍。<strong>不掌握命名与组织方法的代价，就是样式表会随着功能叠加不断互相污染：改一处、坏一片，删一个类名要先搜索整个项目，最后所有人靠 <code>!important</code> 硬压。</strong>这不是审美问题，而是「一个项目能不能被多人长期维护」的问题。
    </p>

    <h2>后代选择器写法</h2>
    <p>
      最朴素的做法，就是顺着 HTML 结构写后代选择器：卡片是 <code>.card</code>，标题是它下面的 <code>.title</code>，于是 <code>.card .title { font-weight: 600 }</code>。
    </p>
    <p>
      它做对了一件重要的事：<strong>样式与结构对得上号</strong>。读代码的人一眼就能把这条规则映射回 DOM，不需要任何额外约定；在只有一个卡片组件的早期项目里，这套写法又快又直观，完全够用。这一点值得先承认——后面所有的改动，都是在保留它「一眼看懂」优点的前提下，解决它管不住范围的问题。
    </p>

    <h2>绑定DOM代价</h2>
    <ul>
      <li>选择器绑死了 DOM 结构，一旦把标题从 <code>.card</code> 内部挪到外层，样式整段失效。</li>
      <li>后代选择器会叠加特异性，<code>.card .title</code> 压不过 <code>.card .header .title</code>，越写越长，最后只能上 <code>!important</code>。</li>
      <li><code>.title</code>、<code>.desc</code> 这种通用类名跨组件撞名，谁也不知道自己改的到底是哪一个。</li>
      <li>结构与皮肤写在一起，同一个媒体对象换一套配色就得整段复制。</li>
      <li>没有人能判断某个类名是否还被引用，样式表只增不减。</li>
    </ul>

    <h2>类名命名语法</h2>
    <p>
      不推翻「用类名描述结构」，而是给类名定一套<strong>不许重复、不许嵌套</strong>的语法。这就是 BEM：<strong>Block</strong> 是可独立复用的组件，写作 <code>.card</code>；<strong>Element</strong> 是块的组成部分，用双下划线连接，写作 <code>.card__title</code>、<code>.card__body</code>、<code>.card__footer</code>；<strong>Modifier</strong> 是变体或状态，用双连字符连接，写作 <code>.card--featured</code>、<code>.card--large</code>、<code>.card__title--highlight</code>。
    </p>
    <p>
      关键的变化其实不在语法，而在纪律：<strong>元素一律用单类名直接匹配，不再写成 <code>.card .card__title</code> 这种后代选择器</strong>。于是每条规则的特异性都恒定在「一个类」，谁赢只取决于声明先后，而不再取决于你往 DOM 里套了多少层。类名本身还携带了归属信息——看到 <code>.card__title</code> 就知道它属于卡片，改它不必再去全站搜索。
    </p>
    <div class="lesson-box hint">
      BEM 的代价是<strong>类名变长、HTML 略重</strong>。它换来的东西是「可预测」：任何一条样式的作用范围都能从命名直接读出来，新同事第一天就能上手，而不用先花一周摸清样式表的脾气。
    </div>
    <p>
      顺着这个思路还能再拆一层。<strong>OOCSS 主张把「结构」与「皮肤」分开</strong>：结构类只负责布局，比如 <code>.media</code> 用 <code>display: flex</code> 加 <code>gap</code>，<code>.media__img</code> 负责不被压缩，<code>.media__body</code> 负责占满剩余宽度；皮肤类只负责视觉，比如 <code>.media--dark</code>、<code>.media--bordered</code>。同一个结构配上不同皮肤就是不同风格的组件，重复的声明被抽成了可组合的细类。
    </p>
    <p>
      再往上还有一层组织问题：几千行样式堆在一个文件里，光靠命名仍然难找。<strong>SMACSS 按角色把选择器分成五类</strong>：Base 是重置与默认样式；Layout 负责页面级骨架，用 <code>l-</code> 前缀，如 <code>.l-container</code>；Module 是可复用组件，就是上面那些卡片与按钮；State 描述状态，用 <code>is-</code> 前缀，如 <code>.is-active</code>、<code>.is-hidden</code>；Theme 承载换肤。按角色分文件、定前缀，样式表的物理结构就和它的逻辑结构对上了。
    </p>
    <p>
      到了现代工程，还可以换一条更彻底的路：<strong>CSS Modules 会把类名编译成哈希</strong>，<code>.title</code> 在构建后变成 <code>_title_a1b2c</code> 这样的局部名字，两个组件写同样的类名也永远不会互相影响。这是从机制上隔离冲突，比任何命名约定都更硬。
    </p>
    <div class="lesson-box warn">
      <strong>命名规范只有落地才有意义。</strong>如果团队里有人不遵守，规范带来的可预测性会立刻归零；所以约定要写进协作文档，并用 lint 规则强制执行——例如禁止用后代选择器书写组件样式、限制选择器嵌套深度。
    </div>

    <h2>三套架构对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 BEM / OOCSS / SMACSS 三页，对照同一条卡片结构的三套组织思路。</figcaption>
      <C19BEM />
    </figure>

    <h2>多人协作秩序</h2>
    <p>
      CSS 架构要解决的不是「怎么写样式」，而是「怎么让几十个人、几年时间写下的样式不互相打架」。BEM 用 <code>Block__Element--Modifier</code> 让命名自带归属、层级扁平、特异性恒定；OOCSS 把结构与皮肤拆成可组合的类；SMACSS 按角色给样式表分区；CSS Modules 则用哈希局部作用域从机制上兜底。
    </p>
    <div class="lesson-term">
      <span class="term-name">「BEM」</span>是一种类名约定：<strong>Block</strong>（块，如 <code>.card</code>）是可复用的独立组件，<strong>Element</strong>（元素，如 <code>.card__title</code>）用双下划线表示它属于哪个块，<strong>Modifier</strong>（修饰符，如 <code>.card--featured</code>）用双连字符表示变体或状态。要点是元素只用单类名匹配、不做嵌套，让每条规则的特异性恒定、作用范围一眼可读。
    </div>
  </LessonArticle>
</template>
