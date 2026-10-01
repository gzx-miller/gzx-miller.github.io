<script setup lang="ts">
import SC07Extend from './SC07Extend.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>信息、成功、危险三种通知，外壳的圆角、内边距、边框完全一样，只有配色不同；可我复制了三份声明，设计说把圆角调小一点，我又得改三次——有没有办法只写一次，让三种通知共用它？
    </div>

    <h2>同族元素与变体</h2>
    <p>
      通知、按钮、表单控件这类元素有个共同点：它们<strong>在语义上属于同一族</strong>，只是变体不同。一个 <code>.notice-info</code> 和一个 <code>.notice-success</code>，本质上都是「通知」，共享同一套外壳声明，差异只在颜色。
    </p>
    <p>
      用复制的方式维护，代价会随变体数量放大：三份声明改一处要同步三处，改漏一个就出现视觉不一致；而且这种「它们其实是同一种东西」的事实，被复制这个动作彻底掩盖了——读代码的人看不出这几条规则本该绑在一起。
    </p>

    <h2>分组选择器合并</h2>
    <p>
      原生 CSS 其实已经提供了合并手段：把共享的声明写成一条分组选择器。
    </p>
    <p>
      <code>.notice-info, .notice-success, .notice-danger { padding: 0.75rem; border: 1px solid; border-radius: 0.5rem; }</code>
    </p>
    <p>
      这个方案对在哪？它<strong>只输出一条规则，产物没有任何重复</strong>，三种变体共用同一份声明，改圆角只改这一处。这是最干净、最不需要工具介入的合并方式。
    </p>

    <h2>覆盖关系模糊</h2>
    <ul>
      <li>共享声明与各自声明被拆到两条规则里，谁覆盖谁，全靠书写顺序和特异性去猜。</li>
      <li>差异一多，分组就碎成好几段：配色一段、间距一段、状态样式一段，反而更难读。</li>
      <li>它只能合并「声明」，表达不了「<code>.notice-info</code> 本身就是一种通知」这层语义。</li>
      <li>想让某个元素单独拥有这套外壳，原生写法只能给 HTML 补一个基类，标记和样式被强行绑在一起。</li>
    </ul>

    <h2>占位选择器与继承</h2>
    <p>
      要表达「同类不同变体」的语义，Sass 提供了<strong>占位选择器 <code>%</code></strong> 配合 <strong><code>@extend</code></strong>。把公共声明写进一个以 <code>%</code> 开头的选择器：
    </p>
    <p>
      <code>%notice-base { padding: 0.75rem; border: 1px solid; border-radius: 0.5rem; }</code>
    </p>
    <p>
      然后让具体变体去扩展它：
    </p>
    <p>
      <code>.notice-info { @extend %notice-base; color: #225b88; background: #e5f0fb; }</code>
    </p>
    <p>
      关键在于<strong>占位选择器自身永不输出任何 CSS</strong>：单独写一个 <code>%notice-base</code>，编译产物里什么都不会有，所以它不会制造冗余体积。只有当某个选择器 <code>@extend</code> 它时，编译器才会把扩展方的选择器<strong>并入该占位符的选择器列表</strong>，最终合并成一条规则：
    </p>
    <p>
      <code>.notice-info, .notice-success, .notice-danger { padding: 0.75rem; border: 1px solid; border-radius: 0.5rem; }</code>
    </p>
    <p>
      同时 HTML 只需要一个类名就够了，标记保持干净。这就是 <code>@extend</code> 想表达的语义：<strong>「这几种东西是同一种语义类型的不同变体」</strong>，它天生适合通知、表单控件这类同族元素。
    </p>
    <p>
      但 <code>@extend</code> 不是万能复用工具。它和 <strong>Mixin</strong> 解决的是两件不同的事：Mixin 是把一组<strong>声明复制</strong>到调用处，<code>@extend</code> 是把选择器<strong>合并进同一条规则</strong>。什么时候用哪个，看这张对照表最清楚：
    </p>
    <table>
      <thead>
        <tr>
          <th>维度</th>
          <th><code>@extend</code> 占位符</th>
          <th>Mixin</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>产物形态</td>
          <td>选择器并入同一条规则</td>
          <td>声明复制到每个调用处</td>
        </tr>
        <tr>
          <td>表达语义</td>
          <td>是同一语义类型的变体</td>
          <td>复用一组声明</td>
        </tr>
        <tr>
          <td>跨 <code>@media</code></td>
          <td>不能跨 <code>@media</code> 上下文任意工作</td>
          <td>不受此限制</td>
        </tr>
        <tr>
          <td>主要风险</td>
          <td>大型项目里易影响非预期选择器</td>
          <td>产物体积随 <code>@include</code> 次数增长</td>
        </tr>
        <tr>
          <td>适用场景</td>
          <td>天然同族的元素（表单控件、通知）</td>
          <td>只想共享声明、需要参数或确定性时</td>
        </tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>两句话记住边界：</strong>只想共享一组声明时，Mixin 通常更直观，因为它的结果只取决于调用点，不会被别的选择器牵连；而对确定性要求高的场合，优先选 Mixin——<code>@extend</code> 会在整个样式表里寻找匹配的占位符并合并，在大型项目中容易波及你没想到的选择器。
    </div>

    <h2>外壳声明并入同族</h2>
    <figure class="lesson-figure">
      <figcaption>切换三种通知，看 <code>%notice-base</code> 的外壳如何被 <code>@extend</code> 合并进同一族。</figcaption>
      <SC07Extend />
    </figure>

    <h2>继承与混入分工</h2>
    <p>
      <code>@extend</code> 与占位符回答的是「同类不同变体」该怎么写：公共部分放进 <code>%placeholder</code>（它自己不产出 CSS），变体用 <code>@extend</code> 并入同一条规则，语义清晰、产物不重复。当你需要的只是「把一组声明搬过来」，或者要求行为完全可预测，那该用 Mixin——<strong>先想清楚是「同一类东西」还是「同一段声明」，再决定用哪一个</strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「占位选择器与 @extend」</span><code>%placeholder</code> 自身不输出任何 CSS，只有被 <code>@extend</code> 时才把扩展方的选择器并入自己的选择器列表，最终合并成一条规则。<code>@extend</code> 表达「同一语义类型的不同变体」，适合通知、表单控件这类同族元素；它不能跨 <code>@media</code> 上下文任意工作，且在大型项目中易影响非预期选择器。仅需共享声明时，Mixin 更直观、更确定。
    </div>
  </LessonArticle>
</template>
