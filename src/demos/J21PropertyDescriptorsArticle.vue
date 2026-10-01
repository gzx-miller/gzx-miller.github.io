<script setup lang="ts">
import J21PropertyDescriptors from './J21PropertyDescriptors.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>配置对象 <code>const config = { maxStudents: 50 }</code> 里，你从没写过 <code>config.maxStudents = 0</code>，可程序跑一阵子之后上限就变成了 <code>0</code>，页面再也招不进人——到底是谁在背后改了它，能不能把这个属性改成「谁都改不动」？
    </div>

    <h2>共享配置可变风险</h2>
    <p>
      你有一份共享配置：人数上限、价格、标题。它被传给了好几个模块，有表单在用它渲染输入框，有校验逻辑在用它判断，还有一段遗留代码顺手在运行时微调了一下。配置本该是「定下来就不动」的，可只要有人拿到这个对象的引用，<strong>一次赋值就能把它改掉</strong>，而且不会报错。你在出错的地方查了半天，根本想不到问题出在前面某个模块的随手一笔。
    </p>
    <p>
      不用属性描述符这套能力，代价有三层：第一，共享的配置随时可能被悄悄改写；第二，你想让价格不能为负数、想让某个字段由别的字段算出来，都只能靠调用方自觉；第三，内部用到的字段明明只是实现细节，却会在遍历对象时被暴露出来，别人一个 <code>Object.keys</code> 就带走了。
    </p>

    <h2>const与团队约定</h2>
    <p>
      最容易想到的做法是用 <code>const</code> 声明这个配置，并在团队约定里写一句「不要修改它」。这确实是很多人第一时间会做的事。
    </p>
    <p>
      这个方案对的地方在于<strong>方向没错——它试图把配置和可变状态区分开</strong>，用声明方式表达「这一份是常量」。但它对的地方也仅限于此，因为 <code>const</code> 管的事和你想的完全不是一回事。
    </p>

    <h2>常量声明约束范围</h2>
    <ul>
      <li><code>const</code> 锁住的只是<strong>变量本身</strong>不再被重新赋值。它完全管不到对象的属性——<code>config.maxStudents = 0</code> 照样成功，而且不报任何错。</li>
      <li>对象属性默认可以<strong>新增、删除、修改</strong>。想让某个字段干脆读都读不出来，或者让对象不能再被加字段，用 <code>const</code> 做不到。</li>
      <li>想把价格限制成「不能为负」，只能靠每个赋值点自己 <code>Math.max(0, v)</code>，漏掉一处就破防。</li>
      <li>想让某个属性是「由另一个字段算出来的派生值」，就得手写两处同步代码，字段一多就必然不同步。</li>
    </ul>

    <h2>属性描述符配置</h2>
    <p>
      要真正控制一个属性，得先知道「属性」在 JavaScript 里并不是一个单纯的键值对，而是带着一张<strong>描述表</strong>的。每一个自有属性都有自己的属性描述符，可以逐项配置它是可写、可枚举、可配置的，也可以把它从「存一个值」改写成「读的时候现算」。
    </p>
    <p>
      <code>Object.defineProperty</code> 就是精确设置这张描述表的方法。对<strong>数据属性</strong>，可以指定 <code>value</code> 这个值，以及三个开关：<code>writable</code> 决定值能否被改，<code>enumerable</code> 决定它会不会出现在 <code>for...in</code>、<code>Object.keys</code> 这类遍历里，<code>configurable</code> 决定这个属性本身能否被删除、能否再改描述符。把 <code>writable</code> 设为 <code>false</code>，就是给单个字段上了锁；把 <code>enumerable</code> 设为 <code>false</code>，就是把内部字段藏出遍历范围之外。
    </p>
    <p>
      对<strong>存取属性</strong>，则是用 <code>get</code> 与 <code>set</code> 两个函数代替值：读属性时执行 <code>get</code>，写属性时执行 <code>set</code>。这正是「不能为负」和「派生字段」的正解——把校验和计算集中写在一个地方，任何读取和写入都必然经过它，调用方不再有漏网的机会。
    </p>
    <p>
      <code>set price(v) { this._price = Math.max(0, v) }</code>
    </p>
    <p>
      如果对整个对象动手，语言提供了三个逐级收紧的工具，限制程度依次加深：
    </p>
    <table>
      <thead>
        <tr>
          <th>方法</th>
          <th>能不能新增属性</th>
          <th>能不能删除属性</th>
          <th>能不能修改属性值</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>preventExtensions</code></td>
          <td>不能</td>
          <td>可以</td>
          <td>可以</td>
        </tr>
        <tr>
          <td><code>seal</code></td>
          <td>不能</td>
          <td>不能</td>
          <td>可以</td>
        </tr>
        <tr>
          <td><code>freeze</code></td>
          <td>不能</td>
          <td>不能</td>
          <td>不能</td>
        </tr>
      </tbody>
    </table>
    <p>
      一句话记住它们的区别：<code>preventExtensions</code> 只挡新增，<code>seal</code> 再挡删除，<code>freeze</code> 连赋值一起挡。冻结之后想核对结果，可以用 <code>Object.getOwnPropertyDescriptor</code> 查看某个属性的 <code>writable</code> 是不是已经变成 <code>false</code>。
    </p>
    <div class="lesson-box warn">
      有三处最容易误判。其一，<code>freeze</code> 只冻结<strong>一层</strong>，对象里嵌套的子对象仍可修改，需要递归处理或改用结构化克隆；其二，遍历方法如 <code>Object.keys</code>、<code>values</code>、<code>entries</code> 只覆盖<strong>可枚举的自有属性</strong>，设成不可枚举的字段自然不在其中；其三，属性一旦设成 <code>configurable: false</code>，就再也无法删除或改回描述符配置，属于不可逆操作。还有一点：<code>freeze</code> 后赋值在非严格模式下是<strong>静默失败</strong>——代码不报错，值却没变，最容易让人误以为改成功了。
    </div>
    <p>
      最后回到 <code>get</code>，还有一个性能上的取舍：getter 每次访问都会<strong>重新执行一遍计算</strong>，如果它背后是排序、过滤这类开销大的运算，就不适合直接写成 getter，而应该把结果缓存到普通字段里，需要时再更新。
    </p>

    <h2>冻结与只读对照</h2>
    <figure class="lesson-figure">
      <figcaption>依次点击按钮，看 <code>freeze</code> 如何静默拦下赋值、<code>defineProperty</code> 如何让字段只读或不可枚举，以及 setter 如何把价格压回非负。</figcaption>
      <J21PropertyDescriptors />
    </figure>

    <h2>对象属性控制权</h2>
    <p>
      属性描述符与对象控制解决的，是「对象属性到底由谁说了算」的问题：<code>defineProperty</code> 让你逐项决定一个属性能不能写、能不能枚举、能不能删，甚至从「存值」变成「计算」；<code>freeze</code> 这一族则把这种控制放大到整个对象。它们把「配置不许改」从一句团队约定，变成了语言层面的硬约束。
    </p>
    <div class="lesson-term">
      <span class="term-name">「属性描述符」</span>指描述一个自有属性行为的配置表：数据属性描述符含 <code>value</code> 与 <code>writable</code> / <code>enumerable</code> / <code>configurable</code>，存取属性描述符则用 <code>get</code> / <code>set</code> 现算取值、并在写入时校验，由 <code>Object.defineProperty</code> 精确设置，用 <code>Object.getOwnPropertyDescriptor</code> 读取。对象级别的收紧分三级：<code>preventExtensions</code> 禁止新增，<code>seal</code> 再禁止删除，<code>freeze</code> 连赋值也禁止；其中 <code>freeze</code> 只深冻一层，且 <code>configurable: false</code> 不可逆。
    </div>
  </LessonArticle>
</template>
