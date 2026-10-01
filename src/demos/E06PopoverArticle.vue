<script setup lang="ts">
import E06Popover from './E06Popover.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我想在「更多」按钮旁浮出一段说明，鼠标移上去显示、移开收起；可自己写的浮层一离开按钮就消失，鼠标还没挪进说明里就断了——怎么让这段浮层「稳稳地待一会儿」？
    </div>

    <h2>提出问题</h2>
    <p>
      后台里到处是这种小需求：一个图标按钮，鼠标悬停时告诉用户它是什么；一个输入框，聚焦时在右侧展开一段填写说明；一排操作，点击后浮出「新建 / 编辑 / 删除」。它们的共同点是——<strong>这段内容不值得跳转一个页面，但必须出现在触发它的元素附近</strong>。
    </p>
    <p>
      如果不借助组件库，这些活全得自己干：算浮层坐标、监听 mouseenter 与 mouseleave、判断鼠标是从触发区移向浮层还是移往别处、处理浮层被父级 <code>overflow: hidden</code> 裁剪、被 z-index 盖住。最要命的是浮层与触发源之间那几像素的间隙——鼠标穿过它时既不算在按钮上、也不算在浮层里，浮层当场关闭，用户根本点不到里面的东西。这些细节没有一条是业务逻辑，却每一条都能让功能「看起来坏了」。
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：在按钮里塞一个绝对定位的 <code>div</code>，用 <code>@mouseenter</code> 显示、<code>@mouseleave</code> 隐藏，父容器设 <code>position: relative</code> 当作定位基准。
    </p>
    <p>
      它做对了最关键的一件事：<strong>把辅助内容和触发源绑在同一块区域里</strong>，用户不必离开当前上下文就能读到信息。对于「按钮上方显示一句纯文本」这种最简场景，这个方案完全够用，而且零依赖。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>鼠标从按钮移向浮层的途中会经过间隙，浮层立刻关闭，里面的按钮永远点不到。</li>
      <li>浮层贴在按钮所在容器里，父级一旦有裁剪样式就会被切掉一半。</li>
      <li>多个浮层之间的层级、遮挡、贴到视口边缘时的方向翻转，全要自己处理。</li>
      <li>只支持 hover 一种触发；输入框旁要「聚焦即展开」就得另写一套逻辑。</li>
      <li>移动端没有鼠标，hover 思路直接失效，用户压根看不到那段说明。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「把内容绑在触发源附近」，而是把这套浮层逻辑交给一个专门的角色——<code>el-popover</code>。它替你处理坐标计算、边界翻转、层级关系和悬停间隙，你只需声明两件事：<strong>谁来触发</strong>和<strong>浮出什么</strong>。
    </p>
    <p>
      第一步选触发方式。<code>trigger</code> 决定开合时机：<code>hover</code> 适合轻量提示，移入展开、移出自动收起；<code>click</code> 适合展开一组可点击的操作，点开、点完再关；<code>focus</code> 配合输入框，聚焦即展开、失焦自动收起。
    </p>
    <p>
      第二步固定外观。<code>placement</code> 控制弹出方向（<code>top</code> / <code>bottom</code> / <code>left</code> / <code>right</code> 以及带 <code>-start</code> / <code>-end</code> 的变体），<code>width</code> 设定浮层宽度，<code>title</code> 在顶部显示一句标题。触发源放进 <code>#reference</code> 插槽，浮层内容放进默认插槽——两者分居两个插槽，正是为了消解「间隙误关闭」：组件知道这两块属于同一个交互整体。
    </p>
    <p>
      第三步处理「浮层里有操作」的场景。点击型气泡里的按钮处理完业务后应主动关闭气泡，否则用户点完操作、浮层还悬在那里，像是点了没反应。当显隐需要被外部逻辑控制（比如与别的面板联动）时，改用 <code>trigger="manual"</code>，把显示与隐藏收进自己的变量里手动受控。
    </p>
    <p>
      最后一步是验收。不同触发方式会导致开合时机不同，hover 有进有出的延迟，click 是一次点击的开关，focus 跟随焦点。快速把鼠标划过触发区、反复点开再点空白处，看看浮层会不会闪一下、会不会误触发、移出后是否正确收起——这些「手感」问题，只有在真实的反复操作里才会暴露出来。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>其一，不要在一个气泡里再嵌一个气泡，层级一复杂就该考虑独立页面而不是继续套娃；其二，<strong>触屏设备根本没有 hover</strong>，移动端上关键信息必须本身就可见，或改成 click 触发，否则用户永远看不到那段说明。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>分别把鼠标悬停、点击、聚焦到三个触发源上，感受不同 trigger 下开合时机的差别。</figcaption>
      <E06Popover />
    </figure>

    <h2>总结</h2>
    <p>
      气泡卡片把「就近展示辅助信息」这件小事做成了可复用的能力：触发方式决定何时出现，reference 与内容插槽决定谁绑着谁，组件揽下坐标与层级这些没人愿意手写的细节。选型时先问一句——这段内容需要用户点击交互吗？要就 click，只是看一眼就 hover。
    </p>
    <div class="lesson-term">
      <span class="term-name">「气泡卡片」</span>是绑定在触发源附近浮出的内容层。用 <code>trigger</code> 选择 <code>hover</code> / <code>click</code> / <code>focus</code> / <code>manual</code> 四种触发方式，<code>#reference</code> 插槽放触发源、默认插槽放浮层内容，<code>placement</code> 与 <code>width</code> 控制方向与宽度。要联动显隐状态时用 <code>manual</code> 手动受控；触屏无 hover，关键信息不能只靠悬停。
    </div>
  </LessonArticle>
</template>
