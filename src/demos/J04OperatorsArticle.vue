<script setup lang="ts">
import J17OptionalNullish from './J17OptionalNullish.vue'
import J24LogicalBitwise from './J24LogicalBitwise.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>商品编辑表单里用 <code>discount || 0.9</code> 给折扣兜底，运营把折扣填成 0（表示免费）后，页面显示的却是 0.9；同一份用户资料里，用 <code>?.</code> 读取深层权限字段不再报错，可权限一旦用 0 表示「无权限」，<code>||</code> 又把它和「字段缺失」混在了一起。
    </div>

    <h2>算术运算的细节</h2>
    <p>
      最自然的用法，是把运算符直接当成数学符号：<code>a + b</code> 就是相加。这在大多数时候没错，它做对的是让表达式读起来和公式一样。但有几个符号的脾气和数学不完全一样，照着直觉写就会偏：
    </p>
    <ul>
      <li><code>%</code> 是取余，结果符号跟随<strong>被除数</strong>：<code>-7 % 3</code> 得到 <code>-1</code>，和数学里的模运算并不等价。</li>
      <li><code>**</code> 是幂运算，并且<strong>右结合</strong>：<code>2 ** 3 ** 2</code> 算的是 <code>2 ** (3 ** 2)</code>，等于 512。</li>
      <li><code>++</code> 与 <code>--</code> 分前置、后置：<code>const a = ++i</code> 先把 i 加一再取新值，<code>const b = i++</code> 先取旧值再加一；两者对 i 的最终影响相同，赋给变量的结果却不同。</li>
      <li>再加上浮点精度这个老问题：<code>0.1 + 0.2 !== 0.3</code>，涉及金额时更稳的做法是先转成整数「分」再运算。</li>
    </ul>
    <p>
      于是迭代出第一条习惯：把运算符当表达式工具用，但心里记住「取余的符号」「幂的右结合」「自增的求值时机」「浮点精度」这四点，写的时候就不会被表面的符号骗到。
    </p>

    <h2>比大小与字符串</h2>
    <p>
      接着是比较。<code>&gt;</code>、<code>&lt;</code>、<code>&gt;=</code>、<code>&lt;=</code> 用来判断大小，数字之间比较最直观。问题出在两侧不是同一种类型时——它同样会触发隐式转换，于是比较的到底是什么，又变成了要猜的事。
    </p>
    <p>
      字符串比较尤其容易反直觉：它<strong>按 UTF-16 码元逐位比较</strong>，先比首字符，谁大谁就大。所以 <code>'2' &gt; '10'</code> 为 <code>true</code>——因为首字符 <code>'2'</code> 大于 <code>'1'</code>，后面的位数根本不参与；中英文混排的顺序，也不等于人眼期望的顺序。迭代的做法是：数字就比数字；字符串排序要显式给出比较器，多语言场景交给 <code>Intl.Collator</code>，不要靠 <code>&lt;</code> 去猜。
    </p>

    <h2>短路返回操作数</h2>
    <p>
      逻辑运算符 <code>&amp;&amp;</code>、<code>||</code>、<code>!</code> 常被当成布尔运算，以为结果只会是 <code>true</code>／<code>false</code>。用它们控制流程时确实看不出差别，于是这个印象被一直保留下来。
    </p>
    <p>
      但它做对的只是「控制流程」，真正的语义更精确：<code>&amp;&amp;</code> 与 <code>||</code> 在结果确定时<strong>立即短路</strong>，返回的<strong>是参与运算的那个原始操作数</strong>，而不是布尔值。于是 <code>0 || 'x'</code> 得到 <code>'x'</code>，<code>'' || 'default'</code> 得到 <code>'default'</code>，<code>'a' &amp;&amp; 'b'</code> 得到 <code>'b'</code>。这意味着用 <code>||</code> 兜底时，<strong>0、空字符串、<code>false</code> 都会被当成「没有值」而被替换掉</strong>——开头那个 0 折扣变成 0.9，就是这么来的。短路还有一层含义：右侧若是函数调用，条件不满足时它根本不会执行，所以 <code>flag &amp;&amp; doSomething()</code> 是常见的守卫写法。
    </p>
    <p>
      迭代的方向也随之清楚：把短路当成「取值」和「守卫」，并区分「假值」与「空值」——只想在真的没有值时兜底，就该换一个运算符。
    </p>

    <h2>空值合并与可选链</h2>
    <p>
      只想在「真的没有值」时给默认值，用<strong>空值合并</strong> <code>??</code>：它只在左侧是 <code>null</code> 或 <code>undefined</code> 时才取右侧，用户填的 <code>0</code>、空字符串会被原样保留。于是 <code>discount ?? 0.9</code> 在折扣为 0 时给出 0，正是开头场景要的行为。
    </p>
    <p>
      读深层属性时又是另一种啰嗦：早期要写 <code>a &amp;&amp; a.b &amp;&amp; a.b.c</code> 层层守护。改用<strong>可选链</strong> <code>?.</code> 后，只要链上出现 <code>null</code>／<code>undefined</code> 就短路返回 <code>undefined</code>，一行写完 <code>user?.profile?.address?.city</code>。它还有两个形态：可选索引 <code>list?.[0]</code> 与可选调用 <code>fn?.()</code>——后者只有函数确实存在时才调用。要留意的是，<code>?.</code> 只对 <code>null</code>／<code>undefined</code> 短路，遇到 <code>0</code>、空字符串会继续往下访问。
    </p>
    <p>
      迭代成一句话：读属性用 <code>?.</code>，只在空值时兜底用 <code>??</code>，别再用 <code>||</code> 一把梭。
    </p>

    <h2>逻辑赋值与位运算</h2>
    <p>
      把「判断再赋值」合成一步，就是<strong>逻辑赋值</strong>：<code>a ||= b</code> 等价于 <code>a || (a = b)</code>，<code>a ??= b</code> 只在 a 为空时赋值，<code>a &amp;&amp;= b</code> 只在 a 为真时赋值。它们能让「给缺省字段补默认值」这类代码短上一行，语义也更直白。
    </p>
    <p>
      另一类场景是「一堆开关」。权限、状态这类字段，可以用一个整数的不同二进制位并行编码：位运算会先把操作数转成<strong>32 位有符号整数</strong>，再逐位计算——<code>|</code> 按位或、<code>&amp;</code> 按位与、<code>^</code> 按位异或、<code>~</code> 按位取反、<code>&lt;&lt;</code> 左移、<code>&gt;&gt;</code> 有符号右移、<code>&gt;&gt;&gt;</code> 无符号右移。把权限定义成 2 的幂——读 1、写 2、管理 4——就能用 <code>perms |= WRITE</code> 授予、<code>perms &amp; READ</code> 检查、<code>perms &amp; ~WRITE</code> 撤销、<code>perms ^ ADMIN</code> 切换。一个整数装下所有开关，存储和传输都省。
    </p>
    <p>
      迭代的结论是：权限这类场景优先用位标志，但记住 32 位边界（超出会截断），并把常量写成有名字的字面量，读起来才能对得上每一位。
    </p>

    <h2>亲手验证运算符</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮读取深层字段、套用默认配置，观察 <code>?.</code> 与 <code>??</code> 各自的短路时机。</figcaption>
      <J17OptionalNullish />
    </figure>
    <figure class="lesson-figure">
      <figcaption>点按钮授予、检查、撤销权限位，观察 <code>|</code>、<code>&amp;</code>、<code>^</code> 如何在一个整数里开关权限。</figcaption>
      <J24LogicalBitwise />
    </figure>

    <h2>短路与取值的分工</h2>
    <p>
      运算符这层看着杂，其实都在讲同一件事——<strong>什么时候才去取右边的值</strong>。逻辑运算短路返回操作数，<code>??</code> 只在空值时兜底，<code>?.</code> 安全穿透深层属性，逻辑赋值把判断与赋值合一，位运算把多个开关压进一个整数。把「假值」和「空值」分清楚，就不会再让 <code>||</code> 吞掉用户的 0。
    </p>
    <div class="lesson-term">
      <span class="term-name">「短路求值」</span>左侧一旦能确定结果，就停止对右侧求值，并返回参与运算的那个操作数本身：<code>&amp;&amp;</code> 在左侧为假时短路、<code>||</code> 在左侧为真时短路、<code>??</code> 只在左侧为 <code>null</code>／<code>undefined</code> 时取右侧、<code>?.</code> 遇到空值短路成 <code>undefined</code>。短路还会跳过右侧的副作用，所以 <code>flag &amp;&amp; doSomething()</code> 才成立。
    </div>
  </LessonArticle>
</template>
