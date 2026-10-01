<script setup lang="ts">
import TW23Plugins from './TW23Plugins.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>项目里有串类名（卡片阴影加文字阴影）反复出现了十几遍，我想把它收成一个类；可转念一想，手写一个裸 CSS 类，是不是就再也用不了 <code>hover:</code> 和 <code>md:</code> 这些前缀了？
    </div>

    <h2>重复模式的积累</h2>
    <p>
      项目做到中期，你会攒下一批「重复的模式」：一种特定的卡片外观、一段固定的文字阴影、一个所有按钮都用的基础样式，还有一个「内容超出视口才渲染」的性能小技巧。每个模式单独看都不复杂，但它们在多个文件里被反复抄写，改动一次要全局搜替换。
    </p>
    <p>
      这时第一反应是抽出来。但抽到哪里、抽成什么形态，有讲究：抽成 Vue 组件？它显然不是业务组件；抽成一个裸 CSS 类？又担心脱离 Tailwind 的变体与优先级体系，用不了 <code>hover:</code> 和响应式前缀，还会和工具类抢优先级。你还可能顺手想装几个官方插件补能力，却发现某些插件在 v4 里其实早已内置。
    </p>

    <h2>复制与裸写两路</h2>
    <p>
      最省事的两条路：要么继续复制那串类名，要么写一段裸 CSS 放在样式文件里，比如自己定义一个 <code>.text-shadow</code>。
    </p>
    <p>
      它们各自做对了一件事。复制是最短路径，零抽象、零学习成本；裸 CSS 则真的把重复消除了，一处改动全局生效。对于「完全静态、不需要变体、不需要参数」的样式，裸 CSS 在功能上确实够用。问题不在能不能跑，而在它<strong>退出了 Tailwind 的体系</strong>——变体、优先级排序、按需生成统统不再适用。
    </p>

    <h2>裸写的变体缺口</h2>
    <ul>
      <li>裸 CSS 类不在变体系统里，写不出 <code>hover:text-shadow</code> 或 <code>md:</code> 覆盖，需要变体时只能再写一份。</li>
      <li>它的优先级由选择器与书写位置决定，容易和工具类打架，出现「明明写了却没生效」。</li>
      <li>需要「按参数生成」的能力时——比如根据传入的阴影值生成一类工具——静态 CSS 根本没有对应表达。</li>
      <li>继续复制则把维护成本留给未来，改一处漏一处，最后谁也不敢删。</li>
      <li>为几个小能力装一堆插件，可能重复引入 v4 已内置的功能，白白增加构建与产物体积。</li>
    </ul>

    <h2>扩展方式的判定</h2>
    <p>
      先立一条判断顺序：<strong>能用内置工具或任意值表达的，就用内置；内置确实表达不了的<strong>单用途</strong>能力，注册成自定义工具；只有需要动态值或更复杂的逻辑时，才动用插件 API。</strong>大多数时候，你需要的其实是中间那一档，而不是一上来就写插件。
    </p>
    <p>
      中间那一档就是 <code>@utility</code>：它注册一个静态或函数式的自定义工具类，并<strong>自动接入变体系统</strong>——你定义的 <code>text-shadow</code> 可以像内置类一样被 <code>hover:</code>、<code>md:</code> 组合使用，还享有和工具类一致的优先级排序。这正解决了裸 CSS 的两个痛点：变体用不了、优先级打架。
    </p>
    <p>
      当你需要往体系里塞普通 CSS 时，用 <code>@layer</code> 把它放进明确的级联层级：<strong>基础样式放 base、组件类放 components、工具类放 utilities</strong>。层次分明之后，工具类覆盖组件、组件覆盖基础，顺序清晰可预期，不再靠堆 <code>!important</code> 去压。
    </p>
    <div class="lesson-box warn">
      <strong>v4 的重要变化：</strong>默认不再自动读取 <code>tailwind.config.js</code>。插件属于 JS 配置能力，若要用旧式的 <code>plugin()</code>，必须在 CSS 里用 <code>@config</code> 显式加载配置；而简单工具请优先用 CSS-first 的 <code>@utility</code>，不必为此引入 JS 配置。
    </div>
    <p>
      确实需要更复杂能力时，才落到 <code>plugin()</code>：<code>addBase</code> 添加基础样式、<code>addComponents</code> 添加组件类、<code>addUtilities</code> 添加工具类、<code>addVariant</code> 注册自定义变体、<code>matchUtilities</code> 按传入值动态生成工具类。官方插件里 <code>@tailwindcss/typography</code>（<code>prose</code> 排版）、<code>@tailwindcss/forms</code>（表单重置）覆盖了常见能力，而 <code>line-clamp</code>、<code>aspect-ratio</code>、<code>container-queries</code> 这类早已内置，不必再装同名插件。
    </p>
    <p>
      最后是纪律：自定义能力要保持<strong>单一职责</strong>，一个工具只做一件事；真正带业务逻辑的复杂组件仍然应该封装成 Vue 组件，而不是塞进工具类。插件若发布成 npm 包可以跨项目复用，但只应暴露必要 API，控制启动开销。从裸 CSS 迁移过来时，逐个替换并对照产物，确认生成的类名与优先级都符合预期。
    </p>
    <ol class="lesson-steps">
      <li>先确认是否能用内置工具、任意值或 <code>@utility</code> 解决，避免为简单需求引入插件。</li>
      <li>注册官方插件或自写 <code>plugin()</code> 时，按 <code>addUtilities</code> / <code>addComponents</code> / <code>addBase</code> / <code>addVariant</code> 分门别类扩展。</li>
      <li>需要按参数生成工具类时用 <code>matchUtilities</code>，配合入参与阈值生成动态值。</li>
      <li>在产物中核对插件注册的类名与变体能否被正常生成。</li>
    </ol>

    <h2>三类扩展方式</h2>
    <figure class="lesson-figure">
      <figcaption>在「官方插件」「自定义插件」「typography 排版」三个页签间切换，看不同扩展方式各自适合什么。</figcaption>
      <TW23Plugins />
    </figure>

    <h2>梯度化的扩展法</h2>
    <p>
      扩展 Tailwind 有一条清晰的梯度：内置工具与任意值能解决的，不写任何东西；单用途能力用 <code>@utility</code>，自动获得变体与正确优先级；需要堆放普通 CSS 就用 <code>@layer</code> 找准位置；只有动态值或复杂逻辑才上 <code>plugin()</code>，并记住 v4 要经 <code>@config</code> 加载。关键是保持单一来源——同一个能力，别在裸 CSS 和工具类里各写一份。
    </p>
    <div class="lesson-term">
      <span class="term-name">「@utility 与插件 API 的分工」</span><code>@utility</code> 用于注册<strong>简单、单用途</strong>的自定义工具类，自动接入变体系统与优先级排序，是 CSS-first 下的首选扩展方式；<code>plugin()</code> 的 <code>addBase</code> / <code>addComponents</code> / <code>addUtilities</code> / <code>addVariant</code> / <code>matchUtilities</code> 面向<strong>动态值或更复杂</strong>的扩展，属 JS 配置能力，v4 中需用 <code>@config</code> 显式加载。
    </div>
  </LessonArticle>
</template>
