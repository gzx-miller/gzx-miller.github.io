<script setup lang="ts">
import CPP18IteratorsAlgorithms from './CPP18IteratorsAlgorithms.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>如果每个容器都得自己实现一遍 <code>sort</code>、<code>find</code>，代码会重复到失控。能不能让「算法」根本不认识「容器」，却依然能对它们操作？
    </div>

    <h2>朴素做法：给每个容器各写一遍算法</h2>
    <p>
      直觉方案是「谁需要谁实现」：数组写一份遍历找最大值，链表再写一份，动态数组再写一份。它「做对了」——逻辑直白，每份都对各自的存储结构量身定制。
    </p>
    <p>
      但算法本身（比如「找第一个大于 x 的元素」）与数据放在数组还是链表里毫无关系。为每种容器各抄一遍，既让逻辑分散、容易改漏，也几乎无法测试和维护。<strong>算法和数据结构被绑死在一起</strong>，是这套做法最大的问题。
    </p>

    <h2>迭代器：算法与容器之间的桥</h2>
    <p>
      STL 的解法是引入<strong>迭代器</strong>：一种「像指针一样」访问元素的对象。算法不接收容器，而是接收<strong>两个迭代器</strong>表示的范围：
    </p>
    <ul>
      <li>区间写成 <code>[first, last)</code>，即<strong>前闭后开</strong>——包含 <code>first</code>，不包含 <code>last</code>。</li>
      <li><code>begin()</code> 指向第一个元素，<code>end()</code> 指向「尾后」位置（最后一个元素的下一个）。</li>
      <li><code>find(v.begin(), v.end(), x)</code>：算法只依赖迭代器的操作，压根不知道 <code>v</code> 是什么容器。</li>
    </ul>
    <p>
      这样一来，同一份算法实现能作用在数组、<code>vector</code>、<code>list</code> 上——泛型编程在这里展现得最充分。
    </p>

    <h2>迭代器分类：算法对能力有要求</h2>
    <p>
      迭代器不是同一种东西，按能提供的操作分成五类，能力由弱到强：
    </p>
    <ul>
      <li>输入迭代器：只读、单向；输出迭代器：只写、单向。</li>
      <li>前向迭代器：可读写、只能前进（<code>forward_list</code>）。</li>
      <li>双向迭代器：可读写、能前进也能后退（<code>list</code>、<code>map</code>、<code>set</code>）。</li>
      <li>随机访问迭代器：还能任意步跳转、做加减比较（<code>vector</code>、<code>deque</code>、<code>array</code>）。</li>
    </ul>
    <p>
      算法要求的类别必须被满足：只读算法（<code>find</code>、<code>count</code>、<code>accumulate</code>）只要有输入迭代器；但 <code>std::sort</code> 要求随机访问迭代器，所以 <code>list</code> <strong>不能</strong>用它——应改用 <code>list</code> 自带的成员函数 <code>sort()</code>。
    </p>

    <h2>常用算法、numeric 头文件与 lambda 谓词</h2>
    <p>
      常用算法分成两拨：
    </p>
    <ul>
      <li><code>&lt;algorithm&gt;</code>：<code>find</code>（查找）、<code>count</code>（计数）、<code>sort</code>（排序，不保证稳定）、<code>stable_sort</code>（稳定排序）、<code>transform</code>（变换）、<code>copy</code>、<code>replace</code>、<code>unique</code>。</li>
      <li><code>&lt;numeric&gt;</code>：<code>accumulate</code>（累加）、<code>inner_product</code> 等数值算法。</li>
    </ul>
    <p>
      用 <code>accumulate</code> 有个细节：<strong>初值决定累加器的类型</strong>。<code>accumulate(begin, end, 0)</code> 用 <code>int</code> 累加，若元素是浮点数，小数部分会被截断；想得到浮点结果，初值要写成 <code>0.0</code>。
    </p>
    <p>
      很多算法允许传一个<strong>谓词</strong>——返回 <code>bool</code> 的可调用对象，用来描述「什么算符合条件的元素」。lambda 让谓词可以就地写：<code>std::sort(v.begin(), v.end(), [](int a, int b) { return a &gt; b; })</code> 就是一次降序排序，比较规则直接写在调用点，不必另开一个命名函数。
    </p>

    <h2>remove-erase 惯用法与迭代器失效</h2>
    <p>
      有个必须记住的惯用法：<code>std::remove</code> <strong>并不真的删除元素</strong>，它只是把要保留的元素往前搬、返回新的逻辑终点，容器长度并未改变。真正删除要配合容器的 <code>erase</code>：<code>v.erase(std::remove(v.begin(), v.end(), x), v.end())</code>，这就是 <strong>remove-erase 惯用法</strong>。
    </p>
    <p>
      算法<strong>从不检查</strong>迭代器是否有效、区间是否合理，传错了就是未定义行为。尤其在算法执行过程中改动同一个容器（例如边遍历边 <code>push_back</code>），会让迭代器立刻失效。边界要由调用者守住。
    </p>

    <h2>看一遍迭代器与算法</h2>
    <figure class="lesson-figure">
      <figcaption>对照 demo 中 <code>find</code>、<code>count</code>、<code>sort</code>、<code>accumulate</code> 与 <code>transform</code> 对同一个 <code>vector</code> 的操作，观察算法如何只靠 <code>begin()/end()</code> 区间工作。</figcaption>
      <CPP18IteratorsAlgorithms />
    </figure>

    <h2>算法不碰容器，只碰区间</h2>
    <p>
      迭代器与算法的分工可以浓缩成一句：<strong>容器负责存储，迭代器负责描述范围，算法只在这段范围上工作</strong>。正因为如此，算法被写一次就能服务所有容器。理解了这一分工，也就能理解为什么 <code>sort</code> 挑迭代器类别、为什么 <code>remove</code> 要配合 <code>erase</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「迭代器」</span>是像指针一样访问容器元素的对象，<span class="term-name">「区间」</span>用 <code>begin()</code>/<code>end()</code> 表示前闭后开的 <code>[first, last)</code>；<span class="term-name">「谓词」</span>是返回 <code>bool</code> 的可调用对象，常以 lambda 形式就地书写。<span class="term-name">「remove-erase 惯用法」</span>指先由 <code>std::remove</code> 搬移、再由容器 <code>erase</code> 收缩长度，才真正删除元素。
    </div>
  </LessonArticle>
</template>
