<script setup lang="ts">
import TW05ThemeTokens from './TW05ThemeTokens.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>品牌色在十几处写成了同一个十六进制值，改一次品牌色就要全局搜索替换；我把它存成了 CSS 变量，工具类里却一个也用不上——规范到底要怎么才能既好改、又能被类名消费？
    </div>

    <h2>硬编码值重复</h2>
    <p>
      你的项目里有一套视觉规范：品牌色是一种橙、显示字体是一种衬线体、大圆角固定是 1.5rem。这些值会反复出现在按钮、标签、卡片上。
    </p>
    <p>
      现在规范要调整——品牌色变一点色相，圆角再大一点。如果这些值当初是当作「一次性数字」散落在各处的，你就要一处一处找、一处一处改，而且总会漏掉某个角落。真正想要的，是<strong>让这些值有一个单一来源，并且能直接生成日常使用的类名</strong>。
    </p>

    <h2>原生CSS变量</h2>
    <p>
      第一反应是定义 CSS 变量：在 <code>:root</code> 里写 <code>--brand: #ea580c;</code>，然后到处用 <code>var(--brand)</code>。这确实做到了「单一来源」，改一处、全局跟着变。
    </p>
    <p>
      它做对的是<strong>集中管理</strong>。问题在于，它只解决了「值在哪里」，没解决「值怎么用」：变量本身不会生成工具类，你还是得手写一段段 <code>background: var(--brand)</code>，工具类体系和变量体系成了两条互不相通的平行线。
    </p>

    <h2>变量与工具类割裂</h2>
    <ul>
      <li>变量与工具类各自为政，同一套颜色要维护两份写法，很容易走偏。</li>
      <li>魔法数值仍然散落在各处：字号、圆角、断点，凡是没有变量的地方照旧是硬编码。</li>
      <li>把每个临时数值都包装成变量，变量清单会膨胀成一份「毫无约束的数值列表」，反而更难维护。</li>
      <li>变量名要是取成了具体色值（比如 <code>--orange-500</code>），将来整体换品牌色时，名字和数据就对不上了。</li>
    </ul>

    <h2>令牌与变量合一</h2>
    <p>
      Tailwind v4 的 <code>@theme</code> 把这两件事合到一起：它用<strong>带命名空间的 CSS 变量</strong>定义设计令牌，编译器据此<strong>自动生成对应的工具类</strong>，而令牌本身又<strong>保留为运行时变量</strong>，可以被 <code>var()</code> 和 JavaScript 直接复用。
    </p>
    <p>
      命名空间决定「这个令牌会生成什么类」。常见的有：<code>--color-*</code> 生成颜色类、<code>--font-*</code> 生成字体族类、<code>--radius-*</code> 生成圆角类、<code>--breakpoint-*</code> 生成断点变体。也就是说，你在 <code>@theme</code> 里写下的每一行，都会同时得到「一个变量」和「一组类名」。
    </p>
    <div class="lesson-box hint">
      <strong>一条判断标准：</strong><code>@theme</code> 里应该放<strong>稳定的系统约束</strong>，而不是每个魔法数。普通的、只在某个组件里用一次的运行时变量，不需要放进 <code>@theme</code>——它不是「把所有变量集中起来」的收纳箱，而是设计系统对外暴露的接口。
    </div>
    <p>
      命名也值得讲究：用语义，而不是色值。<code>--color-brand-500</code> 表示「品牌色的中间档」，将来品牌色整体换了，名字不必改，工具类 <code>bg-brand-500</code> 也完全不用动；而如果叫 <code>--color-orange-500</code>，换色之后名字就成了误导。
    </p>
    <p>
      最后是克制。新增令牌之前，先确认内置尺度是真的不够用——大多数间距、字号、圆角需求，内置档位都能覆盖。只有当某个值确实代表一条反复出现的规范时，它才值得升级为令牌。
    </p>
    <p>
      为什么值得把这件事从「变量」升级成「令牌」？因为工具类本身带<strong>约束</strong>：它只认识登记过的档位。当你被迫在一串候选类名里挑选颜色、圆角和字号时，你其实是被框在一套受控集合里的；而 <code>var(--whatever)</code> 没有边界，谁都可以随手新造一个变量出来。约束本身，才是设计系统能长期成立的原因。
    </p>
    <ol class="lesson-steps">
      <li>从现有视觉规范里提取需要统一约束的语义令牌。</li>
      <li>按命名空间写进 <code>@theme</code>：颜色、字体、圆角、断点各归其位。</li>
      <li>用生成的工具类替换散落的魔法数值，删掉重复定义。</li>
      <li>在产物里核对生成的工具类名与令牌命名一致。</li>
    </ol>

    <h2>单枚令牌多端驱动</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑杆改变品牌色相，看同一枚令牌如何同时驱动色板、按钮与颜色类。</figcaption>
      <TW05ThemeTokens />
    </figure>

    <h2>单一来源与消费性</h2>
    <p>
      设计令牌要解决的是「单一来源」和「可被消费」这两件事。变量只做到了前者，<code>@theme</code> 把后者也一起解决：写一次令牌，得到工具类、得到运行时变量、得到一个能整体调整的品牌色。关键是克制——把令牌当成设计系统对外暴露的接口，而不是收纳所有变量的箱子，只把真正稳定的约束放进去，规范才会既好改、又好用。
    </p>
    <div class="lesson-term">
      <span class="term-name">「设计令牌」</span>是设计系统里稳定的约束值，如品牌色、字体、圆角、断点。v4 用 <code>@theme</code> 以带命名空间的 CSS 变量（<code>--color-*</code>、<code>--font-*</code>、<code>--radius-*</code>、<code>--breakpoint-*</code>）声明它们：编译器据此生成工具类，令牌同时保留为可被 <code>var()</code> 与 JavaScript 复用的运行时变量。
    </div>
  </LessonArticle>
</template>
