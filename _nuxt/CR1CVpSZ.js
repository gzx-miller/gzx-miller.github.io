const o=`<script setup lang="ts">
import PY07Comprehensions from './PY07Comprehensions.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>写下一个生成器 <code>gen = (x * x for x in range(5))</code>，先 <code>next(gen)</code> 取了一个值，再用 <code>list(gen)</code> 转成列表——本以为会拿到五个数，结果只剩四个。前面那个值去哪了？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      「把列表里每个元素平方」「只保留偶数」这类需求，最直接的写法是先建一个空列表，再用 <code>for</code> 逐项 <code>append</code>：<code>result = []</code>、<code>for</code>、<code>if</code>、<code>append</code>，四行起步。它清晰，但样板代码占了一大半。
    </p>
    <p>
      推导式（comprehension）把这套模板压缩成一行 <code>[x * x for x in data if x % 2 == 0]</code>，语义不变、代码更短。但短不等于总是好——什么时候该用、什么时候该退回循环，是这一章要划清的边界。
    </p>

    <h2>列表推导式与条件过滤</h2>
    <p>
      列表推导式的基本骨架是 <code>[表达式 for 变量 in 可迭代对象]</code>：对每个元素计算 <code>表达式</code>，收集成一个新列表。在末尾加 <code>if</code> 就是过滤：<code>[x for x in data if x % 2 == 0]</code> 只保留偶数。
    </p>
    <p>
      它适合「输入序列、输出序列」的转换；但要注意它<strong>总是新建列表</strong>，不像 <code>sort()</code> 那样就地修改。在需要保留原序列时，这正是想要的行为。
    </p>

    <h2>嵌套推导</h2>
    <p>
      推导式里可以放两层 <code>for</code>，书写顺序和嵌套循环一致，从<strong>左到右、外层到内层</strong>：<code>[(x, y) for x in range(2) for y in range(2)]</code> 生成坐标的笛卡尔积。
    </p>
    <p>
      但两层以上时，一行会迅速变难读。判断标准是「一眼能不能看懂」：若需要停顿拆解，回退到显式循环往往更清楚。
    </p>

    <h2>字典推导与集合推导</h2>
    <p>把外面的方括号换掉，就得到另外两种容器：</p>
    <ul>
      <li>字典推导式用 <code>{键表达式: 值表达式 for ...}</code>：<code>{w: len(w) for w in words}</code> 生成「单词到长度」的映射。</li>
      <li>集合推导式用 <code>{表达式 for ...}</code>：<code>{x % 3 for x in range(6)}</code> 自动去重。</li>
    </ul>
    <p>
      注意 <code>{}</code> 里只有一个表达式就是集合，写成 <code>键: 值</code> 才是字典。空集合要写 <code>set()</code>，<code>{}</code> 是空字典。
    </p>

    <h2>生成器表达式：惰性求值</h2>
    <p>
      把方括号换成圆括号，得到的不是容器，而是<strong>生成器表达式</strong>：<code>(x * x for x in data)</code>。它不立刻算出全部结果，而是每调用一次 <code>next()</code> 才算一个——用到才计算，这叫<strong>惰性求值</strong>。
    </p>
    <p>
      好处是省内存，适合流式处理大序列；代价是它<strong>只能遍历一次</strong>，走过就没了，也不能用下标或 <code>len()</code>。需要反复使用或随机访问时，应先 <code>list()</code> 把它物化成列表。开头那个「少了一个值」的疑问，答案就在这里：已 <code>next</code> 取走的元素不会再出现。
    </p>

    <h2>可读性边界与迭代协议</h2>
    <p>
      推导式不是越长越好。当它塞进多个条件、多层嵌套，或要产生副作用时，可读性会断崖式下降，这时应果断退回普通 <code>for</code> 循环。一条经验线：一行读下来若需要停顿才能看懂，就别用推导式。
    </p>
    <p>
      更底层地看，<code>for</code> 之所以能遍历各种对象，是因为<strong>迭代协议</strong>：对象实现 <code>__iter__</code> 返回一个迭代器，迭代器实现 <code>__next__</code> 逐个给出元素，耗尽后抛 <code>StopIteration</code>。你也可以手动走这套协议：<code>it = iter(seq)</code>，再反复 <code>next(it)</code>。推导式、生成器、<code>for</code>，全都建立在这套协议之上。
    </p>

    <div class="lesson-box warn">
      <strong>常见误区：</strong>把生成器表达式当列表反复使用（第二次遍历会得到空结果）；或在推导式里做复杂的副作用。前者应先用 <code>list()</code> 物化，后者该改用普通循环。
    </div>

    <h2>看一遍推导式的写法</h2>
    <figure class="lesson-figure">
      <figcaption>切换「列表 / 字典 / 集合 / 生成器」四类写法，对照左侧的 for 循环版与右侧的推导式版；切到「生成器表达式」时，反复点 <code>next()</code> 看它如何逐个、惰性地产出值。</figcaption>
      <PY07Comprehensions />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      推导式是「输入序列、输出序列」转换的紧凑写法：列表、字典、集合各有自己的括号形态，末尾加 <code>if</code> 做过滤，多层 <code>for</code> 表达嵌套。生成器表达式改用圆括号，惰性求值、省内存，但只能遍历一次。逻辑变复杂或需要副作用时，普通 <code>for</code> 循环更清楚。它们能工作，靠的都是同一套迭代协议：<code>__iter__</code> 给出迭代器，<code>__next__</code> 逐个产出、耗尽时抛 <code>StopIteration</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「迭代协议」</span>指对象实现 <code>__iter__</code> 返回迭代器、迭代器实现 <code>__next__</code> 逐个产出元素并在耗尽时抛 <code>StopIteration</code> 的约定，<code>for</code>、推导式与生成器都建立在它之上。边界与例外：生成器是「一次性」迭代器，遍历完即耗尽；而列表这类可迭代对象每次 <code>iter()</code> 都能得到全新的迭代器，因而可以反复遍历。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
