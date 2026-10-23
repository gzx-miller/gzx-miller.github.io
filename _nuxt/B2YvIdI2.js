const n=`<script setup lang="ts">
import J18HigherOrder from './J18HigherOrder.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>搜索框里每敲一个字符就发一次请求，字还没输完接口已经被打了七八次；同事说改成「等一会儿再发」就行，可「等一会儿」到底该等多久、期间又该不该再发，谁也说不清。
    </div>

    <h2>函数能收也能给</h2>
    <p>
      想给一批课程算价格，最直白的写法是每处都手写一遍 <code>for</code> 循环。写着写着你发现：循环的骨架每次都一样，变的只是「对每个元素做什么」。于是把「做什么」抽成一个函数传进去，就有了 <code>arr.map(calculate)</code>。
    </p>
    <p>
      这类<strong>接收函数作为参数、或者返回一个函数</strong>的函数，就是<strong>高阶函数</strong>。它做对的事是把「流程」和「具体动作」拆开：骨架只写一次，动作按需传入。<code>map</code>、<code>filter</code>、<code>reduce</code> 都是它的例子——它们不认识你的业务，却能替你跑完全程。
    </p>

    <h2>纯函数与副作用</h2>
    <p>
      把动作交出去以后，你会开始在意交出去的函数「干净不干净」。一个<strong>纯函数</strong>要求两件事：相同输入永远得到相同输出，并且不改动外部任何状态。
    </p>
    <p>
      纯函数好在哪里？好测、好缓存、好组合——因为它没有隐藏的依赖，看一眼输入就能推出输出。可现实里发请求、写 DOM、打日志都是必要的<strong>副作用</strong>。务实的做法不是消灭副作用，而是把它挤到系统的边界上：核心计算保持纯，脏活留给最外层的调度函数去干。
    </p>

    <h2>柯里化与偏函数</h2>
    <p>
      参数一多，调用点就不好读。设想 <code>applyDiscount(0.2, 200)</code>，两个参数谁是谁，光看调用处还得回翻定义。柯里化把「一次收齐」改成「一次收一个」：<code>const applyDiscount = (rate) =&gt; (price) =&gt; price * (1 - rate)</code>。于是可以先固定折扣率，得到一个专用函数 <code>memberPrice</code>，之后只管把价格喂进去。
    </p>
    <p>
      和它成对的是<strong>偏函数</strong>：用 <code>bind</code> 预填前面若干参数，剩下的等调用时再给，比如 <code>addTax.bind(null, 0.06)</code> 把税率固定下来。两者的共同点，是<strong>把「配置」与「数据」分成两次传入</strong>，让专用函数比通用函数更好用、也更好读。
    </p>

    <h2>组合的方向</h2>
    <p>
      折算价格要经过打折、加税、格式化三步。最省事的写法是嵌套：<code>format(addVat(discount(price)))</code>。它能跑，可括号一多就得从最里面往外读，顺序和眼睛的阅读方向正好相反。
    </p>
    <p>
      <strong>组合</strong>把这件事捋直：<code>pipe</code> 让函数从左到右依次执行，<code>compose</code> 则从右到左。两者只是方向不同，核心都是「把上一步的输出喂给下一步」。配合柯里化，一条 <code>pipe(打折, 加税, 格式化)(price)</code> 读起来就像流水线，数据往哪走一目了然。
    </p>

    <h2>用闭包记住状态</h2>
    <p>
      还有一类高阶函数，靠闭包替调用者「记住」点什么：
    </p>
    <ul>
      <li><strong>once</strong>：只允许真正执行一次，后续调用直接返回首次的结果——适合初始化逻辑。</li>
      <li><strong>memoize</strong>：把参数和结果存进缓存，同样的输入不再重算——适合耗时的纯函数。</li>
      <li><strong>防抖 debounce</strong>：每次触发都重新计时，<strong>停止触发后只执行最后这一次</strong>——正适合搜索框输入。</li>
      <li><strong>节流 throttle</strong>：不管触发多密集，<strong>固定间隔内至多执行一次</strong>——适合滚动、拖拽这类持续事件。</li>
    </ul>
    <p>
      防抖与节流看着都在「少执行几次」，行为却相反：防抖关心「停没停」，节流关心「离上次够不够久」。开场那个搜索框选防抖，滚动加载选节流——方向选错，要么请求还是太密，要么响应迟钝得让人以为卡死。
    </p>

    <h2>亲手组合一次</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮走一遍柯里化与 pipe 的价格管线，再在输入框里体验防抖如何把连续输入压成一次搜索。</figcaption>
      <J18HigherOrder />
    </figure>

    <h2>从小函数到大管线</h2>
    <p>
      高阶函数把「做什么」从「怎么做」里拆出来，柯里化把参数分两次给，组合再把这些小函数接成一条管线。每一步都不复杂，合起来却让一段业务逻辑变成可以逐段替换、逐段测试的流水线——这才是「组合优于继承」在函数层面的样子。
    </p>
    <div class="lesson-term">
      <span class="term-name">「高阶函数」</span>指接收函数作为参数、或返回一个函数的函数。它常配合纯函数（输入相同则输出相同、不改外部状态）使用，通过柯里化与偏函数把参数分开传入，再用 <code>pipe</code>（左到右）/ <code>compose</code>（右到左）组合成数据管线；<code>once</code>、<code>memoize</code>、防抖与节流则是用闭包记住状态的高阶函数。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
