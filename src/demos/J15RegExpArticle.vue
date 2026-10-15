<script setup lang="ts">
import J15RegExp from './J15RegExp.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>注册页要校验手机号，代码写成 <code>value.length === 11 &amp;&amp; value[0] === '1'</code>，测试时 <code>10000000000</code> 竟然通过了——因为只检查了「11 位」和「以 1 开头」，却漏掉了「第二位必须是 3 到 9」这条真正规定。
    </div>

    <h2>用字符串方法逐条判断</h2>
    <p>
      最朴素的做法，是把规则翻译成一条条字符串判断：长度是不是 11、首位是不是 <code>1</code>、每一位是不是数字。它不需要学新东西，逐条写出来也看得懂，简单场景确实能跑。
    </p>
    <p>
      但规则一复杂就失控——每位数字都要单独检查，条件越叠越长；遇上邮箱、日期这类「结构」而非「长度」的约束，字符串方法就显得笨拙，还容易漏掉某一条边界（上面那句就漏了「第二位是 3–9」）。问题在于：字符串方法是「逐位置」操作，缺少「按模式描述」的能力。
    </p>

    <h2>正则字面量与构造方式</h2>
    <p>
      正则表达式提供的正是「描述模式」。写法有两种：字面量 <code>/^1[3-9]\d{9}$/</code> 在代码里直接写死，可读性好、解析时即构建；构造函数 <code>new RegExp(模式字符串, 标志)</code> 接受字符串，因此适合模式需要运行时拼出来的场景。两者语法一致，选择只看模式是固定的还是动态生成的。
    </p>

    <h2>字符类、量词与捕获组</h2>
    <p>
      模式由几个基础构件搭起来。字符类用 <code>[abc]</code> 匹配其中之一，<code>[a-z]</code> 表示区间，<code>[^0-9]</code> 是取反；速记符有 <code>\d</code>（数字）、<code>\w</code>（单词字符）、<code>\s</code>（空白）。量词控制重复次数：<code>*</code> 是 0 次或更多，<code>+</code> 是至少 1 次，<code>?</code> 是 0 或 1 次，<code>{4}</code>、<code>{2,5}</code> 精确指定位数。锚点 <code>^</code> 与 <code>$</code> 把匹配限制在整串的开头与结尾。
    </p>
    <p>
      分组用圆括号 <code>(...)</code>，它在「把一段当成整体」的同时，还会<strong>捕获</strong>这段实际匹配到的文本。按顺序读捕获结果时下标从 1 开始，容易数错；<strong>命名捕获组</strong> <code>(?&lt;year&gt;...)</code> 给捕获起名字，之后用 <code>groups.year</code> 取值，比数字下标稳定得多。只分组、不想要捕获时写 <code>(?:...)</code>。
    </p>

    <h2>断言与修饰符</h2>
    <p>
      断言用来「限定上下文」而不占用字符。前瞻 <code>(?=...)</code> 要求后面是这样、负前瞻 <code>(?!...)</code> 要求后面不是；后行断言 <code>(?&lt;=...)</code> 与负后行 <code>(?&lt;!...)</code> 则看前面。关键点是它们<strong>不消耗字符</strong>：只做条件判断，匹配位置不前进，因此能在不删掉任何字符的前提下加约束，例如只提取紧跟在货币符号后面的数字。
    </p>
    <p>
      修饰符决定匹配范围：<code>g</code> 全局查找所有匹配，<code>i</code> 忽略大小写，<code>m</code> 让 <code>^</code> 和 <code>$</code> 匹配每一行的开头结尾，<code>s</code> 让 <code>.</code> 也能匹配换行，<code>u</code> 打开完整 Unicode，<code>y</code> 则从 <code>lastIndex</code> 处锚定匹配。
    </p>

    <h2>匹配方法与 lastIndex</h2>
    <p>
      消费匹配结果用的是几个方法：<code>test</code> 只回答「有没有」，返回布尔值；<code>exec</code> 返回单次匹配的详细信息，包含匹配文本、下标与捕获组；<code>match</code> 在不带 <code>g</code> 时等价于一次 <code>exec</code>，带 <code>g</code> 时返回所有匹配；<code>matchAll</code> 返回全部匹配的迭代器（<strong>必须带 g 标志</strong>）；<code>replace</code> / <code>replaceAll</code> 做替换，用 <code>$1</code> 或回调即可引用捕获组。
    </p>
    <p>
      这里有个必须记住的坑：带 <code>g</code> 标志的正则对象会<strong>记住 <code>lastIndex</code></strong>。同一个正则对象连续调用 <code>test</code> 或 <code>exec</code>，下一次会从上次结束的位置继续找，于是「同一个字符串、同一个正则，两次结果却不一致」。要状态无关，就在每次使用前新建正则，或手动把 <code>lastIndex</code> 归零。
    </p>

    <h2>亲手体验校验与提取</h2>
    <p>
      下面的演示把手机号、邮箱、身份证三条规则写成正则，输入即时校验，并用命名捕获组把匹配到的片段取出来。
    </p>
    <figure class="lesson-figure">
      <figcaption>输入手机号、邮箱与身份证号，<code>test()</code> 实时给出校验结果，命名捕获组则把匹配片段按名字提取。</figcaption>
      <J15RegExp />
    </figure>

    <h2>转义与性能陷阱</h2>
    <p>
      最后有两个风险必须绕开。一是把用户输入拼进模式前，一定要先转义特殊字符：<code>new RegExp(userInput)</code> 时，输入里的 <code>.</code>、<code>*</code>、<code>(</code> 会改变模式含义，甚至让正则崩溃，所以要用 <code>replace(/[.*+?^${}()|[\]\\]/g, '\\$&')</code> 先把它们变成字面量。
    </p>
    <p>
      二是性能。<code>.*</code> 这类宽泛量词在长文本上会触发大量回溯，严重时卡住页面；能用具体量词就别用 <code>.*</code>（写 <code>[0-9]{4}</code> 而不是 <code>.*</code>），复杂校验拆成几个边界清晰的小正则会稳妥得多。
    </p>
    <p>
      回看整章，正则的价值就是用声明式模式替代逐字符判断：字面量或构造函数负责创建，字符类与量词负责描述，分组与命名捕获负责提取，断言与修饰符负责限定上下文，最后交给 <code>test</code> / <code>exec</code> / <code>replace</code> 消费。盯住 <code>lastIndex</code> 与转义这两个坑，它就能稳定工作。
    </p>
    <div class="lesson-term">
      <span class="term-name">「捕获组」</span>指正则中用圆括号 <code>(...)</code> 括起来、并在匹配后被单独记录的那段子串，按出现顺序以下标 1、2… 读取；命名捕获组 <code>(?&lt;name&gt;...)</code> 则可通过 <code>match.groups.name</code> 按名字取值。只想分组而不捕获时用 <code>(?:...)</code> 避免多余记录。
    </div>
  </LessonArticle>
</template>
