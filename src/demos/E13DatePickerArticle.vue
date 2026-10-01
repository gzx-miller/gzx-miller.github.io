<script setup lang="ts">
import E13DatePicker from './E13DatePicker.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>运营同学要查「最近 7 天」的报表，我给了他两个日期输入框，他每次得手动敲开始和结束——更糟的是敲错了一个月，报表口径就全歪了。「最近 7 天」到底是几号到几号，这种话为什么不能由代码算出来？
    </div>

    <h2>相对时间绝对区间</h2>
    <p>
      后台数据页面离不开时间筛选：运营报表、订单流水、审计日志、活动效果，几乎每个列表头上都挂着一个「时间范围」。用户嘴上说的是相对概念——最近七天、上个月、本周——而系统要的是绝对日期区间。<strong>把相对说法翻译成准确区间，是这个组件最核心的价值</strong>。
    </p>
    <p>
      如果不用组件库，常见做法是两个原生 <code>input type="date"</code>，或者自己拼一个日历。前者的问题不是能不能用，而是「口径」几乎必然错乱：用户点开默认的当天、自己数着日子往前推六天，数错一天是常事；两个框之间没有约束，用户完全可能把结束日期选到开始日期之前；未来的日期也拦不住，于是筛出「明天到后天」这种根本不存在的区间。这些错误到了后端才发现，返回一堆空数据，用户还以为系统坏了。
    </p>
    <p>
      代价说清楚：你要自己写日期格式化、自己校验先后顺序、自己造快捷选项、自己算天数——而这些代码里任何一处「包含首尾哪一端」的偏差，都会让数字对不上。
    </p>

    <h2>原生日期框拼接</h2>
    <p>
      最朴素的做法：放两个原生日期输入框，绑两个字符串变量。用户选完，你在提交前把两个值拼成一个区间。
    </p>
    <p>
      它做对了一件事：<strong>把「一次选择」拆成了边界明确的「起点 + 终点」</strong>，语义上是对的——筛选区间本来就有两端。对于「一年一两次、随便选选」的后台，这已经能用。
    </p>

    <h2>起止顺序与格式混乱</h2>
    <ul>
      <li>开始与结束是两个独立输入，用户可以把结束选到开始之前，业务上毫无意义。</li>
      <li>常用周期（最近 7 天 / 30 天）每次都要手动点两遍日历，效率低且易数错。</li>
      <li>拦不住未来日期，容易选出不存在的区间。</li>
      <li>选完之后，界面上没有任何反馈告诉用户「这次筛了几天」，区间口径不直观。</li>
      <li>日期格式全靠自己拼字符串，一旦漏补零就会出现 <code>2026-1-5</code> 这种不一致的写法。</li>
    </ul>

    <h2>成对区间选择</h2>
    <p>
      不推翻「起点加终点」，而是把这两端收进一个 <code>el-date-picker</code>，并且用 <code>type="daterange"</code> 一次性选好。这时 <code>v-model</code> 绑定的不再是单个值，而是<strong>一个包含起止两项的数组</strong>——类型声明必须同步改成数组，否则赋值时立刻报错。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>type="daterange"</code> 让用户在一次面板里同时选定开始和结束。</li>
      <li>用 <code>shortcuts</code> 预置「最近 7 天」「最近 30 天」等常用范围，一键填充。</li>
      <li>用 <code>disabled-date</code> 禁用未来日期，从源头挡掉无效报表条件。</li>
      <li>依据选中的起止日期计算统计天数，在界面上给出筛选摘要。</li>
    </ol>
    <p>
      第二件事是 <code>value-format</code>。默认情况下 <code>v-model</code> 拿到的是 <code>Date</code> 对象，跟后端打交道不方便；把 <code>value-format</code> 设成 <code>YYYY-MM-DD</code>，绑定值就变成字符串。<strong>但这里有一个必须警惕的点：<code>value-format</code> 会改变 <code>v-model</code> 的值类型</strong>——你要么全用字符串，要么全用 <code>Date</code>，在类型声明里一次固定下来。最怕的是一处当 <code>Date</code> 用、一处当字符串比，代码里埋下隐形的类型混乱。
    </p>
    <table>
      <thead>
        <tr>
          <th>属性</th>
          <th>作用</th>
          <th>要点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>type</code></td>
          <td>选择模式</td>
          <td><code>daterange</code> 一次选起止，绑定数组</td>
        </tr>
        <tr>
          <td><code>value-format</code></td>
          <td>格式化绑定值</td>
          <td>会改变 v-model 的值类型，需固定声明</td>
        </tr>
        <tr>
          <td><code>shortcuts</code></td>
          <td>预设常用周期</td>
          <td>其区间由函数动态计算</td>
        </tr>
        <tr>
          <td><code>disabled-date</code></td>
          <td>禁用不可选日期</td>
          <td>接收 Date，返回是否禁用</td>
        </tr>
        <tr>
          <td><code>clearable</code></td>
          <td>一键清空</td>
          <td>清空后绑定值回到空</td>
        </tr>
      </tbody>
    </table>
    <p>
      第三步是算天数并展示摘要。用户选完区间，你在旁边算一下共几天，用标签显示出来，他立刻能确认「哦，这次查的是 7 天」。算的时候要注意口径：<strong>日期范围统计通常包含首尾两天</strong>，所以天数要按业务口径决定是否 <code>+1</code>。选 1 号到 7 号，直觉上是 7 天，而不是 6 天——这个一分之差，正是报表对不上数的高发原因。
    </p>
    <div class="lesson-box warn">
      <strong>三个容易踩的坑：</strong>其一，<code>shortcuts</code> 的区间是<strong>函数动态计算</strong>的，确认「最近 7 天」这类口径到底包含首尾哪一端，并且和后端对齐——前端显示 7 天、后端按 8 天查，是最典型的对账事故。其二，服务端落库要明确<strong>时区和当天的起止时刻</strong>，不能只把界面上那串「2026-03-01」直接存进去，否则跨时区或跨零点时口径就漂了。其三，<code>disabled-date</code> 只管住界面，接口层该有的校验不能省。
    </div>

    <h2>快捷选项手动对照</h2>
    <figure class="lesson-figure">
      <figcaption>点开日期面板，试试「最近 7 天」快捷选项，再手动选一段区间，看下方的统计天数如何变化。</figcaption>
      <E13DatePicker />
    </figure>

    <h2>范围口径对齐后端</h2>
    <p>
      日期选择器把「相对说法翻译成绝对区间」这件事收进了一个面板：<code>type="daterange"</code> 保证两端成对出现，<code>shortcuts</code> 覆盖高频周期，<code>disabled-date</code> 挡住无效值，<code>value-format</code> 决定对外暴露的类型。真正需要你反复确认的不是 API，而是口径——首尾算不算、时区对不对、和后端是不是同一套算法。
    </p>
    <div class="lesson-term">
      <span class="term-name">「日期范围选择」</span>用 <code>el-date-picker</code> 配合 <code>type="daterange"</code> 一次选起止，<code>v-model</code> 是数组；<code>value-format</code> 把值格式化成字符串但会改变值类型，需在类型声明中固定；<code>shortcuts</code> 由函数动态计算预置周期，<code>disabled-date</code> 接收 Date 返回是否禁用，<code>clearable</code> 一键清空。天数口径（是否 +1）与时区需与后端对齐。
    </div>
  </LessonArticle>
</template>
