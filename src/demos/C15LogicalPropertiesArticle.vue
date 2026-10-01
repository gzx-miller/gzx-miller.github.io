<script setup lang="ts">
import C15LogicalProperties from './C15LogicalProperties.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>阿拉伯语版本一上线，右上角的「热门」角标跑到了左边，文字间距也整体反了——同一套 CSS，为什么换个语言方向，布局就全乱套？
    </div>

    <h2>多语言卡片的方向适配</h2>
    <p>
      你在做一个会走向多语言的商品卡片：角标钉在「文字开始的那一侧」上角，内容左边留 16px 间距，左右内边距还不一样。用中文、英文都好端端的，可一旦切到阿拉伯语这种从右往左阅读的书写方向，整张卡片的视觉重心就翻了个面。
    </p>
    <p>
      根子在于，你写的 <code>left</code>、<code>right</code> 是<strong>物理方向</strong>——它们钉死在屏幕上，与文字朝哪边流毫无关系。而用户真正想要的是<strong>逻辑方向</strong>：角标永远跟在「行首」那一侧，无论行首在左还是在右。不掌握这层区分，你就得为每个从右往左的语言再补一套镜像样式，卡片加一条规则，镜像也得跟着加一条——维护量翻倍，漏一条就出 bug。
    </p>

    <h2>方向样式的直写</h2>
    <p>
      最直白的写法：需要左边距就写 <code>margin-left: 16px</code>，左对齐就写 <code>text-align: left</code>，角标钉左上就写 <code>position: absolute; left: 0</code>。这套写法做对了一件大事：<strong>它在当前书写方向下语义准确、所见即所得</strong>。屏幕左边就是左边，改起来最直观。
    </p>
    <p>
      只要项目只面向一种从左往右的语言，这就是最省心的方案。问题出在「只面向一种」这个假设上。
    </p>

    <h2>语向切换后的返工</h2>
    <ul>
      <li>切到 RTL，<code>left</code> 不会自动翻转成 <code>right</code>，所有方向性样式都要手写 <code>[dir=&quot;rtl&quot;]</code> 覆盖一遍。</li>
      <li>每新增一条物理方向样式，都必须补一条镜像规则，规则数量翻倍，还极容易漏掉。</li>
      <li><code>width</code> / <code>height</code> 在垂直书写模式下语义也会错位，可它们看起来「与方向无关」。</li>
      <li>设计稿说「角标贴行首上角」，实现里却要翻译成 left 还是 right，沟通成本反复发生。</li>
    </ul>

    <h2>文字流坐标的引入</h2>
    <p>
      不推翻「描述方向」，而是把方向从<strong>屏幕坐标</strong>换成<strong>文字流坐标</strong>。CSS 用两个轴来表达：<code>inline</code> 轴是<strong>行内文字的走向</strong>，在从左往右的书写模式里就是左右；<code>block</code> 轴是<strong>块级堆叠的方向</strong>，也就是上下。每条轴又有 <code>start</code> 与 <code>end</code> 两端。于是「左边距」这类写法被替换成 <code>margin-inline-start</code>：在 LTR 里它等于 <code>margin-left</code>，在 RTL 里它自动等于 <code>margin-right</code>。
    </p>
    <p>
      这套映射是有规律的，记住几组典型对应，其余能推出来：
    </p>
    <table>
      <thead>
        <tr><th>物理属性</th><th>逻辑属性</th><th>说明</th></tr>
      </thead>
      <tbody>
        <tr><td><code>margin-left</code> / <code>margin-right</code></td><td><code>margin-inline-start</code> / <code>margin-inline-end</code></td><td>LTR 下分别等于 left / right</td></tr>
        <tr><td><code>margin-top</code> / <code>margin-bottom</code></td><td><code>margin-block-start</code> / <code>margin-block-end</code></td><td>对应块轴两端</td></tr>
        <tr><td><code>padding-left</code> 等</td><td><code>padding-inline</code> / <code>padding-block</code></td><td>可用简写一次给两端</td></tr>
        <tr><td><code>border-left</code></td><td><code>border-inline-start</code></td><td>边框同样支持逻辑写法</td></tr>
        <tr><td><code>width</code> / <code>height</code></td><td><code>inline-size</code> / <code>block-size</code></td><td>随书写模式换向</td></tr>
        <tr><td><code>text-align: left</code></td><td><code>text-align: start</code></td><td>对齐跟随行首</td></tr>
        <tr><td><code>left: 0</code>（定位）</td><td><code>inset-inline-start: 0</code></td><td>配合 <code>inset: 0</code> 可四边归零</td></tr>
        <tr><td><code>border-top-left-radius</code></td><td><code>border-start-start-radius</code></td><td>圆角按「块起 + 行起」定位</td></tr>
      </tbody>
    </table>
    <p>
      简写也一并逻辑化了：<code>margin-inline: 16px</code> 给行内两端各 16px，<code>margin-block: 8px 12px</code> 给块轴的起始 8px、结束 12px，省去写两个方向。定位场景则用 <code>inset-inline-start</code>，让角标永远贴在<strong>行首</strong>那一侧的上角——切到 RTL，它会自动跑到右边，且不需要任何覆盖规则。
    </p>
    <p>
      回到开场那张卡片，改动其实只有三处：把角标的 <code>left: 0</code> 换成 <code>inset-inline-start: 0</code>，把内容的 <code>margin-left</code> 换成 <code>margin-inline-start</code>，把 <code>text-align: left</code> 换成 <code>text-align: start</code>。切到 RTL 时，这三条会一起翻向右侧，与文字方向严丝合缝，而<strong>你一行覆盖规则都没写</strong>。这正是逻辑属性最实在的收益：不是把镜像规则写得更聪明，而是让它根本不需要存在。
    </p>
    <p>
      真正关键的是这条性质：<strong>逻辑属性测的是「文字流」，所以它会随 LTR / RTL 以及书写模式自动换向</strong>。水平书写时 <code>inline-size</code> 是宽度、<code>block-size</code> 是高度；一旦换成垂直书写模式，两者语义交换，而物理属性 <code>width</code> / <code>height</code> 则原地不动、立刻错位。一套逻辑属性代码，因此可以同时适配多种语言方向。
    </p>
    <div class="lesson-box hint">
      <strong>协作小建议：</strong>与设计沟通时，尽量用「行首 / 行尾、块首 / 块尾」这样的方向语义，而不是「左 / 右」。约定好语义后，落地时直接写逻辑属性，RTL 适配就几乎不需要额外工作。
    </div>

    <h2>物理与逻辑的镜像</h2>
    <figure class="lesson-figure">
      <figcaption>切换 LTR / RTL，对比左右两张卡片：物理属性原地不动，逻辑属性自动镜像。</figcaption>
      <C15LogicalProperties />
    </figure>

    <h2>对齐基准的替换</h2>
    <p>
      物理属性钉在屏幕方向上，逻辑属性钉在文字流方向上。把 <code>left</code> / <code>right</code> 换成 <code>inline-start</code> / <code>inline-end</code>，把 <code>top</code> / <code>bottom</code> 换成 <code>block-start</code> / <code>block-end</code>，把 <code>width</code> / <code>height</code> 换成 <code>inline-size</code> / <code>block-size</code>，RTL 与垂直书写模式就能自动适配，不必再手写一套镜像覆盖。判断口诀只有一句：凡是带方向的样式，先问它相对的是「屏幕」还是「文字流」，后者就该用逻辑属性。
    </p>
    <div class="lesson-term">
      <span class="term-name">「逻辑属性」</span>用 <code>start</code> / <code>end</code> 描述文字流方向：<code>inline</code> 对应行内走向，<code>block</code> 对应块级堆叠方向。物理属性（<code>left</code> / <code>right</code> / <code>top</code> / <code>bottom</code>）固定方向、RTL 下不会自动翻转；逻辑属性（<code>margin-inline-start</code>、<code>inline-size</code>、<code>block-size</code>、<code>inset-inline-start</code>、<code>text-align: start</code> 等）则随 LTR / RTL 及书写模式自动换向，例如 <code>margin-inline-start</code> 在 LTR 中是 <code>margin-left</code>、在 RTL 中是 <code>margin-right</code>。面向多语言（含阿拉伯语 RTL）的项目应优先采用。
    </div>
  </LessonArticle>
</template>
