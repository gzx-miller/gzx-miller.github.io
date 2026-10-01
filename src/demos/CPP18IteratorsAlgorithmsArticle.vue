<script setup lang="ts">
import CPP18IteratorsAlgorithms from './CPP18IteratorsAlgorithms.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想把 <code>vector</code> 里所有的 <code>0</code> 删掉，翻手册时看到一个名字正合适的函数，于是写下 <code>std::remove(v.begin(), v.end(), 0);</code>。运行后一检查，<code>v.size()</code> 一点没变，那个 <code>0</code> 还稳稳躺在里面——一个名字就叫「删除」的函数，为什么什么都没删掉？
    </div>

    <h2>提出问题</h2>
    <p>
      你要对一串元素做最普通的事：找出某个值、统计它出现几次、求和、排序、把每个元素翻倍。最笨的办法是每种容器、每种类型都手写一遍循环。它能跑，但代价都压在你身上：
    </p>
    <ul>
      <li>同一套「查找」逻辑，在 <code>vector</code> 上写一遍、在数组上再写一遍、在链表上还得写一遍，重复得毫无意义。</li>
      <li>容器种类 × 操作种类的组合会爆炸式增长，每一份循环都是一次独立的手工维护。</li>
      <li>手写循环最容易在边界上出错：少走一个、多走一个、越界一个，都是难以察觉的 bug。</li>
      <li>循环体里塞满业务逻辑，一眼看不出「这段代码到底在干什么」。</li>
    </ul>
    <p>
      所以要问的是：<strong>能不能把「算法」从「数据存在哪里」里剥出来，让同一份查找、排序、变换，对任何容器都成立？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      答案是 STL 的算法加上<strong>迭代器</strong>：<code>std::find(nums.begin(), nums.end(), 8)</code>、<code>std::count(...)</code>、<code>std::sort(...)</code>——你不再写循环，而是把「一段范围」交给算法。
    </p>
    <p>
      这个方案做对了一件最根本的事：<strong>算法把数据看成一段由迭代器标出的区间，而不是某个具体容器</strong>。迭代器可以理解成「一个指向元素的位置，而且会自己往前走」。容器负责给出 <code>begin()</code> 和 <code>end()</code>，算法只管在这两点之间干活。容器和算法就此解耦——这就是泛型编程的骨架。
    </p>
    <p>
      这里要先立下一条全区通用的约定：范围统一写成 <code>[first, last)</code>，<strong>前闭后开</strong>——<code>last</code> 指向「最后一个元素的下一个位置」，而不是最后一个元素本身。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>不同算法的「门槛」不一样：<code>std::sort</code> 要求随机访问迭代器，把它用在 <code>list</code> 上<strong>直接编译失败</strong>，而不是运行时报错，让人一时摸不着头脑。</li>
      <li><code>std::accumulate</code> 并不在 <code>&lt;algorithm&gt;</code> 里，而在 <code>&lt;numeric&gt;</code> 里，写漏头文件就找不到它。</li>
      <li>算法<strong>不检查迭代器是否有效、不检查范围是否合理</strong>，你传进去一个越界或颠倒的区间，得到的是未定义行为，不是一句友好的报错。</li>
      <li><code>std::remove</code> 名字叫删除，却根本不动容器的大小——就像开场那样，你以为什么都没发生。</li>
      <li>想把变换的结果放进另一个容器，如果那个容器是空的、还按老办法直接写进去，立刻就写越界。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先把「半开区间」这个约定的好处想清楚，它是后面一切的地基。<code>last</code> 取「最后一个元素的下一个位置」，于是：<code>last - first</code> 恰好就是元素个数；空的区间自然表示成 <code>first == last</code>；循环写成 <code>for (it = first; it != last; ++it)</code> 正好一遍不多一遍不少。<strong>用等号做终止条件，而不是小于等于</strong>，边界就再也不用手工 +1/-1 去凑。
    </p>
    <p>
      接着补上「迭代器分等级」这件事——它解释了为什么同一个算法有时能用、有时不能用。迭代器的能力从弱到强有五级：
    </p>
    <ol class="lesson-steps">
      <li><strong>输入迭代器</strong>：只读、只能向前走一次。</li>
      <li><strong>输出迭代器</strong>：只写、只能向前走一次。</li>
      <li><strong>前向迭代器</strong>：可读可写、只能单向走，但能反复遍历。</li>
      <li><strong>双向迭代器</strong>：可读可写、能前进也能后退（<code>list</code>、<code>map</code>）。</li>
      <li><strong>随机访问迭代器</strong>：可读可写、能任意跳转、能做下标和减法（<code>vector</code>、<code>deque</code>）。</li>
    </ol>
    <p>
      算法按自己<strong>需要的<u>最低</u>等级</strong>来分组：只读算法（<code>find</code>、<code>count</code>、<code>accumulate</code>、<code>all_of</code>/<code>any_of</code>/<code>none_of</code>）只要输入迭代器；写算法（<code>copy</code>、<code>transform</code>、<code>fill</code>、<code>replace</code>）要前向迭代器；而<strong>排序算法要随机访问迭代器</strong>。所以 <code>std::sort</code> 用在 <code>list</code> 上根本编译不过——这不是 bug，是设计：链表给不出随机访问，就得改用链表自带的 <code>list::sort</code>。
    </p>
    <p>
      现在可以正面解开开场那个谜了：<strong><code>std::remove</code> 是「重排」，不是「删除」</strong>。它把不匹配的元素依次向前挪、盖住要删的位置，最后返回一个<strong>新的逻辑终点</strong>，指向「保留下来的那段」的末尾。从新终点到原来的 <code>end()</code> 之间的内容，值已经不确定了，但容器的 <code>size()</code> 没变——算法只认迭代器，它压根不知道容器有多长，也就无权把容器变小。
    </p>
    <p>
      要真正删掉，必须让<strong>容器自己</strong>出手：用容器的 <code>erase</code> 把那截尾巴抹掉。这就拼成了 <strong>remove-erase 惯用法</strong>：
    </p>
    <p>
      <code>v.erase(std::remove(v.begin(), v.end(), val), v.end());</code>——先把要留的挪到前面、拿到新终点，再由 <code>erase</code> 从新终点一直删到真正的末尾。记住：<code>remove</code> 之后、<code>erase</code> 之前，那段尾巴里的元素是「有效但值未指定」的，别去读它。
    </p>
    <p>
      再补「结果该往哪儿放」。当目标容器还没准备好大小时，用<strong>插入迭代器适配器</strong>：<code>back_inserter(c)</code> 让每次写入都变成一次 <code>push_back</code>，<code>front_inserter(c)</code> 变成 <code>push_front</code>，<code>inserter(c, it)</code> 则插到指定位置。于是可以放心地把算法结果直接「灌」进空容器，不用预分配、也就不会越界。另外像 <code>unique</code> 这种去重，只合并<strong>相邻</strong>的重复元素，所以要先排序再去重，否则隔开的重复项它根本看不见。
    </p>
    <p>
      最后是两个稍新的补充。C++20 的 <strong>ranges</strong> 让你直接对容器调用 <code>ranges::sort(vec)</code>，不必再写 <code>begin()</code>/<code>end()</code>，还能挂上「投影」只按元素里的某个字段比较，甚至用管道把多个操作串起来、惰性求值。C++17 还给了<strong>并行版本</strong>：在 <code>&lt;execution&gt;</code> 里指定执行策略 <code>execution::par</code>，就能让 <code>sort</code> 之类的算法吃满多核，例如 <code>std::sort(std::execution::par, v.begin(), v.end())</code>。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>对着代码和两张要点表看：<code>find</code> 为什么返回的是迭代器而不是下标、<code>accumulate</code> 为什么在 <code>&lt;numeric&gt;</code> 里、<code>transform</code> 的结果怎么写进另一个容器；再回头对照「算法需要哪一级迭代器」，就能明白 <code>sort</code> 为什么挑容器。</figcaption>
      <CPP18IteratorsAlgorithms />
    </figure>

    <h2>总结</h2>
    <p>
      STL 算法与容器之间，靠迭代器这条「桥」解耦：算法只认一段 <code>[first, last)</code> 区间，并对区间的<strong>迭代器等级</strong>有硬要求，这正是同一个算法能配 <code>vector</code> 却配不了 <code>list</code> 的原因。日常最该记牢的两件事是：范围一律前闭后开；名字叫 <code>remove</code> 的它不删，要配 <code>erase</code> 才真的删。
    </p>
    <div class="lesson-term">
      <span class="term-name">「remove-erase 惯用法」</span>指用两步完成「删除满足条件的元素」：<code>std::remove</code> 只做重排——把要保留的元素前移、返回新的逻辑终点，<strong>并不改变容器大小</strong>；随后必须用容器的成员 <code>erase</code> 把从新终点到末尾的那截真正抹掉，写作 <code>v.erase(std::remove(v.begin(), v.end(), val), v.end())</code>。边界：算法无法改变容器大小（它只见迭代器、不见容器），所以删除永远得由容器自己完成；而 <code>remove</code> 之后、<code>erase</code> 之前，区间 <code>[新终点, end)</code> 内的元素值已未指定，读取它们是未定义行为。
    </div>
  </LessonArticle>
</template>
