const e=`<script setup lang="ts">
import PY03Strings from './PY03Strings.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>想把一段字符串的第一个字母改成大写，写了 <code>s[0] = 'H'</code>，结果直接抛 <code>TypeError</code>。明明只是改一个字符，为什么 Python 不让你改？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      字符串是日常里最常用的类型：拼接、取片段、判断开头、去掉空格。写起来顺手，<code>"a" + "b"</code> 直接得到 <code>"ab"</code>，<code>"abc"[1]</code> 直接得到 <code>"b"</code>，完全没有门槛。
    </p>
    <p>
      但一旦想「修改」它，就会撞墙。<code>s = "Hello"</code> 之后写 <code>s[0] = "h"</code> 会报错，因为字符串是<strong>不可变</strong>对象——它没有「修改某个位置」的能力，任何看起来像修改的操作，其实都是<strong>造出一个新字符串</strong>。要真正理解它，得从这条性质出发。
    </p>

    <h2>不可变意味着什么</h2>
    <p>
      列表（<code>list</code>）可以 <code>lst[0] = 9</code> 就地改，字符串不行。你可以这样理解：字符串一旦创建，内容就被冻结，<code>s[0] = "h"</code> 这条赋值根本没有对应的底层操作。
    </p>
    <p>
      想改一个字符，正确做法是<strong>拼出一个新串</strong>：<code>s = "h" + s[1:]</code>，或者用 <code>s.replace("H", "h")</code>。这些方法都返回<strong>新的</strong>字符串，原对象不动。所以判断两个字符串是否相同，用 <code>==</code> 比内容，别指望用 <code>is</code> 比身份。
    </p>

    <h2>索引、切片与负步长</h2>
    <p>字符串支持基于位置的访问，规则和列表一致：</p>
    <ul>
      <li>索引从 <code>0</code> 开始，负数从末尾数：<code>s[0]</code> 是首个字符，<code>s[-1]</code> 是末个字符。</li>
      <li>切片 <code>s[start:stop:step]</code> 从 <code>start</code> 取到 <code>stop</code>（<strong>不含 stop</strong>），可以省略任一参数。</li>
      <li>步长为负就从右往左走，<code>s[::-1]</code> 是反转字符串的最简洁写法。</li>
    </ul>
    <p>
      切片的边界会被自动裁剪，不会越界报错：<code>s[0:100]</code> 最多取到串尾，<code>s[100:]</code> 得到空串。这种「宽松」是刻意设计的，让切片比手动循环下标安全得多。
    </p>

    <h2>f-string：把值排进文本</h2>
    <p>
      拼接字符串最容易写出又长又乱的 <code>"name=" + name + ", age=" + str(age)</code>。f-string 把表达式直接写进文本：<code>f"{name} = {age}"</code>，既简洁又不容易漏掉转换。
    </p>
    <p>在 <code>{}</code> 里加个冒号，就能控制格式：</p>
    <ul>
      <li>对齐与宽度：<code>{v:&gt;6}</code> 右对齐占 6 格、<code>{v:&lt;6}</code> 左对齐、<code>{v:^6}</code> 居中，常用于对齐表格输出。</li>
      <li>精度：<code>{v:.2f}</code> 保留两位小数，<code>{n:04d}</code> 把整数补零到 4 位（如 <code>0042</code>）。</li>
    </ul>

    <h2>常用方法与转义、多行</h2>
    <p>围绕字符串有一组高频方法，它们都不改变原串，只返回结果：</p>
    <ul>
      <li><code>split()</code> 按分隔符切分，不带参数时按连续空白切并丢掉空串；<code>join()</code> 是它的逆操作，<code>"-".join(parts)</code>。</li>
      <li><code>strip()</code> 去掉首尾空白，<code>replace(a, b)</code> 替换，<code>find()</code> 找子串位置，<code>startswith()</code> / <code>endswith()</code> 判断前后缀。</li>
    </ul>
    <p>
      文本里要表示引号、换行这类特殊字符，用转义序列 <code>\\n</code>、<code>\\t</code>、<code>\\\\</code>、<code>\\'</code>；要跨多行书写长文本，用三引号 <code>"""..."""</code>，换行会被原样保留。
    </p>

    <h2>str 与 bytes</h2>
    <p>
      字符串是<strong>文本</strong>，而 bytes 是<strong>字节序列</strong>。文本要落盘或走网络，必须先按某种编码（常见是 <code>utf-8</code>）编成字节：<code>"栗子".encode("utf-8")</code> 得到 <code>b'\\xe6\\xa0\\x97\\xe5\\xad\\x90'</code>；读回来时再用 <code>.decode("utf-8")</code> 还原。
    </p>
    <p>
      两者的界限要划清：<code>str</code> 面向人类、按字符处理；<code>bytes</code> 面向机器、按字节处理。编码不匹配就会抛 <code>UnicodeDecodeError</code>，这也是处理外部数据时最常见的一类错误。
    </p>

    <h2>看一遍字符串的行为</h2>
    <figure class="lesson-figure">
      <figcaption>输入姓名、年龄和一句文本，切到「格式化」看 f-string 的对齐与精度补位；再翻到「切片」观察负步长与 <code>s[::-1]</code>，最后在「方法」里试 <code>split</code> / <code>strip</code> / <code>replace</code> 的返回。</figcaption>
      <PY03Strings />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      字符串的一切行为都可以从「<strong>不可变</strong>」推出来：任何「修改」都返回新对象，因此要拼接或替换出新串，比较内容用 <code>==</code>。它支持基于位置的索引与切片，<code>s[::-1]</code> 是反转的惯用写法；f-string 负责把值排进文本并控制对齐与精度；文本与字节之间靠 <code>encode</code> / <code>decode</code> 跨越。把这四点记住，拼接、格式化、文本处理就都有了统一的解释。
    </p>
    <div class="lesson-term">
      <span class="term-name">「字符串不可变」</span>指字符串对象创建后内容不能就地修改，所有看似修改的操作都返回新字符串。边界与例外：切片和索引只读取、不修改；要和字节序列互转需显式 <code>encode</code> / <code>decode</code>；拼接大量分片时，用 <code>join</code> 比反复 <code>+</code> 更高效。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
