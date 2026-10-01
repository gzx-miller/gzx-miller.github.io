<script setup lang="ts">
import U06ScrollSwiper from './U06ScrollSwiper.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>首页顶部有一条横向的「推荐课程」横滑条，手指在它上面左右滑，整页却跟着平移、横条自己不动；换到小程序真机，一处明明写了 <code>scroll-y</code> 的局部列表又纹丝不动——同一个组件，两个端两种表现。
    </div>

    <h2>提出问题</h2>
    <p>
      你想让页面的某一小块能独立滚动：顶部的横滑商品条、只占半屏的课程列表、每隔几秒翻一张的轮播图。最直觉的做法是让整页滚动，把内容一路堆下去。但这个办法把三份成本悄悄压给了你。
    </p>
    <p>
      第一，横滑和竖滑会打架——页面只有一套滚动手势，左右滑和上下滑挤在同一个容器里，手指一动就分不清该听谁的。第二，惯性、回弹、多指缩放这些手感全要自己用 <code>touchstart</code>／<code>touchmove</code> 算位移，边界情况永远补不完。第三，性能：真要一次渲染上千项，节点堆满 DOM，滚动直接掉帧。
    </p>
    <p>
      所以问题落到一句话上：<strong>为什么要把「滚动」这件事封装成声明式组件，它到底替我们接管了哪些手势与性能细节？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：所有内容直接铺在页面里，靠页面自身的滚动。
    </p>
    <p>
      这个方案做对了一件事：<strong>竖直滚动是页面天然就有的能力</strong>，你不用写一行代码，内容超屏了自然能滑。只有一个纵向列表、没有局部滚动需求时，这就够了。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>横滑条的内容超出屏幕宽度后只能换行或被裁掉，页面级滚动给不了它一次独立的横向位移。</li>
      <li>想让「只有列表这一块滚、其余不动」时做不到——整页只能一起动。</li>
      <li>长列表一次性渲染上千个节点，首屏白屏、滚动掉帧，页面滚动本身救不了它。</li>
      <li>要让列表「滚到第 5 项」或「回到顶部」时，页面滚动没有对应 API，只能自己算 <code>scrollTop</code>。</li>
      <li>局部列表想要自己的下拉刷新也做不到，页面级刷新会牵动整页。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      第一层，先解决「局部能滚」。<code>scroll-view</code> 就是 uni-app 封装的滚动容器，它替代了原生 <code>overflow</code>，手势由框架接管，你不用再自己算位移。但有一条必须记住：<strong>滚动方向要显式打开</strong>，竖滑写 <code>scroll-y</code>，横滑写 <code>scroll-x</code>；并且竖滑时容器得有一个确定的高度，否则在小程序里内容会把容器撑开，看起来就像「没滚动」。
    </p>
    <p>
      第二层，让横竖共存。横滑条用 <code>scroll-x</code>，子项设成不换行（比如 <code>white-space: nowrap</code> 或 flex 不换行），它只在自己这一块横向位移，页面仍能竖着滚，两套手势互不干扰——开场那个「一滑就撞车」正是缺了这一步。
    </p>
    <p>
      第三层，滚动还要「可控」，而这正是 <code>scroll-view</code> 比原生滚动多出来的东西：
    </p>
    <ol class="lesson-steps">
      <li><code>scroll-into-view</code>：给它一个子项的 <code>id</code>，框架就把那一项滚进视野，用于「滚到第 5 项」或「回到顶部」，不用自己算位置。</li>
      <li><code>@scroll</code>：滚动位置实时抛给你，吸顶、滚动进度条、懒加载更多都靠它。</li>
      <li><code>refresher-enabled</code>：打开下拉刷新，让这个局部列表拥有自己的刷新手势，不必牵动整页。</li>
    </ol>
    <p>
      第四层，轮播其实是同一套思路的另一个方向。<code>swiper</code> 内联多个 <code>swiper-item</code>，横向逐屏切换，配 <code>autoplay</code> 自动播放、<code>circular</code> 循环（滑到最后一张继续滑回第一张，而不是卡住回弹）、<code>indicator-dots</code> 指示点。这里最容易被忽略的是 <code>current</code> <strong>是双向绑定的</strong>：写 <code>:current="idx"</code> 能控制它跳到哪一屏，同时 <code>@change</code> 会把用户手动滑动后的新下标回传给你——两边同步，才能做到「点第 3 个圆点跳到第 3 张，手动滑动后圆点也跟着亮」。
    </p>
    <p>
      第五层，性能。<code>scroll-view</code> 只负责「滚动」这一件事，它<strong>不会替你省节点</strong>。列表很长时真正的省法是虚拟列表：只渲染视口内可见的十几项，用占位高度撑出滚动条，滑出去就回收复用。这是「能滚」和「滑得动」之间的那条分界线。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>页面级滚动与 <code>scroll-view</code> 局部滚动不要无意义地层层嵌套，两层会抢手势，出现「滚一半卡住」；另外 <code>scroll-view</code> 不设高度时，小程序端内容会撑开容器而不滚动，这不是 bug，是它按内容高度布局的默认行为。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点左右箭头切换轮播、或用「暂停自动播放」停下它，再点「触底加载更多」看底部那块局部滚动列表追加内容。</figcaption>
      <U06ScrollSwiper />
    </figure>

    <h2>总结</h2>
    <p>
      <code>scroll-view</code> 与 <code>swiper</code> 把「滚动」这项原生能力封装成了声明式组件：方向要显式声明、容器要有确定尺寸、位置可以编程控制、当前下标能双向绑定。而列表到底「滑不滑得动」，取决于你渲染了多少节点。
    </p>
    <div class="lesson-term">
      <span class="term-name">「虚拟列表」</span>一种长列表渲染策略：只渲染视口内可见的少量条目，用占位高度撑出完整滚动长度，条目滑出视口即回收复用，把 DOM 数量控制在常数级。边界：它依赖可估算的条目高度（等高最省事），条目高度不定时要先测量，否则滚动条会跳动；<code>scroll-view</code> 本身不提供虚拟化，需要额外实现或使用现成组件。
    </div>
  </LessonArticle>
</template>
