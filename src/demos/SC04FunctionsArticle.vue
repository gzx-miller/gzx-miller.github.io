<script setup lang="ts">
import SC04Functions from './SC04Functions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>间距是 8px、16px、24px、32px 这样一路递增的，我在十几个文件里手写了这些数字；后来基准从 8 改成 4，我只能全项目搜索数字挨个替换——既然它有规律，为什么规律没有被写下来？
    </div>

    <h2>提出问题</h2>
    <p>
      设计系统里的间距、圆角、字号，通常是一套<strong>有比例关系</strong>的序列，而不是一堆互不相干的数。可落到代码里，它们往往退化成一串散落的字面量：第八步是多少，得心算；想加第九步，得照着上一步再加一个基准。规律存在于设计稿里，却没有存在于样式代码里。
    </p>
    <p>
      这件事的代价同样是「改的时候才显现」的：基准一变，所有派生值都要重算；某处手算错了一个 4px，界面不会报错，只会看起来略微不对。更要紧的是，这些数字<strong>无法被校验</strong>——传入的是 <code>8px</code> 还是 <code>8</code>，编译器都照收不误，错误要等到肉眼发现。
    </p>

    <h2>最小方案</h2>
    <p>
      不用函数，最朴素的做法是把每一步的<strong>结果</strong>存成变量：<code>$space-1: 4px</code>、<code>$space-2: 8px</code> 一直到 <code>$space-10: 40px</code>，用的时候写 <code>padding: $space-4</code>。
    </p>
    <p>
      这已经比裸数字进了一大步：<strong>值收敛到了一处</strong>，语义也从「16px」变成了「第 4 级间距」，改基准时至少知道该动谁。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>变量存的是<strong>结果</strong>，不表达<strong>计算</strong>。第 7 级是多少，仍然要人去算，算错也无人发现。</li>
      <li>序列一旦要延长，就得手工再算一个值补进去；基准调整时，整套数值都要重算一遍。</li>
      <li>它无法校验输入单位。传入 <code>8px</code> 与传入 <code>8</code> 都是合法参数，但两者的含义完全不同，错配会悄悄传到产物里。</li>
      <li>它表达不了条件。像「数值低于阈值就取最小值」这类规则，用一串静态变量根本无法描述。</li>
      <li>颜色、比例、换算等派生逻辑只能散落在各个文件里手写，重复且容易算错，也没有统一的验证入口。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      把「结果」升级为「计算规则」，就是 <code>@function</code>：它接收参数，返回<strong>单个 Sass 值</strong>，内部可以嵌 <code>@if</code>、<code>@return</code> 等控制流。于是 <code>space(4)</code> 这样的调用取代了 <code>$space-4</code> 的查表，规律第一次被显式写进了代码。
    </p>
    <p>
      这里必须划清一条职责边界：<strong>函数只做计算，不产生 CSS 声明</strong>。一旦你发现自己在函数里想写 <code>padding: ...</code>，那说明你要复用的是「一组声明」，应该改用 Mixin。这条界线守住了，函数才能被安全地嵌进任意表达式，也才能被组合。
    </p>
    <p>
      接下来是让错误尽早暴露。Sass 的值带单位，因此可以在函数入口用 <code>math.is-unitless</code> 之类的检查确认输入是否符合预期，配合 <code>@error</code> 直接中断编译；也可以借助 <code>math.compatible</code> 在求值前判断两个单位维度是否兼容。这样一次错误的调用会变成一次<strong>构建失败</strong>，而不是一份静默走样的样式。
    </p>
    <p>
      除了自己写，现代 Sass 的内置能力都通过 <code>sass:math</code>、<code>sass:color</code> 这样的 <code>sass:*</code> 模块提供，应该优先复用而不是自己造：
    </p>
    <ol class="lesson-steps">
      <li>在函数入口用 <code>math.is-unitless</code> 等函数校验输入单位。</li>
      <li>在 <code>@function</code> 内用 <code>@error</code> 拒绝非法参数，让问题停在编译期。</li>
      <li>复用 <code>sass:math</code>、<code>sass:color</code> 完成计算与颜色转换，除法一律用 <code>math.div</code>，避开已弃用的斜杠除法语义。</li>
      <li>把计算函数集中到 <code>_functions.scss</code>，供令牌与组件共同复用。</li>
    </ol>
    <p>
      最后一个容易被低估的要求是<strong>可预测性</strong>：同样的参数，在任何调用位置都该产出同样的值。函数一旦依赖全局变量或当前上下文，它就从「可用」变成了「需谨慎使用」——代码里出现它的每一处，都得先想清楚此刻的全局状态是什么。与之相反，复杂计算应该拆成若干小函数再组合，每个都小而纯，既容易验证，也容易复用。给自定义函数命名时也要注意与内置函数区分开，避免在阅读时造成误认。
    </p>
    <div class="lesson-box hint">
      <strong>一个判断口诀：</strong>要「算出一个值」用函数，要「产出一段声明」用 Mixin。混着用的后果是调用点看不出副作用——本该只是取值的地方，悄悄往产物里塞了规则。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>拖动步数滑块，看 <code>space($step)</code> 如何把计算规则实时换算成间距。</figcaption>
      <SC04Functions />
    </figure>

    <h2>总结</h2>
    <p>
      函数把设计规律从「一堆别人手算出来的数字」变成了「一条可调用、可校验、可复用的规则」。它只负责计算、不产出声明，输入非法就编译失败，同样参数永远得到同样的结果——做到这三点，样式里的魔法数字就基本消失了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Sass 函数」</span>由 <code>@function</code> 定义，接收参数并返回<strong>单个 Sass 值</strong>，可内嵌 <code>@if</code>、<code>@return</code> 等控制流；现代内置能力通过 <code>sass:math</code>、<code>sass:color</code> 等 <code>sass:*</code> 模块提供，除法使用 <code>math.div</code>，避免已弃用的斜杠除法。函数只做计算，<strong>不应产生 CSS 声明</strong>——需要输出声明时应改用 Mixin。可用 <code>math.is-unitless</code> 校验输入单位，在入口用 <code>@error</code> 拒绝非法参数；自定义函数名应与内置函数区分，复杂计算拆成小函数组合，并保证返回值只依赖入参、不依赖全局状态。
    </div>
  </LessonArticle>
</template>
