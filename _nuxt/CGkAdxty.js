const e=`<script setup lang="ts">
import J19TemplateLiterals from './J19TemplateLiterals.vue'
import J23StringIntl from './J23StringIntl.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>订单提示想显示「共 3 件，合计 ¥29」，代码写成 <code>'共 ' + 3 + ' 件，合计 ¥' + 29</code> 是正常的；可某天数量来自输入框，用户填了「3」，同样的表达式却拼出了「共3 件」，看上去没差，一旦参与比较又变回字符串，价格判断就全乱了。
    </div>

    <h2>用加号拼接字符串</h2>
    <p>
      最开始的办法很直接：要显示一句带变量的文案，就用 <code>+</code> 把固定文字和变量串起来，写成 <code>'共 ' + count + ' 件，合计 ¥' + total</code>。它做对了一件事——任何位置都能插变量，而且这是最早的、不需要任何额外语法的手段。
    </p>
    <p>
      但两个问题很快冒出来。一是每个变量都得手动补空格和引号，句子一长就是一堆加号，读起来像括号配平题；二是 <code>+</code> 在遇到字符串时会把数字悄悄转成文本，<code>3 + 4</code> 是 <code>7</code>，而 <code>'共' + 3</code> 是 <code>'共3'</code>，同一个运算符，两种含义。
    </p>

    <h2>字符串不可变，方法返回新串</h2>
    <p>
      动手改字符串之前，先接受一个事实：<strong>字符串是不可变的</strong>。写下 <code>const s = 'abc'</code> 之后，没有任何方法能改动 <code>s</code> 本身，它们一律返回一个新串。所以 <code>s.toUpperCase()</code> 得到 <code>'ABC'</code>，而 <code>s</code> 里躺着的仍然是 <code>'abc'</code>。
    </p>
    <p>
      这一点解释了那句常见的困惑——「我明明调了大写方法，怎么值没变？」答案是：返回值没有被接住。<code>s.toUpperCase()</code> 的结果要赋给变量或直接用，才会体现出来。把这个认知固定下来，后面所有字符串方法都只是「读一个旧串，产出一个新串」。
    </p>

    <h2>搜索、截取、替换与填充</h2>
    <p>
      有了「只读不改」的前提，日常操作就分成几类。搜索用 <code>includes</code> 判断是否包含，用 <code>startsWith</code> / <code>endsWith</code> 判断前后缀；截取用 <code>slice(起, 止)</code>，参数支持负数，<code>'abcdef'.slice(-3)</code> 得到尾部三个字符；取值用 <code>at(i)</code>，它支持负索引，<code>'abc'.at(-1)</code> 比 <code>s[s.length - 1]</code> 更直观，也避免下标算错。
    </p>
    <p>
      替换与拆分是一对好搭档：<code>replace</code> 只替换第一个匹配，<code>replaceAll</code> 替换全部，传字符串参数时它按字面量替换，不会把内容当成正则；<code>split</code> 按分隔符把串拆成数组，<code>split('')</code> 或 <code>[...str]</code> 都能得到字符数组。修剪与填充则负责边界：<code>trim</code> 去掉两端空白（<code>trimStart</code>、<code>trimEnd</code> 只管一头），<code>padStart(6, '0')</code> 在左侧补零，正好把编号格式化成 <code>'000123'</code>。
    </p>

    <h2>模板字面量的插值与多行</h2>
    <p>
      拼接的可读性问题是真实存在的，于是语言给出了模板字面量：用反引号包裹，变量位置写 <code>\${表达式}</code>，换行直接敲回车即可，不必再写 <code>\\n</code>。它把「一串文本」和「一个值」区分得很清楚，加号链条里那层犹豫也随之消失。
    </p>
    <p>
      不过模板字面量只是让拼接好看，并没有解决「数据里混进结构」的风险——把一个用户昵称插进 HTML 时，昵称里若带 <code>&lt;script&gt;</code> 标签，照样会被当标签解析。
    </p>

    <h2>标签模板：还原片段与插值</h2>
    <p>
      解决办法是在模板前面写一个函数名，让它来接管这次拼接，这就是<strong>标签模板</strong>。写法如 <code>html\`...\`</code>，被调用的函数收到的不是拼好的字符串，而是两部分：一个由<strong>字符串片段</strong>组成的数组，以及一个按顺序排列的<strong>插值</strong>数组。函数自己决定插值怎样并入——把 <code>&lt;</code>、<code>&gt;</code>、<code>&amp;</code> 转成实体，注入就变成了纯文本。
    </p>
    <p>
      内置的 <code>String.raw</code> 就是一个标签，它取的是原始串，不解析 <code>\\n</code>、<code>\\t</code> 这类转义，写正则或 Windows 路径时很好用。把「片段」与「插值」拆开，正是标签模板既能做转义、又能做多语言的关键。
    </p>

    <h2>亲手体验模板与格式化</h2>
    <p>
      下面两个演示把这一章落到真实场景：一个用标签模板做中英文文本切换，用 <code>String.raw</code> 展示转义保留；另一个用字符串方法搜索并高亮课程，再用 <code>Intl</code> 输出货币和日期。
    </p>
    <figure class="lesson-figure">
      <figcaption>切换中英文，标签模板把插值替换成对应语言的词汇；下方的 <code>String.raw</code> 结果保留原始转义字符。</figcaption>
      <J19TemplateLiterals />
    </figure>
    <figure class="lesson-figure">
      <figcaption>输入关键词搜索课程，<code>includes</code> 筛选配合替换高亮，<code>Intl</code> 负责货币与日期的地区化格式。</figcaption>
      <J23StringIntl />
    </figure>

    <h2>地区化输出与全文收束</h2>
    <p>
      最后一块是格式化。<code>Intl</code> 是一组按地区输出格式的构造器：<code>Intl.NumberFormat</code> 把数字格式化成货币或百分比，同一个 <code>1299.5</code> 在 <code>zh-CN</code> 与 <code>en-US</code> 下的货币符号、分组方式和小数点都可能不同；<code>Intl.DateTimeFormat</code> 按地区输出日期；<code>Intl.RelativeTimeFormat</code> 给出「1 天前」这类相对时间；<code>Intl.Collator</code> 提供正确的字符串排序，让中文按拼音而不是码点排。结论很清楚：<strong>不要自己拼格式串</strong>，不同 locale 的写法交给 Intl。
    </p>
    <p>
      回头看整章：字符串始终不可变，所有方法都在返回新串；模板字面量把拼接从 <code>+</code> 换成 <code>\${}</code>；标签模板则进一步把片段与插值拆开，既支持转义又支持多语言；而货币、日期、排序的地区差异，统一交给 <code>Intl</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「标签模板」</span>指在模板字面量前加一个函数名来调用它，如 <code>tag\`文本 \${值}\`</code>。该函数接收字符串片段数组与插值数组两份参数，可自行决定插值如何并入，从而实现 HTML 转义、i18n 或 DSL；<code>String.raw</code> 就是一种内置标签模板，用于获取不解析转义字符的原始串。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
