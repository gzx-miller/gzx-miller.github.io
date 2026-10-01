<script setup lang="ts">
import TW07Layout from './TW07Layout.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>筛选侧栏加了课程卡片后，侧栏被一张长标题的卡片撑得越来越宽，正文区域反而挤成一条缝——明明宽度都设过了，布局为什么还是被内容带着跑？
    </div>

    <h2>长内容与结构变形</h2>
    <p>
      你要搭一个课程页的骨架：左边一条筛选侧栏，右边是课程卡片网格。这个结构在常见屏幕上都成立，直到某张卡片的标题特别长，或者塞进一个很长的单词。
    </p>
    <p>
      这时会出现两种典型症状：要么侧栏被内容顶宽，把主区域挤没了；要么主区域里的长文本直接溢出容器，撑破整行。问题的根子不在颜色和间距，而在<strong>「用 Flex 还是 Grid，以及内容最小尺寸怎么处理」</strong>这两件事上。
    </p>

    <h2>浮动与外边距拼凑</h2>
    <p>
      最省事的做法是用浮动或大把 margin 把两块内容推到该在的位置：侧栏 <code>float: left; width: 12rem</code>，主区域靠外边距让开。它能排出两个区域，看起来也像是「布局」。
    </p>
    <p>
      它做对的是<strong>先确定大块的位置关系</strong>。但用 margin 拼出来的布局没有真正的轨道概念，两个区域不是「一起算出来的」，而是一个个手工挪出来的。
    </p>

    <h2>模拟布局连带影响</h2>
    <ul>
      <li>用大量 margin 模拟布局，间距一变就要成片调整，牵一发动全身。</li>
      <li>没有轨道约束，窄屏下两个区域不会自动堆叠，得再补一套媒体查询。</li>
      <li>长文本、长单词会直接溢出容器、撑破整行，因为它受内容的「最小尺寸」支配。</li>
      <li>哪块该弹性伸缩、哪块该保持固定，全靠数值约定，改一处就容易失衡。</li>
    </ul>

    <h2>一维与二维分工</h2>
    <p>
      换成真正的布局模型，第一步是先分清<strong>一维还是二维</strong>。<strong>Flex 在一维主轴上分配与对齐子项，尺寸由内容驱动</strong>，适合导航、标签、行内对齐；<strong>Grid 用行列轨道定义二维结构，位置由轨道决定</strong>，适合这种「侧栏 + 主区」的页面骨架。
    </p>
    <p>
      于是骨架写成一串类名：<code>grid grid-cols-[12rem_minmax(0,1fr)] gap-4</code>。一列是固定的 12rem 侧栏，另一列是弹性主区。这里的 <code>minmax(0,1fr)</code> 不是多余的——它把弹性轨道的<strong>最小尺寸从「自动（按内容）」压到 0</strong>，长内容就没法再把轨道撑开了。
    </p>
    <div class="lesson-box warn">
      <strong>这是长文本溢出最常见的根因：</strong>Flex 和 Grid 的子项默认 <code>min-width: auto</code>，会按内容的最小宽度「冻结」，结果就是再弹性也缩不回去。<strong>对含长内容的弹性子项补一个 <code>min-w-0</code></strong>（或在轨道上用 <code>minmax(0,1fr)</code>），溢出问题往往当场消失。同理，<code>flex-1</code> 的简写也依赖这个默认值，遇到长内容一样要补 <code>min-w-0</code>。
    </div>
    <p>
      主区域内部则换用 Flex 做排列：<code>flex flex-wrap gap-4 [&amp;&gt;*]:grow</code>，卡片沿主轴展开、按需换行、平均分配宽度。这正是常见的组合方式——<strong>Grid 负责页面与区块的骨架，Flex 负责组件内部的排列，二者嵌套是常态，不是妥协</strong>。
    </p>
    <p>
      选择标准其实很清晰：<strong>内容决定排列顺序、只在一个方向上流动的，用 Flex；位置由行列轨道决定、需要同时管两个方向的，用 Grid。</strong> 先按这个关系选好模型，再往上叠对齐、间距与响应式覆盖，顺序别倒过来。
    </p>
    <p>
      顺序为什么不能倒？因为布局模型决定了后面所有数值的含义。模型选错，间距和颜色调得再仔细，也只是一遍遍给错误的骨架打补丁；等发现要换模型，之前那些微调的间距基本都要推倒重来。
    </p>
    <p>
      还有一个很实用的排查习惯：怀疑是轨道被内容撑破时，先给容器加一圈临时的<strong>描边</strong>，把每个轨道的真实边界看清楚，再去找是哪一块内容的最小宽度没被压住。多数时候答案就落在那个忘了写 <code>min-w-0</code> 的子项上——它看起来毫无存在感，却是整段布局塌陷的起点。
    </p>
    <ol class="lesson-steps">
      <li>先判断是一维流还是二维轨道，据此选择 Flex 或 Grid。</li>
      <li>建立尺寸、换行与溢出规则，必要处补 <code>min-w-0</code> 与 <code>overflow-*</code>。</li>
      <li>最后再补响应式覆盖与视觉间距。</li>
      <li>在窄屏塞入一个超长单词，验证溢出行为符合预期、且不会撑破布局。</li>
    </ol>

    <h2>侧栏与卡片排布</h2>
    <figure class="lesson-figure">
      <figcaption>在 Grid 与 Flex 之间切换，观察筛选侧栏与课程卡片各自的排布方式。</figcaption>
      <TW07Layout />
    </figure>

    <h2>维数决定布局模型</h2>
    <p>
      布局选择的答案很干脆：一维用 Flex、二维用 Grid，两者嵌套使用。真正容易翻车的是内容溢出——弹性子项默认按内容最小尺寸「冻结」，记得补上 <code>min-w-0</code> 或 <code>minmax(0,1fr)</code>，让轨道该缩就缩。选对模型，再管住最小尺寸，骨架就稳了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「min-w-0」</span>用于解除 Flex/Grid 子项默认的 <code>min-width: auto</code>。弹性子项默认会按内容的最小宽度冻结，导致长文本撑破轨道；补 <code>min-w-0</code>（或在轨道上写 <code>minmax(0,1fr)</code>）即可让它正常收缩。配合 <code>overflow-*</code>，是长内容布局里最常被忽略的一环。
    </div>
  </LessonArticle>
</template>
