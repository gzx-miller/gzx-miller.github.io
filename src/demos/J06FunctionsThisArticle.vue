<script setup lang="ts">
import J05ThisBinding from './J05ThisBinding.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表要显示每门课的讲师，代码写成了 <code>list.map(course.formatTitle)</code>，结果每一行的讲师都是 <code>undefined</code>；可你在控制台里单独敲 <code>course.formatTitle()</code>，它明明能正常返回。同一个函数，为什么换个地方调用就变了？
    </div>

    <h2>三种写法与提升</h2>
    <p>
      最初你只想要一个「叫得出名字」的函数，于是写下 <code>function formatTitle(course) {}</code>。这叫<strong>函数声明</strong>，它的好处很实在：写在哪儿都行，甚至可以在前面就调用它——因为引擎在执行之前，先把整段声明搬到了当前作用域的顶部，这个动作叫<strong>提升</strong>。
    </p>
    <p>
      可当函数要当作值来用时——塞进对象、传给 <code>map</code>、作为回调再传出去——声明就显得啰嗦。于是有了<strong>函数表达式</strong>：<code>const format = function (course) {}</code>。它和声明长得几乎一样，本质却是「先声明一个变量，再把一个匿名函数赋给它」。差别恰好落在提升上：<strong>变量名会提升，赋值不会</strong>，所以在赋值那一行之前调用它会直接报错。
    </p>
    <p>
      再短一点，就走到<strong>箭头函数</strong> <code>const format = (course) =&gt; {}</code>。它看着只是省了几个字，却动了一条最关键的规则——<code>this</code> 不再由调用方式决定。这一点放到后面单独讲，先记住：三种写法不是三个同义词，选错会带来完全不同的行为。
    </p>

    <h2>参数的默认与剩余</h2>
    <p>
      参数少传一个就会变成 <code>undefined</code>，最笨的补法是函数体开头塞一句 <code>if (count === undefined) count = 1</code>。它确实管用——缺参时也有值可算。只是每多一个可选参数就多一行判断，重复又容易漏。
    </p>
    <p>
      更好的写法是在参数表里直接给默认值：<code>function addToCart(item, count = 1) {}</code>。这里要留个心眼：<strong>默认值只在传 <code>undefined</code> 时生效</strong>，传 <code>null</code> 或 <code>0</code> 都不会被覆盖。
    </p>
    <p>
      参数个数不确定时，另一个办法是用剩余参数收集：<code>function sum(...nums) {}</code>，多余的实参会收成一个<strong>真正的数组</strong>，可以放心用 <code>map</code>、<code>reduce</code>。还有一个只在 <code>function</code> 里存在的对象 <code>arguments</code>，它装着本次调用收到的全部实参，但它只是「类数组」，没有 <code>forEach</code> 这类方法，得靠 <code>length</code> 手动遍历。<strong>箭头函数里根本没有 <code>arguments</code></strong>，想收集参数只能用剩余参数。
    </p>

    <h2>返回值里的陷阱</h2>
    <p>
      函数默认会返回 <code>undefined</code>。这不是失误，而是一条明确的约定：只要没写 <code>return</code>，或者所有分支都没走到 <code>return</code>，调用结果就是 <code>undefined</code>。所以「顺手改个全局变量就算完事」的函数，拿到的返回值一定是空的。
    </p>
    <p>
      还有一个更隐蔽的坑：<code>return</code> 后面的表达式如果换到下一行写，引擎会在 <code>return</code> 处自动补上分号，后面的值根本不会被返回，你得到的还是 <code>undefined</code>。所以 <code>return</code> 和它的值尽量写在同一行。
    </p>

    <h2>this 由谁来决定</h2>
    <p>
      很多人以为 <code>this</code> 是函数自己的属性，定义时定死。其实相反——<strong><code>this</code> 的值在每次调用时才确定，由「怎么调」决定</strong>。同一个函数用不同方式调，<code>this</code> 可以是不同的东西。规则一共四条，优先级从低到高：
    </p>
    <ul>
      <li><strong>默认绑定</strong>：裸调用 <code>formatTitle()</code>，严格模式或模块里 <code>this</code> 是 <code>undefined</code>，松散脚本里则是全局对象。</li>
      <li><strong>隐式绑定</strong>：写成 <code>对象.方法()</code>，如 <code>course.formatTitle()</code>，<code>this</code> 就是那个对象。</li>
      <li><strong>显式绑定</strong>：用 <code>call</code>、<code>apply</code>、<code>bind</code> 手动指定 <code>this</code>，它压过隐式绑定。</li>
      <li><strong>new 绑定</strong>：用 <code>new</code> 调构造函数，<code>this</code> 是刚创建的那个新对象，优先级最高。</li>
    </ul>
    <p>
      四条规则里真正说了算的，是「最后起作用的那一层」。这正是开头那个 bug 的来源。
    </p>

    <h2>箭头函数的 this</h2>
    <p>
      说回 <code>list.map(course.formatTitle)</code>。把方法从对象上摘下来传给别人时，调用方式已经不是 <code>对象.方法()</code> 了，隐式绑定不成立，退回默认绑定，<code>this</code> 不再是 <code>course</code>，于是 <code>this.title</code> 读不到值——这就是「方法脱离对象作为回调后 this 丢失」。
    </p>
    <p>
      补救有两种。一种是把方法重新绑回对象：<code>list.map(course.formatTitle.bind(course))</code>。另一种更常见——用箭头函数包一层：<code>list.map(c =&gt; c.formatTitle())</code>，这样 <code>formatTitle</code> 仍然是被 <code>c.</code> 调用的。
    </p>
    <p>
      箭头函数能救场，是因为它<strong>没有自己的 <code>this</code></strong>：它会直接沿用定义位置外层的 <code>this</code>，也就是「词法捕获」。好处是稳定，代价是<strong>之后用 <code>call</code>、<code>apply</code>、<code>bind</code> 也改不动它</strong>——你传进去的对象会被忽略。所以箭头函数适合做回调，却不适合需要动态 <code>this</code> 的方法。
    </p>

    <h2>亲手验证 this 绑定</h2>
    <figure class="lesson-figure">
      <figcaption>同一个方法，点「作为方法调用」得到对象本身，点「显式绑定调用」则把 this 换成了别的对象。</figcaption>
      <J05ThisBinding />
    </figure>

    <h2>把绑定说清楚</h2>
    <p>
      函数、参数、返回值这三样是从「怎么写」上约束函数；<code>this</code> 则是从「怎么调」上决定的。把「写在哪」和「谁调用」分开看，<code>this</code> 就不再神秘：隐式绑定看调用点前面有没有对象，显式绑定和 <code>new</code> 能覆盖它，而箭头函数干脆放弃自己的 <code>this</code>，从定义处拿。
    </p>
    <div class="lesson-term">
      <span class="term-name">「this 绑定」</span>指函数被调用时 <code>this</code> 指向谁，按优先级由高到低为 <code>new</code> 绑定、显式绑定（<code>call</code>/<code>apply</code>/<code>bind</code>）、隐式绑定（<code>对象.方法()</code>）与默认绑定。箭头函数不参与这套规则，它的 <code>this</code> 在定义时由词法环境捕获，且不能用 <code>call</code>/<code>apply</code>/<code>bind</code> 改变。
    </div>
  </LessonArticle>
</template>
