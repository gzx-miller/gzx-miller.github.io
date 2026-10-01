<script setup lang="ts">
import K05ConditionList from './K05ConditionList.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>列表头部插入一条新任务之后，第二条任务的复选框自己勾上了——我什么都没点，状态怎么会串到别人身上？
    </div>

    <h2>任务看板场景</h2>
    <p>
      做一个学习任务看板：一列任务，每条显示标题和一个「已完成 / 进行中」的样子；上面有一个开关，控制是否显示已完成的任务。看起来就是「一个数组铺开成一组列表项」这么简单。
    </p>
    <p>
      但只要这个列表开始<strong>增删和排序</strong>，问题就会冒出来：新插入的一项为什么让旧项的输入内容错位？切来切去之后，为什么已经隐藏的任务又闪了一下？要回答这些，得先弄清楚两件事——<strong>节点是被保留还是被重建</strong>，以及<strong>框架凭什么认出「这还是同一条数据」</strong>。
    </p>

    <h2>下标充当身份</h2>
    <p>
      最省事的做法：对每一项都用条件判断控制显示，隐藏时靠切换样式或干脆重排数组；列表项则沿用数组下标当作身份。
    </p>
    <p>
      这个方案做对了一件基础的事：<strong>它承认「列表内容由数据决定」</strong>，显示与隐藏也都由状态推导出来，没有手动去创建节点。在列表从不增删、只做整段渲染的场景里，它跑得很好。
    </p>

    <h2>条件切换销毁</h2>
    <ul>
      <li>用条件判断控制显隐时，条件为假会真的销毁节点，切回来重新创建——组件内部状态、输入内容、动画进度全部丢失。</li>
      <li>用数组下标当身份，在头部插入一项后，所有项的身份整体后移，框架会认为「第一项变成了原来的第一项的位置」，于是复用出错误的状态。</li>
      <li>下标不能代表数据身份，一旦发生排序，勾选、展开、播放这些基于实例的状态会集体错位。</li>
      <li>把条件判断和循环写在同一个元素上时，条件判断优先级更高，会先于循环求值，循环变量根本还没生成。</li>
    </ul>

    <h2>隐藏方式对比</h2>
    <p>
      先分清两种「隐藏」，它们的代价完全不同。
    </p>
    <p>
      <code>v-if</code> 是<strong>惰性渲染</strong>：条件为假时它根本不创建节点，节点是真的不存在；代价是每次切换都要经历一次真实的创建与销毁，切换有开销。<code>v-show</code> 则相反，它<strong>始终创建节点，只切换 <code>display</code> 样式</strong>：首次渲染开销更高，但切换成本极低。
    </p>
    <p>
      于是选择标准就出来了：<strong>频繁显示隐藏、DOM 又比较简单时，用 <code>v-show</code> 更合适</strong>；<strong>真正需要销毁和重建内容时才用 <code>v-if</code></strong>——比如权限区域、或者本身很昂贵的组件，你确实希望它不出现时就不要存在。
    </p>
    <p>
      再解决身份问题。列表渲染的关键不在循环本身，而在 <code>key</code>：它是列表项的<strong>身份标识</strong>。靠它，diff 算法才能在列表增删排序时复用正确的 DOM 与组件实例，避免状态错位。所以 <code>key</code> 必须稳定且能代表数据身份——用数据自己的 <code>id</code> 最稳妥，<strong>不要用数组下标去表示会增删排序的数据</strong>：下标描述的是「位置」，而你要表达的是「这是同一条任务」。
    </p>
    <div class="lesson-box warn">
      <strong>一条硬规则：</strong><code>v-if</code> 与 <code>v-for</code> 不要写在同一个元素上。当两者同时出现时，<code>v-if</code> 的优先级更高，会在循环变量还不存在时先求值，导致拿不到当前项；正确做法是把条件移到外层容器包住循环，或在循环内部对每一项单独判断。
    </div>
    <p>
      把这些拼回看板这个例子：任务数组是<strong>唯一的数据来源</strong>，模板只负责把它展示出来；「是否显示已完成」用开关状态控制可见性；每一条用任务自己的 <code>id</code> 作 <code>key</code>，于是无论怎么增删排序，身份都稳定。此时在列表头部插入一项，用元素面板就能确认：旧节点被复用，而不是整段重建。
    </p>
    <ol class="lesson-steps">
      <li>任务数组作为单一数据来源，模板只负责把它展示出来。</li>
      <li>勾选开关改变显示状态，已完成任务通过 <code>v-show</code> 控制可见性。</li>
      <li>每个任务使用 <code>id</code> 作为 <code>key</code>，保证列表更新时身份稳定。</li>
      <li>在列表头部插入一项，用元素面板确认旧节点被复用而非全部重建。</li>
    </ol>

    <h2>显隐对照表现</h2>
    <figure class="lesson-figure">
      <figcaption>切换「显示已完成」，观察隐藏与显示分别带来了什么，再体会状态为什么不会串。</figcaption>
      <K05ConditionList />
    </figure>

    <h2>存在复用与身份</h2>
    <p>
      条件渲染决定「节点要不要存在」，列表渲染决定「一组节点怎么复用」，而 <code>key</code> 是把两者串起来的身份线。记住三条就够了：频繁显隐用 <code>v-show</code>，需要真正销毁重建才用 <code>v-if</code>；<code>key</code> 用稳定的数据标识而不是下标；<code>v-if</code> 与 <code>v-for</code> 别写在同一元素上。
    </p>
    <div class="lesson-term">
      <span class="term-name">「列表身份」</span>由 <code>key</code> 承担：它是列表项的稳定标识，让 diff 算法在增删排序时复用正确的 DOM 与组件实例，避免状态错位。<code>v-if</code> 是惰性渲染（条件为假不创建节点，切换有开销），<code>v-show</code> 始终创建、只切 <code>display</code>（首渲染贵、切换便宜）；<code>key</code> 不要用数组下标，<code>v-if</code> 与 <code>v-for</code> 也不要写在同一元素上。
    </div>
  </LessonArticle>
</template>
