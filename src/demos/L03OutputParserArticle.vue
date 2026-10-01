<script setup lang="ts">
import L03OutputParser from './L03OutputParser.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你让模型「推荐三门课」，它回了一段漂亮的编号列表。你顺手写下 <code>result.length</code> 想看有几门课，屏幕上却跳出 <code>47</code>——那是这段话的字符数，不是课程数。
    </div>

    <h2>自由文本与字段落差</h2>
    <p>
      模型只会输出<strong>自由文本</strong>，而程序想要的是<strong>字段</strong>：课程名、难度、适合人群。一头是散文，另一头是 <code>.map()</code>、<code>.filter()</code>、入库——中间横着一条鸿沟。旧办法只能靠手写解析来填：
    </p>
    <ol class="lesson-steps">
      <li>用正则或按行切割把数据抠出来；只要模型换个排版（编号换成圆点、中间多一个空行），解析立刻失败。</li>
      <li>字段一多，正则越接越长，改一处就牵动整段，谁也不敢动。</li>
      <li>抠出来的全是字符串，想要数组、想要枚举，还得自己手写转换和校验。</li>
    </ol>
    <p>
      问题落成一句：<strong>能不能让模型按程序要的形状输出，再用一个统一的解析器把它变成带类型的对象？</strong>
    </p>

    <h2>链尾解析器的挂载</h2>
    <p>
      最省事的做法是在链尾挂一个 <code>StringOutputParser</code>：<code>prompt.pipe(model).pipe(parser)</code>，<code>invoke</code> 之后直接得到一个字符串，不用再手动 <code>.content</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>把 AIMessage 拆包成了纯文本</strong>。你从此拿到的是一段可以正常拼接、正常打印的字符串，而不是一个对象。
    </p>

    <h2>正则兜底残留负担</h2>
    <ul>
      <li>拿到的还是字符串：想取「第三门课的难度」，照样得回去写正则，开头那个问题原样还在。</li>
      <li>模型不知道你要什么形状：你心里想要 JSON，它却回了一段带解释的散文，因为你从没把「要什么格式」写进提示词。</li>
      <li>解析失败没有兜底：模型偶尔在 JSON 后面多写一句「希望对你有帮助」，<code>JSON.parse</code> 当场抛错，整条链断在这里。</li>
      <li>格式随温度漂移：想要模型稳定输出结构化内容，默认温度通常不够用。</li>
    </ul>

    <h2>输出格式显式约定</h2>
    <p>
      不推翻「链尾接解析器」，而是先给模型一个明确的形状。第一步补<strong>格式指令</strong>：让解析器自动把「该按什么格式输出」注入到提示词里，模板中留一个 <code>{format_instructions}</code> 占位即可。先补它，是因为不先约定「期望的格式」，后面解析什么都是在猜。
    </p>
    <p>
      第二步补<strong>类型</strong>：用 Zod 定义输出结构，例如 <code>z.object({ courseName: z.string(), difficulty: z.enum(['入门', '中级', '高级']) })</code>，再交给 <code>StructuredOutputParser.fromZodSchema</code>。解析器据此把文本变成带类型的对象，字段缺失或枚举越界会被 schema 拦下。用 Zod 还和 TypeScript 天然集成，类型更安全——模型输出的形状，第一次在类型层面被写清楚了。
    </p>
    <p>
      第三步补<strong>数组场景</strong>：要一批结果，就把外层换成 <code>z.array(...)</code>，解析出来直接是可遍历的数组，<code>.map()</code> 立刻能用，不再需要按行切割。
    </p>
    <p>
      最后补<strong>稳定性与兜底</strong>：要求输出 JSON 时把温度压到 <code>0</code> 到 <code>0.2</code> 减少格式偏差；解析失败时提供兜底逻辑（重试，或返回一个默认值），别让一次格式抖动把整条链带崩。
    </p>
    <div class="lesson-box warn">
      <strong>别忘了这一层：</strong>schema 越复杂，模型越容易偏离。结构化输出是「大概率成立」而不是「一定成立」，所以降温和失败兜底不是可选项。
    </div>

    <h2>三类解析结果的对照</h2>
    <figure class="lesson-figure">
      <figcaption>在 String / List / Structured 三个页签之间切换：左边同一段「原始输出」不动，右边分别被解析成纯文本、字符串数组、带 name / level / audience 字段的对象数组；Structured 页下面还会显示它对应的那段 Zod schema。</figcaption>
      <L03OutputParser />
    </figure>

    <h2>模型与程序的形状对齐</h2>
    <p>
      解析器做的事，是在模型和程序之间搭一座形状对齐的桥：先让模型知道该输出什么格式，再用 schema 把文本收成一个带类型的对象。台阶是「先约定格式、再定义类型、再稳住温度、最后兜底」，缺了哪一级，桥都会晃。
    </p>
    <div class="lesson-term">
      <span class="term-name">「结构化输出」</span>指让模型按预先定义的结构（如 Zod schema）产出内容，再由解析器转成程序可直接使用的对象。边界是：模型并不保证百分百遵守结构，schema 越复杂越容易偏差，因此必须配合较低温度和解析失败时的兜底逻辑。
    </div>
  </LessonArticle>
</template>
