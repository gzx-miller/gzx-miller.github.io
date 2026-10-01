<script setup lang="ts">
import C23ScrollSnap from './C23ScrollSnap.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个原生滚动轮播，用户松手后它总停在两张图中间，半张图卡在边上——怎么让滚动「自己停」在整页上？
    </div>

    <h2>松手整页停位</h2>
    <p>
      设想你在给课程详情页做一个移动端的图片画廊：一排封面横向排列，用户左右滑动切图，松手后应当稳稳停在某一整页上，而不是停在两张图之间露出半张。同类需求还有全屏分页的落地页、顶部的横向标签条。
    </p>
    <p>
      不用 CSS 的方案，就得自己写脚本：监听 <code>scroll</code> 事件，读 <code>scrollLeft</code>，算出最近那一项的偏移量，再调用 <code>scrollTo</code> 把它「纠正」过去。<strong>这条路的代价，是一整套滚动手感的问题全要自己扛</strong>：手指还在惯性滑行时你强行 <code>scrollTo</code>，会和用户的动量打架，感觉像被抢了方向盘；<code>scroll</code> 事件在惯性滚动中一帧触发好几次，每帧都要算一次；触摸滑动、鼠标滚轮、键盘方向键的差异还得分别处理。而这些细节做不好的直接后果，就是用户觉得「这个轮播很别扭」。
    </p>

    <h2>手动对齐点计算</h2>
    <p>
      最朴素的做法，就是上面那套「先滚、再纠正到最近的对齐点」：监听滚动停止，量出偏移量，除以单项宽度得到索引，再滚回索引对应的整数倍位置。
    </p>
    <p>
      它做对了一件关键的事：<strong>找准了正确的思路——滚动本身交给浏览器，脚本只负责把停下来的位置对齐</strong>。这也正是 <code>Scroll Snap</code> 背后的模型，值得保留；要改的只是「由谁来做这件事」。
    </p>

    <h2>惯性滚动判定</h2>
    <ul>
      <li>需要自己判断「滚动是否结束」，判断早了会被惯性甩开，判断晚了用户已经看到错位。</li>
      <li>惯性滚动中频繁触发 <code>scroll</code>，每帧一次读取与写入，很容易掉帧。</li>
      <li>触摸、滚轮、键盘、滚动条的交互差异都要额外分支处理。</li>
      <li>每一项的宽度随响应式变化时，对齐计算要跟着重写。</li>
      <li>脚本未加载或被禁用时，滚动完全失去吸附能力。</li>
    </ul>

    <h2>声明式吸附规则</h2>
    <p>
      既然「先滚，再纠正到最近的对齐点」是对的，那就把这套逻辑交给浏览器，用<strong>声明式</strong>的写法告诉它对齐规则。这套能力叫 <code>Scroll Snap</code>，只需要两处声明：<strong>容器</strong>上说明滚动方向与对齐的严格程度，<strong>子项</strong>上说明自己要对齐到容器的哪个位置。
    </p>
    <p>
      容器一侧用 <code>scroll-snap-type</code> 声明两个参数：轴与严格度。
    </p>
    <p>
      <code>.gallery { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 16px; }</code>
    </p>
    <p>
      轴取 <code>x</code> 或 <code>y</code>，严格度取 <code>mandatory</code> 或 <code>proximity</code>。<code>mandatory</code> 表示<strong>强制停靠</strong>——只要滚动停下，浏览器一定把最近的对齐点吸附到边界上；<code>proximity</code> 表示<strong>接近时才吸附</strong>，松手位置离对齐点太远就随它去。轮播这类「必须一页一页看」的场景用 <code>mandatory</code>；长文档里希望滚动保持自然、只在快要对齐时轻轻吸附的，用 <code>proximity</code>。
    </p>
    <div class="lesson-box warn">
      <strong>最容易踩的坑：<code>Scroll Snap</code> 不会自己创建滚动容器。</strong>如果元素没有可滚动的溢出内容（例如忘了写 <code>overflow: auto</code> 或 <code>overflow: scroll</code>），<code>scroll-snap-type</code> 不会有任何效果——这常常是「明明写了属性却完全不动」的真正原因。
    </div>
    <p>
      子项一侧用 <code>scroll-snap-align</code> 说明对齐点：
    </p>
    <p>
      <code>.slide { flex: 0 0 100%; scroll-snap-align: center; }</code>
    </p>
    <p>
      <code>start</code> 对齐容器起始边，<code>end</code> 对齐结束边，<code>center</code> 对齐中心。<code>flex: 0 0 100%</code> 让每一页正好占满容器宽度，配合居中对齐就是标准的整页轮播。
    </p>
    <p>
      实际项目里最常见的一种错位来自固定导航：页面向下滚动时，对齐到顶部的子项被 80px 高的吸顶导航挡住了一截。解决办法不是在子项上加 margin，而是在<strong>滚动容器</strong>上留出偏移：
    </p>
    <p>
      <code>.page { scroll-padding-top: 80px; scroll-snap-type: y mandatory; }</code>
    </p>
    <p>
      <code>scroll-padding</code> 相当于给容器的可滚动区域加了一圈内边距，所有对齐点都以此为基准。与之对称的是子项上的 <code>scroll-margin</code>，它从元素这一侧外扩对齐基准，例如 <code>scroll-margin: 16px</code> 会让对齐时两边各留一点空隙。记住区分：<strong><code>scroll-padding</code> 写在容器上，<code>scroll-margin</code> 写在子项上。</strong>
    </p>
    <p>
      <code>mandatory</code> 虽然好用，却也有脾气：<strong>如果某个子项比容器还高（或还宽），浏览器会发现无论怎么对齐都无法把这一项完整停住</strong>，滚动体验就会变得别扭，甚至让人滑不过去。遇到内容长短不一的列表，改用 <code>proximity</code> 往往更稳。另外，高速滑动时用户可能一次越过好几个对齐点，若希望「一次只走一页」，可以在子项上加 <code>scroll-snap-stop: always</code>；平时保持默认的 <code>normal</code> 即可。
    </p>
    <p>
      最后两个实用细节。轮播通常不希望露出滚动条，可以用 <code>scrollbar-width: none</code>，再配合 <code>::-webkit-scrollbar { display: none }</code> 覆盖旧版内核——<strong>它只是把滚动条画没了，滚动能力本身不受影响</strong>。而全屏分页的落地页，本质就是让容器 <code>height: 100vh</code> 且 <code>scroll-snap-type: y mandatory</code>，每一节 <code>height: 100vh</code> 加 <code>scroll-snap-align: start</code>：一套纯 CSS 的「一屏一屏」翻页就完成了。
    </p>

    <h2>吸附轴与严格度</h2>
    <figure class="lesson-figure">
      <figcaption>依次切换「水平强制 / 水平接近 / 垂直强制」，拖动看看三种吸附手感的差别。</figcaption>
      <C23ScrollSnap />
    </figure>

    <h2>浏览器接管吸附</h2>
    <p>
      <code>Scroll Snap</code> 的价值在于把「滚动手感」这件很难做好的事交还给浏览器：容器用 <code>scroll-snap-type</code> 声明轴与严格度，子项用 <code>scroll-snap-align</code> 声明对齐点，中间不需要任何脚本参与。只要记住它需要 <code>overflow</code> 才会真正滚动、用 <code>scroll-padding</code> 避开吸顶导航、并在内容高度不齐时对 <code>mandatory</code> 保持警惕，原生轮播、画廊和分页滚动都能几行 CSS 写完。
    </p>
    <div class="lesson-term">
      <span class="term-name">「滚动吸附 Scroll Snap」</span>是 CSS 原生实现的滚动定位机制。<strong>容器</strong>上写 <code>scroll-snap-type</code> 声明两个参数——滚动轴（<code>x</code> / <code>y</code>）与严格度（<code>mandatory</code> 强制停靠 / <code>proximity</code> 接近才吸附）；<strong>子项</strong>上写 <code>scroll-snap-align</code> 声明对齐点（<code>start</code> / <code>center</code> / <code>end</code>）。它必须配合 <code>overflow: auto</code> 或 <code>scroll</code> 才生效，可用 <code>scroll-padding</code>（写在容器）与 <code>scroll-margin</code>（写在子项）微调对齐位置。
    </div>
  </LessonArticle>
</template>
