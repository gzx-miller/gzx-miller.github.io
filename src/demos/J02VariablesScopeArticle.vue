<script setup lang="ts">
import J02VariablesScope from './J02VariablesScope.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>购物车列表给每件商品都绑了「移除」回调，循环变量随手写成了 <code>var</code>；上线后点任意一件商品的删除按钮，被删掉的都是列表里的最后一件——看上去每一轮都注册了新的回调，读到的却是同一个变量。
    </div>

    <h2>变量先得声明</h2>
    <p>
      最省事的写法是不声明，直接赋值：<code>total = 0</code>。它能跑，运行结果看起来也没错，于是很容易被当成「JavaScript 不用声明变量」。但引擎其实偷偷<strong>在全局对象上建了一个属性</strong>，这个变量从哪来、能被谁读到，全靠猜；更糟的是，两段函数里各写一次同名赋值，可能悄悄改到同一个全局变量。
    </p>
    <p>
      它做对的一点是「写得短」，代价是「位置失控」。迭代方向正好相反：<strong>任何变量都先声明再使用</strong>，让它的可见范围由书写位置决定。声明有 <code>var</code>、<code>let</code>、<code>const</code> 三种，选哪一种，取决于你想让这个变量管多宽。
    </p>

    <h2>三种声明划地盘</h2>
    <p>
      变量的可见范围由作用域决定，共分三层：<strong>全局作用域</strong>（整段脚本都能读到）、<strong>函数作用域</strong>（只在函数体内）、<strong>块作用域</strong>（只在 <code>{ }</code> 里，例如 <code>if</code>、<code>for</code> 后面那对花括号）。<code>var</code> 只认函数作用域，写在块里也会<strong>泄漏到块外</strong>；<code>let</code> 与 <code>const</code> 认块作用域，出了 <code>{ }</code> 就访问不到。
    </p>
    <p>
      于是选型的规则很清晰：<strong>值需要改动用 <code>let</code>，值一旦确定不再改绑用 <code>const</code>，而 <code>var</code> 只在维护旧代码时保留</strong>。默认写 <code>const</code>、不得不用时再改 <code>let</code>，能让「这个变量会被改」这件事在声明处就一眼可见。
    </p>

    <h2>声明被提前看到</h2>
    <p>
      把声明写在函数末尾，前面却已经能读到它，这是<strong>声明提升（hoisting）</strong>。<code>var</code> 声明的<strong>名字</strong>会被提升到所在函数或全局作用域的顶部，但<strong>赋值不会被提升</strong>，所以在赋值之前读到的是 <code>undefined</code>；函数声明则整体提升，因此函数可以先调用、后定义。
    </p>
    <p>
      这方便吗？方便，代价是「读到一个 <code>undefined</code> 却分不清是没赋值还是写错了」。它做对的是让声明位置与作用域解耦，不够的是把「还没准备好」和「就是空」混成了同一个 <code>undefined</code>。真正的补法，是把「提升」明确拆成两种：<code>var</code> 的 <code>undefined</code>，与 <code>let</code>／<code>const</code> 的<strong>暂时性死区</strong>。
    </p>

    <h2>绑定锁得住什么</h2>
    <p>
      <code>let</code> 与 <code>const</code> 的声明同样会被提前「看到」，但在<strong>声明真正执行之前</strong>访问它们，会直接抛 <code>ReferenceError</code>，这段「已经存在却还不能用」的区间就是<strong>暂时性死区（TDZ）</strong>。它把「用早了」从静默的 <code>undefined</code> 变成一次明确的报错——错误提前暴露，恰恰是我们想要的。
    </p>
    <p>
      再说重复规则：同一个作用域里，<code>var</code> 允许重复声明并静默覆盖，<code>let</code>／<code>const</code> 重复声明会直接报错；赋值方面，<code>var</code> 与 <code>let</code> 可以重新赋值，<code>const</code> 一旦绑定就不能再指向别的值。这里有个常见误会：<strong><code>const</code> 只锁定「绑定」，不冻结对象内容</strong>。<code>const config = { theme: 'autumn' }</code> 之后再写 <code>config.theme = 'maple'</code> 完全合法，只有 <code>config = other</code> 才被禁止；要连内容一起冻结，得另外调用 <code>Object.freeze()</code>。
    </p>
    <p>
      回到开头的循环问题：用 <code>let</code> 声明循环变量时，<strong>每一轮迭代都会得到一份独立的绑定</strong>，注册回调时各自记住当轮的值；换成 <code>var</code>，所有回调共享同一个变量，循环结束后它停在末值，于是点谁都删最后一件。这就是把循环变量从 <code>var</code> 改成 <code>let</code> 就能修好这个 bug 的原因。
    </p>

    <h2>亲手验证作用域</h2>
    <figure class="lesson-figure">
      <figcaption>分别点「var 声明」「let 声明」「const 声明」，观察各自能管到多宽、能改到什么程度。</figcaption>
      <J02VariablesScope />
    </figure>

    <h2>让可见范围可预期</h2>
    <p>
      作用域与绑定这两件事，本质是把「变量从哪来、能活多久、能不能改」都写死在代码里。默认用 <code>const</code>、需要改动用 <code>let</code>、不碰 <code>var</code>；先声明后使用，绕开暂时性死区；把 <code>const</code> 理解成「锁绑定」而不是「锁内容」——变量带来的意外就少了一大半。
    </p>
    <div class="lesson-term">
      <span class="term-name">「暂时性死区（TDZ）」</span>从进入作用域、到 <code>let</code>／<code>const</code> 声明真正执行之前，这段区间里变量已经存在却不能被读取，任何访问都会抛 <code>ReferenceError</code>。它是 <code>let</code>／<code>const</code> 与 <code>var</code>「提升成 <code>undefined</code>」的关键差别，让「用早了」变成立刻可见的错误。
    </div>
  </LessonArticle>
</template>
