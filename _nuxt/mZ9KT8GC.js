const n=`<script setup lang="ts">
import PY09Decorators from './PY09Decorators.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>想在 <code>my_func()</code> 前后各打一行日志，又不想钻进函数体里改代码，就在它上面写了一行 <code>@log_decorator</code>。奇怪的是，之后再调用 <code>my_func()</code>，打印日志的却是另一段从没亲手调用的代码。这中间到底发生了什么？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      给一批函数都加上日志、计时或权限检查，最直接的做法是钻进每个函数体，在开头结尾各插一段代码。一开始能跑，但函数一多就失控：同样的样板被复制了几十遍，将来想把日志格式改一处，得改几十处，还容易漏。
    </p>
    <p>
      更麻烦的是，日志、计时这类需求和函数真正的业务逻辑并没有关系。把它们混在业务代码里，等于让每段逻辑都被杂事缠住，读起来也分不清哪句是干什么的。于是自然想：能不能把这段额外动作<strong>抽出来</strong>，套在函数外面，而函数本身一个字都不用改？
    </p>

    <h2>函数是一等对象</h2>
    <p>
      要让「套在外面」成为可能，前提是函数能被当作普通对象传来传去。Python 恰好如此：函数可以赋给变量、放进列表、作为实参传给别的函数，也能当作返回值送出去。既然函数能当参数接收、又能当结果返回，那么<strong>写一个「接收函数、返回新函数」的函数</strong>，逻辑上就完全说得通了。
    </p>
    <p>
      这个「接收一个函数、返回另一个函数」的东西，就是装饰器的骨架。它不是语法魔法，只是把「函数作为参数与返回值」这件事用到了极致。
    </p>

    <h2>闭包：内层函数记住外层变量</h2>
    <p>
      装饰器返回的新函数，往往是在<strong>另一个函数内部定义</strong>的。这种「定义在函数内部的函数」加上「它引用了外层函数的变量」，就是<strong>闭包</strong>。即便外层函数早已返回，内层函数依然能读到那些变量——因为 Python 把那部分环境一起保存了下来。
    </p>
    <p>
      拿计时来说：外壳函数负责在调用前后记时间，真正的原函数被闭包记在内部，等到被调用时才执行。日志在哪、原函数是谁，都被内层函数牢牢记住。
    </p>

    <h2>装饰器本质：接收函数，返回新函数</h2>
    <p>
      <code>@log_decorator</code> 这行语法糖，等价于在定义完函数后立刻写一句 <code>my_func = log_decorator(my_func)</code>。也就是说，<strong>装饰器在被装饰函数定义时就已经执行了一次</strong>，用返回值<strong>顶替</strong>了原来的名字。此后你调用 <code>my_func()</code>，调到的其实是被包好的新函数。
    </p>
    <ol class="lesson-steps">
      <li>定义 <code>my_func</code>。</li>
      <li><code>@log_decorator</code> 触发：把 <code>my_func</code> 交给装饰器，拿回一个 <code>wrapper</code>。</li>
      <li>名字 <code>my_func</code> 被重新绑定到这个 <code>wrapper</code>。</li>
      <li>调用 <code>my_func()</code> 时，先跑的其实是 <code>wrapper</code>，它在内部再调用原始函数。</li>
    </ol>

    <h2>functools.wraps 与带参数的装饰器</h2>
    <p>
      直接用上面的写法有个瑕疵：<code>wrapper</code> 会覆盖掉原函数的名字、文档字符串等元信息，调试和自省时看到的全是 <code>wrapper</code>。解决办法是在 <code>wrapper</code> 上加一个 <code>@functools.wraps(func)</code>，它把原函数的这些信息复制回来。
    </p>
    <p>
      当装饰器本身还需要配置项（例如「重复几次」「缓存多大」）时，就要再加一层嵌套：最外层收<strong>配置参数</strong>并返回真正的 <code>decorator</code>，<code>decorator</code> 收<strong>函数</strong>并返回 <code>wrapper</code>。写成 <code>@repeat(2)</code> 时，先算 <code>repeat(2)</code> 得到一个装饰器，再用它去装饰函数。三层各司其职，少了任何一层都会漏掉一个阶段。
    </p>

    <h2>多装饰器叠加与常见用途</h2>
    <p>
      同一函数上可以叠多个装饰器，书写顺序贴近函数，但<strong>执行顺序是从下往上的</strong>：最靠近函数的那个先包裹，最上面的最后包裹。于是调用时，最外层先进入、最内层最后进入。
    </p>
    <ul>
      <li><strong>日志</strong>：记录调用与返回，或在异常时留下现场。</li>
      <li><strong>计时</strong>：测量耗时，用于性能排查。</li>
      <li><strong>缓存</strong>：用 <code>functools.lru_cache</code> 记住计算结果，避免重复计算。</li>
      <li><strong>权限校验</strong>：调用前检查身份，不通过就提前拒绝。</li>
    </ul>
    <p>
      这些场景的共同点是：都属于「包裹在业务之外、每个函数都差不多」的横切关注点，正好由装饰器统一收口。
    </p>

    <h2>看一遍装饰器的包裹过程</h2>
    <figure class="lesson-figure">
      <figcaption>在「基础装饰器」里逐步点「下一步」，看清 <code>before / after</code> 如何夹住原函数；再切到「带参数的装饰器」，观察多出来的那一层是怎么吃下配置参数的。</figcaption>
      <PY09Decorators />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      装饰器的地基是「函数是一等对象」与「闭包」：内层函数记住外层变量，外层函数返回内层函数。<code>@</code> 只是把 <code>f = deco(f)</code> 写得更顺眼的语法糖。需要配置时再加一层嵌套，用 <code>functools.wraps</code> 保住原函数元信息，叠加时从下往上包裹。日志、计时、缓存、鉴权这类横切逻辑，正适合交给它。
    </p>
    <div class="lesson-term">
      <span class="term-name">「闭包」</span>指一个内层函数连同它所引用的外层变量环境一起被保存下来，外层函数返回后内层函数仍能访问那些变量。边界与例外：闭包捕获的是变量本身而非当时的快照，若外层变量随后被修改，内层函数看到的是最新值；这也提醒在循环中创建闭包时要留意绑定时机。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
