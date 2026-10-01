<script setup lang="ts">
import E07Dropdown from './E07Dropdown.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>表格每行都放五个操作按钮，一行就撑到了屏幕外；收进一个「更多」之后，我又怎么知道用户点的是哪一个操作，还能顺手把「当前选中的课程」标出来？
    </div>

    <h2>操作入口过多的困境</h2>
    <p>
      你在做一个课程管理后台，每行课程后面跟着「编辑、分享、收藏、删除」这么多操作。如果全平铺成按钮，四个操作加上文案就把这一行的宽度吃掉一大半，表格挤得像闹市；如果藏起来不给入口，用户又没法操作。真实场景还更多：右上角一个「每日任务 / 积分商城 / 意见反馈」的入口、顶部一个切课程的下拉。
    </p>
    <p>
      <strong>不掌握一个下拉组件，代价是明确的</strong>：要么忍受页面被按钮塞满、扫读困难；要么自己拼一个弹出层，然后重新掉进「点击外部要关闭、层级要压住内容、键盘方向键要能上下选、点完要能传出到底点了哪一项」这一连串坑里。更要命的是，这些操作最终都要落到一个分发函数上，如果传不出「用户到底点了什么」，业务就没法写。
    </p>

    <h2>手写菜单列表</h2>
    <p>
      最朴素的做法：把操作收进一个 <code>v-if</code> 控制的列表，点击按钮切换它的显示，每项再各绑一个 <code>@click</code>：编辑调 <code>handleEdit</code>、分享调 <code>handleShare</code>。
    </p>
    <p>
      它做对了一件事：<strong>把一组同类操作收拢到一个入口下，按需展开</strong>。页面清爽了，用户也知道「操作都在这儿」。功能上它是通的，四个操作各有各的处理函数，点谁执行谁。
    </p>

    <h2>外部点击与层级缺陷</h2>
    <ul>
      <li>点击页面其他地方，菜单不会自动收起，浮层赖着不走。</li>
      <li>菜单层被下方内容盖住，或者超出视口被裁掉。</li>
      <li>每加一个操作就要多写一个函数、多绑一次事件，重复且容易漏。</li>
      <li>键盘用户无法用方向键在选项间移动，无障碍体验缺失。</li>
      <li>想表达「分隔」「禁用」这类语义，只能自己在样式和判断里硬编码。</li>
    </ul>

    <h2>弹层开合与命令分发</h2>
    <p>
      不推翻「收拢入口」，而是让组件来承担弹层的开合与分发——这就是 <code>el-dropdown</code>。它管住「点击外部关闭、层级、键盘导航」这些通用问题，你把注意力放回业务本身。
    </p>
    <p>
      第一层的改进是把<strong>每一项操作变成一个可识别的标识</strong>。菜单结构这样组织：触发源放进 reference 区，点击展开；菜单本身由 <code>el-dropdown-menu</code> 承担，里面的每个 <code>el-dropdown-item</code> 用 <code>command</code> 属性打一个唯一标识——比如 <code>edit</code>、<code>share</code>、<code>star</code>、<code>delete</code>。用户点选某项时触发 <code>@command</code> 事件，<strong>回调参数就是那一项所选的 command</strong>。
    </p>
    <p>
      这一步带来的变化很大：过去是「每个按钮各管各的」，现在是「所有命令汇入一个分发函数」。你只需要写一个 <code>handleCommand(command)</code>，在里面用 <code>switch</code> 或映射表把命令路由到对应逻辑。新增一个操作，只要加一项、加一个 command，不用再改绑定。
    </p>
    <p>
      第二层改进是补齐菜单项的表达能力。用 <code>disabled</code> 禁用某一项防止误操作，用 <code>divided</code> 在相邻项之间加一条分隔线。放在「切换选中项」的场景里，这两个属性配合得极其自然：把 command 设成课程名，用动态 <code>disabled</code> 把<strong>当前已选中的那一项标灰</strong>，用户一眼就知道自己现在在哪门课上。
    </p>
    <ol class="lesson-steps">
      <li>把触发源放进 reference 区，点击后展开下拉菜单。</li>
      <li>为每个菜单项定义唯一 <code>command</code>，在 <code>@command</code> 里统一分发处理。</li>
      <li>用 <code>disabled</code> 标记当前选中项或不可用项，用 <code>divided</code> 分隔命令分组。</li>
      <li>需要「主操作 + 附加菜单」时改用 <code>split-button</code>。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>split-button 的坑：</strong>它会把触发钮拆成左边一个主按钮、右边一个下拉箭头。这两块的<strong>事件不是同一个</strong>——主按钮走 <code>@click</code>，箭头展开的菜单项走 <code>@command</code>，必须分别绑定，否则会出现「点主按钮弹提示、点箭头却什么也不发生」的混乱。另外，命令项一多就该用 <code>divided</code> 分区，别把十个命令平铺成一条扫读困难的长列表。
    </div>

    <h2>命令标识的分发路径</h2>
    <figure class="lesson-figure">
      <figcaption>点开操作菜单看命令如何按 command 分发；再看课程下拉里当前项是如何被禁用的。</figcaption>
      <E07Dropdown />
    </figure>

    <h2>单键入口的收拢</h2>
    <p>
      下拉菜单解决的是「入口太多」与「命令要能分发」这两件事：入口收拢成一次点击，命令用 <code>command</code> 标识、经 <code>@command</code> 统一路由。分清 reference 与菜单、分清主按钮与下拉分支各自的事件，就能把一堆零散操作整理成一处清晰的入口。
    </p>
    <div class="lesson-term">
      <span class="term-name">「下拉菜单」</span>把一组操作收拢到一个触发入口下。用 <code>#dropdown</code> 插槽放 <code>el-dropdown-menu</code>，每个 <code>el-dropdown-item</code> 用 <code>command</code> 标识操作、<code>disabled</code> 禁用、<code>divided</code> 加分隔线；点选后触发 <code>@command</code>，回调参数就是所选 command。<code>split-button</code> 把触发钮拆成主按钮与右侧箭头，二者分别走 <code>@click</code> 与 <code>@command</code>。
    </div>
  </LessonArticle>
</template>
