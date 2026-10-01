<script setup lang="ts">
import TW10Typography from './TW10Typography.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程的正文段落，在宽屏上被拉成一整行一百多个字的长条，读两行眼睛就开始串行；可我把字号调大一点，行与行又挤在一起了——到底该改哪个属性？
    </div>

    <h2>纯文本排版失控</h2>
    <p>
      你在做一个课程详情页。后台把课程简介和学习目标存成纯文本，前端拿到后直接塞进容器显示。<strong>内容与逻辑都没问题</strong>，但打开页面的一瞬间你就觉得不对劲：正文占满整个内容区，一行从屏幕左边排到右边；标题虽然加粗了，却和正文「黏」在一起，段落之间没有呼吸感。
    </p>
    <p>
      这不是「字好不好看」，而是<strong>排版系统没搭起来</strong>。屏幕上每段文字由五个量共同决定：字号、行高、字重、字距和行长。只动其中一个，其余就失衡，于是出现「字变大反而更挤」这种自相矛盾的现象。中文还有自己的前提：没有词间空格、字形方正，同样字号下比拉丁字母更「满」，因此需要的字号与行高通常要更宽松。
    </p>

    <h2>堆砌字号做法</h2>
    <p>
      最省事的做法，是给标题堆 <code>text-xl font-bold</code>，正文保持默认，段落之间随手加一点 <code>mb-2</code>。它做对了一件事：<strong>承认「正文」和「标题」该长得不一样。</strong>在只有两三行的短卡片里，这完全够用，你甚至看不出问题。
    </p>
    <p>
      问题在于，它把「层级」简化成了「调大 + 加粗」。层级要表达的，是读者一眼能分清标题、正文与辅助说明的落差；而落差需要字号、字重、行高、颜色一起配合。内容从三行变成三十行时，这种单维度的做法立刻露怯。
    </p>

    <h2>行高与行长失衡</h2>
    <ul>
      <li>只放大字号却不动行高，行距忽松忽紧，读起来不稳。</li>
      <li>完全不限制行长，宽屏下一行超过一百字，眼睛找不到下一行的起点。</li>
      <li>照搬英文的字号与行高，中文方块字显得更挤，长时间阅读尤其疲劳。</li>
      <li>标题层级差异不明显，<code>text-xl</code> 与 <code>text-lg</code> 混在一起，读者分不清结构。</li>
      <li>段落节奏靠 <code>mb-2</code> 这类临时数值手调，换一处内容就全乱。</li>
    </ul>

    <h2>五个量成对定义</h2>
    <p>
      不推翻「把标题做大」，而是把五个量拆开定死，并让它们成对出现。第一步<strong>先定正文基准</strong>：中文正文从 <code>text-base</code> 起步、行高给到 <code>leading-7</code>（约 1.75）。关键是<strong>成对定义</strong>，写成 <code>text-base/7</code> 这种组合，而不是先写 <code>text-base</code> 回头再补——只改字号忘了行高，就会出现开头那个怪象。
    </p>
    <p>
      第二步<strong>按层级定义标题</strong>：字号逐级递减，行高比例也逐级递减。正文是宽松的 1.75，标题收紧到 <code>text-2xl/8</code>、<code>text-xl/7</code>——标题往往只占一两行，行高比例偏大会把段落感拉散。字重上一级用 <code>font-bold</code>、次级用 <code>font-semibold</code>，让粗细也参与分层；辅助说明则用 <code>text-sm</code> 配更浅的字色，以字号和颜色双重减弱。
    </p>
    <p>
      第三步<strong>限制行长</strong>，这是中文长文收益最大的改动。眼睛要在行尾折回下一行行首，行长过长会让折返困难。经验区间约 <code>60-75ch</code>，内置的 <code>max-w-prose</code> 正落在此范围；给正文加 <code>max-w-prose</code> 或 <code>max-w-[65ch]</code>，屏幕再宽也只占一个舒服的宽度。记住中英文要分别检查——同样的 <code>65ch</code>，两者实际字符宽度并不一样。
    </p>
    <p>
      第四步<strong>处理字距</strong>。中文正文<strong>通常不需要增加字距</strong>，<code>tracking-wide</code> 反让方块字之间出现奇怪的缝隙。字距真正有用的场景是「全大写」的小标签，比如卡片顶部的 eyebrow 文本，给一个 <code>tracking-wider</code> 会更精致——它为特例服务，不该成为正文默认值。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>其一，标题也要在窄屏与超长文本下测一遍，很长的中文标题在小屏换行后，固定行高可能让两行贴得过近；其二，别把层级只做成字号差，字号接近时靠字重与字色补足落差，读者才扫得清结构。
    </div>
    <p>
      整条流水线是：<strong>先定正文基准字号与行高 → 按层级定义标题尺度 → 限制行宽并分别检查中英文 → 最后在真实长文里对比两种字号确定基准。</strong>为什么最后一步要放在真实长文里？因为短文本下字号差异几乎看不出来，只有读上几段整页正文，「累不累」才是唯一的判断标准。
    </p>

    <h2>两套尺度节奏差异</h2>
    <figure class="lesson-figure">
      <figcaption>切换排版密度，对比同一段中文正文在「阅读」与「紧凑」两套尺度下的节奏差异。</figcaption>
      <TW10Typography />
    </figure>

    <h2>五量协同与行宽</h2>
    <p>
      排版层级不是「把标题调大」这么简单，而是让字号、行高、字重、字距、行长五个量协同工作，并成对地、按层级地出现。中文的方块字特性决定了正文需要更宽松的行高，而长文可读性的分水岭，往往就藏在那条被限制到 <code>65ch</code> 的行宽里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「排版层级与可读行长」</span>指用 <code>font-size</code>、<code>line-height</code>、<code>font-weight</code>、<code>letter-spacing</code> 与行长共同构成的视觉秩序。核心约定：字号与行高成对定义（如 <code>text-base/7</code>）；标题的行高比例应小于正文；中文正文需要更宽松的行高且不必加字距；用 <code>max-w-prose</code> 或 <code>max-w-[65ch]</code> 把行长限制在约 60-75ch。
    </div>
  </LessonArticle>
</template>
