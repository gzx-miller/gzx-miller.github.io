const e=`<script setup lang="ts">
import PY18Stdlib from './PY18Stdlib.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把用户提交的时间当字符串处理，写 <code>start + ' 7天'</code> 想算出下周同一时刻，结果得到 <code>'2024-06-01 7天'</code> 这种四不像；而换成 <code>start + timedelta(days=7)</code>，它却悄悄把日期加了 7 天。字符串「加法」和 <code>timedelta</code>，到底哪个才是对的？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      处理时间的最省事方式，是把日期当成字符串。从接口拿到 <code>'2024-06-01'</code>，直接拼、直接显示，都不需要引入任何库：
    </p>
    <pre class="code-block"><code>start = '2024-06-01'
print(start[:4])          # 取年份：'2024'
show = start + ' 开会'    # 直接拼接</code></pre>
    <p>
      字符串方案对「原样展示」有效，但一旦要做<strong>算术</strong>就立刻崩掉：字符串的 <code>+</code> 是拼接，不是加天数；<code>start + '7天'</code> 只会得到一串更长的文字。此外，月份进位、闰年、月末加一天，都不可能靠切字符串算对。要处理时间，就必须换成真正的日期对象。
    </p>

    <h2>datetime 与 date：把时间当对象</h2>
    <p>
      标准库 <code>datetime</code> 提供两个常用类型：<code>date</code> 只管年月日，<code>datetime</code> 精确到时分秒微秒。它们与字符串之间的转换靠一对镜像方法：
    </p>
    <ul>
      <li><code>strftime(format)</code>：对象 → 字符串。按格式串输出，如 <code>%Y-%m-%d %H:%M</code>。</li>
      <li><code>strptime(text, format)</code>：字符串 → 对象。解析失败会抛 <code>ValueError</code>，这也是它的价值——把非法输入挡在边界。</li>
      <li><code>datetime.now()</code>：取当前时刻；<code>date.today()</code> 取今天的日期。</li>
    </ul>
    <p>
      记住方向很关键：<code>strftime</code> 的 <code>f</code> 是想格式化的对象（format），<code>strptime</code> 的 <code>p</code> 是要解析的字符串（parse）。两者一个输出、一个输入，名字对称但方向相反。
    </p>

    <h2>timedelta：时间的加减法</h2>
    <p>
      日期对象之间相减会得到 <code>timedelta</code>（时间差），而 <code>timedelta</code> 又能反过来加到日期上，形成一套干净的算术：<code>date_a - date_b</code> 得到相差多少天，<code>datetime + timedelta(days=7, hours=2)</code> 得到七天后又两小时的时刻。<code>timedelta</code> 会自动处理跨月、跨年、闰年，这些正是手写字符串永远算不对的地方。
    </p>
    <p>
      关于<strong>时区</strong>，先用一句话记住定位：不带时区的 <code>datetime</code> 称为「朴素」（naive）对象，它不知道自己属于哪个时区，做跨时区换算时会出错。需要时区信息时，用标准库 <code>zoneinfo.ZoneInfo</code> 给对象附上时区，或使用带 tzinfo 的 aware 对象。处理跨地区业务前，先把「时间是哪个时区的」这件事明确下来。
    </p>

    <h2>re：正则表达式的四个常用入口</h2>
    <p>
      文本里挑出特定模式，靠 <code>re</code> 模块。日常用得最多的是四个函数：
    </p>
    <ol class="lesson-steps">
      <li><code>re.search(pattern, text)</code>：返回第一个匹配对象（找不到返回 <code>None</code>），常配合 <code>if match:</code> 使用。</li>
      <li><code>re.findall(pattern, text)</code>：返回所有匹配文本的列表，不做替换时最直观。</li>
      <li><code>re.sub(pattern, repl, text)</code>：把匹配到的内容替换掉，适合清洗、脱敏。</li>
      <li><code>re.compile(pattern)</code>：预编译一个正则对象，在循环里反复使用，避免每次重新编译。</li>
    </ol>
    <p>
      <strong>分组</strong>用圆括号圈出：<code>([\\w.]+)@([\\w.]+)</code> 会把邮箱拆成用户名和域名两段。注意 <code>match.group(0)</code> 是整段匹配，<code>group(1)</code> 起才是各分组。想更稳，可以在模式里用 <code>r''</code> 原始字符串，免得反斜杠被二次转义。
    </p>

    <h2>json：序列化与反序列化</h2>
    <p>
      <code>json</code> 模块把 Python 对象和 JSON 文本互相转换：<code>json.dumps(obj)</code> 把对象转成字符串（dump 加 <code>s</code> 表示 string，写入的是字符串）；<code>json.loads(text)</code> 反过来把字符串还原成对象。对应的还有 <code>dump</code> / <code>load</code>，直接读写文件。
    </p>
    <ul>
      <li><code>ensure_ascii</code>：默认 <code>True</code>，中文等非 ASCII 字符会被转义成 <code>\\uXXXX</code>；设为 <code>False</code> 则保留原字符，输出更易读。</li>
      <li><code>indent</code>：设为数字（如 <code>2</code>）就带缩进美化，便于人看；保持默认则压成一行，省空间。</li>
      <li>注意类型映射：JSON 没有元组、没有 <code>datetime</code>，序列化这些类型会报 <code>TypeError</code>，需要先转成字符串或列表。</li>
    </ul>

    <h2>「自带电池」也要挑着用</h2>
    <p>
      Python 的标准库被称为「自带电池」，<code>datetime</code>、<code>re</code>、<code>json</code> 都属于这类开箱即用的工具。它的好处是不用装依赖、接口稳定、覆盖面广。但「标准库有」不等于「一定要用」：正则写得过于复杂就难以维护，日期计算一旦涉及时区和夏令时，第三方库（如 <code>zoneinfo</code> 之外的日期库）往往更省心。判断标准很简单——<strong>先看标准库能否干净解决，能就用它；一旦要写大量胶水代码，再考虑引入专门的库</strong>。
    </p>

    <h2>看一遍三个标准库</h2>
    <figure class="lesson-figure">
      <figcaption>在「datetime」里改时间字符串、切换格式串，看解析、格式化与加 7 天的结果；到「re」切换正则，对比匹配与分组；再到「json」切换 <code>ensure_ascii</code> 与 <code>indent</code>，观察输出变化。</figcaption>
      <PY18Stdlib />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      时间是对象不是字符串：用 <code>strptime</code> 解析、<code>strftime</code> 输出、<code>timedelta</code> 做加减，涉及时区就用 <code>zoneinfo</code> 明确归属；文本匹配用 <code>re.search/findall/sub</code> 加分组，循环里预编译；对象与 JSON 用 <code>dumps/loads</code> 互转，注意 <code>ensure_ascii</code> 与 <code>indent</code>。标准库优先，但别为了「不装依赖」而把简单问题写成胶水代码。
    </p>
    <div class="lesson-term">
      <span class="term-name">「strftime / strptime」</span>是日期对象与字符串之间方向相反的一对转换方法：<code>strftime</code> 把对象格式化成字符串，<code>strptime</code> 按格式串把字符串解析成对象。边界与例外：两者都依赖格式串逐字符对齐，对不上会得到错误结果或抛 <code>ValueError</code>；不带时区的对象是朴素的，跨时区换算前必须先补上 tzinfo。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
