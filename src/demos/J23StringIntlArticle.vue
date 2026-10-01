<script setup lang="ts">
import J23StringIntl from './J23StringIntl.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>搜索框里你用 <code>indexOf</code> 判断关键词有没有命中，日期用字符串拼成 <code>2026-10-01</code>——功能都能跑，可一到中文排序和不同地区的价格显示，就总有人报「显示得不对」。
    </div>

    <h2>搜索高亮与地区格式</h2>
    <p>
      你做一个课程搜索加详情页，要完成两件事：一是在课程标题里搜索关键词并高亮出来，二是把课程价格和开课日期按用户所在地的习惯显示。看上去都是「摆弄文本」的小事，背后却是两种性质完全不同的问题——<strong>怎么在同一套字符规则里精确地查找、替换、拼接</strong>，以及<strong>同一个日期和金额，怎么按不同地区的习惯呈现</strong>。
    </p>

    <h2>下标查找与截取</h2>
    <p>
      先用最熟的手段：<code>str.indexOf(kw) !== -1</code> 判断是否包含，<code>str.substring(a, b)</code> 截一段，<code>str.replace(/x/g, 'y')</code> 做全局替换，日期手动拼成年月日、月份用 <code>padStart</code> 补零。它做对了一件实事：<strong>不依赖任何额外的库</strong>，字符串自带的方法就能完成大部分操作。
    </p>

    <h2>包含判断语义</h2>
    <ul>
      <li><code>indexOf</code> 返回的是下标，判断「包含」还得拿它和 <code>-1</code> 比较，语义绕着走，一不留神就把条件写反。</li>
      <li><code>replace</code> 只替换第一个匹配，除非正则带上 <code>g</code> 标志；而用正则匹配用户输入的关键词前，还得先转义里面的特殊字符，漏一步就出错。</li>
      <li>日期格式在 zh-CN 是「2026年10月1日」，在 en-US 是「October 1, 2026」，顺序和词表完全不同；货币、相对时间也一样。手拼等于自己维护一整套地区规则，早晚出错。</li>
      <li>排序时直接比较两个中文字符串的代码单元大小，得到的顺序不符合人们的认知习惯。</li>
      <li>还有一个容易忽略的坑：<code>'👍'.length</code> 是 2。字符串按 UTF-16 代码单元计数，不按人眼看到的字符计数，用下标或 <code>charAt</code> 取「第一个字符」会把一个 emoji 劈成半个。</li>
    </ul>

    <h2>字符串方法升级</h2>
    <p>
      先把「返回下标」升级成「直接回答布尔」：<code>includes</code>、<code>startsWith</code>、<code>endsWith</code> 一看就知道在问什么。需要拿到<strong>所有</strong>匹配而不只是第一个时，用 <code>matchAll</code>——它有一个硬性前提：正则必须带 <code>g</code> 标志，否则直接抛错；而且它返回的是迭代器而不是数组，要用 <code>for...of</code> 消费，或 <code>Array.from</code> 收成数组再用。
    </p>
    <p>
      替换与截取也一并升级：<code>replaceAll</code> 一步替换全部出现，不必再和 <code>g</code> 标志较劲；<code>slice</code> 支持负下标（从末尾往前算），<code>at</code> 同时接受正负下标，读「最后一个」比手写 <code>str[str.length - 1]</code> 直观。这里有一个必须记住的前提：<strong>字符串是不可变的</strong>，上面每个方法都返回新字符串，原串纹丝不动——所以「替换了却没生效」，几乎总是忘了把返回值接住。
    </p>
    <p>
      拆分与填充修剪属于同一族：<code>split</code> 按分隔符把字符串切成数组，是解析 CSV 式文本、拆关键词的常用手段；<code>trim</code> 系列负责去掉首尾空白，输入框里用户随手敲的空格就靠它兜底；<code>padStart</code>、<code>padEnd</code> 用来补足位数或对齐宽度。它们同样遵循「不改原串、返回新串」的规矩。
    </p>
    <p>
      要按人眼看到的字符拆分（比如逐个处理 emoji），用 <code>for...of</code> 遍历或 <code>Array.from(str)</code>，它们按码点走，才会把 emoji 当成一个整体，而不是两个代码单元。
    </p>
    <p>
      再往上走，把「自己维护地区规则」换成 <code>Intl</code>。同一笔金额：<code>new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(129900)</code> 得到 ¥129,900.00，换成 <code>'en-US'</code> 与 USD 就得到美元写法；同一个日期交给 <code>new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full' })</code>，直接给出本地化的长格式，样式名还提供 <code>short</code>、<code>medium</code>、<code>full</code> 供你按需选择。你只声明 locale 和意图，规则与数据由运行时内置。
    </p>
    <p>
      最后补上两个「不想自己拼」的场景：<code>Intl.Collator</code> 提供符合语言习惯的字符串比较器，用它排中文，胜过直接按代码单元大小比较的默认顺序；<code>Intl.RelativeTimeFormat</code> 直接输出「3 天前」「in 2 hours」这类相对时间文案。它们与前面两个格式化器共享同一个思路——<strong>地区规则不该由业务代码维护，交给运行时更准、更稳</strong>。
    </p>

    <h2>高亮与本地化对照</h2>
    <figure class="lesson-figure">
      <figcaption>在搜索框里输入 <code>vue</code>，看 <code>includes</code> 与 <code>replaceAll</code> 如何完成筛选和高亮；下方同时对比同一个金额与日期在不同 locale 下的输出。</figcaption>
      <J23StringIntl />
    </figure>

    <h2>Intl与字符串方法</h2>
    <p>
      字符串方法与 Intl 解决的是同一类问题的两端：「在同一套字符规则里精确地查找与修改」交给字符串方法和正则，「按地区习惯呈现」交给 Intl。前者要记住字符串不可变、<code>replace</code> 的全局语义、以及 emoji 的代码单元陷阱；后者意味着本地化词表不该由你维护，声明 locale 就够了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Intl 国际化 API」</span>是 JavaScript 内置的地区感知格式化工具集，提供 <code>NumberFormat</code>（数字、货币）、<code>DateTimeFormat</code>（日期时间）、<code>RelativeTimeFormat</code>（「3 天前」）与 <code>Collator</code>（符合语言习惯的排序）等能力，规则与数据由运行时携带，只需指定 locale。<strong>字符串是不可变的</strong>，所有字符串方法（<code>includes</code>、<code>matchAll</code>、<code>replaceAll</code>、<code>slice</code>、<code>at</code>、<code>split</code>）都返回新字符串而不改动原串；其中 <code>matchAll</code> 要求正则带 <code>g</code> 标志且返回迭代器。
    </div>
  </LessonArticle>
</template>
