<script setup lang="ts">
import E09Pagination from './E09Pagination.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表有 12 条，我想每页显示 5 条分屏展示；可写完「上一页 / 下一页」之后发现，切到「每页 10 条」的瞬间页面变成一片空白——这到底是谁越了界？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做课程列表页，数据从接口拿回来是一整批。用户不可能一口气看几百条，你需要把它切成一页一页的。<strong>真到动手时，问题立刻分成两半</strong>：一半是「当前展示哪几条数据」的切片逻辑，另一半是「让用户翻页、改每页条数」的控件。
    </p>
    <p>
      自己手写这套东西，代价很清楚地摊在眼前：要写上一页、下一页、页码按钮，还要处理「第一页时禁用上一页」「最后一页时禁用下一页」；页码一多，中间得用省略号折叠；再加上「总共多少条」「每页显示多少条」的切换。这些都是重复劳动，而且极容易在某处漏一个边界，让用户翻到一片空白页——就像开场那样。
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：存一个 <code>currentPage</code>，用 <code>computed</code> 从完整数组里切出当前该显示的一段，再渲染一个「上一页 / 下一页」按钮去加减这个页码。
    </p>
    <p>
      它做对了最本质的一件事：<strong>把「全部数据」和「当前展示的数据」彻底分开</strong>。数据一条没少，只是视图一次只看一屏。这个「以页码换算切片区间」的思路是分页的骨架，必须保留下来。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>只有上一页下一页，用户想直接跳到第 5 页时只能一次一次点。</li>
      <li>没有总数展示，用户不知道数据到底有多少、自己在第几页。</li>
      <li>「每页显示多少条」完全没得选，数据量变化时很被动。</li>
      <li>页码一多，一排按钮铺满整行，没有折叠处理。</li>
      <li>切换每页条数后页码没有联动，容易翻到越界的空白页。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「切片展示」，而是引入 <code>el-pagination</code> 来承担控件部分，你只管把切片逻辑和它接上。
    </p>
    <p>
      第一步，说清切片公式。当前页第 <code>currentPage</code> 页、每页 <code>pageSize</code> 条时，起点是 <span class="lesson-kv">(currentPage - 1) * pageSize</span>，终点就是起点加 <code>pageSize</code>。把这行算式写进 <code>computed</code>，数据一变它就自动重算——这就是整个分页里唯一真正属于你的逻辑，其余交给组件。
    </p>
    <p>
      第二步，把两个状态交给组件双向绑定。<code>v-model:current-page</code> 绑当前页码，<code>v-model:page-size</code> 绑每页条数，再用 <code>total</code> 告诉它总共有多少条。<strong>页码和条数从此由组件维护</strong>，你不再手写加减。如果需要在变化时做别的事，可以监听 <code>@current-change</code> 与 <code>@size-change</code>，但基础的翻页已经由 v-model 自动完成。
    </p>
    <p>
      第三步，用 <code>layout</code> 决定分页条长什么样。<code>layout</code> 是一串按顺序书写的区块名，从左到右依次排布——<code>total</code>（总数）、<code>sizes</code>（每页条数选择器）、<code>prev</code>（上一页）、<code>pager</code>（页码）、<code>next</code>（下一页）、<code>jumper</code>（跳转输入框）。<strong>书写顺序就是视觉顺序</strong>，按需组合、别把所有区块都堆上，否则分页条会宽得挤不下。其中每页条数的候选值由 <code>page-sizes</code> 提供，例如 <code>[3, 5, 10]</code>。
    </p>
    <div class="lesson-box warn">
      <strong>两个必踩的边界：</strong>其一，<strong>切换每页条数时必须把 <code>currentPage</code> 重置为 1</strong>。原来在第 3 页、每页 3 条，改成每页 10 条后第 3 页根本不存在，不重置就直接是一片空白。其二，<strong>删除末页最后一条数据后页码会越界</strong>——原本第 4 页有 1 条，删掉后第 4 页空了。稳妥做法是删完判断当前页是否已超出最大页数，超出就回退一页并重新请求。
    </div>
    <p>
      还有一条选型原则：前端分页适合中小数据量，数据一次性全拿到、在浏览器里切；<strong>数据量大时要改成服务端分页</strong>——把 <code>currentPage</code> 和 <code>pageSize</code> 作为请求参数发给后端，由接口只返回当前页，<code>total</code> 也由接口返回填充。否则光是把十万条数据拉到前端，页面就先卡住了。
    </p>
    <p>
      这两条路线在代码上其实是同一套：无论数据来自本地数组还是接口，切片公式不变，变化的只是「拿到当前页数据」这一步是 <code>computed</code> 算出来的，还是发请求换回来的。所以你可以先用本地数组把分页交互跑通，等数据量长起来了，再把 <code>computed</code> 换成一个发请求的 <code>watch</code>，界面上的分页条一行都不用动。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>翻页、改每页条数，观察表格内容如何跟着切片变化；注意切换条数时页码会被重置。</figcaption>
      <E09Pagination />
    </figure>

    <h2>总结</h2>
    <p>
      分页把「很多条数据一次只看一屏」拆成两件事：你用 <code>computed</code> 按 <code>(currentPage - 1) * pageSize</code> 切片，组件用 v-model 维护页码与条数、用 layout 组织外观。只要守住「切条数重置页码」和「删末页回退页码」这两个边界，用户就不会再翻到空白。
    </p>
    <div class="lesson-term">
      <span class="term-name">「分页」</span>把整批数据切成多屏展示。用 <code>v-model:current-page</code> 与 <code>v-model:page-size</code> 双向绑定当前页码与每页条数，<code>total</code> 提供总条数，<code>layout</code> 按顺序组合 <code>total</code> / <code>sizes</code> / <code>prev</code> / <code>pager</code> / <code>next</code> / <code>jumper</code> 区块，<code>page-sizes</code> 提供条数候选值。数据侧用 <code>computed</code> 按 <code>(currentPage - 1) * pageSize</code> 切片；切换条数要重置页码，删末页要回退一页。
    </div>
  </LessonArticle>
</template>
