<script setup lang="ts">
import TW15CustomUtilities from './TW15CustomUtilities.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程简介需要「最多显示三行、超出省略」，我手写了一个 <code>.line-clamp-3</code> 塞进全局样式，结果它不能像别的工具类那样加 <code>hover:</code>，还和后来加的类互相盖来盖去。
    </div>

    <h2>卡片简介截断需求</h2>
    <p>
      你在做课程卡片的简介区域。一段长短不一的介绍文字，最多只能占三行，超出的部分要用省略号收掉。Tailwind 的内置工具没能直接表达这个能力（或者在旧版本里没有），于是你很自然地想到：写一段普通的 CSS 不就行了？
    </p>
    <p>
      于是你在全局样式里定义了 <code>.line-clamp-3</code>，逻辑上完全正确，页面上也确实生效了。但你很快发现，它和 Tailwind 的其他类「不是一路人」：别的工具类可以随手加 <code>hover:</code>、<code>md:</code> 前缀，它不行；别的类有明确的优先级顺序，它却可能莫名其妙地被覆盖。问题不在 CSS 本身，而在于<strong>它没有融入 Tailwind 的体系</strong>。
    </p>

    <h2>全局裸类写法</h2>
    <p>
      最省事的做法，就是在全局样式文件里手写一个普通类，把 <code>-webkit-line-clamp</code> 那几行声明塞进去。这个方案对的地方很明显：<strong>它用最小的代价解决了当下的具体问题</strong>，不需要理解任何机制，复制粘贴就能跑。
    </p>
    <p>
      代价是，你悄悄建立了一套<strong>平行于 Tailwind 的样式体系</strong>。同一件事——「控制截断行数」——现在有了两个来源：一边是工具类，一边是这个裸类。它们谁也不认识谁，久而久之项目里就出现两套规则在打架的局面。
    </p>

    <h2>裸类缺少变体</h2>
    <ul>
      <li>裸类不会自动接入变体系统，<code>hover:line-clamp-3</code>、<code>md:line-clamp-2</code> 这类组合写不出来。</li>
      <li>它的优先级不受 Tailwind 管理，和工具类叠加时容易出现谁覆盖谁说不清的情况。</li>
      <li>「截断」这件事有了两处实现，违背单一来源，日后改一处忘一处。</li>
      <li>如果写的是带参数的一系列值，手写类无法像函数式工具那样按参数生成。</li>
    </ul>

    <h2>自定义工具注册</h2>
    <p>
      不推翻「自定义能力」，而是让它<strong>以 Tailwind 的方式注册进来</strong>。<code>@utility</code> 就是为此设计的：它注册一个静态或函数式的自定义工具，并且<strong>自动接入变体系统</strong>——注册之后，你写的 <code>line-clamp-*</code> 可以像内置工具一样组合 <code>hover:</code>、<code>md:</code> 等前缀使用。同时，<code>@utility</code> 定义的工具会自动获得正确的优先级排序，不会再和内置工具互相踩踏。
    </p>
    <p>
      写法上，静态能力直接声明；需要按参数生成值的，用占位符把参数引进来。例如为截断行数定义一个函数式工具：
    </p>
    <ol class="lesson-steps">
      <li>先确认内置工具与任意值都无法清晰表达该能力——能内置就别自定义。</li>
      <li>把单用途能力注册为 <code>@utility</code>，保持可组合、可加变体。</li>
      <li>按「基础样式 / 组件 / 工具」选择正确的 <code>@layer</code> 落位。</li>
      <li>给自定义工具加上 <code>hover:</code> 前缀，验证变体系统自动生效。</li>
    </ol>
    <p>
      第二步涉及 <code>@layer</code>，这是让自定义 CSS 与工具类<strong>和平共处</strong>的机制。Tailwind 用级联层把样式分门别类：<code>@layer base</code> 放基础默认值（如全局的字体、边距归零），<code>@layer components</code> 放组件级样式，<code>@layer utilities</code> 放工具类。把普通 CSS 放进对应的层里，它就有了明确的优先级位置，不会再随书写顺序随机决定胜负。比如上面那个截断工具的声明可以写成 <code>@utility line-clamp-*</code>，内部用 <code>--value(integer)</code> 接收行数参数。
    </p>
    <div class="lesson-box warn">
      <strong>三条纪律：</strong>其一，<strong>自定义工具应保持单一职责</strong>——一个工具只做一件事，才能被自由组合；其二，<strong>不要用自定义工具造「大组件」</strong>，复杂业务组件仍应封装为 Vue 组件，工具类管理的是原子能力；其三，从裸 CSS 迁移时<strong>逐个替换并对照产物</strong>，确认优先级符合预期，别一次性全改。
    </div>
    <p>
      这里也能解释「为什么 <code>@utility</code> 优于手写裸类」：它不仅定义了样式，还<strong>把这个能力交给了 Tailwind 的编译器去统一管理</strong>——变体、优先级、按需生成，全都自动接上。你得到的不是一个孤立的类，而是一个真正的工具类。
    </p>

    <h2>截断工具持续可组合</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑块调整截断行数，观察 <code>@utility</code> 注册的自定义工具如何持续可组合。</figcaption>
      <TW15CustomUtilities />
    </figure>

    <h2>工具融入体系</h2>
    <p>
      扩展 Tailwind 的正确姿势，是「融入」而不是「另起炉灶」。用 <code>@utility</code> 注册自定义工具，让它自动获得变体支持与优先级排序；用 <code>@layer</code> 把普通 CSS 放进明确的级联层级。保持单一来源、保持单一职责，项目里就不会长出两套互相打架的样式体系。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Cascade Layers」</span>指用 <code>@layer base/components/utilities</code> 把普通 CSS 放进明确的级联层级，从而获得确定的优先级位置。与之配套的 <code>@utility</code> 用于注册静态或函数式自定义工具，并<strong>自动接入变体系统与优先级排序</strong>，因此优于手写裸类。约定：自定义工具保持单一职责，复杂组件仍封装为 Vue 组件，迁移时逐个替换并对照产物。
    </div>
  </LessonArticle>
</template>
