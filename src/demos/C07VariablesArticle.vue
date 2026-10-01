<script setup lang="ts">
import C07Variables from './C07Variables.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>产品临时要加一个「夜间主题」，我打开样式表才发现主色 <code>#e8590c</code> 被写死在十几个选择器里——难道只能一个一个搜着替换，还得祈祷没有漏掉？
    </div>

    <h2>提出问题</h2>
    <p>
      你想做一件很小的事：把站点的品牌色从橙色换成蓝色。听起来是改一个值，可真正动手时会发现，同一个色值散落在按钮、徽标、边框、卡片底色等几十个地方，字面量到处复制。颜色如此，间距、圆角、字号也一样——它们本该是一套「设计令牌」，却在代码里被拆成了无数份互相独立的副本。
    </p>
    <p>
      代价很清楚：改色要全局搜索替换，而替换并不认识语义，它会把不该动的地方一起改掉；更麻烦的是主题切换。用户点一下「夜间模式」，你要的是<strong>同一套 DOM 换一套颜色</strong>，可静态样式表里根本没有一个可以现场改写颜色的入口。不引入某种「变量」机制，这件事就只能靠重发一份新 CSS 来硬扛。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：用预处理器变量。<code>$primary: #e8590c;</code> 声明一次，处处引用，编译后替换成真正的颜色值。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>把散落的字面量收敛成了单一来源</strong>。改一处，所有引用同步变化，编译产物里仍然是干净的颜色，没有运行时开销。对「值固定、只在构建期确定」的场景，它完全够用。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>预处理器变量在<strong>编译期就被替换掉了</strong>，运行时的 JavaScript 既读不到、也改不了它。</li>
      <li>想在用户点击时切换主题，只能重新编译、再发布一份新 CSS，做不到「同一页面即时换肤」。</li>
      <li>第三方组件内部的样式无法被你自己的编译变量覆盖，主题色对它们失效。</li>
      <li>变量值的变化不能驱动任何运行时计算，比如「根据当前间距再推算别的尺寸」就无从谈起。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「集中定义」这个思路，只换一种承载方式：别把颜色当成编译期写死的字面量，而是把它当成一个<strong>运行时可读写的 CSS 属性</strong>——这就是自定义属性，也就是常说的 CSS 变量。声明用 <code>--name</code>，读取用 <code>var(--name, fallback)</code>。
    </p>
    <p>
      它和普通属性一样参与层叠与继承。定义在 <code>:root</code> 上，全站可用；在 <code>.card</code> 里重新声明 <code>--card-padding: 20px</code>，就只有这个元素及其后代读到新值——这正好是「作用域内的主题覆盖」。于是局部微调不必污染全局，主题切换也不必动到任何选择器。
    </p>
    <p>
      最关键的一点是：它是运行时可写的。执行 <code>element.style.setProperty('--primary-color', '#000')</code>，所有读取该变量的属性立刻重算，<strong>整套配色无需重编译、无需新 CSS 就切换了过去</strong>。这正是编译期变量给不了的能力。
    </p>
    <ul>
      <li><strong>备用值</strong>只在变量未定义或无效时生效：<code>color: var(--text-color, #333)</code>。</li>
      <li><strong>可与 calc 组合</strong>，把令牌和计算绑在一起：<code>--col-width: calc((100% - var(--gutter) * 2) / var(--cols))</code>。</li>
      <li><strong>命名用语义而非外观</strong>：写 <code>--color-primary</code> 而不是 <code>--blue</code>，换主题时语义不变，代码也不用跟着改。</li>
    </ul>
    <p>
      它之所以能被 JavaScript 随意读写，是因为浏览器把它当成<strong>真正的属性</strong>对待——变量名、作用域、继承关系，全都遵循和 <code>color</code>、<code>padding</code> 一样的层叠规则。这也带来一个实用的调试习惯：主题「没生效」时，先在开发者工具里查看某个元素上<strong>变量解析后的实际值</strong>，再顺着继承链往上找是哪一层把值覆盖了，比在几十条规则里猜要快得多。把色板、间距、圆角这些设计令牌集中在 <code>:root</code>，正是为了让所有组件共享同一份来源。
    </p>
    <p>把四种基本用法摆在一起对照，更容易记住各自的职责。</p>
    <table>
      <thead>
        <tr><th>用法</th><th>写法</th><th>要点</th></tr>
      </thead>
      <tbody>
        <tr><td>声明</td><td><code>--name: value;</code></td><td>以两个连字符开头，值是任意合法 CSS 值</td></tr>
        <tr><td>读取</td><td><code>var(--name, fallback)</code></td><td>备用值仅在未定义或无效时生效</td></tr>
        <tr><td>JS 访问</td><td><code>element.style.setProperty('--name', val)</code></td><td>运行时改写，立即驱动重算</td></tr>
        <tr><td>继承</td><td>随普通属性向下继承</td><td>局部重声明即作用域覆盖</td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>一个容易踩的坑：</strong>自定义属性<strong>不能直接参与动画插值</strong>——浏览器不知道 <code>#e8590c</code> 到 <code>#1971c2</code> 之间该怎么过渡。想让主题色平滑变化，要把它读进具体属性或 <code>calc()</code> 里再动：<code>color: var(--text-color)</code> 这样的属性值本身才是可插值的对象。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换暖色与冷色主题，再拖动间距滑块，看一套变量如何同时驱动配色与留白。</figcaption>
      <C07Variables />
    </figure>

    <h2>总结</h2>
    <p>
      CSS 变量把「设计令牌」从编译期的静态副本，变成了运行时可以被读取、继承与改写的属性。定义在 <code>:root</code> 就全局共享，局部重声明就作用域覆盖，<code>style.setProperty()</code> 一改就整套生效——主题切换、间距微调这些过去要重发 CSS 的事，现在都收敛成了改一个值。
    </p>
    <div class="lesson-term">
      <span class="term-name">「CSS 变量（自定义属性）」</span>以 <code>--name</code> 声明、<code>var(--name, fallback)</code> 读取，与普通属性一样参与层叠和继承。它可在运行时被 <code>element.style.setProperty()</code> 改写，从而驱动整套主题切换；定义在 <code>:root</code> 全局可用，局部重声明即作用域覆盖，备用值只在变量未定义或无效时生效。
    </div>
  </LessonArticle>
</template>
