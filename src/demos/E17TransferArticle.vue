<script setup lang="ts">
import E17Transfer from './E17Transfer.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>要从几十门课程里挑出本期开设的几门，运营只能在一长串列表里逐个记下名字，再跑到另一块表单里手打一遍——漏一个、错一个都没人提醒。
    </div>

    <h2>集合间数据分配</h2>
    <p>
      你在做一个课程分类管理后台。系统里有几十门候选课程，运营每期要从中挑出一批组成「本期开设」的集合，剩下的保持未选。本质上，这是一个<strong>把数据项从一个集合分配到另一个集合</strong>的问题：左边是全部，右边是选中。
    </p>
    <p>
      如果不用专门的组件，最直觉的替代方案有两种：一是用两个多选下拉框，二是左右两个平铺列表、中间加两个「移到右边 / 移回左边」的按钮。两种做法都能完成分配，却都会在最关键的地方掉链子——当候选有几十条时，用户既<strong>无法搜索定位</strong>，也<strong>看不见自己已经选了什么</strong>，只能凭记忆操作。漏选、错选、改不动，就是这个场景典型的代价。
    </p>

    <h2>原生双列搬运</h2>
    <p>
      最朴素的做法：左边一个多选列表框列出全部课程，右边用一个数组记录已选的 key，中间两个按钮做整体移动。点一下「添加」，把左边选中的项推进右边的数组。
    </p>
    <p>
      它不是一无是处：<strong>「两个集合 + 移动动作」这个交互骨架是对的</strong>。左右分栏让「候选」和「已选」同时可见，信息量比单个下拉框大得多。只是把骨架落地成能用的组件，要补的零件太多。
    </p>

    <h2>手写实现的缺口</h2>
    <ul>
      <li>搜索要自己做：几十条候选没有过滤，用户只能靠眼睛扫。</li>
      <li>选中状态要自己记：左侧勾了几个、右侧能不能批量移回，逻辑越写越乱。</li>
      <li>可移动与不可移动没有区分：有些课程本期不开放，本该锁死，却仍能被来回搬动。</li>
      <li>两栏没有语义说明，用户不知道哪边是「可选」哪边是「已选」，全靠猜。</li>
      <li>某一栏为空时就是一块空白面板，让人误以为出了故障。</li>
    </ul>

    <h2>组件化两栏搬运</h2>
    <p>
      不推翻「两栏穿梭」这个骨架，改用 Element Plus 的 <code>el-transfer</code>：它把左右两栏、移动按钮、选中状态和搜索一次封装好。用它的第一件事是理解数据模型——<strong>它用的是 key-value 结构</strong>：<code>data</code> 提供全部条目，每条至少带一个唯一的 <code>key</code> 和一个可读的 <code>label</code>；而 <code>v-model</code> 绑定的<strong>不是整个对象，而是「已经转移到右栏的那些 key 组成的数组」</strong>。
    </p>
    <p>
      这一点是整个组件的核心：左侧显示什么，由「<code>data</code> 里的全部 key」减去「<code>v-model</code> 里的 key」得到；右侧显示什么，就是 <code>v-model</code> 里的那些 key 反查出来的。你只需要维护一个 key 数组，两栏的显隐就自动同步了。
    </p>
    <p>
      接下来补上搜索。开启 <code>filterable</code> 后会出现搜索框，再用 <code>filter-method</code> 指定过滤逻辑——例如按 <code>label</code> 是否包含关键词来筛选左侧候选。这样几十门课程也能几秒定位。
    </p>
    <p>
      再补语义和锁定：用 <code>titles</code> 把两栏标题设成「可选课程 / 已选课程」，用户一眼就懂；<code>data</code> 里把 <code>disabled</code> 置为 <code>true</code> 的条目会被锁住、无法移动，正好用来表示「本期不开放」的课程。
    </p>
    <p>
      最后处理两件收尾的事。其一，穿梭过程会触发 <code>change</code> 一类事件，可以在里面联动外部状态，比如实时统计已选数量；数据量大时则要留意过滤的性能。其二，<strong>提交时要拿到的通常不是 key，而是完整数据项</strong>——用 <code>v-model</code> 里的 key 集合去 <code>data</code> 里反查，拼出落库需要的结构。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong><code>key</code> 必须<strong>唯一且稳定</strong>，若两条数据共用一个 key，穿梭与回显都会错位。还有一点很影响体验——<strong>为空状态补上文案</strong>：候选为空时提示「暂无可选项」，而不是留一块空白面板让用户发懵。
    </div>

    <h2>已选项的实时同步</h2>
    <figure class="lesson-figure">
      <figcaption>在左侧搜索课程、勾选后移到右侧，下方会实时显示已选的 key 集合。</figcaption>
      <E17Transfer />
    </figure>

    <h2>穿梭框交互模型</h2>
    <p>
      穿梭框把「在两个集合之间分配数据」这件琐事，收敛成了一套稳定的交互：左边候选、右边已选、中间移动、顶部搜索。用它的关键不是记 API，而是理解它的 key-value 模型——<code>data</code> 给全集，<code>v-model</code> 只维护右栏的 key 数组，其余显示全由这两者推导。记住 key 要唯一稳定、提交时反查完整数据，再补上空状态提示，这个组件就能稳稳用在选人、选权限、选课程这些场景里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「穿梭框」</span>用 <code>el-transfer</code> 提供左右两栏的分配式选择：<code>data</code> 提供全部条目（含唯一 <code>key</code>、可读 <code>label</code>、可选的 <code>disabled</code>），<code>v-model</code> 绑定的是<strong>已转移到右栏的 key 数组</strong>。<code>filterable</code> 配合 <code>filter-method</code> 提供搜索，<code>titles</code> 说明两栏语义。底层以 key-value 跟踪选中状态，因此 <code>key</code> 必须唯一且稳定，提交时再用 key 反查完整数据项。
    </div>
  </LessonArticle>
</template>
