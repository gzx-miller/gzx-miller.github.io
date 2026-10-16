<script setup lang="ts">
import PY05ListsTuples from './PY05ListsTuples.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用 <code>grid = [[0] * 3] * 3</code> 建了一个 3×3 的表格，只想改左上角那个格子：<code>grid[0][0] = 1</code>。可运行后整列都变成了 <code>1</code>。明明只动了一格，为什么三行一起变了？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      列表是最通用的容器：<code>nums = [3, 1, 4]</code> 一行建起来，<code>nums.append(1)</code> 就能往里加，<code>nums[0]</code> 取第一个，<code>nums[1:3]</code> 取一段。它可变、有序、能放任意类型，日常几乎无处不在。
    </p>
    <p>
      正因为太顺手，几处陷阱也最容易被绕过：<code>sort()</code> 和 <code>sorted()</code> 到底动的是原列表还是新列表？切片赋值和普通赋值差在哪？还有那句经典的 <code>[[0] * 3] * 3</code>，为什么会牵一发而动全身？这些都要从「可变」这条性质讲起。
    </p>

    <h2>索引、切片与切片赋值</h2>
    <p>
      索引与切片的规则和字符串一致：从 <code>0</code> 开始，负索引从末尾数；<code>lst[start:stop:step]</code> 不含 <code>stop</code>，负步长可以反转。列表比字符串多出一项能力——<strong>切片赋值</strong>：<code>lst[1:3] = [9, 9]</code> 会<strong>就地替换</strong>那一段，替换的段长度甚至可以和原来不同，这是字符串做不到的。
    </p>
    <p>
      要注意 <code>lst[:]</code> 这种整体切片产生的是一个<strong>浅拷贝</strong>的新列表，而不是共享同一个对象；但浅拷贝只复制最外层，里面若还有嵌套的可变对象，仍旧是共享的。
    </p>

    <h2>常用方法：增删改查</h2>
    <ul>
      <li>增：<code>append(x)</code> 在尾部加一个元素；<code>extend(seq)</code> 把另一序列的元素逐个并入；<code>insert(i, x)</code> 在指定位置插入。</li>
      <li>删：<code>remove(x)</code> 删除第一个等于 <code>x</code> 的元素（不存在会抛 <code>ValueError</code>）；<code>pop(i)</code> 按下标弹出并返回（默认末位，空列表会抛 <code>IndexError</code>）。</li>
      <li>改：按下标赋值 <code>lst[i] = x</code>，或切片赋值。</li>
      <li>查：<code>in</code> 判断成员，<code>index(x)</code> 找位置，<code>count(x)</code> 计数。</li>
    </ul>

    <h2>排序：sort 与 sorted，以及 key</h2>
    <p>两个容易混的排序入口：</p>
    <ul>
      <li><code>lst.sort()</code> <strong>就地</strong>排序，返回 <code>None</code>——所以不要写 <code>lst = lst.sort()</code>，那会把列表变成 <code>None</code>。</li>
      <li><code>sorted(lst)</code> 返回<strong>新的</strong>已排序列表，原列表不动。</li>
    </ul>
    <p>
      要按自定义规则排，用 <code>key</code>：<code>sorted(items, key=len)</code> 按长度排，<code>sorted(rows, key=lambda r: r["age"])</code> 按字段排。Python 的排序还是<strong>稳定</strong>的——键相等的元素保持原有的相对顺序，这让「先按 A 排、再按 B 排」这类多级排序可以分步完成。
    </p>

    <h2>元组：不可变与解包</h2>
    <p>
      元组 <code>t = (1, 2)</code> 和列表长得像，但它是<strong>不可变</strong>的：不能改元素、不能增删，写 <code>t[0] = 9</code> 会直接抛 <code>TypeError</code>。正因为不可变，元组可以当字典键、能放进集合，也更适合表示「一组固定、不该被改的数据」，比如坐标点、函数的多个返回值。
    </p>
    <p>
      它最实用的一点是<strong>解包</strong>：<code>x, y = point</code> 一次取出多个值，<code>a, b = b, a</code> 直接完成交换。函数「返回多个值」的本质，就是返回一个元组再被解包。
    </p>

    <h2>共享引用与可变默认参数陷阱</h2>
    <p>列表可变的代价，是「共享」会悄悄发生：</p>
    <ul>
      <li><code>[[0] * 3] * 3</code> 里，外层三个子列表其实是<strong>同一个对象</strong>的三份引用。改其中一行的元素，三行会一起变；要各行独立，得用推导式 <code>[[0] * 3 for _ in range(3)]</code> 让每次都新建一个内层列表。</li>
      <li>函数默认参数 <code>def f(x, box=[])</code> 里的 <code>[]</code> <strong>只在定义时创建一次</strong>，被之后所有调用共享。第二次调用会看到第一次留下的元素。正确写法是把默认值设为 <code>None</code>，在函数体内再按需创建。</li>
    </ul>
    <p>
      这两处陷阱同一个根源：可变对象被多个名字（或多个默认值位置）共享时，一处的就地修改会体现在所有引用者身上。需要独立副本时，用推导式或 <code>None</code> 兜底新建，别指望一次赋值就切断共享。
    </p>

    <div class="lesson-box warn">
      <strong>常见误区：</strong>把 <code>lst.sort()</code> 的返回值当成排序后的列表；以及用 <code>[[]] * n</code> 建二维结构。前者会得到 <code>None</code>，后者会让所有行共享同一份数据。凡是「就地修改」的方法（append、sort、reverse），返回值都是 <code>None</code>。
    </div>

    <h2>看一遍列表的行为</h2>
    <figure class="lesson-figure">
      <figcaption>点 <code>append</code> / <code>insert</code> / <code>pop</code> / <code>remove</code> / <code>sort</code> / <code>reverse</code> 看列表内容与长度如何就地变化，再对照下方切片表达式的结果，最后读一读元组不可变的提示。</figcaption>
      <PY05ListsTuples />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      列表是可变、有序的序列，支持索引、切片和就地修改；排序分清 <code>sort</code>（就地、返回 <code>None</code>）与 <code>sorted</code>（新建），复杂规则交给 <code>key</code>；元组不可变、可哈希、能解包，适合固定结构。最贵的一课来自共享引用：<code>[[0] * 3] * 3</code> 与可变默认参数都会让看似独立的数据悄悄共享同一个对象，需要独立副本时用推导式或 <code>None</code> 兜底。
    </p>
    <div class="lesson-term">
      <span class="term-name">「浅拷贝」</span>指只复制最外层容器、内部元素仍与原对象共享的那层复制，<code>[[0] * 3] * 3</code> 的连锁修改正源于此。边界与例外：切片 <code>lst[:]</code> 与 <code>copy()</code> 都是浅拷贝，嵌套层仍共享；要连内部一起独立，需用 <code>copy.deepcopy()</code>。
    </div>
  </LessonArticle>
</template>
