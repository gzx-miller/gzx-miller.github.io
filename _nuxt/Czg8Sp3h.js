const e=`<script setup lang="ts">
import SC06Selectors from './SC06Selectors.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>卡片组件要悬停抬升、键盘聚焦描边、精选态换边框色、RTL 下右对齐——我把 <code>.lesson-card</code> 这个类名在样式里写了四五遍，哪天重构改名，就得全文件搜索替换，还得赌自己一处都没漏。
    </div>

    <h2>组件类名反复复制</h2>
    <p>
      组件样式大多是「在组件类名后面接着写」：悬停是冒号伪类，变体是 BEM 修饰符，上下文是放在前面的祖先条件。它们全都从属于同一个组件，但在 CSS 里没有「从属」这个概念——只有一条条完整的选择器。
    </p>
    <p>
      于是每次增加一个状态或变体，你都要把组件类名再抄一遍。代价不是打字多，而是<strong>组件身份被复制到各处</strong>：改名要全局替换、前缀抄错一个字母就默默失效，而像 RTL 这种「上下文写在前面」的关系，用前缀的方式根本表达不出来。
    </p>

    <h2>规则逐条手写</h2>
    <p>
      最直接的做法，原生 CSS 全部写全：
    </p>
    <p>
      <code>.lesson-card:hover { transform: translateY(-2px); }</code>
    </p>
    <p>
      <code>.lesson-card:focus-visible { outline: 2px solid currentColor; }</code>
    </p>
    <p>
      <code>.lesson-card--featured { border-color: #c45125; }</code>
    </p>
    <p>
      <code>[dir="rtl"] .lesson-card { text-align: right; }</code>
    </p>
    <p>
      这个做法对在哪？它写出来的<strong>就是编译产物的真身</strong>，所见即所得，没有任何抽象层。任何一条选择器都能被全文搜索到，静态分析工具也能读懂它的含义。
    </p>

    <h2>改名传播成本</h2>
    <ul>
      <li>组件类名被重复写了好几遍，改名要全局替换，漏一处就留下一条死规则。</li>
      <li>前缀靠字符串复制维持，多写或少写一个字符不会报错，只会静默失效。</li>
      <li>RTL 这类「上下文在前」的关系脱离了组件主体，只能另起一段，看不出它属于这张卡片。</li>
      <li>状态、变体、上下文三类关系都平铺在顶层，组件的边界在代码里消失了。</li>
    </ul>

    <h2>父选择器折叠</h2>
    <p>
      Sass 给了两件工具。第一件是<strong>父选择器 <code>&amp;</code></strong>：它代表「当前外层选择器」。把上面四条规则折进组件块：
    </p>
    <p>
      <code>.lesson-card { &amp;:hover { … } &amp;:focus-visible { … } &amp;--featured { … } [dir="rtl"] &amp; { … } }</code>
    </p>
    <p>
      <code>&amp;:hover</code> 编译成 <code>.lesson-card:hover</code>；<code>&amp;--featured</code> 拼出 BEM 修饰符 <code>.lesson-card--featured</code>；<code>[dir="rtl"] &amp;</code> 则把 &amp; 放到后面，变成 <code>[dir="rtl"] .lesson-card</code>。四条规则重新收在同一个组件块里，组件边界回来了，类名也只写一次。
    </p>
    <p>
      这里有个关键认知：<strong>&amp; 展开的结果取决于完整的外层选择器</strong>。多层嵌套时它带的是整条链，而不是只有最内层那一段，所以不能想当然地认为 &amp; 永远等于某一个类名。
    </p>
    <div class="lesson-box warn">
      <strong>伪类的位置不能乱放：</strong>要表示「自己悬停」，必须写成 <code>&amp;:hover</code>；如果写成 <code>:hover &amp;</code>，语义会变成「祖先处于悬停状态时命中自己」——两者长得像，含义完全不同。这是最容易写错却最难察觉的一处。
    </div>
    <p>
      第二件工具是<strong>插值 <code>#{}</code></strong>：当类名或属性名本身需要由表达式拼出来时才用它。例如 <code>$component: "progress";</code> 之后写 <code>.#{$component}__bar { … }</code>，编译出 <code>.progress__bar</code>。它确实灵活，但代价很实在。
    </p>
    <p>
      动态选择器会让<strong>全文搜索、静态分析和重构同时失效</strong>：你在代码里搜不到 <code>.progress__bar</code>，因为文件里只有 <code>.#{$component}__bar</code>；改一个变量，生成的一整批类名会随之改变，影响范围无法一眼看清。所以插值的用法要有纪律——<strong>把动态程度限制在状态与变体上，选择器的主体保持静态可搜索</strong>。
    </p>
    <p>
      如果确实需要更精细的选择器组合，Sass 提供了 <code>sass:selector</code> 模块，其中的 <code>selector.append</code>、<code>selector.nest</code>、<code>selector.unify</code> 能以可读的方式拼接、嵌套与合并选择器，比手写字符串拼接更安全。
    </p>

    <h2>三种选择器对照</h2>
    <figure class="lesson-figure">
      <figcaption>点一下卡片切换选中态，对照右侧代码里 &amp; 生成的三种选择器写法。</figcaption>
      <SC06Selectors />
    </figure>

    <h2>选择器身份与插值</h2>
    <p>
      父选择器解决的是「组件身份被反复复制」的问题：用 <code>&amp;</code> 把状态、变体、上下文都挂回组件块，改类名只改一处。插值解决的则是「名字要算出来」的问题，但它是双刃剑，用得越深，代码越难搜、越难重构。一句话：<strong>&amp; 用在结构上，插值用在不得不动态的地方。</strong>
    </p>
    <div class="lesson-term">
      <span class="term-name">「父选择器 &amp;」</span>指当前外层选择器，可拼出伪类（<code>&amp;:hover</code>）、BEM 修饰符（<code>&amp;--featured</code>）与上下文在前的位置（<code>[dir="rtl"] &amp;</code>）；它的结果取决于完整外层选择器，且伪类须写在 &amp; 之后。插值 <code>#{}</code> 用于把表达式嵌入选择器或属性名，灵活性高但会削弱搜索、静态分析与重构能力；更精细的组合可用 <code>sass:selector</code> 的 <code>append</code>／<code>nest</code>／<code>unify</code>。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
