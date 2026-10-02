const n=`<script setup lang="ts">
import TW01UtilityFirst from './TW01UtilityFirst.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>页面里第三个「课程卡片」出现了——你复制了前两个的 <code>class</code>，又顺手改了两个数字。三个月后要调整卡片圆角，你在四十个文件里搜同一个类名，改到第三十个时开始怀疑人生：这堆类名到底该不该存在？
    </div>

    <h2>自定义类命名成本</h2>
    <p>
      你想做的事很简单：给一段 HTML 加点样式。传统做法是先在 CSS 文件里想一个名字，<code>.course-card</code>，然后写声明；HTML 那边挂上这个名字。这套流程跑了几十年，但它藏了两个必须由人来承担的成本。
    </p>
    <p>
      第一是<strong>命名成本</strong>。你每写一个组件就得想一个语义化的类名，而类名是有限的资源——<code>.card</code> 被占用了，你就写 <code>.course-card</code>，再冲突就写 <code>.course-card-v2</code>。第二是<strong>推理成本</strong>。看到一个 <code>class="course-card"</code>，你无法知道它长什么样，必须跳到 CSS 文件里去找定义，如果它继承自 <code>.card</code> 又要再跳一层。样式和结构被物理地分开了。
    </p>
    <p>
      于是问题变成：<strong>有没有一种办法，让「写样式」这件事本身不需要先想名字？</strong>
    </p>

    <h2>单用途工具类</h2>
    <p>
      Tailwind 给的最小方案叫「工具优先」：不写自定义类，直接在元素上挂<strong>单用途工具类</strong>。每个类只做一件事，类名本身就是声明。
    </p>
    <ul>
      <li><code>flex</code> → <code>display: flex</code></li>
      <li><code>items-center</code> → <code>align-items: center</code></li>
      <li><code>gap-4</code> → <code>gap: 1rem</code></li>
      <li><code>rounded-2xl</code> → <code>border-radius: 1rem</code></li>
      <li><code>shadow-lg</code> → <code>box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)</code></li>
    </ul>
    <p>
      于是一个卡片写成 <code>class="flex items-center gap-4 p-5 rounded-2xl shadow-lg"</code>，<strong>读 HTML 就等于读样式</strong>——不用跳文件、不用想名字。它真正解决的是那个最原始的问题：命名瓶颈消失了，因为名字不再是抽象的语义标签，而是它恰好要施加的那条声明。
    </p>

    <h2>类名列表失控</h2>
    <p>
      但严格说，「写样式不用想名字」并不等于「代码变好了」。这个方案会露出三个问题：
    </p>
    <ul>
      <li><strong>类串会失控地变长。</strong>一张复杂卡片挂上二三十个类名很正常，<code>class</code> 属性长得像一篇小作文，可读性反而下降。</li>
      <li><strong>重复是必然的。</strong>同样的 <code>flex items-center gap-4 p-5 rounded-2xl shadow-lg</code> 会在十个地方出现。要改圆角，还是要改十个地方——只是从"搜类名"变成了"搜类串"。</li>
      <li><strong>自由过头会破坏一致性。</strong>如果没人管，有人用 <code>p-4</code>，有人用 <code>p-[17px]</code>，设计约束形同虚设，风格还是会失控。</li>
    </ul>
    <p>
      注意第三个问题其实早有答案：Tailwind 的间距、颜色、字号<strong>都来自一套预定义的设计令牌</strong>——<code>p-4</code> 恒等于 <code>1rem</code>，颜色只能从调色板里取。这层约束是工具类能保持克制的前提，而不是它的缺点。
    </p>

    <h2>组件抽象阈值</h2>
    <p>
      剩下的两个问题，答案不在 CSS 里，而在<strong>你已经在用的组件模型</strong>里。
    </p>
    <p>
      当同一段工具类组合出现三次以上，或者这堆类名开始承载业务语义（"这是一张课程卡片"），就应该把它<strong>抽成一个 Vue 组件</strong>，把那段类串封进组件内部：
    </p>
    <ul>
      <li>组件边界承担了「可复用」的职责——改圆角只改组件内部一处。</li>
      <li>组件名承担了「语义」的职责——<code>&lt;CourseCard&gt;</code> 比 <code>.course-card</code> 更清楚，因为它同时管住了结构和样式。</li>
      <li>工具类继续留在组件内部——它负责的是「具体长什么样」这件小事，而抽象这件事交给组件。</li>
    </ul>
    <p>
      这里有个常见误操作要避开：<strong>不要为了缩短 class 而用 <code>@apply</code> 堆一个自定义类</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>不要滥用 <code>@apply</code>。</strong>写 <code>.my-card { @apply flex items-center gap-4 p-5; }</code> 看似两全其美，实际上你既失去了工具类的自描述性（读 HTML 又看不懂了），又回到了"要想类名"的老路，还没拿到组件带来的结构复用。它只在少数场合有价值——比如要给第三方库渲染出的 DOM 打补丁时。
    </div>
    <p>
      还有一条实践细节：<strong>类名顺序不影响最终结果</strong>，因为 CSS 规则的优先级由样式表决定，不由你书写顺序决定。但团队里应当用统一排序（比如按官方推荐的属性分组顺序，或用 Prettier 插件自动排序），否则 diff 会充满无意义的抖动。
    </p>

    <h2>工具类映射对照</h2>
    <figure class="lesson-figure">
      <figcaption>切到「类名映射」看每个工具类对应哪条 CSS，切到「何时抽取组件」对比推荐与不推荐的写法，再回「实时演示」切换密度，观察同一组类名如何改变卡片外观。</figcaption>
      <TW01UtilityFirst />
    </figure>

    <h2>命名交给组件承担</h2>
    <p>
      「工具优先」不是"不用写 CSS"，而是<strong>把命名这件事从样式中拿掉，交给组件去承担</strong>。工具类负责单条声明的组合与设计令牌的约束，组件负责复用与语义，两者各管一段，谁也不越位。判断该不该抽组件，看的是重复次数和业务语义，而不是类串有多长。
    </p>
    <div class="lesson-term">
      <span class="term-name">「工具优先」</span>指优先用受设计令牌约束的单用途工具类（<code>flex</code> / <code>p-5</code> / <code>rounded-2xl</code>）直接在元素上组合样式，使类名即声明、无需为样式单独命名；可复用性与抽象由组件边界承担，而不是用 <code>@apply</code> 把工具类重新包装成自定义类名。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
