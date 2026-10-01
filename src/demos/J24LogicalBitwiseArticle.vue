<script setup lang="ts">
import J24LogicalBitwise from './J24LogicalBitwise.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户权限就是「读、写、管理」三个开关，你用三个布尔字段存进数据库——产品说下周再加一个「导出」权限，你发现要改表、改类型、改所有判断的地方。
    </div>

    <h2>布尔字段的权限建模</h2>
    <p>
      权限系统一开始很好写：<code>canRead</code>、<code>canWrite</code>、<code>canAdmin</code> 三个字段，检查就是 <code>if (user.canWrite)</code>。但权限是会长的。每加一种权限，数据库要加列、接口要加字段、前端类型和所有构造用户对象的代码都要跟着改；更麻烦的是<strong>组合</strong>——「能读又能写、但不能管理」这种条件，得写成 <code>user.canRead &amp;&amp; user.canWrite &amp;&amp; !user.canAdmin</code>，一长串布尔既难读又容易把逻辑写反。我们真正需要的是：一种能装下任意多种开关、检查又快、存储又省的表示。
    </p>

    <h2>独立布尔值的直存</h2>
    <p>
      先用最直白的方式：给每种权限一个独立的布尔值，或者收进一个对象 <code>{ read: true, write: false, admin: false }</code>。这个方案确实做对了一件事：<strong>可读性拉满</strong>，鼠标一扫就知道每个开关的当前状态。
    </p>

    <h2>新增权限的全局波及</h2>
    <ul>
      <li>加一种权限就要动数据结构、类型定义和所有构造点，牵一发动全身。</li>
      <li>存储和传输是一组并列字段，用户量一大，冗余就变得明显。</li>
      <li>组合条件是一长串布尔运算，啰嗦且容易写反。</li>
      <li>没有一个「一组开关」的统一表示，谈不上位运算之类的紧凑优化。</li>
    </ul>

    <h2>权限的位掩码表示</h2>
    <p>
      换一个视角看「开关」：一个整数的二进制表示里，<strong>每一位本来就是一个 0 或 1 的开关</strong>。只要约定「第几位代表哪种权限」，一个整数就能同时装下所有开关。关键在于权限常量都取 2 的幂——1、2、4、8……因为 2 的幂的二进制里恰好只有一个 1，把它们按位或起来时，各自的位互不干扰。
    </p>
    <table>
      <thead>
        <tr>
          <th>权限</th>
          <th>常量写法</th>
          <th>二进制</th>
          <th>十进制</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>读</td>
          <td><code>READ</code></td>
          <td><code>0b001</code></td>
          <td><span class="lesson-kv">1</span></td>
        </tr>
        <tr>
          <td>写</td>
          <td><code>WRITE</code></td>
          <td><code>0b010</code></td>
          <td><span class="lesson-kv">2</span></td>
        </tr>
        <tr>
          <td>管理</td>
          <td><code>ADMIN</code></td>
          <td><code>0b100</code></td>
          <td><span class="lesson-kv">4</span></td>
        </tr>
        <tr>
          <td>导出</td>
          <td><code>EXPORT</code></td>
          <td><code>0b1000</code></td>
          <td><span class="lesson-kv">8</span></td>
        </tr>
      </tbody>
    </table>
    <p>
      有了这套约定，四种操作全部落到位运算上，而且彼此正交：
    </p>
    <ul>
      <li><strong>授予</strong>用按位或 <code>|</code>，把目标位置 1：<code>perm |= WRITE</code>。</li>
      <li><strong>检查</strong>用按位与 <code>&amp;</code>，看目标位是否还是 1：<code>!!(perm &amp; WRITE)</code> 为真即拥有，结果为 0 就表示没有。</li>
      <li><strong>撤销</strong>用按位与非 <code>&amp;~</code>，把目标位清 0：<code>perm &amp;= ~WRITE</code>，其中 <code>~WRITE</code> 会只把这一位取反、其余位保持 1，与一下便只清掉这一位。</li>
      <li><strong>切换</strong>用按位异或 <code>^</code>，让 1 变 0、0 变 1：<code>perm ^= ADMIN</code>。</li>
    </ul>
    <p>
      位运算的语义其实很朴素：它先把操作数转成 32 位有符号整数，然后<strong>逐位独立计算</strong>，位与位之间互不影响——这正是「多个开关并行不悖」所需要的。举个可验证的例子：<code>5 &amp; 3</code>，<code>5</code> 是 <code>0b101</code>、<code>3</code> 是 <code>0b011</code>，逐位与之后得到 <code>0b001</code>，也就是 <code>1</code>。把它按二进制展开，就能和每一位的权限对上。
    </p>
    <p>
      权限系统里还常伴随「取默认值」的需求，这就轮到逻辑运算符。要知道 <code>&amp;&amp;</code> 和 <code>||</code> 返回的<strong>不是布尔值，而是参与运算的原始操作数</strong>——<code>a || b</code> 在 a 为真时直接返回 a 本身，这正是短路取值的基础。于是 <code>const name = input || '匿名'</code> 能给出兜底。但 <code>||</code> 把 <code>0</code> 和空串也算作 falsy，如果 <code>0</code> 或空串本身是合法值，就会被误伤；此时该用 <code>??</code>，它只在左侧是 <code>null</code> 或 <code>undefined</code> 时才取右侧。若想把「判断再赋值」合并成一步，还有 <code>&amp;&amp;=</code>、<code>||=</code>、<code>??=</code>，例如 <code>opts.retries ??= 3</code> 只在 <code>retries</code> 为空值时才写进去，条件不满足时它根本不赋值。
    </p>
    <p>
      最后是两条必须记住的边界。第一，位运算以 <strong>32 位有符号整数</strong>为基准，超出这个范围的数值会被截断，权限位用到第 31 位以后、或参与运算的是大整数时，要格外当心。第二，权限常量虽然可以直接写裸数字，但更好的做法是用 2 的幂配上有意义的名字（常量或枚举都行）：读代码时把它按二进制展开，就能和权限一一对上，否则一个 <code>perm &amp; 4</code> 谁也看不出在检查什么。
    </p>

    <h2>二进制位的实时变化</h2>
    <figure class="lesson-figure">
      <figcaption>点「+读」「+写」「+管理」观察二进制位如何被点亮，再用「-写」和「切换管理」验证按位与非、异或的效果。</figcaption>
      <J24LogicalBitwise />
    </figure>

    <h2>位压缩的空间与上限</h2>
    <p>
      逻辑运算与位运算解决的是「用一个整数表达一组开关」的问题：逻辑运算符负责短路取值和默认值，记住它返回的是原始操作数而非布尔值；位运算把多个布尔权限压进一个整数的各位，用 <code>|</code> 授予、<code>&amp;</code> 检查、<code>&amp;~</code> 撤销、<code>^</code> 切换——存储小、检查快、扩展时不必改结构，代价是要记住 32 位边界，并用 2 的幂给常量命名。
    </p>
    <div class="lesson-term">
      <span class="term-name">「权限位模型」</span>是一种用整数二进制位并行编码多项权限或状态开关的做法：每个权限常量取 2 的幂（如 <code>0b001</code>、<code>0b010</code>、<code>0b100</code>），按位或 <code>|</code> 授予、按位与 <code>&amp;</code> 检查、按位与非 <code>&amp;~</code> 撤销、按位异或 <code>^</code> 切换。位运算先把操作数转成 32 位有符号整数再逐位计算，超出范围会截断；逻辑运算符 <code>&amp;&amp;</code>、<code>||</code>、<code>??</code> 在结果确定时短路，返回原始操作数而非布尔值，<code>&amp;&amp;=</code>、<code>||=</code>、<code>??=</code> 只在条件满足时才赋值。
    </div>
  </LessonArticle>
</template>
