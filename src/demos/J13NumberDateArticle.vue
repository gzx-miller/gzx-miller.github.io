<script setup lang="ts">
import J13NumberDate from './J13NumberDate.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>购物车合计写 <code>0.1 + 0.2</code>，界面却冒出一串 <code>0.30000000000000004</code>；而给商品加一个 16 位自增 id 时，两个不同商品的 id 竟然判定为相等——同样两个「数字」，一个差在精度，一个差在范围。
    </div>

    <h2>把数字当数字用</h2>
    <p>
      最自然的想法是：数字就是数字，加减乘除直接用 <code>+ - * /</code>，比较直接用 <code>===</code>，算出来的结果是不是整数、有没有小数，代码不用操心。日常里这套做法大多时候是对的，直到它撞上边界——金额对不上分、超大编号认不出彼此。
    </p>
    <p>
      要理解这两件事，得先知道 JavaScript 里其实<strong>只有一种数字类型 number</strong>，底层是 64 位双精度浮点。整数与小数共用一套二进制表示，麻烦就从这里开始。
    </p>

    <h2>浮点精度与安全整数范围</h2>
    <p>
      小数在二进制里大多无法精确表示，<code>0.1</code> 和 <code>0.2</code> 都只是接近于真实值的近似，相加后误差累积，于是 <code>0.1 + 0.2 === 0.3</code> 得到 <code>false</code>。金额场景最好避开小数运算——把金额换算成「分」，用整数从事计算，只在显示时格式化；金额需要更大范围时再考虑 <code>BigInt</code>，但它不能和普通 number 混合运算。
    </p>
    <p>
      整数这边同样有边界：number 能精确表示的整数上限是 <code>Number.MAX_SAFE_INTEGER</code>，也就是 2<sup>53</sup> − 1。<strong>超过这个范围，相邻的两个整数可能被表示成同一个值</strong>，于是两个本该不同的 id 会相等。后端返回的雪花 id 常超过安全整数，接收时应当保持为字符串。
    </p>

    <h2>NaN、Infinity 与判断方法</h2>
    <p>
      还有两个特殊的 number。<code>NaN</code> 表示「不是一个数」，任何无法得到数值的运算都返回它，而且它连自己都不等于自己——<code>NaN === NaN</code> 是 <code>false</code>，因此判断要用 <code>Number.isNaN()</code>。全局的 <code>isNaN()</code> 会先把参数转成数字再判断，传字符串也可能为真，不可靠。
    </p>
    <p>
      <code>Infinity</code> 表示溢出或除以零的结果，<code>1 / 0</code> 得到正无穷，<code>-1 / 0</code> 得到负无穷。要判断一个值是不是「正常的有限数」，用 <code>Number.isFinite()</code>；它不转换参数，<code>Number.isFinite('1')</code> 直接返回 <code>false</code>。
    </p>

    <h2>解析与数值格式化</h2>
    <p>
      从文本转数字有三个入口，行为差别很大。<code>parseInt(str, 基数)</code> 从左往右解析，遇到第一个非数字字符就停下，所以 <code>parseInt('12px')</code> 得到 <code>12</code>，传第二个参数还能按进制解析，<code>parseInt('ff', 16)</code> 得到 <code>255</code>；<code>parseFloat('3.14abc')</code> 得到 <code>3.14</code>；而 <code>Number('12px')</code> 要求整串都合法，于是返回 <code>NaN</code>。选择哪个，取决于你容忍多少「脏」输入。
    </p>
    <p>
      数值转文本则靠格式化方法：<code>toFixed(2)</code> 固定到两位小数，常用于价格，但它返回字符串，且受浮点近似影响偶尔会「差一分钱」；<code>toPrecision(n)</code> 控制有效数字位数；<code>toLocaleString()</code> 按地区加上千分位和小数点。三者都只负责显示，不改变计算用的原始数字。
    </p>

    <h2>Math 常用方法与整数判断</h2>
    <p>
      取整是数值处理里最高频的一类。<code>Math.round</code> 四舍五入（<code>.5</code> 一律朝正方向，所以 <code>Math.round(-2.5)</code> 是 <code>-2</code>）；<code>Math.trunc</code> 直接丢弃小数部分；<code>Math.floor</code> 向下取整、<code>Math.ceil</code> 向上取整，它们在负数上与 <code>trunc</code> 分道扬镳（<code>Math.floor(-2.7)</code> 是 <code>-3</code>，<code>Math.trunc(-2.7)</code> 是 <code>-2</code>）。此外 <code>Math.max</code> / <code>Math.min</code> 取极值，<code>Math.abs</code> 取绝对值，<code>Math.pow</code>（现多用 <code>**</code>）求幂，<code>Math.random</code> 返回 <code>[0, 1)</code> 之间的小数，配合取整就能生成指定范围的整数。
    </p>
    <p>
      判断整数要用 <code>Number.isInteger()</code>，它不像全局判断那样做隐式转换，<code>2.0</code> 会被认为是整数、<code>2.5</code> 不会。它与 <code>Number.isFinite()</code> 一起，构成数值校验里最稳的一对守卫。
    </p>

    <h2>亲手体验格式化与取整</h2>
    <p>
      下面的演示把这一章落到真实动作：按钮分别触发货币格式化、日期格式化和 Math 取整，直观看到 <code>Intl</code> 的输出和不同取整函数的差异。
    </p>
    <figure class="lesson-figure">
      <figcaption>点按钮体验 <code>Intl.NumberFormat</code> 的货币输出、<code>Intl.DateTimeFormat</code> 的日期输出，以及 <code>Math.round</code> / <code>Math.trunc</code> / <code>Math.max</code> 的取整结果。</figcaption>
      <J13NumberDate />
    </figure>

    <h2>Date、时间戳与地区化</h2>
    <p>
      <code>Date</code> 有三种常见创建方式：<code>new Date()</code> 取当前时刻，<code>new Date(时间戳)</code> 用毫秒数构造，<code>new Date(年, 月, 日, 时, 分)</code> 按字段拼。这里藏着两个坑：<strong>月份从 0 开始</strong>，<code>new Date(2026, 9, 14)</code> 其实是 10 月 14 日，而且 <code>getMonth()</code> 返回的也是 <code>9</code>；字符串解析的时区基准又因写法而异，<code>new Date('2026-10-14')</code> 按 UTC 午夜解析，而 <code>new Date('2026/10/14')</code> 按本地时区解析，跨时区时就差出一整天。
    </p>
    <p>
      用来比较、排序、存储的，是<strong>时间戳</strong>：<code>date.getTime()</code> 返回自 1970 年 1 月 1 日 UTC 起算的毫秒数，<code>Date.now()</code> 直接给出当前毫秒。用时间戳做减法能算时间间隔，做大小比较能判断先后，存进数据库也不会带上时区歧义。要让人看懂，再用 <code>Intl.DateTimeFormat</code> 按地区格式化输出。
    </p>
    <div class="lesson-term">
      <span class="term-name">「时间戳」</span>指从 1970-01-01 00:00:00 UTC 起经过的毫秒数（<code>Date.getTime()</code> 返回，<code>Date.now()</code> 取当前值）。它是与时区无关的绝对刻度，适合比较、运算与存储；展示给用户时再用 <code>Intl.DateTimeFormat</code> 转成对应地区的可读日期。
    </div>
  </LessonArticle>
</template>
