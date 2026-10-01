<script setup lang="ts">
import SC03Mixins from './SC03Mixins.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>三种尺寸的按钮，我把几乎相同的 <code>padding</code>、<code>border-radius</code> 声明复制了三遍；后来设计统一调了圆角，我又只改了其中两处——为什么「长得一样」的样式，改起来却要靠记性？
    </div>

    <h2>提出问题</h2>
    <p>
      按钮的三种尺寸、通知的四种状态、卡片的内外边距——这类需求的共同点是：<strong>要复用的不是某一个值，而是一整组声明</strong>。尺寸之间差的是数值，不是结构；状态之间差的是颜色，也不是结构。既然结构相同，它就该只写一遍。
    </p>
    <p>
      复制粘贴的代价，在第一次写的时候完全看不出来。真正的账单在后面：设计调整一次，你得回忆自己复制过几处；新增一种尺寸，你得找到同类的那一段作为模板再抄一份。抄的过程中只要有一处笔误——少了 <code>display</code>、圆角写成 5px——都不会报错，界面看上去也「差不多对」。<strong>靠人眼维护的重复，迟早会分叉。</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      不引入 Sass 能力，最朴素的两种做法是：把公共声明提成一个公共类 <code>.btn</code>，让 <code>.btn-sm</code>、<code>.btn-md</code>、<code>.btn-lg</code> 只覆盖差异；或者用逗号把同类选择器合并成一条规则，如 <code>.btn-sm, .btn-md, .btn-lg { border-radius: 6px; }</code>。
    </p>
    <p>
      这两种做法都做对了一件事：<strong>它们识别出了「共同部分」并只写了一处</strong>，这已经比三份复制强得多。前者还额外带来了一个好处——公共类可以写在组件根元素上，语义清晰，调试时一眼能看出这个按钮属于哪个家族。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>公共类要求 DOM 上必须挂上那个类名。样式复用被硬绑到了结构上，想在一个原本没有 <code>.btn</code> 的元素上借用这套声明，就得回去改模板。</li>
      <li>它表达不了<strong>参数</strong>。<code>sm</code> 与 <code>lg</code> 的差距本质上是同一套规则换了输入值，而公共类只能表达「共同的部分」，差异部分依然要各写各的。</li>
      <li>它无法按条件裁剪。想要「带阴影的卡片」与「不带阴影的卡片」，只能预置两个类，再由使用方组合，组合数会随可选项成倍膨胀。</li>
      <li>逗号选择器会稀释语义。<code>.notice, .alert, .toast</code> 并在一起之后，这条规则到底属于谁变得模糊，日后想单独调整其中一个，就必须把它从组里剔出来。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「只写一遍」，而是把复用对象从「一条规则」升级为<strong>一个可以带输入、当场展开的声明生成器</strong>。这就是 Mixin：用 <code>@mixin button-size($py, $px)</code> 定义一段带参数的声明块，用 <code>@include button-size(6px, 12px)</code> 在需要的地方展开它。尺寸差异变成了实参差异，共同结构只存在一份。
    </p>
    <p>
      Mixin 的参数支持位置参数、关键字参数与默认值，这一点让它比公共类灵活得多：默认值负责兜住最常见的场景，调用方只在需要偏离时才显式传参；关键字传参则让调用处的意图自解释，不必回去数参数顺序。
    </p>
    <p>
      更进一步的问题是「调用方偶尔想加一点自己的东西」。如果为此再去定义一个新 Mixin，抽象就被切碎了。Sass 给出的答案是 <code>@content</code>：调用方在 <code>@include</code> 后接一个内容块，这个块会被注入到 Mixin 内部 <code>@content</code> 所在的位置。于是「固定结构由你定、可选补充由我填」成为可能，而不必牺牲复用。
    </p>
    <p>
      还有一件必须放在边界上的事：入参校验。在 Mixin 内部用 <code>@if</code> 判断参数是否越界，配合 <code>@error</code> 直接中断编译——让错误的调用在<strong>编译期就失败</strong>，而不是产出一份没人注意的错误样式。想要真正用好 Mixin，先分清它和邻居的职责：
    </p>
    <table>
      <thead>
        <tr>
          <th>工具</th>
          <th>它产出什么</th>
          <th>什么时候用</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>@mixin</code></td>
          <td>一组 CSS 声明</td>
          <td>复用「一段样式块」，需要参数化或注入内容时</td>
        </tr>
        <tr>
          <td><code>@function</code></td>
          <td>单个 Sass 值</td>
          <td>只是算一个值，不产生任何声明时</td>
        </tr>
        <tr>
          <td>变量 / CSS 自定义属性</td>
          <td>一个值</td>
          <td>只复用一个值，不需要包裹结构时</td>
        </tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>代价要提前知道：</strong>Mixin 的展开方式是<strong>复制</strong>——每一次 <code>@include</code> 都会把这组声明原样写进调用处。因此它适合复用「一组声明」，不适合用来替代单个值，否则产物会无谓地变大。另外，如果发现 <code>@content</code> 里被塞进了大量规则，那通常意味着抽象层次切错了，应该拆成两个 Mixin，而不是继续往内容块里加东西。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换 sm / md / lg，看同一段 Mixin 展开出三种尺寸的按钮。</figcaption>
      <SC03Mixins />
    </figure>

    <h2>总结</h2>
    <p>
      Mixin 把「复制三遍」变成「定义一次、按参数展开多次」，并把可选扩展交给了 <code>@content</code>。但它不是万能胶：只复用一个值就用变量或函数，只想共享裸声明就用普通类或 CSS 自定义属性——选对了工具，抽象才不会反过来拖累你。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Mixin」</span>是 <code>@mixin</code> 定义的声明生成器，支持位置参数、关键字参数与默认值，通过 <code>@include</code> 展开；<code>@content</code> 让调用方在 <code>@include</code> 处注入额外声明。每次 <code>@include</code> 都会把声明<strong>复制</strong>到调用处，所以它适合复用「一组声明」而非单个值——只复用一个值应优先使用变量或函数。可在 Mixin 内用 <code>@if</code> 加 <code>@error</code> 校验入参，让非法参数在编译期直接失败；<code>@content</code> 只适合少量定制，注入过多说明抽象层次错了。
    </div>
  </LessonArticle>
</template>
