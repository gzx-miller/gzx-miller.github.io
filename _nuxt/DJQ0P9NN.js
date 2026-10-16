const e=`<script setup lang="ts">
import PY04ControlFlow from './PY04ControlFlow.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>写下 <code>for i in range(1, 5)</code>，本想让 <code>i</code> 走到 <code>5</code>，结果最后一轮是 <code>4</code>。更奇怪的是，循环末尾还能再挂一个 <code>else</code>——循环都结束了，这个 <code>else</code> 到底在等什么？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      给分数分等级、把一批数据逐个累加，这类逻辑在任何语言里都是入门第一课。<code>if score &gt;= 90:</code> 后面跟一段缩进的块，Python 用缩进代替花括号，读起来干净利落。
    </p>
    <p>
      也正是这种随手可写，让几处边界容易被忽略：空列表 <code>[]</code> 为什么等价于 <code>False</code>？<code>range(1, 5)</code> 为什么停在 <code>4</code>？循环后面那个 <code>else</code> 又是什么？把这些讲清楚，条件与循环才算真正掌握。
    </p>

    <h2>if / elif / else 与真值判断</h2>
    <p>条件判断自上而下依次测试，命中第一个为真的分支后，后面的分支全部跳过。代码块用缩进界定（通常 4 个空格），<code>elif</code> 是「否则如果」，只会在前面都不成立时被检查，<code>else</code> 兜底。</p>
    <p>Python 里的条件不要求是 <code>bool</code>，任何对象都会被转成真假来判：</p>
    <ul>
      <li>假值：<code>False</code>、<code>None</code>、<code>0</code>、<code>0.0</code>、<code>''</code>，以及空容器 <code>[]</code>、<code>()</code>、<code>{}</code>、<code>set()</code>。</li>
      <li>真值：其余一切，包括含元素的 <code>[0]</code> 和非空字符串 <code>'0'</code>。</li>
    </ul>
    <p>
      所以判断「列表非空」直接写 <code>if items:</code> 就够，不必写 <code>if len(items) &gt; 0</code>。反过来，把 <code>0</code>、<code>''</code> 当成有效数据时要格外小心，因为它们会被判成假。
    </p>

    <h2>while 循环</h2>
    <p><code>while</code> 只要条件为真就反复执行循环体，适合「次数不确定、由状态决定」的场景。两个要点：</p>
    <ul>
      <li>每轮开始前检查条件；条件一开始就为假，循环体一次都不执行。</li>
      <li>循环体内必须有<strong>能让条件最终变假</strong>的操作（比如递减计数器），否则就是死循环。</li>
    </ul>
    <p>
      Python 没有 <code>do...while</code>；需要「至少执行一次」时，可以用 <code>while True:</code> 加内部 <code>break</code> 退出。
    </p>

    <h2>for 遍历可迭代对象与 range</h2>
    <p>
      <code>for</code> 不是「按计数器循环」，而是<strong>遍历可迭代对象</strong>：列表、字符串、字典、<code>range</code>、文件……凡是能产出元素序列的都能 <code>for</code>。要按次数循环，就用 <code>range</code> 生成数列：
    </p>
    <ul>
      <li><code>range(stop)</code>：从 <code>0</code> 到 <code>stop-1</code>。</li>
      <li><code>range(start, stop)</code>：从 <code>start</code> 到 <code>stop-1</code>，<strong>不含 stop</strong>。</li>
      <li><code>range(start, stop, step)</code>：按步长走，<code>step</code> 可以为负。</li>
    </ul>
    <p>「不含 stop」是最常见的入门陷阱：<code>range(1, 5)</code> 得到 <code>1, 2, 3, 4</code>，想要 <code>5</code> 得写 <code>range(1, 6)</code>。</p>

    <h2>break / continue 与循环的 else 子句</h2>
    <p>两个循环控制语句：</p>
    <ul>
      <li><code>break</code> 立即结束整个循环；<code>continue</code> 跳过本轮剩余部分，进入下一轮。</li>
      <li>循环可以带 <code>else</code> 子句：<strong>当循环正常跑完（没有被 break 打断）时</strong>执行 <code>else</code> 块。它是「没找到就……」「没被打断就……」这类逻辑的优雅写法。</li>
    </ul>
    <p>
      容易误解的一点：<code>else</code> 与循环条件是否成立无关，只与「有没有被 break」有关。哪怕循环体一次都没执行，只要没触发 break，<code>else</code> 也会照常执行。
    </p>

    <h2>enumerate 与 zip</h2>
    <p>两个常和 <code>for</code> 搭配的内置函数，省掉手动维护下标：</p>
    <ul>
      <li><code>enumerate(seq)</code> 同时给出<strong>下标和元素</strong>：<code>for i, x in enumerate(items):</code>，还能指定起点 <code>enumerate(items, start=1)</code>。</li>
      <li><code>zip(a, b)</code> 把多个序列<strong>按位置配对</strong>：<code>for name, age in zip(names, ages):</code>，配对数量取其中最短的那个。</li>
    </ul>

    <div class="lesson-box warn">
      <strong>常见误区：</strong>把 <code>range(stop)</code> 当成包含 <code>stop</code>；或在 <code>while</code> 里忘了更新那个决定条件的变量，导致条件永远为真。遍历时若只想按位置取数，先想清楚需要的到底是「次数」还是「元素」，能省掉不少 off-by-one 的麻烦。
    </div>

    <h2>看一遍条件与循环的行为</h2>
    <figure class="lesson-figure">
      <figcaption>改一改分数看 <code>if / elif / else</code> 命中哪个分支；再用下方的循环面板「单步执行」或「一次跑完」，观察累加的每一轮状态与最终结果。</figcaption>
      <PY04ControlFlow />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      条件与循环的边界都藏在细节里：分支自上而下命中即止，条件是任意对象的真值而非必须是 <code>bool</code>；<code>for</code> 遍历的是可迭代对象，<code>range</code> 不含 <code>stop</code>；<code>while</code> 需要自己在循环体里让条件趋于为假；只有 <code>break</code> 才算「打断」循环，循环的 <code>else</code> 只在没被 break 时执行；<code>enumerate</code> 与 <code>zip</code> 让带下标、成对遍历不必手写索引。
    </p>
    <div class="lesson-term">
      <span class="term-name">「真值判断」</span>指任何对象都能在布尔上下文里被当作真或假：假值包括 <code>False</code>、<code>None</code>、<code>0</code>、<code>0.0</code>、空字符串和空容器，其余为真。边界与例外：<code>[0]</code>、<code>'0'</code> 这类「非空但看着像零」的对象仍是真值；循环的 <code>else</code> 只与是否被 <code>break</code> 有关，与条件真假无关。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
