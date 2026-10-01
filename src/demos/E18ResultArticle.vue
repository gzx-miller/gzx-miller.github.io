<script setup lang="ts">
import E18Result from './E18Result.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户点了「提交」之后，页面只剩几个字和一片留白——成功还是失败？接下来该做什么？没人告诉他。
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个课程发布流程。讲师填完课程信息，点了提交，后端返回结果。这时页面需要回答用户两个最朴素的疑问：<strong>发生了什么</strong>，以及<strong>接下来我该做什么</strong>。这两个问题看似简单，却在不同业务流程里反复出现——支付之后、上传之后、发布之后，都要有人来「宣布结果」。
    </p>
    <p>
      如果每个流程都临时拼一个结果提示，代价是<strong>视觉语言四分五裂</strong>：这个页面用红字写失败，那个页面用弹窗写失败，图标有的用对勾有的用感叹号，下一步入口有时在中间有时在角落。用户每次都要重新辨认「现在我该干嘛」，学习成本被白白浪费。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：写一个 <code>div</code>，根据状态条件渲染一段文字，成功就写「提交成功」，失败就写「提交失败」，再配一个返回按钮。
    </p>
    <p>
      它抓住了最核心的一点：<strong>结果页必须有一个明确结论</strong>。有文字、有出口，就已经比一片空白强。问题是这个方案只解决了「说一句话」，没有解决「怎么把话说清楚、说完整」。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>多种状态（成功 / 警告 / 出错 / 提示）的图形没有统一，全靠临时找图标。</li>
      <li>文案只有一层，用户只能看到「发生了什么」，看不到「为什么、怎么办」。</li>
      <li>没有固定的操作入口，「继续」「重试」「查看详情」的按钮位置随缘。</li>
      <li>失败页往往缺一个重试出口，用户只能自己刷新页面重来。</li>
      <li>每个业务各写一套，改风格时要满项目找，永远统一不了。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「给用户一个结论」，而是把结论<strong>结构化成固定的三段</strong>：状态图形、说明文案、下一步入口。Element Plus 的 <code>el-result</code> 正是这套结构的封装。
    </p>
    <p>
      第一段是图形，用 <code>icon</code> 指定，取值有 <code>success</code>、<code>warning</code>、<code>error</code>、<code>info</code> 四种，分别对应成功、警告、出错、提示。四种状态共用一套视觉规范，用户一看图形就知道结果的性质。
    </p>
    <p>
      第二段是文案，分两层：<code>title</code> 说清「发生了什么」，<code>sub-title</code> 补充「接下来怎么办」。这个分层很重要——<strong>状态名称不是终点，下一步建议才是</strong>。与其只写「审核中」，不如补一句「审核通过后将自动上线」，用户立刻知道要不要等、等到什么。
    </p>
    <p>
      第三段是入口，放在 <code>extra</code> 插槽里，比如「继续操作」「查看详情」按钮，失败场景别忘了放一个重试入口。必要时还可以补上结果编号、金额这类关键业务信息，让用户能凭它追溯或核对。
    </p>
    <p>
      这三段其实是把用户心里的三个疑问，各配了一个固定的位置回答：「出什么事了」交给状态图形，「到底成没成」交给 <code>title</code>，「我现在能干嘛」交给 <code>sub-title</code> 与操作按钮。位置固定下来之后，用户不需要每次都重新寻找答案，扫一眼就知道该往哪看。
    </p>
    <p>
      还有一个必须分清的选择：<strong>结果页是「整页级」的反馈</strong>，适合表单提交或流程结束这种需要停留、需要明确下一步的场合。如果只是「保存成功」这类轻量提示，优先用 <code>ElMessage</code> 或 <code>ElMessageBox</code>——为一句一闪而过的提示铺满整屏，反而打断了用户的节奏。
    </p>
    <div class="lesson-box hint">
      <strong>让同一业务流程复用同一套结构：</strong>成功、失败、审核中等状态，不必各写一个页面模板，而是<strong>沿用同一个结果页，只切换 <code>icon</code> 与文案参数</strong>。这样整条流程的视觉语言完全一致，用户也更容易形成「看到这个页面就知道该怎么走」的直觉。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换四个按钮，观察状态图形、双层文案与操作入口如何随 icon 一起变化。</figcaption>
      <E18Result />
    </figure>

    <h2>总结</h2>
    <p>
      结果页解决的，是「流程结束后用户没有结论、没有方向」这件事。它把「状态图形 + 说明文案 + 下一步入口」固化成统一结构，用 <code>icon</code> 区分四种状态，用 <code>title</code> 与 <code>sub-title</code> 分层说明，用 <code>extra</code> 插槽兜住后续操作。记住两点：整页级反馈才用它，轻量反馈交给消息提示；同一流程复用同一结构，只换参数。
    </p>
    <div class="lesson-term">
      <span class="term-name">「结果页」</span>用 <code>el-result</code> 提供标准化的操作结果反馈：<code>icon</code> 指定 <code>success</code> / <code>warning</code> / <code>error</code> / <code>info</code> 四种状态图形，<code>title</code> 与 <code>sub-title</code> 分层说明「发生了什么、接下来怎么办」，<code>extra</code> 插槽放后续操作按钮。它适合表单提交或流程结束后的整页反馈；更轻量的成功或失败提示应优先使用 <code>ElMessage</code> 或 <code>ElMessageBox</code>。
    </div>
  </LessonArticle>
</template>
