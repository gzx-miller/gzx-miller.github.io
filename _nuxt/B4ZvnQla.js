const e=`<script setup lang="ts">
import J12IteratorsGenerators from './J12IteratorsGenerators.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>播放列表上的「下一课」按钮，为什么每点一次才算出下一条，而不是一开始就把上万条课程一次性算成数组？
    </div>

    <h2>课程数据来源</h2>
    <p>
      假设你要做一个课程播放列表：数据来源可能是接口分页拿到的数组，也可能是本地根据规则即时生成的序列（比如「第 n 个质数」）。界面只有一个「下一课」按钮，用户点一次就消费一条。可问题是——总共有多少条、还有没有下一条，事先很可能完全未知。
    </p>
    <p>
      不引入统一的取值方式，代价就是：消费方只能盯着某个具体容器的细节写代码。用数组就写 <code>list.length</code> 和 <code>list[i]</code>；一旦来源换成 <code>Set</code>、换成即时计算的序列，这套下标访问立刻失效，循环得推倒重写。你的<strong>消费逻辑被数据结构绑死了</strong>。
    </p>
    <p>
      更麻烦的是「取到哪算完」这件事。数组有 <code>length</code> 可以判断终点，可一个动态生成的序列根本没有这个长度，你无从知道下一条还在不在。取值方式和结束条件，本来是两个正交的问题，却被下标访问硬绑在了一起。
    </p>

    <h2>整体物化数组</h2>
    <p>
      最省事的做法：不管来源是什么，先一次性算成一个数组，再交给 <code>for...of</code> 或 <code>forEach</code> 消费。
    </p>
    <p>
      这个方案做对了一件事：<strong>数组是最简单、最可预测的容器</strong>，有统一的下标和 <code>length</code>，小数据量下用它天经地义。这个「给消费方一个统一入口」的思路要保留。
    </p>

    <h2>全量计算内存开销</h2>
    <ul>
      <li>一次性物化一万条、一百万条数据，全部常驻内存，还没用上就先占满了。</li>
      <li>「第 n 个质数」这种序列没有终点，你无法先算完再返回，数组根本装不下无限长。</li>
      <li>用户可能只点了一次「下一课」，剩下的 9999 条白算了——提前计算就是纯浪费。</li>
      <li>消费方写死了 <code>list.length</code> 与 <code>list[i]</code>，换一种数据来源就要重写整套循环。</li>
    </ul>

    <h2>迭代器协议约定</h2>
    <p>
      不推翻「逐个取值」，而是把这个动作抽象成一个协议。
    </p>
    <p>
      <strong>第一层，迭代器协议。</strong>任何对象只要在 <code>[Symbol.iterator]</code> 上返回一个迭代器，迭代器带 <code>next()</code> 方法，每次 <code>next()</code> 返回 <code>{ value, done }</code>，它就能被 <code>for...of</code> 消费；<code>done</code> 为 <code>true</code> 表示结束。别忘了，<code>for...of</code>、展开语法、解构都依赖这套协议——消费方只认「能不能 next」，不认你背后是数组还是别的。
    </p>
    <p>
      <strong>第二层，生成器。</strong>手写迭代器要自己维护索引和 <code>done</code> 状态，很容易写错。<code>function*</code> 声明的生成器函数，函数体里写 <code>yield</code>：<code>yield</code> 处暂停执行、把值交出去，下一次 <code>next()</code> 从暂停处接着跑。要注意，调用生成器函数时函数体不会立即执行，<strong>只有第一次 <code>next()</code> 才运行到第一个 <code>yield</code></strong>。生成器天然实现了迭代协议，可以直接交给 <code>for...of</code>。
    </p>
    <p>
      <strong>第三层，双向通信。</strong><code>next(value)</code> 传进去的参数，会成为上一个 <code>yield</code> 表达式的返回值，于是调用方和生成器能一来一往地通信——生成器不只是数据源，也能接收外部指令。
    </p>
    <p>
      <strong>第四层，委托。</strong><code>yield*</code> 把当前生成器的产出委托给另一个可迭代对象，逐个转发它的值，省去手写内层循环。
    </p>
    <p>
      最后是<strong>终止语义</strong>：生成器一旦 <code>return</code> 或抛出异常，后续 <code>next()</code> 都得到 <code>done: true</code>，也无法再恢复。
    </p>
    <p>
      这套设计真正妙的地方在于：它把「逐个取值」和「何时结束」拆开来定义。迭代器只负责回答「下一个是什么、还有没有下一个」，至于数据是提前算好的、即时算出的、还是永远算不完的，它一概不关心。正因为如此，惰性序列和自定义数据结构才能共用同一套消费方式——消费方只认协议，不认来源。
    </p>
    <table>
      <thead>
        <tr><th>想做的事</th><th>对应写法</th></tr>
      </thead>
      <tbody>
        <tr><td>让自定义对象能被 <code>for...of</code> 消费</td><td>实现 <code>[Symbol.iterator]</code>，返回带 <code>next()</code> 的迭代器</td></tr>
        <tr><td>惰性地逐个产出</td><td><code>function*</code> 配合 <code>yield</code></td></tr>
        <tr><td>向生成器回传数据</td><td><code>next(value)</code> 成为上一个 <code>yield</code> 的结果</td></tr>
        <tr><td>转发另一个可迭代对象</td><td><code>yield*</code></td></tr>
        <tr><td>结束迭代</td><td><code>return</code> 或抛出异常，此后 <code>done</code> 恒为 <code>true</code></td></tr>
      </tbody>
    </table>

    <h2>按需拉取下一课</h2>
    <figure class="lesson-figure">
      <figcaption>点「下一课」看看生成器如何被按需拉取，注意它不会提前把整份列表算出来。</figcaption>
      <J12IteratorsGenerators />
    </figure>

    <h2>生成器惰性求值</h2>
    <p>
      迭代协议把「怎么取值、什么时候结束」从具体数据结构里抽了出来，生成器则是实现这套协议最顺手的写法。于是消费方不必认识数据来源，惰性序列和无限序列都变得可表达。
    </p>
    <div class="lesson-term">
      <span class="term-name">「迭代协议」</span>指对象通过 <code>[Symbol.iterator]</code> 提供迭代器、迭代器的 <code>next()</code> 返回 <code>{ value, done }</code> 的一套约定；<code>for...of</code>、展开与解构都建立在它之上。生成器函数（<code>function*</code>）用 <code>yield</code> 暂停与恢复执行，<code>next(value)</code> 可回传数据，<code>yield*</code> 委托其它可迭代对象；一旦 <code>return</code> 或抛错，后续 <code>next()</code> 恒为 <code>done: true</code>。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
